import { useEffect, useMemo, useState } from "react";
import { useRoute, Link, useLocation } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AuthNavbar } from "@/components/auth-navbar";

type CourseDetail = {
  course_id?: string | number;
  course_title?: string;
  modules?: any; // can be number or array
  description?: string | Record<string, any>;
  content?: any;
  [key: string]: any;
};

export default function CoursePage() {
  const [match, params] = useRoute("/course/:id");
  const courseId = params?.id;
  const AVI_BASE = (import.meta.env.VITE_AVI_URL as string | undefined) || "";
  const [, navigate] = useLocation();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [course, setCourse] = useState<CourseDetail | null>(null);
  const [role, setRole] = useState<string | null>(null);
  const [lastQuizId, setLastQuizId] = useState<string | null>(null);

  // UI state
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeView, setActiveView] = useState<any>(null); // holds currently rendered object (course / module / subtopic)

  // Fetch course & session
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        // Verify session
        const authRes = await fetch("/api/session", { credentials: "include" });
        const authData = await authRes.json();
        if (!authRes.ok || !authData?.authenticated) {
          window.location.href = "/post-auth";
          return;
        }
        // Capture role for role-based UI
        const userRole = String(authData?.user?.role || "").toLowerCase() || null;
        if (!cancelled) setRole(userRole);

        if (!courseId) throw new Error("Invalid course id");
        const apiBase = import.meta.env.VITE_API_BASE;
        if (!apiBase) throw new Error("Missing VITE_API_BASE in environment");

        const res = await fetch(`${apiBase}/api/course/${encodeURIComponent(courseId)}`);
        const data = await res.json();
        if (!res.ok) throw new Error(data?.error || "Failed to load course");

        if (!cancelled) {
          setCourse(data);
          setActiveView(data); // default view: full course overview
        }
      } catch (e: any) {
        if (!cancelled) setError(e?.message || "Failed to load course");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [courseId]);

  // Load last quiz id for this course from localStorage
  useEffect(() => {
    try {
      if (!courseId) return;
      const stored = localStorage.getItem(`course:${String(courseId)}:lastQuizId`);
      setLastQuizId(stored || null);
    } catch {
      setLastQuizId(null);
    }
  }, [courseId]);

  // Helper: format textual content (simple markdown-like -> html)
  const formatContent = (content: string | undefined) => {
    if (!content) return "<div>No content available.</div>";

    let formatted = String(content)
      .replace(/^# (.*$)/gm, '<h1 class="text-2xl font-bold mt-6 mb-4 text-gray-900">$1</h1>')
      .replace(/^## (.*$)/gm, '<h2 class="text-xl font-semibold mt-5 mb-3 text-gray-800">$1</h2>')
      .replace(/^### (.*$)/gm, '<h3 class="text-lg font-medium mt-4 mb-2 text-gray-700">$1</h3>')
      .replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold">$1</strong>')
      .replace(/^- (.*$)/gm, '<li class="ml-4 mb-1">• $1</li>')
      .replace(/^\* (.*$)/gm, '<li class="ml-4 mb-1">• $1</li>')
      .replace(/\n\n/g, '</p><p class="mb-4">')
      .replace(/\n/g, '<br>');

    if (!formatted.trim().startsWith("<")) {
      formatted = "<p class=\"mb-4\">" + formatted + "</p>";
    }
    return formatted;
  };

  // Render helpers (these produce React nodes)
  const renderSidebar = () => {
    if (!course) return null;
    const modules = Array.isArray(course.modules) ? course.modules : [];
    return (
      <>
        <div className="mb-6">
          {/* <h2 className="text-xl font-bold text-white mb-2">Course Navigation</h2> */}
          <Link href="/courses" className="text-lg text-blue-300 hover:text-blue-100 transition-colors">← Back to Courses</Link>
        </div>

        <div className="overflow-y-auto">
          <div className="space-y-3">
            {modules.map((module: any, moduleIndex: number) => {
              const week = module?.week ?? moduleIndex + 1;
              const moduleTitle = module?.title ?? `Week ${week}`;
              return (
                <div key={moduleIndex}>
                  <button
                    onClick={() => {
                      setActiveView(module);
                      setSidebarOpen(false);
                    }}
                    className="block w-full text-left py-2 px-3 rounded bg-gray-700 font-semibold hover:bg-gray-600 transition-colors"
                  >
                    Week {week}: {moduleTitle}
                  </button>

                  {Array.isArray(module?.sub_topics) && module.sub_topics.length > 0 && (
                    <ul className="pl-4 mt-2 mb-4 space-y-1">
                      {module.sub_topics.map((subTopic: any, subIdx: number) => (
                        <li key={subIdx}>
                          <button
                            onClick={() => {
                              setActiveView(subTopic);
                              setSidebarOpen(false);
                            }}
                            className="block w-full text-left py-1 px-3 rounded hover:bg-gray-600 transition-colors text-sm"
                          >
                            {subTopic.title ?? `Topic ${subIdx + 1}`}
                          </button>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </>
    );
  };

  const renderMainContent = () => {
    if (!activeView) return null;

    // If activeView is the full course object (has course_title and modules array)
    if (activeView.course_title && Array.isArray(activeView.modules)) {
      const data: any = activeView;
      return (
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-3xl font-bold mb-4 text-blue-800">Course Overview: {data.course_title}</h2>
          {data.description && typeof data.description === "string" && (
            <p className="text-lg text-gray-600 mb-4">{data.description}</p>
          )}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {data.modules.map((mod: any, idx: number) => (
              <div key={idx} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                <h3 className="font-semibold text-lg text-gray-800">Week {mod.week ?? idx + 1}: {mod.title}</h3>
                <p className="text-sm text-gray-600 mt-2">{Array.isArray(mod.sub_topics) ? `${mod.sub_topics.length} topics` : "No topics"}</p>
              </div>
            ))}
          </div>
        </div>
      );
    }

    // If activeView is a module object (has sub_topics)
    if (Array.isArray(activeView?.sub_topics)) {
      const mod: any = activeView;
      return (
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-3xl font-bold mb-6 text-blue-800">Week {mod.week ?? ""}: {mod.title}</h2>
          {mod.sub_topics.map((st: any, i: number) => (
            <div key={i} className="mt-6 p-6 border rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
              <h3 className="text-2xl font-semibold text-blue-700 mb-4">{st.title}</h3>
              <div
                className="prose max-w-none text-gray-800"
                dangerouslySetInnerHTML={{ __html: formatContent(typeof st.content === "string" ? st.content : JSON.stringify(st.content ?? {}, null, 2)) }}
              />
            </div>
          ))}
        </div>
      );
    }

    // Otherwise it's a sub-topic or plain content object
    const sub: any = activeView;
    const bodyHtml = typeof sub.content === "string" ? formatContent(sub.content) : formatContent(JSON.stringify(sub, null, 2));
    return (
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-3xl font-bold mb-6 text-blue-800">{sub.title ?? "Topic"}</h2>
        <div className="prose max-w-none text-gray-800" dangerouslySetInnerHTML={{ __html: bodyHtml }} />
      </div>
    );
  };

  const handleStartClass = () => {
    if (!courseId) return;
    if (!AVI_BASE) {
      alert("Start URL is not configured. Please set VITE_AVI_URL in .env");
      return;
    }
    // Ensure trailing slash handling and pass return URL
    const base = AVI_BASE.replace(/\/$/, "");
    const returnUrl = window.location.href;
    const target = `${base}/?courseId=${encodeURIComponent(String(courseId))}&return=${encodeURIComponent(returnUrl)}`;
    window.location.href = target;
  };

  const [quizLoading, setQuizLoading] = useState(false);
  const handleGenerateQuiz = async () => {
    if (!courseId) return;
    try {
      setQuizLoading(true);
      const apiBase = import.meta.env.VITE_API_BASE as string | undefined;
      if (!apiBase) throw new Error("Missing VITE_API_BASE in environment");
      const res = await fetch(`${apiBase}/api/quiz/generate-course`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          quiz_type: "course",
          course_id: String(courseId),
          module_week: 0,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(data?.error || "Failed to generate quiz");
      }
      // Persist quiz for the quiz page and navigate to it
      const quiz = data?.quiz;
      const quizId = quiz?.quiz_id;
      if (quiz && quizId) {
        try {
          localStorage.setItem(`quiz:${quizId}`, JSON.stringify(quiz));
          // Persist mapping so course page can show "View Quiz"
          localStorage.setItem(`course:${String(courseId)}:lastQuizId`, String(quizId));
          setLastQuizId(String(quizId));
        } catch {}
        navigate(`/course/${encodeURIComponent(String(courseId))}/quiz/${encodeURIComponent(String(quizId))}`);
        return;
      }
      alert("Quiz generated, but no quiz payload was returned.");
    } catch (e: any) {
      alert(e?.message || "Failed to generate quiz");
    } finally {
      setQuizLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-white to-gray-100">
        <div className="space-y-4 w-80">
          <div className="animate-pulse h-6 bg-gray-200 rounded"></div>
          <div className="animate-pulse h-40 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 text-red-600">
        <div className="text-lg font-semibold">{error}</div>
        <Button className="mt-4" onClick={() => window.location.reload()}>Retry</Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 text-gray-900">
      <AuthNavbar />
      <div className="flex h-screen overflow-hidden">
        {/* Sidebar */}
        <aside
          id="sidebar"
          className={`bg-gray-800 text-white w-80 min-w-[280px] flex flex-col p-4 transform ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0 fixed md:relative top-0 left-0 h-full z-30 transition-transform`}
        >
          {renderSidebar()}
        </aside>

        {/* Main */}
        <main className="flex-1 flex flex-col overflow-hidden">
          <header className="bg-white shadow-md p-4 flex items-center justify-between">
            <div className="flex items-center">
              <button
                id="burgerMenu"
                onClick={() => setSidebarOpen((v) => !v)}
                className="md:hidden mr-4 text-gray-600 p-2 rounded hover:bg-gray-100 transition"
                aria-label="Toggle menu"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={sidebarOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16m-7 6h7"} />
                </svg>
              </button>

              <h1 id="courseTitle" className="text-2xl font-bold text-gray-800">{course?.course_title ?? "Course"}</h1>
            </div>

            <div className="flex items-center gap-3">
              {/* <Link href="/courses"><Button variant="secondary">Back to Courses</Button></Link> */}
              {role === "teacher" ? (
                lastQuizId ? (
                  <Button
                    onClick={() =>
                      navigate(`/course/${encodeURIComponent(String(courseId))}/quiz/${encodeURIComponent(String(lastQuizId))}`)
                    }
                    className="bg-black text-white hover:bg-gray-900"
                  >
                    View Quiz
                  </Button>
                ) : (
                  <Button onClick={handleGenerateQuiz} disabled={quizLoading} className="bg-black text-white hover:bg-gray-900">
                    {quizLoading ? "Generating..." : "Generate Quiz"}
                  </Button>
                )
              ) : (
                <Button onClick={handleStartClass} className="bg-black text-white hover:bg-gray-900">
                  Start Class
                </Button>
              )}
            </div>
          </header>

          <div id="mainContent" className="flex-1 p-8 overflow-y-auto">
            {renderMainContent()}
          </div>
        </main>
      </div>
    </div>
  );
}
