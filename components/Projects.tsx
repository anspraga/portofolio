// 📁 FILE INI DI: app/components/Projects.tsx
'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ExternalLink, Github, Sparkles, Globe, Tag, Loader2 } from 'lucide-react';
import Image from 'next/image';
import { useLanguage } from './LanguageProvider';
import { usePortfolio } from '@/components/PortfolioProvider';

// Tipe data hasil dari Golang Backend
interface LocalizedText { id: string; en: string; }
interface Project {
  id: number;
  title: LocalizedText;
  description: LocalizedText;
  image: string;
  tags: string[];
  liveUrl: string;
  githubUrl: string;
  status: string;
  featured: boolean;
}

export default function Projects({ onOpenChat }: { onOpenChat?: () => void }) {
  const { t, lang } = useLanguage();
  const { data: { projects }, isLoading: loading } = usePortfolio();
  const [hoveredId, setHoveredId] = useState<number | null>(null);
  const [tappedId, setTappedId]   = useState<number | null>(null);

  const isActive = (id: number) => hoveredId === id || tappedId === id;

  const handleTap = (id: number) => {
    setTappedId(prev => prev === id ? null : id);
  };

  return (
    <section id="projects" className="relative py-24 px-6 scroll-mt-20 bg-[#09090b] overflow-hidden">
      <div className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] rounded-full bg-emerald-500/5 blur-3xl" />
      <div className="pointer-events-none absolute bottom-0 right-0 w-[300px] h-[300px] rounded-full bg-cyan-500/4 blur-3xl" />

      <div className="relative max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-display font-bold mb-4 text-zinc-100"
          >
            {t.projects.title}
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-zinc-400 max-w-xl"
          >
            {t.projects.subtitle}
          </motion.p>
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 text-emerald-500">
            <Loader2 className="animate-spin mb-4" size={40} />
            <p className="text-sm text-zinc-400 font-mono">Fetching from Golang Backend...</p>
          </div>
        ) : (
          /* Project Cards */
          <div className="grid md:grid-cols-2 gap-6">
            {projects.map((project, i) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ delay: i * 0.08, duration: 0.4 }}
                onHoverStart={() => setHoveredId(project.id)}
                onHoverEnd={() => setHoveredId(null)}
                onTap={() => handleTap(project.id)}
                className="group relative rounded-2xl border border-zinc-800 bg-zinc-900/60 overflow-hidden hover:border-emerald-500/40 transition-all duration-300 cursor-pointer"
              >
                {/* Thumbnail */}
                <div className="relative aspect-video overflow-hidden bg-zinc-800">
                  {project.image && (
                    <Image
                      src={project.image}
                      alt={project.title[lang]}
                      fill
                      className={`object-cover transition-transform duration-500 ${isActive(project.id) ? 'scale-105' : 'scale-100'}`}
                    />
                  )}

                  {/* Overlay */}
                  <AnimatePresence>
                    {isActive(project.id) && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center gap-3"
                      >
                        <a
                          href={project.liveUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={e => e.stopPropagation()}
                          className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-emerald-500 text-white text-sm font-bold hover:bg-emerald-600 active:scale-95 transition-all shadow-lg"
                        >
                          <Globe size={15} />
                          {lang === 'id' ? 'Lihat Live' : 'View Live'}
                        </a>
                        <a
                          href={project.githubUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={e => e.stopPropagation()}
                          className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-zinc-800 border border-zinc-600 text-zinc-200 text-sm font-bold hover:bg-zinc-700 active:scale-95 transition-all"
                        >
                          <Github size={15} />
                          GitHub
                        </a>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Status badge */}
                  {project.status === 'live' && (
                    <div className="absolute top-3 left-3 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-zinc-900/80 backdrop-blur-sm border border-emerald-500/30 text-emerald-400 text-[10px] font-bold uppercase tracking-wider">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      Live
                    </div>
                  )}

                  {/* Featured badge */}
                  {project.featured && (
                    <div className="absolute top-3 right-3 flex items-center gap-1 px-2.5 py-1 rounded-full bg-zinc-900/80 backdrop-blur-sm border border-zinc-700 text-zinc-400 text-[10px] font-bold uppercase tracking-wider">
                      <Sparkles size={10} />
                      Featured
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="p-5 md:p-6">
                  <h3 className={`text-lg font-display font-bold mb-2 transition-colors ${isActive(project.id) ? 'text-emerald-400' : 'text-zinc-100'}`}>
                    {project.title[lang]}
                  </h3>
                  <p className="text-sm text-zinc-400 leading-relaxed mb-4">
                    {project.description[lang]}
                  </p>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-2 mb-5">
                    {project.tags && project.tags.map((tag) => (
                      <span
                        key={tag}
                        className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-zinc-800 border border-zinc-700 text-zinc-400 text-[10px] font-mono"
                      >
                        <Tag size={9} />
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* Links */}
                  <div className="flex items-center gap-3">
                    <a
                      href={project.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={e => e.stopPropagation()}
                      className="flex items-center gap-1.5 text-xs font-bold text-emerald-400 hover:text-emerald-300 active:opacity-70 transition-colors"
                    >
                      <ExternalLink size={13} />
                      {lang === 'id' ? 'Lihat Live' : 'View Live'}
                    </a>
                    <span className="text-zinc-700">·</span>
                    <a
                      href={project.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={e => e.stopPropagation()}
                      className="flex items-center gap-1.5 text-xs font-bold text-zinc-400 hover:text-zinc-200 active:opacity-70 transition-colors"
                    >
                      <Github size={13} />
                      Source Code
                    </a>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mt-8"
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onOpenChat?.()}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-zinc-800 border border-zinc-700 text-zinc-300 text-sm font-bold hover:border-emerald-500/50 hover:text-emerald-400 transition-all"
          >
            <Sparkles size={16} />
            {t.projects.cta}
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
}