'use client';

import { useState, useEffect, useCallback } from 'react';
import { translations, Language, TranslationKey } from '@/lib/translations';

export function useTranslation() {
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

  return {
    t,
    currentLanguage,
    switchLanguage,
  };
}
