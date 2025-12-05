// import { useRef, useState } from "react";
// import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { Link, useLocation } from "wouter";
// import Navigation from "@/components/navigation";
// import { ArrowLeft, Upload, FileText, Sparkles, Crown, CheckCircle, Zap } from 'lucide-react';

// export default function TeacherUploadPage() {
//   const [, setLocation] = useLocation();
//   const [courseName, setCourseName] = useState("");
//   const [files, setFiles] = useState<File[]>([]);
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
//               <div className="p-3 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 text-white">
//                 <Upload className="w-8 h-8" />
//               </div>
//             </div>
//             <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
//               Transform Your Content with AI
//             </h1>
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
