'use client';

// FILE INI DI: app/admin/page.tsx

import { useState } from 'react';
// FIX: hapus useRouter — tidak dipakai lagi setelah ganti ke window.location.href
import { motion } from 'motion/react';
import { Lock, Loader2, Eye, EyeOff } from 'lucide-react';

export default function AdminPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [show, setShow] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!username.trim()) { setError('Username tidak boleh kosong.'); return; }
    setLoading(true);
    try {
      const res = await fetch('/api/guestbook', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'login', username, password }),
      });
      if (res.ok) {
        // FIX: ganti router.push('/#guestbook') + router.refresh()
        // Next.js App Router kadang tidak scroll ke hash dengan benar.
        // window.location.href lebih reliable untuk navigasi ke hash.
        window.location.href = '/#guestbook';
      } else {
        const data = await res.json();
        setError(data.error ?? 'Login gagal.');
      }
    } catch {
      setError('Terjadi kesalahan.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#09090b] flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-sm"
      >
        <div className="rounded-3xl border border-zinc-800 bg-zinc-900/80 overflow-hidden">
          <div className="h-[3px] w-full bg-gradient-to-r from-emerald-500 via-cyan-500 to-indigo-500" />
          <div className="p-8">
            <div className="flex flex-col items-center mb-8">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mb-4">
                <Lock size={20} className="text-emerald-400" />
              </div>
              <h1 className="text-lg font-bold text-zinc-100">Admin Login</h1>
              <p className="text-xs text-zinc-500 mt-1">Guestbook · Annas Anuraga</p>
            </div>

            <form onSubmit={handleLogin} className="space-y-3">
              <div className="rounded-2xl border border-zinc-800 bg-zinc-800/50 focus-within:border-emerald-500/50 transition-all">
                <input
                  type="text"
                  value={username}
                  onChange={e => { setUsername(e.target.value); setError(''); }}
                  placeholder="Username"
                  autoComplete="username"
                  className="w-full px-4 py-3.5 bg-transparent text-zinc-100 placeholder-zinc-600 focus:outline-none text-sm"
                />
              </div>
              <div className="relative rounded-2xl border border-zinc-800 bg-zinc-800/50 focus-within:border-emerald-500/50 transition-all">
                <input
                  type={show ? 'text' : 'password'}
                  value={password}
                  onChange={e => { setPassword(e.target.value); setError(''); }}
                  placeholder="Password"
                  autoComplete="current-password"
                  className="w-full px-4 py-3.5 bg-transparent text-zinc-100 placeholder-zinc-600 focus:outline-none text-sm pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShow(p => !p)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-600 hover:text-zinc-400 transition-colors"
                >
                  {show ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>

              {error && (
                <p className="text-xs text-red-400 px-1">{error}</p>
              )}

              <motion.button
                whileTap={{ scale: 0.97 }}
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl bg-emerald-500 text-white text-sm font-bold hover:bg-emerald-600 transition-all disabled:opacity-50"
              >
                {loading ? <Loader2 size={15} className="animate-spin" /> : <Lock size={15} />}
                {loading ? 'Masuk...' : 'Masuk'}
              </motion.button>
            </form>
          </div>
        </div>
      </motion.div>
    </main>
  );
}