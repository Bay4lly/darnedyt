'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { formatDate } from '@/lib/utils';
import { addTicketMessageAction, softDeleteTicketAction, updateAdminTicketAction } from '@/server/actions/tickets';
import { TicketStatusBadge } from '@/components/ui/TicketStatusBadge';
import { Toast, ToastType } from '@/components/ui/Toast';
import { ConfirmModal } from '@/components/ui/ConfirmModal';
import {
  AlertCircle,
  CheckCircle2,
  Filter,
  Mail,
  MessageSquare,
  Search,
  Send,
  Shield,
  Trash2,
  User,
  X,
  RefreshCw,
} from 'lucide-react';

interface AdminTicketsClientProps {
  user: any;
  tickets: any[];
  staffUsers: any[];
}

export function AdminTicketsClientView({ user, tickets, staffUsers }: AdminTicketsClientProps) {
  const router = useRouter();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');
  const [selectedPriority, setSelectedPriority] = useState<string>('ALL');
  
  const [activeTicket, setActiveTicket] = useState<any | null>(null);
  const [adminReply, setAdminReply] = useState('');
  const [sendEmailCopy, setSendEmailCopy] = useState(true);
  const [adminNote, setAdminNote] = useState('');

  const [deleteConfirmTicketId, setDeleteConfirmTicketId] = useState<string | null>(null);
  const [toast, setToast] = useState<{ type: ToastType; message: string } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Auto Live Polling for Admin Tickets every 4 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      router.refresh();
    }, 4000);
    return () => clearInterval(interval);
  }, [router]);

  // Keep active ticket synchronized when router refreshes
  useEffect(() => {
    if (activeTicket) {
      const freshTicket = tickets.find((t) => t.id === activeTicket.id);
      if (freshTicket) {
        setActiveTicket(freshTicket);
      }
    }
  }, [tickets]);

  // Filtered tickets
  const filteredTickets = tickets.filter((t) => {
    const matchesSearch =
      t.ticketNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.email.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = selectedStatus === 'ALL' || t.status === selectedStatus;
    const matchesPriority = selectedPriority === 'ALL' || t.priority === selectedPriority;

    return matchesSearch && matchesStatus && matchesPriority;
  });

  const handleUpdateStatusAndPriority = async (ticketId: string, status: string, priority: string, assignedToId?: string) => {
    setIsSubmitting(true);
    const res = await updateAdminTicketAction({
      ticketId,
      status,
      priority,
      assignedToId,
      adminNote,
    });
    setIsSubmitting(false);

    if (res.success) {
      setToast({ type: 'success', message: 'Ticket settings updated' });
      setAdminNote('');
      router.refresh();
    } else {
      setToast({ type: 'error', message: res.error || 'Update failed' });
    }
  };

  const handleSendAdminReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeTicket || !adminReply.trim()) return;

    const replyText = adminReply;
    setIsSubmitting(true);

    // Optimistic UI update: show message in modal instantly (0ms)
    const optimisticMessage = {
      id: 'opt-' + Date.now(),
      senderName: user?.name || 'DarNed Official',
      senderEmail: user?.email || 'admin@darned.yt',
      isFromAdmin: true,
      message: replyText,
      createdAt: new Date().toISOString(),
    };

    setActiveTicket((prev: any) => ({
      ...prev,
      status: 'ANSWERED',
      messages: [...(prev.messages || []), optimisticMessage],
    }));

    setAdminReply('');

    const res = await addTicketMessageAction({
      ticketId: activeTicket.id,
      message: replyText,
      sendEmailCopy,
    });

    setIsSubmitting(false);

    if (res.success) {
      setToast({ type: 'success', message: 'Admin reply dispatched successfully!' });
      router.refresh();
    } else {
      setToast({ type: 'error', message: res.error || 'Failed to send reply' });
    }
  };

  const handleSoftDelete = async () => {
    if (!deleteConfirmTicketId) return;
    const res = await softDeleteTicketAction(deleteConfirmTicketId);
    setDeleteConfirmTicketId(null);
    if (res.success) {
      setToast({ type: 'success', message: 'Ticket moved to trash.' });
      if (activeTicket?.id === deleteConfirmTicketId) setActiveTicket(null);
      router.refresh();
    } else {
      setToast({ type: 'error', message: res.error || 'Failed to delete ticket.' });
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

      <ConfirmModal
        isOpen={Boolean(deleteConfirmTicketId)}
        title="Delete Ticket Inquiries?"
        description="Are you sure you want to delete this ticket? This action moves the inquiry to trash."
        confirmText="Yes, Delete Ticket"
        isDestructive={true}
        onConfirm={handleSoftDelete}
        onCancel={() => setDeleteConfirmTicketId(null)}
      />

      {/* Header & Filter Controls */}
      <div className="p-8 rounded-3xl bg-card border border-white/10 backdrop-blur-2xl shadow-2xl space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="font-display text-3xl font-black text-white">Inquiry Ticket Triage</h1>
            <p className="text-xs text-gray-400">Manage, reply to, assign, and audit client requests.</p>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs font-mono text-gray-400 flex items-center gap-1.5">
              <RefreshCw className="w-3 h-3 text-brand-pink animate-spin" /> Live Updates (4s)
            </span>
            <span className="text-xs font-mono px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-gray-300">
              Showing {filteredTickets.length} of {tickets.length} Tickets
            </span>
          </div>
        </div>

        {/* Filters Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
          <div className="relative">
            <Search className="w-4 h-4 text-gray-500 absolute left-3.5 top-3" />
            <input
              type="text"
              placeholder="Search by ticket #, subject, client..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-black/50 border border-white/10 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-brand-purple"
            />
          </div>

          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl bg-black/50 border border-white/10 text-xs text-white focus:outline-none focus:border-brand-purple"
          >
            <option value="ALL">All Statuses</option>
            <option value="OPEN">Open</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="ANSWERED">Answered</option>
            <option value="CLOSED">Closed</option>
            <option value="SPAM">Spam</option>
          </select>

          <select
            value={selectedPriority}
            onChange={(e) => setSelectedPriority(e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl bg-black/50 border border-white/10 text-xs text-white focus:outline-none focus:border-brand-purple"
          >
            <option value="ALL">All Priorities</option>
            <option value="URGENT">Urgent</option>
            <option value="HIGH">High</option>
            <option value="NORMAL">Normal</option>
            <option value="LOW">Low</option>
          </select>
        </div>
      </div>

      {/* Tickets List Table */}
      <div className="rounded-3xl bg-card border border-white/10 overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-white/10 bg-white/5 font-mono text-gray-400 uppercase text-[10px]">
                <th className="p-4">Ticket #</th>
                <th className="p-4">Client</th>
                <th className="p-4">Subject</th>
                <th className="p-4">Status</th>
                <th className="p-4">Priority</th>
                <th className="p-4">Date</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredTickets.map((t) => (
                <tr key={t.id} className="hover:bg-white/[0.02] transition-colors">
                  <td className="p-4 font-mono font-bold text-brand-pink">{t.ticketNumber}</td>
                  <td className="p-4">
                    <span className="font-bold text-white block">{t.name}</span>
                    <span className="text-gray-400 text-[11px]">{t.email}</span>
                  </td>
                  <td className="p-4 font-medium text-gray-200 max-w-xs truncate">{t.subject}</td>
                  <td className="p-4">
                    <TicketStatusBadge status={t.status} />
                  </td>
                  <td className="p-4 font-mono uppercase font-bold text-[10px]">
                    <span
                      className={`px-2 py-0.5 rounded ${
                        t.priority === 'URGENT'
                          ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                          : t.priority === 'HIGH'
                          ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                          : 'bg-gray-500/20 text-gray-300'
                      }`}
                    >
                      {t.priority}
                    </span>
                  </td>
                  <td className="p-4 font-mono text-gray-400">{formatDate(t.createdAt)}</td>
                  <td className="p-4 text-right space-x-2">
                    <button
                      onClick={() => setActiveTicket(t)}
                      className="px-3 py-1.5 rounded-lg bg-brand-purple/20 text-brand-purple border border-brand-purple/40 hover:bg-brand-purple/30 font-bold transition-all"
                    >
                      Manage & Reply
                    </button>
                    <button
                      onClick={() => setDeleteConfirmTicketId(t.id)}
                      className="p-1.5 rounded-lg bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 transition-all"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
              {filteredTickets.length === 0 && (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-gray-400 font-mono">
                    No tickets match the selected filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Ticket Reply Modal */}
      {activeTicket && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-4xl max-h-[90vh] bg-[#0c0c14] border border-white/15 rounded-3xl overflow-hidden flex flex-col shadow-2xl">
            
            {/* Modal Header */}
            <div className="p-6 bg-white/5 border-b border-white/10 flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-brand-pink text-base">
                    {activeTicket.ticketNumber}
                  </span>
                  <TicketStatusBadge status={activeTicket.status} />
                </div>
                <h2 className="font-display font-bold text-lg text-white">{activeTicket.subject}</h2>
              </div>
              <button
                onClick={() => setActiveTicket(null)}
                className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-gray-300 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 overflow-y-auto space-y-6 flex-grow">
              
              {/* Client Info Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                <div className="p-3 rounded-xl bg-white/5 border border-white/5">
                  <span className="text-gray-400 text-[10px] uppercase font-mono block">Client</span>
                  <span className="font-bold text-white">{activeTicket.name}</span>
                </div>
                <div className="p-3 rounded-xl bg-white/5 border border-white/5">
                  <span className="text-gray-400 text-[10px] uppercase font-mono block">Email</span>
                  <span className="font-bold text-white truncate block">{activeTicket.email}</span>
                </div>
                <div className="p-3 rounded-xl bg-white/5 border border-white/5">
                  <span className="text-gray-400 text-[10px] uppercase font-mono block">Budget</span>
                  <span className="font-bold text-emerald-400">{activeTicket.estimatedBudget || 'N/A'}</span>
                </div>
                <div className="p-3 rounded-xl bg-white/5 border border-white/5">
                  <span className="text-gray-400 text-[10px] uppercase font-mono block">Category</span>
                  <span className="font-bold text-brand-cyan">{activeTicket.category}</span>
                </div>
              </div>

              {/* Status & Assignment Triage Form */}
              <div className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-3">
                <span className="text-xs font-mono font-bold text-gray-300 uppercase block">
                  Quick Triage Controls
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="text-[10px] text-gray-400 font-mono uppercase block mb-1">Status</label>
                    <select
                      value={activeTicket.status}
                      onChange={(e) =>
                        handleUpdateStatusAndPriority(activeTicket.id, e.target.value, activeTicket.priority, activeTicket.assignedToId)
                      }
                      className="w-full px-3 py-2 rounded-lg bg-black/60 border border-white/10 text-xs text-white"
                    >
                      <option value="OPEN">Open</option>
                      <option value="IN_PROGRESS">In Progress</option>
                      <option value="ANSWERED">Answered</option>
                      <option value="CLOSED">Closed</option>
                      <option value="SPAM">Spam</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-[10px] text-gray-400 font-mono uppercase block mb-1">Priority</label>
                    <select
                      value={activeTicket.priority}
                      onChange={(e) =>
                        handleUpdateStatusAndPriority(activeTicket.id, activeTicket.status, e.target.value, activeTicket.assignedToId)
                      }
                      className="w-full px-3 py-2 rounded-lg bg-black/60 border border-white/10 text-xs text-white"
                    >
                      <option value="URGENT">Urgent</option>
                      <option value="HIGH">High</option>
                      <option value="NORMAL">Normal</option>
                      <option value="LOW">Low</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-[10px] text-gray-400 font-mono uppercase block mb-1">Assigned Staff</label>
                    <select
                      value={activeTicket.assignedToId || ''}
                      onChange={(e) =>
                        handleUpdateStatusAndPriority(activeTicket.id, activeTicket.status, activeTicket.priority, e.target.value)
                      }
                      className="w-full px-3 py-2 rounded-lg bg-black/60 border border-white/10 text-xs text-white"
                    >
                      <option value="">Unassigned</option>
                      {staffUsers.map((s) => (
                        <option key={s.id} value={s.id}>
                          {s.name} ({s.role})
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Messages Thread */}
              <div className="space-y-4">
                <h3 className="text-xs font-mono font-bold text-gray-300 uppercase">
                  Conversation Thread ({activeTicket.messages?.length || 0})
                </h3>

                <div className="space-y-4">
                  {activeTicket.messages?.map((msg: any) => (
                    <div
                      key={msg.id}
                      className={`p-4 rounded-xl border text-xs ${
                        msg.isFromAdmin
                          ? 'bg-brand-purple/10 border-brand-purple/30 ml-4'
                          : 'bg-white/5 border-white/10 mr-4'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2 pb-2 border-b border-white/5">
                        <span className="font-bold text-white">{msg.senderName} ({msg.senderEmail})</span>
                        <span className="font-mono text-[10px] text-gray-400">{formatDate(msg.createdAt)}</span>
                      </div>
                      <p className="leading-relaxed text-gray-200 whitespace-pre-wrap">{msg.message}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Reply Form */}
              <form onSubmit={handleSendAdminReply} className="space-y-3 pt-4 border-t border-white/10">
                <label className="text-xs font-mono font-bold text-gray-300 uppercase block">
                  Send Response to Client
                </label>
                <textarea
                  value={adminReply}
                  onChange={(e) => setAdminReply(e.target.value)}
                  rows={3}
                  placeholder="Type your official response to the partner/client..."
                  className="w-full p-3.5 rounded-xl bg-black/50 border border-white/10 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-brand-purple resize-none"
                />

                <div className="flex items-center justify-between">
                  <label className="flex items-center gap-2 text-xs text-gray-400 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={sendEmailCopy}
                      onChange={(e) => setSendEmailCopy(e.target.checked)}
                      className="rounded border-white/20 bg-black/50 text-brand-purple focus:ring-brand-purple"
                    />
                    <span>Send copy to client email ({activeTicket.email})</span>
                  </label>

                  <button
                    type="submit"
                    disabled={isSubmitting || !adminReply.trim()}
                    className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-brand-purple via-brand-pink to-brand-cyan text-white font-bold text-xs hover:opacity-95 transition-all shadow-glow flex items-center gap-2 disabled:opacity-50"
                  >
                    {isSubmitting ? <span>Dispatching...</span> : <span>Send Reply</span>}
                    <Send className="w-3.5 h-3.5" />
                  </button>
                </div>
              </form>

            </div>

          </div>
        </div>
      )}

    </div>
  );
}
