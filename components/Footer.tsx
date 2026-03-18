'use client';

import { Github, Instagram, Linkedin } from 'lucide-react';
import { useLanguage } from './LanguageProvider';

export default function Footer() {
  const { t } = useLanguage();

  return (
    <footer className="py-8 px-6 border-t border-zinc-800/60 bg-[#09090b]">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        <p className="text-zinc-500 text-sm">
          © {new Date().getFullYear()} Annas Anuraga. {t.footer.rights}
        </p>
        <div className="flex items-center gap-4">
          <a
            href="https://github.com/anspraga"
            target="_blank"
            rel="noopener noreferrer"
            className="text-zinc-600 hover:text-zinc-100 transition-colors"
          >
            <Github size={20} />
          </a>
          <a
            href="https://www.linkedin.com/in/annas-anuraga-674433177/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-zinc-600 hover:text-zinc-100 transition-colors"
          >
            <Linkedin size={20} />
          </a>
          <a
            href="https://www.instagram.com/anspraga/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-zinc-600 hover:text-zinc-100 transition-colors"
          >
            <Instagram size={20} />
          </a>
        </div>
      </div>
    </footer>
  );
}