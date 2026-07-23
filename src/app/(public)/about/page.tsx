import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { db } from '@/lib/db';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { getSessionUser } from '@/lib/auth';
import { AboutClientView } from '@/components/about/AboutClientView';

export default async function AboutPage() {
  const user = await getSessionUser();

  const settingsList = await db.siteSetting.findMany();
  const settings = settingsList.reduce((acc, curr) => {
    acc[curr.key] = curr.value;
    return acc;
  }, {} as Record<string, string>);

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col font-sans">
      <Navbar userSession={user} />
      <main className="flex-grow">
        <AboutClientView settings={settings} />
      </main>
      <Footer />
    </div>
  );
}
