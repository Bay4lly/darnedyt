'use client';

import React from 'react';
import Link from 'next/link';
import { useLanguage } from '@/components/providers/LanguageProvider';
import { CheckCircle2, Sparkles, ArrowRight, ShieldCheck, Zap } from 'lucide-react';

export function SponsorshipClientView({ packages }: { packages: any[] }) {
  const { lang, t } = useLanguage();

  return (
    <div className="py-16 space-y-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      
      {/* Page Title */}
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-purple/20 border border-brand-purple/40 text-brand-pink text-xs font-mono font-bold uppercase">
          <Zap className="w-4 h-4 text-brand-cyan" />
          {t.sponsorship.title}
        </div>
        <h1 className="font-display text-4xl sm:text-6xl font-black text-white">
          Empower Your Brand with Viral Gaming Reach
        </h1>
        <p className="text-sm sm:text-base text-gray-300">
          {t.sponsorship.subtitle}
        </p>
      </div>

      {/* Packages Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {packages.map((pkg) => {
          const title = lang === 'tr' ? pkg.titleTr : pkg.titleEn;
          const desc = lang === 'tr' ? pkg.descTr : pkg.descEn;
          const featuresRaw = lang === 'tr' ? pkg.featuresTr : pkg.featuresEn;
          let features: string[] = [];

          try {
            features = typeof featuresRaw === 'string' ? JSON.parse(featuresRaw) : featuresRaw;
          } catch (e) {
            features = [featuresRaw];
          }

          const targetUrl = `/contact?package=${encodeURIComponent(title)}&price=${encodeURIComponent(pkg.price)}&category=SPONSORSHIP`;

          return (
            <div
              key={pkg.id}
              className={`relative rounded-3xl bg-card border p-8 backdrop-blur-xl flex flex-col justify-between transition-all duration-300 shadow-2xl hover:scale-[1.02] ${
                pkg.isPopular
                  ? 'border-brand-pink shadow-glow-pink bg-gradient-to-b from-[#180f2d] to-[#0c0c14]'
                  : 'border-white/10 hover:border-brand-purple/50'
              }`}
            >
              {pkg.isPopular && (
                <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-gradient-to-r from-brand-purple to-brand-pink text-[10px] font-mono font-black text-white uppercase tracking-widest shadow-md">
                  {t.sponsorship.popularBadge}
                </span>
              )}

              <div className="space-y-6">
                <div>
                  <h3 className="font-display text-xl font-bold text-white mb-2">{title}</h3>
                  <p className="text-xs text-gray-400 leading-relaxed">{desc}</p>
                </div>

                {/* Price Display */}
                <div className="py-4 border-y border-white/10">
                  {pkg.showPrice ? (
                    <div className="font-display text-2xl font-black text-white">
                      {pkg.price}
                    </div>
                  ) : (
                    <div className="font-display text-xl font-bold text-brand-pink">
                      {t.sponsorship.customQuotePrice}
                    </div>
                  )}
                </div>

                {/* Included Features */}
                <div className="space-y-3">
                  <span className="text-[11px] font-mono uppercase tracking-wider text-gray-400 font-bold block">
                    {t.sponsorship.featuresHeader}
                  </span>
                  <ul className="space-y-2.5">
                    {features.map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-xs text-gray-300">
                        <CheckCircle2 className="w-4 h-4 text-brand-cyan flex-shrink-0 mt-0.5" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Action Button */}
              <div className="pt-8">
                <Link
                  href={targetUrl}
                  className={`w-full py-3.5 px-4 rounded-xl text-xs font-bold text-center flex items-center justify-center gap-2 transition-all shadow-md ${
                    pkg.isPopular
                      ? 'bg-gradient-to-r from-brand-purple to-brand-pink text-white hover:opacity-95 shadow-glow'
                      : 'bg-white/10 text-white hover:bg-white/20 border border-white/10'
                  }`}
                >
                  <span>{t.sponsorship.requestQuote}</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          );
        })}
      </div>

      {/* Terms & Disclaimer Notice */}
      <div className="p-6 rounded-2xl bg-white/5 border border-white/10 text-center max-w-3xl mx-auto space-y-2">
        <div className="flex items-center justify-center gap-2 text-xs font-bold text-brand-cyan uppercase">
          <ShieldCheck className="w-4 h-4" />
          Flexible Terms & Tailored Contracts
        </div>
        <p className="text-xs text-gray-400">
          {t.sponsorship.disclaimer}
        </p>
      </div>

    </div>
  );
}
