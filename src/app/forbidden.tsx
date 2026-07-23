import React from 'react';
import Link from 'next/link';
import { ShieldAlert, Home } from 'lucide-react';

export default function Forbidden() {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col items-center justify-center p-4 text-center space-y-6">
      <div className="p-4 rounded-full bg-red-500/20 text-red-400 border border-red-500/30">
        <ShieldAlert className="w-12 h-12" />
      </div>
      <h1 className="font-display font-black text-5xl text-white">403 Forbidden</h1>
      <p className="text-xs text-gray-400 max-w-md">
        You do not have administrative permissions to view this section. Please log in with an Admin account.
      </p>
      <Link
        href="/login"
        className="px-6 py-3 rounded-xl bg-brand-purple text-white font-bold text-xs shadow-glow"
      >
        Sign In as Admin
      </Link>
    </div>
  );
}
