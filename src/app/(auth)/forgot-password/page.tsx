import React from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { ForgotPasswordClientView } from '@/components/auth/ForgotPasswordClientView';

export default function ForgotPasswordPage() {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col font-sans">
      <Navbar />
      <main className="flex-grow flex items-center justify-center py-16 px-4">
        <ForgotPasswordClientView />
      </main>
      <Footer />
    </div>
  );
}
