import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
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
      duration: 0.8,
      ease: "easeOut"
    }
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: {
      duration: 0.5,
      ease: "easeOut"
    }
  },
};

export default function BenefitsSection() {
  const [showSection, setShowSection] = useState(false);

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
            variants={sectionVariants}
            initial="hidden"
            animate={showSection ? "visible" : "hidden"}
            className="p-8 bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 transition-colors"
          >
            <h3 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-6">Academic</h3>
            <ul className="space-y-5">
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
            </ul>
          </motion.div>

          <motion.div
            variants={sectionVariants}
            initial="hidden"
            animate={showSection ? "visible" : "hidden"}
            className="p-8 bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 transition-colors"
          >
            <h3 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-6">Non-Academic</h3>
            <ul className="space-y-5">
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
            </ul>
          </motion.div>
        </div>
      </div>
    </section>
  );
}