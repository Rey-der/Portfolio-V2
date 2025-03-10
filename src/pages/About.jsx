import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { useNavigate } from 'react-router-dom';
import useProgressiveLoading from '../hooks/useProgressiveLoading';
import useDeviceDetection from '../utils/useDeviceDetection';
import { aboutText } from '../data/aboutData';
import { getAboutText } from '../data/aboutData';
import { useLanguage } from '../context/LanguageContext';

const About = ({ registerWithURL }) => {
  const navigate = useNavigate();

  const sectionRef = useRef(null);
  const { ref: animationRef, inView } = useInView({
    threshold: 0.1,
    triggerOnce: false,
  });

  const setRefs = (element) => {
    sectionRef.current = element;
    animationRef(element);
  };

  const isMobile = useDeviceDetection();
  const isTablet = useDeviceDetection(1024);

  // Use language context
  const { currentLanguage } = useLanguage();
  const currentAboutText = getAboutText(currentLanguage) || aboutText;

  useEffect(() => {
    if (sectionRef.current && registerWithURL) {
      return registerWithURL('about', sectionRef);
    }
  }, [registerWithURL]);

  useEffect(() => {
    const aboutSection = document.getElementById('about');
    if (aboutSection) {
      aboutSection.classList.add('icons-loading');
      const timer = setTimeout(() => {
        aboutSection.classList.remove('icons-loading');
        aboutSection.classList.add('icons-ready');
        const icons = aboutSection.querySelectorAll('svg');
        icons.forEach((icon) => {
          icon.classList.add('icon-svg');
        });
      }, 250);
      return () => clearTimeout(timer);
    }
  }, []);

  useProgressiveLoading(['/src/pages/Guestbook.jsx']);

  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.08,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.35, ease: 'easeOut' },
    },
  };

  const skills = [
    { name: 'React', level: 90, icon: '⚛️' },
    { name: 'JavaScript', level: 95, icon: '𝐉𝐒' },
    { name: 'TypeScript', level: 85, icon: '𝐓𝐒' },
    { name: 'Node.js', level: 80, icon: '🟢' },
    { name: 'CSS/SCSS', level: 85, icon: '🎨' },
    { name: 'Tailwind CSS', level: 90, icon: '🌬️' },
  ];

  const timeline = [
    {
      year: '2023',
      title: currentAboutText.seniorFrontendDev,
      company: currentAboutText.techInnovations,
      description: currentAboutText.seniorFrontendDesc,
    },
    {
      year: '2021',
      title: currentAboutText.fullStackDev,
      company: currentAboutText.digitalSolutions,
      description: currentAboutText.fullstackDevDesc,
    },
    {
      year: '2019',
      title: currentAboutText.juniorWebDev,
      company: currentAboutText.startupGenius,
      description: currentAboutText.juniorDevDesc,
    },
  ];

  return (
    <section
      ref={setRefs}
      id="about"
      data-section="about"
      className="min-h-screen py-16 px-4 bg-gradient-to-b from-white to-gray-50 dark:from-dark-background dark:to-gray-900"
    >
      <div className="container mx-auto max-w-5xl">
        <motion.div
          className="space-y-16"
          variants={containerVariants}
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
        >
          {/* Header section */}
          <div className="text-center">
            <motion.h1
              variants={itemVariants}
              className="text-4xl md:text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary"
            >
              {currentAboutText.aboutMe}
            </motion.h1>
            <motion.p
              variants={itemVariants}
              className="text-xl md:text-2xl max-w-3xl mx-auto text-gray-600 dark:text-gray-300"
            >
              {currentAboutText.passionateTagline}
            </motion.p>
          </div>

          {/* Bio with image section */}
          <motion.div
            variants={itemVariants}
            className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center"
          >
            <div className="md:col-span-1 flex justify-center">
              <div className="relative w-48 h-48 md:w-56 md:h-56 overflow-hidden rounded-full border-4 border-primary shadow-lg">
                <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-800 flex items-center justify-center text-5xl">
                  <span>👨‍💻</span>
                </div>
              </div>
            </div>

            <div className="md:col-span-2 space-y-4">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
                {currentAboutText.whoIAm}
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-300">
                {currentAboutText.frontendBio}
              </p>
              <p className="text-lg text-gray-600 dark:text-gray-300">
                {currentAboutText.passion}
              </p>

              {/* Quick info cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
                <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md">
                  <div className="text-primary text-2xl mb-2">🌎</div>
                  <h3 className="font-medium">{currentAboutText.location}</h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    {currentAboutText.sanFranciscoCA}
                  </p>
                </div>

                <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md">
                  <div className="text-primary text-2xl mb-2">🎓</div>
                  <h3 className="font-medium">{currentAboutText.education}</h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    {currentAboutText.bsComputerScience}
                  </p>
                </div>

                <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md">
                  <div className="text-primary text-2xl mb-2">🌱</div>
                  <h3 className="font-medium">{currentAboutText.learning}</h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    {currentAboutText.web3AI}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Skills section */}
          <motion.div variants={itemVariants} className="pt-8">
            <h2 className="text-2xl md:text-3xl font-bold text-center mb-10 text-gray-900 dark:text-white">
              {currentAboutText.mySkills}
            </h2>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
              {skills.map((skill, index) => (
                <motion.div
                  key={index}
                  className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden"
                  whileHover={{ y: -5, transition: { duration: 0.2 } }}
                >
                  <div className="p-5">
                    <div className="flex items-center mb-3">
                      <span className="text-2xl mr-3">{skill.icon}</span>
                      <h3 className="font-bold text-lg">{skill.name}</h3>
                    </div>

                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                      <div
                        className="bg-gradient-to-r from-primary to-secondary h-2.5 rounded-full transition-all duration-1000"
                        style={{
                          width: `${skill.level}%`,
                          transition: 'width 1.5s ease-in-out',
                        }}
                      ></div>
                    </div>
                    <div className="text-right mt-1 text-sm text-gray-500 dark:text-gray-400">
                      {skill.level}%
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Experience Timeline */}
          <motion.div variants={itemVariants} className="pt-8">
            <h2 className="text-2xl md:text-3xl font-bold text-center mb-10 text-gray-900 dark:text-white">
              {currentAboutText.myJourney}
            </h2>

            <div className="relative">
              {/* Timeline center line */}
              <div className="absolute left-1/2 transform -translate-x-1/2 w-1 bg-primary h-full"></div>

              {/* Timeline items */}
              {timeline.map((item, index) => (
                <div
                  key={index}
                  className={`relative z-10 mb-12 flex ${
                    index % 2 === 0 ? 'md:flex-row-reverse' : ''
                  }`}
                >
                  <div className="hidden md:block w-1/2"></div>

                  <div className="absolute left-1/2 transform -translate-x-1/2 -translate-y-4">
                    <div className="w-8 h-8 rounded-full bg-primary border-4 border-white dark:border-gray-900 flex items-center justify-center">
                      <span className="text-xs font-bold text-white">
                        {item.year}
                      </span>
                    </div>
                  </div>

                  <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 md:w-1/2 mx-4 md:mx-0">
                    <h3 className="text-xl font-bold mb-1">{item.title}</h3>
                    <p className="text-primary mb-3">{item.company}</p>
                    <p className="text-gray-600 dark:text-gray-300">
                      {item.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Fun facts / Personal interests */}
          <motion.div variants={itemVariants} className="pt-8 pb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-center mb-6 text-gray-900 dark:text-white">
              {currentAboutText.beyondCoding}
            </h2>
            <p className="text-center text-lg mb-10 max-w-3xl mx-auto text-gray-600 dark:text-gray-300">
              {currentAboutText.whenNotCoding}
            </p>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="text-center p-4">
                <div className="text-4xl mb-4">📚</div>
                <h3 className="font-medium mb-2">{currentAboutText.reading}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  {currentAboutText.scienceFiction}
                </p>
              </div>

              <div className="text-center p-4">
                <div className="text-4xl mb-4">🏃‍♂️</div>
                <h3 className="font-medium mb-2">{currentAboutText.running}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  {currentAboutText.halfMarathons}
                </p>
              </div>

              <div className="text-center p-4">
                <div className="text-4xl mb-4">🎸</div>
                <h3 className="font-medium mb-2">{currentAboutText.music}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  {currentAboutText.guitarPlayer}
                </p>
              </div>

              <div className="text-center p-4">
                <div className="text-4xl mb-4">✈️</div>
                <h3 className="font-medium mb-2">{currentAboutText.travel}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  {currentAboutText.visitedCountries}
                </p>
              </div>
            </div>
          </motion.div>

          {/* CTA Button */}
          <motion.div variants={itemVariants} className="text-center pt-8">
            <button
              onClick={() => navigate('/contact')}
              className="bg-gradient-to-r from-primary to-secondary hover:from-secondary hover:to-primary text-white font-bold py-3 px-8 rounded-full shadow-lg transform transition duration-300 hover:scale-105"
            >
              {currentAboutText.letsWorkTogether}
            </button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default About;