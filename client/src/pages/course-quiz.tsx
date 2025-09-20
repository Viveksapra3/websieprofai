import { useEffect, useMemo, useState } from "react";
import { Link, useRoute } from "wouter";
import { AuthNavbar } from "@/components/auth-navbar";
import { Button } from "@/components/ui/button";

// Types reflecting the quiz response shape
interface QuizQuestion {
  question_id: string;
  question_text: string;
  options: string[];
  topic?: string;
}

interface QuizPayload {
  quiz_id: string;
  title: string;
  description?: string;
  questions: QuizQuestion[];
}

export default function CourseQuizPage() {
  const [match, params] = useRoute("/course/:id/quiz/:quizId");
  const courseId = params?.id as string | undefined;
  const quizId = params?.quizId as string | undefined;

  const [quiz, setQuiz] = useState<QuizPayload | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [regenLoading, setRegenLoading] = useState(false);
  const [quizKind, setQuizKind] = useState<"course" | "module" | null>(null);
  const [moduleWeek, setModuleWeek] = useState<number | null>(null);

  useEffect(() => {
    try {
      if (!quizId) return;
      const raw = localStorage.getItem(`quiz:${quizId}`);
      if (!raw) {
        setError("Quiz data not found. Please regenerate the quiz.");
        return;
      }
      const parsed = JSON.parse(raw) as QuizPayload;
      setQuiz(parsed);
    } catch (e: any) {
      setError(e?.message || "Failed to load quiz");
    }
  }, [quizId]);

  // Detect whether the current quiz is course-level or module-level by checking localStorage mappings
  useEffect(() => {
    try {
      if (!courseId || !quizId) return;
      // 1) Prefer module mapping if any maps to this quizId
      let foundWeek: number | null = null;
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (!key) continue;
        const prefix = `course:${courseId}:module:`;
        if (key.startsWith(prefix) && key.endsWith(":lastQuizId")) {
          const val = localStorage.getItem(key);
          if (val === quizId) {
            const between = key.substring(prefix.length, key.length - ":lastQuizId".length);
            const weekNum = Number(between.replace(/:/g, ""));
            if (!Number.isNaN(weekNum)) {
              foundWeek = weekNum;
              break;
            }
          }
        }
      }
      if (foundWeek != null) {
        setQuizKind("module");
        setModuleWeek(foundWeek);
        return;
      }
      // 2) Otherwise, check course-level mapping
      const courseLast = localStorage.getItem(`course:${courseId}:lastQuizId`);
      if (courseLast && courseLast === quizId) {
        setQuizKind("course");
        setModuleWeek(null);
        return;
      }
      setQuizKind(null);
      setModuleWeek(null);
    } catch {}
  }, [courseId, quizId]);

  const handleRegenerate = async () => {
    if (!courseId || !quizKind) return;
    try {
      setRegenLoading(true);
      const apiBase = import.meta.env.VITE_API_BASE as string | undefined;
      if (!apiBase) throw new Error("Missing VITE_API_BASE in environment");
      let url = "";
      let payload: any = {};
      if (quizKind === "course") {
        url = `${apiBase.replace(/\/$/, "")}/api/quiz/generate-course`;
        payload = {
          quiz_type: "course",
          course_id: String(courseId),
          module_week: 0,
        };
      } else {
        if (moduleWeek == null) throw new Error("Module week not found for this quiz");
        url = `${apiBase.replace(/\/$/, "")}/api/quiz/generate-module`;
        payload = {
          quiz_type: "module",
          course_id: String(courseId),
          module_week: moduleWeek,
        };
      }

      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data?.error || "Failed to regenerate quiz");

      const newQuiz = data?.quiz;
      const newQuizId = newQuiz?.quiz_id;
      if (newQuiz && newQuizId) {
        try {
          localStorage.setItem(`quiz:${newQuizId}`, JSON.stringify(newQuiz));
          if (quizKind === "course") {
            localStorage.setItem(`course:${String(courseId)}:lastQuizId`, String(newQuizId));
          } else if (moduleWeek != null) {
            localStorage.setItem(`course:${String(courseId)}:module:${String(moduleWeek)}:lastQuizId`, String(newQuizId));
          }
        } catch {}
        // Navigate to the regenerated quiz
        window.location.href = `/course/${encodeURIComponent(String(courseId))}/quiz/${encodeURIComponent(String(newQuizId))}`;
        return;
      }
      throw new Error("Regenerated quiz, but no quiz payload was returned");
    } catch (e: any) {
      setError(e?.message || "Failed to regenerate quiz");
    } finally {
      setRegenLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 text-gray-900">
      <AuthNavbar />
      <div className="max-w-5xl mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">{quiz?.title || "Course Quiz"}</h1>
            {quiz?.description && (
              <p className="text-gray-600 mt-1">{quiz.description}</p>
            )}
          </div>
          <div className="flex gap-2">
            {courseId && (
              <Link href={`/course/${encodeURIComponent(courseId)}`}>
                <Button variant="secondary">Back to Course</Button>
              </Link>
            )}
            {(quizKind === "course" || quizKind === "module") && (
              <Button onClick={handleRegenerate} disabled={regenLoading} className="bg-black text-white hover:bg-gray-900">
                {regenLoading ? "Regenerating..." : "Regenerate Quiz"}
              </Button>
            )}
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded mb-6">
            {error}
          </div>
        )}

        {!quiz && !error && (
          <div className="text-gray-600">Loading quiz...</div>
        )}

        {quiz && (
          <div className="space-y-6">
            {quiz.questions?.length ? (
              quiz.questions.map((q, idx) => (
                <div key={q.question_id} className="bg-white rounded-lg shadow p-5">
                  <div className="flex items-start justify-between">
                    <h2 className="text-lg font-semibold text-blue-800">
                      Q{idx + 1}. {q.question_text}
                    </h2>
                    {q.topic && (
                      <span className="ml-4 text-xs px-2 py-1 bg-blue-50 text-blue-700 rounded">{q.topic}</span>
                    )}
                  </div>
                  <div className="mt-4 grid gap-2">
                    {q.options?.map((opt, i) => (
                      <div
                        key={`${q.question_id}_opt_${i}`}
                        className="px-3 py-2 rounded border border-gray-200 hover:bg-gray-50"
                      >
                        {String.fromCharCode(65 + i)}. {opt}
                      </div>
                    ))}
                  </div>
                </div>
              ))
            ) : (
              <div className="text-gray-600">No questions available.</div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
