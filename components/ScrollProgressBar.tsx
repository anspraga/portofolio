'use client';

// FIX: removed unused `useState` and `useEffect` imports.
// Kedua hook ini diimport tapi tidak dipakai sama sekali di komponen ini,
// yang bikin linter warning dan nambah bundle size unnecessarily.
import { motion, useScroll, useSpring } from 'motion/react';

export default function ScrollProgressBar() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  return (
    <motion.div
      style={{ scaleX, transformOrigin: 'left' }}
      className="fixed top-0 left-0 right-0 h-[3px] bg-emerald-500 z-[999] origin-left shadow-sm shadow-emerald-500/50"
    />
  );
}