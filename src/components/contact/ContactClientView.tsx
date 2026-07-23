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
  const defaultPrice = searchParams.get('price') || '';
  const defaultCategory = searchParams.get('category') || 'SPONSORSHIP';

  const initialSubject = defaultPackage
    ? `Sponsorship Quote Request: ${defaultPackage}${defaultPrice ? ` (${defaultPrice})` : ''}`
    : '';

  const initialMessage = defaultPackage
    ? `Hello DarNed Team,\n\nI would like to request a quote / book the "${defaultPackage}" package${defaultPrice ? ` (${defaultPrice})` : ''}.\n\nCampaign / Branding Details:\n- Brand / Minecraft Server Name:\n- Promotion Objectives:\n- Preferred Launch Date:\n\nPlease let us know the next steps for collaboration!`
    : '';

  const initialBudget = defaultPrice || (defaultPackage ? '$50' : '$1,000 - $2,500');

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
      subject: initialSubject,
      message: initialMessage,
      estimatedBudget: initialBudget,
      startDate: '',
      contentType: defaultPackage || 'YouTube Shorts',
      agreeTerms: true as const,
    },
  });

  useEffect(() => {
    if (defaultPackage) {
      const subjectText = `Sponsorship Quote Request: ${defaultPackage}${defaultPrice ? ` (${defaultPrice})` : ''}`;
      const messageText = `Hello DarNed Team,\n\nI would like to request a quote / book the "${defaultPackage}" package${defaultPrice ? ` (${defaultPrice})` : ''}.\n\nCampaign / Branding Details:\n- Brand / Minecraft Server Name:\n- Promotion Objectives:\n- Preferred Launch Date:\n\nPlease let us know the next steps for collaboration!`;

      setValue('subject', subjectText);
      setValue('message', messageText);
      if (defaultPrice) {
        setValue('estimatedBudget', defaultPrice);
      }
    }
  }, [defaultPackage, defaultPrice, setValue]);

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
          {t.contact.badge}
        </div>
        <h1 className="font-display text-4xl sm:text-6xl font-black text-white">
          {t.contact.title}
        </h1>
        <p className="text-sm sm:text-base text-gray-300">
          {t.contact.subtitle}
        </p>
      </div>

      {/* Confirmation View after submission */}
      {createdTicketNumber ? (
        <div className="p-8 sm:p-12 rounded-3xl bg-card border border-emerald-500/40 text-center space-y-6 max-w-2xl mx-auto backdrop-blur-2xl shadow-glow">
          <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 mx-auto flex items-center justify-center">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <div className="space-y-2">
            <h2 className="font-display text-2xl font-bold text-white">Inquiry Received!</h2>
            <p className="text-xs text-gray-300">
              Your inquiry has been logged. Our sponsorship team will respond within 24 business hours.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-black/60 border border-white/10 font-mono space-y-1">
            <span className="text-[10px] text-gray-400 uppercase tracking-widest block">Reference Ticket ID</span>
            <span className="text-2xl font-black text-brand-pink tracking-wider block">
              {createdTicketNumber}
            </span>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link
              href="/dashboard"
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-brand-purple to-brand-pink text-white font-bold text-xs shadow-glow hover:opacity-95 transition-all"
            >
              View in Partner Dashboard
            </Link>
            <button
              onClick={() => setCreatedTicketNumber(null)}
              className="px-6 py-3 rounded-xl bg-white/10 text-white font-bold text-xs hover:bg-white/20 transition-all border border-white/10"
            >
              Submit Another Inquiry
            </button>
          </div>
        </div>
      ) : (
        /* Form Card */
        <div className="p-8 sm:p-12 rounded-3xl bg-card border border-white/10 backdrop-blur-2xl shadow-2xl space-y-8">
          
          {defaultPackage && (
            <div className="p-4 rounded-2xl bg-brand-purple/20 border border-brand-purple/40 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <Sparkles className="w-5 h-5 text-brand-pink flex-shrink-0" />
                <span className="text-xs text-white">
                  Selected Package: <strong className="text-brand-pink font-bold">{defaultPackage}</strong> {defaultPrice && <span className="font-mono text-emerald-400 font-bold">({defaultPrice})</span>}
                </span>
              </div>
              <span className="text-[11px] font-mono text-gray-400">Pre-filled Inquiry</span>
            </div>
          )}

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
                  <option value="$50">$50 (Shorts Integration)</option>
                  <option value="$150">$150 (Product Placement)</option>
                  <option value="$300">$300 (Dedicated Video)</option>
                  <option value="Under $500">Under $500</option>
                  <option value="$500 - $1,000">$500 - $1,000</option>
                  <option value="$1,000 - $2,500">$1,000 - $2,500</option>
                  <option value="$2,500 - $5,000">$2,500 - $5,000</option>
                  <option value="$5,000+">$5,000+</option>
                  <option value="Custom Quote">Custom Quote / Negotiable</option>
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
                placeholder="e.g. Minecraft Server Sponsorship Proposal"
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
                rows={6}
                placeholder="Describe your brand, campaign goals, key deliverables, and target launch timeline..."
                className="w-full p-4 rounded-xl bg-black/50 border border-white/10 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-brand-purple transition-all resize-none"
              />
              {errors.message && (
                <p className="text-[11px] text-rose-400 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" /> {errors.message.message as string}
                </p>
              )}
            </div>

            {/* Optional Terms Checkbox */}
            <div className="pt-2">
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  {...register('agreeTerms')}
                  className="mt-1 rounded border-white/20 bg-black/50 text-brand-purple focus:ring-brand-purple"
                />
                <span className="text-xs text-gray-400 leading-normal">
                  I agree to the{' '}
                  <Link href="/terms" className="text-brand-pink underline hover:text-white">
                    Terms of Service
                  </Link>{' '}
                  and{' '}
                  <Link href="/privacy" className="text-brand-pink underline hover:text-white">
                    Privacy Policy
                  </Link>
                  .
                </span>
              </label>
              {errors.agreeTerms && (
                <p className="text-[11px] text-rose-400 mt-1 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" /> {errors.agreeTerms.message as string}
                </p>
              )}
            </div>

            {/* Submit Button */}
            <div className="pt-4">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 rounded-xl bg-gradient-to-r from-brand-purple via-brand-pink to-brand-cyan text-white font-bold text-sm shadow-glow hover:opacity-95 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isSubmitting ? (
                  <span>Submitting Inquiry...</span>
                ) : (
                  <>
                    <span>Submit Sponsorship Inquiry</span>
                    <Send className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>

          </form>
        </div>
      )}

    </div>
  );
}
