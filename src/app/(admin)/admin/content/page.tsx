import React from 'react';
import { redirect } from 'next/navigation';
import { db } from '@/lib/db';
import { getSessionUser } from '@/lib/auth';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { AdminContentClientView } from '@/components/admin/AdminContentClientView';

export default async function AdminContentPage() {
  const user = await getSessionUser();
  if (!user || (user.role !== 'ADMIN' && user.role !== 'SUPER_ADMIN' && user.role !== 'STAFF')) {
    redirect('/forbidden');
  }

  const settingsList = await db.siteSetting.findMany();
  const settings = settingsList.reduce((acc, curr) => {
    acc[curr.key] = curr.value;
    return acc;
  }, {} as Record<string, string>);

  const packages = await db.sponsorshipPackage.findMany({
    orderBy: { orderIndex: 'asc' },
  });

  const faqs = await db.fAQ.findMany({
    orderBy: { orderIndex: 'asc' },
  });

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col font-sans">
      <Navbar userSession={user} />
      <main className="flex-grow py-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <AdminContentClientView settings={settings} packages={packages} faqs={faqs} />
      </main>
      <Footer />
    </div>
  );
}
