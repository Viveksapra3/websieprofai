import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Loader2 } from "lucide-react";
import { AuthNavbar } from "@/components/auth-navbar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { 
  BookOpen, Clock, Users, Award, CheckCircle2, 
  PlayCircle, FileText, Brain, Cpu, Database, Shield, 
  TrendingUp, Globe, Sparkles, ArrowRight, Star
} from "lucide-react";

// IndiaAI Mission Logo
const INDIA_AI_LOGO = "https://storageprdv2inwink.blob.core.windows.net/420a82bb-9653-422b-8f56-70bfebb4e75e/527ca2de-8828-4650-b19b-225d74fc778a";

// Course modules data - Yuva AI for All official curriculum
const INDIA_AI_MODULES = [
  {
    id: "module-1",
    title: "What is Artificial Intelligence?",
    description: "Learn what AI really means, how it has evolved over time, and where you can already see it in your daily life",
    duration: "45 min",
    lessons: [
      { title: "1A: Introduction to AI & Machine Learning", type: "video", duration: "10 min" },
      { title: "1B: Evolution of AI", type: "video", duration: "10 min" },
      { title: "1C: AI in Daily Life", type: "video", duration: "10 min" },
      { title: "1D: AI Capabilities & Limitations", type: "video", duration: "10 min" },
      { title: "Module 1 Assessment", type: "quiz", duration: "5 min" },
    ],
    icon: Brain,
    color: "from-blue-500 to-blue-600"
  },
  {
    id: "module-2",
    title: "The Technology Behind Artificial Intelligence",
    description: "Understand how machines learn, what Generative AI is, and how to communicate effectively with AI tools using the CRAFT formula",
    duration: "50 min",
    lessons: [
      { title: "2A: Learn the Language of AI", type: "video", duration: "10 min" },
      { title: "2B: How Machines Learn", type: "video", duration: "12 min" },
      { title: "2C: Introduction to Generative AI", type: "video", duration: "12 min" },
      { title: "2D: Prompt Engineering & the CRAFT Formula", type: "video", duration: "12 min" },
      { title: "Module 2 Assessment", type: "quiz", duration: "5 min" },
    ],
    icon: Cpu,
    color: "from-purple-500 to-purple-600"
  },
  {
    id: "module-3",
    title: "Using Artificial Intelligence to Learn and Create",
    description: "Explore popular GenAI tools and discover how AI can help you study better, create content, summarise information, and analyse data",
    duration: "55 min",
    lessons: [
      { title: "3A: Popular AI Tools", type: "video", duration: "10 min" },
      { title: "3B: Demo - Use the CRAFT Formula to Learn Better", type: "video", duration: "12 min" },
      { title: "3C: Demo - Use the CRAFT Formula to Create Content", type: "video", duration: "12 min" },
      { title: "3D: Demo - Use the CRAFT Formula to Analyse Data", type: "video", duration: "12 min" },
      { title: "Module 3 Assessment", type: "quiz", duration: "5 min" },
    ],
    icon: Sparkles,
    color: "from-green-500 to-green-600"
  },
  {
    id: "module-4",
    title: "Using Artificial Intelligence to Think and Plan",
    description: "Learn how AI can act as a thinking partner — helping you plan projects, draft ideas, solve problems, and make better decisions",
    duration: "35 min",
    lessons: [
      { title: "4A: Demo - Using AI as a Thinking Partner", type: "video", duration: "12 min" },
      { title: "4B: Demo - Using AI as a Planning Assistant", type: "video", duration: "12 min" },
      { title: "Module 4 Assessment", type: "quiz", duration: "5 min" },
    ],
    icon: Globe,
    color: "from-orange-500 to-orange-600"
  },
  {
    id: "module-5",
    title: "Artificial Intelligence Ethics",
    description: "Understand why responsible AI use matters — learn the principles of AI ethics, risks, and how the FAST framework ensures safe technology usage",
    duration: "45 min",
    lessons: [
      { title: "5A: Principles of AI Ethics & Introduction to the FAST Framework", type: "video", duration: "12 min" },
      { title: "5B: AI & Ethical Concerns", type: "video", duration: "12 min" },
      { title: "5C: Regulation of AI", type: "video", duration: "12 min" },
      { title: "Module 5 Assessment", type: "quiz", duration: "5 min" },
    ],
    icon: Shield,
    color: "from-red-500 to-red-600"
  },
  {
    id: "module-6",
    title: "The Future of Artificial Intelligence",
    description: "Explore key AI trends and opportunities for your future — how AI will shape careers, industries, and daily life",
    duration: "40 min",
    lessons: [
      { title: "6A: Key Trends in AI", type: "video", duration: "10 min" },
      { title: "6B: AI & Your Future", type: "video", duration: "10 min" },
      { title: "6C: Course Recap", type: "video", duration: "10 min" },
      { title: "Module 6 Assessment", type: "quiz", duration: "5 min" },
    ],
    icon: TrendingUp,
    color: "from-teal-500 to-teal-600"
  }
];

