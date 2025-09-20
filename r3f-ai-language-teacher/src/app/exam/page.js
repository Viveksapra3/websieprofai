// "use client"

// import React, { useEffect, useState, useRef } from "react";
// import Link from "next/link";
// import { useRouter } from "next/navigation";
// import { subjects } from "./data";
// import { SessionGate } from "@/components/SessionGate";
// import { useSearchParams } from "next/navigation";
// import { apiGet } from "@/lib/api";

// // QuizExam.jsx
// // Same features and logic as your original component — only styling changed to match the dashboard theme.

// export default function QuizExam({
//   questions = [
//     { id: 'q1', type: 'single', title: 'What is 2 + 2?', options: ['1','2','3','4'], correct: 3, marks: 1 },
//     { id: 'q2', type: 'single', title: 'What is 3 + 1?', options: ['1','2','3','4'], correct: 3, marks: 1 },
//     { id: 'q3', type: 'single', title: 'What is 5 - 1?', options: ['1','2','3','4'], correct: 3, marks: 1 },
//     { id: 'q4', type: 'single', title: 'What is 1 + 3?', options: ['1','2','3','4'], correct: 3, marks: 1 },
//     { id: 'q5', type: 'single', title: 'What is 4 / 1?', options: ['1','2','3','4'], correct: 3, marks: 1 },
//   ],
//   timeLimit = 15 * 60, // seconds
//   onSubmit = (res) => console.log("Quiz results", res),
//   allowReview = true,
//   shuffle = false,
// }) {
//   const router = useRouter();
//   const search = useSearchParams();
//   const [courseId, setCourseId] = useState("");
//   const [openSubjectId, setOpenSubjectId] = useState(null);
//   const [course, setCourse] = useState(null);

//   const toggleSubject = (id) => {
//     setOpenSubjectId((prev) => (prev === id ? null : id));
//   };
//   const [order, setOrder] = useState([]);
//   const [answers, setAnswers] = useState({});
//   const [current, setCurrent] = useState(0);
//   const [started, setStarted] = useState(false);
//   const [finished, setFinished] = useState(false);
//   const [remaining, setRemaining] = useState(timeLimit);
//   const timerRef = useRef(null);
//   const [showLeaveConfirm, setShowLeaveConfirm] = useState(false);
//   const [showSubmitConfirm, setShowSubmitConfirm] = useState(false);
//   const [pendingList, setPendingList] = useState([]);

//   // Initialize question order once on mount to prevent infinite re-renders
//   useEffect(() => {
//     if (questions && questions.length) {
//       const idx = questions.map((_, i) => i);
//       if (shuffle) {
//         for (let i = idx.length - 1; i > 0; i--) {
//           const j = Math.floor(Math.random() * (i + 1));
//           [idx[i], idx[j]] = [idx[j], idx[i]];
//         }
//       }
//       setOrder(idx);
//     }
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, []);

//   // Read courseId from query or sessionStorage and persist
//   useEffect(() => {
//     try {
//       const q = search?.get("courseId");
//       if (q && q !== courseId) {
//         setCourseId(q);
//         sessionStorage.setItem("activeCourseId", q);
//       } else if (!q) {
//         const stored = sessionStorage.getItem("activeCourseId") || "";
//         if (stored && stored !== courseId) setCourseId(stored);
//       }
//     } catch {}
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [search]);

//   // Load course details when courseId is available
//   useEffect(() => {
//     let cancelled = false;
//     (async () => {
//       if (!courseId) return;
//       try {
//         const { ok, data } = await apiGet(`/api/course/${encodeURIComponent(courseId)}`);
//         if (!ok) return;
//         if (!cancelled) setCourse(data || null);
//       } catch {}
//     })();
//     return () => { cancelled = true; };
//   }, [courseId]);

//   // Warn on reload/close and intercept browser back during an active exam
//   useEffect(() => {
//     if (!(started && !finished)) return;

//     const handleBeforeUnload = (e) => {
//       e.preventDefault();
//       e.returnValue = ""; // Triggers native browser confirmation
//     };

//     const handlePopState = (e) => {
//       // Show custom confirmation modal and revert the navigation
//       setShowLeaveConfirm(true);
//       history.pushState(null, "", location.href);
//     };

