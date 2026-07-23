'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { formatDate } from '@/lib/utils';
import { sendDirectEmailAction } from '@/server/actions/admin';
import { Toast, ToastType } from '@/components/ui/Toast';
import { AlertCircle, CheckCircle2, Mail, Send, XCircle, ShieldAlert } from 'lucide-react';

export function AdminEmailsClientView({ logs }: { logs: any[] }) {
  const router = useRouter();

  const [recipient, setRecipient] = useState('');
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');
  const [isHtml, setIsHtml] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toast, setToast] = useState<{ type: ToastType; message: string } | null>(null);

  // Bulk Email State (Disabled by default for safety)
  const [bulkModeEnabled, setBulkModeEnabled] = useState(false);

  const handleSendEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!recipient || !subject || !body) return;

    setIsSubmitting(true);
    setToast(null);

    const res = await sendDirectEmailAction({
      recipient,
      subject,
      body,
      isHtml,
    });

    setIsSubmitting(false);

    if (res.success) {
      setToast({ type: 'success', message: 'Email dispatched successfully!' });
      setRecipient('');
      setSubject('');
      setBody('');
      router.refresh();
    } else {
      setToast({ type: 'error', message: res.error || 'Failed to dispatch email' });
    }
  };

  const applyTemplate = (templateName: string) => {
    if (templateName === 'sponsorship_inquiry_followup') {
      setSubject('Follow-up regarding your Sponsorship Inquiry with DarNed');
      setBody(`
        <h2>Hello,</h2>
        <p>Thank you for reaching out to the <strong>DarNed Official Sponsorship Team</strong>.</p>
        <p>We reviewed your proposal and are excited to discuss campaign dates, deliverables, and customized integration options.</p>
        <p>Please let us know your preferred meeting schedule or response details.</p>
        <p>Best regards,<br>DarNed Team</p>
      `);
    } else if (templateName === 'campaign_completion_report') {
      setSubject('Campaign Performance & Analytics Report - DarNed');
      setBody(`
        <h2>Campaign Performance Report</h2>
        <p>Hello,</p>
        <p>Your sponsored YouTube video / Short integration has been live for 7 days! Here is a summary of performance metrics:</p>
        <ul>
          <li><strong>Total Views:</strong> 250,000+</li>
          <li><strong>CTR:</strong> 4.8%</li>
          <li><strong>Total Link Clicks:</strong> 12,000+</li>
        </ul>
        <p>Thank you for collaborating with DarNed!</p>
      `);
    }
  };

  return (
    <div className="space-y-10">
      {toast && (
        <Toast
          type={toast.type}
          message={toast.message}
          onClose={() => setToast(null)}
        />
      )}

      {/* Header */}
      <div className="p-8 rounded-3xl bg-card border border-white/10 backdrop-blur-2xl shadow-2xl space-y-2">
        <h1 className="font-display text-3xl font-black text-white">Transactional Email Dispatch Center</h1>
        <p className="text-xs text-gray-400">Dispatch direct emails to sponsors, apply templates, and view delivery logbooks.</p>
      </div>

      {/* Two Column Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Email Composer Form */}
        <div className="lg:col-span-7 p-8 rounded-3xl bg-card border border-white/10 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-xl font-bold text-white flex items-center gap-2">
              <Mail className="w-5 h-5 text-brand-pink" />
              Compose Email
            </h2>

            {/* Template Selector */}
            <select
              onChange={(e) => applyTemplate(e.target.value)}
              className="px-3 py-1.5 rounded-xl bg-[#0c0c14] border border-white/10 text-xs text-brand-cyan font-bold"
            >
              <option value="">Load Preset Template...</option>
              <option value="sponsorship_inquiry_followup">Sponsorship Follow-up</option>
              <option value="campaign_completion_report">Analytics Report</option>
            </select>
          </div>

          <form onSubmit={handleSendEmail} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-mono font-bold text-gray-300 uppercase">Recipient Email</label>
              <input
                type="email"
                value={recipient}
                onChange={(e) => setRecipient(e.target.value)}
                placeholder="client@brand.com"
                required
                className="w-full px-4 py-3 rounded-xl bg-black/50 border border-white/10 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-brand-purple"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-mono font-bold text-gray-300 uppercase">Subject Line</label>
              <input
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="Campaign Proposal Updates"
                required
                className="w-full px-4 py-3 rounded-xl bg-black/50 border border-white/10 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-brand-purple"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-mono font-bold text-gray-300 uppercase">Email Content Body</label>
              <textarea
                rows={7}
                value={body}
                onChange={(e) => setBody(e.target.value)}
                placeholder="Write your email body HTML or text..."
                required
                className="w-full px-4 py-3 rounded-xl bg-black/50 border border-white/10 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-brand-purple font-mono"
              />
            </div>

            {/* Bulk Mail Protection Banner */}
            <div className="p-4 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs text-gray-300">
                <ShieldAlert className="w-4 h-4 text-amber-400" />
                <span>Bulk Email Broadcast Mode</span>
              </div>
              <button
                type="button"
                onClick={() => setBulkModeEnabled(!bulkModeEnabled)}
                className={`px-3 py-1 rounded-lg text-xs font-mono font-bold transition-all ${
                  bulkModeEnabled ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30' : 'bg-gray-500/20 text-gray-400'
                }`}
              >
                {bulkModeEnabled ? 'ENABLED (CAUTION)' : 'DISABLED (DEFAULT)'}
              </button>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-brand-purple via-brand-pink to-brand-cyan text-white font-bold text-sm hover:opacity-95 transition-all shadow-glow flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isSubmitting ? <span>Dispatching...</span> : <><Send className="w-4 h-4" /> Send Email Now</>}
            </button>
          </form>
        </div>

        {/* Dispatch Logbook */}
        <div className="lg:col-span-5 p-8 rounded-3xl bg-card border border-white/10 space-y-4">
          <h2 className="font-display text-xl font-bold text-white">Recent Email Logs</h2>

          <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
            {logs.map((log) => (
              <div key={log.id} className="p-4 rounded-xl bg-black/40 border border-white/5 text-xs space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white truncate max-w-[200px]">{log.recipient}</span>
                  {log.status === 'SUCCESS' ? (
                    <span className="text-[10px] font-mono font-bold text-emerald-400 flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" /> SENT
                    </span>
                  ) : (
                    <span className="text-[10px] font-mono font-bold text-rose-400 flex items-center gap-1">
                      <XCircle className="w-3 h-3" /> FAILED
                    </span>
                  )}
                </div>
                <p className="text-gray-300 font-semibold truncate">{log.subject}</p>
                <div className="text-[10px] font-mono text-gray-500">{formatDate(log.createdAt)}</div>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
}
