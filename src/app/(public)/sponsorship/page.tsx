import React from 'react';
import Link from 'next/link';
import { db } from '@/lib/db';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { getSessionUser } from '@/lib/auth';
import { SponsorshipClientView } from '@/components/sponsorship/SponsorshipClientView';

export default async function SponsorshipPage() {
  const user = await getSessionUser();

  const packages = await db.sponsorshipPackage.findMany({
    orderBy: { orderIndex: 'asc' },
  });

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col font-sans">
      <Navbar userSession={user} />
      <main className="flex-grow">
        <SponsorshipClientView packages={packages} />
      </main>
      <Footer />
    </div>
  );
}
