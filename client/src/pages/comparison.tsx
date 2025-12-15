import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';
import { Link } from 'wouter';
import Navigation from '@/components/navigation';
import Footer from '@/components/sections/footer';
import { 
  CheckCircle, 
  XCircle, 
  Target, 
  Brain,
  BookOpen,
  MessageSquare,
  Users,
  GraduationCap,
  Clock,
  Zap,
  Shield,
  TrendingUp,
  Award,
  ArrowLeft,
  Sparkles
} from 'lucide-react';
import chatgptImage from '@assets/chatgpt.jpg';
import professorsaiImage from '@assets/professorsai.jpg';

const detailedComparisons = [
  {
    category: "Learning Focus",
    icon: Target,
    profai: {
      title: "Curriculum-Aligned Learning",
      points: [
        "Strictly follows educational standards and syllabus",
        "Prevents topic wandering and maintains focus",
        "Structured learning paths with clear objectives",
        "Adaptive to individual learning pace",
        "Progress tracking aligned with curriculum goals"
      ]
    },
    generalLLM: {
      title: "General Knowledge Base",
      points: [
        "Broad knowledge without specific curriculum alignment",
        "Can easily deviate from learning objectives",
        "No structured learning progression",
        "One-size-fits-all approach",
        "No curriculum-specific progress tracking"
      ]
    }
  },
  {
    category: "Response Quality",
    icon: MessageSquare,
    profai: {
      title: "Educational Precision",
      points: [
        "Clean, concise, and pedagogically sound responses",
        "Age-appropriate language and complexity",
        "Includes learning reinforcement techniques",
        "Provides step-by-step explanations",
        "Encourages critical thinking with guided questions"
      ]
    },
    generalLLM: {
      title: "Generic Responses",
      points: [
        "Often verbose with unnecessary information",
        "May not match student's comprehension level",
        "Lacks educational scaffolding",
        "Direct answers without learning process",
        "Can overwhelm students with information"
      ]
    }
  },
  {
    category: "Content Safety",
    icon: Shield,
    profai: {
      title: "Education-Safe Environment",
      points: [
        "Filtered content appropriate for educational settings",
        "Prevents access to non-educational topics",
        "Built-in safeguards for student protection",
        "Monitored interactions for safety compliance",
        "Parent and teacher oversight capabilities"
      ]
    },
    generalLLM: {
      title: "Open Internet Knowledge",
      points: [
        "Access to all types of content",
        "No educational content filtering",
        "Limited safeguards for young learners",
        "Potential exposure to inappropriate content",
        "Minimal oversight mechanisms"
      ]
    }
  },
  {
    category: "Assessment & Progress",
    icon: TrendingUp,
    profai: {
      title: "Comprehensive Learning Analytics",
      points: [
        "Built-in quizzes and assessments",
        "Real-time progress tracking",
        "Detailed performance analytics",
        "Personalized learning recommendations",
        "Teacher and parent dashboards"
      ]
    },
    generalLLM: {
      title: "No Learning Metrics",
      points: [
        "No assessment capabilities",
        "No progress tracking",
        "No performance analytics",
        "No personalized recommendations",
        "No educator oversight tools"
      ]
    }
  },
  {
    category: "Teaching Methodology",
    icon: GraduationCap,
    profai: {
      title: "Pedagogically Designed",
      points: [
        "Based on proven teaching methodologies",
        "Socratic method for deeper understanding",
        "Spaced repetition for better retention",
        "Active learning techniques",
        "Differentiated instruction support"
      ]
    },
    generalLLM: {
      title: "Information Delivery",
      points: [
        "Simple question-answer format",
        "No pedagogical framework",
        "No learning science integration",
        "Passive information consumption",
        "One-dimensional teaching approach"
      ]
    }
  },
  {
    category: "Customization",
    icon: Sparkles,
    profai: {
      title: "Tailored Learning Experience",
      points: [
        "Customizable to specific curricula",
        "Adaptable to teaching styles",
        "Integration with course materials",
        "Teacher-uploaded content support",
        "Institutional branding options"
      ]
    },
    generalLLM: {
      title: "Fixed System",
      points: [
        "No curriculum customization",
        "Generic for all users",
        "Cannot integrate course materials",
        "No content upload capabilities",
        "No institutional customization"
      ]
    }
  }
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: "easeOut"
    }
  }
};

