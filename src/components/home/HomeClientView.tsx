'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useLanguage } from '@/components/providers/LanguageProvider';
import { formatCompactNumber } from '@/lib/utils';
import {
  ArrowRight,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  Flame,
  Globe2,
  Play,
  ShieldCheck,
  Sparkles,
  Trophy,
  Users,
  Video,
  Zap,
} from 'lucide-react';

interface HomeClientProps {
  subs: string;
  views: string;
  videos: string;
  packages: any[];
  faqs: any[];
  realVideos?: any[];
  realShorts?: any[];
}

export function HomeClientView({ subs, views, videos, packages, faqs, realVideos = [], realShorts = [] }: HomeClientProps) {
  const { lang, t } = useLanguage();
  const [openFaqId, setOpenFaqId] = useState<string | null>(faqs[0]?.id || null);

  const subCountFormatted = formatCompactNumber(parseInt(subs || '385000'));
  const viewCountFormatted = formatCompactNumber(parseInt(views || '142000000'));

  const shortsToDisplay = realShorts.length > 0 ? realShorts : [
    {
      id: 'short-1',
      title: 'I Spent 100 Days in Hardcore Minecraft Nether World!',
      views: '2.4M Views',
      url: 'https://www.youtube.com/@DarNedYt/shorts',
      gradient: 'from-purple-600 to-pink-600',
    },
    {
      id: 'short-2',
      title: 'Minecraft But You Only Have 1 Heart Level 999 Challenge!',
      views: '4.1M Views',
      url: 'https://www.youtube.com/@DarNedYt/shorts',
      gradient: 'from-pink-600 to-cyan-500',
    },
    {
      id: 'short-3',
      title: 'Can You Escape The Ultimate Custom Warden Trap in 30s?',
      views: '1.8M Views',
      url: 'https://www.youtube.com/@DarNedYt/shorts',
      gradient: 'from-cyan-500 to-indigo-600',
    },
  ];

  const videosToDisplay = realVideos.length > 0 ? realVideos : [
    {
      id: 'video-1',
      title: 'Surviving Minecraft 100 Days on an Impossible Custom Modpack',
      duration: '18:42',
      views: '850K Views',
      url: 'https://www.youtube.com/@DarNedYt',
      desc: 'Specialized gameplay challenge showcasing custom items and high-energy commentary.',
    },
    {
      id: 'video-2',
      title: 'Testing 50 VIRAL Minecraft Hacks to See If They ACTUALLY Work!',
      duration: '14:15',
      views: '1.2M Views',
      url: 'https://www.youtube.com/@DarNedYt',
      desc: 'Testing community mythbusters and viral server mechanics with guest creators.',
    },
  ];

  return (
    <div className="space-y-24 pb-20">
      
      {/* 1. HERO SECTION */}
      <section className="relative pt-12 pb-20 overflow-hidden bg-hero-pattern">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(124,58,237,0.15)_0,transparent_100%)] pointer-events-none" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center space-y-8 max-w-4xl mx-auto">
            
            {/* Creator Badge */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-brand-purple/40 text-brand-pink text-xs font-mono font-semibold tracking-wider uppercase backdrop-blur-md shadow-glow"
            >
              <Sparkles className="w-4 h-4 text-brand-cyan animate-pulse" />
              {t.hero.badge}
            </motion.div>

            {/* Main Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="font-display text-4xl sm:text-6xl md:text-7xl font-black tracking-tight text-white leading-tight"
            >
              {t.hero.titlePrefix}{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-purple via-brand-pink to-brand-cyan drop-shadow-[0_0_25px_rgba(236,72,153,0.4)]">
                {t.hero.titleHighlight}
              </span>
            </motion.h1>

            {/* Description */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-base sm:text-xl text-gray-300 max-w-3xl mx-auto font-normal leading-relaxed"
            >
              {t.hero.description}
            </motion.p>

            {/* Action CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4"
            >
              <Link
                href="/contact"
                className="w-full sm:w-auto px-8 py-4 rounded-xl bg-gradient-to-r from-brand-purple via-brand-pink to-brand-cyan text-white font-bold text-base hover:opacity-95 transition-all shadow-glow hover:shadow-glow-pink flex items-center justify-center gap-2 group"
              >
                <span>{t.hero.startCollab}</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>

              <a
                href="https://www.youtube.com/@DarNedYt"
                target="_blank"
                rel="noreferrer"
                className="w-full sm:w-auto px-8 py-4 rounded-xl bg-white/5 border border-white/15 text-white font-bold text-base hover:bg-white/10 hover:border-white/30 transition-all flex items-center justify-center gap-2"
              >
                <span>{t.hero.viewChannel}</span>
                <ExternalLink className="w-4 h-4 text-brand-cyan" />
              </a>
            </motion.div>

          </div>

          {/* Stats Bar */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.4 }}
            className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6"
          >
            <div className="bg-card border border-card-border rounded-2xl p-6 backdrop-blur-xl shadow-xl flex flex-col items-center text-center space-y-1 hover:border-brand-purple/50 transition-all group">
              <div className="p-3 rounded-xl bg-purple-500/10 text-brand-purple mb-2 group-hover:scale-110 transition-transform">
                <Users className="w-6 h-6" />
              </div>
              <span className="font-display text-3xl font-black text-white">{subCountFormatted}+</span>
              <span className="text-xs font-mono text-gray-400 uppercase tracking-wider">{t.hero.subscribers}</span>
            </div>

            <div className="bg-card border border-card-border rounded-2xl p-6 backdrop-blur-xl shadow-xl flex flex-col items-center text-center space-y-1 hover:border-brand-pink/50 transition-all group">
              <div className="p-3 rounded-xl bg-pink-500/10 text-brand-pink mb-2 group-hover:scale-110 transition-transform">
                <Flame className="w-6 h-6" />
              </div>
              <span className="font-display text-3xl font-black text-white">{viewCountFormatted}+</span>
              <span className="text-xs font-mono text-gray-400 uppercase tracking-wider">{t.hero.totalViews}</span>
            </div>

            <div className="bg-card border border-card-border rounded-2xl p-6 backdrop-blur-xl shadow-xl flex flex-col items-center text-center space-y-1 hover:border-brand-cyan/50 transition-all group">
              <div className="p-3 rounded-xl bg-cyan-500/10 text-brand-cyan mb-2 group-hover:scale-110 transition-transform">
                <Video className="w-6 h-6" />
              </div>
              <span className="font-display text-3xl font-black text-white">{videos}+</span>
              <span className="text-xs font-mono text-gray-400 uppercase tracking-wider">{t.hero.videosCreated}</span>
            </div>

            <div className="bg-card border border-card-border rounded-2xl p-6 backdrop-blur-xl shadow-xl flex flex-col items-center text-center space-y-1 hover:border-indigo-500/50 transition-all group">
              <div className="p-3 rounded-xl bg-indigo-500/10 text-indigo-400 mb-2 group-hover:scale-110 transition-transform">
                <Globe2 className="w-6 h-6" />
              </div>
              <span className="font-display text-3xl font-black text-white">United States</span>
              <span className="text-xs font-mono text-gray-400 uppercase tracking-wider">{t.hero.primaryAudience}</span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* 2. FEATURED SHORTS SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-mono font-bold text-brand-pink uppercase tracking-widest mb-2">
              <Zap className="w-4 h-4" />
              Short-Form Impact ($50 Package)
            </div>
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-white">
              {t.home.featuredShorts}
            </h2>
          </div>
          <a
            href="https://www.youtube.com/@DarNedYt/shorts"
            target="_blank"
            rel="noreferrer"
            className="text-xs font-bold font-mono text-brand-cyan hover:underline inline-flex items-center gap-1"
          >
            {t.home.viewOnYoutube} <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {shortsToDisplay.map((short: any) => (
            <a
              key={short.id}
              href={short.url || 'https://www.youtube.com/@DarNedYt/shorts'}
              target="_blank"
              rel="noreferrer"
              className="group relative rounded-2xl overflow-hidden border border-white/10 bg-card hover:border-brand-pink/50 transition-all duration-300 shadow-xl flex flex-col"
            >
              <div className="w-full aspect-[9/14] bg-gradient-to-b from-purple-900 via-pink-900 to-slate-950 relative flex items-center justify-center p-6 text-center">
                <div className="absolute inset-0 bg-black/30 group-hover:bg-black/10 transition-colors" />
                <div className="relative z-10 flex flex-col items-center gap-3">
                  <div className="w-14 h-14 rounded-full bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center group-hover:scale-110 transition-transform shadow-glow">
                    <Play className="w-6 h-6 text-white fill-white ml-0.5" />
                  </div>
                  <span className="text-xs font-mono font-bold uppercase tracking-widest text-white/90 bg-black/50 px-3 py-1 rounded-full border border-white/10">
                    YouTube Shorts
                  </span>
                </div>
              </div>
              <div className="p-5 space-y-2 bg-[#0c0c14]">
                <h3 className="text-sm font-bold text-white line-clamp-2 group-hover:text-brand-pink transition-colors">
                  {short.title}
                </h3>
                <div className="flex items-center justify-between text-xs text-gray-400 font-mono">
                  <span>@DarNedYt</span>
                  <span className="text-brand-pink font-semibold">Watch Short</span>
                </div>
              </div>
            </a>
          ))}
        </div>
      </section>

      {/* 3. FEATURED LONG-FORM VIDEOS SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-mono font-bold text-brand-cyan uppercase tracking-widest mb-2">
              <Trophy className="w-4 h-4" />
              Full Gameplay Showcase ($300 Dedicated Package)
            </div>
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-white">
              {t.home.featuredVideos}
            </h2>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {videosToDisplay.map((video: any) => (
            <a
              key={video.id}
              href={video.url || 'https://www.youtube.com/@DarNedYt'}
              target="_blank"
              rel="noreferrer"
              className="group rounded-2xl border border-white/10 bg-card overflow-hidden hover:border-brand-purple/50 transition-all shadow-xl flex flex-col"
            >
              <div className="relative aspect-video bg-gradient-to-tr from-purple-950 via-slate-900 to-indigo-950 flex items-center justify-center p-6">
                <div className="w-16 h-16 rounded-full bg-brand-purple/80 border border-white/40 flex items-center justify-center group-hover:scale-110 transition-transform shadow-glow">
                  <Play className="w-7 h-7 text-white fill-white ml-1" />
                </div>
                {video.duration && (
                  <span className="absolute bottom-3 right-3 px-2.5 py-1 rounded-md bg-black/80 text-[11px] font-mono text-white font-bold">
                    {video.duration}
                  </span>
                )}
              </div>
              <div className="p-6 space-y-3 bg-[#0c0c14] flex-grow">
                <h3 className="text-lg font-bold text-white group-hover:text-brand-cyan transition-colors">
                  {video.title}
                </h3>
                <p className="text-xs text-gray-400 leading-relaxed">
                  {video.desc || 'Full dedicated Minecraft gameplay video with custom thumbnail and description integration.'}
                </p>
                <div className="flex items-center justify-between text-xs font-mono text-gray-500 pt-2 border-t border-white/5">
                  <span>@DarNedYt</span>
                  <span className="text-brand-cyan font-semibold flex items-center gap-1">
                    Watch Video <ExternalLink className="w-3 h-3" />
                  </span>
                </div>
              </div>
            </a>
          ))}
        </div>
      </section>

      {/* 4. WHY PARTNER PERKS GRID */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-white">
            {t.home.perksTitle}
          </h2>
          <p className="text-sm text-gray-400">{t.home.perksSub}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="p-8 rounded-2xl bg-card border border-white/10 backdrop-blur-xl hover:border-brand-purple/40 transition-all space-y-4">
            <div className="p-3.5 rounded-xl bg-brand-purple/20 text-brand-purple w-fit">
              <Zap className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white">{t.home.perk1Title}</h3>
            <p className="text-xs text-gray-400 leading-relaxed">{t.home.perk1Desc}</p>
          </div>

          <div className="p-8 rounded-2xl bg-card border border-white/10 backdrop-blur-xl hover:border-brand-pink/40 transition-all space-y-4">
            <div className="p-3.5 rounded-xl bg-brand-pink/20 text-brand-pink w-fit">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white">{t.home.perk2Title}</h3>
            <p className="text-xs text-gray-400 leading-relaxed">{t.home.perk2Desc}</p>
          </div>

          <div className="p-8 rounded-2xl bg-card border border-white/10 backdrop-blur-xl hover:border-brand-cyan/40 transition-all space-y-4">
            <div className="p-3.5 rounded-xl bg-brand-cyan/20 text-brand-cyan w-fit">
              <Trophy className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white">{t.home.perk3Title}</h3>
            <p className="text-xs text-gray-400 leading-relaxed">{t.home.perk3Desc}</p>
          </div>
        </div>
      </section>

      {/* 5. FAQ ACCORDION */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-3 mb-12">
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-white">
            {t.home.faqTitle}
          </h2>
          <p className="text-sm text-gray-400">{t.home.faqSub}</p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq) => {
            const isOpen = openFaqId === faq.id;
            const question = lang === 'tr' ? faq.questionTr : faq.questionEn;
            const answer = lang === 'tr' ? faq.answerTr : faq.answerEn;

            return (
              <div
                key={faq.id}
                className="rounded-2xl border border-white/10 bg-card overflow-hidden transition-all"
              >
                <button
                  onClick={() => setOpenFaqId(isOpen ? null : faq.id)}
                  className="w-full p-6 text-left flex items-center justify-between gap-4 focus:outline-none"
                >
                  <span className="text-base font-bold text-white">{question}</span>
                  {isOpen ? (
                    <ChevronUp className="w-5 h-5 text-brand-pink flex-shrink-0" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-gray-400 flex-shrink-0" />
                  )}
                </button>
                {isOpen && (
                  <div className="px-6 pb-6 text-xs text-gray-300 leading-relaxed border-t border-white/5 pt-4">
                    {answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

    </div>
  );
}
