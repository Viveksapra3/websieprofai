import Navigation from '@/components/navigation';
import Footer from '@/components/sections/footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'wouter';
import { 
  BookOpen, 
  Upload, 
  Brain, 
  Users, 
  CheckCircle, 
  ArrowRight, 
  Play,
  FileText,
  Sparkles,
  Target,
  Clock,
  Award
} from 'lucide-react';

export default function HowItWorks() {
  const steps = [
    {
      icon: <Users className="w-8 h-8 text-blue-500" />,
      title: "Sign Up & Choose Your Role",
      description: "Create your account as either a Student or Teacher to access personalized features and dashboards.",
      details: [
        "Students get access to personalized learning paths",
        "Teachers can upload content and manage courses",
        "Secure authentication and profile management"
      ]
    },
    {
      icon: <Upload className="w-8 h-8 text-green-500" />,
      title: "Upload Your Content (Teachers)",
      description: "Teachers can upload PDF materials to automatically generate comprehensive course curricula.",
      details: [
        "Support for multiple PDF formats",
        "AI-powered content analysis",
        "Automatic course structure generation"
      ]
    },
    {
      icon: <Brain className="w-8 h-8 text-purple-500" />,
      title: "AI-Powered Course Generation",
      description: "Our advanced AI analyzes your content and creates structured, engaging courses with modules and assessments.",
      details: [
        "Intelligent content parsing and organization",
        "Automated quiz and assessment creation",
        "Adaptive learning path generation"
      ]
    },
    {
      icon: <BookOpen className="w-8 h-8 text-orange-500" />,
      title: "Access & Learn",
      description: "Students can browse courses, take quizzes, and track their progress through personalized dashboards.",
      details: [
        "Interactive course materials",
        "Progress tracking and analytics",
        "Personalized recommendations"
      ]
    }
  ];

  const features = [
    {
      icon: <Target className="w-6 h-6 text-blue-500" />,
      title: "Personalized Learning",
      description: "AI adapts to your learning style and pace"
    },
    {
      icon: <Clock className="w-6 h-6 text-green-500" />,
      title: "Time Efficient",
      description: "Generate courses in minutes, not hours"
    },
    {
      icon: <Award className="w-6 h-6 text-purple-500" />,
      title: "Quality Content",
      description: "Professional-grade educational materials"
    },
    {
      icon: <Sparkles className="w-6 h-6 text-orange-500" />,
      title: "AI-Powered",
      description: "Cutting-edge technology for better learning"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100" data-testid="how-it-works-page">
      <Navigation />
      
      {/* Hero Section */}
      <section className="pt-48 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <div className="mb-8">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              How ProfessorsAI
              <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent"> Works</span>
            </h1>
            <p className="text-xl text-gray-700 max-w-3xl mx-auto leading-relaxed">
              Discover how our AI-powered platform transforms traditional learning into 
              personalized, engaging educational experiences for both students and teachers.
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/courses">
              <Button className="px-8 py-4 text-lg font-semibold bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-full transition-all duration-300 transform hover:scale-105">
                <Play className="w-5 h-5 mr-2" />
                Try It Now
              </Button>
            </Link>
            <Link href="/signup">
              <Button variant="outline" className="px-8 py-4 text-lg font-semibold border-gray-300 text-gray-700 hover:bg-gray-100 rounded-full transition-all duration-300">
                Get Started Free
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* How It Works Steps Overview */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Simple Steps to Success
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              From sign-up to mastery, here's how ProfessorsAI transforms your learning journey
            </p>
          </div>
        </div>
      </section>

      {/* Step 1: Sign Up & Choose Your Role */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-blue-50 to-indigo-50">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="flex items-center mb-6">
                <div className="p-4 rounded-full bg-blue-100 mr-4">
                  <Users className="w-8 h-8 text-blue-600" />
                </div>
                <div>
                  <div className="text-sm font-semibold text-blue-600 mb-1">Step 1</div>
                  <h3 className="text-3xl font-bold text-gray-900">Sign Up & Choose Your Role</h3>
                </div>
              </div>
              <p className="text-lg text-gray-700 mb-6">
                Create your account and select the role that best fits your needs. Whether you're a student, 
                educator, or organization, we have tailored experiences for everyone.
              </p>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700"><strong>Students:</strong> Access personalized learning paths and track your progress</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700"><strong>Academia:</strong> Upload content and manage courses for your students</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700"><strong>Organizations:</strong> Enterprise solutions for team training and development</span>
                </li>
              </ul>
            </div>
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h4 className="text-xl font-semibold text-gray-900 mb-6">Choose Your Path</h4>
              <div className="space-y-4">
                <Link href="/signin/student">
                  <Button className="w-full justify-start bg-green-600 hover:bg-green-700 text-white p-4 h-auto">
                    <BookOpen className="w-6 h-6 mr-3" />
                    <div className="text-left">
                      <div className="font-semibold">Student</div>
                      <div className="text-sm opacity-90">Access courses and track progress</div>
                    </div>
                  </Button>
                </Link>
                <Link href="/signin/teacher">
                  <Button className="w-full justify-start bg-blue-600 hover:bg-blue-700 text-white p-4 h-auto">
                    <Users className="w-6 h-6 mr-3" />
                    <div className="text-left">
                      <div className="font-semibold">Academia</div>
                      <div className="text-sm opacity-90">Create and manage courses</div>
                    </div>
                  </Button>
                </Link>
                <Link href="/organization-contact">
                  <Button className="w-full justify-start bg-purple-600 hover:bg-purple-700 text-white p-4 h-auto">
                    <Target className="w-6 h-6 mr-3" />
                    <div className="text-left">
                      <div className="font-semibold">Organization</div>
                      <div className="text-sm opacity-90">Enterprise training solutions</div>
                    </div>
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Step 2: Upload Your Content */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-8">
              <div className="flex items-center justify-center mb-6">
                <div className="p-6 rounded-full bg-green-100">
                  <Upload className="w-12 h-12 text-green-600" />
                </div>
              </div>
              <div className="text-center">
                <h4 className="text-xl font-semibold text-gray-900 mb-4">Easy Content Upload</h4>
                <p className="text-gray-600 mb-6">Simply drag and drop your PDF materials or browse to select files</p>
                <div className="border-2 border-dashed border-green-300 rounded-lg p-8 bg-white/50">
                  <FileText className="w-8 h-8 text-green-500 mx-auto mb-2" />
                  <p className="text-sm text-gray-500">PDF files supported</p>
                </div>
              </div>
            </div>
            <div>
              <div className="flex items-center mb-6">
                <div className="p-4 rounded-full bg-green-100 mr-4">
                  <Upload className="w-8 h-8 text-green-600" />
                </div>
                <div>
                  <div className="text-sm font-semibold text-green-600 mb-1">Step 2</div>
                  <h3 className="text-3xl font-bold text-gray-900">Upload Your Content</h3>
                </div>
              </div>
              <p className="text-lg text-gray-700 mb-6">
                Teachers and organizations can upload their educational materials in PDF format. 
                Our system supports multiple file uploads and various document types.
              </p>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">Support for multiple PDF formats and sizes</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">Secure file processing and storage</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">Batch upload capabilities for efficiency</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Step 3: AI-Powered Course Generation */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-purple-50 to-pink-50">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="flex items-center mb-6">
                <div className="p-4 rounded-full bg-purple-100 mr-4">
                  <Brain className="w-8 h-8 text-purple-600" />
                </div>
                <div>
                  <div className="text-sm font-semibold text-purple-600 mb-1">Step 3</div>
                  <h3 className="text-3xl font-bold text-gray-900">AI-Powered Course Generation</h3>
                </div>
              </div>
              <p className="text-lg text-gray-700 mb-6">
                Our advanced AI analyzes your uploaded content and automatically creates structured, 
                engaging courses with modules, quizzes, and assessments.
              </p>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">Intelligent content parsing and organization</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">Automated quiz and assessment creation</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">Adaptive learning path generation</span>
                </li>
              </ul>
            </div>
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <div className="text-center mb-6">
                <div className="p-6 rounded-full bg-purple-100 mx-auto w-fit mb-4">
                  <Sparkles className="w-12 h-12 text-purple-600" />
                </div>
                <h4 className="text-xl font-semibold text-gray-900">AI Processing</h4>
              </div>
              <div className="space-y-4">
                <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                  <div className="w-3 h-3 bg-blue-500 rounded-full mr-3 animate-pulse"></div>
                  <span className="text-gray-700">Analyzing content structure...</span>
                </div>
                <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                  <div className="w-3 h-3 bg-green-500 rounded-full mr-3"></div>
                  <span className="text-gray-700">Creating course modules</span>
                </div>
                <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                  <div className="w-3 h-3 bg-purple-500 rounded-full mr-3"></div>
                  <span className="text-gray-700">Generating assessments</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Step 4: Access & Learn */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-2xl p-8">
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-white rounded-lg p-4 text-center">
                  <BookOpen className="w-8 h-8 text-orange-500 mx-auto mb-2" />
                  <div className="text-sm font-semibold text-gray-900">Interactive Courses</div>
                </div>
                <div className="bg-white rounded-lg p-4 text-center">
                  <Target className="w-8 h-8 text-blue-500 mx-auto mb-2" />
                  <div className="text-sm font-semibold text-gray-900">Progress Tracking</div>
                </div>
                <div className="bg-white rounded-lg p-4 text-center">
                  <Award className="w-8 h-8 text-purple-500 mx-auto mb-2" />
                  <div className="text-sm font-semibold text-gray-900">Achievements</div>
                </div>
                <div className="bg-white rounded-lg p-4 text-center">
                  <Clock className="w-8 h-8 text-green-500 mx-auto mb-2" />
                  <div className="text-sm font-semibold text-gray-900">Flexible Learning</div>
                </div>
              </div>
            </div>
            <div>
              <div className="flex items-center mb-6">
                <div className="p-4 rounded-full bg-orange-100 mr-4">
                  <BookOpen className="w-8 h-8 text-orange-600" />
                </div>
                <div>
                  <div className="text-sm font-semibold text-orange-600 mb-1">Step 4</div>
                  <h3 className="text-3xl font-bold text-gray-900">Access & Learn</h3>
                </div>
              </div>
              <p className="text-lg text-gray-700 mb-6">
                Students can browse courses, take interactive quizzes, and track their progress 
                through personalized dashboards with detailed analytics.
              </p>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">Interactive course materials with multimedia support</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">Real-time progress tracking and analytics</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">Personalized recommendations and learning paths</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Why Choose ProfessorsAI?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Experience the future of education with our innovative features
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <Card key={index} className="bg-white border border-gray-200 hover:shadow-lg transition-all duration-300 text-center">
                <CardContent className="p-6">
                  <div className="flex justify-center mb-4">
                    <div className="p-3 rounded-full bg-gray-100">
                      {feature.icon}
                    </div>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{feature.title}</h3>
                  <p className="text-gray-600 text-sm">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Course Types Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Course Categories
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Explore our diverse range of educational content tailored to different learning levels
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 hover:border-blue-300 transition-all duration-300 group flex flex-col">
              <CardHeader className="text-center">
                <div className="flex justify-center mb-4">
                  <div className="p-4 rounded-full bg-blue-100 group-hover:bg-blue-200 transition-all duration-300">
                    <BookOpen className="w-8 h-8 text-blue-600" />
                  </div>
                </div>
                <CardTitle className="text-2xl text-gray-900">Undergrad Courses</CardTitle>
              </CardHeader>
              <CardContent className="flex-1 flex flex-col">
                <p className="text-gray-700 mb-6 flex-1">
                  Advanced university-level courses covering specialized topics in various fields of study.
                </p>
                <Link href="/courses?type=undergrad">
                  <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                    Explore Courses
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-green-50 to-green-100 border border-green-200 hover:border-green-300 transition-all duration-300 group flex flex-col">
              <CardHeader className="text-center">
                <div className="flex justify-center mb-4">
                  <div className="p-4 rounded-full bg-green-100 group-hover:bg-green-200 transition-all duration-300">
                    <FileText className="w-8 h-8 text-green-600" />
                  </div>
                </div>
                <CardTitle className="text-2xl text-gray-900">High School Courses</CardTitle>
              </CardHeader>
              <CardContent className="flex-1 flex flex-col">
                <p className="text-gray-700 mb-6 flex-1">
                  Comprehensive high school curriculum designed to prepare students for higher education.
                </p>
                <Link href="/courses?type=high-school">
                  <Button className="w-full bg-green-600 hover:bg-green-700 text-white">
                    Explore Courses
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-200 hover:border-purple-300 transition-all duration-300 group flex flex-col">
              <CardHeader className="text-center">
                <div className="flex justify-center mb-4">
                  <div className="p-4 rounded-full bg-purple-100 group-hover:bg-purple-200 transition-all duration-300">
                    <Sparkles className="w-8 h-8 text-purple-600" />
                  </div>
                </div>
                <CardTitle className="text-2xl text-gray-900">Skill Development</CardTitle>
              </CardHeader>
              <CardContent className="flex-1 flex flex-col">
                <p className="text-gray-700 mb-6 flex-1">
                  Practical skills and professional development courses for career advancement.
                </p>
                <Link href="/courses?type=skill-development">
                  <Button className="w-full bg-purple-600 hover:bg-purple-700 text-white">
                    Explore Courses
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        {/* Geometric Pattern Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600">
          <div className="absolute inset-0 bg-black/10"></div>
          <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
            <defs>
              <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
                <path d="M 10 0 L 0 0 0 10" fill="none" stroke="white" strokeWidth="0.5" opacity="0.1"/>
              </pattern>
            </defs>
            <rect width="100" height="100" fill="url(#grid)" />
          </svg>
          {/* Floating Shapes */}
          <div className="absolute top-10 left-10 w-20 h-20 bg-white/10 rounded-full animate-pulse"></div>
          <div className="absolute top-32 right-16 w-16 h-16 bg-white/5 rounded-lg rotate-45 animate-bounce"></div>
          <div className="absolute bottom-20 left-1/4 w-12 h-12 bg-white/10 rounded-full animate-pulse delay-300"></div>
          <div className="absolute bottom-32 right-1/3 w-8 h-8 bg-white/5 rounded-full animate-bounce delay-500"></div>
        </div>
        
        <div className="relative max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to Transform Your Learning?
          </h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Join thousands of students and teachers who are already experiencing the future of education with ProfessorsAI.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/signup">
              <Button className="px-8 py-4 text-lg font-semibold bg-white text-purple-600 hover:bg-gray-100 rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg">
                Get Started Free
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
            <Link href="/courses">
              <Button variant="outline" className="px-8 py-4 text-lg font-semibold border-white/30 text-white hover:bg-white/10 rounded-full transition-all duration-300">
                Browse Courses
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
