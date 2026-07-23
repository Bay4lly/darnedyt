import React from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { ResetPasswordClientView } from '@/components/auth/ResetPasswordClientView';

export default function ResetPasswordPage({ searchParams }: { searchParams: { token?: string } }) {
  const token = searchParams.token || '';

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col font-sans">
      <Navbar />
      <main className="flex-grow flex items-center justify-center py-16 px-4">
        <ResetPasswordClientView token={token} />
      </main>
      <Footer />
    </div>
  );
}
