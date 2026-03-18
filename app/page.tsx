'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import Navbar from '@/components/Navbar';
import AboutSkills from '@/components/AboutSkills';
import Projects from '@/components/Projects';
import Certifications from '@/components/Certifications';
import Contact from '@/components/Contact';
import Guestbook from '@/components/Guestbook';
import Footer from '@/components/Footer';
import Chatbot from '@/components/Chatbot';
import StatusBar from '@/components/StatusBar';
import BackToTop from '@/components/BackToTop';
import LoadingScreen from '@/components/LoadingScreen';
import ScrollProgressBar from '@/components/ScrollProgressBar';
import { LanguageProvider } from '@/components/LanguageProvider';
import { PortfolioProvider } from '@/components/PortfolioProvider';
import { motion } from 'motion/react';
import { BotMessageSquare } from 'lucide-react';

const Hero = dynamic(() => import('@/components/Hero'), {
  ssr: false,
  loading: () => <div className="min-h-screen bg-[#09090b]" />,
});

export default function Home() {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatContext, setChatContext] = useState<'general' | 'project'>('general');

  const openChat = (context: 'general' | 'project') => {
    setChatContext(context);
    setIsChatOpen(true);
  };

  return (
    <LanguageProvider>
      <PortfolioProvider>
        <LoadingScreen />
        <ScrollProgressBar />

        <main className="relative pb-10">
          <Navbar />
        <Hero />
        <AboutSkills />
        <Certifications />
        <Projects onOpenChat={() => openChat('project')} />
        <Guestbook />
        <Contact />
        <Footer />

        {!isChatOpen && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => openChat('general')}
            className="fixed bottom-12 right-6 z-40 p-4 rounded-full bg-emerald-500 text-white shadow-lg hover:bg-emerald-600 transition-colors"
            aria-label="Buka Chat"
          >
            <BotMessageSquare size={24} />
          </motion.button>
        )}

        <Chatbot
          isOpen={isChatOpen}
          onClose={() => setIsChatOpen(false)}
          context={chatContext}
        />

        <BackToTop />
        <StatusBar />
        </main>
      </PortfolioProvider>
    </LanguageProvider>
  );
}