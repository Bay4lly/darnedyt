import React from 'react';
import { redirect } from 'next/navigation';
import { db } from '@/lib/db';
import { getSessionUser } from '@/lib/auth';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { AdminOverviewClientView } from '@/components/admin/AdminOverviewClientView';

export default async function AdminDashboardOverviewPage() {
  const user = await getSessionUser();
  if (!user || (user.role !== 'ADMIN' && user.role !== 'SUPER_ADMIN' && user.role !== 'STAFF')) {
    redirect('/forbidden');
  }

  // Analytics Metrics
  const totalUsers = await db.user.count();
  const totalTickets = await db.ticket.count({ where: { isDeleted: false } });
  const openTickets = await db.ticket.count({ where: { status: 'OPEN', isDeleted: false } });
  const pendingTickets = await db.ticket.count({ where: { status: 'PENDING', isDeleted: false } });
  const answeredTickets = await db.ticket.count({ where: { status: 'ANSWERED', isDeleted: false } });
  const closedTickets = await db.ticket.count({ where: { status: 'CLOSED', isDeleted: false } });

  // Recent 7 days tickets count
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
  const recentWeekTickets = await db.ticket.count({
    where: {
      createdAt: { gte: sevenDaysAgo },
      isDeleted: false,
    },
  });

  const recentAuditLogs = await db.auditLog.findMany({
    take: 10,
    orderBy: { createdAt: 'desc' },
    include: { user: true },
  });

  const recentTickets = await db.ticket.findMany({
    take: 6,
    where: { isDeleted: false },
    orderBy: { createdAt: 'desc' },
  });

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col font-sans">
      <Navbar userSession={user} />
      <main className="flex-grow py-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <AdminOverviewClientView
          user={user}
          stats={{
            totalUsers,
            totalTickets,
            openTickets,
            pendingTickets,
            answeredTickets,
            closedTickets,
            recentWeekTickets,
          }}
          recentAuditLogs={recentAuditLogs}
          recentTickets={recentTickets}
        />
      </main>
      <Footer />
    </div>
  );
}
