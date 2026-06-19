import { createContext, useContext, useState, useCallback } from 'react';

const LanguageContext = createContext(null);

export function LanguageProvider({ children }) {
  const [selectedLanguage, setSelectedLanguageState] = useState(() => {
    try {
      const saved = localStorage.getItem('16chitthi_language');
      return saved === 'mr' ? 'mr' : 'en';
    } catch {
      return 'en';
    }
  });

  const setSelectedLanguage = useCallback((lang) => {
    const nextLang = lang === 'mr' ? 'mr' : 'en';
    setSelectedLanguageState(nextLang);
    try {
      localStorage.setItem('16chitthi_language', nextLang);
    } catch (e) {
      // Ignore storage errors
    }
  }, []);

  return (
    <LanguageContext.Provider value={{ selectedLanguage, setSelectedLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
