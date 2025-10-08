import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Brain, MessageCircle, Users, Zap, CheckCircle, Play } from 'lucide-react';
import { Button } from '@/components/ui/button';
import IMGADD from "@assets/prof_action.jpg";

const features = [
  {
    icon: Brain,
    title: 'Adaptive Learning',
    description: 'AI adjusts teaching methods based on your learning style and pace'
  },
  {
    icon: MessageCircle,
    title: 'Interactive Conversations',
    description: 'Engage in natural dialogue with your AI professor for deeper understanding'
  },
  {
    icon: Users,
    title: 'Personalized Mentoring',
    description: 'Get individual attention and guidance tailored to your specific needs'
  },
  {
    icon: Zap,
    title: 'Instant Feedback',
    description: 'Receive immediate responses and corrections to accelerate your learning'
  }
];

const sectionVariants = {
  hidden: { opacity: 0, x: -50 },
  visible: { 
    opacity: 1, 
    x: 0, 
    transition: {
      duration: 0.8,
      ease: "easeOut"
    }
  },
};

const rightSectionVariants = {
  hidden: { opacity: 0, x: 50 },
  visible: { 
    opacity: 1, 
    x: 0, 
    transition: {
      duration: 0.8,
      ease: "easeOut",
      delay: 0.2
    }
  },
};

const containerVariants = {
  hidden: { opacity: 1 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.4
    }
  }
};

const itemVariants = {
  hidden: { 
    opacity: 0, 
    y: 20
  },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: {
      duration: 0.5,
      ease: "easeOut"
    }
  },
};

export default function AvatarTeachingSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { 
    once: true, 
    margin: "-100px 0px -100px 0px",
    amount: 0.3
  });

  return (
    <section id="avatar-teaching" className="py-20 bg-gradient-to-br from-purple-50 to-blue-50 dark:from-gray-900 dark:to-purple-900/20" data-testid="avatar-teaching-section">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Centered Header Content */}
        <motion.div
          ref={ref}
          variants={sectionVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-6">
            Meet Your 
            <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent"> AI Professor</span>
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 leading-relaxed max-w-3xl mx-auto">
            Experience the future of education with our advanced AI avatar that provides personalized, 
            interactive teaching tailored to your unique learning style and goals.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          
          {/* Left Side - Video/Avatar */}
          <motion.div
            variants={sectionVariants}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            className="relative"
          >
            {/* Video Container */}
            <div className="relative bg-gradient-to-br from-purple-600 to-blue-600 rounded-2xl p-8 shadow-2xl">
              {/* Prof Action Image */}
              <div className="relative bg-black/20 rounded-xl overflow-hidden aspect-video flex items-center justify-center">
                {/* Prof Action Image */}
                <img 
                  src={IMGADD} 
                  alt="AI Professor in Action" 
                  className="w-full h-full object-cover rounded-xl"
                />
                {/* Overlay with play button */}
                {/* <div className="absolute inset-0 bg-gradient-to-br from-purple-600/20 to-blue-600/20 flex items-center justify-center group-hover:bg-black/30 transition-all duration-300">
                  <div className="text-center text-white opacity-80 hover:opacity-100 transition-opacity duration-300">
                    <div className="w-16 h-16 mx-auto mb-2 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                      <Play className="w-8 h-8 text-white ml-1" />
                    </div>
                    <p className="text-sm font-semibold">Watch Demo</p>
                  </div>
                </div> */}
                
                {/* Animated Elements */}
                <div className="absolute top-4 left-4 w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                <div className="absolute top-4 right-4 w-2 h-2 bg-blue-400 rounded-full animate-ping"></div>
                <div className="absolute bottom-4 left-4 w-2 h-2 bg-purple-400 rounded-full animate-bounce"></div>
              </div>
              
              {/* Floating Elements */}
              <div className="absolute -top-4 -right-4 w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center shadow-lg">
                <Brain className="w-4 h-4 text-yellow-800" />
              </div>
              <div className="absolute -bottom-4 -left-4 w-8 h-8 bg-green-400 rounded-full flex items-center justify-center shadow-lg">
                <MessageCircle className="w-4 h-4 text-green-800" />
              </div>
            </div>
            
            {/* Stats */}
            <div className="grid grid-cols-2 gap-4 mt-8">
              <div className="text-center p-4 bg-white dark:bg-gray-800 rounded-xl shadow-lg">
                <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">24/7</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Available</div>
              </div>
              <div className="text-center p-4 bg-white dark:bg-gray-800 rounded-xl shadow-lg">
                <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">∞</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Patience</div>
              </div>
            </div>
          </motion.div>

          {/* Right Side - Features */}
          <motion.div
            variants={rightSectionVariants}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            className="space-y-8"
          >

            {/* Features List */}
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate={isInView ? "visible" : "hidden"}
              className="space-y-6"
            >
              {features.map((feature, index) => {
                const IconComponent = feature.icon;
                return (
                  <motion.div
                    key={index}
                    variants={itemVariants}
                    className="flex items-start space-x-4 p-4 bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 group"
                  >
                    <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <IconComponent className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                        {feature.title}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400">
                        {feature.description}
                      </p>
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>

            {/* Key Benefits */}
            {/* <motion.div
              variants={itemVariants}
              className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl p-6 text-white"
            >
              <h3 className="text-xl font-bold mb-4">Why Choose AI-Powered Learning?</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  'Learn at your own pace',
                  'Never feel judged or embarrassed',
                  'Get explanations until you understand',
                  'Available anytime, anywhere'
                ].map((benefit, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <CheckCircle className="w-5 h-5 text-green-300 flex-shrink-0" />
                    <span className="text-sm">{benefit}</span>
                  </div>
                ))}
              </div>
            </motion.div> */}

            {/* CTA */}
            {/* <motion.div
              variants={itemVariants}
              className="pt-4"
            >
              <Button
                size="lg"
                className="w-full sm:w-auto px-8 py-4 text-lg font-semibold bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
              >
                Try AI Teaching Now
                <Play className="w-5 h-5 ml-2" />
              </Button>
            </motion.div> */}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
