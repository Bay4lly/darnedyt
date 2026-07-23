import React from 'react';
import { TicketStatus } from '@/types';

export function TicketStatusBadge({ status }: { status: TicketStatus | string }) {
  const styles: Record<string, string> = {
    OPEN: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
    PENDING: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
    IN_PROGRESS: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30',
    ANSWERED: 'bg-purple-500/10 text-purple-300 border-purple-500/30',
    CLOSED: 'bg-gray-500/10 text-gray-400 border-gray-500/30',
    SPAM: 'bg-rose-500/10 text-rose-400 border-rose-500/30',
  };

  const styleClass = styles[status] || styles.OPEN;

  return (
    <span className={`px-2.5 py-1 rounded-md border text-[10px] font-mono font-bold uppercase tracking-wider ${styleClass}`}>
      {status}
    </span>
  );
}
