/**
 * Project data organized to support multiple languages
 * Structure allows for easy expansion to additional languages
 * while maintaining backward compatibility
 */

// Current language setting (can be connected to a language context/state later)
const DEFAULT_LANG = 'en';

// Multi-language project data
const projectsDataMultiLang = {
  en: [
    {
      id: 1,
      title: "3D Game Engine",
      description: "A custom-built 3D game engine with physics simulation, material rendering, and support for multiplayer functionality.",
      image: "/images/projects/game-engine.jpg",
      categories: ["game"],
      githubUrl: "https://github.com/yourusername/game-engine",
      demoUrl: "https://your-game-demo.com",
      technologies: ["C++", "OpenGL", "WebGL", "JavaScript"]
    },
    {
      id: 2,
      title: "E-Commerce Platform",
      description: "Full-stack e-commerce application with user authentication, product catalog, shopping cart, and payment processing functionality.",
      image: "/images/projects/ecommerce.jpg",
      categories: ["web", "fullstack"],
      githubUrl: "https://github.com/yourusername/ecommerce",
      liveUrl: "https://your-ecommerce.com",
      technologies: ["React", "Node.js", "MongoDB", "Stripe API"]
    },
    {
      id: 3,
      title: "Virtual Reality Puzzle Game",
      description: "An immersive VR puzzle-solving experience featuring interactive environments and physics-based challenges.",
      image: "/images/projects/vr-game.jpg",
      categories: ["game"],
      githubUrl: "https://github.com/yourusername/vr-puzzle",
      demoUrl: "https://vr-puzzle-showcase.com",
      technologies: ["Unity", "C#", "Oculus SDK", "3D Modeling"]
    },
    {
      id: 4,
      title: "Company Website",
      description: "A responsive corporate website with CMS integration, analytics dashboard, and optimized for search engines.",
      image: "/images/projects/company-website.jpg",
      categories: ["web"],
      githubUrl: "https://github.com/yourusername/company-site",
      liveUrl: "https://example-company.com",
      technologies: ["React", "Tailwind CSS", "GraphQL", "Netlify CMS"]
    },
    {
      id: 5,
      title: "Banking Management System",
      description: "Comprehensive banking platform with secure transaction processing, account management, and reporting features.",
      image: "/images/projects/banking-system.jpg",
      categories: ["fullstack"],
      githubUrl: "https://github.com/yourusername/banking-system",
      liveUrl: "https://banking-demo.com",
      technologies: ["Java", "Spring Boot", "PostgreSQL", "Docker", "Kubernetes"]
    }
  ],
  // Example of another language (German)
  de: [
    {
      id: 1,
      title: "3D-Spiel-Engine",
      description: "Eine maßgeschneiderte 3D-Spiel-Engine mit Physiksimulation, Materialrendering und Unterstützung für Mehrspielerfunktionen.",
      image: "/images/projects/game-engine.jpg",
      categories: ["game"],
      githubUrl: "https://github.com/yourusername/game-engine",
      demoUrl: "https://your-game-demo.com",
      technologies: ["C++", "OpenGL", "WebGL", "JavaScript"]
    },
    {
      id: 2,
      title: "E-Commerce-Plattform",
      description: "Full-Stack-E-Commerce-Anwendung mit Benutzerauthentifizierung, Produktkatalog, Warenkorb und Zahlungsabwicklungsfunktionalität.",
      image: "/images/projects/ecommerce.jpg",
      categories: ["web", "fullstack"],
      githubUrl: "https://github.com/yourusername/ecommerce",
      liveUrl: "https://your-ecommerce.com",
      technologies: ["React", "Node.js", "MongoDB", "Stripe API"]
    },
    {
      id: 3,
      title: "Virtual Reality Puzzle-Spiel",
      description: "Ein immersives VR-Puzzle-Erlebnis mit interaktiven Umgebungen und physikbasierten Herausforderungen.",
      image: "/images/projects/vr-game.jpg",
      categories: ["game"],
      githubUrl: "https://github.com/yourusername/vr-puzzle",
      demoUrl: "https://vr-puzzle-showcase.com",
      technologies: ["Unity", "C#", "Oculus SDK", "3D-Modellierung"]
    },
    {
      id: 4,
      title: "Firmenwebsite",
      description: "Eine reaktionsfähige Unternehmenswebsite mit CMS-Integration, Analyse-Dashboard und optimiert für Suchmaschinen.",
      image: "/images/projects/company-website.jpg",
      categories: ["web"],
      githubUrl: "https://github.com/yourusername/company-site",
      liveUrl: "https://example-company.com",
      technologies: ["React", "Tailwind CSS", "GraphQL", "Netlify CMS"]
    },
    {
      id: 5,
      title: "Bankenverwaltungssystem",
      description: "Umfassende Banking-Plattform mit sicherer Transaktionsverarbeitung, Kontoverwaltung und Berichtsfunktionen.",
      image: "/images/projects/banking-system.jpg",
      categories: ["fullstack"],
      githubUrl: "https://github.com/yourusername/banking-system",
      liveUrl: "https://banking-demo.com",
      technologies: ["Java", "Spring Boot", "PostgreSQL", "Docker", "Kubernetes"]
    }
  ]
  // Add more languages as needed
};

// Multi-language category data
const projectCategoriesMultiLang = {
  en: [
    { id: 'all', label: 'All' },
    { id: 'web', label: 'Web' },
    { id: 'fullstack', label: 'Fullstack' },
    { id: 'game', label: 'Game Dev' }
  ],
  de: [
    { id: 'all', label: 'Alle' },
    { id: 'web', label: 'Web' },
    { id: 'fullstack', label: 'Fullstack' },
    { id: 'game', label: 'Spielentwicklung' }
  ],
  // Add more languages as needed
};

// Add UI text translations
const projectsUITextMultiLang = {
  en: {
    sectionTitle: "My Projects",
    sectionSubtitle: "Explore my recent work across different development areas and technologies.",
    emptyState: "No projects found in this category. Try selecting a different filter."
  },
  de: {
    sectionTitle: "Meine Projekte",
    sectionSubtitle: "Entdecken Sie meine neuesten Arbeiten in verschiedenen Entwicklungsbereichen und Technologien.",
    emptyState: "Keine Projekte in dieser Kategorie gefunden. Versuchen Sie einen anderen Filter auszuwählen."
  },
  // Add more languages as needed
};

/**
 * Helper functions to get data based on current language
 */
export const getProjectsData = (lang = DEFAULT_LANG) => {
  return projectsDataMultiLang[lang] || projectsDataMultiLang[DEFAULT_LANG];
};

export const getProjectCategories = (lang = DEFAULT_LANG) => {
  return projectCategoriesMultiLang[lang] || projectCategoriesMultiLang[DEFAULT_LANG];
};

// Add helper function for UI text
export const getProjectsUIText = (lang = DEFAULT_LANG) => {
  return projectsUITextMultiLang[lang] || projectsUITextMultiLang[DEFAULT_LANG];
};

// For backward compatibility with the current implementation
export const projectsData = projectsDataMultiLang[DEFAULT_LANG];
export const projectCategories = projectCategoriesMultiLang[DEFAULT_LANG];
export const projectsUIText = projectsUITextMultiLang[DEFAULT_LANG];