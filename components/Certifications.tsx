'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ExternalLink, Award, X, Loader2 } from 'lucide-react';
import Image from 'next/image';
import { useLanguage } from './LanguageProvider';
import { usePortfolio } from '@/components/PortfolioProvider';

// Tipe data hasil dari Golang Backend
interface LocalizedText { id: string; en: string; }
interface Certification {
  id: number;
  title: LocalizedText;
  issuer: string;
  date: LocalizedText;
  image: string;
  link: string;
  description: LocalizedText;
}

export default function Certifications() {
  const { t, lang } = useLanguage();
  const { data: { certifications: certs }, isLoading: loading } = usePortfolio();
  const [selectedCert, setSelectedCert] = useState<Certification | null>(null);

  return (
    <section id="certifications" className="relative py-24 px-6 scroll-mt-20 bg-[#09090b] overflow-hidden">
      <div className="pointer-events-none absolute top-0 right-0 w-[600px] h-[400px] rounded-full bg-emerald-500/4 blur-3xl" />
      <div className="pointer-events-none absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full bg-indigo-500/4 blur-3xl" />

      <div className="relative max-w-6xl mx-auto">

        {/* Header */}
        <div className="text-center mb-12">
          <motion.div
            initial={{ opacity: 0, y: 16, scale: 0.95 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-4 border border-emerald-500/20"
          >
            <Award size={14} />
            {t.certifications.badge}
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-display font-bold mb-4 text-zinc-100"
          >
            {t.certifications.title}
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-zinc-400 max-w-2xl mx-auto"
          >
            {t.certifications.subtitle}
          </motion.p>
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 text-emerald-500">
            <Loader2 className="animate-spin mb-4" size={40} />
            <p className="text-sm text-zinc-400 font-mono">Fetching from Golang Backend...</p>
          </div>
        ) : (
          /* Grid */
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {certs.map((cert, i) => (
              <motion.div
                key={cert.id}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-30px' }}
                transition={{ delay: i * 0.06, duration: 0.45 }}
                whileHover={{ y: -4 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => setSelectedCert(cert)}
                className="group cursor-pointer rounded-2xl border border-zinc-800 bg-zinc-900/60 overflow-hidden hover:border-emerald-500/40 hover:bg-zinc-900 transition-colors duration-300"
              >
                {/* Thumbnail */}
                <div className="relative aspect-video overflow-hidden bg-zinc-800">
                  {cert.image && (
                    <Image
                      src={cert.image}
                      alt={cert.title[lang]}
                      fill
                      className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                    />
                  )}

                  {/* Mobile overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent flex items-end justify-between p-3 md:hidden">
                    <span className="bg-white/15 backdrop-blur-md text-white px-2.5 py-1 rounded-full text-[10px] font-bold border border-white/20">
                      {lang === 'id' ? 'Ketuk untuk detail' : 'Tap for detail'}
                    </span>
                    <div className="p-1.5 rounded-full bg-emerald-500/80 text-white">
                      <ExternalLink size={11} />
                    </div>
                  </div>

                  {/* Desktop overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 hidden md:flex items-center justify-center">
                    <span className="bg-white/20 backdrop-blur-md text-white px-3 py-1.5 rounded-full text-xs font-bold border border-white/30 translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                      {lang === 'id' ? 'Lihat Detail' : 'View Detail'}
                    </span>
                  </div>
                </div>

                {/* Info */}
                <div className="p-4">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0 flex-1">
                      <p className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider mb-1">
                        {cert.issuer} • {cert.date[lang]}
                      </p>
                      <h3 className="text-sm font-bold text-zinc-200 leading-snug line-clamp-2 group-hover:text-emerald-400 transition-colors duration-200">
                        {cert.title[lang]}
                      </h3>
                    </div>
                    <div className="p-2 rounded-full bg-zinc-800 text-zinc-500 group-hover:bg-emerald-500 group-hover:text-white transition-all duration-300 shrink-0">
                      <Award size={14} />
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Modal */}
      <AnimatePresence mode="wait">
        {selectedCert && (
          <div className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center sm:p-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedCert(null)}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            />

            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              className="relative w-full sm:hidden bg-zinc-900 rounded-t-[2rem] shadow-2xl overflow-hidden border-t border-zinc-800 max-h-[92vh] flex flex-col"
            >
              <ModalContent selectedCert={selectedCert} lang={lang} t={t} onClose={() => setSelectedCert(null)} isMobile />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.92, y: 24 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.94, y: 16 }}
              className="relative w-full max-w-3xl bg-zinc-900 rounded-[2rem] shadow-2xl overflow-hidden border border-zinc-800 max-h-[90vh] flex-col hidden sm:flex"
            >
              <ModalContent selectedCert={selectedCert} lang={lang} t={t} onClose={() => setSelectedCert(null)} isMobile={false} />
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}

// ── Shared Modal Content ──────────────────────────────────────────────────────
function ModalContent({
  selectedCert,
  lang,
  t,
  onClose,
  isMobile,
}: {
  selectedCert: Certification;
  lang: 'id' | 'en';
  t: any;
  onClose: () => void;
  isMobile: boolean;
}) {
  return (
    <>
      {isMobile && (
        <div className="flex justify-center pt-3 pb-1">
          <div className="w-10 h-1 rounded-full bg-zinc-700" />
        </div>
      )}

      <motion.button
        onClick={onClose}
        className="absolute top-4 right-4 z-10 p-2 rounded-full bg-zinc-800/80 backdrop-blur-sm text-zinc-400 hover:bg-emerald-500 hover:text-white transition-colors"
      >
        <X size={20} />
      </motion.button>

      <div className="overflow-y-auto flex-1">
        <div className="relative aspect-video w-full overflow-hidden">
          {selectedCert.image && <Image src={selectedCert.image} alt={selectedCert.title[lang]} fill className="object-cover" />}
          <div className="absolute inset-0 bg-gradient-to-t from-zinc-900/60 to-transparent" />
        </div>

        <div className="p-5 sm:p-10">
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-[10px] font-bold uppercase tracking-wider border border-emerald-500/20">
              {selectedCert.issuer}
            </span>
            <span className="text-xs text-zinc-500 font-mono">{selectedCert.date[lang]}</span>
          </div>

          <h3 className="text-xl sm:text-3xl font-display font-bold mb-5 text-zinc-100 leading-tight">
            {selectedCert.title[lang]}
          </h3>

          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-widest text-zinc-500">
              {t.certifications.detailTitle}
            </h4>
            <p className="text-sm sm:text-lg text-zinc-400 leading-relaxed">
              {selectedCert.description[lang]}
            </p>
          </div>

          <div className="mt-8 pt-6 border-t border-zinc-800 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-400">
                <Award size={18} />
              </div>
              <div>
                <p className="text-xs font-bold text-zinc-100 uppercase tracking-tighter">{t.certifications.verified}</p>
                <p className="text-[10px] text-zinc-500 uppercase tracking-widest">{selectedCert.issuer}</p>
              </div>
            </div>
            {selectedCert.link && (
              <a
                href={selectedCert.link}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-5 py-3 rounded-full bg-emerald-500 text-white text-sm font-bold hover:bg-emerald-600 transition-colors shadow-lg shadow-emerald-500/20 w-full sm:w-auto justify-center"
              >
                <span>{t.certifications.viewCert}</span>
                <ExternalLink size={15} />
              </a>
            )}
          </div>
        </div>
      </div>
    </>
  );
}