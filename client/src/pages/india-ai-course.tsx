import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { storeRedirectUrl } from "@/lib/auth-redirect";
import { AuthNavbar } from "@/components/auth-navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { VimeoPlayer } from "@/components/VimeoPlayer";
import { CheckCircle2, ChevronRight, Clock, Download, PlayCircle, Lock, Award, BookOpen } from "lucide-react";

// Types
interface Lesson {
  id: string;
  title: string;
  duration: string;
  completed: boolean;
  vimeoId?: string; // Optional Vimeo video ID
  type: "video" | "reading" | "quiz";
}

interface Module {
  id: string;
  title: string;
  description: string;
  lessons: Lesson[];
}

interface Course {
  title: string;
  description: string;
  instructor: string;
  thumbnail?: string;
}

// Course Information
const DEMO_COURSE: Course = {
  title: "Yuva AI for All",
  description: "A foundation course designed to democratise AI literacy across India by enabling every learner to understand, use, and benefit from AI responsibly.",
  instructor: "IndiaAI Mission",
  thumbnail: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&h=400&fit=crop"
};

/**
 * ============================================
 * HOW TO ADD YOUR VIMEO VIDEOS
 * ============================================
 * 
 * 1. Go to your Vimeo video
 * 2. The URL will look like: https://vimeo.com/123456789
 * 3. Copy the number (123456789) - this is your vimeoId
 * 4. Replace the placeholder vimeoId below with your actual ID
 * 
 * Example:
 *   vimeoId: "123456789"
 * 
 * For private/unlisted videos, you may need the hash:
 *   URL: https://vimeo.com/123456789/abcdef1234
 *   vimeoId: "123456789/abcdef1234"
 * ============================================
 */

