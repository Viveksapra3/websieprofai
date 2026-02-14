import { useEffect, useState } from "react";
import { useRoute, useLocation, Link } from "wouter";
import { Button } from "@/components/ui/button";
import { AuthNavbar } from "@/components/auth-navbar";
import CourseContentLoadingAnimation from "@/components/CourseContentLoadingAnimation";

type Topic = {
  id?: number;
  module_id?: number;
  title: string;
  content: string;
  order_index?: number;
  estimated_time?: string | null;
  created_at?: string;
};

type Module = {
  id?: number;
  course_id?: number;
  week?: number;
  title: string;
  description?: string;
  learning_objectives?: string[];
  order_index?: number;
  created_at?: string;
  topics?: Topic[];
  sub_topics?: Topic[]; // legacy support
};

type CourseDetail = {
  id?: string | number;
  course_id?: string | number;
  title?: string;
  course_title?: string;
  description?: string | Record<string, any>;
  level?: string;
  teacher_id?: number;
  course_order?: number | null;
  course_number?: number;
  country?: string;
  modules?: Module[];
  content?: any;
  [key: string]: any;
};

// Helper function to build API URL.
// To avoid mixed-content issues when the site is served over HTTPS
// and the backend is HTTP behind an Nginx reverse proxy/mask,
// we prepend VITE_API_BASE (e.g., /backend-api) to all API paths.
const buildApiUrl = (path: string): string => {
  // If caller passes a fully-qualified URL, use it as-is.
  if (path.startsWith("http://") || path.startsWith("https://")) {
    return path;
  }

  const apiBase = (import.meta.env.VITE_API_BASE as string | undefined) || "";
  
  // Remove leading slash from path if present to avoid double slashes
  const cleanPath = path.startsWith("/") ? path.slice(1) : path;
  
  // Combine apiBase with the path
  // If apiBase is empty, just return the path with leading slash
  if (!apiBase) {
    return `/${cleanPath}`;
  }
  
  // Remove trailing slash from apiBase if present
  const cleanBase = apiBase.endsWith("/") ? apiBase.slice(0, -1) : apiBase;
  
  return `${cleanBase}/${cleanPath}`;
};

