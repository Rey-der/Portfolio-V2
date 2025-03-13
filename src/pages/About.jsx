import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { fetchContributionStats, fetchGitHubProfile } from '../api/github';
import { FaGithub, FaLinkedin, FaCode, FaDatabase, FaServer, FaBriefcase } from 'react-icons/fa';
import { getAboutText } from '../data/aboutData';
import { useLanguage } from '../context/LanguageContext';
import useSectionRegistration from '../hooks/useSectionRegistration'; // Import the hook
import SectionTriggers from '../components/SectionTriggers'; // Import SectionTriggers

const About = ({ registerWithURL }) => {
  // Use the custom registration hook
  const { sectionRef } = useSectionRegistration('about', registerWithURL);

  const [githubProfile, setGithubProfile] = useState(null);
  const [contributionStats, setContributionStats] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Use language context
  const { currentLanguage } = useLanguage();
  const aboutText = getAboutText(currentLanguage);

  // Fetch GitHub data
  useEffect(() => {
    const loadGitHubData = async () => {
      setIsLoading(true);
      try {
        const [profile, stats] = await Promise.all([
          fetchGitHubProfile(),
          fetchContributionStats()
        ]);
        setGithubProfile(profile);
        setContributionStats(stats);
      } catch (error) {
        console.error('Failed to load GitHub data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadGitHubData();
  }, []);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.2,
        delayChildren: 0.1
      }
    }
  };
  
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { type: 'spring', stiffness: 100 }
    }
  };
  
  // Section divider component
  const SectionDivider = ({ title, icon }) => (
    <div className="flex items-center w-full my-8">
      <div className="flex-grow h-px bg-gray-300 dark:bg-gray-600"></div>
      <div className="flex items-center mx-4">
        {icon}
        <h2 className="text-2xl font-bold mx-3">{title}</h2>
      </div>
      <div className="flex-grow h-px bg-gray-300 dark:bg-gray-600"></div>
    </div>
  );

  // Render GitHub contribution grid
  const renderContributionGrid = () => {
    if (!contributionStats?.contributionGrid) return null;
    
    return (
      <div className="mt-6 mb-8">
        <h3 className="text-xl font-bold mb-3">{aboutText.contributionActivity}</h3>
        <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 overflow-x-auto">
          <div className="flex" style={{ minWidth: '800px' }}>
            {contributionStats.contributionGrid.map((week, weekIndex) => (
              <div key={weekIndex} className="flex flex-col">
                {week.map((day, dayIndex) => (
                  <div
                    key={`${weekIndex}-${dayIndex}`}
                    className="w-3 h-3 m-0.5 rounded-sm transition-colors"
                    style={{
                      backgroundColor: getLevelColor(day.level),
                      cursor: 'pointer'
                    }}
                    title={`${day.date}: ${day.count} contributions`}
                  />
                ))}
              </div>
            ))}
          </div>
        </div>
        <div className="flex items-center justify-end text-sm mt-1">
          <span className="mr-1">{aboutText.less}</span>
          {[0, 1, 2, 3, 4].map(level => (
            <div
              key={level}
              className="w-3 h-3 mx-0.5 rounded-sm"
              style={{ backgroundColor: getLevelColor(level) }}
            />
          ))}
          <span className="ml-1">{aboutText.more}</span>
        </div>
      </div>
    );
  };
  
  // Helper function to get contribution level color
  const getLevelColor = (level) => {
    const colors = {
      light: ['#ebedf0', '#9be9a8', '#40c463', '#30a14e', '#216e39'],
      dark: ['#161b22', '#0e4429', '#006d32', '#26a641', '#39d353']
    };
    const theme = 'light'; // You can connect this to your theme context
    return colors[theme][level];
  };
  
  // Helper function to get language colors
  const getLanguageColor = (language) => {
    const colors = {
      JavaScript: '#f1e05a',
      TypeScript: '#2b7489',
      HTML: '#e34c26',
      CSS: '#563d7c',
      Python: '#3572A5',
      Java: '#b07219',
      Ruby: '#701516',
      PHP: '#4F5D95',
      Go: '#00ADD8',
    };
    return colors[language] || '#858585';
  };
  
  return (
    <section
      ref={sectionRef}
      id="about"
      data-section="about"
      className="py-20 px-4 sm:px-6 lg:px-8 bg-slate-50 dark:bg-slate-900 relative"
      style={{
        minHeight: 'calc(100vh - 80px)',
        scrollMarginTop: '120px',
        paddingBottom: '100px',
        position: 'relative'
      }}
    >
      {/* Add invisible triggers at start and end */}
      <SectionTriggers sectionId="about" />
      
      {/* Single section marker for visibility */}
      <div id="about-visibility-center" 
        style={{
          position: 'absolute', 
          top: '50%', 
          left: 0,
          width: '100%',
          height: '100px',
          pointerEvents: 'none',
          zIndex: -1
        }}
      />
      
      <div className="max-w-6xl mx-auto">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Hero Section */}
          <motion.div 
            variants={itemVariants}
            className="flex flex-col lg:flex-row items-center lg:items-start gap-8 mb-16"
          >
            <div className="lg:w-1/3">
              <div className="relative">
                <div className="w-48 h-48 md:w-64 md:h-64 rounded-full bg-blue-500 overflow-hidden">
                  <img 
                    src="https://via.placeholder.com/400x400" 
                    alt={aboutText.author} 
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="absolute -bottom-4 -right-4 bg-white dark:bg-gray-700 rounded-full p-3 shadow-lg">
                  <div className="flex gap-2">
                    <a href="#" aria-label="GitHub" className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400">
                      <FaGithub size={20} />
                    </a>
                    <a href="#" aria-label="LinkedIn" className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400">
                      <FaLinkedin size={20} />
                    </a>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="lg:w-2/3">
              <h1 className="text-4xl font-bold mb-2 text-slate-900 dark:text-white">{aboutText.aboutMe}</h1>
              <div className="h-1 w-20 bg-blue-600 dark:bg-blue-500 mb-6"></div>
              
              <h2 className="text-3xl font-bold mb-4 text-slate-900 dark:text-white">
                Hello, I'm {aboutText.author}
              </h2>
              
              <p className="text-lg mb-4 text-slate-600 dark:text-slate-300">
                {aboutText.passionateDeveloper}
              </p>
              
              <p className="text-lg text-slate-600 dark:text-slate-300">
                {aboutText.passion}
              </p>
            </div>
          </motion.div>

          {/* Skills Section */}
          <motion.div variants={itemVariants}>
            <SectionDivider 
              title={aboutText.mySkills} 
              icon={<FaCode className="text-blue-600 dark:text-blue-500" size={24} />} 
            />
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
              {/* Frontend Skills */}
              <div className="bg-white dark:bg-gray-700 rounded-lg p-6 shadow-md transform transition-transform hover:scale-105">
                <FaCode className="text-4xl text-blue-500 mb-4" />
                <h3 className="text-xl font-bold mb-4">{aboutText.frontend}</h3>
                <ul className="space-y-3">
                  <li className="space-y-1">
                    <div className="flex justify-between">
                      <span>React</span>
                      <span className="text-sm text-blue-600 dark:text-blue-400">{aboutText.expert}</span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                      <div className="bg-blue-600 h-2 rounded-full" style={{ width: '95%' }}></div>
                    </div>
                  </li>
                  <li className="space-y-1">
                    <div className="flex justify-between">
                      <span>JavaScript</span>
                      <span className="text-sm text-blue-600 dark:text-blue-400">{aboutText.expert}</span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                      <div className="bg-blue-600 h-2 rounded-full" style={{ width: '90%' }}></div>
                    </div>
                  </li>
                  <li className="space-y-1">
                    <div className="flex justify-between">
                      <span>CSS/SASS</span>
                      <span className="text-sm text-blue-600 dark:text-blue-400">{aboutText.advanced}</span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                      <div className="bg-blue-600 h-2 rounded-full" style={{ width: '85%' }}></div>
                    </div>
                  </li>
                  <li className="space-y-1">
                    <div className="flex justify-between">
                      <span>TypeScript</span>
                      <span className="text-sm text-blue-600 dark:text-blue-400">{aboutText.advanced}</span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                      <div className="bg-blue-600 h-2 rounded-full" style={{ width: '80%' }}></div>
                    </div>
                  </li>
                </ul>
              </div>
              
              {/* Backend Skills */}
              <div className="bg-white dark:bg-gray-700 rounded-lg p-6 shadow-md transform transition-transform hover:scale-105">
                <FaServer className="text-4xl text-green-500 mb-4" />
                <h3 className="text-xl font-bold mb-4">{aboutText.backend}</h3>
                <ul className="space-y-3">
                  <li className="space-y-1">
                    <div className="flex justify-between">
                      <span>Node.js</span>
                      <span className="text-sm text-green-600 dark:text-green-400">{aboutText.advanced}</span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                      <div className="bg-green-600 h-2 rounded-full" style={{ width: '90%' }}></div>
                    </div>
                  </li>
                  <li className="space-y-1">
                    <div className="flex justify-between">
                      <span>Express</span>
                      <span className="text-sm text-green-600 dark:text-green-400">{aboutText.advanced}</span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                      <div className="bg-green-600 h-2 rounded-full" style={{ width: '85%' }}></div>
                    </div>
                  </li>
                  <li className="space-y-1">
                    <div className="flex justify-between">
                      <span>Python</span>
                      <span className="text-sm text-green-600 dark:text-green-400">{aboutText.intermediate}</span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                      <div className="bg-green-600 h-2 rounded-full" style={{ width: '70%' }}></div>
                    </div>
                  </li>
                  <li className="space-y-1">
                    <div className="flex justify-between">
                      <span>GraphQL</span>
                      <span className="text-sm text-green-600 dark:text-green-400">{aboutText.intermediate}</span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                      <div className="bg-green-600 h-2 rounded-full" style={{ width: '75%' }}></div>
                    </div>
                  </li>
                </ul>
              </div>
              
              {/* Database & Tools */}
              <div className="bg-white dark:bg-gray-700 rounded-lg p-6 shadow-md transform transition-transform hover:scale-105">
                <FaDatabase className="text-4xl text-purple-500 mb-4" />
                <h3 className="text-xl font-bold mb-4">{aboutText.tools}</h3>
                <ul className="space-y-3">
                  <li className="space-y-1">
                    <div className="flex justify-between">
                      <span>MongoDB</span>
                      <span className="text-sm text-purple-600 dark:text-purple-400">{aboutText.advanced}</span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                      <div className="bg-purple-600 h-2 rounded-full" style={{ width: '85%' }}></div>
                    </div>
                  </li>
                  <li className="space-y-1">
                    <div className="flex justify-between">
                      <span>PostgreSQL</span>
                      <span className="text-sm text-purple-600 dark:text-purple-400">{aboutText.advanced}</span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                      <div className="bg-purple-600 h-2 rounded-full" style={{ width: '80%' }}></div>
                    </div>
                  </li>
                  <li className="space-y-1">
                    <div className="flex justify-between">
                      <span>Docker</span>
                      <span className="text-sm text-purple-600 dark:text-purple-400">{aboutText.intermediate}</span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                      <div className="bg-purple-600 h-2 rounded-full" style={{ width: '75%' }}></div>
                    </div>
                  </li>
                  <li className="space-y-1">
                    <div className="flex justify-between">
                      <span>Git/GitHub</span>
                      <span className="text-sm text-purple-600 dark:text-purple-400">{aboutText.expert}</span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                      <div className="bg-purple-600 h-2 rounded-full" style={{ width: '90%' }}></div>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </motion.div>
          
          {/* Experience Section */}
          <motion.div variants={itemVariants} className="mt-16">
            <SectionDivider 
              title={aboutText.professionalExperience} 
              icon={<FaBriefcase className="text-blue-600 dark:text-blue-500" size={22} />}
            />
            
            <div className="relative mt-8 ml-4 pl-8 border-l-2 border-gray-300 dark:border-gray-600">
              {/* Experience item 1 */}
              <div className="mb-12 relative">
                <div className="absolute -left-[42px] bg-slate-50 dark:bg-slate-900 p-1">
                  <div className="w-6 h-6 rounded-full bg-blue-600"></div>
                </div>
                <div className="bg-white dark:bg-gray-700 rounded-lg p-6 shadow-md">
                  <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-2">
                    <h3 className="text-xl font-bold">{aboutText.seniorFrontendDev}</h3>
                    <span className="text-sm px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded">
                      {aboutText.periodPresent}
                    </span>
                  </div>
                  <p className="text-gray-600 dark:text-gray-400 mb-3">{aboutText.techInnovations}</p>
                  <ul className="list-disc pl-5 space-y-1 text-gray-700 dark:text-gray-300">
                    <li>{aboutText.highlight1}</li>
                    <li>{aboutText.highlight2}</li>
                    <li>{aboutText.highlight3}</li>
                  </ul>
                </div>
              </div>
              
              {/* Experience item 2 */}
              <div className="mb-12 relative">
                <div className="absolute -left-[42px] bg-slate-50 dark:bg-slate-900 p-1">
                  <div className="w-6 h-6 rounded-full bg-blue-600"></div>
                </div>
                <div className="bg-white dark:bg-gray-700 rounded-lg p-6 shadow-md">
                  <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-2">
                    <h3 className="text-xl font-bold">{aboutText.fullStackDev}</h3>
                    <span className="text-sm px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded">
                      {aboutText.period2020}
                    </span>
                  </div>
                  <p className="text-gray-600 dark:text-gray-400 mb-3">{aboutText.digitalSolutions}</p>
                  <ul className="list-disc pl-5 space-y-1 text-gray-700 dark:text-gray-300">
                    <li>{aboutText.highlight4}</li>
                    <li>{aboutText.highlight5}</li>
                    <li>{aboutText.highlight6}</li>
                  </ul>
                </div>
              </div>
              
              {/* Experience item 3 */}
              <div className="relative">
                <div className="absolute -left-[42px] bg-slate-50 dark:bg-slate-900 p-1">
                  <div className="w-6 h-6 rounded-full bg-blue-600"></div>
                </div>
                <div className="bg-white dark:bg-gray-700 rounded-lg p-6 shadow-md">
                  <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-2">
                    <h3 className="text-xl font-bold">{aboutText.juniorWebDev}</h3>
                    <span className="text-sm px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded">
                      {aboutText.period2018}
                    </span>
                  </div>
                  <p className="text-gray-600 dark:text-gray-400 mb-3">{aboutText.startupGenius}</p>
                  <ul className="list-disc pl-5 space-y-1 text-gray-700 dark:text-gray-300">
                    <li>{aboutText.highlight7}</li>
                    <li>{aboutText.highlight8}</li>
                    <li>{aboutText.highlight9}</li>
                  </ul>
                </div>
              </div>
            </div>
          </motion.div>
          
          {/* GitHub Section */}
          <motion.div variants={itemVariants} className="mt-16">
            <SectionDivider 
              title="GitHub" 
              icon={<FaGithub className="text-blue-600 dark:text-blue-500" size={24} />}
            />
            
            {isLoading ? (
              <div className="flex justify-center items-center h-48">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
              </div>
            ) : (
              <div className="mt-8">
                {/* GitHub Profile Summary */}
                {githubProfile && (
                  <div className="flex flex-col md:flex-row gap-6 bg-white dark:bg-gray-700 rounded-lg p-6 shadow-md mb-8">
                    <img 
                      src={githubProfile.avatar_url} 
                      alt={githubProfile.name || githubProfile.login} 
                      className="w-24 h-24 rounded-full"
                    />
                    <div>
                      <h3 className="text-2xl font-bold">
                        {githubProfile.name || githubProfile.login}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400 mb-2">
                        @{githubProfile.login}
                      </p>
                      {githubProfile.bio && (
                        <p className="text-gray-700 dark:text-gray-300 mb-3">{githubProfile.bio}</p>
                      )}
                      <div className="flex flex-wrap gap-4 text-sm">
                        <div className="px-3 py-1 bg-gray-100 dark:bg-gray-600 rounded-full">
                          <span className="font-bold">{githubProfile.public_repos}</span> {aboutText.repositories}
                        </div>
                        <div className="px-3 py-1 bg-gray-100 dark:bg-gray-600 rounded-full">
                          <span className="font-bold">{githubProfile.followers}</span> {aboutText.followers}
                        </div>
                        <div className="px-3 py-1 bg-gray-100 dark:bg-gray-600 rounded-full">
                          <span className="font-bold">{githubProfile.following}</span> {aboutText.following}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                
                {/* GitHub Contribution Graph */}
                <div className="mb-8">
                  {renderContributionGrid()}
                </div>
                
                {/* Top Repositories */}
                {contributionStats?.topRepos && (
                  <div>
                    <h3 className="text-xl font-bold mb-4">{aboutText.topRepositories}</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {contributionStats.topRepos.map(repo => (
                        <div 
                          key={repo.id} 
                          className="bg-white dark:bg-gray-700 rounded-lg p-5 shadow-md border border-gray-200 dark:border-gray-600 hover:shadow-lg transition-shadow"
                        >
                          <h4 className="font-bold text-lg">
                            <a 
                              href={repo.html_url} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:underline dark:text-blue-400"
                            >
                              {repo.name}
                            </a>
                          </h4>
                          <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
                            {repo.description || aboutText.noDescription}
                          </p>
                          <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                            {repo.language && (
                              <span className="mr-4">
                                <span 
                                  className="inline-block w-2 h-2 rounded-full mr-1"
                                  style={{ backgroundColor: getLanguageColor(repo.language) }}
                                ></span>
                                {repo.language}
                              </span>
                            )}
                            <span className="mr-4">⭐ {repo.stargazers_count}</span>
                            <span>🍴 {repo.forks_count}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </motion.div>
        </motion.div>
      </div>
      
      {/* Bottom marker for consistent spacing */}
      <div 
        className="w-full h-8" 
        id="about-end-marker" 
        aria-hidden="true"
        style={{ marginBottom: '40px' }}
      />
    </section>
  );
};

export default About;