'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { useLanguage } from '@/components/providers/LanguageProvider';
import { formatCompactNumber } from '@/lib/utils';
import {
  ArrowRight,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  Globe2,
  Play,
  ShieldCheck,
  Sparkles,
  Trophy,
  Users,
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

  // Exact DarNed YouTube Shorts from user provided links
  const defaultShorts = [
    {
      id: 'short-1',
      videoId: 'XkOo3DhOv38',
      directUrl: 'https://www.youtube.com/shorts/XkOo3DhOv38',
    },
    {
      id: 'short-2',
      videoId: 'FeyfzeGnPzg',
      directUrl: 'https://www.youtube.com/shorts/FeyfzeGnPzg',
    },
    {
      id: 'short-3',
      videoId: 'KF8oj78vXso',
      directUrl: 'https://www.youtube.com/shorts/KF8oj78vXso',
    },
  ];

  // Exact DarNed YouTube Long Videos from user provided links
  const defaultLongVideos = [
    {
      id: 'video-1',
      videoId: 'XquuW9266M8',
      directUrl: 'https://www.youtube.com/watch?v=XquuW9266M8',
    },
    {
      id: 'video-2',
      videoId: 'qfAgc_vzxlY',
      directUrl: 'https://www.youtube.com/watch?v=qfAgc_vzxlY',
    },
  ];

  const shortsToDisplay = realShorts.length > 0 ? realShorts : defaultShorts;
  const videosToDisplay = realVideos.length > 0 ? realVideos : defaultLongVideos;

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
            className="mt-16 grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-2xl mx-auto"
          >
            <div className="bg-card border border-card-border rounded-2xl p-6 backdrop-blur-xl shadow-xl flex flex-col items-center text-center space-y-1 hover:border-brand-purple/50 transition-all group">
              <div className="p-3 rounded-xl bg-purple-500/10 text-brand-purple mb-2 group-hover:scale-110 transition-transform">
                <Users className="w-6 h-6" />
              </div>
              <span className="font-display text-3xl font-black text-white">{subCountFormatted}+</span>
              <span className="text-xs font-mono text-gray-400 uppercase tracking-wider">{t.hero.subscribers}</span>
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

      {/* 2. DARNED CHANNEL ABOUT BIO SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-8 sm:p-12 rounded-3xl bg-card border border-brand-purple/40 backdrop-blur-2xl shadow-glow grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          <div className="lg:col-span-4 flex justify-center">
            <div className="relative w-48 h-48 sm:w-64 sm:h-64 rounded-2xl bg-gradient-to-tr from-brand-purple via-brand-pink to-brand-cyan p-1 shadow-glow">
              <div className="w-full h-full rounded-[15px] bg-[#0c0c14] p-6 flex flex-col items-center justify-center space-y-3 text-center">
                <div className="relative w-28 h-28">
                  <Image src="/images/logo.svg" alt="DarNed Logo" fill className="object-contain drop-shadow-[0_0_15px_rgba(124,58,237,0.8)]" />
                </div>
                <span className="font-display font-black text-xl text-white">DarNed</span>
                <span className="text-xs font-mono text-brand-pink">@DarNedYt</span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-8 space-y-4 text-gray-300">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-pink/20 text-brand-pink text-xs font-mono font-bold uppercase">
              <Sparkles className="w-3.5 h-3.5" /> About Creator
            </div>
            <h2 className="font-display text-3xl font-bold text-white">
              Who is DarNed? (@DarNedYt)
            </h2>
            <p className="text-sm leading-relaxed text-gray-300">
              {lang === 'tr'
                ? 'DarNed, Amerika Birleşik Devletleri merkezli önde gelen bir Minecraft içerik üreticisidir. Hızlı tempolu oyun videoları, özel mod incelemeleri, meydan okumalar ve viral YouTube Shorts içerikleriyle tanınır. 385.000 abonesiyle oyuncu kitlesine doğrudan ulaşır.'
                : 'DarNed is a top-tier Minecraft content creator based in the United States, renowned for fast-paced gameplay challenges, custom mod showcases, and viral YouTube Shorts. With over 385,000 subscribers, DarNed provides authentic brand reach to gaming enthusiasts.'}
            </p>
            <div className="flex flex-wrap gap-4 pt-2">
              <Link href="/about" className="text-xs font-bold text-brand-cyan hover:underline inline-flex items-center gap-1">
                Read Full Bio & Demographics <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

        </div>
      </section>

      {/* 3. FEATURED SHORTS SECTION WITH DIRECT INDIVIDUAL LINKS */}
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
          {shortsToDisplay.map((short: any) => {
            const vId = short.videoId || short.id;
            const directUrl = short.directUrl || `https://www.youtube.com/shorts/${vId}`;

            return (
              <div
                key={short.id}
                className="group relative rounded-2xl overflow-hidden border border-white/10 bg-card hover:border-brand-pink/50 transition-all duration-300 shadow-xl flex flex-col"
              >
                {/* Responsive Embedded YouTube Player */}
                <div className="w-full aspect-[9/16] bg-black relative">
                  <iframe
                    src={`https://www.youtube.com/embed/${vId}`}
                    title="YouTube Short"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                    className="w-full h-full border-0"
                  />
                </div>
                <div className="p-3 bg-[#0c0c14] flex items-center justify-between text-xs font-mono text-gray-300">
                  <span className="font-bold text-white">@DarNedYt</span>
                  <a
                    href={directUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="px-3 py-1 rounded-lg bg-brand-pink/20 text-brand-pink border border-brand-pink/40 hover:bg-brand-pink/30 font-bold transition-all inline-flex items-center gap-1.5"
                  >
                    <span>Watch Short</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 4. FEATURED LONG-FORM VIDEOS SECTION WITH DIRECT INDIVIDUAL LINKS */}
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
          {videosToDisplay.map((video: any) => {
            const vId = video.videoId || video.id;
            const directUrl = video.directUrl || `https://www.youtube.com/watch?v=${vId}`;

            return (
              <div
                key={video.id}
                className="group rounded-2xl border border-white/10 bg-card overflow-hidden hover:border-brand-purple/50 transition-all shadow-xl flex flex-col"
              >
                {/* Responsive Embedded YouTube Player */}
                <div className="relative aspect-video bg-black">
                  <iframe
                    src={`https://www.youtube.com/embed/${vId}`}
                    title="YouTube Video"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                    className="w-full h-full border-0"
                  />
                </div>
                <div className="p-4 bg-[#0c0c14] flex items-center justify-between text-xs font-mono text-gray-300">
                  <span className="font-bold text-white">@DarNedYt Official</span>
                  <a
                    href={directUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="px-3.5 py-1.5 rounded-lg bg-brand-cyan/20 text-brand-cyan border border-brand-cyan/40 hover:bg-brand-cyan/30 font-bold transition-all inline-flex items-center gap-1.5"
                  >
                    <span>Watch Video</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 5. WHY PARTNER PERKS GRID */}
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

      {/* 6. FAQ ACCORDION */}
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
