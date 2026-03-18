'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { usePortfolio } from '@/components/PortfolioProvider';

export default function LoadingScreen() {
  const { data: { profile }, isLoading: isApiLoading } = usePortfolio();
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [exiting, setExiting] = useState(false);

  useEffect(() => {
    let current = 0;
    const totalDuration = 2000;
    const interval = 20;
    const steps = totalDuration / interval;
    const increment = 100 / steps;

    const counter = setInterval(() => {
      current += increment;
      if (current >= 100) {
        current = 100;
        clearInterval(counter);
        setTimeout(() => setExiting(true), 300);
        setTimeout(() => setLoading(false), 1000);
      }
      setCount(Math.floor(current));
    }, interval);

    return () => clearInterval(counter);
  }, []);

  return (
    <AnimatePresence>
      {loading && (
        <motion.div
          // FIX: added proper exit animation so the screen fades out smoothly.
          // Previously only `animate` was used for opacity, with no `exit` variant,
          // meaning AnimatePresence had nothing to play on unmount.
          initial={{ opacity: 1 }}
          animate={{ opacity: exiting ? 0 : 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6, ease: 'easeInOut' }}
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-zinc-950 overflow-hidden"
        >
          {/* Scanline */}
          <div
            className="pointer-events-none absolute inset-0 opacity-[0.025]"
            style={{
              backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,1) 2px, rgba(255,255,255,1) 4px)',
            }}
          />

          {/* Glow */}
          <div className="absolute w-[500px] h-[500px] bg-emerald-500/8 rounded-full blur-3xl" />

          {/* Content */}
          <div className="relative w-full max-w-lg px-8 flex flex-col gap-8">

            {/* Top — name & role */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="flex flex-col gap-1"
            >
              <span className="text-[10px] text-emerald-500 font-mono tracking-[0.4em] uppercase">
                {'// loading portfolio'}
              </span>
              <h1 className="text-4xl md:text-6xl font-display font-bold tracking-tighter text-zinc-100 mt-2">
                {isApiLoading ? 'Loading Profile...' : (profile?.full_name || 'Portfolio')}
              </h1>
              <p className="text-sm text-zinc-500 font-mono">
                {isApiLoading ? 'Connecting to DB...' : (profile?.title?.en || 'Welcome')}
              </p>
            </motion.div>

            {/* Middle — progress */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="flex flex-col gap-3"
            >
              <div className="w-full h-[2px] bg-zinc-800 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-emerald-500 rounded-full shadow-lg shadow-emerald-500/50"
                  style={{ width: `${count}%` }}
                />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[10px] text-zinc-600 font-mono uppercase tracking-widest">
                  {count < 30 ? 'Initializing...' : count < 60 ? 'Loading assets...' : count < 90 ? 'Almost there...' : 'Ready!'}
                </span>
                <span className="text-4xl md:text-5xl font-display font-bold text-zinc-100 tabular-nums">
                  {String(count).padStart(2, '0')}
                  <span className="text-emerald-500">%</span>
                </span>
              </div>
            </motion.div>

            {/* Bottom — tech tags */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="flex flex-wrap gap-2"
            >
              {(profile?.highlight_tags || (isApiLoading ? ['Fetching System...', 'Loading DB...'] : [])).map((tag) => (
                <span
                  key={tag}
                  className="text-[9px] font-mono text-zinc-600 border border-zinc-800 px-2 py-1 rounded"
                >
                  {tag}
                </span>
              ))}
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}