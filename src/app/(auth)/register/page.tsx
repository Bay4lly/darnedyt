import React from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { getSessionUser } from '@/lib/auth';
import { RegisterClientView } from '@/components/auth/RegisterClientView';
import { redirect } from 'next/navigation';

export default async function RegisterPage() {
  const user = await getSessionUser();
  if (user) {
    redirect('/dashboard');
  }

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col font-sans">
      <Navbar userSession={user} />
      <main className="flex-grow flex items-center justify-center py-16 px-4">
        <RegisterClientView />
      </main>
      <Footer />
    </div>
  );
}
