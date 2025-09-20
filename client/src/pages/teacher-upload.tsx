import { useEffect, useRef, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link } from "wouter";
import { AuthNavbar } from "@/components/auth-navbar";
import { Eye, EyeOff, ArrowLeft, Mail, Lock, BookOpen } from 'lucide-react';

export default function TeacherUploadPage() {
  const [authChecked, setAuthChecked] = useState(false);
  const [isTeacher, setIsTeacher] = useState(false);
  const [courseName, setCourseName] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Progress bar state
  const [progressVisible, setProgressVisible] = useState(false);
  const [progressPct, setProgressPct] = useState(0);
  const progressIntervalRef = useRef<number | null>(null);

  // detailed progress / result UI
  const [detailedProgressVisible, setDetailedProgressVisible] = useState(false);
  const [progressText, setProgressText] = useState("Starting processing...");
  const [resultData, setResultData] = useState<any>(null);

  // Abort control
  const controllerRef = useRef<AbortController | null>(null);

  // drag state for upload area
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("/api/session", { credentials: "include" });
        const data = await res.json();
        if (!res.ok || !data?.authenticated) {
          window.location.href = "/signin/teacher";
          return;
        }
        const teacher = String(data.user?.role || "").toLowerCase() === "teacher";
        if (!cancelled) {
          setIsTeacher(teacher);
          setAuthChecked(true);
          if (!teacher) {
            window.location.href = "/post-auth";
          }
        }
      } catch (e: any) {
        if (!cancelled) {
          setError(e?.message || "Failed to verify session");
          setAuthChecked(true);
        }
      }
    })();
    return () => {
      cancelled = true;
      // cleanup
      if (progressIntervalRef.current) {
        window.clearInterval(progressIntervalRef.current);
      }
      if (controllerRef.current) {
        controllerRef.current.abort();
      }
    };
  }, []);

  // Progress simulation helpers
  const startProgress = () => {
    setProgressPct(2);
    setProgressVisible(true);
    setDetailedProgressVisible(true);
    setProgressText("Extracting text from PDFs...");
    progressIntervalRef.current = window.setInterval(() => {
      setProgressPct((prev) => {
        const next = prev + Math.max(0.4, (100 - prev) * 0.035);
        const capped = next >= 90 ? 90 : Number(next.toFixed(2));
        if (capped < 30) setProgressText("Extracting text from PDFs...");
        else if (capped < 60) setProgressText("Generating curriculum structure...");
        else setProgressText("Creating course content...");
        return capped;
      });
    }, 250);
  };

  const finishProgress = (successFinish = true) => {
    if (progressIntervalRef.current) {
      window.clearInterval(progressIntervalRef.current);
      progressIntervalRef.current = null;
    }
    setProgressPct(100);
    setProgressText(successFinish ? "Processing complete!" : "Processing finished with errors");
    setTimeout(() => {
      setProgressVisible(false);
      setTimeout(() => {
        setDetailedProgressVisible(false);
        setProgressPct(0);
      }, 600);
    }, 450);
  };

  // File handling (drag & drop and file input)
  const handleFiles = (fileList: FileList | null) => {
    if (!fileList) return;
    const arr = Array.from(fileList).filter((f) => f.type === "application/pdf");
    if (arr.length === 0) {
      setError("Please select PDF files only.");
      return;
    }
    setError(null);
    setFiles(arr);
  };

  const removeFile = (idx: number) => {
    const next = files.slice();
    next.splice(idx, 1);
    setFiles(next);
  };

  // Form submit - uses FormData and appends files and course_title exactly like your HTML sample
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    setSuccess(null);
    setResultData(null);

    try {
      if (files.length === 0) throw new Error("Please select at least one PDF file");
      if (!courseName.trim()) throw new Error("Please enter a course name");

      const apiBase = import.meta.env.VITE_API_BASE as string | undefined;
      if (!apiBase) throw new Error("Missing VITE_API_BASE in environment");

      // Create FormData and append files + course_title
      const fd = new FormData();
      files.forEach((f) => {
        // key "files" used in your HTML sample
        fd.append("files", f, f.name);
      });
      fd.append("course_title", courseName.trim());

      // Prepare abort controller
      controllerRef.current = new AbortController();

      // Start progress simulation and UI
      startProgress();

      // IMPORTANT: do NOT set Content-Type header when posting FormData;
      // browser will set the multipart boundary automatically.
      const res = await fetch(`${apiBase}/api/upload-pdfs`, {
        method: "POST",
        body: fd,
        signal: controllerRef.current.signal,
        // credentials: 'include' // uncomment if your backend requires cookies/auth
      });

      if (!res.ok) {
        // try to parse JSON error response, otherwise throw generic
        const data = await res.json().catch(() => null);
        throw new Error((data && (data.error || data.detail)) || `Upload failed (${res.status})`);
      }

      const data = await res.json().catch(() => ({}));
      finishProgress(true);
      setSuccess(data?.message || `Course "${data?.course_title ?? courseName}" created`);
      setResultData(data ?? null);
      setCourseName("");
      setFiles([]);

      // navigate to created course if backend returned course_id, else to /courses
      setTimeout(() => {
        const id = data?.course_id;
        if (id) {
          window.location.href = `/course/${encodeURIComponent(String(id))}`;
        } else {
          window.location.href = "/courses";
        }
      }, 1000);
    } catch (e: any) {
      if (e?.name === "AbortError") {
        setError("Upload cancelled.");
        if (progressIntervalRef.current) {
          window.clearInterval(progressIntervalRef.current);
          progressIntervalRef.current = null;
        }
        setProgressVisible(false);
        setProgressPct(0);
      } else {
        setError(e?.message || "Upload failed");
        finishProgress(false);
      }
    } finally {
      setSubmitting(false);
      controllerRef.current = null;
    }
  }

  const handleCancel = () => {
    if (controllerRef.current) controllerRef.current.abort();
    if (progressIntervalRef.current) {
      window.clearInterval(progressIntervalRef.current);
      progressIntervalRef.current = null;
    }
    setProgressVisible(false);
    setDetailedProgressVisible(false);
    setProgressPct(0);
    setSubmitting(false);
  };

  // drag handlers
  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  };
  const onDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
  };
  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    handleFiles(e.dataTransfer.files);
  };

  if (!authChecked) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-700 bg-gradient-to-br from-gray-50 via-white to-gray-100">
        Checking access…
      </div>
    );
  }

  if (!isTeacher) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-700 bg-gray-100">
        Only teachers can access this page.
      </div>
    );
  }

  // small helper to format KB/MB
  const prettySize = (n: number) => {
    if (n < 1024) return `${n} B`;
    if (n < 1024 * 1024) return `${(n / 1024).toFixed(1)} KB`;
    return `${(n / 1024 / 1024).toFixed(2)} MB`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 text-gray-900">
      <AuthNavbar />

      {/* Top thin progress bar */}
      {/* <div
        aria-hidden={!progressVisible}
        className={`fixed left-0 right-0 z-50 transition-opacity duration-300 ${progressVisible ? "opacity-100" : "opacity-0 pointer-events-none"}`}
        style={{ top: "68px" }}
      >
        <div className="h-1 bg-transparent">
          <div className="h-1 bg-blue-600 transition-all" style={{ width: `${progressPct}%` }} />
        </div>
      </div> */}

      <div className="max-w-3xl mx-auto space-y-6 py-10 px-4">
        <div className="flex items-center justify-between">
          <Link href="/courses" className="flex items-center hover:scale-110 transition-all">
          <ArrowLeft className="w-4 h-4" />
            <Button className="">Back to Courses</Button>
          </Link>
        </div>

        <Card className="bg-white shadow-md border border-gray-200">
          <CardHeader>
            <CardTitle>Upload a New Course</CardTitle>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4" aria-live="polite" noValidate>
              <div>
                <Label htmlFor="courseName" className="text-gray-900">
                  Course Name
                </Label>
                <Input
                  id="courseName"
                  name="courseName"
                  className="bg-white border border-gray-300 text-gray-900"
                  value={courseName}
                  onChange={(e) => setCourseName(e.target.value)}
                  placeholder="e.g., Deep Learning 101"
                  required
                />
              </div>

              <div>
                <Label className="text-gray-900">Course PDFs</Label>

                {/* Upload area */}
                <div
                  onClick={() => fileInputRef.current?.click()}
                  onDragOver={onDragOver}
                  onDragLeave={onDragLeave}
                  onDrop={onDrop}
                  className={`upload-area p-6 text-center rounded-lg cursor-pointer border-2 border-dashed ${dragOver ? "border-blue-600 bg-blue-50" : "border-gray-300 bg-white"}`}
                >
                  <input
                    ref={fileInputRef}
                    id="pdfs"
                    name="pdfs"
                    type="file"
                    accept="application/pdf"
                    multiple
                    className="hidden"
                    onChange={(e) => handleFiles(e.target.files)}
                  />

                  <svg className="mx-auto h-12 w-12 text-gray-400 mb-4" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                    <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>

                  <p className="text-lg text-gray-600 mb-1">
                    <span className="font-semibold">Click to upload</span> or drag and drop
                  </p>
                  <p className="text-sm text-gray-500">PDF files only</p>
                </div>

                {/* file list */}
                {files.length > 0 && (
                  <div className="mt-4">
                    <h3 className="text-sm font-medium text-gray-700 mb-2">Selected files</h3>
                    <div className="space-y-2">
                      {files.map((f, i) => (
                        <div key={i} className="file-item bg-white border rounded-md p-3 flex items-center justify-between">
                          <div>
                            <div className="font-medium text-sm">{f.name}</div>
                            <div className="text-xs text-gray-500">{prettySize(f.size)}</div>
                          </div>
                          <div className="flex items-center gap-3">
                            <button
                              type="button"
                              onClick={() => removeFile(i)}
                              className="text-red-500 hover:text-red-700"
                              aria-label={`Remove ${f.name}`}
                            >
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                              </svg>
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Inline alerts */}
              {error && <div className="text-red-600 text-sm p-2 bg-red-50 border border-red-100 rounded">{error}</div>}
              {success && <div className="text-green-700 text-sm p-2 bg-green-50 border border-green-100 rounded">{success}</div>}

              <div className="flex items-center gap-3">
                <Button
                  type="submit"
                  className="bg-black text-white hover:scale-110 hover:shadow-2xl hover:bg-black transition-all duration-300"
                  disabled={submitting}
                >
                  {submitting ? "Uploading…" : "Generate Course"}
                </Button>

                {submitting && (
                  <button
                    type="button"
                    onClick={handleCancel}
                    className="px-3 py-2 border rounded-md text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </form>

            {/* Detailed progress card */}
            {detailedProgressVisible && (
              <div id="progressSection" className="mt-6">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-blue-800 mb-2">Processing Your Documents...</h3>
                  <div className="w-full bg-blue-200 rounded-full h-2 mb-3">
                    <div className="bg-blue-600 h-2 rounded-full transition-all duration-300" style={{ width: `${progressPct}%` }} />
                  </div>
                  <p id="detailedProgressText" className="text-sm text-blue-700">{progressText}</p>
                </div>
              </div>
            )}

            {/* Result card */}
            {resultData && (
              <div id="resultSection" className="mt-6">
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-green-800 mb-2">Course Generated Successfully!</h3>
                  <p id="resultText" className="text-green-700 mb-3">
                    Course "{resultData.course_title ?? courseName}" generated with {resultData.modules_count ?? "N/A"} modules.
                  </p>
                  <a
                    id="viewCourseBtn"
                    href={resultData.course_id ? `/course/${encodeURIComponent(String(resultData.course_id))}` : "/courses"}
                    className="inline-block px-4 py-2 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-colors"
                  >
                    View Course
                  </a>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