const DEMO_MODULES: Module[] = [
  // ==================== MODULE 1 ====================
  {
    id: "module-1",
    title: "What is Artificial Intelligence?",
    description: "Learn what AI really means, how it has evolved over time, and where you can already see it in your daily life",
    lessons: [
      { id: "m1-v1", title: "Module 1A: Introduction to AI & Machine Learning", duration: "10:00", completed: false, vimeoId: "1141840737", type: "video" },
      { id: "m1-v2", title: "Module 1B: Evolution of AI", duration: "10:00", completed: false, vimeoId: "1141840888", type: "video" },
      { id: "m1-v3", title: "Module 1C: AI in Daily Life", duration: "10:00", completed: false, vimeoId: "1141840894", type: "video" },
      { id: "m1-v4", title: "Module 1D: AI Capabilities & Limitations", duration: "10:00", completed: false, vimeoId: "1141840905?fl=tl&fe=ec", type: "video" },
      // { id: "m1-q1", title: "Assessments", duration: "5:00", completed: false, type: "quiz" },
    ]
  },
  
  // ==================== MODULE 2 ====================
  {
    id: "module-2",
    title: "The Technology Behind Artificial Intelligence",
    description: "Understand how machines learn, what Generative AI is, and how to communicate effectively with AI tools using the CRAFT formula",
    lessons: [
      { id: "m2-v1", title: "Module 2A: Learn the Language of AI", duration: "10:00", completed: false, vimeoId: "1141840913?fl=tl&fe=ec", type: "video" },
      { id: "m2-v2", title: "Module 2B: How Machines Learn", duration: "12:00", completed: false, vimeoId: "1141840920?fl=tl&fe=ec", type: "video" },
      { id: "m2-v3", title: "Module 2C: Introduction to Generative AI", duration: "12:00", completed: false, vimeoId: "1141840931?fl=tl&fe=ec", type: "video" },
      { id: "m2-v4", title: "Module 2D: Prompt Engineering & the CRAFT Formula", duration: "12:00", completed: false, vimeoId: "1141840937?fl=tl&fe=ec", type: "video" },
      // { id: "m2-q1", title: "Assessments", duration: "5:00", completed: false, type: "quiz" },
    ]
  },
  
  // ==================== MODULE 3 ====================
  {
    id: "module-3",
    title: "Using Artificial Intelligence to Learn and Create",
    description: "Explore popular GenAI tools and discover how AI can help you study better, create content, summarise information, and analyse data",
    lessons: [
      { id: "m3-v1", title: "Module 3A: Popular AI Tools", duration: "10:00", completed: false, vimeoId: "1141840944?fl=tl&fe=ec", type: "video" },
      { id: "m3-v2", title: "Module 3B: Demo - Use the CRAFT Formula to Learn Better", duration: "12:00", completed: false, vimeoId: "1141840950?fl=tl&fe=ec", type: "video" },
      { id: "m3-v3", title: "Module 3C: Demo - Use the CRAFT Formula to Create Content", duration: "12:00", completed: false, vimeoId: "1141840963?fl=tl&fe=ec", type: "video" },
      { id: "m3-v4", title: "Module 3D: Demo - Use the CRAFT Formula to Analyse Data", duration: "12:00", completed: false, vimeoId: "1141840973?fl=tl&fe=ec", type: "video" },
      // { id: "m3-q1", title: "Assessments", duration: "5:00", completed: false, type: "quiz" },
    ]
  },
  
  // ==================== MODULE 4 ====================
  {
    id: "module-4",
    title: "Using Artificial Intelligence to Think and Plan",
    description: "Learn how AI can act as a thinking partner — helping you plan projects, draft ideas, solve problems, and make better decisions",
    lessons: [
      { id: "m4-v1", title: "Module 4A: Demo - Using AI as a Thinking Partner", duration: "12:00", completed: false, vimeoId: "1141840979?fl=tl&fe=ec", type: "video" },
      { id: "m4-v2", title: "Module 4B: Demo - Using AI as a Planning Assistant", duration: "12:00", completed: false, vimeoId: "1141840988?fl=tl&fe=ec", type: "video" },
      // { id: "m4-q1", title: "Assessments", duration: "5:00", completed: false, type: "quiz" },
    ]
  },
  
  // ==================== MODULE 5 ====================
  {
    id: "module-5",
    title: "Artificial Intelligence Ethics",
    description: "Understand why responsible AI use matters — learn the principles of AI ethics, risks, and how the FAST framework ensures safe technology usage",
    lessons: [
      { id: "m5-v1", title: "Module 5A: Principles of AI Ethics & Introduction to the FAST Framework", duration: "12:00", completed: false, vimeoId: "1141840995?fl=tl&fe=ec", type: "video" },
      { id: "m5-v2", title: "Module 5B: AI & Ethical Concerns", duration: "12:00", completed: false, vimeoId: "1141841005?fl=tl&fe=ec", type: "video" },
      { id: "m5-v3", title: "Module 5C: Regulation of AI", duration: "12:00", completed: false, vimeoId: "1141841014?fl=tl&fe=ec", type: "video" },
      // { id: "m5-q1", title: "Assessments", duration: "5:00", completed: false, type: "quiz" },
    ]
  },
  
  // ==================== MODULE 6 ====================
  {
    id: "module-6",
    title: "The Future of Artificial Intelligence",
    description: "Explore key AI trends and opportunities for your future — how AI will shape careers, industries, and daily life",
    lessons: [
      { id: "m6-v1", title: "Module 6A: Key Trends in AI", duration: "10:00", completed: false, vimeoId: "1141841026?fl=tl&fe=ec", type: "video" },
      { id: "m6-v2", title: "Module 6B: AI & Your Future", duration: "10:00", completed: false, vimeoId: "1141841037?fl=tl&fe=ec", type: "video" },
      // { id: "m6-q1", title: "Assessments", duration: "5:00", completed: false, type: "quiz" },
    ]
  }
];

const STORAGE_PREFIX = "course-progress";

