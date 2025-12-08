// import { useRef, useState, useEffect } from "react";
// import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { Link, useLocation } from "wouter";
// import Navigation from "@/components/navigation";
// import { ArrowLeft, Upload, FileText, Sparkles, Crown, CheckCircle, Zap, X } from 'lucide-react';
//   const [error, setError] = useState<string | null>(null);

//   // drag state for upload area
//   const [dragOver, setDragOver] = useState(false);
//   const fileInputRef = useRef<HTMLInputElement | null>(null);

//   // File handling (drag & drop and file input)
//   const handleFiles = (fileList: FileList | null) => {
//     if (!fileList) return;
//     const arr = Array.from(fileList).filter((f) => f.type === "application/pdf");
//     if (arr.length === 0) {
//       setError("Please select PDF files only.");
//       return;
//     }
//     setError(null);
//     setFiles(arr);
//   };

//   const removeFile = (idx: number) => {
//     const next = files.slice();
//     next.splice(idx, 1);
//     setFiles(next);
//   };

//   // Form submit - redirect to payment instead of processing
//   async function handleSubmit(e: React.FormEvent) {
//     e.preventDefault();
    
//     try {
//       if (files.length === 0) throw new Error("Please select at least one PDF file");
//       if (!courseName.trim()) throw new Error("Please enter a course name");

//       // Redirect to payment page instead of processing
//       setLocation("/payment");
//     } catch (e: any) {
//       setError(e?.message || "Please check your inputs");
//     }
//   }

//   // Drag and drop handlers
//   const handleDragOver = (e: React.DragEvent) => {
//     e.preventDefault();
//     setDragOver(true);
//   };

//   const handleDragLeave = (e: React.DragEvent) => {
//     e.preventDefault();
//     setDragOver(false);
//   };

//   const handleDrop = (e: React.DragEvent) => {
//     e.preventDefault();
//     setDragOver(false);
//     handleFiles(e.dataTransfer.files);
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50">
//       <Navigation />
      
//       <div className="pt-20 pb-12 px-4 sm:px-6 lg:px-8">
//         <div className="max-w-4xl mx-auto">
//           {/* Header */}
//           <div className="text-center mb-12">
//             <div className="flex items-center justify-center mb-6">
//               {/* <div className="p-3 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 text-white">
//                 <Upload className="w-8 h-8" />
//               </div> */}
//             </div>
//             {/* <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
//               Transform Your Content with AI
//             </h1> */}
//             <p className="text-xl text-gray-600 max-w-2xl mx-auto">
//               Upload your PDF materials and let ProfessorsAI create engaging, structured courses automatically.
//             </p>
//           </div>

//           {/* Upload Form */}
//           <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
//             <CardHeader>
//               <CardTitle className="text-2xl font-bold text-center text-gray-900">
//                 Upload Your Educational Content
//               </CardTitle>
//             </CardHeader>
            
//             <CardContent className="space-y-6">
//               <form onSubmit={handleSubmit} className="space-y-6">
//                 {/* Course Name */}
//                 <div>
//                   <Label htmlFor="courseName" className="text-base font-semibold text-gray-900">
//                     Course Name
//                   </Label>
//                   <Input
//                     id="courseName"
//                     type="text"
//                     placeholder="Enter your course name"
//                     value={courseName}
//                     onChange={(e) => setCourseName(e.target.value)}
//                     className="mt-2 text-lg py-3"
//                     required
//                   />
//                 </div>

//                 {/* File Upload Area */}
//                 <div>
//                   <Label className="text-base font-semibold text-gray-900 mb-4 block">
//                     Upload PDF Files
//                   </Label>
                  
