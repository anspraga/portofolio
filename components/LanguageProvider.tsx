'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { translations, Language } from '@/lib/i18n';

interface LanguageContextType {
  lang: Language;
  setLang: (lang: Language) => void;
  t: typeof translations.id;
}

const LanguageContext = createContext<LanguageContextType>({
  lang: 'id',
  setLang: () => {},
  t: translations.id,
});

const STORAGE_KEY = 'portfolio-lang';

export function LanguageProvider({ children }: { children: ReactNode }) {
  // FIX: persist pilihan bahasa ke localStorage supaya tidak reset setiap
  // kali halaman di-refresh. Initial state tetap 'id' untuk menghindari
  // hydration mismatch — nilai dari localStorage dibaca di useEffect (client-only).
  const [lang, setLangState] = useState<Language>('id');

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY) as Language | null;
    if (saved === 'id' || saved === 'en') {
      setLangState(saved);
    }
  }, []);

  const setLang = (newLang: Language) => {
    setLangState(newLang);
    localStorage.setItem(STORAGE_KEY, newLang);
  };

  return (
    <LanguageContext.Provider value={{ lang, setLang, t: translations[lang] }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}