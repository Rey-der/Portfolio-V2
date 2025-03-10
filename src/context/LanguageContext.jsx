import React, { createContext, useState, useContext, useEffect } from 'react';

// Available languages
export const LANGUAGES = {
  EN: 'en',
  DE: 'de'
};

// Create the language context
const LanguageContext = createContext();

// Custom hook to use the language context
export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

// Language provider component
export const LanguageProvider = ({ children }) => {
  // Initialize language from localStorage or default to English
  const [currentLanguage, setCurrentLanguage] = useState(() => {
    const savedLanguage = localStorage.getItem('language');
    return savedLanguage || LANGUAGES.EN;
  });

  // Update localStorage when language changes
  useEffect(() => {
    localStorage.setItem('language', currentLanguage);
    // Optional: Update HTML lang attribute
    document.documentElement.lang = currentLanguage;
  }, [currentLanguage]);

  // Function to toggle between languages
  const toggleLanguage = () => {
    setCurrentLanguage(prevLang => 
      prevLang === LANGUAGES.EN ? LANGUAGES.DE : LANGUAGES.EN
    );
  };

  // Provide the language state and toggle function to children
  return (
    <LanguageContext.Provider value={{ currentLanguage, toggleLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};