//     window.addEventListener("beforeunload", handleBeforeUnload);
//     history.pushState(null, "", location.href); // Create a new history entry to intercept back
//     window.addEventListener("popstate", handlePopState);

//     return () => {
//       window.removeEventListener("beforeunload", handleBeforeUnload);
//       window.removeEventListener("popstate", handlePopState);
//     };
//   }, [started, finished]);

//   useEffect(() => {
//     if (started && timeLimit) {
//       timerRef.current = setInterval(() => {
//         setRemaining((r) => {
//           if (r === 1) {
//             clearInterval(timerRef.current);
//             handleFinish();
//             return 0;
//           }
//           return r - 1;
//         });
//       }, 1000);
//       return () => clearInterval(timerRef.current);
//     }
//   }, [started, timeLimit]);

//   function startQuiz() {
//     setStarted(true);
//     setFinished(false);
//     setRemaining(timeLimit);
//   }

//   function handleAnswerChange(qIndex, value) {
//     const q = questions[qIndex];
//     setAnswers((prev) => {
//       const copy = { ...prev };
//       if (q.type === "multiple") {
//         const prevSet = new Set(copy[q.id] || []);
//         if (prevSet.has(value)) prevSet.delete(value);
//         else prevSet.add(value);
//         copy[q.id] = Array.from(prevSet);
//       } else if (q.type === "single") {
//         copy[q.id] = value;
//       } else {
//         copy[q.id] = value; // text
//       }
//       return copy;
//     });
//   }

//   function goTo(i) {
//     if (i < 0 || i >= order.length) return;
//     setCurrent(i);
//   }

//   function handleFinish() {
//     clearInterval(timerRef.current);
//     setFinished(true);
//     setStarted(false);
//     const result = gradeQuiz(questions, answers);
//     const payload = { answers, result, submittedAt: new Date().toISOString() };
//     // Persist latest result for Mentor page to read
//     try {
//       localStorage.setItem("latestQuizResult", JSON.stringify(payload));
//     } catch (e) {
//       // ignore storage errors
//     }
//     onSubmit(payload);
//   }

//   // Determine unanswered/pending questions
//   function getPendingQuestions() {
//     const pending = [];
//     order.forEach((qi, i) => {
//       const q = questions[qi];
//       const u = answers[q.id];
//       if (q.type === 'single') {
//         if (u === undefined) pending.push(i + 1);
//       } else if (q.type === 'multiple') {
//         if (!Array.isArray(u) || u.length === 0) pending.push(i + 1);
//       } else if (q.type === 'text') {
//         if (typeof u !== 'string' || u.trim().length === 0) pending.push(i + 1);
//       }
//     });
//     return pending;
//   }

//   function handleSubmitClick() {
//     const pending = getPendingQuestions();
//     if (pending.length > 0) {
//       setPendingList(pending);
//       setShowSubmitConfirm(true);
//     } else {
//       handleFinish();
//     }
//   }

//   function gradeQuiz(qs, ans) {
//     let score = 0;
//     let maxScore = 0;
//     const perQuestion = [];
//     qs.forEach((q) => {
//       const marks = q.marks || 1;
//       maxScore += marks;
//       let awarded = 0;
//       const user = ans[q.id];
//       if (q.type === "single") {
//         if (user !== undefined && user === q.correct) awarded = marks;
//       } else if (q.type === "multiple") {
//         const correctSet = new Set(q.correct || []);
//         const userSet = new Set(user || []);
//         if (userSet.size === 0) awarded = 0;
//         else {
//           let right = 0;
//           let wrong = 0;
//           userSet.forEach((u) => (correctSet.has(u) ? right++ : wrong++));
//           awarded = Math.max(0, (right - wrong) / correctSet.size) * marks;
//         }
//       } else if (q.type === "text") {
//         if (typeof q.grader === "function") {
//           awarded = q.grader(user) * marks;
//         }
//       }
//       perQuestion.push({ id: q.id, awarded, marks });
//       score += awarded;
//     });
//     return { score, maxScore, perQuestion };
//   }

