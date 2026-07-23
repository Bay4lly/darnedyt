'use client';

import React from 'react';
import Link from 'next/link';
import { AlertTriangle, RefreshCw } from 'lucide-react';

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col items-center justify-center p-4 text-center space-y-6">
      <div className="p-4 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/30">
        <AlertTriangle className="w-12 h-12" />
      </div>
      <h1 className="font-display font-black text-4xl text-white">Something Went Wrong</h1>
      <p className="text-xs text-gray-400 max-w-md">
        An unexpected application error occurred. Stack traces are masked for security.
      </p>
      <button
        onClick={() => reset()}
        className="px-6 py-3 rounded-xl bg-gradient-to-r from-brand-purple to-brand-pink text-white font-bold text-xs flex items-center gap-2 shadow-glow"
      >
        <RefreshCw className="w-4 h-4" /> Try Again
      </button>
    </div>
  );
}
