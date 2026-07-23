'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useLanguage } from '@/components/providers/LanguageProvider';
import { formatDate } from '@/lib/utils';
import { TicketStatusBadge } from '@/components/ui/TicketStatusBadge';
import {
  Clock,
  ExternalLink,
  Inbox,
  LayoutDashboard,
  MessageSquare,
  PlusCircle,
  Search,
  User,
  Zap,
} from 'lucide-react';

interface UserDashboardClientProps {
  user: any;
  tickets: any[];
}

export function UserDashboardClientView({ user, tickets }: UserDashboardClientProps) {
  const { t } = useLanguage();
  const [searchTerm, setSearchTerm] = useState('');

  const filteredTickets = tickets.filter((t) =>
    t.ticketNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const openCount = tickets.filter((t) => t.status === 'OPEN' || t.status === 'IN_PROGRESS').length;
  const answeredCount = tickets.filter((t) => t.status === 'ANSWERED').length;

  return (
    <div className="space-y-10">
      
      {/* Welcome Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 p-8 rounded-3xl bg-card border border-white/10 backdrop-blur-2xl shadow-2xl">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 text-xs font-mono font-bold text-brand-pink uppercase tracking-widest">
            <LayoutDashboard className="w-4 h-4 text-brand-cyan" />
            {t.dashboard.welcome}
          </div>
          <h1 className="font-display text-3xl sm:text-4xl font-black text-white">
            Hello, {user.name} 👋
          </h1>
          <p className="text-xs text-gray-400 font-mono">
            {user.email} • {user.username}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/contact"
            className="px-5 py-3 rounded-xl bg-gradient-to-r from-brand-purple to-brand-pink text-white text-xs font-bold hover:opacity-95 transition-all shadow-glow flex items-center gap-2"
          >
            <PlusCircle className="w-4 h-4" />
            {t.dashboard.createNewTicket}
          </Link>
          <Link
            href="/dashboard/profile"
            className="px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-xs font-semibold hover:bg-white/10 transition-all flex items-center gap-2"
          >
            <User className="w-4 h-4 text-brand-cyan" />
            Profile
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="p-6 rounded-2xl bg-card border border-white/10 flex items-center justify-between">
          <div>
            <span className="text-xs font-mono text-gray-400 uppercase">Total Tickets</span>
            <div className="font-display text-3xl font-black text-white">{tickets.length}</div>
          </div>
          <div className="p-3 rounded-xl bg-purple-500/10 text-brand-purple">
            <Inbox className="w-6 h-6" />
          </div>
        </div>

        <div className="p-6 rounded-2xl bg-card border border-white/10 flex items-center justify-between">
          <div>
            <span className="text-xs font-mono text-gray-400 uppercase">Open / In Progress</span>
            <div className="font-display text-3xl font-black text-amber-400">{openCount}</div>
          </div>
          <div className="p-3 rounded-xl bg-amber-500/10 text-amber-400">
            <Clock className="w-6 h-6" />
          </div>
        </div>

        <div className="p-6 rounded-2xl bg-card border border-white/10 flex items-center justify-between">
          <div>
            <span className="text-xs font-mono text-gray-400 uppercase">Answered by Team</span>
            <div className="font-display text-3xl font-black text-emerald-400">{answeredCount}</div>
          </div>
          <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-400">
            <MessageSquare className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Tickets List */}
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h2 className="font-display text-2xl font-bold text-white">
            {t.dashboard.myTickets}
          </h2>

          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 text-gray-500 absolute left-3.5 top-3" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search tickets..."
              className="w-full pl-10 pr-4 py-2 rounded-xl bg-black/50 border border-white/10 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-brand-purple"
            />
          </div>
        </div>

        {filteredTickets.length === 0 ? (
          <div className="p-12 text-center rounded-3xl bg-card border border-white/10 space-y-4">
            <Inbox className="w-12 h-12 text-gray-600 mx-auto" />
            <p className="text-sm text-gray-400">{t.dashboard.noTickets}</p>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-brand-purple text-white text-xs font-bold"
            >
              <PlusCircle className="w-4 h-4" />
              {t.dashboard.createNewTicket}
            </Link>
          </div>
        ) : (
          <>
            {/* Desktop Table View */}
            <div className="hidden md:block overflow-x-auto rounded-2xl border border-white/10 bg-card">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-white/10 bg-black/40 text-gray-400 font-mono uppercase text-[11px]">
                    <th className="p-4">{t.dashboard.ticketNumber}</th>
                    <th className="p-4">{t.dashboard.subject}</th>
                    <th className="p-4">{t.dashboard.category}</th>
                    <th className="p-4">{t.dashboard.status}</th>
                    <th className="p-4">{t.dashboard.date}</th>
                    <th className="p-4 text-right">{t.dashboard.actions}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 text-gray-300">
                  {filteredTickets.map((ticket) => (
                    <tr key={ticket.id} className="hover:bg-white/5 transition-colors">
                      <td className="p-4 font-mono font-bold text-brand-pink">
                        {ticket.ticketNumber}
                      </td>
                      <td className="p-4 font-semibold text-white max-w-xs truncate">
                        {ticket.subject}
                      </td>
                      <td className="p-4 font-mono text-gray-400">
                        {ticket.category}
                      </td>
                      <td className="p-4">
                        <TicketStatusBadge status={ticket.status} />
                      </td>
                      <td className="p-4 font-mono text-gray-500">
                        {formatDate(ticket.createdAt)}
                      </td>
                      <td className="p-4 text-right">
                        <Link
                          href={`/dashboard/tickets/${ticket.ticketNumber}`}
                          className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white font-semibold inline-flex items-center gap-1"
                        >
                          View <ExternalLink className="w-3.5 h-3.5 text-brand-cyan" />
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Cards View */}
            <div className="md:hidden space-y-4">
              {filteredTickets.map((ticket) => (
                <div key={ticket.id} className="p-5 rounded-2xl border border-white/10 bg-card space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-bold text-brand-pink text-xs">
                      {ticket.ticketNumber}
                    </span>
                    <TicketStatusBadge status={ticket.status} />
                  </div>
                  <h3 className="text-sm font-bold text-white">{ticket.subject}</h3>
                  <div className="flex items-center justify-between text-[11px] font-mono text-gray-400">
                    <span>Category: {ticket.category}</span>
                    <span>{formatDate(ticket.createdAt)}</span>
                  </div>
                  <Link
                    href={`/dashboard/tickets/${ticket.ticketNumber}`}
                    className="w-full py-2 rounded-xl bg-white/10 text-white text-xs font-semibold flex items-center justify-center gap-1.5"
                  >
                    View Ticket Conversation <ExternalLink className="w-3.5 h-3.5 text-brand-cyan" />
                  </Link>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

    </div>
  );
}
