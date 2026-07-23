import React from 'react';
import { redirect } from 'next/navigation';
import { db } from '@/lib/db';
import { getSessionUser } from '@/lib/auth';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { AdminUsersClientView } from '@/components/admin/AdminUsersClientView';

export default async function AdminUsersPage() {
  const user = await getSessionUser();
  if (!user || (user.role !== 'ADMIN' && user.role !== 'SUPER_ADMIN' && user.role !== 'STAFF')) {
    redirect('/forbidden');
  }

  const usersList = await db.user.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      _count: {
        select: { tickets: true },
      },
    },
  });

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col font-sans">
      <Navbar userSession={user} />
      <main className="flex-grow py-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <AdminUsersClientView currentAdmin={user} users={usersList} />
      </main>
      <Footer />
    </div>
  );
}
