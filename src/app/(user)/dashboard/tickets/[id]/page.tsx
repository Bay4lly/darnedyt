import React from 'react';
import { notFound, redirect } from 'next/navigation';
import { db } from '@/lib/db';
import { getSessionUser } from '@/lib/auth';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { TicketDetailClientView } from '@/components/dashboard/TicketDetailClientView';

export default async function TicketDetailPage({ params }: { params: { id: string } }) {
  const user = await getSessionUser();
  const ticketNumber = params.id;

  const ticket = await db.ticket.findFirst({
    where: {
      ticketNumber,
      isDeleted: false,
    },
    include: {
      messages: {
        orderBy: { createdAt: 'asc' },
      },
      attachments: true,
      user: true,
    },
  });

  if (!ticket) {
    notFound();
  }

  // Authorization check
  const isAdmin = user && (user.role === 'ADMIN' || user.role === 'SUPER_ADMIN' || user.role === 'STAFF');
  if (!isAdmin) {
    if (user && ticket.userId && ticket.userId !== user.userId) {
      redirect('/dashboard');
    }
  }

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col font-sans">
      <Navbar userSession={user} />
      <main className="flex-grow py-12 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <TicketDetailClientView userSession={user} ticket={ticket} />
      </main>
      <Footer />
    </div>
  );
}
