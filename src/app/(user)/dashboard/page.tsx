import React from 'react';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { db } from '@/lib/db';
import { getSessionUser } from '@/lib/auth';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { UserDashboardClientView } from '@/components/dashboard/UserDashboardClientView';

export default async function UserDashboardPage() {
  const user = await getSessionUser();
  if (!user) {
    redirect('/login');
  }

  // Fetch user's tickets
  const tickets = await db.ticket.findMany({
    where: {
      OR: [
        { userId: user.userId },
        { email: user.email },
      ],
      isDeleted: false,
    },
    orderBy: { createdAt: 'desc' },
    include: {
      messages: {
        take: 1,
        orderBy: { createdAt: 'desc' },
      },
    },
  });

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col font-sans">
      <Navbar userSession={user} />
      <main className="flex-grow py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <UserDashboardClientView user={user} tickets={tickets} />
      </main>
      <Footer />
    </div>
  );
}
