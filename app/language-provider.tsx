'use client';

import { useEffect } from 'react';
import { useLanguageStore } from '@/store/languageStore';

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const { language } = useLanguageStore();

  useEffect(() => {
    // Update HTML attributes when language changes
    document.documentElement.lang = language;
    
    // Set direction based on language
    if (language === 'ar' || language === 'ur') {
      document.documentElement.dir = 'rtl';
    } else {
      document.documentElement.dir = 'ltr';
    }

    // Add language class to body for CSS targeting
    document.body.classList.remove('lang-en', 'lang-ar', 'lang-ur');
    document.body.classList.add(`lang-${language}`);
  }, [language]);

  return (
    <>
      {children}
    </>
  );
}
