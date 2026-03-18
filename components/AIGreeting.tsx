'use client';

import { useEffect, useState } from 'react';
import { Bot } from 'lucide-react';
import { useLanguage } from './LanguageProvider';

export default function AIGreeting() {
  const { t } = useLanguage();
  const [greeting, setGreeting] = useState('');

  useEffect(() => {
    const now = new Date();
    const hour = new Intl.DateTimeFormat('id-ID', {
      timeZone: 'Asia/Jakarta',
      hour: 'numeric',
      hour12: false,
    }).format(now);
    const h = parseInt(hour);

    if (h >= 5 && h < 12) setGreeting(t.aiGreeting.morning());
    else if (h >= 12 && h < 15) setGreeting(t.aiGreeting.afternoon());
    else if (h >= 15 && h < 19) setGreeting(t.aiGreeting.evening());
    else setGreeting(t.aiGreeting.lateNight());
  }, [t]);

  if (!greeting)
    return (
      <div className="flex items-center gap-2 text-zinc-500 text-sm italic">
        <Bot size={16} className="animate-pulse" />
        {t.aiGreeting.detecting}
      </div>
    );

  return (
    // FIX: hapus `dark:` conditional classes — tema permanent dark, tidak ada toggle.
    // Sebelumnya: bg-zinc-100 dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800
    // bg-zinc-100 dan border-zinc-200 tidak pernah aktif karena dark class selalu ada.
    <div className="flex items-start gap-3 p-4 rounded-2xl bg-zinc-900 border border-zinc-800 max-w-lg">
      <Bot size={18} className="text-emerald-500 mt-0.5 flex-shrink-0" />
      <p className="text-sm text-zinc-400 leading-relaxed italic">{greeting}</p>
    </div>
  );
}