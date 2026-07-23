import { PrismaClient } from '@prisma/client';
import { Role, TicketCategory, TicketPriority, TicketStatus } from '../src/types';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting DarNed Sponsorship Hub database seeding...');

  const adminEmail = process.env.ADMIN_EMAIL;
  const adminPassword = process.env.ADMIN_INITIAL_PASSWORD;

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

  // 3. Seed Sponsorship Packages
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
      ]),
      featuresTr: JSON.stringify([
        '60-90 Saniye Doğal Mid-Roll Bölümü',
        'Sözlü Çağrı ve Görsel Ekran Görseli',
        'Açıklama Bağlantısı Yerleşimi',
      ]),
    },
  ];

  for (const pkg of packages) {
    await prisma.sponsorshipPackage.create({ data: pkg });
  }

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
  ];

  for (const faq of faqs) {
    await prisma.fAQ.create({ data: faq });
  }

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
