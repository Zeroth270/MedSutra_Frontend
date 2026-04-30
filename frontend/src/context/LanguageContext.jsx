import { createContext, useContext, useState, useEffect } from 'react';
import i18n from 'i18next';

const LanguageContext = createContext();

export const LANGUAGES = [
  { code: 'en', name: 'English', native: 'English' },
  { code: 'hi', name: 'Hindi', native: 'हिन्दी' },
  { code: 'kn', name: 'Kannada', native: 'ಕನ್ನಡ' },
  { code: 'ta', name: 'Tamil', native: 'தமிழ்' },
  { code: 'te', name: 'Telugu', native: 'తెలుగు' },
  { code: 'mr', name: 'Marathi', native: 'मराठी' },
  { code: 'ml', name: 'Malayalam', native: 'മലയാളം' }
];

export const LanguageProvider = ({ children }) => {
  const [currentLanguage, setCurrentLanguage] = useState(() => {
    return localStorage.getItem('medsutra-language') || 'en';
  });

  useEffect(() => {
    localStorage.setItem('medsutra-language', currentLanguage);
    document.documentElement.lang = currentLanguage;
    i18n.changeLanguage(currentLanguage);
  }, [currentLanguage]);

  const setLanguage = (code) => {
    setCurrentLanguage(code);
  };

  const selectedLanguage = LANGUAGES.find(l => l.code === currentLanguage) || LANGUAGES[0];

  return (
    <LanguageContext.Provider value={{ currentLanguage, setLanguage, selectedLanguage, LANGUAGES }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