//                   <div
//                     className={`border-2 border-dashed rounded-xl p-8 text-center transition-all duration-300 ${
//                       dragOver
//                         ? 'border-blue-500 bg-blue-50'
//                         : 'border-gray-300 hover:border-gray-400 hover:bg-gray-50'
//                     }`}
//                     onDragOver={handleDragOver}
//                     onDragLeave={handleDragLeave}
//                     onDrop={handleDrop}
//                   >
//                     <div className="flex flex-col items-center space-y-4">
//                       <div className="p-4 rounded-full bg-gray-100">
//                         <FileText className="w-8 h-8 text-gray-600" />
//                       </div>
//                       <div>
//                         <p className="text-lg font-medium text-gray-900 mb-2">
//                           Drag and drop your PDF files here
//                         </p>
//                         <p className="text-gray-600 mb-4">or</p>
//                         <Button
//                           type="button"
//                           variant="outline"
//                           onClick={() => fileInputRef.current?.click()}
//                           className="border-2 border-blue-500 text-blue-600 hover:bg-blue-50"
//                         >
//                           Browse Files
//                         </Button>
//                       </div>
//                     </div>
                    
//                     <input
//                       ref={fileInputRef}
//                       type="file"
//                       multiple
//                       accept=".pdf"
//                       onChange={(e) => handleFiles(e.target.files)}
//                       className="hidden"
//                     />
//                   </div>
//                 </div>

//                 {/* Selected Files */}
//                 {files.length > 0 && (
//                   <div className="space-y-3">
//                     <Label className="text-base font-semibold text-gray-900">
//                       Selected Files ({files.length})
//                     </Label>
//                     <div className="space-y-2 max-h-40 overflow-y-auto">
//                       {files.map((file, idx) => (
//                         <div
//                           key={idx}
//                           className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
//                         >
//                           <div className="flex items-center space-x-3">
//                             <FileText className="w-5 h-5 text-red-500" />
//                             <span className="text-sm font-medium text-gray-900">
//                               {file.name}
//                             </span>
//                             <span className="text-xs text-gray-500">
//                               ({(file.size / 1024 / 1024).toFixed(1)} MB)
//                             </span>
//                           </div>
//                           <Button
//                             type="button"
//                             variant="ghost"
//                             size="sm"
//                             onClick={() => removeFile(idx)}
//                             className="text-red-600 hover:text-red-700 hover:bg-red-50"
//                           >
//                             Remove
//                           </Button>
//                         </div>
//                       ))}
//                     </div>
//                   </div>
//                 )}

//                 {/* Error Message */}
//                 {error && (
//                   <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
//                     <p className="text-red-700 font-medium">{error}</p>
//                   </div>
//                 )}

//                 {/* Submit Button */}
//                 <div className="pt-4">
//                   <Button
//                     type="submit"
//                     className="w-full py-4 text-lg font-semibold bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-xl transition-all duration-300 transform hover:scale-[1.02]"
//                   >
//                     <Sparkles className="w-5 h-5 mr-2" />
//                     Generate Course with AI
//                   </Button>
                  
//                   <p className="text-center text-sm text-gray-500 mt-3">
//                     You'll be redirected to choose a plan before processing begins
//                   </p>
//                 </div>
//               </form>
//             </CardContent>
//           </Card>

//           {/* Features Preview */}
//           <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
//             <div className="text-center p-6 bg-white/60 backdrop-blur-sm rounded-xl border border-white/20">
//               <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
//                 <Zap className="w-6 h-6 text-blue-600" />
//               </div>
//               <h3 className="font-semibold text-gray-900 mb-2">AI-Powered Processing</h3>
//               <p className="text-gray-600 text-sm">Advanced AI analyzes your content and creates structured courses</p>
//             </div>
            
//             <div className="text-center p-6 bg-white/60 backdrop-blur-sm rounded-xl border border-white/20">
//               <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
//                 <CheckCircle className="w-6 h-6 text-green-600" />
//               </div>
//               <h3 className="font-semibold text-gray-900 mb-2">Instant Results</h3>
//               <p className="text-gray-600 text-sm">Get your complete course with quizzes and assessments in minutes</p>
//             </div>
            
