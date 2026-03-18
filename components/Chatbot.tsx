'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Send, User, BotMessageSquare, Loader2 } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { useLanguage } from './LanguageProvider';

type Message = {
  id: string;
  role: 'user' | 'ai';
  content: string;
};

function generateId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

export default function Chatbot({
  isOpen,
  onClose,
  context = 'general',
}: {
  isOpen: boolean;
  onClose: () => void;
  context?: 'general' | 'project';
}) {
  const { t } = useLanguage();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const lastGreetedContext = useRef<string | null>(null);

  useEffect(() => {
    if (isOpen && lastGreetedContext.current !== context) {
      const initialMessage =
        context === 'general' ? t.chatbot.generalGreeting : t.chatbot.projectGreeting;
      setMessages((prev) => {
        if (prev.length > 0 && prev[prev.length - 1].content === initialMessage) return prev;
        return [...prev, { id: generateId(), role: 'ai', content: initialMessage }];
      });
      lastGreetedContext.current = context;
    }
  }, [isOpen, context, t]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  const handleSend = useCallback(
    async (overrideMessage?: string) => {
      const userMessage = overrideMessage || input.trim();
      if (!userMessage || isLoading) return;
      if (!overrideMessage) setInput('');

      const newMessage: Message = { id: generateId(), role: 'user', content: userMessage };
      const newMessages = [...messages, newMessage];
      setMessages(newMessages);
      setIsLoading(true);

      try {
        const res = await fetch('/api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            messages: newMessages.map((m) => ({ role: m.role, content: m.content })),
          }),
        });
        if (!res.ok) throw new Error(`Server error: ${res.status}`);
        const data = await res.json();
        const aiText = data.text || t.chatbot.error;
        setMessages((prev) => [...prev, { id: generateId(), role: 'ai', content: aiText }]);
      } catch (error) {
        console.error('AI Error:', error);
        setMessages((prev) => [
          ...prev,
          { id: generateId(), role: 'ai', content: t.chatbot.error },
        ]);
      } finally {
        setIsLoading(false);
      }
    },
    [input, isLoading, messages, t],
  );

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 100 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
          className="fixed inset-0 z-50 flex flex-col bg-zinc-950 sm:inset-auto sm:bottom-6 sm:right-6 sm:w-[400px] sm:h-[600px] sm:rounded-2xl sm:shadow-2xl border border-zinc-800 overflow-hidden"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-zinc-800 bg-zinc-900/50 backdrop-blur-md">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-500 border border-emerald-500/20">
                  <BotMessageSquare size={20} />
                </div>
                <div className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 rounded-full border-2 border-zinc-950 animate-pulse" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-zinc-100">G-Assistant</h3>
                <p className="text-[10px] text-emerald-500 uppercase tracking-widest font-mono">
                  {t.chatbot.online}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-zinc-800 rounded-full text-zinc-400 transition-colors"
              aria-label="Tutup chat"
            >
              <X size={20} />
            </button>
          </div>

          {/* Messages */}
          <div
            ref={scrollRef}
            className="flex-1 overflow-y-auto p-4 space-y-6 scrollbar-thin scrollbar-thumb-zinc-800"
          >
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`flex gap-3 max-w-[85%] ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                  <div
                    className={`w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center ${
                      msg.role === 'user'
                        ? 'bg-zinc-800 text-zinc-400'
                        : 'bg-emerald-500 text-white'
                    }`}
                  >
                    {msg.role === 'user' ? <User size={16} /> : <BotMessageSquare size={16} />}
                  </div>
                  <div
                    className={`p-3 rounded-2xl text-sm leading-relaxed ${
                      msg.role === 'user'
                        ? 'bg-zinc-800 text-zinc-100 rounded-tr-none'
                        : 'bg-zinc-900 text-zinc-100 rounded-tl-none border border-zinc-700'
                    }`}
                  >
                    <div className="prose-chat max-w-none">
                      <ReactMarkdown>{msg.content}</ReactMarkdown>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="flex justify-start">
                <div className="flex gap-3 max-w-[85%]">
                  <div className="w-8 h-8 rounded-full bg-emerald-500 text-white flex items-center justify-center">
                    <BotMessageSquare size={16} />
                  </div>
                  <div className="p-4 bg-zinc-900 rounded-2xl rounded-tl-none border border-zinc-800">
                    <Loader2 size={16} className="animate-spin text-emerald-500" />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Input */}
          <div className="p-4 border-t border-zinc-800 bg-zinc-900/30">
            <form
              onSubmit={(e) => { e.preventDefault(); handleSend(); }}
              className="relative flex items-center"
            >
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={t.chatbot.placeholder}
                style={{ fontSize: '16px' }}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-full pl-4 pr-12 py-3 text-zinc-100 placeholder:text-zinc-500 focus:outline-none focus:border-emerald-500 transition-colors"
              />
              <button
                type="submit"
                disabled={isLoading || !input.trim()}
                aria-label="Kirim pesan"
                className="absolute right-2 p-2 bg-emerald-500 text-white rounded-full disabled:opacity-50 disabled:bg-zinc-800 transition-all hover:bg-emerald-600"
              >
                <Send size={16} />
              </button>
            </form>
            <p className="text-[9px] text-center text-zinc-600 mt-3 uppercase tracking-tighter">
              {t.chatbot.powered}
            </p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}