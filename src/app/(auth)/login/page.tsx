import React from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { getSessionUser } from '@/lib/auth';
import { LoginClientView } from '@/components/auth/LoginClientView';
import { redirect } from 'next/navigation';

export default async function LoginPage() {
  const user = await getSessionUser();
  if (user) {
    if (user.role === 'ADMIN' || user.role === 'SUPER_ADMIN' || user.role === 'STAFF') {
      redirect('/admin');
    }
    redirect('/dashboard');
  }

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col font-sans">
      <Navbar userSession={user} />
      <main className="flex-grow flex items-center justify-center py-16 px-4">
        <LoginClientView />
      </main>
      <Footer />
    </div>
  );
}
