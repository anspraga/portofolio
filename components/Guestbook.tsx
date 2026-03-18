'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Send, Loader2, BookOpen, Sparkles, ChevronLeft, ChevronRight, Reply, LogOut, ShieldCheck, Trash2, AlertTriangle } from 'lucide-react';
import { useLanguage } from './LanguageProvider';

type GuestMessage = {
  id: number;
  name: string;
  message: string;
  created_at: string;
  parent_id: number | null;
  is_admin: boolean;
};

const AVATAR_COLORS = [
  'bg-emerald-500', 'bg-cyan-500', 'bg-indigo-500',
  'bg-violet-500', 'bg-amber-500', 'bg-rose-500',
];
function getAvatarColor(name: string): string {
  let hash = 0;
  for (const c of name) hash += c.charCodeAt(0);
  return AVATAR_COLORS[hash % AVATAR_COLORS.length];
}
function getInitial(name: string): string {
  return name.trim().charAt(0).toUpperCase();
}
function timeAgo(dateStr: string, lang: 'id' | 'en'): string {
  const diff = Math.floor((Date.now() - new Date(dateStr).getTime()) / 1000);
  if (diff < 60)    return lang === 'id' ? 'Baru saja' : 'Just now';
  if (diff < 3600)  { const m = Math.floor(diff / 60);   return lang === 'id' ? `${m} mnt lalu` : `${m}m ago`; }
  if (diff < 86400) { const h = Math.floor(diff / 3600); return lang === 'id' ? `${h} jam lalu` : `${h}h ago`; }
  const d = Math.floor(diff / 86400);
  return lang === 'id' ? `${d} hari lalu` : `${d}d ago`;
}

const PAGE_SIZE = 6;

function Pagination({ current, total, onChange }: { current: number; total: number; onChange: (p: number) => void }) {
  if (total <= 1) return null;
  const pages: (number | '...')[] = [];
  if (total <= 5) {
    for (let i = 1; i <= total; i++) pages.push(i);
  } else {
    pages.push(1);
    if (current > 3) pages.push('...');
    for (let i = Math.max(2, current - 1); i <= Math.min(total - 1, current + 1); i++) pages.push(i);
    if (current < total - 2) pages.push('...');
    pages.push(total);
  }
  return (
    <div className="flex items-center justify-center gap-1.5 mt-8">
      <button onClick={() => onChange(current - 1)} disabled={current === 1}
        className="w-8 h-8 rounded-xl border border-zinc-800 flex items-center justify-center text-zinc-500 hover:border-zinc-600 hover:text-zinc-300 disabled:opacity-30 disabled:cursor-not-allowed transition-all">
        <ChevronLeft size={14} />
      </button>
      {pages.map((p, i) => p === '...' ? (
        <span key={`dot-${i}`} className="w-8 h-8 flex items-center justify-center text-zinc-600 text-xs">...</span>
      ) : (
        <button key={p} onClick={() => onChange(p as number)}
          className={`w-8 h-8 rounded-xl text-xs font-bold transition-all border ${p === current ? 'bg-emerald-500 border-emerald-500 text-white shadow-md shadow-emerald-500/20' : 'border-zinc-800 text-zinc-400 hover:border-zinc-600 hover:text-zinc-200'}`}>
          {p}
        </button>
      ))}
      <button onClick={() => onChange(current + 1)} disabled={current === total}
        className="w-8 h-8 rounded-xl border border-zinc-800 flex items-center justify-center text-zinc-500 hover:border-zinc-600 hover:text-zinc-300 disabled:opacity-30 disabled:cursor-not-allowed transition-all">
        <ChevronRight size={14} />
      </button>
    </div>
  );
}

