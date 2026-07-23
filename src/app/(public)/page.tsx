import React from 'react';
import { db } from '@/lib/db';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { AnnouncementBanner } from '@/components/layout/AnnouncementBanner';
import { getSessionUser } from '@/lib/auth';
import { HomeClientView } from '@/components/home/HomeClientView';
import { fetchLiveYouTubeStats } from '@/lib/youtube';

export const revalidate = 60;

export default async function HomePage() {
  const user = await getSessionUser();

  const { stats, latestVideos, latestShorts } = await fetchLiveYouTubeStats();

  let bannerText = '🚀 Open for Sponsorship Deals! $50 Shorts & $300 Dedicated Long Videos.';
  let packages: any[] = [];
  let faqs: any[] = [];

  try {
    const settingsList = await db.siteSetting.findMany();
    const settings = settingsList.reduce((acc, curr) => {
      acc[curr.key] = curr.value;
      return acc;
    }, {} as Record<string, string>);

    if (settings.announcement_banner) {
      bannerText = settings.announcement_banner;
    }

    packages = await db.sponsorshipPackage.findMany({
      orderBy: { orderIndex: 'asc' },
    });

    faqs = await db.fAQ.findMany({
      orderBy: { orderIndex: 'asc' },
    });
  } catch (e) {
    console.warn('DB fetch notice on HomePage (using defaults):', e);
  }

  // Default fallback packages if database is unseeded on Vercel
  if (packages.length === 0) {
    packages = [
      {
        id: 'pkg-1',
        titleEn: 'YouTube Shorts Integration',
        titleTr: 'YouTube Shorts Entegrasyonu',
        descEn: 'High-energy 30-60 second dedicated Shorts video showcasing your gaming app or server.',
        descTr: 'Oyununuzu veya sunucunuzu tanıtan yüksek enerjili 30-60 saniyelik Shorts entegrasyonu.',
        price: '$50',
        showPrice: true,
        isPopular: true,
        featuresEn: JSON.stringify([
          '30-60 Second Dedicated Shorts Video',
          'Pinned Comment with Custom Link',
          'Description Link & Call-to-Action',
          '7-Day Analytics Report',
        ]),
        featuresTr: JSON.stringify([
          '30-60 Saniye Özel Shorts Videosu',
          'Sabitlenmiş Yorum ve Özel Bağlantı',
          'Açıklama Bağlantısı ve Harekete Geçirme',
          '7 Günlük Analitik Raporu',
        ]),
      },
      {
        id: 'pkg-2',
        titleEn: 'Dedicated Long Video',
        titleTr: 'Özel Uzun Video',
        descEn: 'Full 10-15 minute Minecraft gameplay video custom-themed around your product release.',
        descTr: 'Sunucunuz veya mod paketiniz etrafında kurgulanmış 10-15 dakikalık özel Minecraft videosu.',
        price: '$300',
        showPrice: true,
        isPopular: false,
        featuresEn: JSON.stringify([
          '10-15 Minute Dedicated Video',
          'Custom Thumbnail & Branding',
          'Top-line Description Link',
          'Discord Server Announcement',
        ]),
        featuresTr: JSON.stringify([
          '10-15 Dakika Özel Video',
          'Özel Thumbnail Markalaması',
          'Açıklama Başı Bağlantı',
          'Discord Sunucu Duyurusu',
        ]),
      },
    ];
  }

  if (faqs.length === 0) {
    faqs = [
      {
        id: 'faq-1',
        questionEn: 'What type of content does DarNed create?',
        questionTr: 'DarNed ne tür içerikler üretiyor?',
        answerEn: 'DarNed specializes in highly entertaining, fast-paced Minecraft gameplay videos, custom challenges, and viral YouTube Shorts.',
        answerTr: 'DarNed yüksek tempolu, eğlenceli Minecraft oynanış videoları, özel meydan okumalar ve viral YouTube Shorts içeriklerinde uzmanlaşmıştır.',
      },
      {
        id: 'faq-2',
        questionEn: 'How long does it take to produce a sponsored video?',
        questionTr: 'Sponsorlu bir videonun hazırlanması ne kadar sürer?',
        answerEn: 'Shorts sponsorships ($50) take 3-5 business days after script approval. Dedicated long videos ($300) take 7-10 business days.',
        answerTr: 'Shorts sponsorlukları ($50) 3-5 iş günü; özel uzun videolar ($300) 7-10 iş günü sürmektedir.',
      },
    ];
  }

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
