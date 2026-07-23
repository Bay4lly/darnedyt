'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { resetPasswordSchema } from '@/lib/zod-schemas';
import { resetPasswordAction } from '@/server/actions/auth';
import { Toast, ToastType } from '@/components/ui/Toast';
import { AlertCircle, Lock, ShieldCheck } from 'lucide-react';

export function ResetPasswordClientView({ token }: { token: string }) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toast, setToast] = useState<{ type: ToastType; message: string } | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      token,
      password: '',
      confirmPassword: '',
    },
  });

  const onSubmit = async (data: any) => {
    setIsSubmitting(true);
    setToast(null);

    const res = await resetPasswordAction(data);
    setIsSubmitting(false);

    if (res.success) {
      setToast({ type: 'success', message: 'Password reset successfully!' });
      setTimeout(() => {
        router.push('/login');
      }, 1500);
    } else {
      setToast({ type: 'error', message: res.error || 'Failed to reset password.' });
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
        <div className="w-12 h-12 rounded-full bg-brand-pink/20 text-brand-pink flex items-center justify-center mx-auto mb-2">
          <ShieldCheck className="w-6 h-6" />
        </div>
        <h1 className="font-display text-2xl font-bold text-white">Create New Password</h1>
        <p className="text-xs text-gray-400">
          Enter a strong new password for your DarNed Hub account.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <input type="hidden" {...register('token')} />

        <div className="space-y-2">
          <label className="text-xs font-mono font-bold text-gray-300 uppercase">
            New Password *
          </label>
          <div className="relative">
            <Lock className="w-4 h-4 text-gray-500 absolute left-3.5 top-3.5" />
            <input
              {...register('password')}
              type="password"
              placeholder="••••••••"
              className="w-full pl-10 pr-4 py-3 rounded-xl bg-black/50 border border-white/10 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-brand-purple transition-all"
            />
          </div>
          {errors.password && (
            <p className="text-[11px] text-rose-400 flex items-center gap-1">
              <AlertCircle className="w-3 h-3" /> {errors.password.message as string}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <label className="text-xs font-mono font-bold text-gray-300 uppercase">
            Confirm New Password *
          </label>
          <div className="relative">
            <Lock className="w-4 h-4 text-gray-500 absolute left-3.5 top-3.5" />
            <input
              {...register('confirmPassword')}
              type="password"
              placeholder="••••••••"
              className="w-full pl-10 pr-4 py-3 rounded-xl bg-black/50 border border-white/10 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-brand-purple transition-all"
            />
          </div>
          {errors.confirmPassword && (
            <p className="text-[11px] text-rose-400 flex items-center gap-1">
              <AlertCircle className="w-3 h-3" /> {errors.confirmPassword.message as string}
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-3.5 rounded-xl bg-gradient-to-r from-brand-purple via-brand-pink to-brand-cyan text-white font-bold text-sm hover:opacity-95 transition-all shadow-glow flex items-center justify-center gap-2 disabled:opacity-50"
        >
          {isSubmitting ? <span>Updating...</span> : <span>Update Password</span>}
        </button>
      </form>
    </div>
  );
}