const COURSE_STATS = [
  { label: "Duration", value: "4 hours 30 minutes", icon: Clock },
  { label: "Modules", value: "6", icon: BookOpen },
  { label: "Mode of Delivery", value: "Self-Paced", icon: PlayCircle },
  { label: "Certificate Earned", value: "Joint Participation Certificate", icon: Award },
];

const COURSE_FEATURES = [
  "Hands-on learning with Generative AI tools for academic, personal and professional tasks",
  "Focused skill building in effective prompting to get accurate, high-quality outcomes",
  "Indian real-life examples and practical scenarios for relatable learning",
  "Emphasis on ethical and responsible AI use to ensure safe and positive impact",
  "Empowers every learner to confidently adopt AI in study, work and everyday life",
];

const COURSE_DETAILS = [
  { label: "Skill Type", value: "Emerging Technology" },
  { label: "Course Duration", value: "4 hours 30 minutes" },
  { label: "Domain", value: "Artificial Intelligence" },
  { label: "GOI Incentive applicable", value: "No" },
  { label: "Course Category", value: "Popular Tech Topics" },
  { label: "Nasscom Assessment", value: "No" },
  { label: "Placement Assistance", value: "No" },
  { label: "Certificate Earned", value: "Joint Participation Certificate" },
  { label: "Content Alignment Type", value: "Non-Aligned" },
  { label: "Mode of Delivery", value: "Self-Paced" },
];

const PARTNER_LOGOS = [
  { name: "MeitY", src: "http://www.futureskillsprime.in/per/g10/pub/32914/iDH/instance/1/template/5/final/image/meity-logo_1.webp" },
  { name: "IT-ITeS SSC", src: "http://www.futureskillsprime.in/per/g10/pub/32914/iDH/instance/1/template/5/final/image/IT-ITeS-SSC-logo_03.webp" },
  { name: "C-DAC", src: "http://www.futureskillsprime.in/per/g10/pub/32914/iDH/instance/1/template/5/final/image/c-dac-logo_1.webp" },
  { name: "NIELIT", src: "http://www.futureskillsprime.in/per/g10/pub/32914/iDH/instance/1/template/5/final/image/nielit-logo_1.webp" },
  { name: "Skill India", src: "http://www.futureskillsprime.in/per/g10/pub/32914/iDH/instance/1/template/5/final/image/skill-india-logo_1.webp" },
  { name: "AICTE", src: "http://www.futureskillsprime.in/per/g10/pub/32914/iDH/instance/1/template/5/final/image/aicte-logo_1.webp" },
  { name: "NSDC", src: "http://www.futureskillsprime.in/per/g10/pub/32914/iDH/instance/1/template/5/final/image/nsdc-logo_1.webp" },
  { name: "CII", src: "http://www.futureskillsprime.in/per/g10/pub/32914/iDH/instance/1/template/5/final/image/CII-Logo.webp" },
];

