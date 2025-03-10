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
    passionateDeveloper: "I'm a fullstack developer specialized in building modern web applications.",
    passionateTagline: "Passionate developer dedicated to creating beautiful, responsive, and user-friendly web experiences.",
    whoIAm: "Who I Am",
    frontendDeveloper: "With over 5 years of experience, I focus on creating intuitive user interfaces and robust backend systems that deliver exceptional user experiences.",
    frontendBio: "I'm a frontend developer with over 5 years of experience building modern web applications. I specialize in React, JavaScript, and creating responsive designs that provide excellent user experiences.",
    passion: "My passion lies in translating complex problems into elegant, efficient solutions through clean code and intuitive interfaces. I'm constantly learning new technologies to enhance my skill set.",
    
    // Personal info
    location: "Location",
    sanFrancisco: "San Francisco",
    sanFranciscoCA: "San Francisco, CA",
    education: "Education",
    computerScience: "Computer Science",
    bsComputerScience: "B.S. Computer Science",
    learning: "Learning",
    web3AI: "Web3 & AI Integration",
    
    // Skills section
    mySkills: "My Skills",
    myJourney: "My Journey",
    beyondCoding: "Beyond Coding",
    whenNotCoding: "When I'm not immersed in code, here's how I spend my time:",
    reading: "Reading",
    scienceFiction: "Science fiction & tech books",
    running: "Running",
    halfMarathons: "Completed two half marathons",
    music: "Music",
    guitarPlayer: "Amateur guitar player",
    travel: "Travel",
    visitedCountries: "Visited 15 countries",
    
    // Contact section
    letsWorkTogether: "Let's Work Together",
    contactMe: "Contact Me",
    getInTouch: "Get in touch",
    openToOpportunities: "I'm always open to new opportunities and collaborations. Feel free to reach out through any channel below.",
    sendMessage: "Send me a message",
    
    // Terminal section
    portfolioStatus: "portfolio status",
    loadingDeveloperInformation: "Loading developer information...",
    skillsLoadedSuccessfully: "✓ Skills loaded successfully",
    experienceVerified: "✓ Experience verified",
    readyToCollaborate: "Ready to collaborate on new projects!",
    terminal: "TERMINAL",
    output: "OUTPUT",
    
    // VS Code UI elements
    vsCodeTitle: "developer-portfolio - Visual Studio Code",
    explorer: "Explorer",
    portfolio: "PORTFOLIO",
    ready: "📶 ready",
    main: "🔀 main",
    encoding: "UTF-8",
    language: "JavaScript React",
    lineCol: "Ln 42, Col 18",
    
    // Skills.json content
    frontend: "frontend",
    backend: "backend",
    tools: "tools",
    expert: "Expert",
    advanced: "Advanced",
    intermediate: "Intermediate",
    
    // Timeline/Experience content from About.jsx
    timeline2023: "2023",
    timeline2021: "2021", 
    timeline2019: "2019",
    seniorFrontendDesc: "Led the development of a complex SPA using React, TypeScript and Redux. Improved performance by 35%.",
    fullstackDevDesc: "Built responsive web applications using modern JavaScript frameworks. Implemented CI/CD pipelines.",
    juniorDevDesc: "Developed front-end components and helped build the company's main product using React.",
    
    // Experience.js content
    professionalExperience: "Professional Experience",
    author: "Developer",
    seniorFrontendDev: "Senior Frontend Developer",
    techInnovations: "Tech Innovations Inc.",
    periodPresent: "2022 - Present",
    highlight1: "Led development of a complex SPA using React and TypeScript",
    highlight2: "Improved application performance by 35%",
    highlight3: "Mentored junior developers and established code standards",
    fullStackDev: "Full Stack Developer",
    digitalSolutions: "Digital Solutions Ltd.",
    period2020: "2020 - 2022",
    highlight4: "Built responsive web applications",
    highlight5: "Implemented CI/CD pipelines using GitHub Actions",
    highlight6: "Developed RESTful APIs using Node.js and Express",
    juniorWebDev: "Junior Web Developer",
    startupGenius: "StartupGenius",
    period2018: "2018 - 2020",
    highlight7: "Developed front-end components using React",
    highlight8: "Created responsive designs using SCSS",
    highlight9: "Collaborated with UX designers to implement new features",
    
    // Contact.jsx content
    contactInfoTitle: "ContactInfo",
    emailLabel: "email",
    email: "developer@example.com",
    githubLabel: "github",
    github: "github.com/username",
    linkedinLabel: "linkedin",
    linkedin: "linkedin.com/in/username",
    twitterLabel: "twitter",
    twitter: "@username"
  },
  de: {
    // Basic about section
    aboutMe: "Über Mich",
    passionateDeveloper: "Ich bin ein Fullstack-Entwickler, der sich auf die Entwicklung moderner Webanwendungen spezialisiert hat.",
    passionateTagline: "Leidenschaftlicher Entwickler, der sich auf die Erstellung schöner, responsiver und benutzerfreundlicher Web-Erlebnisse konzentriert.",
    whoIAm: "Wer ich bin",
    frontendDeveloper: "Mit über 5 Jahren Erfahrung konzentriere ich mich auf die Erstellung intuitiver Benutzeroberflächen und robuster Backend-Systeme, die außergewöhnliche Benutzererlebnisse bieten.",
    frontendBio: "Ich bin ein Frontend-Entwickler mit über 5 Jahren Erfahrung im Aufbau moderner Webanwendungen. Ich bin spezialisiert auf React, JavaScript und das Erstellen von responsiven Designs, die ausgezeichnete Benutzererfahrungen bieten.",
    passion: "Meine Leidenschaft liegt darin, komplexe Probleme durch sauberen Code und intuitive Schnittstellen in elegante, effiziente Lösungen zu übersetzen. Ich lerne ständig neue Technologien, um meine Fähigkeiten zu erweitern.",
    
    // Personal info
    location: "Standort",
    sanFrancisco: "San Francisco",
    sanFranciscoCA: "San Francisco, CA",
    education: "Ausbildung",
    computerScience: "Informatik",
    bsComputerScience: "B.S. Informatik",
    learning: "Lernen",
    web3AI: "Web3 & KI Integration",
    
    // Skills section
    mySkills: "Meine Fähigkeiten",
    myJourney: "Meine Reise",
    beyondCoding: "Jenseits des Codings",
    whenNotCoding: "Wenn ich nicht programmiere, verbringe ich meine Zeit so:",
    reading: "Lesen",
    scienceFiction: "Science-Fiction & Technikbücher",
    running: "Laufen",
    halfMarathons: "Zwei Halbmarathons absolviert",
    music: "Musik",
    guitarPlayer: "Amateur-Gitarrenspieler",
    travel: "Reisen",
    visitedCountries: "15 Länder besucht",
    
    // Contact section
    letsWorkTogether: "Lassen Sie uns zusammenarbeiten",
    contactMe: "Kontaktieren Sie mich",
    getInTouch: "Kontaktieren Sie mich",
    openToOpportunities: "Ich bin immer offen für neue Möglichkeiten und Zusammenarbeit. Sie können mich über jeden der folgenden Kanäle erreichen.",
    sendMessage: "Nachricht senden",
    
    // Terminal section
    portfolioStatus: "Portfolio Status",
    loadingDeveloperInformation: "Lade Entwicklerinformationen...",
    skillsLoadedSuccessfully: "✓ Fähigkeiten erfolgreich geladen",
    experienceVerified: "✓ Erfahrung verifiziert",
    readyToCollaborate: "Bereit zur Zusammenarbeit an neuen Projekten!",
    terminal: "TERMINAL",
    output: "AUSGABE",
    
    // VS Code UI elements
    vsCodeTitle: "developer-portfolio - Visual Studio Code",
    explorer: "Explorer",
    portfolio: "PORTFOLIO",
    ready: "📶 bereit",
    main: "🔀 main",
    encoding: "UTF-8",
    language: "JavaScript React",
    lineCol: "Z 42, Sp 18",
    
    // Skills.json content
    frontend: "Frontend",
    backend: "Backend",
    tools: "Werkzeuge",
    expert: "Experte",
    advanced: "Fortgeschritten",
    intermediate: "Mittelstufe",
    
    // Timeline/Experience content from About.jsx
    timeline2023: "2023",
    timeline2021: "2021", 
    timeline2019: "2019",
    seniorFrontendDesc: "Leitete die Entwicklung einer komplexen SPA mit React, TypeScript und Redux. Verbesserte die Leistung um 35%.",
    fullstackDevDesc: "Erstellte responsive Webanwendungen mit modernen JavaScript-Frameworks. Implementierte CI/CD-Pipelines.",
    juniorDevDesc: "Entwickelte Frontend-Komponenten und half beim Aufbau des Hauptprodukts des Unternehmens mit React.",
    
    // Experience.js content
    professionalExperience: "Berufserfahrung",
    author: "Entwickler",
    seniorFrontendDev: "Senior Frontend-Entwickler",
    techInnovations: "Tech Innovations Inc.",
    periodPresent: "2022 - Heute",
    highlight1: "Leitete die Entwicklung einer komplexen SPA mit React und TypeScript",
    highlight2: "Verbesserte die Anwendungsleistung um 35%",
    highlight3: "Betreute Junior-Entwickler und etablierte Code-Standards",
    fullStackDev: "Full-Stack-Entwickler",
    digitalSolutions: "Digital Solutions GmbH",
    period2020: "2020 - 2022",
    highlight4: "Entwickelte responsive Webanwendungen",
    highlight5: "Implementierte CI/CD-Pipelines mit GitHub Actions",
    highlight6: "Entwickelte RESTful APIs mit Node.js und Express",
    juniorWebDev: "Junior Web-Entwickler",
    startupGenius: "StartupGenius",
    period2018: "2018 - 2020",
    highlight7: "Entwickelte Frontend-Komponenten mit React",
    highlight8: "Erstellte responsive Designs mit SCSS",
    highlight9: "Arbeitete mit UX-Designern bei der Implementierung neuer Funktionen zusammen",
    
    // Contact.jsx content
    contactInfoTitle: "Kontaktinformationen",
    emailLabel: "E-Mail",
    email: "entwickler@beispiel.com",
    githubLabel: "GitHub",
    github: "github.com/benutzername",
    linkedinLabel: "LinkedIn",
    linkedin: "linkedin.com/in/benutzername",
    twitterLabel: "Twitter",
    twitter: "@benutzername"
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