'use client';

import { useState, useEffect } from 'react';
import { MapPin, Clock } from 'lucide-react';
import { useLanguage } from './LanguageProvider';

export default function StatusBar() {
  const { t } = useLanguage();
  const [time, setTime] = useState('');

  useEffect(() => {
    const update = () => {
      const now = new Date();
      const wib = new Intl.DateTimeFormat('id-ID', {
        timeZone: 'Asia/Jakarta',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false,
      }).format(now);
      setTime(wib);
    };
    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    // FIX: hapus conditional dark: classes — layout.tsx hardcode class="dark" permanent,
    // jadi cukup pakai warna dark langsung tanpa dark: prefix yang tidak pernah toggle.
    <div className="fixed bottom-0 left-0 right-0 z-30 bg-zinc-950 border-t border-zinc-800 text-zinc-400 text-[10px] flex items-center justify-between px-4 py-1 font-mono">
      <div className="flex items-center gap-3">
        <span className="flex items-center gap-1">
          <MapPin size={10} />
          {t.statusBar.location}
        </span>
        <span className="flex items-center gap-1">
          <Clock size={10} />
          {time} WIB
        </span>
      </div>
      <div className="flex items-center gap-1">
        <span>{t.statusBar.assistant}</span>
        <span className="text-emerald-400">{t.statusBar.online}</span>
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse ml-1" />
      </div>
    </div>
  );
}