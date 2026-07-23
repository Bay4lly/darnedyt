'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { dictionary, Language } from '@/config/i18n';

interface LanguageContextType {
  lang: Language;
  setLang: (lang: Language) => void;
  t: typeof dictionary['en'];
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Language>('en');

  useEffect(() => {
    const savedLang = localStorage.getItem('darned_lang') as Language;
    if (savedLang && (savedLang === 'en' || savedLang === 'tr')) {
      setLangState(savedLang);
    }
  }, []);

  const setLang = (newLang: Language) => {
    setLangState(newLang);
    localStorage.setItem('darned_lang', newLang);
  };

  const value = {
    lang,
    setLang,
    t: dictionary[lang] || dictionary.en,
  };

  return (
    <LanguageContext.Provider value={value}>
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
