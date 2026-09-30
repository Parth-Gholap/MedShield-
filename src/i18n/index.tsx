import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { en, Translations } from './en';
import { hi } from './hi';

export type Language = 'en' | 'hi';

const LANGUAGE_STORAGE_KEY = '@medshield_language';

interface I18nContextType {
  language: Language;
  setLanguage: (lang: Language) => Promise<void>;
  t: Translations;
}

const translations: Record<Language, Translations> = { en, hi };

const I18nContext = createContext<I18nContextType>({
  language: 'en',
  setLanguage: async () => {},
  t: en,
});

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>('en');

  // Load saved language on startup
  useEffect(() => {
    (async () => {
      try {
        const saved = await AsyncStorage.getItem(LANGUAGE_STORAGE_KEY);
        if (saved === 'en' || saved === 'hi') {
          setLanguageState(saved);
        }
      } catch (err) {
        console.warn('Could not load saved language:', err);
      }
    })();
  }, []);

  const setLanguage = async (newLang: Language) => {
    setLanguageState(newLang);
    try {
      await AsyncStorage.setItem(LANGUAGE_STORAGE_KEY, newLang);
    } catch (err) {
      console.warn('Could not persist language choice:', err);
    }
  };

  const t = translations[language] || en;

  return (
    <I18nContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </I18nContext.Provider>
  );
}

/**
 * Hook to access current translations and language switcher
 */
export function useI18n() {
  return useContext(I18nContext);
}

export { en, hi };
