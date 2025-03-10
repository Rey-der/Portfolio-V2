/**
 * Header data organized to support multiple languages
 * Structure allows for easy expansion to additional languages
 * while maintaining backward compatibility
 */

// Current language setting (can be connected to a language context/state later)
const DEFAULT_LANG = 'en';

// Multi-language header text data
const headerTextMultiLang = {
  en: {
    home: "Home",
    projects: "Projects",
    about: "About",
    guestbook: "Guestbook",
    contact: "Contact",
    yourPortfolio: "Your Portfolio",
    toggleMenu: "Toggle menu"
  },
  de: {
    home: "Startseite",
    projects: "Projekte",
    about: "Über mich",
    guestbook: "Gästebuch",
    contact: "Kontakt",
    yourPortfolio: "Dein Portfolio",
    toggleMenu: "Menü umschalten"
  },
  // Add more languages as needed
};

/**
 * Helper functions to get data based on current language
 */
export const getHeaderText = (lang = DEFAULT_LANG) => {
  return headerTextMultiLang[lang] || headerTextMultiLang[DEFAULT_LANG];
};

// For backward compatibility with the current implementation
export const headerText = headerTextMultiLang[DEFAULT_LANG];