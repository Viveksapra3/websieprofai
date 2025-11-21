import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/contexts/AuthContext";
import Home from "@/pages/home";
import NotFound from "@/pages/not-found";
import Signup from "@/pages/signup";
import Dashboard from "@/pages/Dashboard";
import SignInTeacher from "@/pages/signin-teacher";
import SignInStudent from "@/pages/signin-student";
import ForgotPassword from "@/pages/forgot-password";
import PostAuthPage from "@/pages/post-auth";
import CoursesPage from "@/pages/courses";
import TeacherUploadPage from "@/pages/teacher-upload";
import CoursePage from "@/pages/course";
import TermsPage from "@/pages/terms";
import CourseQuizPage from "@/pages/course-quiz";
import UnlockCoursePage from "@/pages/unlock-course";
import HowItWorks from "@/pages/how-it-works";
import OrganizationContact from "@/pages/organization-contact";
import PaymentPage from "@/pages/payment";
import TeachPage from "@/pages/teach";
import ProfAIBusinessPage from "@/pages/profai-business";
import CareerGPTPage from "@/pages/career-gpt";

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
      <Route path="/organization-contact" component={OrganizationContact} />
      <Route path="/payment" component={PaymentPage} />
      <Route path="/teach" component={TeachPage} />
      <Route path="/profai-business" component={ProfAIBusinessPage} />
      <Route path="/career-gpt" component={CareerGPTPage} />
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
          <Router />
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;

