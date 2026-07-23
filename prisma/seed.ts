import { PrismaClient } from '@prisma/client';
import { Role, TicketCategory, TicketPriority, TicketStatus } from '../src/types';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting DarNed Sponsorship Hub database seeding...');

  const adminEmail = process.env.ADMIN_EMAIL || 'umran3639828@gmail.com';
  const adminPassword = process.env.ADMIN_INITIAL_PASSWORD || 'AdminUmran1234!';

  if (!adminEmail || !adminPassword) {
    throw new Error('❌ Missing ADMIN_EMAIL or ADMIN_INITIAL_PASSWORD environment variables.');
  }

  // 1. Create or update Root Admin safely
  const hashedPassword = await bcrypt.hash(adminPassword, 10);

  const existingAdmin = await prisma.user.findFirst({
    where: {
      OR: [{ email: adminEmail }, { username: 'darned_admin' }],
    },
  });

  let admin;
  if (existingAdmin) {
    admin = await prisma.user.update({
      where: { id: existingAdmin.id },
      data: {
        email: adminEmail,
        passwordHash: hashedPassword,
        role: Role.SUPER_ADMIN,
        isEmailVerified: true,
      },
    });
  } else {
    admin = await prisma.user.create({
      data: {
        name: 'DarNed Admin',
        username: 'darned_admin',
        email: adminEmail,
        passwordHash: hashedPassword,
        company: 'DarNed Official',
        role: Role.SUPER_ADMIN,
        isEmailVerified: true,
      },
    });
  }

  console.log(`✅ Super Admin created: ${admin.email} (Role: ${admin.role})`);

  // 2. Create Sample Test User
  const testUserPassword = await bcrypt.hash('UserPassword123!', 10);
  const testUser = await prisma.user.upsert({
    where: { email: 'partner@brandexample.com' },
    update: {},
    create: {
      name: 'Alex Johnson',
      username: 'alex_brand',
      email: 'partner@brandexample.com',
      passwordHash: testUserPassword,
      company: 'PixelCraft Studios',
      role: Role.USER,
      isEmailVerified: true,
    },
  });

  console.log(`✅ Sample Partner user created: ${testUser.email}`);

  // 3. Seed Sponsorship Packages with updated exact requested prices ($50 Shorts, $300 Long Video)
  await prisma.sponsorshipPackage.deleteMany({});
  const packages = [
    {
      titleEn: 'YouTube Shorts Integration',
      titleTr: 'YouTube Shorts Entegrasyonu',
      descEn: 'High-energy 30-60 second dedicated Shorts video showcasing your Minecraft server, game mod, app, or product.',
      descTr: 'Oyununuzu, ürününüzü veya Minecraft sunucunuzu tanıtan yüksek enerjili 30-60 saniyelik özel Shorts entegrasyonu.',
      price: '$50',
      showPrice: true,
      isPopular: true,
      orderIndex: 1,
      featuresEn: JSON.stringify([
        '30-60 Second Dedicated Shorts Video',
        'Pinned Comment with Custom Tracking Link',
        'Description Link & Direct Call-to-Action',
        'Cross-posted to YouTube Community Tab',
        '7-Day Post-Upload Performance Report',
      ]),
      featuresTr: JSON.stringify([
        '30-60 Saniye Özel Shorts Videosu',
        'Sabitlenmiş Yorum ve Özel Bağlantı',
        'Açıklama Bağlantısı ve Harekete Geçirme',
        'Topluluk Sekmesinde Paylaşım',
        '7 Günlük Analitik Performans Raporu',
      ]),
    },
    {
      titleEn: 'Dedicated Long Video',
      titleTr: 'Özel Uzun Video',
      descEn: 'Full 10-15 minute Minecraft gameplay video custom-themed around your server, modpack, or product release.',
      descTr: 'Sunucunuz, mod paketiniz veya ürününüz etrafında kurgulanmış 10-15 dakikalık özel Minecraft oyuniçi videosu.',
      price: '$300',
      showPrice: true,
      isPopular: false,
      orderIndex: 2,
      featuresEn: JSON.stringify([
        '10-15 Minute Full Dedicated Video',
        'Custom Thumbnail & Branding Integration',
        'Top-line Description Link & Promo Code',
        'Official Discord Server Announcement',
        'Guaranteed High Viewer Retention',
      ]),
      featuresTr: JSON.stringify([
        '10-15 Dakika Tamamen Özel Video',
        'Özel Küçük Resim (Thumbnail) Markalaması',
        'Açıklama Başı Bağlantı ve İndirim Kodu',
        'Resmi Discord Sunucu Duyurusu',
        'Yüksek İzleyici Tutundurma Garantisi',
      ]),
    },
    {
      titleEn: 'Mid-roll Product Placement',
      titleTr: 'Video İçi Ürün Yerleştirme',
      descEn: 'Seamless 60-90 second organic mid-roll integration inside a standard viral Minecraft video.',
      descTr: 'Popüler bir Minecraft videosu içerisinde 60-90 saniyelik doğal mid-roll ürün yerleştirmesi.',
      price: '$150',
      showPrice: true,
      isPopular: false,
      orderIndex: 3,
      featuresEn: JSON.stringify([
        '60-90 Second Organic Mid-Roll Segment',
        'Verbal Call-to-Action & Visual Screen Overlay',
        'Top Description Link Placement',
        'High Engagement Placement',
      ]),
      featuresTr: JSON.stringify([
        '60-90 Saniye Doğal Mid-Roll Bölümü',
        'Sözlü Çağrı ve Görsel Ekran Görseli',
        'Açıklama Bağlantısı Yerleşimi',
        'Yüksek Etkileşimli Bölüm',
      ]),
    },
    {
      titleEn: 'Brand Ambassador Program',
      titleTr: 'Marka Elçiliği Programı',
      descEn: 'Long-term 3 to 6 month partnership including regular Shorts, Long Videos, social shoutouts & custom events.',
      descTr: 'Düzenli Shorts, Uzun Videolar, sosyal medya duyuruları ve özel etkinlikleri içeren 3-6 aylık uzun süreli ortaklık.',
      price: 'Custom Quote',
      showPrice: false,
      isPopular: false,
      orderIndex: 4,
      featuresEn: JSON.stringify([
        'Monthly Content Package (Shorts + Long Videos)',
        'Exclusive Category Rights',
        'Custom In-Game Branding / Skins',
        'VIP Discord & Community Spotlight',
        'Dedicated Campaign Manager',
      ]),
      featuresTr: JSON.stringify([
        'Aylık İçerik Paketi (Shorts + Videolar)',
        'Kategoriye Özel Münhasırlık',
        'Özel Oyuniçi Markalama / Ciltler',
        'VIP Discord ve Topluluk Öne Çıkarma',
        'Özel Kampanya Yöneticisi',
      ]),
    },
  ];

  for (const pkg of packages) {
    await prisma.sponsorshipPackage.create({ data: pkg });
  }
  console.log('✅ Sponsorship packages seeded with $50 Shorts & $300 Long Video');

  // 4. Seed FAQs
  await prisma.fAQ.deleteMany({});
  const faqs = [
    {
      questionEn: 'What type of content does DarNed create?',
      questionTr: 'DarNed ne tür içerikler üretiyor?',
      answerEn: 'DarNed specializes in highly entertaining, fast-paced Minecraft gameplay videos, custom challenges, and viral YouTube Shorts.',
      answerTr: 'DarNed yüksek tempolu, eğlenceli Minecraft oynanış videoları, özel meydan okumalar ve viral YouTube Shorts içeriklerinde uzmanlaşmıştır.',
      category: 'General',
      orderIndex: 1,
    },
    {
      questionEn: 'Where is DarNed based and what is the audience demographic?',
      questionTr: 'DarNed nerede yaşıyor ve hedef kitle demografisi nedir?',
      answerEn: 'DarNed is based in the United States. The primary audience consists of passionate English-speaking gamers aged 13-28 across the US, UK, Canada, and Europe.',
      answerTr: 'DarNed Amerika Birleşik Devletleri merkezlidir. Ana izleyici kitlesi ABD, İngiltere, Kanada ve Avrupa genelindeki 13-28 yaş arası tutkulu İngilizce konuşan oyunculardır.',
      category: 'Audience',
      orderIndex: 2,
    },
    {
      questionEn: 'How long does it take to produce a sponsored video?',
      questionTr: 'Sponsorlu bir videonun hazırlanması ne kadar sürer?',
      answerEn: 'Shorts sponsorships ($50) typically take 3-5 business days after script approval. Dedicated long videos ($300) take 7-10 business days.',
      answerTr: 'Shorts sponsorlukları ($50) senaryo onayından sonra 3-5 iş günü; özel uzun videolar ($300) ise 7-10 iş günü sürmektedir.',
      category: 'Sponsorship',
      orderIndex: 3,
    },
    {
      questionEn: 'Can we track campaign performance and links?',
      questionTr: 'Kampanya performansını ve bağlantıları takip edebilir miyiz?',
      answerEn: 'Yes! We provide trackable custom bit.ly or UTM links along with a detailed 7-day analytics report post-upload.',
      answerTr: 'Evet! Özel UTM bağlantıları ve video yüklendikten 7 gün sonra detaylı bir analitik raporu sunuyoruz.',
      category: 'Analytics',
      orderIndex: 4,
    },
  ];

  for (const faq of faqs) {
    await prisma.fAQ.create({ data: faq });
  }
  console.log('✅ FAQs seeded');

  // 5. Seed Site Settings
  const settings = [
    { key: 'maintenance_mode', value: 'false' },
    { key: 'registration_open', value: 'true' },
    { key: 'announcement_banner', value: '🚀 Open for Sponsorship Deals! $50 Shorts & $300 Dedicated Long Videos.' },
    { key: 'subscribers_count', value: '385000' },
    { key: 'total_views', value: '142000000' },
    { key: 'total_videos', value: '340' },
    { key: 'contact_email', value: 'umran3639828@gmail.com' },
    { key: 'channel_handle', value: '@DarNedYt' },
    { key: 'channel_url', value: 'https://www.youtube.com/@DarNedYt' },
  ];

  for (const setting of settings) {
    await prisma.siteSetting.upsert({
      where: { key: setting.key },
      update: { value: setting.value },
      create: setting,
    });
  }
  console.log('✅ Site settings seeded');

  // 6. Seed Initial Test Ticket
  const sampleTicket = await prisma.ticket.upsert({
    where: { ticketNumber: 'TICK-984210' },
    update: {},
    create: {
      ticketNumber: 'TICK-984210',
      userId: testUser.id,
      name: 'Alex Johnson',
      company: 'PixelCraft Studios',
      email: 'partner@brandexample.com',
      phone: '+1 555-019-2834',
      category: TicketCategory.SPONSORSHIP,
      subject: 'Minecraft Server Launch Campaign Proposal',
      message: 'Hello DarNed Team,\n\nWe are launching a new custom Minecraft RPG server next month and would love to collaborate on a dedicated 60s Shorts video + mid-roll integration.\n\nLooking forward to hearing from you!',
      estimatedBudget: '$50 - $300',
      startDate: '2026-08-15',
      contentType: 'YouTube Shorts + Mid-roll',
      status: TicketStatus.OPEN,
      priority: TicketPriority.HIGH,
    },
  });

  await prisma.ticketMessage.create({
    data: {
      ticketId: sampleTicket.id,
      senderId: testUser.id,
      senderName: testUser.name,
      senderEmail: testUser.email,
      isFromAdmin: false,
      message: sampleTicket.message,
    },
  });

  console.log(`✅ Sample ticket created: ${sampleTicket.ticketNumber}`);
  console.log('🎉 Database seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
