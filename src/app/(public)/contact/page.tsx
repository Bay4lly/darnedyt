import React, { Suspense } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { getSessionUser } from '@/lib/auth';
import { ContactClientView } from '@/components/contact/ContactClientView';

export default async function ContactPage() {
  const user = await getSessionUser();

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col font-sans">
      <Navbar userSession={user} />
      <main className="flex-grow">
        <Suspense fallback={
          <div className="py-24 text-center text-xs font-mono text-gray-400 animate-pulse">
            Loading Contact Form...
          </div>
        }>
          <ContactClientView userSession={user} />
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}
