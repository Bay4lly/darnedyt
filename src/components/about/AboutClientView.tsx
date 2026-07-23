'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useLanguage } from '@/components/providers/LanguageProvider';
import {
  ArrowRight,
  Flame,
  Globe,
  MessageSquare,
  ShieldCheck,
  Sparkles,
  Trophy,
  Users,
  Youtube,
} from 'lucide-react';

export function AboutClientView({ settings }: { settings: Record<string, string> }) {
  const { t } = useLanguage();

  const subs = settings.subscribers_count || '385000';
  const views = settings.total_views || '142000000';
  const videos = settings.total_videos || '340';

  return (
    <div className="py-16 space-y-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      
      {/* Header Banner */}
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-purple/20 border border-brand-purple/40 text-brand-pink text-xs font-mono font-bold uppercase">
          <Sparkles className="w-4 h-4 text-brand-cyan" />
          {t.about.title}
        </div>
        <h1 className="font-display text-4xl sm:text-6xl font-black text-white">
          {t.about.subtitle}
        </h1>
      </div>

      {/* Creator Profile Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        
        {/* Brand Logo Card */}
        <div className="lg:col-span-5 flex justify-center">
          <div className="relative w-72 h-72 sm:w-96 sm:h-96 rounded-3xl bg-gradient-to-tr from-brand-purple via-brand-pink to-brand-cyan p-1 shadow-glow">
            <div className="w-full h-full rounded-[23px] bg-[#0c0c14] p-8 flex flex-col items-center justify-center space-y-6 text-center">
              <div className="relative w-36 h-36">
                <Image
                  src="/images/logo.svg"
                  alt="DarNed"
                  fill
                  className="object-contain drop-shadow-[0_0_20px_rgba(124,58,237,0.8)]"
                />
              </div>
              <div>
                <h3 className="font-display font-black text-2xl text-white">DarNed</h3>
                <p className="text-xs font-mono text-brand-pink uppercase tracking-widest">@DarNedYt</p>
              </div>
              <div className="flex items-center gap-2 text-xs font-semibold px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-gray-300">
                <Globe className="w-4 h-4 text-brand-cyan" />
                United States
              </div>
            </div>
          </div>
        </div>

        {/* Bio Text */}
        <div className="lg:col-span-7 space-y-6 text-gray-300">
          <h2 className="font-display text-2xl sm:text-3xl font-bold text-white leading-snug">
            Crafting Energetic, High-Engagement Gaming Experiences for Millions
          </h2>
          <p className="text-sm leading-relaxed text-gray-300">
            {t.about.bioParagraph1}
          </p>
          <p className="text-sm leading-relaxed text-gray-300">
            {t.about.bioParagraph2}
          </p>
          <div className="pt-4 flex flex-wrap gap-4">
            <Link
              href="/sponsorship"
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-brand-purple to-brand-pink text-white text-xs font-bold hover:opacity-90 transition-all shadow-glow"
            >
              Explore Sponsorship Packages
            </Link>
            <Link
              href="/contact"
              className="px-6 py-3 rounded-xl bg-white/5 border border-white/15 text-white text-xs font-bold hover:bg-white/10 transition-all flex items-center gap-2"
            >
              Contact Team <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

      </div>

      {/* Demographics Grid */}
      <div className="p-8 sm:p-12 rounded-3xl bg-card border border-white/10 backdrop-blur-xl shadow-2xl space-y-8">
        <h3 className="font-display text-2xl font-bold text-white text-center">
          {t.about.audienceTitle}
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="p-6 rounded-2xl bg-white/5 border border-white/5 space-y-2">
            <span className="text-xs font-mono font-semibold text-brand-purple uppercase">Market 1</span>
            <p className="text-sm font-bold text-white">{t.about.demographic1}</p>
          </div>

          <div className="p-6 rounded-2xl bg-white/5 border border-white/5 space-y-2">
            <span className="text-xs font-mono font-semibold text-brand-pink uppercase">Market 2</span>
            <p className="text-sm font-bold text-white">{t.about.demographic2}</p>
          </div>

          <div className="p-6 rounded-2xl bg-white/5 border border-white/5 space-y-2">
            <span className="text-xs font-mono font-semibold text-brand-cyan uppercase">Age Bracket</span>
            <p className="text-sm font-bold text-white">{t.about.demographic3}</p>
          </div>

          <div className="p-6 rounded-2xl bg-white/5 border border-white/5 space-y-2">
            <span className="text-xs font-mono font-semibold text-indigo-400 uppercase">Core Interest</span>
            <p className="text-sm font-bold text-white">{t.about.demographic4}</p>
          </div>
        </div>
      </div>

    </div>
  );
}
