'use client';

// 📁 FILE INI DI: components/LanguageToggle.tsx

import { motion } from 'motion/react';
import { useLanguage } from './LanguageProvider';

export default function LanguageToggle() {
  const { lang, setLang } = useLanguage();

  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={() => setLang(lang === 'id' ? 'en' : 'id')}
      // FIX: hapus dark: conditional classes — tema permanent dark
      // Sebelumnya: bg-zinc-100 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-100
      //             hover:bg-emerald-100 dark:hover:bg-emerald-900/30
      //             hover:text-emerald-600 dark:hover:text-emerald-400
      className="px-3 py-1.5 rounded-full bg-zinc-800 text-zinc-100 text-xs font-bold transition-colors hover:bg-emerald-900/30 hover:text-emerald-400"
      aria-label="Toggle Language"
    >
      {lang === 'id' ? 'EN' : 'ID'}
    </motion.button>
  );
}