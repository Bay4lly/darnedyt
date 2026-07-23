'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { useLanguage } from '@/components/providers/LanguageProvider';
import { logoutAction } from '@/server/actions/auth';
import { Globe, LayoutDashboard, LogOut, Menu, Shield, User, X } from 'lucide-react';

interface NavbarProps {
  userSession?: {
    userId: string;
    email: string;
    username: string;
    name: string;
    role: string;
  } | null;
}

export function Navbar({ userSession }: NavbarProps) {
  const { lang, setLang, t } = useLanguage();
  const pathname = usePathname();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    await logoutAction();
    router.refresh();
  };

  const navLinks = [
    { href: '/', label: t.nav.home },
    { href: '/about', label: t.nav.about },
    { href: '/sponsorship', label: t.nav.sponsorship },
    { href: '/contact', label: t.nav.contact },
  ];

  const isAdmin = userSession && (userSession.role === 'ADMIN' || userSession.role === 'SUPER_ADMIN' || userSession.role === 'STAFF');

  return (
    <header className="sticky top-0 z-50 backdrop-blur-xl bg-background/80 border-b border-white/10 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo & Brand */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative w-11 h-11 transition-transform duration-300 group-hover:scale-105">
              <Image
                src="/images/logo.svg"
                alt="DarNed Logo"
                fill
                className="object-contain drop-shadow-[0_0_12px_rgba(124,58,237,0.6)]"
                priority
              />
            </div>
            <div className="flex flex-col">
              <span className="font-display font-black text-xl tracking-wider text-white flex items-center gap-1">
                DAR<span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-purple via-brand-pink to-brand-cyan">NED</span>
              </span>
              <span className="text-[10px] text-gray-400 tracking-widest font-mono uppercase">Sponsorship Hub</span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`text-sm font-medium transition-colors hover:text-white ${
                    isActive ? 'text-brand-pink font-semibold border-b-2 border-brand-pink py-1' : 'text-gray-300'
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Action Buttons & Auth */}
          <div className="hidden md:flex items-center gap-4">
            
            {/* Language Switcher */}
            <button
              onClick={() => setLang(lang === 'en' ? 'tr' : 'en')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 hover:border-brand-purple/50 text-xs font-mono text-gray-300 hover:text-white transition-all"
              title="Switch Language"
            >
              <Globe className="w-3.5 h-3.5 text-brand-cyan" />
              <span className="uppercase font-bold">{lang}</span>
            </button>

            {userSession ? (
              <div className="flex items-center gap-3">
                {isAdmin && (
                  <Link
                    href="/admin"
                    className="flex items-center gap-1.5 text-xs px-3.5 py-2 rounded-lg bg-brand-purple/20 border border-brand-purple/50 text-brand-pink hover:bg-brand-purple/30 font-semibold transition-all shadow-glow"
                  >
                    <Shield className="w-4 h-4" />
                    {t.nav.admin}
                  </Link>
                )}
                <Link
                  href="/dashboard"
                  className="flex items-center gap-1.5 text-xs px-3.5 py-2 rounded-lg bg-white/10 border border-white/15 text-white hover:bg-white/20 font-medium transition-all"
                >
                  <LayoutDashboard className="w-4 h-4 text-brand-cyan" />
                  {t.nav.dashboard}
                </Link>
                <button
                  onClick={handleLogout}
                  className="p-2 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 hover:bg-red-500/20 transition-all"
                  title={t.nav.logout}
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link
                  href="/login"
                  className="text-xs font-semibold text-gray-300 hover:text-white px-3 py-2 transition-colors"
                >
                  {t.nav.login}
                </Link>
                <Link
                  href="/contact"
                  className="text-xs font-bold px-4 py-2.5 rounded-lg bg-gradient-to-r from-brand-purple to-brand-pink text-white hover:opacity-90 transition-all shadow-glow hover:shadow-glow-pink"
                >
                  {t.nav.contact}
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center gap-3">
            <button
              onClick={() => setLang(lang === 'en' ? 'tr' : 'en')}
              className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-mono text-gray-300"
            >
              <Globe className="w-3 h-3 text-brand-cyan" />
              <span className="uppercase font-bold text-[10px]">{lang}</span>
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg bg-white/5 border border-white/10 text-gray-300 hover:text-white"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-white/10 bg-background/95 backdrop-blur-2xl px-4 pt-3 pb-6 space-y-4">
          <nav className="flex flex-col gap-3">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="text-sm font-medium py-2 px-3 rounded-lg hover:bg-white/5 text-gray-200"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="pt-3 border-t border-white/10 flex flex-col gap-2.5">
            {userSession ? (
              <>
                {isAdmin && (
                  <Link
                    href="/admin"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-2 text-sm px-4 py-2.5 rounded-lg bg-brand-purple/20 border border-brand-purple/50 text-brand-pink font-semibold"
                  >
                    <Shield className="w-4 h-4" />
                    {t.nav.admin}
                  </Link>
                )}
                <Link
                  href="/dashboard"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-2 text-sm px-4 py-2.5 rounded-lg bg-white/10 text-white font-medium"
                >
                  <LayoutDashboard className="w-4 h-4 text-brand-cyan" />
                  {t.nav.dashboard}
                </Link>
                <button
                  onClick={() => {
                    handleLogout();
                    setMobileMenuOpen(false);
                  }}
                  className="flex items-center gap-2 text-sm px-4 py-2.5 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 font-medium text-left"
                >
                  <LogOut className="w-4 h-4" />
                  {t.nav.logout}
                </button>
              </>
            ) : (
              <div className="grid grid-cols-2 gap-3 pt-2">
                <Link
                  href="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-center text-sm font-semibold py-2.5 rounded-lg bg-white/5 border border-white/10 text-white"
                >
                  {t.nav.login}
                </Link>
                <Link
                  href="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-center text-sm font-bold py-2.5 rounded-lg bg-gradient-to-r from-brand-purple to-brand-pink text-white"
                >
                  {t.nav.register}
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
