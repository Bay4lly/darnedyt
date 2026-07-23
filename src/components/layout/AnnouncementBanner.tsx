'use client';

import React from 'react';
import { Sparkles } from 'lucide-react';

export function AnnouncementBanner({ text }: { text?: string }) {
  if (!text || text.trim() === '') return null;

  return (
    <div className="bg-gradient-to-r from-brand-purple via-brand-pink to-brand-cyan text-white text-xs sm:text-sm font-semibold py-2 px-4 text-center flex items-center justify-center gap-2 shadow-md">
      <Sparkles className="w-4 h-4 animate-spin" style={{ animationDuration: '6s' }} />
      <span>{text}</span>
    </div>
  );
}
