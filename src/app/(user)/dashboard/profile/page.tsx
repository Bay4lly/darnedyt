import React from 'react';
import { redirect } from 'next/navigation';
import { db } from '@/lib/db';
import { getSessionUser } from '@/lib/auth';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { ProfileClientView } from '@/components/dashboard/ProfileClientView';

export default async function ProfilePage() {
  const userSession = await getSessionUser();
  if (!userSession) redirect('/login');

  const user = await db.user.findUnique({
    where: { id: userSession.userId },
  });

  if (!user) redirect('/login');

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col font-sans">
      <Navbar userSession={userSession} />
      <main className="flex-grow py-12 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <ProfileClientView user={user} />
      </main>
      <Footer />
    </div>
  );
}