function MessageCard({
  msg, lang, index, isAdmin, replies, replyingTo, replyText, isSendingReply, onReply, onReplyTextChange, onSendReply, onCancelReply, onDelete,
}: {
  msg: GuestMessage;
  lang: 'id' | 'en';
  index: number;
  isAdmin: boolean;
  replies: GuestMessage[];
  replyingTo: number | null;
  replyText: string;
  isSendingReply: boolean;
  onReply: (id: number) => void;
  onReplyTextChange: (text: string) => void;
  onSendReply: (id: number) => void;
  onCancelReply: () => void;
  onDelete: (id: number, preview: string) => void;
}) {
  const isReplying = replyingTo === msg.id;
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (isReplying) {
      setTimeout(() => textareaRef.current?.focus(), 100);
    }
  }, [isReplying]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ delay: index * 0.04, duration: 0.25 }}
      className="rounded-2xl border border-zinc-800/80 bg-zinc-900/30 hover:bg-zinc-900/60 hover:border-zinc-700 transition-all duration-200 overflow-hidden"
    >
      <div className="p-4">
        <div className="flex items-center gap-2.5 mb-2.5">
          <div className={`w-8 h-8 rounded-full shrink-0 flex items-center justify-center text-white text-xs font-bold ${getAvatarColor(msg.name)}`}>
            {getInitial(msg.name)}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-semibold text-zinc-200 truncate">{msg.name}</p>
            <p className="text-[10px] text-zinc-600 font-mono">{timeAgo(msg.created_at, lang)}</p>
          </div>
          {isAdmin && !isReplying && (
            <div className="flex items-center gap-1">
              <button
                onClick={() => onReply(msg.id)}
                className="flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] text-zinc-500 hover:text-emerald-400 hover:bg-emerald-500/10 transition-all border border-transparent hover:border-emerald-500/20"
              >
                <Reply size={11} />
                Balas
              </button>
              <button
                onClick={() => onDelete(msg.id, msg.message.slice(0, 40))}
                className="flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] text-zinc-500 hover:text-red-400 hover:bg-red-500/10 transition-all border border-transparent hover:border-red-500/20"
              >
                <Trash2 size={11} />
              </button>
            </div>
          )}
        </div>
        <p className="text-sm text-zinc-400 leading-relaxed break-words">{msg.message}</p>
      </div>

      {/* Replies */}
      {replies.length > 0 && (
        <div className="border-t border-zinc-800/60 bg-zinc-900/50">
          {replies.map(reply => (
            <div key={reply.id} className="flex gap-2.5 px-4 py-3">
              <div className="w-1 rounded-full bg-emerald-500/40 shrink-0 mt-1" />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <div className="flex items-center gap-1">
                    <ShieldCheck size={11} className="text-emerald-400" />
                    <span className="text-[11px] font-bold text-emerald-400">{reply.name}</span>
                  </div>
                  <span className="text-[10px] text-zinc-600 font-mono">{timeAgo(reply.created_at, lang)}</span>
                </div>
                <p className="text-sm text-zinc-300 leading-relaxed break-words">{reply.message}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Inline reply form */}
      <AnimatePresence>
        {isReplying && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="border-t border-emerald-500/20 bg-emerald-500/5 overflow-hidden"
          >
            <div className="p-3">
              <textarea
                ref={textareaRef}
                value={replyText}
                onChange={e => onReplyTextChange(e.target.value)}
                placeholder="Tulis balasan..."
                rows={2}
                maxLength={500}
                className="w-full bg-zinc-900/60 border border-zinc-800 rounded-xl px-3 py-2 text-sm text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-emerald-500/50 resize-none mb-2"
              />
              <div className="flex gap-2">
                <motion.button
                  whileTap={{ scale: 0.97 }}
                  onClick={() => onSendReply(msg.id)}
                  disabled={isSendingReply}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-500 text-white text-xs font-bold hover:bg-emerald-600 transition-all disabled:opacity-50"
                >
                  {isSendingReply ? <Loader2 size={12} className="animate-spin" /> : <Send size={12} />}
                  Kirim
                </motion.button>
                <button
                  onClick={onCancelReply}
                  className="px-4 py-2 rounded-xl border border-zinc-800 text-xs text-zinc-500 hover:text-zinc-300 transition-colors"
                >
                  Batal
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default function Guestbook() {
  const { t, lang } = useLanguage();
  const [messages, setMessages]     = useState<GuestMessage[]>([]);
  const [isLoading, setIsLoading]   = useState(true);
  const [isSending, setIsSending]   = useState(false);
  const [name, setName]             = useState('');
  const [message, setMessage]       = useState('');
  const [error, setError]           = useState('');
  const [success, setSuccess]       = useState(false);
  const [focused, setFocused]       = useState<'name' | 'message' | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [isAdmin, setIsAdmin]       = useState(false);
  const [replyingTo, setReplyingTo] = useState<number | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<{ id: number; preview: string } | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [replyText, setReplyText]   = useState('');
  const [isSendingReply, setSendingReply] = useState(false);
  const listRef = useRef<HTMLDivElement>(null);

  // Pisah parent messages & replies
  const parentMessages = messages.filter(m => !m.parent_id);
  const totalPages     = Math.ceil(parentMessages.length / PAGE_SIZE);
  const paginated      = parentMessages.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);
  const leftCol        = paginated.filter((_, i) => i % 2 === 0);
  const rightCol       = paginated.filter((_, i) => i % 2 !== 0);

  const getReplies = (parentId: number) => messages.filter(m => m.parent_id === parentId);

  const fetchMessages = useCallback(async () => {
    try {
      const res  = await fetch('/api/guestbook');
      const data = await res.json();
      if (data.messages) setMessages(data.messages);
    } catch { console.error('Failed to fetch guestbook'); }
    finally { setIsLoading(false); }
  }, []);

  // Cek admin status
  const checkAdmin = useCallback(async () => {
    try {
      const res = await fetch('/api/guestbook?checkAdmin=1');
      const data = await res.json();
      if (data.isAdmin) setIsAdmin(true);
    } catch { /* not admin */ }
  }, []);

  useEffect(() => { fetchMessages(); checkAdmin(); }, [fetchMessages, checkAdmin]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    setTimeout(() => listRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 50);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const trimmedName    = name.trim();
    const trimmedMessage = message.trim();
    if (!trimmedName)                return setError(t.guestbook.errorName);
    if (!trimmedMessage)             return setError(t.guestbook.errorMessage);
    if (trimmedMessage.length > 300) return setError(t.guestbook.errorTooLong);
    setIsSending(true);
    try {
      const res  = await fetch('/api/guestbook', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: trimmedName, message: trimmedMessage }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error ?? t.guestbook.errorServer); return; }
      setMessages(prev => [data.message, ...prev]);
      setCurrentPage(1);
      setName('');
      setMessage('');
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3500);
    } catch { setError(t.guestbook.errorServer); }
    finally { setIsSending(false); }
  };

  const handleReply = async (parentId: number) => {
    if (!replyText.trim()) return;
    setSendingReply(true);
    try {
      const res  = await fetch('/api/guestbook', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'reply', parent_id: parentId, message: replyText.trim() }),
      });
      const data = await res.json();
      if (res.ok) {
        setMessages(prev => [...prev, data.message]);
        setReplyText('');
        setReplyingTo(null);
      }
    } catch { /* error */ }
    finally { setSendingReply(false); }
  };

  const handleDelete = async (id: number) => {
    setIsDeleting(true);
    try {
      const res = await fetch('/api/guestbook', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });
      if (res.ok) {
        setMessages(prev => prev.filter(m => m.id !== id && m.parent_id !== id));
        setDeleteConfirm(null);
      }
    } catch { /* error */ }
    finally { setIsDeleting(false); }
  };

  const handleLogout = async () => {
    await fetch('/api/guestbook', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'logout' }),
    });
    setIsAdmin(false);
  };

  return (
    <section id="guestbook" className="relative py-24 px-4 sm:px-6 scroll-mt-20 bg-[#09090b] overflow-hidden">
      <div className="pointer-events-none absolute top-0 left-0 w-[500px] h-[400px] rounded-full bg-indigo-500/4 blur-3xl" />
      <div className="pointer-events-none absolute bottom-0 right-0 w-[400px] h-[400px] rounded-full bg-emerald-500/4 blur-3xl" />

      <div className="relative max-w-3xl mx-auto">

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-10 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-400 text-xs font-bold uppercase tracking-wider mb-4 border border-indigo-500/20">
            <BookOpen size={13} />
            {t.guestbook.badge}
          </div>
          <h2 className="text-3xl md:text-4xl font-display font-bold mb-3 text-zinc-100">{t.guestbook.title}</h2>
          <p className="text-zinc-400 text-sm sm:text-base max-w-lg mx-auto">{t.guestbook.subtitle}</p>
          {isAdmin && (
            <div className="flex items-center justify-center gap-2 mt-3">
              <span className="flex items-center gap-1.5 text-xs text-emerald-400 font-mono">
                <ShieldCheck size={13} /> Mode Admin aktif
              </span>
              <button onClick={handleLogout} className="flex items-center gap-1 text-xs text-zinc-600 hover:text-zinc-400 transition-colors">
                <LogOut size={11} /> Keluar
              </button>
            </div>
          )}
        </motion.div>

        {/* Form */}
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }} className="mb-12">
          <div className="relative rounded-3xl overflow-hidden border border-zinc-800 bg-gradient-to-b from-zinc-900 to-zinc-900/80">
            <div className="h-[3px] w-full bg-gradient-to-r from-indigo-500 via-emerald-500 to-cyan-500" />
            <div className="p-6 sm:p-8">
              <div className="flex items-center gap-2.5 mb-6">
                <div className="w-8 h-8 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                  <Sparkles size={14} className="text-emerald-400" />
                </div>
                <h3 className="text-sm font-bold text-zinc-200">{t.guestbook.formTitle}</h3>
              </div>
              <form onSubmit={handleSubmit} className="space-y-3">
                <div className={`rounded-2xl border transition-all duration-200 ${focused === 'name' ? 'border-emerald-500/50 bg-zinc-800/80 shadow-[0_0_0_3px_rgba(16,185,129,0.07)]' : 'border-zinc-800 bg-zinc-800/50 hover:border-zinc-700'}`}>
                  <div className="px-4 pt-3 pb-0.5">
                    <label className={`text-[10px] font-bold uppercase tracking-widest transition-colors ${focused === 'name' ? 'text-emerald-400' : 'text-zinc-600'}`}>{t.contact.name}</label>
                  </div>
                  <input type="text" value={name} onChange={e => { setName(e.target.value); setError(''); }} onFocus={() => setFocused('name')} onBlur={() => setFocused(null)} placeholder={t.guestbook.namePlaceholder} maxLength={50}
                    className="w-full px-4 pb-3 bg-transparent text-zinc-100 placeholder-zinc-600 focus:outline-none text-sm" />
                </div>
                <div className={`relative rounded-2xl border transition-all duration-200 ${focused === 'message' ? 'border-emerald-500/50 bg-zinc-800/80 shadow-[0_0_0_3px_rgba(16,185,129,0.07)]' : 'border-zinc-800 bg-zinc-800/50 hover:border-zinc-700'}`}>
                  <div className="px-4 pt-3 pb-0.5">
                    <label className={`text-[10px] font-bold uppercase tracking-widest transition-colors ${focused === 'message' ? 'text-emerald-400' : 'text-zinc-600'}`}>{t.contact.message}</label>
                  </div>
                  <textarea value={message} onChange={e => { setMessage(e.target.value); setError(''); }} onFocus={() => setFocused('message')} onBlur={() => setFocused(null)} placeholder={t.guestbook.messagePlaceholder} maxLength={300} rows={3}
                    className="w-full px-4 pb-4 bg-transparent text-zinc-100 placeholder-zinc-600 focus:outline-none resize-none text-sm leading-relaxed" />
                  <span className={`absolute bottom-3 right-4 text-[10px] font-mono tabular-nums transition-colors ${message.length >= 280 ? 'text-amber-400' : 'text-zinc-700'}`}>{message.length}/300</span>
                </div>
                <AnimatePresence mode="wait">
                  {error && <motion.p key="err" initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="text-xs text-red-400 px-1">{error}</motion.p>}
                  {success && <motion.p key="ok" initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="text-xs text-emerald-400 px-1">{t.guestbook.successMsg}</motion.p>}
                </AnimatePresence>
                <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }} type="submit" disabled={isSending}
                  className="w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl bg-emerald-500 text-white text-sm font-bold hover:bg-emerald-600 transition-all disabled:opacity-50 shadow-lg shadow-emerald-500/20">
                  {isSending ? <><Loader2 size={15} className="animate-spin" />{t.guestbook.sending}</> : <><Send size={15} />{t.guestbook.send}</>}
                </motion.button>
              </form>
            </div>
          </div>
        </motion.div>

        {/* Messages */}
        <motion.div ref={listRef} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.15 }} className="scroll-mt-28">
          {isLoading ? (
            <div className="flex justify-center py-16"><Loader2 size={22} className="animate-spin text-zinc-700" /></div>
          ) : parentMessages.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 gap-3 text-zinc-600">
              <BookOpen size={32} className="opacity-30" />
              <p className="text-sm">{t.guestbook.empty}</p>
            </div>
          ) : (
            <>
              <p className="text-[11px] text-zinc-600 font-mono mb-5">
                {lang === 'id' ? `halaman ${currentPage} dari ${totalPages} · ${parentMessages.length} pesan` : `page ${currentPage} of ${totalPages} · ${parentMessages.length} messages`}
              </p>
              <div className="flex flex-col gap-3 md:hidden">
                <AnimatePresence mode="wait">
                  {paginated.map((msg, i) => (
                    <MessageCard key={msg.id} msg={msg} lang={lang} index={i} isAdmin={isAdmin} replies={getReplies(msg.id)}
                      replyingTo={replyingTo} replyText={replyText} isSendingReply={isSendingReply}
                      onReply={id => { setReplyingTo(id); setReplyText(''); }}
                      onReplyTextChange={setReplyText}
                      onSendReply={handleReply}
                      onCancelReply={() => { setReplyingTo(null); setReplyText(''); }}
                      onDelete={(id, preview) => setDeleteConfirm({ id, preview })}
                    />
                  ))}
                </AnimatePresence>
              </div>
              <div className="hidden md:grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-3">
                  {leftCol.map((msg, i) => (
                    <MessageCard key={msg.id} msg={msg} lang={lang} index={i} isAdmin={isAdmin} replies={getReplies(msg.id)}
                      replyingTo={replyingTo} replyText={replyText} isSendingReply={isSendingReply}
                      onReply={id => { setReplyingTo(id); setReplyText(''); }}
                      onReplyTextChange={setReplyText}
                      onSendReply={handleReply}
                      onCancelReply={() => { setReplyingTo(null); setReplyText(''); }}
                      onDelete={(id, preview) => setDeleteConfirm({ id, preview })}
                    />
                  ))}
                </div>
                <div className="flex flex-col gap-3">
                  {rightCol.map((msg, i) => (
                    <MessageCard key={msg.id} msg={msg} lang={lang} index={i} isAdmin={isAdmin} replies={getReplies(msg.id)}
                      replyingTo={replyingTo} replyText={replyText} isSendingReply={isSendingReply}
                      onReply={id => { setReplyingTo(id); setReplyText(''); }}
                      onReplyTextChange={setReplyText}
                      onSendReply={handleReply}
                      onCancelReply={() => { setReplyingTo(null); setReplyText(''); }}
                      onDelete={(id, preview) => setDeleteConfirm({ id, preview })}
                    />
                  ))}
                </div>
              </div>
              <Pagination current={currentPage} total={totalPages} onChange={handlePageChange} />
            </>
          )}
        </motion.div>
      </div>
      {/* Delete confirm dialog */}
      <AnimatePresence>
        {deleteConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center px-4"
            style={{ background: 'rgba(0,0,0,0.7)' }}
            onClick={() => setDeleteConfirm(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={e => e.stopPropagation()}
              className="w-full max-w-sm rounded-2xl border border-zinc-800 bg-zinc-900 p-6"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-9 h-9 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center flex-shrink-0">
                  <AlertTriangle size={16} className="text-red-400" />
                </div>
                <div>
                  <p className="text-sm font-bold text-zinc-100">Hapus pesan ini?</p>
                  <p className="text-[11px] text-zinc-500">Beserta semua balasannya</p>
                </div>
              </div>
              <p className="text-xs text-zinc-500 bg-zinc-800/60 rounded-xl px-3 py-2 mb-5 italic">
                "{deleteConfirm.preview}{deleteConfirm.preview.length >= 40 ? '...' : ''}"
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => setDeleteConfirm(null)}
                  className="flex-1 py-2.5 rounded-xl border border-zinc-800 text-sm text-zinc-400 hover:text-zinc-200 transition-colors"
                >
                  Batal
                </button>
                <motion.button
                  whileTap={{ scale: 0.97 }}
                  onClick={() => handleDelete(deleteConfirm.id)}
                  disabled={isDeleting}
                  className="flex-1 py-2.5 rounded-xl bg-red-500 text-white text-sm font-bold hover:bg-red-600 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {isDeleting ? <Loader2 size={14} className="animate-spin" /> : <Trash2 size={14} />}
                  Hapus
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}