export default function ComparisonPage() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-slate-800">
      <Navigation />
      
      <div className="pt-24 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-20 relative"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10 blur-3xl -z-10" />
            <Link href="/">
              <button className="mb-8 flex items-center gap-2 text-blue-400 hover:text-blue-300 mx-auto transition-all hover:gap-3 group">
                <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                <span className="text-sm font-medium tracking-wide">Back to Home</span>
              </button>
            </Link>
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-200 via-purple-200 to-pink-200 mb-4 px-4 leading-tight">
              ProfessorAI is a syllabus only content & Safe for young minds
            </h1>
            <div className="h-1 w-32 mx-auto bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-full mt-6" />
          </motion.div>

          {/* Visual Comparison Hero */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mb-20"
          >
            <div className="bg-gradient-to-br from-slate-800/50 to-gray-800/50 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border border-white/10 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-purple-500/5 to-pink-500/5" />
              <h2 className="text-2xl sm:text-3xl font-bold text-white mb-6 sm:mb-8 text-center px-4 relative z-10">
                Visual Comparison: Same Question, Different Approach
              </h2>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
                {/* ProfessorsAI - Left Side */}
                <div className="space-y-4 relative z-10">
                  <div className="bg-gradient-to-r from-emerald-600 to-teal-600 p-3 sm:p-4 rounded-t-2xl shadow-lg">
                    <h3 className="text-lg sm:text-xl font-bold text-white flex items-center flex-wrap">
                      <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6 mr-2 flex-shrink-0" />
                      <span>ProfessorsAI - Education-Focused AI</span>
                    </h3>
                  </div>
                  <div className="bg-slate-900/80 backdrop-blur-sm p-3 sm:p-4 rounded-b-2xl border border-white/10">
                    <img 
                      src={professorsaiImage} 
                      alt="ProfessorsAI response example" 
                      className="w-full h-auto rounded-lg shadow-lg mb-4"
                    />
                    <div className="space-y-2">
                      <div className="flex items-start gap-2 text-emerald-400">
                        <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 mt-0.5 flex-shrink-0" />
                        <p className="text-xs sm:text-sm">Structured learning with clear curriculum boundaries</p>
                      </div>
                      <div className="flex items-start gap-2 text-emerald-400">
                        <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 mt-0.5 flex-shrink-0" />
                        <p className="text-xs sm:text-sm">References course materials and maintains focus</p>
                      </div>
                      <div className="flex items-start gap-2 text-emerald-400">
                        <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 mt-0.5 flex-shrink-0" />
                        <p className="text-xs sm:text-sm">Pedagogically designed responses for better learning</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* ChatGPT - Right Side */}
                <div className="space-y-4 relative z-10">
                  <div className="bg-gradient-to-r from-rose-600 to-orange-600 p-3 sm:p-4 rounded-t-2xl shadow-lg">
                    <h3 className="text-lg sm:text-xl font-bold text-white flex items-center flex-wrap">
                      <XCircle className="w-5 h-5 sm:w-6 sm:h-6 mr-2 flex-shrink-0" />
                      <span>ChatGPT - General Purpose AI</span>
                    </h3>
                  </div>
                  <div className="bg-slate-900/80 backdrop-blur-sm p-3 sm:p-4 rounded-b-2xl border border-white/10">
                    <img 
                      src={chatgptImage} 
                      alt="ChatGPT response example" 
                      className="w-full h-auto rounded-lg shadow-lg mb-4"
                    />
                    <div className="space-y-2">
                      <div className="flex items-start gap-2 text-rose-400">
                        <XCircle className="w-4 h-4 sm:w-5 sm:h-5 mt-0.5 flex-shrink-0" />
                        <p className="text-xs sm:text-sm">Provides generic information without educational context</p>
                      </div>
                      <div className="flex items-start gap-2 text-rose-400">
                        <XCircle className="w-4 h-4 sm:w-5 sm:h-5 mt-0.5 flex-shrink-0" />
                        <p className="text-xs sm:text-sm">No curriculum alignment or learning objectives</p>
                      </div>
                      <div className="flex items-start gap-2 text-rose-400">
                        <XCircle className="w-4 h-4 sm:w-5 sm:h-5 mt-0.5 flex-shrink-0" />
                        <p className="text-xs sm:text-sm">Can easily deviate from educational topics</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Detailed Comparisons */}
          <div ref={ref} className="space-y-12">
            <motion.h2
              variants={itemVariants}
              initial="hidden"
              animate={isInView ? "visible" : "hidden"}
              className="text-2xl sm:text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-200 to-purple-200 text-center mb-8 sm:mb-12 px-4"
            >
              Detailed Feature Comparison
            </motion.h2>

            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate={isInView ? "visible" : "hidden"}
              className="space-y-8"
            >
              {detailedComparisons.map((comparison, index) => (
                <motion.div
                  key={comparison.category}
                  variants={itemVariants}
                  className="bg-gradient-to-br from-slate-800/60 to-gray-800/60 backdrop-blur-xl rounded-2xl shadow-2xl p-4 sm:p-6 md:p-8 border border-white/10 hover:border-white/20 transition-all duration-300 relative overflow-hidden group"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-purple-500/5 to-pink-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <div className="flex items-center gap-2 sm:gap-3 mb-6 sm:mb-8 relative z-10">
                    <div className="p-2 sm:p-3 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-xl flex-shrink-0 backdrop-blur-sm border border-white/10">
                      <comparison.icon className="w-6 h-6 sm:w-8 sm:h-8 text-blue-400" />
                    </div>
                    <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-white">
                      {comparison.category}
                    </h3>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 relative z-10">
                    {/* ProfessorsAI - Left Side */}
                    <div className="bg-gradient-to-br from-emerald-500/10 to-teal-500/10 backdrop-blur-sm rounded-xl p-4 sm:p-6 border border-emerald-500/30 hover:border-emerald-500/50 transition-all duration-300 shadow-lg hover:shadow-emerald-500/20">
                      <div className="flex items-center gap-2 mb-3 sm:mb-4">
                        <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6 text-emerald-400 flex-shrink-0" />
                        <h4 className="text-base sm:text-lg md:text-xl font-semibold text-white">
                          ProfessorsAI
                        </h4>
                      </div>
                      <h5 className="text-sm sm:text-base md:text-lg font-medium text-emerald-300 mb-3 sm:mb-4">
                        {comparison.profai.title}
                      </h5>
                      <ul className="space-y-2 sm:space-y-3">
                        {comparison.profai.points.map((point, idx) => (
                          <li key={idx} className="flex items-start gap-2">
                            <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-400 mt-0.5 flex-shrink-0" />
                            <span className="text-xs sm:text-sm md:text-base text-gray-300">{point}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* General LLM - Right Side */}
                    <div className="bg-gradient-to-br from-rose-500/10 to-orange-500/10 backdrop-blur-sm rounded-xl p-4 sm:p-6 border border-rose-500/30 hover:border-rose-500/50 transition-all duration-300 shadow-lg hover:shadow-rose-500/20">
                      <div className="flex items-center gap-2 mb-3 sm:mb-4">
                        <XCircle className="w-5 h-5 sm:w-6 sm:h-6 text-rose-400 flex-shrink-0" />
                        <h4 className="text-base sm:text-lg md:text-xl font-semibold text-white">
                          ChatGPT / General LLMs
                        </h4>
                      </div>
                      <h5 className="text-sm sm:text-base md:text-lg font-medium text-rose-300 mb-3 sm:mb-4">
                        {comparison.generalLLM.title}
                      </h5>
                      <ul className="space-y-2 sm:space-y-3">
                        {comparison.generalLLM.points.map((point, idx) => (
                          <li key={idx} className="flex items-start gap-2">
                            <XCircle className="w-4 h-4 sm:w-5 sm:h-5 text-rose-400 mt-0.5 flex-shrink-0" />
                            <span className="text-xs sm:text-sm md:text-base text-gray-300">{point}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>

          {/* Summary Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="mt-20"
          >
            <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-2xl sm:rounded-3xl p-6 sm:p-8 md:p-12 text-white text-center relative overflow-hidden shadow-2xl">
              <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent" />
              <Award className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-4 sm:mb-6 relative z-10 drop-shadow-lg" />
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 sm:mb-6 px-4 relative z-10">
                The Clear Choice for Education
              </h2>
              <p className="text-base sm:text-lg md:text-xl mb-6 sm:mb-8 opacity-95 max-w-3xl mx-auto px-4 relative z-10">
                While ChatGPT is excellent for general purposes, ProfessorsAI is specifically engineered 
                for education with proven pedagogical methods, curriculum alignment, and student safety at its core.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center px-4 relative z-10">
                <Link href="/courses">
                  <button className="w-full sm:w-auto bg-white text-blue-600 px-6 sm:px-8 py-3 sm:py-4 rounded-xl font-semibold hover:bg-gray-50 transition-all duration-300 transform hover:scale-105 shadow-2xl hover:shadow-white/50">
                    Start Learning Now
                  </button>
                </Link>
                <Link href="/">
                  <button className="w-full sm:w-auto border-2 border-white/50 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-xl font-semibold hover:bg-white/20 hover:border-white transition-all duration-300 backdrop-blur-sm">
                    Back to Home
                  </button>
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