export default function CourseProgressPage() {
  const [modules, setModules] = useState<Module[]>([]);
  const [currentLesson, setCurrentLesson] = useState<{ moduleId: string; lessonId: string } | null>(null);
  const { toast } = useToast();
  const { currentUser, loading } = useAuth();
  const [, setLocation] = useLocation();

  // Redirect to login if not authenticated
  useEffect(() => {
    if (loading) return; // Wait for auth to load
    
    if (!currentUser) {
      // Store the current URL to redirect back after login
      storeRedirectUrl();
      toast({
        title: "Authentication Required",
        description: "Please log in to access your courses.",
        variant: "destructive"
      });
      setLocation("/signin/student");
    }
  }, [currentUser, loading, setLocation, toast]);

  // Generate user-specific storage key
  const getStorageKey = () => {
    return currentUser ? `${STORAGE_PREFIX}-${currentUser.uid}` : null;
  };

  // Load progress from localStorage on mount (per user)
  useEffect(() => {
    if (!currentUser) return;
    
    const storageKey = getStorageKey();
    if (!storageKey) return;
    
    const stored = localStorage.getItem(storageKey);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        // Migrate old data: ensure all lessons have a type property
        const migratedModules = parsed.map((module: Module, moduleIndex: number) => ({
          ...module,
          lessons: module.lessons.map((lesson: Lesson, lessonIndex: number) => {
            // If lesson doesn't have a type, infer it from DEMO_MODULES or default to 'video'
            if (!lesson.type) {
              const demoModule = DEMO_MODULES[moduleIndex];
              const demoLesson = demoModule?.lessons[lessonIndex];
              return {
                ...lesson,
                type: demoLesson?.type || 'video',
                vimeoId: lesson.vimeoId || demoLesson?.vimeoId
              };
            }
            return lesson;
          })
        }));
        setModules(migratedModules);
      } catch {
        setModules(DEMO_MODULES);
      }
    } else {
      setModules(DEMO_MODULES);
    }
  }, [currentUser]);

  // Save progress to localStorage whenever modules change (per user)
  useEffect(() => {
    if (!currentUser) return;
    
    const storageKey = getStorageKey();
    if (!storageKey) return;
    
    if (modules.length > 0) {
      localStorage.setItem(storageKey, JSON.stringify(modules));
    }
  }, [modules, currentUser]);

  // Set first video lesson as current on mount
  useEffect(() => {
    if (modules.length > 0 && !currentLesson) {
      const firstModule = modules[0];
      const firstVideoLesson = firstModule.lessons.find(l => l.type === "video");
      if (firstVideoLesson) {
        setCurrentLesson({ moduleId: firstModule.id, lessonId: firstVideoLesson.id });
      }
    }
  }, [modules, currentLesson]);

  // Show loading state while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p>Checking authentication...</p>
        </div>
      </div>
    );
  }

  // Prevent rendering if not authenticated
  if (!currentUser) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p>Redirecting to login...</p>
        </div>
      </div>
    );
  }

  // Toggle lesson completion
  const toggleLessonCompletion = (moduleId: string, lessonId: string) => {
    setModules(prevModules =>
      prevModules.map(module =>
        module.id === moduleId
          ? {
              ...module,
              lessons: module.lessons.map(lesson =>
                lesson.id === lessonId
                  ? { ...lesson, completed: !lesson.completed }
                  : lesson
              )
            }
          : module
      )
    );
  };

  // Calculate progress statistics
  const totalLessons = modules.reduce((sum, module) => sum + module.lessons.length, 0);
  const completedLessons = modules.reduce(
    (sum, module) => sum + module.lessons.filter(l => l.completed).length,
    0
  );
  const progressPercentage = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;
  const allCompleted = totalLessons > 0 && completedLessons === totalLessons;

  // Calculate module-level stats
  const getModuleStats = (module: Module) => {
    const completed = module.lessons.filter(l => l.completed).length;
    const total = module.lessons.length;
    const isComplete = completed === total;
    return { completed, total, isComplete };
  };

  const completedModules = modules.filter(m => getModuleStats(m).isComplete).length;

  // Get current lesson object
  const getCurrentLesson = () => {
    if (!currentLesson) return null;
    const module = modules.find(m => m.id === currentLesson.moduleId);
    if (!module) return null;
    return module.lessons.find(l => l.id === currentLesson.lessonId);
  };

  // Select a lesson
  const selectLesson = (moduleId: string, lessonId: string) => {
    setCurrentLesson({ moduleId, lessonId });
  };

  // Get icon for lesson type
  const getLessonIcon = (type: string) => {
    switch (type) {
      case "video":
        return <PlayCircle className="h-4 w-4" />;
      case "reading":
        return <BookOpen className="h-4 w-4" />;
      case "quiz":
        return <Award className="h-4 w-4" />;
      default:
        return <PlayCircle className="h-4 w-4" />;
    }
  };

  // Handle video ended
  const handleVideoEnded = () => {
    if (!currentLesson) return;
    
    // Mark current lesson as completed
    toggleLessonCompletion(currentLesson.moduleId, currentLesson.lessonId);
    
    // Find next lesson
    const currentModule = modules.find(m => m.id === currentLesson.moduleId);
    if (!currentModule) return;
    
    const currentIndex = currentModule.lessons.findIndex(l => l.id === currentLesson.lessonId);
    if (currentIndex < currentModule.lessons.length - 1) {
      // Next lesson in same module
      const nextLesson = currentModule.lessons[currentIndex + 1];
      setCurrentLesson({ moduleId: currentModule.id, lessonId: nextLesson.id });
    } else {
      // Try next module
      const moduleIndex = modules.findIndex(m => m.id === currentModule.id);
      if (moduleIndex < modules.length - 1) {
        const nextModule = modules[moduleIndex + 1];
        if (nextModule.lessons.length > 0) {
          setCurrentLesson({ moduleId: nextModule.id, lessonId: nextModule.lessons[0].id });
        }
      }
    }
  };

  const currentLessonData = getCurrentLesson();

  // Handle certificate download
  const handleDownloadCertificate = () => {
    if (!allCompleted) {
      toast({
        title: "Certificate Locked",
        description: "Complete all lessons to unlock your certificate.",
        variant: "destructive"
      });
      return;
    }

    // Create a simple certificate page
    const certificateWindow = window.open("", "_blank");
    if (certificateWindow) {
      const completionDate = new Date().toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric"
      });

      certificateWindow.document.write(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>Certificate of Completion</title>
            <style>
              body {
                font-family: 'Georgia', serif;
                display: flex;
                justify-content: center;
                align-items: center;
                min-height: 100vh;
                margin: 0;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
              }
              .certificate {
                background: white;
                padding: 60px;
                max-width: 800px;
                border: 20px solid #f0f0f0;
                box-shadow: 0 20px 60px rgba(0,0,0,0.3);
                text-align: center;
              }
              .certificate h1 {
                font-size: 48px;
                color: #333;
                margin-bottom: 20px;
                font-weight: normal;
              }
              .certificate h2 {
                font-size: 32px;
                color: #667eea;
                margin: 30px 0;
                font-weight: bold;
              }
              .certificate p {
                font-size: 18px;
                color: #666;
                line-height: 1.8;
                margin: 20px 0;
              }
              .certificate .name {
                font-size: 36px;
                color: #333;
                font-weight: bold;
                margin: 30px 0;
                border-bottom: 2px solid #667eea;
                display: inline-block;
                padding-bottom: 10px;
              }
              .certificate .footer {
                margin-top: 50px;
                font-size: 14px;
                color: #999;
              }
              @media print {
                body { background: white; }
                .certificate { box-shadow: none; }
              }
            </style>
          </head>
          <body>
            <div class="certificate">
              <h1>🎓 Certificate of Completion</h1>
              <p>This is to certify that</p>
              <div class="name">Your Name</div>
              <p>has successfully completed the</p>
              <h2>${DEMO_COURSE.title}</h2>
              <p>Instructed by ${DEMO_COURSE.instructor}</p>
              <p>Completion Date: ${completionDate}</p>
              <div class="footer">
                <p>Professor AI Coach - Excellence in Online Education</p>
              </div>
            </div>
            <script>
              // Auto-print dialog
              setTimeout(() => window.print(), 500);
            </script>
          </body>
        </html>
      `);
      certificateWindow.document.close();
    }

    toast({
      title: "Certificate Ready!",
      description: "Your certificate has been generated. You can print or save it as PDF.",
    });
  };

  return (
    <div className="min-h-screen bg-gray-900">
      <AuthNavbar />
      
      <div className="flex h-[calc(100vh-64px)] overflow-hidden">
        {/* Sidebar - Course Content */}
        <div className="w-96 bg-gray-800 border-r border-gray-700 flex flex-col overflow-hidden">
          {/* Course Header */}
          <div className="p-6 border-b border-gray-700">
            <h1 className="text-xl font-bold text-white mb-2">{DEMO_COURSE.title}</h1>
            <p className="text-sm text-gray-400 mb-4">by {DEMO_COURSE.instructor}</p>
            
            {/* Progress */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Course Progress</span>
                <span className="text-white font-semibold">{progressPercentage}%</span>
              </div>
              <Progress value={progressPercentage} className="h-2" />
              <p className="text-xs text-gray-500">
                {completedLessons} of {totalLessons} lessons completed
              </p>
            </div>
          </div>

          {/* Lessons List */}
          <ScrollArea className="flex-1">
            <div className="p-4 space-y-4">
              {modules.map((module, moduleIndex) => {
                const stats = getModuleStats(module);
                
                return (
                  <div key={module.id} className="space-y-2">
                    {/* Module Header */}
                    <div className="flex items-center justify-between px-3 py-2 bg-gray-700/50 rounded-lg">
                      <div className="flex-1">
                        <h3 className="text-sm font-semibold text-white">
                          Module {moduleIndex + 1}: {module.title}
                        </h3>
                        <p className="text-xs text-gray-400 mt-1">
                          {stats.completed}/{stats.total} lessons
                        </p>
                      </div>
                      {stats.isComplete && (
                        <CheckCircle2 className="h-5 w-5 text-green-500" />
                      )}
                    </div>

                    {/* Lessons */}
                    <div className="space-y-1">
                      {module.lessons.map((lesson, lessonIndex) => {
                        const isActive = currentLesson?.moduleId === module.id && currentLesson?.lessonId === lesson.id;
                        const isLocked = lessonIndex > 0 && !module.lessons[lessonIndex - 1].completed;
                        
                        return (
                          <button
                            key={lesson.id}
                            onClick={() => !isLocked && selectLesson(module.id, lesson.id)}
                            disabled={isLocked}
                            className={`w-full text-left px-3 py-3 rounded-lg transition-all ${
                              isActive
                                ? "bg-primary text-white"
                                : lesson.completed
                                ? "bg-gray-700/50 text-gray-300 hover:bg-gray-700"
                                : isLocked
                                ? "bg-gray-800 text-gray-600 cursor-not-allowed"
                                : "bg-gray-800 text-gray-300 hover:bg-gray-700"
                            }`}
                          >
                            <div className="flex items-center gap-3">
                              <div className={`flex-shrink-0 ${isActive ? "text-white" : lesson.completed ? "text-green-500" : isLocked ? "text-gray-600" : "text-gray-400"}`}>
                                {isLocked ? <Lock className="h-4 w-4" /> : getLessonIcon(lesson.type)}
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className={`text-sm font-medium truncate ${isActive ? "text-white" : ""}`}>
                                  {lesson.title}
                                </p>
                                <div className="flex items-center gap-2 mt-1">
                                  <Clock className="h-3 w-3" />
                                  <span className="text-xs">{lesson.duration}</span>
                                </div>
                              </div>
                              {lesson.completed && !isActive && (
                                <CheckCircle2 className="h-4 w-4 text-green-500 flex-shrink-0" />
                              )}
                              {isActive && (
                                <ChevronRight className="h-4 w-4 flex-shrink-0" />
                              )}
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </ScrollArea>

          {/* Certificate Section */}
          <div className="px-4 py-3 border-t border-gray-600 bg-gray-800 mt-auto">
            <div className="flex items-center gap-2 mb-2">
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white truncate">
                  {allCompleted ? '🎉 Course Completed!' : 'Course Certificate'}
                </p>
                <p className="text-xs text-gray-400">
                  {allCompleted 
                    ? 'Download your certificate' 
                    : `${totalLessons - completedLessons} lesson${totalLessons - completedLessons > 1 ? 's' : ''} remaining`
                  }
                </p>
              </div>
            </div>
            <Button
              onClick={handleDownloadCertificate}
              disabled={!allCompleted}
              size="sm"
              className={`w-full ${allCompleted 
                ? 'bg-green-600 hover:bg-green-700 text-white' 
                : 'bg-gray-600 text-gray-400 cursor-not-allowed hover:bg-gray-600'}`}
            >
              <Download className="h-4 w-4 mr-2" />
              {allCompleted ? 'Download Certificate' : 'Complete to Unlock'}
            </Button>
          </div>
        </div>

        {/* Main Content - Video Player */}
        <div className="flex-1 bg-gray-900 flex flex-col">
          {currentLessonData ? (
            <>
              {/* Video Player */}
              <div className="flex-1 flex items-start justify-center bg-gray-900 pt-4">
                {currentLessonData.type === "video" && currentLessonData.vimeoId ? (
                  <div className="w-full max-w-5xl mx-auto px-4">
                    <VimeoPlayer
                      videoId={currentLessonData.vimeoId}
                      onEnded={handleVideoEnded}
                      className="shadow-2xl"
                    />
                  </div>
                ) : currentLessonData.type === "reading" ? (
                  <div className="max-w-4xl mx-auto p-8 text-white">
                    <div className="bg-gray-800 rounded-lg p-8">
                      <BookOpen className="h-12 w-12 text-primary mb-4" />
                      <h2 className="text-2xl font-bold mb-4">{currentLessonData.title}</h2>
                      <p className="text-gray-300 mb-6">
                        This is a reading material lesson. In a real implementation, you would display
                        the reading content here, such as articles, documentation, or text-based tutorials.
                      </p>
                      <Button onClick={() => toggleLessonCompletion(currentLesson!.moduleId, currentLesson!.lessonId)}>
                        {currentLessonData.completed ? "Mark as Incomplete" : "Mark as Complete"}
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="max-w-4xl mx-auto p-8 text-white">
                    <div className="bg-gray-800 rounded-lg p-8">
                      <Award className="h-12 w-12 text-primary mb-4" />
                      <h2 className="text-2xl font-bold mb-4">{currentLessonData.title}</h2>
                      <p className="text-gray-300 mb-6">
                        This is a quiz or assessment. In a real implementation, you would display
                        quiz questions and handle submissions here.
                      </p>
                      <Button onClick={() => toggleLessonCompletion(currentLesson!.moduleId, currentLesson!.lessonId)}>
                        {currentLessonData.completed ? "Retake Quiz" : "Start Quiz"}
                      </Button>
                    </div>
                  </div>
                )}
              </div>

              {/* Lesson Info Bar */}
              <div className="flex-shrink-0 bg-gray-900 border-t border-gray-800 p-4">
                <div className="max-w-5xl mx-auto">
                  <div className="flex items-center justify-between">
                    <div className="flex-1 min-w-0">
                      <h2 className="text-xl font-bold text-white mb-1 truncate">{currentLessonData.title}</h2>
                      <div className="flex items-center gap-4 text-sm text-gray-400">
                        <span className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          {currentLessonData.duration}
                        </span>
                        <span className="flex items-center gap-1">
                          {getLessonIcon(currentLessonData.type)}
                          {currentLessonData.type ? currentLessonData.type.charAt(0).toUpperCase() + currentLessonData.type.slice(1) : 'Lesson'}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 flex-shrink-0">
                      <Checkbox
                        checked={currentLessonData.completed}
                        onCheckedChange={() => toggleLessonCompletion(currentLesson!.moduleId, currentLesson!.lessonId)}
                        className="h-5 w-5 border-white data-[state=checked]:bg-white data-[state=checked]:text-gray-900"
                      />
                      <span className="text-sm text-white">Mark as complete</span>
                    </div>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center text-gray-400">
                <PlayCircle className="h-16 w-16 mx-auto mb-4 opacity-50" />
                <p>Select a lesson to start learning</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
