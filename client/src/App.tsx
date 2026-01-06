import { Switch, Route } from "wouter";
import { lazy, Suspense } from "react";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/contexts/AuthContext";
import { SetPasswordModal } from "@/components/set-password-modal";
import { IndiaAIPopup } from "@/components/india-ai-popup";

// Eager load critical pages
import Home from "@/pages/home";
import NotFound from "@/pages/not-found";

// Lazy load non-critical pages
const Signup = lazy(() => import("@/pages/signup"));
const Dashboard = lazy(() => import("@/pages/Dashboard"));
const SignInTeacher = lazy(() => import("@/pages/signin-teacher"));
const SignInStudent = lazy(() => import("@/pages/signin-student"));
const ForgotPassword = lazy(() => import("@/pages/forgot-password"));
const PostAuthPage = lazy(() => import("@/pages/post-auth"));
const CoursesPage = lazy(() => import("@/pages/courses"));
const TeacherUploadPage = lazy(() => import("@/pages/teacher-upload"));
const CoursePage = lazy(() => import("@/pages/course"));
const TermsPage = lazy(() => import("@/pages/terms"));
const CourseQuizPage = lazy(() => import("@/pages/course-quiz"));
const UnlockCoursePage = lazy(() => import("@/pages/unlock-course"));
const HowItWorks = lazy(() => import("@/pages/how-it-works"));
const OrganizationContact = lazy(() => import("@/pages/organization-contact"));
const PaymentPage = lazy(() => import("@/pages/payment"));
const TeachPage = lazy(() => import("@/pages/teach"));
const ProfAIBusinessPage = lazy(() => import("@/pages/profai-business"));
const CareerGPTPage = lazy(() => import("@/pages/career-gpt"));
const CourseProgressPage = lazy(() => import("@/pages/india-ai-course"));
const CourseManager = lazy(() => import("@/pages/admin/course-manager"));
const IndiaAIMissionPage = lazy(() => import("@/pages/india-ai-mission"));
const SuggestionsPage = lazy(() => import("@/pages/suggestions"));
const ComparisonPage = lazy(() => import("@/pages/comparison"));
const EducationSuitePage = lazy(() => import("@/pages/products-api"));
const TeamPage = lazy(() => import("@/pages/team"));
const AboutPage = lazy(() => import("@/pages/about"));

// Loading fallback component
const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
    <div className="text-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
      <p className="text-gray-600">Loading...</p>
    </div>
  </div>
);

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home}/>
      <Route path="/signup" component={Signup } />
      <Route path="/terms" component={TermsPage} />
      <Route path="/signin/teacher" component={SignInTeacher} />
      <Route path="/signin/student" component={SignInStudent} />
      <Route path="/forgot-password" component={ForgotPassword} />
      <Route path="/post-auth" component={PostAuthPage} />
      <Route path="/courses" component={CoursesPage} />
      <Route path="/teacher/upload" component={TeacherUploadPage} />
      <Route path="/teacher-upload" component={TeacherUploadPage} />
      <Route path="/how-it-works" component={HowItWorks} />
      <Route path="/team" component={TeamPage} />
      <Route path="/about" component={AboutPage} />
      <Route path="/organization-contact" component={OrganizationContact} />
      <Route path="/payment" component={PaymentPage} />
      <Route path="/teach" component={TeachPage} />
      <Route path="/profai-business" component={ProfAIBusinessPage} />
      <Route path="/career-gpt" component={CareerGPTPage} />
      <Route path="/india-ai-course" component={CourseProgressPage} />
      <Route path="/india-ai-mission" component={IndiaAIMissionPage} />
      <Route path="/suggestions" component={SuggestionsPage} />
      <Route path="/comparison" component={ComparisonPage} />
      <Route path="/education-suite/api" component={EducationSuitePage} />
      <Route path="/education-suite/product" component={ProfAIBusinessPage} />
      <Route path="/admin/course-manager" component={CourseManager} />
      <Route path="/course/:id" component={CoursePage} />
      <Route path="/unlock-course" component={UnlockCoursePage} />
      <Route path="/course/:id/quiz/:quizId" component={CourseQuizPage} />
      <Route path="/dashboard" component={Dashboard}/>
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <SetPasswordModal />
          <IndiaAIPopup />
          <Suspense fallback={<PageLoader />}>
            <Router />
          </Suspense>
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;

