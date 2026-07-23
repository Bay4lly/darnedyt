import React from 'react';
import { db } from '@/lib/db';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { getSessionUser } from '@/lib/auth';
import { SponsorshipClientView } from '@/components/sponsorship/SponsorshipClientView';

export default async function SponsorshipPage() {
  const user = await getSessionUser();

  let packages: any[] = [];
  try {
    packages = await db.sponsorshipPackage.findMany({
      orderBy: { orderIndex: 'asc' },
    });
  } catch (e) {
    console.warn('DB packages fetch notice (using defaults):', e);
  }

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
      {
        id: 'pkg-3',
        titleEn: 'Mid-roll Product Placement',
        titleTr: 'Video İçi Ürün Yerleştirme',
        descEn: 'Seamless 60-90 second organic mid-roll integration inside a standard viral Minecraft video.',
        descTr: 'Popüler bir Minecraft videosu içerisinde 60-90 saniyelik doğal mid-roll ürün yerleştirmesi.',
        price: '$150',
        showPrice: true,
        isPopular: false,
        featuresEn: JSON.stringify([
          '60-90 Second Mid-Roll Segment',
          'Verbal Call-to-Action',
          'Description Link Placement',
        ]),
        featuresTr: JSON.stringify([
          '60-90 Saniye Mid-Roll Bölümü',
          'Sözlü Çağrı',
          'Açıklama Bağlantısı Yerleşimi',
        ]),
      },
    ];
  }

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
