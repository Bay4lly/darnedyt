'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { contactTicketSchema } from '@/lib/zod-schemas';
import { createTicketAction } from '@/server/actions/tickets';
import { useLanguage } from '@/components/providers/LanguageProvider';
import { Toast, ToastType } from '@/components/ui/Toast';
import {
  CheckCircle2,
  FileText,
  Mail,
  Send,
  Sparkles,
  Upload,
  AlertCircle,
  Clock,
  ShieldCheck,
} from 'lucide-react';

export function ContactClientView({ userSession }: { userSession?: any }) {
  const { t } = useLanguage();
  const searchParams = useSearchParams();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [createdTicketNumber, setCreatedTicketNumber] = useState<string | null>(null);
  const [toast, setToast] = useState<{ type: ToastType; message: string } | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);

  const defaultPackage = searchParams.get('package') || '';
  const defaultCategory = searchParams.get('category') || 'SPONSORSHIP';

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(contactTicketSchema),
    defaultValues: {
      name: userSession?.name || '',
      company: userSession?.company || '',
      email: userSession?.email || '',
      phone: '',
      category: defaultCategory as any,
      subject: defaultPackage ? `Sponsorship Request: ${defaultPackage}` : '',
      message: defaultPackage ? `Hello DarNed team,\n\nWe are interested in booking the "${defaultPackage}" package for our upcoming campaign.` : '',
      estimatedBudget: '$1,000 - $2,500',
      startDate: '',
      contentType: defaultPackage || 'YouTube Shorts',
      agreeTerms: true as const,
    },
  });

  useEffect(() => {
    if (defaultPackage) {
      setValue('subject', `Sponsorship Request: ${defaultPackage}`);
      setValue('message', `Hello DarNed team,\n\nWe are interested in booking the "${defaultPackage}" package for our upcoming campaign.`);
    }
  }, [defaultPackage, setValue]);

  const onSubmit = async (data: any) => {
    setIsSubmitting(true);
    setToast(null);

    const res = await createTicketAction(data);
    setIsSubmitting(false);

    if (res.success && res.ticketNumber) {
      setCreatedTicketNumber(res.ticketNumber);
      setToast({ type: 'success', message: 'Inquiry submitted successfully!' });
    } else {
      setToast({ type: 'error', message: res.error || 'Failed to submit inquiry.' });
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        setToast({ type: 'error', message: 'File size exceeds 10MB limit.' });
        return;
      }
      setFileName(file.name);
    }
  };

  return (
    <div className="py-16 space-y-12 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
      
      {toast && (
        <Toast
          type={toast.type}
          message={toast.message}
          onClose={() => setToast(null)}
        />
      )}

      {/* Header */}
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-purple/20 border border-brand-purple/40 text-brand-pink text-xs font-mono font-bold uppercase">
          <Mail className="w-4 h-4 text-brand-cyan" />
          {t.contact.title}
        </div>
        <h1 className="font-display text-4xl sm:text-5xl font-black text-white">
          {t.contact.subtitle}
        </h1>
      </div>

      {createdTicketNumber ? (
        /* Success Screen */
        <div className="p-8 sm:p-12 rounded-3xl bg-card border border-emerald-500/40 backdrop-blur-2xl shadow-glow text-center space-y-6 max-w-2xl mx-auto">
          <div className="w-20 h-20 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-10 h-10" />
          </div>
          <h2 className="font-display text-2xl font-bold text-white">
            {t.contact.successTitle}
          </h2>
          <p className="text-xs text-gray-300 leading-relaxed">
            {t.contact.successDesc}
          </p>

          <div className="p-4 rounded-xl bg-black/40 border border-white/10 font-mono text-center">
            <span className="text-xs text-gray-400 block mb-1">{t.contact.ticketIdLabel}</span>
            <span className="text-xl font-black text-brand-pink tracking-widest">{createdTicketNumber}</span>
          </div>

          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href={`/dashboard/tickets/${createdTicketNumber}`}
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-gradient-to-r from-brand-purple to-brand-pink text-white text-xs font-bold shadow-glow"
            >
              Track Ticket Progress
            </Link>
            <button
              onClick={() => setCreatedTicketNumber(null)}
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-xs font-bold"
            >
              Submit Another Inquiry
            </button>
          </div>
        </div>
      ) : (
        /* Form View */
        <div className="p-8 sm:p-12 rounded-3xl bg-card border border-white/10 backdrop-blur-2xl shadow-2xl">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            
            {/* Grid 1: Name & Company */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-mono font-bold text-gray-300 uppercase">
                  {t.contact.fullName} <span className="text-brand-pink">*</span>
                </label>
                <input
                  {...register('name')}
                  placeholder="John Doe"
                  className="w-full px-4 py-3 rounded-xl bg-black/50 border border-white/10 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-brand-purple transition-all"
                />
                {errors.name && (
                  <p className="text-[11px] text-rose-400 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" /> {errors.name.message as string}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <label className="text-xs font-mono font-bold text-gray-300 uppercase">
                  {t.contact.company}
                </label>
                <input
                  {...register('company')}
                  placeholder="PixelCraft Studios"
                  className="w-full px-4 py-3 rounded-xl bg-black/50 border border-white/10 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-brand-purple transition-all"
                />
              </div>
            </div>

            {/* Grid 2: Email & Phone */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-mono font-bold text-gray-300 uppercase">
                  {t.contact.email} <span className="text-brand-pink">*</span>
                </label>
                <input
                  {...register('email')}
                  type="email"
                  placeholder="partner@company.com"
                  className="w-full px-4 py-3 rounded-xl bg-black/50 border border-white/10 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-brand-purple transition-all"
                />
                {errors.email && (
                  <p className="text-[11px] text-rose-400 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" /> {errors.email.message as string}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <label className="text-xs font-mono font-bold text-gray-300 uppercase">
                  {t.contact.phone}
                </label>
                <input
                  {...register('phone')}
                  placeholder="+1 (555) 019-2834"
                  className="w-full px-4 py-3 rounded-xl bg-black/50 border border-white/10 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-brand-purple transition-all"
                />
              </div>
            </div>

            {/* Category & Budget */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-mono font-bold text-gray-300 uppercase">
                  {t.contact.category} <span className="text-brand-pink">*</span>
                </label>
                <select
                  {...register('category')}
                  className="w-full px-4 py-3 rounded-xl bg-[#0c0c14] border border-white/10 text-sm text-white focus:outline-none focus:border-brand-purple transition-all"
                >
                  <option value="SPONSORSHIP">Sponsorship</option>
                  <option value="BUSINESS">Business Inquiry</option>
                  <option value="COLLABORATION">Collaboration</option>
                  <option value="SUPPORT">Support</option>
                  <option value="COPYRIGHT">Copyright</option>
                  <option value="OTHER">Other</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-mono font-bold text-gray-300 uppercase">
                  {t.contact.budget}
                </label>
                <select
                  {...register('estimatedBudget')}
                  className="w-full px-4 py-3 rounded-xl bg-[#0c0c14] border border-white/10 text-sm text-white focus:outline-none focus:border-brand-purple transition-all"
                >
                  <option value="Under $500">Under $500</option>
                  <option value="$500 - $1,000">$500 - $1,000</option>
                  <option value="$1,000 - $2,500">$1,000 - $2,500</option>
                  <option value="$2,500 - $5,000">$2,500 - $5,000</option>
                  <option value="$5,000+">$5,000+</option>
                  <option value="Undisclosed">Undisclosed / Negotiable</option>
                </select>
              </div>
            </div>

            {/* Subject */}
            <div className="space-y-2">
              <label className="text-xs font-mono font-bold text-gray-300 uppercase">
                {t.contact.subject} <span className="text-brand-pink">*</span>
              </label>
              <input
                {...register('subject')}
                placeholder="Minecraft Server Launch Campaign Proposal"
                className="w-full px-4 py-3 rounded-xl bg-black/50 border border-white/10 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-brand-purple transition-all"
              />
              {errors.subject && (
                <p className="text-[11px] text-rose-400 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" /> {errors.subject.message as string}
                </p>
              )}
            </div>

            {/* Message Body */}
            <div className="space-y-2">
              <label className="text-xs font-mono font-bold text-gray-300 uppercase">
                {t.contact.message} <span className="text-brand-pink">*</span>
              </label>
              <textarea
                {...register('message')}
                rows={5}
                placeholder="Please describe your campaign goals, deliverables required, target timeline, and any special requests..."
                className="w-full px-4 py-3 rounded-xl bg-black/50 border border-white/10 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-brand-purple transition-all"
              />
              {errors.message && (
                <p className="text-[11px] text-rose-400 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" /> {errors.message.message as string}
                </p>
              )}
            </div>

            {/* Optional File Attachment */}
            <div className="space-y-2">
              <label className="text-xs font-mono font-bold text-gray-300 uppercase block">
                {t.contact.fileUpload}
              </label>
              <label className="flex items-center justify-center gap-2 p-4 rounded-xl border border-dashed border-white/20 bg-black/30 hover:border-brand-purple cursor-pointer transition-all">
                <Upload className="w-5 h-5 text-brand-pink" />
                <span className="text-xs text-gray-300">
                  {fileName ? `Selected: ${fileName}` : 'Choose File to Attach (PDF, PNG, JPG)'}
                </span>
                <input type="file" onChange={handleFileChange} className="hidden" accept=".pdf,.png,.jpg,.jpeg,.docx" />
              </label>
            </div>

            {/* Terms Checkbox */}
            <div className="space-y-2">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  {...register('agreeTerms')}
                  className="w-4 h-4 rounded border-white/20 bg-black text-brand-purple focus:ring-brand-purple"
                />
                <span className="text-xs text-gray-300">
                  {t.contact.agreeTerms}
                </span>
              </label>
              {errors.agreeTerms && (
                <p className="text-[11px] text-rose-400 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" /> {errors.agreeTerms.message as string}
                </p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-4 rounded-xl bg-gradient-to-r from-brand-purple via-brand-pink to-brand-cyan text-white font-bold text-sm hover:opacity-95 transition-all shadow-glow flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isSubmitting ? (
                <span>{t.contact.submitting}</span>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>{t.contact.submit}</span>
                </>
              )}
            </button>

          </form>
        </div>
      )}

    </div>
  );
}
