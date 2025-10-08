import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { UserPlus, BookOpen, Brain, Trophy, ArrowRight, CheckCircle } from 'lucide-react';

const steps = [
  {
    step: '01',
    icon: UserPlus,
    title: 'Sign Up & Assess',
    description: 'Create your account and take our AI-powered assessment to understand your learning style, goals, and current knowledge level.',
    details: ['Quick 5-minute assessment', 'Learning style analysis', 'Goal setting', 'Skill level evaluation']
  },
  {
    step: '02',
    icon: BookOpen,
    title: 'Choose Your Path',
    description: 'Select from our comprehensive course catalog or let our AI recommend the perfect learning path based on your assessment.',
    details: ['Personalized recommendations', 'Flexible course selection', 'Custom learning paths', 'Progress tracking']
  },
  {
    step: '03',
    icon: Brain,
    title: 'Learn with AI',
    description: 'Engage with your AI professor through interactive lessons, real-time Q&A, and personalized feedback.',
    details: ['Interactive AI conversations', 'Real-time doubt clearing', 'Adaptive content delivery', 'Instant feedback']
  },
  {
    step: '04',
    icon: Trophy,
    title: 'Achieve & Advance',
    description: 'Track your progress, earn certifications, and advance to higher levels with continuous AI-powered support.',
    details: ['Progress monitoring', 'Achievement badges', 'Skill certifications', 'Career guidance']
  }
];

const sectionVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: {
      duration: 0.8,
      ease: "easeOut"
    }
  },
};

const containerVariants = {
  hidden: { opacity: 1 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.3
    }
  }
};

const stepVariants = {
  hidden: { 
    opacity: 0, 
    y: 30,
    scale: 0.95
  },
  visible: { 
    opacity: 1, 
    y: 0,
    scale: 1,
    transition: {
      duration: 0.6,
      ease: "easeOut"
    }
  },
};

export default function HowItWorksSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { 
    once: true, 
    margin: "-100px 0px -100px 0px",
    amount: 0.2
  });

  return (
    <section id="how-it-works" className="py-20 bg-gradient-to-br from-gray-900 to-black text-white overflow-hidden" data-testid="how-it-works-section">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <motion.div
          ref={ref}
          variants={sectionVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6">
            How <span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">It Works</span>
          </h2>
          <p className="text-lg sm:text-xl text-gray-300 max-w-3xl mx-auto">
            Get started with AI-powered learning in just four simple steps. Our intelligent system adapts to your needs every step of the way.
          </p>
        </motion.div>

        {/* Steps */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="relative"
        >
          {/* Connection Line */}
          <div className="hidden lg:block absolute left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-purple-500 to-blue-500 transform -translate-x-1/2"></div>
          
          <div className="space-y-12 lg:space-y-24">
            {steps.map((step, index) => {
              const IconComponent = step.icon;
              const isEven = index % 2 === 0;
              
              return (
                <motion.div
                  key={index}
                  variants={stepVariants}
                  className={`relative flex flex-col lg:flex-row items-center gap-8 lg:gap-16 ${
                    isEven ? 'lg:flex-row' : 'lg:flex-row-reverse'
                  }`}
                >
                  {/* Step Content */}
                  <div className={`flex-1 ${isEven ? 'lg:text-right' : 'lg:text-left'} text-center lg:text-left`}>
                    <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-8 shadow-2xl border border-gray-700 hover:border-purple-500/50 transition-all duration-300 group">
                      
                      {/* Step Number */}
                      <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r from-purple-600 to-blue-600 text-white font-bold text-xl mb-6 group-hover:scale-110 transition-transform duration-300`}>
                        {step.step}
                      </div>
                      
                      {/* Title */}
                      <h3 className="text-2xl font-bold mb-4 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-purple-400 group-hover:to-blue-400 group-hover:bg-clip-text transition-all duration-300">
                        {step.title}
                      </h3>
                      
                      {/* Description */}
                      <p className="text-gray-300 mb-6 leading-relaxed">
                        {step.description}
                      </p>
                      
                      {/* Details */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {step.details.map((detail, detailIndex) => (
                          <div key={detailIndex} className="flex items-center space-x-2">
                            <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0" />
                            <span className="text-sm text-gray-400">{detail}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Center Icon */}
                  <div className="relative flex-shrink-0">
                    <div className="w-20 h-20 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center shadow-2xl border-4 border-gray-800 group-hover:scale-110 transition-transform duration-300">
                      <IconComponent className="w-10 h-10 text-white" />
                    </div>
                    
                    {/* Connecting Arrow for mobile */}
                    {index < steps.length - 1 && (
                      <div className="lg:hidden absolute -bottom-6 left-1/2 transform -translate-x-1/2">
                        <ArrowRight className="w-6 h-6 text-purple-400 rotate-90" />
                      </div>
                    )}
                  </div>

                  {/* Spacer for layout */}
                  <div className="flex-1 hidden lg:block"></div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* Bottom CTA */}
        {/* <motion.div
          variants={sectionVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="text-center mt-16"
        >
          <div className="bg-gradient-to-r from-purple-600/20 to-blue-600/20 rounded-2xl p-8 border border-purple-500/30">
            <h3 className="text-2xl font-bold mb-4">Ready to Transform Your Learning?</h3>
            <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
              Join thousands of learners who have already experienced the power of AI-driven education. Start your journey today!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <button className="px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                Start Learning Now
              </button>
              <button className="px-8 py-4 border-2 border-purple-500 text-purple-400 hover:bg-purple-500 hover:text-white font-semibold rounded-full transition-all duration-300">
                Watch Demo
              </button>
            </div>
          </div>
        </motion.div> */}
      </div>
    </section>
  );
}
