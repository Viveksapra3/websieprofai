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
      // Persist mapping for course -> lastQuizId for course page CTA state
      if (courseId && quizId) {
        try {
          localStorage.setItem(`course:${String(courseId)}:lastQuizId`, String(quizId));
        } catch {}
      }
    } catch (e: any) {
      setError(e?.message || "Failed to load quiz");
    }
  }, [courseId, quizId]);

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
