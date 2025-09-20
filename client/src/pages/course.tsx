import { useEffect, useState } from "react";
import { useRoute, useLocation, Link } from "wouter";
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
  const [moduleQuizIds, setModuleQuizIds] = useState<Record<string, string | null>>({}); // key: week
  const [moduleQuizLoading, setModuleQuizLoading] = useState<Record<string, boolean>>({}); // key: week

  const [activeView, setActiveView] = useState<any>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const authRes = await fetch("/api/session", { credentials: "include" });
        const authData = await authRes.json();
        if (!authRes.ok || !authData?.authenticated) {
          window.location.href = "/post-auth";
          return;
        }
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
          setActiveView(data);
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

  useEffect(() => {
    try {
      if (!courseId) return;
      const stored = localStorage.getItem(`course:${String(courseId)}:lastQuizId`);
      setLastQuizId(stored || null);
    } catch {
      setLastQuizId(null);
    }
  }, [courseId]);

  useEffect(() => {
    try {
      if (!courseId || !course || !Array.isArray(course.modules)) return;
      const nextIds: Record<string, string | null> = {};
      const nextLoading: Record<string, boolean> = {};
      course.modules.forEach((mod: any, idx: number) => {
        const week = String(mod?.week ?? idx + 1);
        const key = `course:${String(courseId)}:module:${week}:lastQuizId`;
        const stored = localStorage.getItem(key);
        nextIds[week] = stored || null;
        nextLoading[week] = false;
      });
      setModuleQuizIds(nextIds);
      setModuleQuizLoading(nextLoading);
    } catch {}
  }, [courseId, course]);

  const handleGenerateModuleQuiz = async (week: number) => {
    if (!courseId) return;
    const weekKey = String(week);
    try {
      setModuleQuizLoading((s) => ({ ...s, [weekKey]: true }));
      const base = (import.meta.env.VITE_API_BASE as string | undefined) || "";
      if (!base) throw new Error("Missing VITE_API_BASE in environment");
      const url = `${base.replace(/\/$/, "")}/api/quiz/generate-module`;
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          quiz_type: "module",
          course_id: String(courseId),
          module_week: week,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data?.error || "Failed to generate module quiz");
      const quiz = data?.quiz;
      const quizId = quiz?.quiz_id;
      if (quiz && quizId) {
        try {
          localStorage.setItem(`quiz:${quizId}`, JSON.stringify(quiz));
          localStorage.setItem(`course:${String(courseId)}:module:${weekKey}:lastQuizId`, String(quizId));
          setModuleQuizIds((ids) => ({ ...ids, [weekKey]: String(quizId) }));
        } catch {}
        navigate(`/course/${encodeURIComponent(String(courseId))}/quiz/${encodeURIComponent(String(quizId))}`);
        return;
      }
      alert("Module quiz generated, but no quiz payload was returned.");
    } catch (e: any) {
      alert(e?.message || "Failed to generate module quiz");
    } finally {
      setModuleQuizLoading((s) => ({ ...s, [weekKey]: false }));
    }
  };

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

  const handleStartClass = () => {
    if (!courseId) return;
    if (!AVI_BASE) {
      alert("Start URL is not configured. Please set VITE_AVI_URL in .env");
      return;
    }
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
        body: JSON.stringify({ quiz_type: "course", course_id: String(courseId), module_week: 0 }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(data?.error || "Failed to generate quiz");
      }
      const quiz = data?.quiz;
      const quizId = quiz?.quiz_id;
      if (quiz && quizId) {
        try {
          localStorage.setItem(`quiz:${quizId}`, JSON.stringify(quiz));
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

  const renderCourseOverview = () => {
    if (!course) return null;
    return (
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-3xl font-bold mb-4 text-blue-800">Course Overview: {course.course_title}</h2>
        {course.description && typeof course.description === "string" && (
          <p className="text-lg text-gray-600 mb-6">{course.description}</p>
        )}

        <div className="space-y-4">
          {Array.isArray(course.modules) &&
            course.modules.map((mod: any, idx: number) => {
              const isActive = activeView?.week === mod.week && activeView?.title === mod.title;
              const week = Number(mod?.week ?? idx + 1);
              const weekKey = String(week);
              const existingQuizId = moduleQuizIds[weekKey];
              const loading = !!moduleQuizLoading[weekKey];
              return (
                <div key={idx} className="border rounded-lg overflow-hidden shadow-sm">
                  <button
                    onClick={() => setActiveView(isActive ? course : mod)}
                    className="w-full flex justify-between items-center p-4 bg-gray-100 hover:bg-gray-200 transition"
                  >
                    <span className="font-semibold text-lg text-gray-800">
                      Week {week}: {mod.title}
                    </span>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className={`h-5 w-5 transform transition-transform ${isActive ? "rotate-180" : ""}`}
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>

                  {isActive && (
                    <div className="p-6 bg-white">
                      <div className="flex justify-between items-center mb-4">
                        <div className="flex gap-2">
                          {role === "teacher" && (
                            existingQuizId ? (
                              <Button
                                onClick={() =>
                                  navigate(`/course/${encodeURIComponent(String(courseId))}/quiz/${encodeURIComponent(String(existingQuizId))}`)
                                }
                                className="bg-black text-white hover:bg-gray-900"
                                disabled={loading}
                              >
                                View Quiz (Week {week})
                              </Button>
                            ) : (
                              <Button
                                onClick={() => handleGenerateModuleQuiz(week)}
                                disabled={loading}
                                className="bg-black text-white hover:bg-gray-900"
                              >
                                {loading ? "Generating..." : `Generate Module Quiz (Week ${week})`}
                              </Button>
                            )
                          )}
                        </div>
                        <Button variant="outline" size="sm" onClick={() => setActiveView(course)}>Close</Button>
                      </div>
                      {Array.isArray(mod.sub_topics) && mod.sub_topics.length > 0 ? (
                        mod.sub_topics.map((st: any, i: number) => (
                          <div key={i} className="mt-6 p-6 border rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
                            <h3 className="text-2xl font-semibold text-blue-700 mb-4">{st.title}</h3>
                            <div
                              className="prose max-w-none text-gray-800"
                              dangerouslySetInnerHTML={{ __html: formatContent(typeof st.content === "string" ? st.content : JSON.stringify(st.content ?? {}, null, 2)) }}
                            />
                          </div>
                        ))
                      ) : (
                        <p className="text-gray-600">No topics available.</p>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
        </div>
      </div>
    );
  };

  const renderModuleFull = (mod: any) => {
    const week = Number(mod?.week ?? 0);
    const weekKey = String(week);
    const existingQuizId = moduleQuizIds[weekKey];
    const loading = !!moduleQuizLoading[weekKey];
    return (
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold text-blue-800">Week {mod.week ?? ""}: {mod.title}</h2>
          <div className="flex items-center gap-3">
            {role === "teacher" && (
              existingQuizId ? (
                <Button
                  onClick={() =>
                    navigate(`/course/${encodeURIComponent(String(courseId))}/quiz/${encodeURIComponent(String(existingQuizId))}`)
                  }
                  className="bg-black text-white hover:bg-gray-900"
                  disabled={loading}
                >
                  View Quiz (Week {week})
                </Button>
              ) : (
                <Button
                  onClick={() => handleGenerateModuleQuiz(week)}
                  disabled={loading}
                  className="bg-black text-white hover:bg-gray-900"
                >
                  {loading ? "Generating..." : `Generate Module Quiz (Week ${week})`}
                </Button>
              )
            )}
            <Button variant="outline" size="sm" onClick={() => setActiveView(course)}>Close</Button>
          </div>
        </div>
        {mod.sub_topics.map((st: any, i: number) => (
          <div key={i} className="mt-6 p-6 border rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
            <h3 className="text-2xl font-semibold text-blue-700 mb-4">{st.title}</h3>
            <div className="prose max-w-none text-gray-800" dangerouslySetInnerHTML={{ __html: formatContent(typeof st.content === "string" ? st.content : JSON.stringify(st.content ?? {}, null, 2)) }} />
          </div>
        ))}
      </div>
    );
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
      <main className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white shadow-md p-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h1 id="courseTitle" className="text-2xl font-bold text-gray-800">{course?.course_title ?? "Course"}</h1>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/courses">
              <Button variant="secondary" className="flex items-center gap-2 hover:scale-110">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M12.707 15.707a1 1 0 01-1.414 0l-5-5a1 1 0 010-1.414l5-5a1 1 0 111.414 1.414L8.414 9H17a1 1 0 110 2H8.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
                </svg>
                Back to Courses
              </Button>
            </Link>
            {role === "teacher" ? (
              lastQuizId ? (
                <Button onClick={() => navigate(`/course/${encodeURIComponent(String(courseId))}/quiz/${encodeURIComponent(String(lastQuizId))}`)} className="bg-black text-white hover:bg-gray-900">View Quiz</Button>
              ) : (
                <Button onClick={handleGenerateQuiz} disabled={quizLoading} className="bg-black text-white hover:bg-gray-900">{quizLoading ? "Generating..." : "Generate Quiz"}</Button>
              )
            ) : (
              <Button onClick={handleStartClass} className="bg-black text-white hover:bg-gray-900">Start Class</Button>
            )}
          </div>
        </header>

        <div id="mainContent" className="flex-1 p-8 overflow-y-auto">
          {activeView && activeView.course_title && Array.isArray(activeView.modules) && renderCourseOverview()}
          {activeView && Array.isArray(activeView.sub_topics) && renderModuleFull(activeView)}
          {activeView && !activeView.course_title && !Array.isArray(activeView.sub_topics) && (
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-3xl font-bold text-blue-800">{activeView.title ?? "Topic"}</h2>
                <Button variant="outline" size="sm" onClick={() => setActiveView(course)}>Close</Button>
              </div>
              <div className="prose max-w-none text-gray-800" dangerouslySetInnerHTML={{ __html: formatContent(typeof activeView.content === "string" ? activeView.content : JSON.stringify(activeView, null, 2)) }} />
            </div>
          )}
        </div>
      </main>
    </div>
  );
}