'use client';

import { motion } from 'motion/react';
import Image from 'next/image';
import { useLanguage } from './LanguageProvider';
import { usePortfolio } from '@/components/PortfolioProvider';
import { getIconComponent } from '@/lib/iconMap';

export default function AboutSkills() {
  const { t, lang } = useLanguage();
  const { data: { profile, skills: dynamicSkills } } = usePortfolio();

  const skillsList = dynamicSkills.map(s => ({
    ...s,
    icon: getIconComponent(s.icon_name)
  }));

  const leftSkills = skillsList.slice(0, Math.ceil(skillsList.length / 2));
  const rightSkills = skillsList.slice(Math.ceil(skillsList.length / 2));

  return (
    <section
      id="about"
      className="relative py-24 px-4 sm:px-6 scroll-mt-20 bg-[#09090b] overflow-hidden"
    >
      <div className="pointer-events-none absolute -top-40 -left-40 w-[500px] h-[500px] rounded-full bg-emerald-500/5 blur-3xl" />
      <div className="pointer-events-none absolute top-1/2 right-0 w-[400px] h-[400px] rounded-full bg-cyan-500/4 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-40 left-1/3 w-[400px] h-[400px] rounded-full bg-indigo-500/4 blur-3xl" />

      <div className="relative max-w-7xl mx-auto">

        {/* About */}
        <div className="grid md:grid-cols-2 gap-12 lg:gap-20 items-center mb-28">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-4xl font-display font-bold mb-8 text-zinc-100">
              {t.about.title}
            </h2>
            <div className="space-y-5 text-zinc-400 leading-relaxed text-base lg:text-lg">
              {profile && profile.about && profile.about[lang] ? (
                profile.about[lang].split('\n\n').map((paragraph, i) => (
                  <p key={i}>{paragraph}</p>
                ))
              ) : (
                <>
                  <p>{t.about.p1}</p>
                  <p>{t.about.p2}</p>
                  <p>
                    {t.about.p3}{' '}
                    <span className="text-emerald-400 font-medium">GDG Cloud Jakarta</span>{' '}
                    {t.about.p3b}{' '}
                    <span className="text-emerald-400 font-medium">WordPress Jakarta</span>.{' '}
                    {t.about.p3c}
                  </p>
                </>
              )}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.92 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative rounded-3xl overflow-hidden border border-zinc-800 max-h-[500px] lg:max-h-[600px] aspect-[4/5] lg:aspect-[3/4]"
          >
            <Image
              src={profile?.about_image || "/images/annas.JPG"}
              alt={`${profile?.full_name || 'Annas Anuraga'} — ${profile ? profile.title[lang] : 'Web Developer & IT Business Analyst'}`}
              fill
              className="object-cover object-top"
              unoptimized
            />
          </motion.div>
        </div>

        {/* Divider */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex items-center gap-4 mb-16"
        >
          <div className="flex-1 h-px bg-zinc-800" />
          <div className="px-4 py-1.5 rounded-full border border-zinc-800 bg-zinc-900 text-xs text-zinc-500 font-mono uppercase tracking-widest whitespace-nowrap">
            {t.skills.title}
          </div>
          <div className="flex-1 h-px bg-zinc-800" />
        </motion.div>

        {/* Skills */}
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-zinc-500 text-sm text-center mb-14 max-w-md mx-auto"
        >
          {t.skills.subtitle}
        </motion.p>

        {/* Node graph — desktop */}
        <div className="hidden md:block relative">
          <NodeGraph leftSkills={leftSkills} rightSkills={rightSkills} />
        </div>

        {/* Grid — mobile */}
        <div className="grid grid-cols-2 gap-3 md:hidden">
          {skillsList.map((skill, i) => (
            <motion.div
              key={skill.name}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05, duration: 0.3 }}
              className="flex items-center gap-3 p-3 rounded-xl border border-zinc-800 bg-zinc-900/50"
            >
              <div
                className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0"
                style={{ backgroundColor: `${skill.color}18` }}
              >
                <skill.icon size={20} style={{ color: skill.color }} />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-bold text-zinc-200 truncate">{skill.name}</p>
                <p className="text-[10px] text-zinc-600 uppercase tracking-wider">{skill.category}</p>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}

function NodeGraph({
  leftSkills,
  rightSkills,
}: {
  leftSkills: any[];
  rightSkills: any[];
}) {
  const ROW_H = 80;
  const L_COUNT = leftSkills.length;
  const R_COUNT = rightSkills.length;
  const HEIGHT = Math.max(L_COUNT, R_COUNT) * ROW_H + 40;
  const cy = HEIGHT / 2;

  return (
    <div className="relative w-full" style={{ height: HEIGHT }}>

      {/* SVG lines */}
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none"
        viewBox={`0 0 1000 ${HEIGHT}`}
        preserveAspectRatio="none"
      >
        {/* Left connections */}
        {leftSkills.map((_, i) => {
          const y = (i + 0.5) * ROW_H + 20;
          return (
            <g key={`l-${i}`}>
              <motion.line
                x1={160} y1={y} x2={500} y2={cy}
                stroke="rgba(16,185,129,0.15)"
                strokeWidth="1.5"
                strokeDasharray="4 3"
                initial={{ pathLength: 0, opacity: 0 }}
                whileInView={{ pathLength: 1, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 + 0.3, duration: 0.6 }}
              />
              {/* Traveling dot */}
              <motion.circle
                r="3" fill="#34d399"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: [0, 1, 1, 0] }}
                viewport={{ once: false }}
                transition={{ delay: i * 0.3, duration: 2, repeat: Infinity, repeatDelay: 1.5, ease: 'linear' }}
              >
                <animateMotion
                  dur="2s"
                  repeatCount="indefinite"
                  begin={`${i * 0.3}s`}
                  path={`M 160 ${y} L 500 ${cy}`}
                />
              </motion.circle>
            </g>
          );
        })}
        {/* Right connections */}
        {rightSkills.map((_, i) => {
          const y = (i + 0.5) * ROW_H + 20;
          return (
            <g key={`r-${i}`}>
              <motion.line
                x1={840} y1={y} x2={500} y2={cy}
                stroke="rgba(16,185,129,0.15)"
                strokeWidth="1.5"
                strokeDasharray="4 3"
                initial={{ pathLength: 0, opacity: 0 }}
                whileInView={{ pathLength: 1, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 + 0.3, duration: 0.6 }}
              />
              {/* Traveling dot */}
              <motion.circle
                r="3" fill="#34d399"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: [0, 1, 1, 0] }}
                viewport={{ once: false }}
                transition={{ delay: i * 0.3 + 0.5, duration: 2, repeat: Infinity, repeatDelay: 1.5, ease: 'linear' }}
              >
                <animateMotion
                  dur="2s"
                  repeatCount="indefinite"
                  begin={`${i * 0.3 + 0.5}s`}
                  path={`M 840 ${y} L 500 ${cy}`}
                />
              </motion.circle>
            </g>
          );
        })}
      </svg>

      {/* Left skill cards */}
      <div className="absolute left-0 top-5 w-[150px] space-y-3">
        {leftSkills.map((skill, i) => (
          <SkillCard key={skill.name} skill={skill} index={i} side="left" rowH={ROW_H} />
        ))}
      </div>

      {/* Right skill cards */}
      <div className="absolute right-0 top-5 w-[150px] space-y-3">
        {rightSkills.map((skill, i) => (
          <SkillCard key={skill.name} skill={skill} index={i} side="right" rowH={ROW_H} />
        ))}
      </div>

      {/* Center node */}
      <motion.div
        initial={{ opacity: 0, scale: 0.5 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.2, duration: 0.5, type: 'spring', stiffness: 200 }}
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
      >
        <div className="w-28 h-28 rounded-2xl border border-emerald-500/20 bg-zinc-900 flex flex-col items-center justify-center shadow-xl shadow-emerald-500/5 gap-2">
          <div className="grid grid-cols-2 gap-1">
            {[...leftSkills, ...rightSkills].slice(0, 4).map((s) => (
              <div key={s.name} className="w-5 h-5 flex items-center justify-center">
                <s.icon size={14} style={{ color: s.color }} />
              </div>
            ))}
          </div>
          <p className="text-[9px] font-bold text-zinc-500 uppercase tracking-[0.2em] mt-1">
            Tech<br />Stack
          </p>
        </div>
      </motion.div>
    </div>
  );
}

function SkillCard({
  skill,
  index,
  side,
  rowH,
}: {
  skill: any;
  index: number;
  side: 'left' | 'right';
  rowH: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, x: side === 'left' ? -20 : 20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.08, duration: 0.4 }}
      whileHover={{ scale: 1.03, x: side === 'left' ? 4 : -4 }}
      className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl border border-zinc-800 bg-zinc-900/60 hover:border-emerald-500/30 transition-colors cursor-default ${side === 'right' ? 'flex-row-reverse text-right' : ''
        }`}
      style={{ height: rowH - 16 }}
    >
      <div
        className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
        style={{ backgroundColor: `${skill.color}15` }}
      >
        <skill.icon size={18} style={{ color: skill.color }} />
      </div>
      <div className="min-w-0">
        <p className="text-xs font-bold text-zinc-200 truncate">{skill.name}</p>
        <p className="text-[9px] text-zinc-600 uppercase tracking-wider">{skill.category}</p>
      </div>
    </motion.div>
  );
}