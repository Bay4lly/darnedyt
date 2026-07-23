import React from 'react';
import { redirect } from 'next/navigation';
import { db } from '@/lib/db';
import { getSessionUser } from '@/lib/auth';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { AdminTicketsClientView } from '@/components/admin/AdminTicketsClientView';

export default async function AdminTicketsPage() {
  const user = await getSessionUser();
  if (!user || (user.role !== 'ADMIN' && user.role !== 'SUPER_ADMIN' && user.role !== 'STAFF')) {
    redirect('/forbidden');
  }

  const tickets = await db.ticket.findMany({
    where: { isDeleted: false },
    orderBy: { createdAt: 'desc' },
    include: {
      user: true,
      assignedTo: true,
      messages: {
        orderBy: { createdAt: 'asc' },
      },
      adminNotes: {
        include: { author: true },
        orderBy: { createdAt: 'desc' },
      },
    },
  });

  const staffUsers = await db.user.findMany({
    where: {
      role: { in: ['ADMIN', 'SUPER_ADMIN', 'STAFF'] },
    },
    select: { id: true, name: true, email: true, role: true },
  });

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col font-sans">
      <Navbar userSession={user} />
      <main className="flex-grow py-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <AdminTicketsClientView user={user} tickets={tickets} staffUsers={staffUsers} />
      </main>
      <Footer />
    </div>
  );
}
