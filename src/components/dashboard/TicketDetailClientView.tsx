'use client';

import React, { useState, useEffect } from 'react';
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
  RefreshCw,
} from 'lucide-react';

interface TicketDetailClientProps {
  userSession: any;
  ticket: any;
}

export function TicketDetailClientView({ userSession, ticket: initialTicket }: TicketDetailClientProps) {
  const router = useRouter();
  const [ticket, setTicket] = useState(initialTicket);
  const [replyMessage, setReplyMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toast, setToast] = useState<{ type: ToastType; message: string } | null>(null);

  // Sync ticket when server revalidates props
  useEffect(() => {
    setTicket(initialTicket);
  }, [initialTicket]);

  // Automatic Live Polling for new ticket replies every 4 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      router.refresh();
    }, 4000);
    return () => clearInterval(interval);
  }, [router]);

  const handleSendReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyMessage.trim()) return;

    const messageText = replyMessage;
    setIsSubmitting(true);
    setToast(null);

    // Optimistic UI update: Render own message instantly in 0ms!
    const optimisticMsg = {
      id: 'opt-' + Date.now(),
      senderName: userSession?.name || ticket.name,
      senderEmail: userSession?.email || ticket.email,
      isFromAdmin: false,
      message: messageText,
      createdAt: new Date().toISOString(),
    };

    setTicket((prev: any) => ({
      ...prev,
      messages: [...(prev.messages || []), optimisticMsg],
    }));

    setReplyMessage('');

    const res = await addTicketMessageAction({
      ticketId: ticket.id,
      message: messageText,
      sendEmailCopy: true,
    });

    setIsSubmitting(false);

    if (res.success) {
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
      <div className="flex items-center justify-between">
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 text-xs font-mono font-bold text-gray-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Dashboard
        </Link>
        <div className="inline-flex items-center gap-1.5 text-[11px] font-mono text-gray-400">
          <RefreshCw className="w-3 h-3 text-brand-cyan animate-spin" /> Live Updates (4s)
        </div>
      </div>

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
            <p className="font-bold text-brand-pink">{ticket.category}</p>
          </div>

          <div className="p-3.5 rounded-xl bg-white/5 border border-white/5 space-y-1">
            <span className="text-gray-400 font-mono uppercase text-[10px]">Budget</span>
            <p className="font-bold text-emerald-400">{ticket.estimatedBudget || 'N/A'}</p>
          </div>

          <div className="p-3.5 rounded-xl bg-white/5 border border-white/5 space-y-1">
            <span className="text-gray-400 font-mono uppercase text-[10px]">Target Date</span>
            <p className="font-bold text-white">{ticket.startDate || 'Immediate'}</p>
          </div>
        </div>
      </div>

      {/* Messages Thread Container */}
      <div className="p-8 rounded-3xl bg-card border border-white/10 backdrop-blur-2xl shadow-2xl space-y-8">
        <h2 className="font-display text-xl font-bold text-white flex items-center gap-2">
          <MessageSquare className="w-5 h-5 text-brand-purple" /> Discussion Thread ({ticket.messages?.length || 0})
        </h2>

        <div className="space-y-6">
          {ticket.messages?.map((msg: any) => (
            <div
              key={msg.id}
              className={`p-6 rounded-2xl border transition-all ${
                msg.isFromAdmin
                  ? 'bg-brand-purple/10 border-brand-purple/30 ml-4 sm:ml-8'
                  : 'bg-white/5 border-white/10 mr-4 sm:mr-8'
              }`}
            >
              <div className="flex items-center justify-between gap-4 mb-3 pb-3 border-b border-white/5">
                <div className="flex items-center gap-2">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs ${
                      msg.isFromAdmin
                        ? 'bg-gradient-to-tr from-brand-purple to-brand-pink text-white shadow-glow'
                        : 'bg-white/10 text-gray-300'
                    }`}
                  >
                    {msg.isFromAdmin ? <Shield className="w-4 h-4" /> : <User className="w-4 h-4" />}
                  </div>
                  <div>
                    <span className="text-sm font-bold text-white block">{msg.senderName}</span>
                    {msg.isFromAdmin && (
                      <span className="text-[10px] font-mono font-bold text-brand-pink uppercase tracking-wider">
                        DarNed Official Team
                      </span>
                    )}
                  </div>
                </div>
                <span className="text-[11px] font-mono text-gray-400">{formatDate(msg.createdAt)}</span>
              </div>

              <div className="text-xs leading-relaxed text-gray-200 whitespace-pre-wrap">
                {msg.message}
              </div>
            </div>
          ))}
        </div>

        {/* Reply Form */}
        <form onSubmit={handleSendReply} className="pt-6 border-t border-white/10 space-y-4">
          <label className="text-xs font-mono font-bold text-gray-300 uppercase block">
            Post a Reply
          </label>

          <textarea
            value={replyMessage}
            onChange={(e) => setReplyMessage(e.target.value)}
            rows={4}
            placeholder="Type your reply message here..."
            className="w-full p-4 rounded-2xl bg-black/50 border border-white/10 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-brand-purple transition-all resize-none"
          />

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={isSubmitting || !replyMessage.trim()}
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-brand-purple via-brand-pink to-brand-cyan text-white font-bold text-xs hover:opacity-95 transition-all shadow-glow flex items-center gap-2 disabled:opacity-50"
            >
              {isSubmitting ? (
                <span>Sending...</span>
              ) : (
                <>
                  <span>Send Reply</span>
                  <Send className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
