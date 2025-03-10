import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { useNavigate } from 'react-router-dom';
import useProgressiveLoading from '../hooks/useProgressiveLoading';
import useDeviceDetection from '../utils/useDeviceDetection';
import { getAboutText } from '../data/aboutData';

const About = ({ registerWithURL }) => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('about.md');
  const [terminalVisible, setTerminalVisible] = useState(false);

  // Language context (replace with your actual language context)
  const currentLanguage = 'en'; // Example: useLanguage();
  const aboutText = getAboutText(currentLanguage);

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

  useEffect(() => {
    if (sectionRef.current && registerWithURL) {
      return registerWithURL('about', sectionRef);
    }
  }, [registerWithURL]);

  useEffect(() => {
    if (inView) {
      const timer = setTimeout(() => {
        setTerminalVisible(true);
      }, 800);
      return () => clearTimeout(timer);
    }
    return undefined;
  }, [inView]);

  useEffect(() => {
    const aboutSection = document.getElementById('about');
    if (aboutSection) {
      aboutSection.classList.add('icons-loading');
      const timer = setTimeout(() => {
        aboutSection.classList.remove('icons-loading');
        aboutSection.classList.add('icons-ready');
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
    { name: 'React', level: 90, icon: '⚛️', color: '#61DAFB' },
    { name: 'JavaScript', level: 95, icon: 'JS', color: '#F7DF1E' },
    { name: 'TypeScript', level: 85, icon: 'TS', color: '#3178C6' },
    { name: 'Node.js', level: 80, icon: '🟢', color: '#339933' },
    { name: 'CSS/SCSS', level: 85, icon: '🎨', color: '#1572B6' },
    { name: 'Tailwind', level: 90, icon: '🌬️', color: '#06B6D4' },
  ];

  const files = [
    { name: 'about.md', icon: '📄', active: activeTab === 'about.md' },
    { name: 'skills.json', icon: '{}', active: activeTab === 'skills.json' },
    { name: 'experience.js', icon: '📜', active: activeTab === 'experience.js' },
    { name: 'contact.jsx', icon: '📱', active: activeTab === 'contact.jsx' },
  ];

  return (
    <section
      ref={setRefs}
      id="about"
      data-section="about"
      className="min-h-screen py-8 px-0 md:px-4 bg-[#1E1E1E] dark:bg-[#1E1E1E] text-[#CCCCCC] font-mono"
    >
      <div className="container mx-auto max-w-6xl">
        <motion.div
          className="vs-code-container border border-[#252526] rounded-md overflow-hidden shadow-xl"
          variants={containerVariants}
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
        >
          {/* VS Code-like Title Bar */}
          <div className="vs-title-bar flex items-center justify-between bg-[#323233] px-4 py-2 text-sm">
            <div className="flex items-center">
              <span className="vs-icon mr-2">📁</span>
              <span>{aboutText.vsCodeTitle}</span>
            </div>
            <div className="flex space-x-2">
              <button className="w-3 h-3 rounded-full bg-yellow-500"></button>
              <button className="w-3 h-3 rounded-full bg-green-500"></button>
              <button className="w-3 h-3 rounded-full bg-red-500"></button>
            </div>
          </div>

          {/* Main Content with Sidebar and Editor */}
          <div className="flex flex-col md:flex-row">
            {/* Activity Bar (Left) */}
            <div className="vs-activity-bar hidden md:flex flex-col items-center bg-[#333333] py-4 px-2 space-y-4">
              <button className="text-[#FFFFFF] hover:bg-[#505050] p-2 rounded">📁</button>
              <button className="text-[#CCCCCC] hover:bg-[#505050] p-2 rounded">🔍</button>
              <button className="text-[#CCCCCC] hover:bg-[#505050] p-2 rounded">⚙️</button>
              <button className="text-[#CCCCCC] hover:bg-[#505050] p-2 rounded">🧩</button>
              <button className="text-[#CCCCCC] hover:bg-[#505050] p-2 rounded">🐛</button>
            </div>

            {/* Sidebar (Explorer) */}
            <div className="vs-sidebar hidden md:block w-64 bg-[#252526] border-r border-[#191919]">
              <div className="py-2 px-4 text-sm font-medium uppercase tracking-wide border-b border-[#191919]">
                {aboutText.explorer}
              </div>

              <div className="py-2">
                <div className="px-4 py-1 flex items-center">
                  <span className="mr-1">▼</span>
                  <span className="font-medium">{aboutText.portfolio}</span>
                </div>

                {/* Files */}
                <div className="py-2">
                  {files.map((file, index) => (
                    <motion.div
                      key={index}
                      variants={itemVariants}
                      className={`px-6 py-1 cursor-pointer flex items-center ${
                        file.active ? 'bg-[#37373D]' : 'hover:bg-[#2A2D2E]'
                      }`}
                      onClick={() => setActiveTab(file.name)}
                    >
                      <span className="mr-2">{file.icon}</span>
                      <span>{file.name}</span>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>

            {/* Editor Area */}
            <div className="vs-editor flex-1 bg-[#1E1E1E]">
              {/* Tabs */}
              <div className="vs-tabs flex bg-[#252526] text-sm">
                {files.map((file, index) => (
                  <div
                    key={index}
                    className={`px-4 py-2 flex items-center cursor-pointer ${
                      file.active
                        ? 'bg-[#1E1E1E] border-t-2 border-[#007ACC]'
                        : 'bg-[#2D2D2D] hover:bg-[#2A2D2E]'
                    }`}
                    onClick={() => setActiveTab(file.name)}
                  >
                    <span className="mr-2">{file.icon}</span>
                    <span>{file.name}</span>
                    {file.active && <span className="ml-2 text-xs">×</span>}
                  </div>
                ))}
              </div>

              {/* Editor Content */}
              <div className="p-6 overflow-auto">
                {activeTab === 'about.md' && (
                  <motion.div variants={itemVariants} className="vs-markdown space-y-6">
                    <h1 className="text-3xl font-bold text-[#CCCCCC]">{aboutText.aboutMe}</h1>
                    <div className="vs-code-block bg-[#252526] p-4 rounded border-l-4 border-[#007ACC]">
                      <p className="mb-4">
                        {aboutText.passionateDeveloper}
                      </p>
                      <p>{aboutText.frontendDeveloper}</p>
                    </div>

                    <h2 className="text-2xl font-bold text-[#CCCCCC] mt-6">{aboutText.whoIAm}</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="vs-code-block bg-[#252526] p-4 rounded">
                        <pre>
                          {`const location = {
  city: "${aboutText.sanFrancisco}",
  country: "USA",
  timezone: "PST"
};`}
                        </pre>
                      </div>
                      <div className="vs-code-block bg-[#252526] p-4 rounded">
                        <pre>
                          {`const education = {
  degree: "B.S.",
  field: "${aboutText.computerScience}",
  university: "Tech University"
};`}
                        </pre>
                      </div>
                    </div>
                  </motion.div>
                )}

                {activeTab === 'skills.json' && (
                  <motion.div variants={itemVariants} className="vs-json">
                    <pre className="text-[#CCCCCC]">
                      {`{
  "skills": {
    "frontend": [
      {"name": "React", "level": "${aboutText.expert}", "years": 4},
      {"name": "JavaScript", "level": "${aboutText.expert}", "years": 5},
      {"name": "TypeScript", "level": "${aboutText.advanced}", "years": 3},
      {"name": "CSS/SCSS", "level": "${aboutText.advanced}", "years": 5},
      {"name": "Tailwind", "level": "${aboutText.expert}", "years": 3}
    ],
    "backend": [
      {"name": "Node.js", "level": "${aboutText.advanced}", "years": 4},
      {"name": "Express", "level": "${aboutText.advanced}", "years": 4},
      {"name": "PostgreSQL", "level": "${aboutText.intermediate}", "years": 3},
      {"name": "MongoDB", "level": "${aboutText.advanced}", "years": 4}
    ],
    "tools": [
      {"name": "Git", "level": "${aboutText.advanced}"},
      {"name": "Docker", "level": "${aboutText.intermediate}"},
      {"name": "VS Code", "level": "${aboutText.expert}"},
      {"name": "Jest", "level": "${aboutText.advanced}"}
    ]
  }
}`}
                    </pre>
                  </motion.div>
                )}

                {activeTab === 'experience.js' && (
                  <motion.div variants={itemVariants} className="vs-javascript">
                    <pre className="text-[#CCCCCC]">
                      {`/**
 * ${aboutText.professionalExperience}
 * @${aboutText.author} Developer
 */

const workExperience = [
  {
    position: "${aboutText.seniorFrontendDev}",
    company: "${aboutText.techInnovations}",
    period: "${aboutText.periodPresent}",
    highlights: [
      "${aboutText.highlight1}",
      "${aboutText.highlight2}",
      "${aboutText.highlight3}"
    ],
    technologies: ["React", "TypeScript", "Redux", "Tailwind CSS"]
  },
  {
    position: "${aboutText.fullStackDev}",
    company: "${aboutText.digitalSolutions}",
    period: "${aboutText.period2020}",
    highlights: [
      "${aboutText.highlight4}",
      "${aboutText.highlight5}",
      "${aboutText.highlight6}"
    ],
    technologies: ["JavaScript", "Node.js", "MongoDB", "AWS"]
  },
  {
    position: "${aboutText.juniorWebDev}",
    company: "${aboutText.startupGenius}",
    period: "${aboutText.period2018}",
    highlights: [
      "${aboutText.highlight7}",
      "${aboutText.highlight8}",
      "${aboutText.highlight9}"
    ],
    technologies: ["React", "CSS", "HTML", "Git"]
  }
];

export default workExperience;`}
                    </pre>
                  </motion.div>
                )}

                {activeTab === 'contact.jsx' && (
                  <motion.div variants={itemVariants} className="vs-jsx">
                    <pre className="text-[#CCCCCC]">
                      {`import React from 'react';

const ContactInfo = () => {
  const contactDetails = {
    ${aboutText.emailLabel}: "${aboutText.email}",
    ${aboutText.githubLabel}: "${aboutText.github}",
    ${aboutText.linkedinLabel}: "${aboutText.linkedin}",
    ${aboutText.twitterLabel}: "${aboutText.twitter}"
  };

  return (
    <div className="contact-container">
      <h2>${aboutText.getInTouch}</h2>
      <p>
        ${aboutText.openToOpportunities}
      </p>
      <ul>
        {Object.entries(contactDetails).map(([platform, link]) => (
          <li key={platform}>
            <strong>{platform}:</strong> {link}
          </li>
        ))}
      </ul>
      <button 
        onClick={() => window.location.href = '/contact'}
        className="contact-button"
      >
        ${aboutText.sendMessage}
      </button>
    </div>
  );
};

export default ContactInfo;`}
                    </pre>
                  </motion.div>
                )}
              </div>
            </div>
          </div>

          {/* Terminal Panel */}
          <motion.div
            className="vs-terminal bg-[#1E1E1E] border-t border-[#191919]"
            initial={{ height: 0, opacity: 0 }}
            animate={{
              height: terminalVisible ? 'auto' : 0,
              opacity: terminalVisible ? 1 : 0,
            }}
            transition={{ duration: 0.5 }}
          >
            {terminalVisible && (
              <>
                <div className="vs-terminal-tabs flex bg-[#252526] text-sm">
                  <div className="px-4 py-1 bg-[#1E1E1E] border-t border-[#007ACC]">
                    {aboutText.terminal}
                  </div>
                  <div className="px-4 py-1 bg-[#2D2D2D]">
                    {aboutText.output}
                  </div>
                </div>

                <div className="p-4 font-mono text-sm">
                  <p className="text-[#569CD6]">$ {aboutText.portfolioStatus}</p>
                  <p className="text-[#CCCCCC] mt-2">{aboutText.loadingDeveloperInformation}</p>
                  <p className="text-[#6A9955] mt-1">{aboutText.skillsLoadedSuccessfully}</p>
                  <p className="text-[#6A9955] mt-1">{aboutText.experienceVerified}</p>
                  <p className="text-[#CCCCCC] mt-2">{aboutText.readyToCollaborate}</p>
                  <p className="text-[#569CD6] mt-4">$ _</p>
                </div>
              </>
            )}
          </motion.div>

          {/* Status Bar */}
          <div className="vs-statusbar flex items-center justify-between bg-[#007ACC] text-white px-4 py-1 text-xs">
            <div className="flex items-center space-x-4">
              <span>{aboutText.ready}</span>
              <span>{aboutText.main}</span>
            </div>
            <div className="flex items-center space-x-4">
              <span>{aboutText.encoding}</span>
              <span>{aboutText.language}</span>
              <span>{aboutText.lineCol}</span>
            </div>
          </div>
        </motion.div>

        {/* CTA Button outside VS Code UI */}
        <motion.div variants={itemVariants} className="text-center mt-8">
          <button
            onClick={() => navigate('/contact')}
            className="bg-[#0E639C] hover:bg-[#1177BB] text-white font-bold py-3 px-8 rounded transition duration-300"
          >
            {aboutText.letsWorkTogether}
          </button>
        </motion.div>
      </div>
    </section>
  );
};

export default About;