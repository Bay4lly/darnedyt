import React from 'react';
import { db } from '@/lib/db';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { AnnouncementBanner } from '@/components/layout/AnnouncementBanner';
import { getSessionUser } from '@/lib/auth';
import { HomeClientView } from '@/components/home/HomeClientView';
import { fetchLiveYouTubeStats } from '@/lib/youtube';

export const revalidate = 60; // Refresh dynamic stats every 60s

export default async function HomePage() {
  const user = await getSessionUser();

  // Fetch live YouTube API / DB stats
  const { stats, latestVideos, latestShorts } = await fetchLiveYouTubeStats();

  const settingsList = await db.siteSetting.findMany();
  const settings = settingsList.reduce((acc, curr) => {
    acc[curr.key] = curr.value;
    return acc;
  }, {} as Record<string, string>);

  const bannerText = settings.announcement_banner || '🚀 Open for Sponsorship Deals! $50 Shorts & $300 Dedicated Long Videos.';

  const packages = await db.sponsorshipPackage.findMany({
    orderBy: { orderIndex: 'asc' },
  });

  const faqs = await db.fAQ.findMany({
    orderBy: { orderIndex: 'asc' },
  });

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col font-sans selection:bg-brand-purple selection:text-white">
      <AnnouncementBanner text={bannerText} />
      <Navbar userSession={user} />
      <main className="flex-grow">
        <HomeClientView
          subs={stats.subscriberCount}
          views={stats.viewCount}
          videos={stats.videoCount}
          packages={packages}
          faqs={faqs}
          realVideos={latestVideos}
          realShorts={latestShorts}
        />
      </main>
      <Footer />
    </div>
  );
}
