'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { formatDate } from '@/lib/utils';
import { TicketStatusBadge } from '@/components/ui/TicketStatusBadge';
import {
  Activity,
  CheckCircle2,
  Clock,
  FileEdit,
  Inbox,
  LayoutDashboard,
  Mail,
  MessageSquare,
  Shield,
  Ticket,
  Users,
  Zap,
} from 'lucide-react';

interface AdminOverviewClientProps {
  user: any;
  stats: {
    totalUsers: number;
    totalTickets: number;
    openTickets: number;
    pendingTickets: number;
    answeredTickets: number;
    closedTickets: number;
    recentWeekTickets: number;
  };
  recentAuditLogs: any[];
  recentTickets: any[];
}

export function AdminOverviewClientView({ user, stats, recentAuditLogs, recentTickets }: AdminOverviewClientProps) {
  const pathname = usePathname();

  const adminNav = [
    { href: '/admin', label: 'Overview', icon: LayoutDashboard },
    { href: '/admin/tickets', label: 'Tickets Triage', icon: Ticket },
    { href: '/admin/users', label: 'Users', icon: Users },
    { href: '/admin/content', label: 'Site Content', icon: FileEdit },
    { href: '/admin/emails', label: 'Email Center', icon: Mail },
  ];

  return (
    <div className="space-y-10">
      
      {/* Admin Navigation Bar */}
      <div className="flex items-center gap-2 overflow-x-auto p-1.5 rounded-2xl bg-card border border-white/10 backdrop-blur-xl">
        {adminNav.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                isActive
                  ? 'bg-gradient-to-r from-brand-purple to-brand-pink text-white shadow-glow'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </div>

      {/* Header Banner */}
      <div className="p-8 rounded-3xl bg-card border border-brand-purple/40 backdrop-blur-2xl shadow-glow flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 text-xs font-mono font-bold text-brand-pink uppercase tracking-widest mb-1">
            <Shield className="w-4 h-4 text-brand-cyan" />
            Admin Command Center
          </div>
          <h1 className="font-display text-3xl font-black text-white">System Analytics & Controls</h1>
        </div>
        <div className="flex items-center gap-2 text-xs font-mono px-3.5 py-2 rounded-xl bg-white/5 border border-white/10 text-emerald-400">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          Server Status: Operational
        </div>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="p-6 rounded-2xl bg-card border border-white/10 space-y-2">
          <div className="flex items-center justify-between text-gray-400 text-xs font-mono">
            <span>Total Registered Users</span>
            <Users className="w-4 h-4 text-brand-purple" />
          </div>
          <div className="font-display text-3xl font-black text-white">{stats.totalUsers}</div>
        </div>

        <div className="p-6 rounded-2xl bg-card border border-white/10 space-y-2">
          <div className="flex items-center justify-between text-gray-400 text-xs font-mono">
            <span>Total Inquiries</span>
            <Inbox className="w-4 h-4 text-brand-pink" />
          </div>
          <div className="font-display text-3xl font-black text-white">{stats.totalTickets}</div>
          <div className="text-[11px] font-mono text-brand-cyan">+{stats.recentWeekTickets} last 7 days</div>
        </div>

        <div className="p-6 rounded-2xl bg-card border border-white/10 space-y-2">
          <div className="flex items-center justify-between text-gray-400 text-xs font-mono">
            <span>Open Tickets</span>
            <Clock className="w-4 h-4 text-amber-400" />
          </div>
          <div className="font-display text-3xl font-black text-amber-400">{stats.openTickets}</div>
        </div>

        <div className="p-6 rounded-2xl bg-card border border-white/10 space-y-2">
          <div className="flex items-center justify-between text-gray-400 text-xs font-mono">
            <span>Answered Inquiries</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="font-display text-3xl font-black text-emerald-400">{stats.answeredTickets}</div>
        </div>
      </div>

      {/* Main Two-Column Activity Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Recent Tickets List */}
        <div className="lg:col-span-7 p-6 rounded-3xl bg-card border border-white/10 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-display text-lg font-bold text-white flex items-center gap-2">
              <Ticket className="w-5 h-5 text-brand-pink" />
              Latest Inquiries
            </h3>
            <Link href="/admin/tickets" className="text-xs font-mono text-brand-cyan hover:underline">
              View All
            </Link>
          </div>

          <div className="space-y-3">
            {recentTickets.map((t) => (
              <div key={t.id} className="p-4 rounded-xl bg-white/5 border border-white/5 flex items-center justify-between gap-4">
                <div className="space-y-1 truncate">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-brand-pink text-xs">{t.ticketNumber}</span>
                    <TicketStatusBadge status={t.status} />
                  </div>
                  <p className="text-xs font-semibold text-white truncate">{t.subject}</p>
                  <p className="text-[11px] text-gray-400 font-mono">{t.name} ({t.email})</p>
                </div>
                <Link
                  href="/admin/tickets"
                  className="px-3 py-1.5 rounded-lg bg-white/10 text-xs font-semibold text-white hover:bg-white/20 whitespace-nowrap"
                >
                  Manage
                </Link>
              </div>
            ))}
          </div>
        </div>

        {/* Audit Log Activity */}
        <div className="lg:col-span-5 p-6 rounded-3xl bg-card border border-white/10 space-y-4">
          <h3 className="font-display text-lg font-bold text-white flex items-center gap-2">
            <Activity className="w-5 h-5 text-brand-cyan" />
            Audit Logs
          </h3>

          <div className="space-y-3 max-h-96 overflow-y-auto pr-1">
            {recentAuditLogs.map((log) => (
              <div key={log.id} className="p-3 rounded-xl bg-black/40 border border-white/5 text-xs space-y-1">
                <div className="flex items-center justify-between text-gray-400 font-mono text-[10px]">
                  <span className="text-brand-pink font-bold">{log.action}</span>
                  <span>{formatDate(log.createdAt)}</span>
                </div>
                <p className="text-gray-300 text-[11px]">{log.details}</p>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
}
