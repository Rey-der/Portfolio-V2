/**
 * Home page data organized to support multiple languages
 * Structure allows for easy expansion to additional languages
 * while maintaining backward compatibility
 */

// Current language setting (can be connected to a language context/state later)
const DEFAULT_LANG = 'en';

// Multi-language home page text data
const homeTextMultiLang = {
  en: {
    welcomeTitle: "Welcome to My Portfolio",
    welcomeSubtitle: "I create beautiful, responsive websites with modern technologies. Explore my work and let's build something amazing together."
  },
  de: {
    welcomeTitle: "Willkommen zu meinem Portfolio",
    welcomeSubtitle: "Ich entwickle wunderschöne, responsive Websites mit modernen Technologien. Entdecken Sie meine Arbeit und lassen Sie uns gemeinsam etwas Großartiges schaffen."
  },
  // Add more languages as needed
};

/**
 * Helper functions to get data based on current language
 */
export const getHomeText = (lang = DEFAULT_LANG) => {
  return homeTextMultiLang[lang] || homeTextMultiLang[DEFAULT_LANG];
};

// For backward compatibility with the current implementation
export const homeText = homeTextMultiLang[DEFAULT_LANG];