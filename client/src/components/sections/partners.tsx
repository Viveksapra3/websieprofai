import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Building2, Award, Users, Globe } from 'lucide-react';

// Mock partner data - replace with actual partner logos/info
const partners = [
  {
    name: 'TechCorp University',
    type: 'Academic Partner',
    logo: 'TC',
    description: 'Leading technology education institution'
  },
  {
    name: 'Global Learning Institute',
    type: 'Education Partner',
    logo: 'GLI',
    description: 'International online learning platform'
  },
  {
    name: 'Innovation Academy',
    type: 'Research Partner',
    logo: 'IA',
    description: 'Cutting-edge research in AI education'
  },
  {
    name: 'SkillForge',
    type: 'Industry Partner',
    logo: 'SF',
    description: 'Professional development and certification'
  },
  {
    name: 'EduTech Solutions',
    type: 'Technology Partner',
    logo: 'ETS',
    description: 'Educational technology infrastructure'
  },
  {
    name: 'Future Learning Hub',
    type: 'Content Partner',
    logo: 'FLH',
    description: 'Premium educational content creation'
  }
];

const stats = [
  {
    icon: Users,
    number: '15,000+',
    label: 'Students Taught',
    description: 'Learners empowered with AI education'
  },
  {
    icon: Building2,
    number: '50+',
    label: 'Schools Supported',
    description: 'Educational institutions partnered'
  },
  {
    icon: Award,
    number: '24,000+',
    label: 'Hours of Teaching',
    description: 'Quality learning delivered'
  },
  {
    icon: Globe,
    number: '25+',
    label: 'Countries',
    description: 'Global educational reach'
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
      staggerChildren: 0.1,
      delayChildren: 0.3
    }
  }
};

const itemVariants = {
  hidden: { 
    opacity: 0, 
    y: 20,
    scale: 0.95
  },
  visible: { 
    opacity: 1, 
    y: 0,
    scale: 1,
    transition: {
      duration: 0.5,
      ease: "easeOut"
    }
  },
};

const logoVariants = {
  hidden: { 
    opacity: 0, 
    scale: 0.8
  },
  visible: { 
    opacity: 1, 
    scale: 1,
    transition: {
      duration: 0.4,
      ease: "easeOut"
    }
  },
};

export default function PartnersSection() {
  const ref = useRef(null);
  const statsRef = useRef(null);
  const isInView = useInView(ref, { 
    once: true, 
    margin: "-100px 0px -100px 0px",
    amount: 0.2
  });
  const statsInView = useInView(statsRef, { 
    once: true, 
    margin: "-100px 0px -100px 0px",
    amount: 0.3
  });

  return (
    <section id="partners" className="py-20 bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900" data-testid="partners-section">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <motion.div
          ref={ref}
          variants={sectionVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-6">
            Our <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">Trusted Partners</span>
          </h2>
          <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            We collaborate with leading educational institutions, technology companies, and industry experts to deliver world-class learning experiences.
          </p>
        </motion.div>

        {/* Stats */}
        <motion.div
          ref={statsRef}
          variants={containerVariants}
          initial="hidden"
          animate={statsInView ? "visible" : "hidden"}
          className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-16"
        >
          {stats.map((stat, index) => {
            const IconComponent = stat.icon;
            return (
              <motion.div
                key={index}
                variants={itemVariants}
                className="text-center p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 group"
              >
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full mb-4 group-hover:scale-110 transition-transform duration-300">
                  <IconComponent className="w-8 h-8 text-white" />
                </div>
                <div className="text-3xl font-bold text-gray-900 dark:text-white mb-2">{stat.number}</div>
                <div className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-1">{stat.label}</div>
                <div className="text-sm text-gray-500 dark:text-gray-400">{stat.description}</div>
              </motion.div>
            );
          })}
        </motion.div>


        {/* CTA */}
        {/* <motion.div
          variants={sectionVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="text-center mt-16"
        >
          <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl p-8 text-white">
            <h3 className="text-2xl font-bold mb-4">Interested in Partnership?</h3>
            <p className="text-purple-100 mb-6 max-w-2xl mx-auto">
              Join our growing network of educational partners and help shape the future of AI-powered learning.
            </p>
            <button className="px-8 py-4 bg-white text-purple-600 font-semibold rounded-full hover:bg-gray-100 transition-all duration-300 hover:scale-105 shadow-lg">
              Become a Partner
            </button>
          </div>
        </motion.div> */}
      </div>
    </section>
  );
}
