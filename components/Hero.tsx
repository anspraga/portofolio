'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowRight, Download } from 'lucide-react';
import AIGreeting from './AIGreeting';
import AuroraBackground from './AuroraBackground';
import { useLanguage } from './LanguageProvider';
import { usePortfolio } from '@/components/PortfolioProvider';

// FIX: Hapus inline AuroraBackground — import dari standalone component (DRY).

export default function Hero() {
  const { t, lang } = useLanguage();
  const { data: { profile } } = usePortfolio();

  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center pt-20 px-6 scroll-mt-20 overflow-hidden bg-[#09090b]"
    >
      <AuroraBackground />

      <div
        className="absolute bottom-0 left-0 right-0 h-64 pointer-events-none"
        style={{ background: 'linear-gradient(to bottom, transparent, #09090b)', zIndex: 1 }}
      />

      <div className="relative max-w-7xl mx-auto w-full" style={{ zIndex: 2 }}>
        <div className="max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            {(!profile || profile.available_for_work) && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1, duration: 0.5 }}
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 text-xs font-mono tracking-wider mb-6"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Available for work
              </motion.div>
            )}

            <h1 className="text-6xl md:text-8xl font-display font-bold tracking-tight mb-6 text-zinc-100">
              {profile?.full_name || '...'}
            </h1>
            <p className="text-xl md:text-2xl text-zinc-400 mb-8 leading-relaxed">
              {profile ? profile.hero_desc[lang] : (
                <>
                  {t.hero.subtitle} <span className="text-zinc-100">UNPAM</span>{' '}
                  {t.hero.focus}{' '}
                  <span className="text-emerald-400">Web Development</span> &{' '}
                  <span className="text-emerald-400">AI</span>.
                </>
              )}
            </p>
            <div className="mb-12">
              <AIGreeting />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-wrap gap-4"
          >
            <a
              href="#projects"
              className="px-8 py-4 rounded-full bg-zinc-100 text-zinc-950 font-bold flex items-center gap-2 hover:bg-emerald-400 transition-all group"
            >
              {t.hero.viewProjects}
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </a>
            <a
              href="/resume.pdf"
              download
              className="px-8 py-4 rounded-full border border-zinc-700 text-zinc-400 font-bold flex items-center gap-2 hover:bg-zinc-800 hover:text-zinc-100 transition-all cursor-pointer"
            >
              {t.hero.downloadCV}
              <Download size={18} />
            </a>
          </motion.div>
        </div>
      </div>
    </section>
  );
}