export default function IndiaAIMissionPage() {
  const [expandedModule, setExpandedModule] = useState<string | null>("module-1");
  const [isEnrolling, setIsEnrolling] = useState(false);
  const [, setLocation] = useLocation();

  const totalLessons = INDIA_AI_MODULES.reduce((acc, module) => acc + module.lessons.length, 0);

  const handleEnroll = () => {
    setIsEnrolling(true);
    setTimeout(() => {
      setLocation("/india-ai-course");
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900">
      <AuthNavbar />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Tricolor gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-orange-500/10 via-transparent to-green-500/10" />
        
        {/* Background pattern */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4wMyI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMiIvPjwvZz48L2c+PC9zdmc+')] opacity-50" />

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20 relative">
          <div className="max-w-4xl mx-auto text-center">
            {/* Badges */}
            <div className="flex flex-wrap justify-center gap-2 sm:gap-3 mb-6">
              <div className="inline-flex items-center gap-1.5 sm:gap-2 bg-gradient-to-r from-orange-500/20 via-white/10 to-green-500/20 border border-orange-500/30 rounded-full px-3 sm:px-4 py-1.5 sm:py-2">
                <Sparkles className="h-3 w-3 sm:h-4 sm:w-4 text-orange-400" />
                <span className="text-xs sm:text-sm font-medium text-white">Government of India Initiative</span>
              </div>
              <div className="inline-flex items-center gap-1.5 sm:gap-2 bg-gradient-to-r from-purple-500/20 to-blue-500/20 border border-purple-500/40 rounded-full px-3 sm:px-4 py-1.5 sm:py-2">
                <Brain className="h-3 w-3 sm:h-4 sm:w-4 text-purple-400" />
                <span className="text-xs sm:text-sm font-medium text-white">Yuva AI for All</span>
              </div>
            </div>

            {/* Title */}
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6">
              <span className="text-orange-500">India</span>
              <span className="text-white">AI</span>
              <span className="text-green-500"> Mission</span>
            </h1>

            <p className="text-base sm:text-lg md:text-xl text-gray-300 mb-6 sm:mb-8 max-w-2xl mx-auto px-4">
              Empowering India's workforce with cutting-edge AI skills. Join the national movement to build an AI-ready India.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center mb-8 sm:mb-12 px-4">
              <Link href="/india-ai-course">
                <Button size="lg" className="w-full sm:w-auto bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold px-6 sm:px-8 py-3">
                  <PlayCircle className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
                  Start Learning
                </Button>
              </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
              {COURSE_STATS.map((stat, index) => (
                <div key={index} className="bg-gray-800/50 backdrop-blur-sm rounded-lg sm:rounded-xl p-3 sm:p-4 border border-gray-700 text-center flex flex-col items-center justify-center">
                  <stat.icon className="h-5 w-5 sm:h-6 sm:w-6 text-orange-400 mb-1 sm:mb-2" />
                  <div className="text-lg sm:text-xl md:text-2xl font-bold text-white">{stat.value}</div>
                  <div className="text-xs sm:text-sm text-gray-400">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="py-12 sm:py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 sm:mb-10">
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">Our Partners</h2>
            <p className="text-sm sm:text-base text-gray-400">Key Program Partners</p>
          </div>
          <div className="flex flex-wrap justify-center items-center gap-4 sm:gap-6 md:gap-8 max-w-5xl mx-auto">
            {PARTNER_LOGOS.map((p, i) => (
              <img key={i} src={p.src} alt={p.name} className="h-10 sm:h-12 md:h-14 object-contain grayscale hover:grayscale-0 transition-all duration-300 opacity-80 hover:opacity-100" />
            ))}
          </div>
        </div>
      </section>

      {/* Course Features */}
      <section className="py-8 sm:py-12 border-y border-gray-800">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row flex-wrap justify-center gap-4 sm:gap-6">
            {COURSE_FEATURES.map((feature, index) => (
              <div key={index} className="flex items-start sm:items-center gap-2 text-sm sm:text-base text-gray-300">
                <CheckCircle2 className="h-4 w-4 sm:h-5 sm:w-5 text-green-500 flex-shrink-0 mt-0.5 sm:mt-0" />
                <span className="flex-1">{feature}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-12 sm:py-16 lg:py-20 relative overflow-hidden">
        {/* Futuristic background effects */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-purple-900/5 to-transparent" />
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-green-500/10 rounded-full blur-3xl" />
        
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-12 sm:mb-16">
            <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 rounded-full bg-gradient-to-r from-purple-500/20 to-blue-500/20 border border-purple-500/30 mb-4">
              <Sparkles className="h-3 w-3 sm:h-4 sm:w-4 text-purple-400" />
              <span className="text-xs sm:text-sm text-purple-300">Comprehensive Learning</span>
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-3 sm:mb-4 px-4">Course Details</h2>
            <p className="text-sm sm:text-base text-gray-400 max-w-2xl mx-auto px-4">
              Yuva AI for All is a foundation course designed to democratise AI literacy across India by enabling every learner to understand, use, and benefit from AI responsibly.
            </p>
          </div>

          {/* Main cards with glassmorphism */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 max-w-6xl mx-auto mb-12 sm:mb-16">
            {/* Learning Objectives */}
            <div className="group relative">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl blur-xl opacity-20 group-hover:opacity-30 transition-opacity" />
              <div className="relative bg-gray-900/80 backdrop-blur-xl border border-gray-700/50 rounded-xl sm:rounded-2xl p-4 sm:p-6 h-full hover:border-blue-500/50 transition-all duration-300">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center mb-4">
                  <Brain className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-3">Learning Objectives</h3>
                <p className="text-gray-400 text-sm leading-relaxed">
                  Learners will understand the basics of Artificial Intelligence (AI) and how to use Generative AI (GenAI) tools effectively for everyday tasks — studies, work, and personal productivity. Learners will also learn about responsible prompting and safe AI practices so that they can confidently apply AI in real-life situations.
                </p>
              </div>
            </div>

            {/* Reasons to Enrol */}
            <div className="group relative">
              <div className="absolute inset-0 bg-gradient-to-br from-orange-500 to-yellow-500 rounded-2xl blur-xl opacity-20 group-hover:opacity-30 transition-opacity" />
              <div className="relative bg-gray-900/80 backdrop-blur-xl border border-gray-700/50 rounded-2xl p-6 h-full hover:border-orange-500/50 transition-all duration-300">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-500 to-yellow-500 flex items-center justify-center mb-4">
                  <TrendingUp className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-3">Reasons to Enrol</h3>
                <ul className="text-gray-400 text-sm space-y-2">
                  <li className="flex items-start gap-2"><CheckCircle2 className="h-4 w-4 text-orange-400 mt-0.5 flex-shrink-0" />Use AI for everyday tasks like writing, learning, searching</li>
                  <li className="flex items-start gap-2"><CheckCircle2 className="h-4 w-4 text-orange-400 mt-0.5 flex-shrink-0" />Boost academic and career opportunities with GenAI</li>
                  <li className="flex items-start gap-2"><CheckCircle2 className="h-4 w-4 text-orange-400 mt-0.5 flex-shrink-0" />Improve productivity in any profession</li>
                  <li className="flex items-start gap-2"><CheckCircle2 className="h-4 w-4 text-orange-400 mt-0.5 flex-shrink-0" />Learn effective prompting techniques</li>
                  <li className="flex items-start gap-2"><CheckCircle2 className="h-4 w-4 text-orange-400 mt-0.5 flex-shrink-0" />Understand safe and ethical AI use</li>
                </ul>
              </div>
            </div>

            {/* Ideal Participants */}
            <div className="group relative">
              <div className="absolute inset-0 bg-gradient-to-br from-green-500 to-emerald-500 rounded-2xl blur-xl opacity-20 group-hover:opacity-30 transition-opacity" />
              <div className="relative bg-gray-900/80 backdrop-blur-xl border border-gray-700/50 rounded-2xl p-6 h-full hover:border-green-500/50 transition-all duration-300">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center mb-4">
                  <Users className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-3">Ideal Participants</h3>
                <ul className="text-gray-400 text-sm space-y-2">
                  <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-green-400" />Students from school, college and universities</li>
                  <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-green-400" />Working professionals across any industry</li>
                  <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-green-400" />Business owners and entrepreneurs</li>
                  <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-green-400" />Farmers and self-employed individuals</li>
                  <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-green-400" />Homemakers and lifelong learners</li>
                  <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-green-400" />Teachers and trainers exploring new skills</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Course Details Grid - Futuristic hexagon-inspired design */}
          <div className="max-w-5xl mx-auto">
            <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2 sm:gap-3">
              {COURSE_DETAILS.map((item, idx) => (
                <div 
                  key={idx} 
                  className="group relative bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm rounded-xl p-4 border border-gray-700/50 hover:border-purple-500/50 transition-all duration-300 text-center"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-blue-500/5 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="relative">
                    <div className="text-xs text-gray-500 uppercase tracking-wider mb-1">{item.label}</div>
                    <div className="text-white font-semibold text-sm">{item.value}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Course Modules */}
      <section className="py-12 sm:py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3 sm:mb-4">Course Curriculum</h2>
            <p className="text-sm sm:text-base text-gray-400 max-w-2xl mx-auto px-4">
              A comprehensive curriculum designed by industry experts and aligned with India's AI strategy
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <Accordion 
              type="single" 
              collapsible 
              value={expandedModule || undefined}
              onValueChange={(value) => setExpandedModule(value)}
              className="space-y-4"
            >
              {INDIA_AI_MODULES.map((module, index) => (
                <AccordionItem 
                  key={module.id} 
                  value={module.id}
                  className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl overflow-hidden"
                >
                  <AccordionTrigger className="px-4 sm:px-6 py-3 sm:py-4 hover:no-underline hover:bg-gray-700/30 transition-colors">
                    <div className="flex items-center gap-3 sm:gap-4 text-left">
                      <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl bg-gradient-to-br ${module.color} flex items-center justify-center flex-shrink-0`}>
                        <module.icon className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 mb-1">
                          <Badge variant="outline" className="text-xs border-gray-600 text-gray-400">
                            Module {index + 1}
                          </Badge>
                          <Badge variant="outline" className="text-xs border-gray-600 text-gray-400">
                            <Clock className="h-3 w-3 mr-1" />
                            {module.duration}
                          </Badge>
                        </div>
                        <h3 className="text-base sm:text-lg font-semibold text-white">{module.title}</h3>
                        <p className="text-xs sm:text-sm text-gray-400 line-clamp-2">{module.description}</p>
                      </div>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="px-4 sm:px-6 pb-3 sm:pb-4">
                    <div className="ml-0 sm:ml-16 space-y-2">
                      {module.lessons.map((lesson, lessonIndex) => (
                        <div 
                          key={lessonIndex}
                          className="flex items-center justify-between p-2 sm:p-3 bg-gray-900/50 rounded-lg border border-gray-700/50"
                        >
                          <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
                            {lesson.type === "video" ? (
                              <PlayCircle className="h-3 w-3 sm:h-4 sm:w-4 text-orange-400 flex-shrink-0" />
                            ) : (
                              <FileText className="h-3 w-3 sm:h-4 sm:w-4 text-green-400 flex-shrink-0" />
                            )}
                            <span className="text-xs sm:text-sm text-gray-300 truncate">{lesson.title}</span>
                          </div>
                          <span className="text-xs sm:text-sm text-gray-500 flex-shrink-0 ml-2">{lesson.duration}</span>
                        </div>
                      ))}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </section>

      {/* About IndiaAI Mission */}
      <section className="py-12 sm:py-16 bg-gray-800/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 items-center">
              <div>
                <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3 sm:mb-4">About IndiaAI Mission</h2>
                <p className="text-sm sm:text-base text-gray-300 mb-3 sm:mb-4">
                  The IndiaAI Mission is a flagship initiative by the Government of India aimed at democratizing AI education and building a skilled workforce capable of driving India's AI revolution.
                </p>
                <p className="text-sm sm:text-base text-gray-300 mb-4 sm:mb-6">
                  This comprehensive program covers everything from AI fundamentals to advanced applications, with a special focus on solving India-specific challenges across healthcare, agriculture, governance, and more.
                </p>
                <div className="space-y-2 sm:space-y-3">
                  <div className="flex items-center gap-2 sm:gap-3">
                    <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-orange-500/20 flex items-center justify-center flex-shrink-0">
                      <Star className="h-3 w-3 sm:h-4 sm:w-4 text-orange-400" />
                    </div>
                    <span className="text-sm sm:text-base text-gray-300">Aligned with National AI Strategy</span>
                  </div>
                  <div className="flex items-center gap-2 sm:gap-3">
                    <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0">
                      <Award className="h-3 w-3 sm:h-4 sm:w-4 text-white" />
                    </div>
                    <span className="text-sm sm:text-base text-gray-300">Industry-Recognized Certification</span>
                  </div>
                  <div className="flex items-center gap-2 sm:gap-3">
                    <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-green-500/20 flex items-center justify-center flex-shrink-0">
                      <Users className="h-3 w-3 sm:h-4 sm:w-4 text-green-400" />
                    </div>
                    <span className="text-sm sm:text-base text-gray-300">Join 10,000+ Learners</span>
                  </div>
                </div>
              </div>
              <div className="relative">
                <div className="aspect-video rounded-xl sm:rounded-2xl bg-gradient-to-br from-orange-500/20 via-gray-800 to-green-500/20 border border-gray-700 flex items-center justify-center">
                  <div className="text-center p-4">
                    <img 
                      src={INDIA_AI_LOGO} 
                      alt="IndiaAI Mission" 
                      className="w-24 h-24 sm:w-32 sm:h-32 object-contain mx-auto mb-3 sm:mb-4"
                    />
                    <p className="text-base sm:text-lg text-white font-semibold">IndiaAI Mission</p>
                    <p className="text-xs sm:text-sm text-gray-400">Building AI-Ready India</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 sm:py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3 sm:mb-4">Ready to Start Your AI Journey?</h2>
            <p className="text-sm sm:text-base text-gray-400 mb-6 sm:mb-8 px-4">
              Join thousands of learners who are already building their AI skills with IndiaAI Mission
            </p>
            <Button 
              size="lg" 
              className="w-full sm:w-auto bg-gradient-to-r from-orange-500 to-green-500 hover:from-orange-600 hover:to-green-600 text-white font-semibold px-8 sm:px-12 py-3"
              onClick={handleEnroll}
              disabled={isEnrolling}
            >
              {isEnrolling ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 sm:h-5 sm:w-5 animate-spin" />
                  <span className="text-sm sm:text-base">Taking you to the classroom...</span>
                </>
              ) : (
                <>
                  <span className="text-sm sm:text-base">Enroll Now - It's Free</span>
                  <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5" />
                </>
              )}
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-6 sm:py-8 border-t border-gray-800">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-gray-500 text-xs sm:text-sm">
            © 2024 IndiaAI Mission. An initiative by Government of India. Powered by ProfAI Academy.
          </p>
        </div>
      </footer>
    </div>
  );
}
