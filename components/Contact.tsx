'use client';

import { useState } from 'react';
import { motion } from 'motion/react';
import { Send, CheckCircle, AlertCircle, Mail, MapPin } from 'lucide-react';
import { useLanguage } from './LanguageProvider';
import { usePortfolio } from '@/components/PortfolioProvider';

const FORMSPREE_ID = 'mbdzglbz';

type FormErrors = { name?: string; email?: string; message?: string };

export default function Contact() {
  const { t, lang } = useLanguage();
  const { data: { profile } } = usePortfolio();
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [serverError, setServerError] = useState(false);

  const validate = (): boolean => {
    const newErrors: FormErrors = {};
    // FIX: replaced hardcoded Indonesian strings with i18n keys
    if (!formData.name.trim()) newErrors.name = t.contact.errorName;
    if (!formData.email.trim()) {
      newErrors.email = t.contact.errorEmail;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = t.contact.errorEmailFormat;
    }
    if (!formData.message.trim()) newErrors.message = t.contact.errorMessage;
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setIsLoading(true);
    setServerError(false);
    try {
      const res = await fetch(`https://formspree.io/f/${FORMSPREE_ID}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (res.ok) setIsSubmitted(true);
      else setServerError(true);
    } catch {
      setServerError(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setIsSubmitted(false);
    setServerError(false);
    setErrors({});
    setFormData({ name: '', email: '', message: '' });
  };

  return (
    <section id="contact" className="relative py-24 px-6 scroll-mt-20 bg-[#09090b] overflow-hidden">
      <div className="pointer-events-none absolute -top-40 right-0 w-[500px] h-[500px] rounded-full bg-emerald-500/5 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-40 -left-20 w-[400px] h-[400px] rounded-full bg-indigo-500/4 blur-3xl" />

      <div className="relative max-w-7xl mx-auto">
        <div className="grid md:grid-cols-2 gap-16 items-start">

          {/* LEFT */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="space-y-8"
          >
            <div>
              <h2 className="text-3xl md:text-4xl font-display font-bold mb-4 text-zinc-100">
                {t.contact.title}
              </h2>
              <p className="text-zinc-400 leading-relaxed text-lg">{t.contact.subtitle}</p>
            </div>

            {(!profile || profile.available_for_work) && (
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-emerald-500/20 bg-emerald-500/5 text-emerald-400 text-sm font-medium">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Open to work & collaboration
              </div>
            )}

            <div className="space-y-3">
              <motion.div
                whileHover={{ x: 4 }}
                className="flex items-center gap-4 p-4 rounded-2xl border border-zinc-800 bg-zinc-900/50 hover:border-emerald-500/30 transition-colors"
              >
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-400 shrink-0">
                  <Mail size={18} />
                </div>
                <div>
                  <div className="text-xs text-zinc-500 mb-0.5">Email</div>
                  <div className="text-sm font-medium text-zinc-200">{profile?.email || 'annasputra52@gmail.com'}</div>
                </div>
              </motion.div>

              <motion.div
                whileHover={{ x: 4 }}
                className="flex items-center gap-4 p-4 rounded-2xl border border-zinc-800 bg-zinc-900/50 hover:border-emerald-500/30 transition-colors"
              >
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-400 shrink-0">
                  <MapPin size={18} />
                </div>
                <div>
                  <div className="text-xs text-zinc-500 mb-0.5">Location</div>
                  <div className="text-sm font-medium text-zinc-200">{profile?.location || 'Jakarta Utara, Indonesia'}</div>
                </div>
              </motion.div>
            </div>
          </motion.div>

          {/* RIGHT — form */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            {isSubmitted ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center justify-center py-16 text-center"
              >
                <CheckCircle size={48} className="text-emerald-400 mb-4" />
                <h3 className="text-2xl font-display font-bold mb-2 text-zinc-100">{t.contact.successTitle}</h3>
                <p className="text-zinc-400 mb-8">{t.contact.successDesc}</p>
                <button
                  onClick={handleReset}
                  className="px-6 py-3 rounded-full border border-zinc-700 text-zinc-400 hover:bg-zinc-800 hover:text-zinc-100 transition-colors"
                >
                  {t.contact.sendAnother}
                </button>
              </motion.div>
            ) : (
              <div className="space-y-6">
                {serverError && (
                  <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-red-900/20 border border-red-800 text-red-400 text-sm">
                    <AlertCircle size={16} />
                    <span>{t.contact.errorServer}</span>
                  </div>
                )}
                <div>
                  <label className="block text-sm font-medium text-zinc-300 mb-2">{t.contact.name}</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => { setFormData({ ...formData, name: e.target.value }); if (errors.name) setErrors({ ...errors, name: undefined }); }}
                    placeholder={t.contact.namePlaceholder}
                    className={`w-full px-4 py-3 rounded-xl border bg-zinc-900 text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-emerald-500 transition-colors ${errors.name ? 'border-red-600' : 'border-zinc-800'}`}
                  />
                  {errors.name && <p className="mt-1.5 text-xs text-red-400">{errors.name}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-zinc-300 mb-2">{t.contact.email}</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => { setFormData({ ...formData, email: e.target.value }); if (errors.email) setErrors({ ...errors, email: undefined }); }}
                    placeholder={t.contact.emailPlaceholder}
                    className={`w-full px-4 py-3 rounded-xl border bg-zinc-900 text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-emerald-500 transition-colors ${errors.email ? 'border-red-600' : 'border-zinc-800'}`}
                  />
                  {errors.email && <p className="mt-1.5 text-xs text-red-400">{errors.email}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-zinc-300 mb-2">{t.contact.message}</label>
                  <textarea
                    value={formData.message}
                    onChange={(e) => { setFormData({ ...formData, message: e.target.value }); if (errors.message) setErrors({ ...errors, message: undefined }); }}
                    placeholder={t.contact.messagePlaceholder}
                    rows={5}
                    className={`w-full px-4 py-3 rounded-xl border bg-zinc-900 text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-emerald-500 transition-colors resize-none ${errors.message ? 'border-red-600' : 'border-zinc-800'}`}
                  />
                  {errors.message && <p className="mt-1.5 text-xs text-red-400">{errors.message}</p>}
                </div>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleSubmit}
                  disabled={isLoading}
                  className="w-full py-4 rounded-xl bg-zinc-100 text-zinc-950 font-bold flex items-center justify-center gap-2 hover:bg-emerald-400 transition-all disabled:opacity-50"
                >
                  {isLoading ? (
                    <span className="animate-pulse">{t.contact.send}...</span>
                  ) : (
                    <>{t.contact.send}<Send size={18} /></>
                  )}
                </motion.button>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
}