//   // /exam index: subject/chapter selection
//   return (
//     <SessionGate>
//     <div className="min-h-screen bg-gray-50 text-slate-900">
//       <div className="max-w-3xl mx-auto p-4 sm:p-6">
//         {courseId ? (
//           <div className="mb-4 p-3 rounded-lg border bg-white flex items-center justify-between">
//             <div className="text-sm text-slate-700">
//               <div className="font-medium">Active Course</div>
//               {course?.course_title ? (
//                 <div className="text-slate-600">{course.course_title}</div>
//               ) : (
//                 <div className="text-slate-500">Loading…</div>
//               )}
//             </div>
//             <div className="font-mono text-sm">#{courseId}</div>
//           </div>
//         ) : (
//           <div className="mb-4 p-3 rounded-lg border bg-yellow-50 text-yellow-800 text-sm">
//             No course selected. Start from the main app or the home page to link a course.
//           </div>
//         )}
//         {/* <div className="mb-6">
//           <h1 className="text-2xl font-bold">Choose a Subject</h1>
//           <p className="text-slate-600 text-sm">Pick a chapter to start the exam</p>
//         </div>

//         <div className="space-y-6">
//           {subjects.map((subject) => (
//             <div key={subject.id} className="bg-white rounded-2xl p-6 shadow-xl shadow-sm border">
//               <div className="flex items-center justify-between gap-3 mb-2">
//                 <h2 className="text-lg font-semibold">{subject.name}</h2>
//                 <button
//                   className="px-3 py-1.5 rounded border bg-white hover:bg-gray-50 text-sm"
//                   onClick={() => toggleSubject(subject.id)}
//                 >
//                   {openSubjectId === subject.id ? 'Hide Chapters' : 'Show Chapters'}
//                 </button>
//               </div>

//               {openSubjectId === subject.id && (
//                 <div className="mt-3 space-y-3">
//                   {subject.chapters.map((chap) => (
//                     <div
//                       key={chap.id}
//                       className="flex items-center justify-between gap-3 border rounded-lg p-3 hover:bg-gray-50"
//                     >
//                       <div className="text-slate-800">{chap.name}</div>
//                       <button
//                         type="button"
//                         onClick={() => {
//                           const path = `/exam/${subject.slug || subject.id}/${chap.slug || chap.id}`;
//                           const url = courseId ? `${path}?courseId=${encodeURIComponent(courseId)}` : path;
//                           router.push(url);
//                         }}
//                         className="px-4 py-2 rounded bg-blue-700 text-white hover:bg-blue-800 shadow"
//                       >
//                         Start Test
//                       </button>
//                     </div>
//                   ))}
//                 </div>
//               )}
//             </div>
//           ))}
//         </div> */}
//       </div>
//     </div>
//     </SessionGate>
//   );
// }

"use client"

