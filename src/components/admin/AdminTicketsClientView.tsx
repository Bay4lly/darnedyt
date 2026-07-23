'use client';

import React, { useState } from 'react';
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

    setIsSubmitting(true);
    const res = await addTicketMessageAction({
      ticketId: activeTicket.id,
      message: adminReply,
      sendEmailCopy,
    });
    setIsSubmitting(false);

    if (res.success) {
      setAdminReply('');
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
          <span className="text-xs font-mono px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-gray-300">
            Showing {filteredTickets.length} of {tickets.length} Tickets
          </span>
        </div>

        {/* Filters Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
          <div className="relative">
            <Search className="w-4 h-4 text-gray-500 absolute left-3.5 top-3" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by ticket #, subject, email..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-black/50 border border-white/10 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-brand-purple"
            />
          </div>

          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl bg-[#0c0c14] border border-white/10 text-xs text-white focus:outline-none"
          >
            <option value="ALL">All Statuses</option>
            <option value="OPEN">OPEN</option>
            <option value="PENDING">PENDING</option>
            <option value="IN_PROGRESS">IN_PROGRESS</option>
            <option value="ANSWERED">ANSWERED</option>
            <option value="CLOSED">CLOSED</option>
            <option value="SPAM">SPAM</option>
          </select>

          <select
            value={selectedPriority}
            onChange={(e) => setSelectedPriority(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl bg-[#0c0c14] border border-white/10 text-xs text-white focus:outline-none"
          >
            <option value="ALL">All Priorities</option>
            <option value="LOW">LOW</option>
            <option value="NORMAL">NORMAL</option>
            <option value="HIGH">HIGH</option>
            <option value="URGENT">URGENT</option>
          </select>
        </div>
      </div>

      {/* Tickets Table */}
      <div className="overflow-x-auto rounded-3xl border border-white/10 bg-card">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="border-b border-white/10 bg-black/40 text-gray-400 font-mono uppercase text-[11px]">
              <th className="p-4">Ticket #</th>
              <th className="p-4">Client</th>
              <th className="p-4">Category & Subject</th>
              <th className="p-4">Status</th>
              <th className="p-4">Priority</th>
              <th className="p-4">Submitted</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5 text-gray-300">
            {filteredTickets.map((t) => (
              <tr key={t.id} className="hover:bg-white/5 transition-colors">
                <td className="p-4 font-mono font-bold text-brand-pink">{t.ticketNumber}</td>
                <td className="p-4">
                  <div className="font-bold text-white">{t.name}</div>
                  <div className="text-[11px] font-mono text-gray-400">{t.email}</div>
                </td>
                <td className="p-4 max-w-xs">
                  <span className="text-[10px] font-mono uppercase text-brand-cyan font-bold block">{t.category}</span>
                  <span className="font-semibold text-white truncate block">{t.subject}</span>
                </td>
                <td className="p-4"><TicketStatusBadge status={t.status} /></td>
                <td className="p-4 font-mono text-xs font-bold text-amber-400">{t.priority}</td>
                <td className="p-4 font-mono text-gray-500">{formatDate(t.createdAt)}</td>
                <td className="p-4 text-right flex items-center justify-end gap-2">
                  <button
                    onClick={() => setActiveTicket(t)}
                    className="px-3 py-1.5 rounded-lg bg-brand-purple/20 border border-brand-purple/40 text-brand-pink font-semibold hover:bg-brand-purple/30"
                  >
                    Open Triage
                  </button>
                  <button
                    onClick={() => setDeleteConfirmTicketId(t.id)}
                    className="p-1.5 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20"
                    title="Delete Ticket"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Ticket Drawer Modal */}
      {activeTicket && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="w-full max-w-4xl max-h-[90vh] bg-[#0f0f17] border border-white/10 rounded-3xl p-6 shadow-2xl flex flex-col space-y-6 overflow-y-auto">
            
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div className="space-y-1">
                <span className="font-mono text-xl font-bold text-brand-pink">{activeTicket.ticketNumber}</span>
                <h3 className="text-lg font-bold text-white">{activeTicket.subject}</h3>
              </div>
              <button onClick={() => setActiveTicket(null)} className="text-gray-400 hover:text-white p-2">
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Quick Status Control */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 rounded-2xl bg-black/40 border border-white/5">
              <div>
                <label className="text-[10px] font-mono text-gray-400 uppercase block mb-1">Status</label>
                <select
                  value={activeTicket.status}
                  onChange={(e) => {
                    handleUpdateStatusAndPriority(activeTicket.id, e.target.value, activeTicket.priority, activeTicket.assignedToId);
                    setActiveTicket({ ...activeTicket, status: e.target.value });
                  }}
                  className="w-full px-3 py-1.5 rounded-lg bg-[#0c0c14] border border-white/10 text-xs text-white"
                >
                  <option value="OPEN">OPEN</option>
                  <option value="PENDING">PENDING</option>
                  <option value="IN_PROGRESS">IN_PROGRESS</option>
                  <option value="ANSWERED">ANSWERED</option>
                  <option value="CLOSED">CLOSED</option>
                  <option value="SPAM">SPAM</option>
                </select>
              </div>

              <div>
                <label className="text-[10px] font-mono text-gray-400 uppercase block mb-1">Priority</label>
                <select
                  value={activeTicket.priority}
                  onChange={(e) => {
                    handleUpdateStatusAndPriority(activeTicket.id, activeTicket.status, e.target.value, activeTicket.assignedToId);
                    setActiveTicket({ ...activeTicket, priority: e.target.value });
                  }}
                  className="w-full px-3 py-1.5 rounded-lg bg-[#0c0c14] border border-white/10 text-xs text-white"
                >
                  <option value="LOW">LOW</option>
                  <option value="NORMAL">NORMAL</option>
                  <option value="HIGH">HIGH</option>
                  <option value="URGENT">URGENT</option>
                </select>
              </div>

              <div>
                <label className="text-[10px] font-mono text-gray-400 uppercase block mb-1">Assigned Admin</label>
                <select
                  value={activeTicket.assignedToId || ''}
                  onChange={(e) => {
                    handleUpdateStatusAndPriority(activeTicket.id, activeTicket.status, activeTicket.priority, e.target.value);
                    setActiveTicket({ ...activeTicket, assignedToId: e.target.value });
                  }}
                  className="w-full px-3 py-1.5 rounded-lg bg-[#0c0c14] border border-white/10 text-xs text-white"
                >
                  <option value="">Unassigned</option>
                  {staffUsers.map((staff) => (
                    <option key={staff.id} value={staff.id}>{staff.name} ({staff.role})</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Conversation Thread */}
            <div className="space-y-4">
              <h4 className="text-xs font-mono font-bold text-gray-400 uppercase">Message History</h4>
              <div className="space-y-3 max-h-60 overflow-y-auto">
                {activeTicket.messages?.map((msg: any) => (
                  <div
                    key={msg.id}
                    className={`p-4 rounded-xl text-xs space-y-2 ${
                      msg.isFromAdmin ? 'bg-brand-purple/10 border border-brand-purple/30' : 'bg-black/50 border border-white/10'
                    }`}
                  >
                    <div className="flex items-center justify-between text-gray-400 font-mono text-[11px]">
                      <span className="font-bold text-white">{msg.senderName} ({msg.senderEmail})</span>
                      <span>{formatDate(msg.createdAt)}</span>
                    </div>
                    <p className="text-gray-200 whitespace-pre-wrap">{msg.message}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Admin Response Form */}
            <form onSubmit={handleSendAdminReply} className="space-y-4 pt-2 border-t border-white/10">
              <label className="text-xs font-mono font-bold text-brand-pink uppercase block">Send Admin Response</label>
              <textarea
                rows={3}
                value={adminReply}
                onChange={(e) => setAdminReply(e.target.value)}
                placeholder="Write official response..."
                className="w-full px-4 py-3 rounded-xl bg-black/50 border border-white/10 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-brand-purple"
              />
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 cursor-pointer text-xs text-gray-300">
                  <input
                    type="checkbox"
                    checked={sendEmailCopy}
                    onChange={(e) => setSendEmailCopy(e.target.checked)}
                    className="w-4 h-4 rounded border-white/20 bg-black text-brand-purple"
                  />
                  <span>Dispatch response copy directly to client via Email</span>
                </label>
                <button
                  type="submit"
                  disabled={isSubmitting || !adminReply.trim()}
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-brand-purple to-brand-pink text-white font-bold text-xs shadow-glow flex items-center gap-2"
                >
                  <Send className="w-4 h-4" /> Send Response
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

    </div>
  );
}
