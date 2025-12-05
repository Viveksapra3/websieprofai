import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';
import { Link } from 'wouter';
import { 
  Brain, 
  Target, 
  BookOpen, 
  Users, 
  CheckCircle, 
  XCircle, 
  Zap,
  GraduationCap,
  MessageSquare,
  Clock,
  ArrowRight
} from 'lucide-react';
import chatgptImage from '@assets/chatgpt.jpg';
import professorsaiImage from '@assets/professorsai.jpg';

const comparisonPoints = [
  {
    category: "Focus & Distraction",
    profai: {
      title: "Laser-Focused Learning",
      description: "Stays strictly within educational boundaries, keeping students focused on their curriculum without wandering into unrelated topics",
      icon: Target,
      color: "text-green-600"
    },
    generalLLM: {
      title: "Topic Wandering",
      description: "Veers into many topics & areas which potentially distract students from their core learning objectives",
      icon: Brain,
      color: "text-red-500"
    }
  },
  {
    category: "Response Quality",
    profai: {
      title: "Clean, Educational Responses",
      description: "Delivers precise, curriculum-aligned answers without unnecessary information or confusing tangents",
      icon: CheckCircle,
      color: "text-green-600"
    },
    generalLLM: {
      title: "Noisy Responses",
      description: "LLMs have too much noise around their responses which can confuse students and dilute the learning experience",
      icon: MessageSquare,
      color: "text-red-500"
    }
  },
  {
    category: "Content Alignment",
    profai: {
      title: "Syllabus-Centered Learning",
      description: "Our platform is focused on syllabus content of the education standards , or of you favourite tutor",
      icon: BookOpen,
      color: "text-green-600"
    },
    generalLLM: {
      title: "Generic Knowledge Base",
      description: "Provides broad information without alignment to specific educational curriculum or learning standards",
      icon: Users,
      color: "text-red-500"
    }
  }
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.3,
      delayChildren: 0.2
    }
  }
};

const itemVariants = {
  hidden: { 
    opacity: 0, 
    y: 60,
    scale: 0.8
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.8,
      ease: "easeOut",
      type: "spring",
      stiffness: 100,
      damping: 15
    }
  }
};

const cardVariants = {
  hidden: { 
    opacity: 0, 
    x: -50,
    rotateY: -15
  },
  visible: {
    opacity: 1,
    x: 0,
    rotateY: 0,
    transition: {
      duration: 0.7,
      ease: "easeOut",
      type: "spring",
      stiffness: 120,
      damping: 20
    }
  }
};

