'use client';

import { motion } from 'motion/react';
import { ArrowLeft, Home } from 'lucide-react';
import Link from 'next/link';

// FIX: replaced hardcoded 'portofolio-gozali.vercel.app' with an env variable.
// Set NEXT_PUBLIC_SITE_URL in your .env file. Falls back gracefully if not set.
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? '';

export default function NotFound() {
  return (
    <div className="relative min-h-screen bg-[#09090b] flex items-center justify-center px-6 overflow-hidden">

      {/* Background glow */}
      <div className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] rounded-full bg-emerald-500/6 blur-3xl" />
      <div className="pointer-events-none absolute top-10 right-10 w-64 h-64 rounded-full bg-cyan-500/4 blur-3xl" />
      <div className="pointer-events-none absolute bottom-10 left-10 w-64 h-64 rounded-full bg-indigo-500/4 blur-3xl" />

      {/* Grid perspektif */}
      <div
        className="absolute inset-0 opacity-[0.05] pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(rgba(16,185,129,0.8) 1px, transparent 1px),
            linear-gradient(90deg, rgba(16,185,129,0.8) 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px',
          transform: 'perspective(600px) rotateX(35deg) scaleX(1.4)',
          transformOrigin: 'center bottom',
          maskImage: 'linear-gradient(to top, rgba(0,0,0,0.6) 0%, transparent 60%)',
          WebkitMaskImage: 'linear-gradient(to top, rgba(0,0,0,0.6) 0%, transparent 60%)',
        }}
      />

      <div className="relative text-center max-w-lg mx-auto">

        {/* 404 number */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="relative mb-6"
        >
          <span
            className="text-[10rem] md:text-[14rem] font-display font-bold leading-none select-none"
            style={{
              background: 'linear-gradient(135deg, #10b981 0%, #06b6d4 50%, #6366f1 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              opacity: 0.15,
            }}
          >
            404
          </span>
          <motion.div
            animate={{ y: [0, -8, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
          >
            <div className="px-4 py-2 rounded-full bg-zinc-900 border border-emerald-500/30 shadow-xl shadow-emerald-500/10 text-sm font-mono text-emerald-400 whitespace-nowrap">
              {'<'} Page Not Found {'>'}
            </div>
          </motion.div>
        </motion.div>

        {/* Text */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <h1 className="text-2xl md:text-3xl font-display font-bold text-zinc-100 mb-3">
            Halaman tidak ditemukan
          </h1>
          <p className="text-zinc-400 leading-relaxed mb-10">
            Sepertinya halaman yang kamu cari tidak ada atau sudah dipindahkan. Yuk balik ke halaman utama!
          </p>
        </motion.div>

        {/* Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.35 }}
          className="flex flex-wrap items-center justify-center gap-4"
        >
          <Link
            href="/"
            className="flex items-center gap-2 px-6 py-3 rounded-full bg-emerald-500 text-white text-sm font-bold hover:bg-emerald-600 transition-all shadow-lg shadow-emerald-500/20"
          >
            <Home size={16} />
            Kembali ke Beranda
          </Link>
          <button
            onClick={() => window.history.back()}
            className="flex items-center gap-2 px-6 py-3 rounded-full border border-zinc-700 text-zinc-400 text-sm font-bold hover:border-zinc-600 hover:text-zinc-100 transition-all"
          >
            <ArrowLeft size={16} />
            Halaman Sebelumnya
          </button>
        </motion.div>

        {/* Branding */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-12 text-xs text-zinc-600 font-mono"
        >
          {SITE_URL}
        </motion.p>
      </div>
    </div>
  );
}