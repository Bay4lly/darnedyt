import React from 'react';
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
        <ContactClientView userSession={user} />
      </main>
      <Footer />
    </div>
  );
}
