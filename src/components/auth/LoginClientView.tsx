'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginSchema } from '@/lib/zod-schemas';
import { loginAction } from '@/server/actions/auth';
import { useLanguage } from '@/components/providers/LanguageProvider';
import { Toast, ToastType } from '@/components/ui/Toast';
import { AlertCircle, Lock, Mail, LogIn } from 'lucide-react';

export function LoginClientView() {
  const { t } = useLanguage();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toast, setToast] = useState<{ type: ToastType; message: string } | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
      rememberMe: false,
    },
  });

  const onSubmit = async (data: any) => {
    setIsSubmitting(true);
    setToast(null);

    const res = await loginAction(data);
    setIsSubmitting(false);

    if (res.success) {
      setToast({ type: 'success', message: 'Logged in successfully!' });
      if (res.role === 'ADMIN' || res.role === 'SUPER_ADMIN' || res.role === 'STAFF') {
        router.push('/admin');
      } else {
        router.push('/dashboard');
      }
      router.refresh();
    } else {
      setToast({ type: 'error', message: res.error || 'Invalid credentials' });
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
        <h1 className="font-display text-3xl font-bold text-white">{t.auth.welcomeBack}</h1>
        <p className="text-xs text-gray-400">{t.auth.loginSub}</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <div className="space-y-2">
          <label className="text-xs font-mono font-bold text-gray-300 uppercase">
            {t.auth.email}
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

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-xs font-mono font-bold text-gray-300 uppercase">
              {t.auth.password}
            </label>
            <Link
              href="/forgot-password"
              className="text-xs font-semibold text-brand-pink hover:underline"
            >
              {t.auth.forgotPassword}
            </Link>
          </div>
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

        <div className="flex items-center justify-between">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              {...register('rememberMe')}
              className="w-4 h-4 rounded border-white/20 bg-black text-brand-purple focus:ring-brand-purple"
            />
            <span className="text-xs text-gray-300">{t.auth.rememberMe}</span>
          </label>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-3.5 rounded-xl bg-gradient-to-r from-brand-purple via-brand-pink to-brand-cyan text-white font-bold text-sm hover:opacity-95 transition-all shadow-glow flex items-center justify-center gap-2 disabled:opacity-50"
        >
          {isSubmitting ? (
            <span>Signing in...</span>
          ) : (
            <>
              <LogIn className="w-4 h-4" />
              <span>{t.auth.signInBtn}</span>
            </>
          )}
        </button>
      </form>

      <div className="text-center text-xs text-gray-400 pt-2 border-t border-white/10">
        <span>{t.auth.noAccount} </span>
        <Link href="/register" className="font-bold text-brand-pink hover:underline">
          {t.auth.signUpBtn}
        </Link>
      </div>
    </div>
  );
}
