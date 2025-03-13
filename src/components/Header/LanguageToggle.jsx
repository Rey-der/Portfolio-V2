import React from 'react';

const LanguageToggle = ({ currentLanguage, toggleLanguage }) => {
  return (
    <button
      onClick={toggleLanguage}
      className="bg-gray-800 bg-opacity-40 hover:bg-opacity-60 text-gray-300 font-bold py-2 px-4 rounded"
      aria-label="Toggle Language"
    >
      {currentLanguage === 'en' ? 'DE' : 'EN'}
    </button>
  );
};

export default LanguageToggle;