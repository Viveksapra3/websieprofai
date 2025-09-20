import React, { useState, useEffect, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { CheckCircle } from 'lucide-react';

const academicBenefits = [
'Academic Support: In-class/post-class assistance, exam prep, and additional coaching.',
'Teacher Development: Training programs and skill enhancement workshops.',
'Career & Placement Guidance: Pre-placement interview training and mentoring.',
'Library & Resources: Access to materials and referral guidance.',
'Administrative Support: Admissions, leave management, and non-academic processes.'
];

const nonAcademicBenefits = [
'Admissions & Enrollment: Streamlined admission processes and enrollment support',
'Student Support Services: Academic assistance, mentoring, and overall student guidance',
'Counseling & Mental Health: Career guidance, counseling, and wellbeing support',
'Student Welfare: Scholarships, grievance redressal, and inclusivity programs',
'Alumni Relations: Networking, mentorship, and alumni contributions'
];

const sectionVariants = {
  hidden: { opacity: 0, x: -50 },
  visible: { 
    opacity: 1, 
    x: 0, 
    transition: {
      duration: 1.4,
      ease: "easeOut"
    }
  },
};

const containerVariants = {
  hidden: { opacity: 1 },
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
    y: 50,
    scale: 0.8
  },
  visible: { 
    opacity: 1, 
    y: 0,
    scale: 1,
    transition: {
      duration: 1.6,
      ease: "easeOut",
      type: "spring",
      stiffness: 100
    }
  },
};

// Custom hook for individual item visibility
const useScrollReveal = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { 
    once: true, 
    margin: "-100px 0px -100px 0px",
    amount: 0.3
  });
  return [ref, isInView];
};

export default function BenefitsSection() {
  const [showSection, setShowSection] = useState(false);
  const academicRef = useRef(null);
  const nonAcademicRef = useRef(null);
  
  const academicInView = useInView(academicRef, { 
    once: true, 
    margin: "-50px 0px -50px 0px",
    amount: 0.2
  });
  
  const nonAcademicInView = useInView(nonAcademicRef, { 
    once: true, 
    margin: "-50px 0px -50px 0px",
    amount: 0.2
  });

  useEffect(() => {
    const handleScroll = () => {
      const section = document.getElementById('benefits-section');
      if (section) {
        const rect = section.getBoundingClientRect();
        if (rect.top < window.innerHeight * 0.75) {
          setShowSection(true);
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <section id="benefits-section" className="py-20 bg-gray-50 dark:bg-gray-900" data-testid="benefits-section">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 sm:mb-16">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Discover the Benefits of AI-Powered Learning
          </h2>
          <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            Our AI teaching companion offers a wide range of advantages, both in and out of the classroom.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16">
          <motion.div
            ref={academicRef}
            variants={sectionVariants}
            initial="hidden"
            animate={showSection ? "visible" : "hidden"}
            className="p-8 bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 transition-colors drop-shadow-[0_4px_6px_rgba(0,0,0,40%)]"
          >
            <h3 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-6">Academic</h3>
            <motion.ul 
              className="space-y-5"
              variants={containerVariants}
              initial="hidden"
              animate={academicInView ? "visible" : "hidden"}
            >
              {academicBenefits.map((benefit, index) => {
                const [title, description] = benefit.split(':');
                return (
                  <motion.li 
                    key={index} 
                    variants={itemVariants} 
                    className="flex items-start space-x-3"
                  >
                    <CheckCircle className="flex-shrink-0 w-6 h-6 text-primary mt-1" />
                    <div>
                      <h4 className="font-semibold text-gray-900 dark:text-white">{title.trim()}</h4>
                      <p className="text-gray-600 dark:text-gray-400 mt-1">{description.trim()}</p>
                    </div>
                  </motion.li>
                );
              })}
            </motion.ul>
          </motion.div>

          <motion.div
            ref={nonAcademicRef}
            variants={sectionVariants}
            initial="hidden"
            animate={showSection ? "visible" : "hidden"}
            className="p-8 bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 transition-colors drop-shadow-[0_4px_6px_rgba(0,0,0,40%)]"
          >
            <h3 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-6">Non-Academic</h3>
            <motion.ul 
              className="space-y-5"
              variants={containerVariants}
              initial="hidden"
              animate={nonAcademicInView ? "visible" : "hidden"}
            >
              {nonAcademicBenefits.map((benefit, index) => {
                const [title, description] = benefit.split(':');
                return (
                  <motion.li 
                    key={index} 
                    variants={itemVariants} 
                    className="flex items-start space-x-3"
                  >
                    <CheckCircle className="flex-shrink-0 w-6 h-6 text-primary mt-1" />
                    <div>
                      <h4 className="font-semibold text-gray-900 dark:text-white">{title.trim()}</h4>
                      <p className="text-gray-600 dark:text-gray-400 mt-1">{description.trim()}</p>
                    </div>
                  </motion.li>
                );
              })}
            </motion.ul>
          </motion.div>
        </div>
      </div>
    </section>
  );
}