export default function CoursePage() {
  const [match, params] = useRoute("/course/:id");
  const courseId = params?.id;
  
  // Debug environment variable loading
  console.log('🔧 CoursePage initialization - Environment check:');
  console.log('  import.meta.env.VITE_AVI_URL:', import.meta.env.VITE_AVI_URL);
  console.log('  import.meta.env.MODE:', import.meta.env.MODE);
  console.log('  import.meta.env.PROD:', import.meta.env.PROD);
  
  const AVI_BASE = (import.meta.env.VITE_AVI_URL as string | undefined) || "";
  console.log('  AVI_BASE after assignment:', AVI_BASE);
  
  const [, navigate] = useLocation();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [course, setCourse] = useState<CourseDetail | null>(null);
  const [role, setRole] = useState<string | null>(null);
  const [userId, setUserId] = useState<number | null>(null);
  const [userNumber, setUserNumber] = useState<string | number | null>(null);
  const [lastQuizId, setLastQuizId] = useState<string | null>(null);
  const [moduleQuizIds, setModuleQuizIds] = useState<Record<string, string | null>>({}); // key: week
  const [moduleQuizLoading, setModuleQuizLoading] = useState<Record<string, boolean>>({}); // key: week

  const [activeView, setActiveView] = useState<any>(null);
  const [completedTopics, setCompletedTopics] = useState<Record<string, boolean>>({});
  const [markingTopicIds, setMarkingTopicIds] = useState<Record<string, boolean>>({});

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
        const rawUserId = authData?.user?.id;
        const parsedUserId = typeof rawUserId === "number" ? rawUserId : Number(rawUserId);
        const rawUserNumber = (authData as any)?.user?.user_number;
        if (!cancelled) {
          setRole(userRole);
          setUserId(Number.isNaN(parsedUserId) ? null : parsedUserId);
          setUserNumber(rawUserNumber ?? null);
        }

        if (!courseId) throw new Error("Invalid course id");

        // Check course access first
        const accessRes = await fetch(`/api/course/${encodeURIComponent(courseId)}/access`, {
          credentials: "include"
        });
        
        if (!accessRes.ok) {
          const accessData = await accessRes.json().catch(() => ({}));
          console.error("Course access check failed:", accessRes.status, accessData);
          
          if (accessRes.status === 401) {
            // User not authenticated, redirect to login
            window.location.href = "/post-auth";
            return;
          }
          
          throw new Error(accessData?.error || `Failed to check course access (${accessRes.status})`);
        }

        const accessData = await accessRes.json();
        console.log("Course access data:", accessData);

        if (!accessData.hasAccess) {
          // Redirect to courses page with payment prompt
          console.log("Access denied, redirecting to payment");
          window.location.href = `/courses?needsPayment=${encodeURIComponent(courseId)}`;
          return;
        }

        console.log("Access granted, loading course content");

        // Fetch course via local server proxy (avoids browser timeout to external API)
        const courseUrl = `/api/course/${encodeURIComponent(courseId)}`;
        console.log('Fetching course from:', courseUrl);
        
        const res = await fetch(courseUrl, { credentials: "include" });
        const data = await res.json();
        if (!res.ok) throw new Error(data?.error || "Failed to load course");

        if (!cancelled) {
          // Normalize course data to handle both old and new API formats
          const normalizedCourse = {
            ...data,
            // Support both 'title' and 'course_title'
            course_title: data.course_title || data.title,
            title: data.title || data.course_title,
            // Normalize modules to have 'topics' array (handle both 'topics' and 'sub_topics')
            modules: Array.isArray(data.modules) ? data.modules.map((mod: any, idx: number) => ({
              ...mod,
              week: mod.week ?? mod.order_index ?? idx + 1,
              // Support both 'topics' and 'sub_topics'
              topics: mod.topics || mod.sub_topics || [],
              sub_topics: mod.sub_topics || mod.topics || [],
            })) : data.modules,
          };
          setCourse(normalizedCourse);
          setActiveView(normalizedCourse);
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

  useEffect(() => {
    try {
      if (!courseId) return;
      const stored = localStorage.getItem(`course:${String(courseId)}:completedTopics`);
      if (!stored) {
        setCompletedTopics({});
        return;
      }
      const parsed = JSON.parse(stored);
      if (parsed && typeof parsed === "object") {
        setCompletedTopics(parsed as Record<string, boolean>);
      }
    } catch {
      setCompletedTopics({});
    }
  }, [courseId]);

  useEffect(() => {
    try {
      if (!courseId) return;
      localStorage.setItem(`course:${String(courseId)}:completedTopics`, JSON.stringify(completedTopics));
    } catch {}
  }, [courseId, completedTopics]);

  const handleGenerateModuleQuiz = async (week: number) => {
    if (!courseId) return;
    const weekKey = String(week);
    try {
      setModuleQuizLoading((s) => ({ ...s, [weekKey]: true }));
      const res = await fetch('/api/quiz/generate-module', {
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

  const handleMarkTopicComplete = async (mod: any, topic: any) => {
    if (!course || !courseId || !userNumber) return;

    const topicId = topic?.id;
    const moduleId = mod?.id ?? topic?.module_id;
    const courseIdFromData = (course as any)?.id ?? (course as any)?.course_id ?? Number(courseId);

    if (!topicId || !moduleId || !courseIdFromData) {
      return;
    }

    const topicKey = String(topicId);
    if (markingTopicIds[topicKey]) {
      return;
    }

    const targetBase = AVI_BASE ? AVI_BASE.replace(/\/$/, "") : "";
    if (!targetBase) {
      console.error("VITE_AVI_URL is not configured for progress tracking");
      return;
    }

    try {
      setMarkingTopicIds((prev) => ({ ...prev, [topicKey]: true }));

      const url = `${targetBase}/api/progress/mark-complete`;
      const body = {
        // Backend expects "user_id" field but value should be the user_number from session
        user_id: userNumber,
        course_id: courseIdFromData,
        module_id: moduleId,
        topic_id: topicId,
      };

      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => null);
        console.error("Failed to mark topic as complete", res.status, data);
      }

      setCompletedTopics((prev) => ({
        ...prev,
        [topicKey]: true,
      }));
    } catch (err) {
      console.error("Error marking topic as complete", err);
    } finally {
      setMarkingTopicIds((prev) => {
        const next = { ...prev };
        delete next[topicKey];
        return next;
      });
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

  const handleStartClass = async () => {
    // Comprehensive debugging
    console.group('🔍 Start Class Debug Info');
    console.log('courseId:', courseId);
    console.log('params:', params);
    console.log('AVI_BASE raw value:', AVI_BASE);
    console.log('AVI_BASE type:', typeof AVI_BASE);
    console.log('AVI_BASE length:', AVI_BASE?.length);
    console.log('import.meta.env.VITE_AVI_URL:', import.meta.env.VITE_AVI_URL);
    console.log('import.meta.env.MODE:', import.meta.env.MODE);
    console.log('import.meta.env.PROD:', import.meta.env.PROD);
    console.log('import.meta.env.DEV:', import.meta.env.DEV);
    console.log('All import.meta.env:', import.meta.env);
    console.groupEnd();
    
    if (!courseId) {
      console.error('❌ No courseId available');
      alert('Course ID is missing. Please refresh the page and try again.');
      return;
    }
    
    // Use VITE_AVI_URL from environment
    const targetBase = AVI_BASE ? AVI_BASE.replace(/\/$/, "") : "";
    
    console.log('📍 targetBase after processing:', targetBase);
    console.log('📍 targetBase is empty?', !targetBase);
    
    // Check if targetBase is valid before proceeding
    if (!targetBase) {
      console.error('❌ VITE_AVI_URL is not set or empty');
      console.error('Expected VITE_AVI_URL but got:', {
        raw: AVI_BASE,
        processed: targetBase,
        envValue: import.meta.env.VITE_AVI_URL
      });
      alert('3D classroom URL is not configured. Please contact support.');
      return;
    }
    
    console.log('✅ targetBase validated:', targetBase);
    
    try {
      // Get current session info
      const authRes = await fetch("/api/session", { credentials: "include" });
      const authData = await authRes.json();
      
      if (!authRes.ok || !authData?.authenticated) {
        alert("Session expired. Please refresh and try again.");
        return;
      }
      
      const returnUrl = window.location.href;
      
      // Prepare session transfer data - include both userInfo and sessionToken
      const userInfo = {
        id: authData.user?.id,
        username: authData.user?.username,
        email: authData.user?.email,
        role: authData.user?.role,
        user_number: authData.user?.user_number
      };
      
      // Create a session token from the current session data
      const sessionToken = btoa(JSON.stringify({
        userId: authData.user?.id,
        timestamp: Date.now(),
        source: 'profai-coach'
      }));
      
      // Create target URL with session transfer data
      const params = new URLSearchParams({
        courseId: String(courseId),
        userInfo: JSON.stringify(userInfo),
        sessionToken: sessionToken,
        return: returnUrl,
        timestamp: String(Date.now())
      });
      
      // Validate URL before constructing
      let targetUrl;
      try {
        targetUrl = new URL(targetBase);
      } catch (urlError) {
        console.error('Invalid VITE_AVI_URL:', targetBase, urlError);
        alert('3D classroom URL is invalid. Please contact support.');
        return;
      }
      
      targetUrl.search = params.toString();
      const target = targetUrl.href;
      
      console.log('Redirecting to r3f project with session data:', {
        courseId: String(courseId),
        userInfo: userInfo,
        sessionToken: sessionToken.substring(0, 20) + '...',
        fullTarget: target,
        params: Object.fromEntries(params.entries())
      });
      
      // Verify courseId is in the URL
      if (!target.includes(`courseId=${encodeURIComponent(String(courseId))}`)) {
        console.error('CourseId missing from target URL!', {
          courseId,
          target,
          params: params.toString()
        });
        alert('Error: Course ID not properly included in redirect URL. Please try again.');
        return;
      }
      
      window.location.assign(target);
    } catch (error) {
      console.error('Error starting class:', error);
      alert('Failed to start class. Please try again.');
    }
  };

  const [quizLoading, setQuizLoading] = useState(false);
  const handleGenerateQuiz = async () => {
    if (!courseId) return;
    try {
      setQuizLoading(true);
      const res = await fetch('/api/quiz/generate-course', {
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

  const getModuleProgress = (mod: any) => {
    const topics = mod?.topics || mod?.sub_topics || [];
    const total = topics.length;
    const completed = topics.filter((t: any) => t.id && completedTopics[String(t.id)]).length;
    const percent = total > 0 ? Math.round((completed / total) * 100) : 0;
    return { total, completed, percent };
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
              const modProgress = getModuleProgress(mod);
              return (
                <div key={idx} className={`border rounded-lg overflow-hidden shadow-sm ${modProgress.percent === 100 ? "border-green-300" : ""}`}>
                  <button
                    onClick={() => setActiveView(isActive ? course : mod)}
                    className="w-full p-4 bg-gray-100 hover:bg-gray-200 transition"
                  >
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-3">
                        {modProgress.percent === 100 ? (
                          <span className="flex-shrink-0 w-7 h-7 rounded-full bg-green-500 flex items-center justify-center">
                            <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                          </span>
                        ) : (
                          <span className="flex-shrink-0 w-7 h-7 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs font-bold">
                            {modProgress.percent}%
                          </span>
                        )}
                        <span className="font-semibold text-lg text-gray-800 text-left">
                          Week {week}: {mod.title}
                        </span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${modProgress.percent === 100 ? "bg-green-100 text-green-700" : "bg-gray-200 text-gray-600"}`}>
                          {modProgress.completed}/{modProgress.total} topics
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
                      </div>
                    </div>
                    {/* Progress bar */}
                    <div className="mt-2 w-full bg-gray-200 rounded-full h-1.5">
                      <div
                        className={`h-1.5 rounded-full transition-all duration-500 ${modProgress.percent === 100 ? "bg-green-500" : "bg-blue-500"}`}
                        style={{ width: `${modProgress.percent}%` }}
                      />
                    </div>
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
                      {(Array.isArray(mod.topics) && mod.topics.length > 0) || (Array.isArray(mod.sub_topics) && mod.sub_topics.length > 0) ? (
                        (mod.topics || mod.sub_topics).map((st: any, i: number) => {
                          const isTopicDone = !!(st.id && completedTopics[String(st.id)]);
                          const isMarking = !!markingTopicIds[String(st.id)];
                          return (
                            <div key={i} className={`mt-6 p-6 border rounded-lg transition-colors ${isTopicDone ? "bg-green-50 border-green-200" : "bg-gray-50 hover:bg-gray-100"}`}>
                              <div className="flex items-start justify-between gap-4 mb-4">
                                <h3 className="text-2xl font-semibold text-blue-700">{st.title}</h3>
                                {isTopicDone && (
                                  <span className="flex-shrink-0 inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-green-100 text-green-700 text-xs font-semibold">
                                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                                    Done
                                  </span>
                                )}
                              </div>
                              <div
                                className="prose max-w-none text-gray-800"
                                dangerouslySetInnerHTML={{ __html: formatContent(typeof st.content === "string" ? st.content : JSON.stringify(st.content ?? {}, null, 2)) }}
                              />
                              <div className="mt-5 pt-4 border-t border-gray-200 flex items-center justify-end">
                                {isTopicDone ? (
                                  <span className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-green-500 text-white text-sm font-semibold shadow-sm">
                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                                    Completed
                                  </span>
                                ) : (
                                  <Button
                                    size="sm"
                                    className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-5 py-2 shadow-sm"
                                    disabled={!st.id || isMarking || !userNumber}
                                    onClick={() => handleMarkTopicComplete(mod, st)}
                                  >
                                    {isMarking ? (
                                      <span className="inline-flex items-center gap-2">
                                        <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>
                                        Marking...
                                      </span>
                                    ) : (
                                      <span className="inline-flex items-center gap-2">
                                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><circle cx="12" cy="12" r="10" /><path strokeLinecap="round" strokeLinejoin="round" d="M8 12l2.5 2.5L16 9" /></svg>
                                        Mark as completed
                                      </span>
                                    )}
                                  </Button>
                                )}
                              </div>
                            </div>
                          );
                        })
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
        {(mod.topics || mod.sub_topics || []).map((st: any, i: number) => {
          const isTopicDone = !!(st.id && completedTopics[String(st.id)]);
          const isMarking = !!markingTopicIds[String(st.id)];
          return (
            <div key={i} className={`mt-6 p-6 border rounded-lg transition-colors ${isTopicDone ? "bg-green-50 border-green-200" : "bg-gray-50 hover:bg-gray-100"}`}>
              <div className="flex items-start justify-between gap-4 mb-4">
                <h3 className="text-2xl font-semibold text-blue-700">{st.title}</h3>
                {isTopicDone && (
                  <span className="flex-shrink-0 inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-green-100 text-green-700 text-xs font-semibold">
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                    Done
                  </span>
                )}
              </div>
              <div className="prose max-w-none text-gray-800" dangerouslySetInnerHTML={{ __html: formatContent(typeof st.content === "string" ? st.content : JSON.stringify(st.content ?? {}, null, 2)) }} />
              <div className="mt-5 pt-4 border-t border-gray-200 flex items-center justify-end">
                {isTopicDone ? (
                  <span className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-green-500 text-white text-sm font-semibold shadow-sm">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                    Completed
                  </span>
                ) : (
                  <Button
                    size="sm"
                    className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-5 py-2 shadow-sm"
                    disabled={!st.id || isMarking || !userNumber}
                    onClick={() => handleMarkTopicComplete(mod, st)}
                  >
                    {isMarking ? (
                      <span className="inline-flex items-center gap-2">
                        <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>
                        Marking...
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-2">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><circle cx="12" cy="12" r="10" /><path strokeLinecap="round" strokeLinejoin="round" d="M8 12l2.5 2.5L16 9" /></svg>
                        Mark as completed
                      </span>
                    )}
                  </Button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  if (loading) {
    return <CourseContentLoadingAnimation />;
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
          {activeView && (activeView.course_title || activeView.title) && Array.isArray(activeView.modules) && renderCourseOverview()}
          {activeView && (Array.isArray(activeView.topics) || Array.isArray(activeView.sub_topics)) && renderModuleFull(activeView)}
          {activeView && !activeView.course_title && !Array.isArray(activeView.sub_topics) && (
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-3xl font-bold text-blue-800">{activeView.title ?? "Topic"}</h2>
                <Button variant="outline" size="sm" onClick={() => setActiveView(course)}>Close</Button>
              </div>
              <div className="prose max-w-none text-gray-800" dangerouslySetInnerHTML={{ __html: formatContent(typeof activeView.content === "string" ? activeView.content : JSON.stringify(activeView, null, 2)) }} />
              {(() => {
                const isTopicDone = !!(activeView.id && completedTopics[String(activeView.id)]);
                const isMarking = !!markingTopicIds[String(activeView.id)];
                return (
                  <div className="mt-5 pt-4 border-t border-gray-200 flex items-center justify-end">
                    {isTopicDone ? (
                      <span className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-green-500 text-white text-sm font-semibold shadow-sm">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                        Completed
                      </span>
                    ) : (
                      <Button
                        size="sm"
                        className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-5 py-2 shadow-sm"
                        disabled={!activeView.id || isMarking || !userNumber}
                        onClick={() =>
                          handleMarkTopicComplete(
                            { id: activeView.module_id },
                            activeView,
                          )
                        }
                      >
                        {isMarking ? (
                          <span className="inline-flex items-center gap-2">
                            <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>
                            Marking...
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-2">
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><circle cx="12" cy="12" r="10" /><path strokeLinecap="round" strokeLinejoin="round" d="M8 12l2.5 2.5L16 9" /></svg>
                            Mark as completed
                          </span>
                        )}
                      </Button>
                    )}
                  </div>
                );
              })()}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