//             <div className="text-center p-6 bg-white/60 backdrop-blur-sm rounded-xl border border-white/20">
//               <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
//                 <Crown className="w-6 h-6 text-purple-600" />
//               </div>
//               <h3 className="font-semibold text-gray-900 mb-2">Professional Quality</h3>
//               <p className="text-gray-600 text-sm">Enterprise-grade course generation with customizable options</p>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }


import { useEffect, useRef, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link } from "wouter";
import { AuthNavbar } from "@/components/auth-navbar";
import { Eye, EyeOff, ArrowLeft, Mail, Lock, BookOpen, AlertTriangle } from 'lucide-react';

// Helper function to build absolute URL from VITE_API_BASE
const buildApiUrl = (path: string): string => {
  const apiBase = import.meta.env.VITE_API_BASE as string | undefined;
  if (!apiBase) throw new Error("Missing VITE_API_BASE in environment");
  
  // If apiBase is already absolute, use it directly
  if (apiBase.startsWith('http://') || apiBase.startsWith('https://')) {
    return `${apiBase}${path}`;
  }
  
  // If relative, construct absolute URL using current window location
  const protocol = window.location.protocol;
  const host = window.location.host;
  return `${protocol}//${host}${apiBase}${path}`;
};

export default function TeacherUploadPage() {
  const [authChecked, setAuthChecked] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
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
        
        if (!cancelled) {
          const authenticated = res.ok && data?.authenticated;
          const teacher = authenticated && String(data.user?.role || "").toLowerCase() === "teacher";
          
          setIsAuthenticated(authenticated);
          setIsTeacher(teacher);
          setAuthChecked(true);
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
    setProgressVisible(false);
    setDetailedProgressVisible(false);
    setProgressPct(0);
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
      // Check if user is authenticated
      if (!isAuthenticated) {
        setError("You must be signed in to upload files.");
        window.location.href = "/signin/student";
        return;
      }

      // Check if user is a teacher
      if (!isTeacher) {
        setError("You are not authorized to upload files. Only teachers can create courses.");
        window.location.href = "/";
        return;
      }

      if (files.length === 0) throw new Error("Please select at least one PDF file");
      if (!courseName.trim()) throw new Error("Please enter a course name");

      // Create FormData and append files + course_title + priority
      const fd = new FormData();
      files.forEach((f) => {
        // key "files" used in your HTML sample
        fd.append("files", f, f.name);
      });
      fd.append("course_title", courseName.trim());
      fd.append("priority", "1");

      // Prepare abort controller
      controllerRef.current = new AbortController();

      // Start progress simulation and UI
      startProgress();

      // IMPORTANT: do NOT set Content-Type header when posting FormData;
      // browser will set the multipart boundary automatically.
      const apiUrl = buildApiUrl('/api/upload-pdfs');
      const res = await fetch(apiUrl, {
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
      const id = data?.course_id;
      if (id) {
        window.location.href = `/course/${encodeURIComponent(String(id))}`;
      } else {
        window.location.href = "/courses";
      }
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

              {/* Authorization warning for non-teachers */}
              {authChecked && !isTeacher && (
                <div className="flex items-start gap-3 p-4 bg-amber-50 border border-amber-200 rounded-lg">
                  <AlertTriangle className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
                  <div className="text-amber-800">
                    <p className="font-medium">Teacher Access Required</p>
                    <p className="text-sm mt-1">
                      Only teachers can upload and create courses. If you're a teacher, please {!isAuthenticated ? "sign in with your teacher account" : "contact support to update your account role"}.
                    </p>
                  </div>
                </div>
              )}

              {/* Inline alerts */}
              {error && <div className="text-red-600 text-sm p-2 bg-red-50 border border-red-100 rounded">{error}</div>}
              {success && <div className="text-green-700 text-sm p-2 bg-green-50 border border-green-100 rounded">{success}</div>}

              <div className="flex items-center gap-3">
                <Button
                  type="submit"
                  className="bg-black text-white hover:scale-110 hover:shadow-2xl hover:bg-black transition-all duration-300"
                  disabled={submitting || !isAuthenticated || !isTeacher}
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
