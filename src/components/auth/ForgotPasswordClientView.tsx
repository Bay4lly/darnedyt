'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { forgotPasswordSchema } from '@/lib/zod-schemas';
import { forgotPasswordAction } from '@/server/actions/auth';
import { Toast, ToastType } from '@/components/ui/Toast';
import { AlertCircle, KeyRound, Mail, ArrowLeft } from 'lucide-react';

export function ForgotPasswordClientView() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [toast, setToast] = useState<{ type: ToastType; message: string } | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: '' },
  });

  const onSubmit = async (data: any) => {
    setIsSubmitting(true);
    setToast(null);

    const res = await forgotPasswordAction(data);
    setIsSubmitting(false);

    if (res.success) {
      setMessage(res.message || 'If an account exists for this email, a password reset link has been sent.');
      setToast({ type: 'success', message: 'Reset email dispatched!' });
    } else {
      setToast({ type: 'error', message: res.error || 'Failed to request reset.' });
    }
  };

  return (
    <div className="w-full max-w-md p-8 rounded-3xl bg-card border border-white/10 backdrop-blur-2xl shadow-2xl space-y-6">
      {toast && (
        <Toast
          type={toast.type}
          message={toast.message}
          onClose={() => setToast(null)}
        />
      )}

      <div className="text-center space-y-2">
        <div className="w-12 h-12 rounded-full bg-brand-purple/20 text-brand-pink flex items-center justify-center mx-auto mb-2">
          <KeyRound className="w-6 h-6" />
        </div>
        <h1 className="font-display text-2xl font-bold text-white">Reset Your Password</h1>
        <p className="text-xs text-gray-400">
          Enter your account email address and we will send you a single-use password reset link.
        </p>
      </div>

      {message ? (
        <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-200 text-xs leading-relaxed text-center">
          {message}
        </div>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <label className="text-xs font-mono font-bold text-gray-300 uppercase">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-gray-500 absolute left-3.5 top-3.5" />
              <input
                {...register('email')}
                type="email"
                placeholder="partner@company.com"
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-black/50 border border-white/10 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-brand-purple transition-all"
              />
            </div>
            {errors.email && (
              <p className="text-[11px] text-rose-400 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" /> {errors.email.message as string}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3.5 rounded-xl bg-gradient-to-r from-brand-purple via-brand-pink to-brand-cyan text-white font-bold text-sm hover:opacity-95 transition-all shadow-glow flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {isSubmitting ? <span>Sending...</span> : <span>Send Reset Link</span>}
          </button>
        </form>
      )}

      <div className="text-center pt-2 border-t border-white/10">
        <Link href="/login" className="inline-flex items-center gap-1 text-xs font-semibold text-gray-400 hover:text-white">
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Login
        </Link>
      </div>
    </div>
  );
}
