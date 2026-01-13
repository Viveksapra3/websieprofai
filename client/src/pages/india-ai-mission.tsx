import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Loader2 } from "lucide-react";
import { AuthNavbar } from "@/components/auth-navbar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { StickyVideoPlayer } from "@/components/StickyVideoPlayer";
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
    title: "What is Artificial Intelligence",
    summary: "The module offers a foundational understanding of Artificial Intelligence, tracing its evolution, applications, and growing impact across industries and everyday life. It demystifies how AI systems learn, make decisions, and assist humans, helping learners move from curiosity to practical comprehension.",
    description: "This module introduces learners to the fundamentals of Artificial Intelligence (AI) and its subset, Machine Learning (ML). It traces the evolution of AI, from early logic-based systems and rule-driven programs to today's data-centric and neural network models. Learners explore key milestones and the rise of intelligent assistants; that mark AI's transition from theory to practice. The module demonstrates real-world applications of AI showing how algorithms enhance efficiency and innovation. It also examines the strengths and limitations of AI, such as its speed and precision versus issues of bias, opacity, and lack of empathy. Concluding with an introduction to AI literacy, the module emphasises the need to understand, evaluate, and use AI ethically and effectively. Learners gain the conceptual and critical foundations necessary to engage meaningfully with intelligent technologies in an evolving digital era.",
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
    title: "The Technology behind Artificial Intelligence",
    summary: "This module provides an introduction to Generative Artificial Intelligence, exploring how machines learn, process language, and generate content. Learners are guided through the workings of Machine Learning, Large Language Models, and the principles of effective prompting. By integrating practical tools like the CRAFT Formula, the module equips learners to interact with AI systems confidently, producing accurate and meaningful outputs. It emphasises understanding both the capabilities and constraints of AI, promoting responsible and informed use for everyday contexts.",
    description: "This module introduces learners to Generative Artificial Intelligence, highlighting how AI systems can create content, respond to queries, and assist in problem-solving. It explains how Machine Learning enables systems to identify patterns, adapt, and improve from data over time. Learners explore Large Language Models, which form the backbone of text-based AI tools, and learn how these models process information to generate coherent and contextually relevant responses. The module also covers prompting techniques, providing strategies to interact effectively with AI systems. A key feature is the CRAFT Formula, a structured approach to designing prompts that maximise clarity and output quality. By the end of the module, learners will have both the conceptual understanding and practical skills to engage with generative AI tools responsibly, enhancing learning, productivity, and creativity.",
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
    summary: "This module demonstrates how Artificial Intelligence can be applied to real-world situations, illustrating its versatility and problem-solving potential. Learners see the CRAFT Formula in action across diverse scenarios, learning how to design effective prompts to address varied challenges and achieve meaningful results.",
    description: "This module focuses on the practical application of Artificial Intelligence through real-world examples. Learners explore how AI tools can be leveraged to solve challenges across multiple contexts, from academic tasks to professional problem-solving. The CRAFT Formula is applied systematically, showing how structured prompting enhances clarity, relevance, and accuracy in AI outputs. By working through diverse user scenarios, learners gain hands-on experience in translating theoretical knowledge into actionable solutions, reinforcing both practical skills and strategic thinking in the use of AI.",
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
    summary: "This module positions Artificial Intelligence as a practical ally, showing how it can be leveraged to navigate evolving personal, academic, and professional landscapes. Learners explore real-world applications of AI across sectors, understanding how intelligent systems can enhance productivity, decision-making, and problem-solving. Through concrete examples, the module demonstrates AI's potential as a supportive tool while highlighting the need for responsible use and critical engagement.",
    description: "This module guides learners in viewing Artificial Intelligence as an ally, capable of augmenting human abilities and adapting to changing times. It presents practical examples of AI applications in areas such as education, business, and everyday life, illustrating how AI supports analysis, prediction, creativity, and efficiency. Learners examine multiple use cases, from recommendation systems and virtual assistants to automation and data-driven insights, understanding the benefits and limitations of each. The module emphasises the importance of responsible and informed use, encouraging learners to integrate AI thoughtfully into their work and daily routines. By the end, learners gain the awareness and skills to harness AI as a constructive and ethical partner in achieving personal and professional goals.",
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
    summary: "This module introduces the FAST Framework, providing learners with a structured approach to understanding and navigating ethical concerns in Artificial Intelligence. It examines the societal and personal implications of AI use, outlines government initiatives and policies addressing these challenges, and emphasises responsible, ethical engagement with AI technologies. By the end of the module, learners are equipped to apply ethical principles in practical AI use, ensuring safety, fairness, and accountability.",
    description: "This module focuses on ethical considerations in Artificial Intelligence, introducing the FAST Framework as a guide to responsible AI use. Learners explore common ethical concerns, including bias, privacy, transparency, and accountability, and examine their implications for individuals, organisations, and society. The module also highlights the government's response to these challenges, covering policy measures, regulations, and initiatives aimed at promoting safe and fair AI deployment. Through examples and practical guidance, learners are encouraged to integrate ethical thinking into AI interactions and decision-making. The module concludes with key takeaways, reinforcing the importance of ethical awareness, informed use, and critical evaluation in leveraging AI responsibly for personal, academic, and professional growth.",
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
    summary: "This module explores major trends that are reshaping how humans interact with Artificial Intelligence today. It highlights how AI is transforming coding, user interfaces, search, and customer experiences, while introducing AI agents as collaborative team members in workplaces. Learners discover how natural language has become the primary interface for interacting with AI, how AI agents are taking on tasks autonomously, and how conversational AI is replacing traditional apps and search tools. The module emphasises that AI literacy is now an essential skill, and that human creativity and judgment remain irreplaceable when combined with AI's speed, scale, and capabilities. By the end, learners understand how to leverage AI effectively, ethically, and collaboratively.",
    description: "This module presents current trends in Artificial Intelligence that are actively transforming work, learning, and daily life. It explains how natural language is becoming the new coding medium, enabling anyone to create websites, apps, or reports without learning traditional programming languages. AI is also becoming the new user interface, with conversational systems replacing multiple apps and screens, making interactions more intuitive. The module differentiates AI tools from AI agents, showing how agents can autonomously perform tasks like booking tickets, managing schedules, or summarising meetings. Learners explore the idea of AI as future workplace colleagues and the evolving personal technology landscape, where screens, apps, and operating systems may be replaced by AI-driven systems. Trends like conversational search and AI-influenced customer expectations demonstrate the need for AI literacy as a core skill. The module concludes with a reminder that the AI revolution is already underway and that humans who combine creativity, empathy, and judgment with AI capabilities will shape the future. Practical applications, ethical considerations, and collaboration strategies reinforce learners' ability to engage meaningfully with AI in personal and professional contexts.",
    duration: "40 min",
    lessons: [
      { title: "6A: Key Trends in AI", type: "video", duration: "10 min" },
      { title: "6B: AI & Your Future", type: "video", duration: "10 min" },
      { title: "6C: Course Recap", type: "video", duration: "10 min" },
      { title: "Final Assessment", type: "quiz", duration: "5 min" },
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
  { name: "MeitY", src: "https://www.futureskillsprime.in/per/g10/pub/32914/iDH/instance/1/template/5/final/image/meity-logo_1.webp" },
  { name: "IT-ITeS SSC", src: "https://www.futureskillsprime.in/per/g10/pub/32914/iDH/instance/1/template/5/final/image/IT-ITeS-SSC-logo_03.webp" },
  { name: "C-DAC", src: "https://www.futureskillsprime.in/per/g10/pub/32914/iDH/instance/1/template/5/final/image/c-dac-logo_1.webp" },
  { name: "NIELIT", src: "https://www.futureskillsprime.in/per/g10/pub/32914/iDH/instance/1/template/5/final/image/nielit-logo_1.webp" },
  { name: "Skill India", src: "https://www.futureskillsprime.in/per/g10/pub/32914/iDH/instance/1/template/5/final/image/skill-india-logo_1.webp" },
  { name: "AICTE", src: "https://www.futureskillsprime.in/per/g10/pub/32914/iDH/instance/1/template/5/final/image/aicte-logo_1.webp" },
  { name: "NSDC", src: "https://www.futureskillsprime.in/per/g10/pub/32914/iDH/instance/1/template/5/final/image/nsdc-logo_1.webp" },
  { name: "CII", src: "https://www.futureskillsprime.in/per/g10/pub/32914/iDH/instance/1/template/5/final/image/CII-Logo.webp" },
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
      
      {/* Hero Section with Banner */}
      <section className="relative overflow-hidden bg-gray-900">
        {/* Banner Image */}
        <div className="relative w-full">
          <img 
            src="india-ai-banner.jpeg" 
            alt="National AI Literacy Program - YUVA AI for ALL" 
            className="w-full h-auto object-cover max-h-[500px] md:max-h-[600px]"
          />
          {/* Gradient overlay for better text visibility if needed */}
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-gray-900/80" />
        </div>

        {/* Content Below Banner */}
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 relative">
          <div className="max-w-4xl mx-auto text-center">
            {/* CTA Button */}
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

      {/* Video Section - Module 1A */}
      <section className="py-8 sm:py-12 bg-gray-900/50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-6">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-blue-500/30 mb-3">
                <PlayCircle className="h-4 w-4 text-blue-400" />
                <span className="text-sm text-blue-300 font-medium">Start Your Learning Journey</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">Module 1A: Introduction to AI & Machine Learning</h2>
              <p className="text-gray-400 text-sm sm:text-base">Watch this introductory video to begin your AI learning journey</p>
            </div>
            
            <StickyVideoPlayer 
              vimeoId="1141840737" 
              title="Module 1A: Introduction to AI & Machine Learning"
            />
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
                        <p className="text-xs sm:text-sm text-gray-400 line-clamp-2">{module.summary}</p>
                      </div>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="px-4 sm:px-6 pb-3 sm:pb-4">
                    <div className="ml-0 sm:ml-16 space-y-4">
                      {/* Module Description */}
                      <div className="p-4 bg-gray-900/30 rounded-lg border border-gray-700/30">
                        <p className="text-sm text-gray-300 leading-relaxed">{module.description}</p>
                      </div>
                      
                      {/* Module Lessons */}
                      <div className="space-y-2">
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
              <div className="text-center md:text-left">
                <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3 sm:mb-4">About IndiaAI Mission</h2>
                <p className="text-sm sm:text-base text-gray-300 mb-3 sm:mb-4">
                  The IndiaAI Mission is a flagship initiative by the Government of India aimed at democratizing AI education and building a skilled workforce capable of driving India's AI revolution.
                </p>
                <p className="text-sm sm:text-base text-gray-300 mb-4 sm:mb-6">
                  This comprehensive program covers everything from AI fundamentals to advanced applications, with a special focus on solving India-specific challenges across healthcare, agriculture, governance, and more.
                </p>
                <div className="space-y-2 sm:space-y-3 inline-block md:block text-left">
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
              <div className="relative flex justify-center md:justify-end">
                <div className="aspect-video w-full max-w-md rounded-xl sm:rounded-2xl bg-gradient-to-br from-orange-500/20 via-gray-800 to-green-500/20 border border-gray-700 flex items-center justify-center">
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
            © 2026 IndiaAI Mission. An initiative by Government of India. Powered by ProfAI Academy.
          </p>
        </div>
      </footer>
    </div>
  );
}
