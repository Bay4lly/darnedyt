'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useLanguage } from '@/components/providers/LanguageProvider';
import { Mail, Youtube, MessageSquare, Twitter, Instagram, ShieldCheck } from 'lucide-react';

export function Footer() {
  const { t } = useLanguage();

  return (
    <footer className="bg-[#040407] border-t border-white/10 text-gray-400 pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          
          {/* Brand Info */}
          <div className="space-y-4 md:col-span-1">
            <Link href="/" className="flex items-center gap-3">
              <div className="relative w-10 h-10">
                <Image src="/images/logo.svg" alt="DarNed" fill className="object-contain" />
              </div>
              <span className="font-display font-black text-xl text-white tracking-wider">
                DAR<span className="text-brand-pink">NED</span>
              </span>
            </Link>
            <p className="text-xs leading-relaxed text-gray-400">
              Official sponsorship & business contact hub for YouTube content creator DarNed (@DarNedYt). Delivering high-impact gaming partnerships and Minecraft viral content.
            </p>
            <div className="flex items-center gap-3 pt-2">
              <a
                href="https://www.youtube.com/@DarNedYt"
                target="_blank"
                rel="noreferrer"
                className="p-2 rounded-lg bg-red-600/10 border border-red-600/30 text-red-500 hover:bg-red-600/20 transition-all"
                title="YouTube"
              >
                <Youtube className="w-4 h-4" />
              </a>
              <a
                href="https://discord.gg"
                target="_blank"
                rel="noreferrer"
                className="p-2 rounded-lg bg-indigo-600/10 border border-indigo-600/30 text-indigo-400 hover:bg-indigo-600/20 transition-all"
                title="Discord"
              >
                <MessageSquare className="w-4 h-4" />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noreferrer"
                className="p-2 rounded-lg bg-cyan-600/10 border border-cyan-600/30 text-cyan-400 hover:bg-cyan-600/20 transition-all"
                title="Twitter"
              >
                <Twitter className="w-4 h-4" />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                className="p-2 rounded-lg bg-pink-600/10 border border-pink-600/30 text-pink-400 hover:bg-pink-600/20 transition-all"
                title="Instagram"
              >
                <Instagram className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick Navigation */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider font-mono">Navigation</h4>
            <ul className="space-y-2 text-xs">
              <li><Link href="/" className="hover:text-brand-pink transition-colors">{t.nav.home}</Link></li>
              <li><Link href="/about" className="hover:text-brand-pink transition-colors">{t.nav.about}</Link></li>
              <li><Link href="/sponsorship" className="hover:text-brand-pink transition-colors">{t.nav.sponsorship}</Link></li>
              <li><Link href="/contact" className="hover:text-brand-pink transition-colors">{t.nav.contact}</Link></li>
            </ul>
          </div>

          {/* Business & Legal */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider font-mono">Legal & Policy</h4>
            <ul className="space-y-2 text-xs">
              <li><Link href="/privacy" className="hover:text-brand-pink transition-colors">Privacy Policy</Link></li>
              <li><Link href="/terms" className="hover:text-brand-pink transition-colors">Terms of Service</Link></li>
              <li><Link href="/login" className="hover:text-brand-pink transition-colors">Partner Sign In</Link></li>
              <li><Link href="/register" className="hover:text-brand-pink transition-colors">Join Portal</Link></li>
            </ul>
          </div>

          {/* Direct Contact */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider font-mono">Direct Inquiry</h4>
            <p className="text-xs text-gray-400">Prefer direct email over ticket system?</p>
            <a
              href="mailto:umran3639828@gmail.com"
              className="inline-flex items-center gap-2 text-xs font-mono px-3.5 py-2.5 rounded-lg bg-white/5 border border-white/10 text-brand-cyan hover:border-brand-cyan/40 transition-all"
            >
              <Mail className="w-4 h-4 text-brand-pink" />
              umran3639828@gmail.com
            </a>
            <div className="flex items-center gap-2 text-[11px] text-gray-500 pt-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Response time: &lt; 24-48 Hours</span>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between text-xs text-gray-500 gap-4">
          <p>© {new Date().getFullYear()} DarNed Sponsorship & Contact Hub. All rights reserved.</p>
          <p className="font-mono text-[11px]">YouTube Channel: @DarNedYt (385,000+ Subs)</p>
        </div>
      </div>
    </footer>
  );
}
