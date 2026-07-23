import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Home, ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col items-center justify-center p-4 text-center space-y-6">
      <div className="relative w-24 h-24">
        <Image src="/images/logo.svg" alt="DarNed" fill className="object-contain opacity-50" />
      </div>
      <h1 className="font-display font-black text-6xl text-brand-pink">404</h1>
      <h2 className="text-2xl font-bold text-white">Page Not Found</h2>
      <p className="text-xs text-gray-400 max-w-md">
        The page or ticket record you are looking for doesn't exist or has been moved.
      </p>
      <Link
        href="/"
        className="px-6 py-3 rounded-xl bg-gradient-to-r from-brand-purple to-brand-pink text-white font-bold text-xs flex items-center gap-2 shadow-glow"
      >
        <Home className="w-4 h-4" /> Return to Home
      </Link>
    </div>
  );
}
