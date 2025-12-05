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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-gray-900 dark:to-gray-800">
      <Navigation />
      
      <div className="pt-24 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <Link href="/">
              <button className="mb-6 flex items-center gap-2 text-blue-600 hover:text-blue-700 dark:text-blue-400 mx-auto transition-colors">
                <ArrowLeft className="w-5 h-5" />
                Back to Home
              </button>
            </Link>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white mb-6">
              ProfessorsAI vs ChatGPT
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-4xl mx-auto">
              A comprehensive comparison showing why ProfessorsAI is the superior choice for education
            </p>
          </motion.div>

          {/* Visual Comparison Hero */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mb-20"
          >
            <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl p-8 border border-gray-200 dark:border-gray-700">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8 text-center">
                Visual Comparison: Same Question, Different Approach
              </h2>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* ChatGPT */}
                <div className="space-y-4">
                  <div className="bg-gradient-to-r from-red-500 to-orange-500 p-4 rounded-t-2xl">
                    <h3 className="text-xl font-bold text-white flex items-center">
                      <XCircle className="w-6 h-6 mr-2" />
                      ChatGPT - General Purpose AI
                    </h3>
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-b-2xl">
                    <img 
                      src={chatgptImage} 
                      alt="ChatGPT response example" 
                      className="w-full h-auto rounded-lg shadow-lg mb-4"
                    />
                    <div className="space-y-2">
                      <div className="flex items-start gap-2 text-red-600 dark:text-red-400">
                        <XCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
                        <p className="text-sm">Provides generic information without educational context</p>
                      </div>
                      <div className="flex items-start gap-2 text-red-600 dark:text-red-400">
                        <XCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
                        <p className="text-sm">No curriculum alignment or learning objectives</p>
                      </div>
                      <div className="flex items-start gap-2 text-red-600 dark:text-red-400">
                        <XCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
                        <p className="text-sm">Can easily deviate from educational topics</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* ProfessorsAI */}
                <div className="space-y-4">
                  <div className="bg-gradient-to-r from-green-500 to-emerald-500 p-4 rounded-t-2xl">
                    <h3 className="text-xl font-bold text-white flex items-center">
                      <CheckCircle className="w-6 h-6 mr-2" />
                      ProfessorsAI - Education-Focused AI
                    </h3>
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-b-2xl">
                    <img 
                      src={professorsaiImage} 
                      alt="ProfessorsAI response example" 
                      className="w-full h-auto rounded-lg shadow-lg mb-4"
                    />
                    <div className="space-y-2">
                      <div className="flex items-start gap-2 text-green-600 dark:text-green-400">
                        <CheckCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
                        <p className="text-sm">Structured learning with clear curriculum boundaries</p>
                      </div>
                      <div className="flex items-start gap-2 text-green-600 dark:text-green-400">
                        <CheckCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
                        <p className="text-sm">References course materials and maintains focus</p>
                      </div>
                      <div className="flex items-start gap-2 text-green-600 dark:text-green-400">
                        <CheckCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
                        <p className="text-sm">Pedagogically designed responses for better learning</p>
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
              className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white text-center mb-12"
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
                  className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 border border-gray-200 dark:border-gray-700"
                >
                  <div className="flex items-center gap-3 mb-8">
                    <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-xl">
                      <comparison.icon className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                      {comparison.category}
                    </h3>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* ProfessorsAI */}
                    <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-xl p-6 border-2 border-green-200 dark:border-green-700">
                      <div className="flex items-center gap-2 mb-4">
                        <CheckCircle className="w-6 h-6 text-green-600 dark:text-green-400" />
                        <h4 className="text-xl font-semibold text-gray-900 dark:text-white">
                          ProfessorsAI
                        </h4>
                      </div>
                      <h5 className="text-lg font-medium text-green-800 dark:text-green-300 mb-4">
                        {comparison.profai.title}
                      </h5>
                      <ul className="space-y-3">
                        {comparison.profai.points.map((point, idx) => (
                          <li key={idx} className="flex items-start gap-2">
                            <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400 mt-0.5 flex-shrink-0" />
                            <span className="text-gray-700 dark:text-gray-300">{point}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* General LLM */}
                    <div className="bg-gradient-to-br from-red-50 to-orange-50 dark:from-red-900/20 dark:to-orange-900/20 rounded-xl p-6 border-2 border-red-200 dark:border-red-700">
                      <div className="flex items-center gap-2 mb-4">
                        <XCircle className="w-6 h-6 text-red-600 dark:text-red-400" />
                        <h4 className="text-xl font-semibold text-gray-900 dark:text-white">
                          ChatGPT / General LLMs
                        </h4>
                      </div>
                      <h5 className="text-lg font-medium text-red-800 dark:text-red-300 mb-4">
                        {comparison.generalLLM.title}
                      </h5>
                      <ul className="space-y-3">
                        {comparison.generalLLM.points.map((point, idx) => (
                          <li key={idx} className="flex items-start gap-2">
                            <XCircle className="w-5 h-5 text-red-600 dark:text-red-400 mt-0.5 flex-shrink-0" />
                            <span className="text-gray-700 dark:text-gray-300">{point}</span>
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
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl p-12 text-white text-center">
              <Award className="w-16 h-16 mx-auto mb-6" />
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                The Clear Choice for Education
              </h2>
              <p className="text-xl mb-8 opacity-90 max-w-3xl mx-auto">
                While ChatGPT is excellent for general purposes, ProfessorsAI is specifically engineered 
                for education with proven pedagogical methods, curriculum alignment, and student safety at its core.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/courses">
                  <button className="bg-white text-blue-600 px-8 py-4 rounded-xl font-semibold hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 shadow-lg">
                    Start Learning Now
                  </button>
                </Link>
                <Link href="/">
                  <button className="border-2 border-white text-white px-8 py-4 rounded-xl font-semibold hover:bg-white/10 transition-all duration-300">
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
