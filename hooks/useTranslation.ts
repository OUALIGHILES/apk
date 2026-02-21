'use client';

import { useLanguageStore } from '@/store/languageStore';

/**
 * Hook to use translations with automatic re-render on language change
 * @returns Object with translate function and current language
 */
export function useTranslation() {
  const language = useLanguageStore((state) => state.language);
  const translations = useLanguageStore((state) => state.translations);
  const setLanguage = useLanguageStore((state) => state.setLanguage);

  const t = (key: string): string => {
    return translations[key] || key;
  };

  return {
    t,
    language,
    setLanguage,
    translations,
  };
}

/**
 * Get current language without re-rendering (client-side only)
 */
export function getCurrentLanguage(): 'en' | 'ar' | 'ur' {
  // Only run on client side
  if (typeof window === 'undefined') {
    return 'en'; // Default to English on server
  }
  
  try {
    const stored = localStorage.getItem('language-storage');
    if (stored) {
      const parsed = JSON.parse(stored);
      return parsed.state?.language || 'en';
    }
  } catch (error) {
    console.error('Error getting language:', error);
  }
  
  return 'en';
}