export default function LLMComparisonSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section ref={ref} className="py-20 bg-gradient-to-br from-slate-50 to-blue-50 dark:from-gray-900 dark:to-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="text-center mb-16"
        >
          <motion.h2 
            variants={itemVariants}
            className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-6"
          >
            Why Choose ProfessorsAI Over 
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600"> General LLMs?</span>
          </motion.h2>
          <motion.p 
            variants={itemVariants}
            className="text-xl text-gray-600 dark:text-gray-400 max-w-4xl mx-auto"
          >
            While general-purpose AI tools provide broad knowledge, ProfessorsAI is specifically engineered 
            for education with advanced pedagogical intelligence and structured learning methodologies.
          </motion.p>
        </motion.div>

        <div className="space-y-12">
          {comparisonPoints.map((point, index) => (
            <motion.div
              key={point.category}
              variants={itemVariants}
              initial="hidden"
              animate={isInView ? "visible" : "hidden"}
              transition={{ delay: index * 0.3 }}
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 border border-gray-100 dark:border-gray-700 hover:shadow-2xl transition-shadow duration-300"
            >
              <motion.h3 
                variants={itemVariants}
                className="text-2xl font-bold text-gray-900 dark:text-white mb-8 text-center"
              >
                {point.category}
              </motion.h3>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* ProfessorsAI Side */}
                <motion.div 
                  variants={cardVariants}
                  initial="hidden"
                  animate={isInView ? "visible" : "hidden"}
                  transition={{ delay: index * 0.3 + 0.2 }}
                  className="relative"
                >
                  <motion.div 
                    className="absolute -top-4 -left-4 w-8 h-8 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center"
                    initial={{ scale: 0, rotate: -180 }}
                    animate={isInView ? { scale: 1, rotate: 0 } : { scale: 0, rotate: -180 }}
                    transition={{ delay: index * 0.3 + 0.4, duration: 0.5, type: "spring" }}
                  >
                    <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
                  </motion.div>
                  <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-xl p-6 border-2 border-green-200 dark:border-green-700 hover:border-green-300 transition-colors duration-300">
                    <div className="flex items-center mb-4">
                      <motion.div 
                        className="p-2 bg-green-100 dark:bg-green-800 rounded-lg mr-3"
                        initial={{ scale: 0 }}
                        animate={isInView ? { scale: 1 } : { scale: 0 }}
                        transition={{ delay: index * 0.3 + 0.5, type: "spring", stiffness: 200 }}
                      >
                        <point.profai.icon className={`w-6 h-6 ${point.profai.color}`} />
                      </motion.div>
                      <h4 className="text-xl font-semibold text-gray-900 dark:text-white">
                        ProfessorsAI
                      </h4>
                    </div>
                    <h5 className="text-lg font-medium text-green-800 dark:text-green-300 mb-2">
                      {point.profai.title}
                    </h5>
                    <p className="text-gray-700 dark:text-gray-300">
                      {point.profai.description}
                    </p>
                  </div>
                </motion.div>

                {/* General LLM Side */}
                <motion.div 
                  variants={cardVariants}
                  initial="hidden"
                  animate={isInView ? "visible" : "hidden"}
                  transition={{ delay: index * 0.3 + 0.4 }}
                  className="relative"
                >
                  <motion.div 
                    className="absolute -top-4 -left-4 w-8 h-8 bg-red-100 dark:bg-red-900 rounded-full flex items-center justify-center"
                    initial={{ scale: 0, rotate: 180 }}
                    animate={isInView ? { scale: 1, rotate: 0 } : { scale: 0, rotate: 180 }}
                    transition={{ delay: index * 0.3 + 0.6, duration: 0.5, type: "spring" }}
                  >
                    <XCircle className="w-5 h-5 text-red-600 dark:text-red-400" />
                  </motion.div>
                  <div className="bg-gradient-to-br from-red-50 to-orange-50 dark:from-red-900/20 dark:to-orange-900/20 rounded-xl p-6 border-2 border-red-200 dark:border-red-700 hover:border-red-300 transition-colors duration-300">
                    <div className="flex items-center mb-4">
                      <motion.div 
                        className="p-2 bg-red-100 dark:bg-red-800 rounded-lg mr-3"
                        initial={{ scale: 0 }}
                        animate={isInView ? { scale: 1 } : { scale: 0 }}
                        transition={{ delay: index * 0.3 + 0.7, type: "spring", stiffness: 200 }}
                      >
                        <point.generalLLM.icon className={`w-6 h-6 ${point.generalLLM.color}`} />
                      </motion.div>
                      <h4 className="text-xl font-semibold text-gray-900 dark:text-white">
                        General LLMs
                      </h4>
                    </div>
                    <h5 className="text-lg font-medium text-red-800 dark:text-red-300 mb-2">
                      {point.generalLLM.title}
                    </h5>
                    <p className="text-gray-700 dark:text-gray-300">
                      {point.generalLLM.description}
                    </p>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Visual Comparison Section */}
        <motion.div
          variants={itemVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          transition={{ delay: 0.9 }}
          className="mt-20"
        >
          <h3 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-8 text-center">
            See the Difference in Action
          </h3>
          <p className="text-lg text-gray-600 dark:text-gray-400 text-center mb-12 max-w-3xl mx-auto">
            Compare how ChatGPT and ProfessorsAI respond to the same question. Notice how our platform 
            provides structured, curriculum-focused learning with clear boundaries.
          </p>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* ChatGPT Comparison */}
            <motion.div
              variants={cardVariants}
              initial="hidden"
              animate={isInView ? "visible" : "hidden"}
              transition={{ delay: 1.0 }}
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden border-2 border-red-200 dark:border-red-700"
            >
              <div className="bg-gradient-to-r from-red-500 to-orange-500 p-4">
                <h4 className="text-xl font-bold text-white flex items-center">
                  <XCircle className="w-6 h-6 mr-2" />
                  ChatGPT - General Purpose
                </h4>
              </div>
              <div className="p-4">
                <img 
                  src={chatgptImage} 
                  alt="ChatGPT general response example" 
                  className="w-full h-auto rounded-lg shadow-md"
                />
                <p className="mt-4 text-sm text-gray-600 dark:text-gray-400">
                  Generic responses without educational structure or curriculum alignment
                </p>
              </div>
            </motion.div>

            {/* ProfessorsAI Comparison */}
            <motion.div
              variants={cardVariants}
              initial="hidden"
              animate={isInView ? "visible" : "hidden"}
              transition={{ delay: 1.2 }}
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden border-2 border-green-200 dark:border-green-700"
            >
              <div className="bg-gradient-to-r from-green-500 to-emerald-500 p-4">
                <h4 className="text-xl font-bold text-white flex items-center">
                  <CheckCircle className="w-6 h-6 mr-2" />
                  ProfessorsAI - Focused Learning
                </h4>
              </div>
              <div className="p-4">
                <img 
                  src={professorsaiImage} 
                  alt="ProfessorsAI structured learning response" 
                  className="w-full h-auto rounded-lg shadow-md"
                />
                <p className="mt-4 text-sm text-gray-600 dark:text-gray-400">
                  Structured, curriculum-aligned responses with clear learning boundaries
                </p>
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* Call to Action with Detailed Comparison Button */}
        <motion.div
          variants={itemVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          transition={{ delay: 1.4 }}
          className="text-center mt-16"
        >
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white">
            <h3 className="text-2xl md:text-3xl font-bold mb-4">
              Want to See More?
            </h3>
            <p className="text-xl mb-6 opacity-90">
              Explore our detailed comparison to understand how ProfessorsAI revolutionizes learning
            </p>
            <Link href="/comparison">
              <button className="bg-white text-blue-600 px-8 py-4 rounded-xl font-semibold hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center gap-2 mx-auto">
                View Detailed Comparison
                <ArrowRight className="w-5 h-5" />
              </button>
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
