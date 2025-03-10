/**
 * Footer data organized to support multiple languages
 * Structure allows for easy expansion to additional languages
 * while maintaining backward compatibility
 */
const DEFAULT_LANG = 'en';

// Multi-language footer text data
const footerTextMultiLang = {
  en: {
    yourPortfolio: "Your Portfolio",
    footerDescription: "Creating beautiful, responsive websites with modern technologies.",
    connect: "Connect",
    github: "GitHub",
    linkedin: "LinkedIn",
    contactMe: "Contact Me",
    getInTouch: "Get in touch with me",
    allRightsReserved: "All rights reserved."
  },
  de: {
    yourPortfolio: "Dein Portfolio",
    footerDescription: "Erstellung schöner, responsiver Websites mit modernen Technologien.",
    connect: "Verbinden",
    github: "GitHub",
    linkedin: "LinkedIn",
    contactMe: "Kontaktiere mich",
    getInTouch: "Nehmen Sie Kontakt mit mir auf",
    allRightsReserved: "Alle Rechte vorbehalten."
  },
  // Add more languages as needed
};

/** Helper functions to get data based on current language */
export const getFooterText = (lang = DEFAULT_LANG) => {
  return footerTextMultiLang[lang] || footerTextMultiLang[DEFAULT_LANG];
};

// For backward compatibility with the current implementation
export const footerText = footerTextMultiLang[DEFAULT_LANG];