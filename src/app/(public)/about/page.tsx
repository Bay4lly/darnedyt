import React from 'react';
import { db } from '@/lib/db';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { getSessionUser } from '@/lib/auth';
import { AboutClientView } from '@/components/about/AboutClientView';

export default async function AboutPage() {
  const user = await getSessionUser();

  let settings: Record<string, string> = {
    subscribers_count: '385000',
    total_views: '142000000',
    total_videos: '340',
  };

  try {
    const settingsList = await db.siteSetting.findMany();
    settings = settingsList.reduce((acc, curr) => {
      acc[curr.key] = curr.value;
      return acc;
    }, settings);
  } catch (e) {
    console.warn('DB fetch notice on AboutPage (using defaults):', e);
  }

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