import React, { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { subjects } from "./data";
import { SessionGate } from "@/components/SessionGate";
import { useSearchParams } from "next/navigation";

// NOTE: This component only performs a single network request: a POST to
// `${process.env.NEXT_PUBLIC_NEXT_BACK_API}/course/${courseId}` with body { course_id }
// Make sure to define NEXT_PUBLIC_NEXT_BACK_API in your environment (.env.local):
// NEXT_PUBLIC_NEXT_BACK_API=https://api.example.com

export default function QuizExam({
  questions = [],
  timeLimit = 15 * 60,
  onSubmit = (res) => console.log("Quiz results", res),
  allowReview = true,
  shuffle = false,
}) {
  const router = useRouter();
  const search = useSearchParams();
  const [courseId, setCourseId] = useState("");
  const [openSubjectId, setOpenSubjectId] = useState(null);
  const [course, setCourse] = useState(null);
  const [selectedModuleIdx, setSelectedModuleIdx] = useState(0);

  // --- quiz state (kept but networking removed except course fetch) ---
  const [order, setOrder] = useState([]);
  const [answers, setAnswers] = useState({});
  const [current, setCurrent] = useState(0);
  const [started, setStarted] = useState(false);
  const [finished, setFinished] = useState(false);
  const [remaining, setRemaining] = useState(timeLimit);
  const timerRef = useRef(null);

  useEffect(() => {
    if (questions && questions.length) {
      const idx = questions.map((_, i) => i);
      if (shuffle) {
        for (let i = idx.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [idx[i], idx[j]] = [idx[j], idx[i]];
        }
      }
      setOrder(idx);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Read courseId from query or sessionStorage and persist
  useEffect(() => {
    try {
      const q = search?.get("courseId");
      if (q && q !== courseId) {
        setCourseId(q);
        sessionStorage.setItem("activeCourseId", q);
      } else if (!q) {
        const stored = sessionStorage.getItem("activeCourseId") || "";
        if (stored && stored !== courseId) setCourseId(stored);
      }
    } catch {}
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search]);

  // Fetch course details using GET to `${NEXT_PUBLIC_NEXT_BACK_API}/api/course/${courseId}`
  useEffect(() => {
    let cancelled = false;
    (async () => {
      if (!courseId) return;
      const API_BASE = process.env.NEXT_PUBLIC_NEXT_BACK_API || "";
      if (!API_BASE) {
        console.error("NEXT_PUBLIC_NEXT_BACK_API is not set");
        return;
      }
      const url = `${API_BASE.replace(/\/$/, "")}/api/course/${encodeURIComponent(courseId)}`;
      try {
        const res = await fetch(url, {
          method: "GET",
          credentials: "include",
        });
        if (!res.ok) {
          const text = await res.text();
          console.error("Failed to fetch course:", res.status, text);
          return;
        }
        const data = await res.json();
        if (!cancelled) setCourse(data || null);
        // default to first module
        if (data && Array.isArray(data.modules) && data.modules.length > 0) {
          setSelectedModuleIdx(0);
        }
      } catch (e) {
        console.error("Network error while fetching course:", e);
      }
    })();
    return () => { cancelled = true; };
  }, [courseId]);

  const toggleSubject = (id) => setOpenSubjectId((prev) => (prev === id ? null : id));

  // --- simplified quiz flow (no network calls except course fetch) ---
  useEffect(() => {
    if (started && timeLimit) {
      timerRef.current = setInterval(() => {
        setRemaining((r) => {
          if (r === 1) {
            clearInterval(timerRef.current);
            handleFinish();
            return 0;
          }
          return r - 1;
        });
      }, 1000);
      return () => clearInterval(timerRef.current);
    }
  }, [started, timeLimit]);

  function startQuiz() {
    setStarted(true);
    setFinished(false);
    setRemaining(timeLimit);
    setCurrent(0);
  }

  function handleAnswerChange(qIndex, value) {
    const q = questions[qIndex];
    setAnswers((prev) => {
      const copy = { ...prev };
      if (q?.type === "multiple") {
        const prevSet = new Set(copy[q.id] || []);
        if (prevSet.has(value)) prevSet.delete(value);
        else prevSet.add(value);
        copy[q.id] = Array.from(prevSet);
      } else if (q?.type === "single") {
        copy[q.id] = value;
      } else {
        copy[q.id] = value;
      }
      return copy;
    });
  }

  function handleFinish() {
    clearInterval(timerRef.current);
    setFinished(true);
    setStarted(false);
    // local grading (if questions provided)
    const result = gradeQuiz(questions, answers);
    const payload = { answers, result, submittedAt: new Date().toISOString() };
    try { localStorage.setItem("latestQuizResult", JSON.stringify(payload)); } catch (e) {}
    onSubmit(payload);
  }

  function gradeQuiz(qs, ans) {
    let score = 0;
    let maxScore = 0;
    const perQuestion = [];
    qs.forEach((q) => {
      const marks = q.marks || 1;
      maxScore += marks;
      let awarded = 0;
      const user = ans[q.id];
      if (q.type === "single") {
        if (user !== undefined && user === q.correct) awarded = marks;
      } else if (q.type === "multiple") {
        const correctSet = new Set(q.correct || []);
        const userSet = new Set(user || []);
        if (userSet.size === 0) awarded = 0;
        else {
          let right = 0;
          let wrong = 0;
          userSet.forEach((u) => (correctSet.has(u) ? right++ : wrong++));
          awarded = Math.max(0, (right - wrong) / correctSet.size) * marks;
        }
      } else if (q.type === "text") {
        if (typeof q.grader === "function") {
          awarded = q.grader(user) * marks;
        }
      }
      perQuestion.push({ id: q.id, awarded, marks });
      score += awarded;
    });
    return { score, maxScore, perQuestion };
  }

  return (
    <SessionGate>
      <div className="min-h-screen bg-gray-50 text-slate-900">
        <div className="max-w-3xl mx-auto p-4 sm:p-6">
          {courseId ? (
            <div className="mb-4 p-3 rounded-lg border bg-white flex items-center justify-between">
              <div className="text-sm text-slate-700">
                <div className="font-medium">Active Course</div>
                {course?.course_title ? (
                  <div className="text-slate-600">{course.course_title}</div>
                ) : (
                  <div className="text-slate-500">Loading…</div>
                )}
              </div>
              <div className="font-mono text-sm">#{courseId}</div>
            </div>
          ) : (
            <div className="mb-4 p-3 rounded-lg border bg-yellow-50 text-yellow-800 text-sm">
              No course selected. Start from the main app or the home page to link a course.
            </div>
          )}

          <div className="mb-6">
            <h1 className="text-2xl font-bold">Choose a Subject</h1>
            <p className="text-slate-600 text-sm">Pick a chapter to start the exam</p>
          </div>

          {/* Course module dropdown (titles) */}
          {course && Array.isArray(course.modules) && (
            <div className="mb-6 bg-white p-4 rounded-lg border">
              <label className="block text-sm font-medium text-slate-700 mb-2">Select Module</label>
              <select
                value={selectedModuleIdx}
                onChange={(e) => setSelectedModuleIdx(Number(e.target.value))}
                className="w-full rounded p-2 border"
              >
                {course.modules.map((m, idx) => (
                  <option key={idx} value={idx}>{`${m.week ? `Week ${m.week} — ` : ""}${m.title}`}</option>
                ))}
              </select>

              {/* show subtopics of selected module */}
              <div className="mt-4">
                <h3 className="font-semibold">Module: {course.modules[selectedModuleIdx]?.title}</h3>
                <ul className="mt-2 space-y-2">
                  {(course.modules[selectedModuleIdx]?.sub_topics || []).map((st, i) => (
                    <li key={i} className="p-2 border rounded bg-gray-50">
                      <div className="font-medium">{st.title}</div>
                      <div className="text-sm mt-1 text-slate-700 whitespace-pre-wrap">{st.content?.slice(0, 400)}{st.content && st.content.length > 400 ? '…' : ''}</div>
                    </li>
                  ))}
                </ul>

                <div className="mt-4 flex gap-2">
                  <button
                    onClick={() => startQuiz()}
                    className="px-4 py-2 rounded bg-blue-700 text-white hover:bg-blue-800"
                  >
                    Start Test (local)
                  </button>
                  {/* <Link href="/" className="px-4 py-2 rounded border bg-white">
                    Back to Home
                  </Link> */}
                </div>
              </div>
            </div>
          )}

          {/* <div className="space-y-6">
            {subjects.map((subject) => (
              <div key={subject.id} className="bg-white rounded-2xl p-6 shadow-xl shadow-sm border">
                <div className="flex items-center justify-between gap-3 mb-2">
                  <h2 className="text-lg font-semibold">{subject.name}</h2>
                  <button
                    className="px-3 py-1.5 rounded border bg-white hover:bg-gray-50 text-sm"
                    onClick={() => toggleSubject(subject.id)}
                  >
                    {openSubjectId === subject.id ? 'Hide Chapters' : 'Show Chapters'}
                  </button>
                </div>

                {openSubjectId === subject.id && (
                  <div className="mt-3 space-y-3">
                    {subject.chapters.map((chap) => (
                      <div
                        key={chap.id}
                        className="flex items-center justify-between gap-3 border rounded-lg p-3 hover:bg-gray-50"
                      >
                        <div className="text-slate-800">{chap.name}</div>
                        <button
                          type="button"
                          onClick={() => {
                            const path = `/exam/${subject.slug || subject.id}/${chap.slug || chap.id}`;
                            const url = courseId ? `${path}?courseId=${encodeURIComponent(courseId)}` : path;
                            router.push(url);
                          }}
                          className="px-4 py-2 rounded bg-blue-700 text-white hover:bg-blue-800 shadow"
                        >
                          Start Test
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div> */}
        </div>
      </div>
    </SessionGate>
  );
}
