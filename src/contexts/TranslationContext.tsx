'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { translations, Language, TranslationKey } from '@/lib/translations';

interface TranslationContextType {
  currentLanguage: Language;
  t: (key: TranslationKey) => string;
  switchLanguage: (lang: Language) => void;
}

const TranslationContext = createContext<TranslationContextType | undefined>(undefined);

export function TranslationProvider({ children }: { children: React.ReactNode }) {
  const [currentLanguage, setCurrentLanguage] = useState<Language>('fr');

  // Load language from localStorage on mount
  useEffect(() => {
    const savedLanguage = localStorage.getItem('marocup-language') as Language;
    if (savedLanguage && translations[savedLanguage]) {
      setCurrentLanguage(savedLanguage);
    }
  }, []);

  // Save language to localStorage when it changes
  useEffect(() => {
    localStorage.setItem('marocup-language', currentLanguage);
  }, [currentLanguage]);

  const t = useCallback((key: TranslationKey): string => {
    return translations[currentLanguage][key] || key;
  }, [currentLanguage]);

  const switchLanguage = useCallback((lang: Language) => {
    setCurrentLanguage(lang);
  }, []);

  return (
    <TranslationContext.Provider value={{ currentLanguage, t, switchLanguage }}>
      {children}
    </TranslationContext.Provider>
  );
}

export function useTranslation() {
  const context = useContext(TranslationContext);
  if (context === undefined) {
    throw new Error('useTranslation must be used within a TranslationProvider');
  }
  return context;
}
