'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { formatDate } from '@/lib/utils';
import { addTicketMessageAction } from '@/server/actions/tickets';
import { TicketStatusBadge } from '@/components/ui/TicketStatusBadge';
import { Toast, ToastType } from '@/components/ui/Toast';
import {
  ArrowLeft,
  Calendar,
  DollarSign,
  FileText,
  Mail,
  MessageSquare,
  Send,
  Shield,
  User,
} from 'lucide-react';

interface TicketDetailClientProps {
  userSession: any;
  ticket: any;
}

export function TicketDetailClientView({ userSession, ticket }: TicketDetailClientProps) {
  const router = useRouter();
  const [replyMessage, setReplyMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toast, setToast] = useState<{ type: ToastType; message: string } | null>(null);

  const handleSendReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyMessage.trim()) return;

    setIsSubmitting(true);
    setToast(null);

    const res = await addTicketMessageAction({
      ticketId: ticket.id,
      message: replyMessage,
      sendEmailCopy: true,
    });

    setIsSubmitting(false);

    if (res.success) {
      setReplyMessage('');
      setToast({ type: 'success', message: 'Reply sent successfully!' });
      router.refresh();
    } else {
      setToast({ type: 'error', message: res.error || 'Failed to send reply.' });
    }
  };

  return (
    <div className="space-y-8">
      {toast && (
        <Toast
          type={toast.type}
          message={toast.message}
          onClose={() => setToast(null)}
        />
      )}

      {/* Back Button */}
      <Link
        href="/dashboard"
        className="inline-flex items-center gap-2 text-xs font-mono font-bold text-gray-400 hover:text-white transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Dashboard
      </Link>

      {/* Ticket Overview Header Card */}
      <div className="p-8 rounded-3xl bg-card border border-white/10 backdrop-blur-2xl shadow-2xl space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-6">
          <div className="space-y-1">
            <div className="flex items-center gap-3">
              <span className="font-mono text-xl font-black text-brand-pink tracking-wider">
                {ticket.ticketNumber}
              </span>
              <TicketStatusBadge status={ticket.status} />
            </div>
            <h1 className="font-display text-2xl font-bold text-white">{ticket.subject}</h1>
          </div>

          <div className="flex items-center gap-4 text-xs font-mono text-gray-400">
            <span>Submitted: {formatDate(ticket.createdAt)}</span>
          </div>
        </div>

        {/* Details Meta Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
          <div className="p-3.5 rounded-xl bg-white/5 border border-white/5 space-y-1">
            <span className="text-gray-400 font-mono uppercase text-[10px]">Client</span>
            <p className="font-bold text-white truncate">{ticket.name}</p>
            <p className="text-gray-400 text-[11px] truncate">{ticket.email}</p>
          </div>

          <div className="p-3.5 rounded-xl bg-white/5 border border-white/5 space-y-1">
            <span className="text-gray-400 font-mono uppercase text-[10px]">Category</span>
            <p className="font-bold text-brand-cyan">{ticket.category}</p>
          </div>

          <div className="p-3.5 rounded-xl bg-white/5 border border-white/5 space-y-1">
            <span className="text-gray-400 font-mono uppercase text-[10px]">Est. Budget</span>
            <p className="font-bold text-amber-400">{ticket.estimatedBudget || 'N/A'}</p>
          </div>

          <div className="p-3.5 rounded-xl bg-white/5 border border-white/5 space-y-1">
            <span className="text-gray-400 font-mono uppercase text-[10px]">Target Start</span>
            <p className="font-bold text-indigo-300">{ticket.startDate || 'Flexible'}</p>
          </div>
        </div>
      </div>

      {/* Message History Thread */}
      <div className="space-y-6">
        <h2 className="font-display text-xl font-bold text-white flex items-center gap-2">
          <MessageSquare className="w-5 h-5 text-brand-pink" />
          Conversation Thread ({ticket.messages.length})
        </h2>

        <div className="space-y-4">
          {ticket.messages.map((msg: any) => (
            <div
              key={msg.id}
              className={`p-6 rounded-2xl border backdrop-blur-xl space-y-3 transition-all ${
                msg.isFromAdmin
                  ? 'bg-gradient-to-r from-[#170e2b] to-[#0f0f17] border-brand-purple/50 shadow-glow'
                  : 'bg-card border-white/10'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                      msg.isFromAdmin
                        ? 'bg-brand-purple text-white'
                        : 'bg-white/10 text-gray-300'
                    }`}
                  >
                    {msg.isFromAdmin ? <Shield className="w-4 h-4 text-brand-pink" /> : <User className="w-4 h-4" />}
                  </div>
                  <div>
                    <span className="text-xs font-bold text-white">
                      {msg.senderName} {msg.isFromAdmin && <span className="text-brand-pink font-mono text-[10px] uppercase ml-1">(DarNed Official)</span>}
                    </span>
                    <span className="text-[11px] text-gray-400 block font-mono">{msg.senderEmail}</span>
                  </div>
                </div>
                <span className="text-[11px] font-mono text-gray-500">
                  {formatDate(msg.createdAt)}
                </span>
              </div>

              <div className="text-xs text-gray-200 leading-relaxed whitespace-pre-wrap pt-2 border-t border-white/5">
                {msg.message}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Reply Form */}
      {ticket.status !== 'CLOSED' ? (
        <div className="p-6 rounded-3xl bg-card border border-white/10 backdrop-blur-2xl shadow-xl space-y-4">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">Send a Reply</h3>
          <form onSubmit={handleSendReply} className="space-y-4">
            <textarea
              rows={4}
              value={replyMessage}
              onChange={(e) => setReplyMessage(e.target.value)}
              placeholder="Type your response here..."
              className="w-full px-4 py-3 rounded-xl bg-black/50 border border-white/10 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-brand-purple transition-all"
            />
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={isSubmitting || !replyMessage.trim()}
                className="px-6 py-3 rounded-xl bg-gradient-to-r from-brand-purple to-brand-pink text-white font-bold text-xs hover:opacity-95 transition-all shadow-glow flex items-center gap-2 disabled:opacity-50"
              >
                {isSubmitting ? <span>Sending...</span> : <><Send className="w-4 h-4" /> Send Reply</>}
              </button>
            </div>
          </form>
        </div>
      ) : (
        <div className="p-4 rounded-xl bg-gray-500/10 border border-gray-500/20 text-center text-xs text-gray-400 font-mono">
          This ticket has been marked as CLOSED. If you have further questions, please open a new inquiry.
        </div>
      )}

    </div>
  );
}
