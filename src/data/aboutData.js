/**
 * About page data organized to support multiple languages
 * Structure allows for easy expansion to additional languages
 * while maintaining backward compatibility
 */

// Current language setting (can be connected to a language context/state later)
const DEFAULT_LANG = 'en';

// Multi-language about page text data
const aboutTextMultiLang = {
  en: {
    // Basic about section
    aboutMe: "About Me",
    author: "Developer",
    passionateDeveloper: "I'm a fullstack developer specialized in building modern web applications with an eye for design and a focus on user experience.",
    passion: "My passion lies in translating complex problems into elegant, efficient solutions through clean code and intuitive interfaces. I'm constantly learning new technologies to enhance my skill set.",
    
    // Skills section
    mySkills: "Skills",
    frontend: "Frontend",
    backend: "Backend",
    tools: "Database & Tools",
    
    // Experience section
    professionalExperience: "Professional Experience",
    seniorFrontendDev: "Senior Frontend Developer",
    techInnovations: "Tech Innovations Inc.",
    periodPresent: "2022 - Present",
    highlight1: "Led development of a complex SPA using React and TypeScript",
    highlight2: "Improved application performance by 35%",
    highlight3: "Mentored junior developers and established code standards",
    
    fullStackDev: "Full Stack Developer",
    digitalSolutions: "Digital Solutions Ltd.",
    period2020: "2020 - 2022",
    highlight4: "Built responsive web applications using modern JavaScript frameworks",
    highlight5: "Implemented CI/CD pipelines using GitHub Actions",
    highlight6: "Developed RESTful APIs using Node.js and Express",
    
    juniorWebDev: "Junior Web Developer",
    startupGenius: "StartupGenius",
    period2018: "2018 - 2020",
    highlight7: "Developed front-end components using React",
    highlight8: "Created responsive designs using SCSS and Tailwind CSS",
    highlight9: "Collaborated with UX designers to implement new features",

    // GitHub section
    githubTabTitle: "GitHub",
    contributionActivity: "Contribution Activity",
    topRepositories: "Top Repositories",
    noDescription: "No description provided",
    less: "Less",
    more: "More",
    repositories: "repositories",
    followers: "followers",
    following: "following",
    loading: "Loading GitHub data...",
    
    // Social links
    socialLinks: "Social Links",
    github: "GitHub",
    linkedin: "LinkedIn",
    twitter: "Twitter",
    
    // Skill levels
    expert: "Expert",
    advanced: "Advanced",
    intermediate: "Intermediate",
  },
  de: {
    // Basic about section
    aboutMe: "Über Mich",
    author: "Entwickler",
    passionateDeveloper: "Ich bin ein Fullstack-Entwickler, spezialisiert auf moderne Webanwendungen mit einem Auge für Design und Fokus auf Benutzererfahrung.",
    passion: "Meine Leidenschaft liegt darin, komplexe Probleme durch sauberen Code und intuitive Schnittstellen in elegante, effiziente Lösungen zu übersetzen. Ich lerne ständig neue Technologien, um meine Fähigkeiten zu erweitern.",
    
    // Skills section
    mySkills: "Fähigkeiten",
    frontend: "Frontend",
    backend: "Backend",
    tools: "Datenbanken & Tools",
    
    // Experience section
    professionalExperience: "Berufserfahrung",
    seniorFrontendDev: "Senior Frontend-Entwickler",
    techInnovations: "Tech Innovations GmbH",
    periodPresent: "2022 - Heute",
    highlight1: "Leitete die Entwicklung einer komplexen SPA mit React und TypeScript",
    highlight2: "Verbesserte die Anwendungsleistung um 35%",
    highlight3: "Betreute Junior-Entwickler und etablierte Code-Standards",
    
    fullStackDev: "Full-Stack-Entwickler",
    digitalSolutions: "Digital Solutions GmbH",
    period2020: "2020 - 2022",
    highlight4: "Entwickelte responsive Webanwendungen mit modernen JavaScript-Frameworks",
    highlight5: "Implementierte CI/CD-Pipelines mit GitHub Actions",
    highlight6: "Entwickelte RESTful APIs mit Node.js und Express",
    
    juniorWebDev: "Junior Web-Entwickler",
    startupGenius: "StartupGenius",
    period2018: "2018 - 2020",
    highlight7: "Entwickelte Frontend-Komponenten mit React",
    highlight8: "Erstellte responsive Designs mit SCSS und Tailwind CSS",
    highlight9: "Arbeitete mit UX-Designern bei der Implementierung neuer Funktionen zusammen",
    
    // GitHub section
    githubTabTitle: "GitHub",
    contributionActivity: "Beitragsaktivität",
    topRepositories: "Top-Repositories",
    noDescription: "Keine Beschreibung vorhanden",
    less: "Weniger",
    more: "Mehr",
    repositories: "Repositories",
    followers: "Follower",
    following: "Folgt",
    loading: "GitHub-Daten werden geladen...",
    
    // Social links
    socialLinks: "Soziale Medien",
    github: "GitHub",
    linkedin: "LinkedIn",
    twitter: "Twitter",
    
    // Skill levels
    expert: "Experte",
    advanced: "Fortgeschritten",
    intermediate: "Mittelstufe",
  },
  // Add more languages as needed
};

/**
 * Helper functions to get data based on current language
 */
export const getAboutText = (lang = DEFAULT_LANG) => {
  return aboutTextMultiLang[lang] || aboutTextMultiLang[DEFAULT_LANG];
};

// For backward compatibility with the current implementation
export const aboutText = aboutTextMultiLang[DEFAULT_LANG];