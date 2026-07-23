'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { registerSchema } from '@/lib/zod-schemas';
import { registerAction } from '@/server/actions/auth';
import { useLanguage } from '@/components/providers/LanguageProvider';
import { Toast, ToastType } from '@/components/ui/Toast';
import { AlertCircle, Lock, Mail, UserPlus, User, Building } from 'lucide-react';

export function RegisterClientView() {
  const { t } = useLanguage();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toast, setToast] = useState<{ type: ToastType; message: string } | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: '',
      username: '',
      email: '',
      password: '',
      confirmPassword: '',
      company: '',
      agreeTerms: true as const,
    },
  });

  const onSubmit = async (data: any) => {
    setIsSubmitting(true);
    setToast(null);

    const res = await registerAction(data);
    setIsSubmitting(false);

    if (res.success) {
      setToast({ type: 'success', message: 'Account created successfully!' });
      router.push('/dashboard');
      router.refresh();
    } else {
      setToast({ type: 'error', message: res.error || 'Registration failed' });
    }
  };

  return (
    <div className="w-full max-w-lg p-8 rounded-3xl bg-card border border-white/10 backdrop-blur-2xl shadow-2xl space-y-6">
      {toast && (
        <Toast
          type={toast.type}
          message={toast.message}
          onClose={() => setToast(null)}
        />
      )}

      <div className="text-center space-y-2">
        <h1 className="font-display text-3xl font-bold text-white">{t.auth.createAccount}</h1>
        <p className="text-xs text-gray-400">{t.auth.registerSub}</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        
        {/* Full Name & Username */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-mono font-bold text-gray-300 uppercase">
              Full Name *
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-gray-500 absolute left-3.5 top-3.5" />
              <input
                {...register('name')}
                placeholder="Alex Johnson"
                className="w-full pl-10 pr-3 py-2.5 rounded-xl bg-black/50 border border-white/10 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-brand-purple transition-all"
              />
            </div>
            {errors.name && (
              <p className="text-[11px] text-rose-400 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" /> {errors.name.message as string}
              </p>
            )}
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-mono font-bold text-gray-300 uppercase">
              Username *
            </label>
            <input
              {...register('username')}
              placeholder="alex_brand"
              className="w-full px-3.5 py-2.5 rounded-xl bg-black/50 border border-white/10 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-brand-purple transition-all font-mono"
            />
            {errors.username && (
              <p className="text-[11px] text-rose-400 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" /> {errors.username.message as string}
              </p>
            )}
          </div>
        </div>

        {/* Email */}
        <div className="space-y-1.5">
          <label className="text-xs font-mono font-bold text-gray-300 uppercase">
            Work Email *
          </label>
          <div className="relative">
            <Mail className="w-4 h-4 text-gray-500 absolute left-3.5 top-3.5" />
            <input
              {...register('email')}
              type="email"
              placeholder="partner@company.com"
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-black/50 border border-white/10 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-brand-purple transition-all"
            />
          </div>
          {errors.email && (
            <p className="text-[11px] text-rose-400 flex items-center gap-1">
              <AlertCircle className="w-3 h-3" /> {errors.email.message as string}
            </p>
          )}
        </div>

        {/* Company Optional */}
        <div className="space-y-1.5">
          <label className="text-xs font-mono font-bold text-gray-300 uppercase">
            Company / Organization (Optional)
          </label>
          <div className="relative">
            <Building className="w-4 h-4 text-gray-500 absolute left-3.5 top-3.5" />
            <input
              {...register('company')}
              placeholder="PixelCraft Studios"
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-black/50 border border-white/10 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-brand-purple transition-all"
            />
          </div>
        </div>

        {/* Passwords */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-mono font-bold text-gray-300 uppercase">
              Password *
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-gray-500 absolute left-3.5 top-3.5" />
              <input
                {...register('password')}
                type="password"
                placeholder="••••••••"
                className="w-full pl-10 pr-3 py-2.5 rounded-xl bg-black/50 border border-white/10 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-brand-purple transition-all"
              />
            </div>
            {errors.password && (
              <p className="text-[11px] text-rose-400 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" /> {errors.password.message as string}
              </p>
            )}
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-mono font-bold text-gray-300 uppercase">
              Confirm Password *
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-gray-500 absolute left-3.5 top-3.5" />
              <input
                {...register('confirmPassword')}
                type="password"
                placeholder="••••••••"
                className="w-full pl-10 pr-3 py-2.5 rounded-xl bg-black/50 border border-white/10 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-brand-purple transition-all"
              />
            </div>
            {errors.confirmPassword && (
              <p className="text-[11px] text-rose-400 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" /> {errors.confirmPassword.message as string}
              </p>
            )}
          </div>
        </div>

        {/* Terms Checkbox */}
        <div className="space-y-1.5 pt-1">
          <label className="flex items-center gap-2.5 cursor-pointer">
            <input
              type="checkbox"
              {...register('agreeTerms')}
              className="w-4 h-4 rounded border-white/20 bg-black text-brand-purple focus:ring-brand-purple"
            />
            <span className="text-xs text-gray-300">
              I accept the Terms of Service & Privacy Policy
            </span>
          </label>
          {errors.agreeTerms && (
            <p className="text-[11px] text-rose-400 flex items-center gap-1">
              <AlertCircle className="w-3 h-3" /> {errors.agreeTerms.message as string}
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-3.5 rounded-xl bg-gradient-to-r from-brand-purple via-brand-pink to-brand-cyan text-white font-bold text-sm hover:opacity-95 transition-all shadow-glow flex items-center justify-center gap-2 disabled:opacity-50 mt-2"
        >
          {isSubmitting ? (
            <span>Creating account...</span>
          ) : (
            <>
              <UserPlus className="w-4 h-4" />
              <span>{t.auth.signUpBtn}</span>
            </>
          )}
        </button>
      </form>

      <div className="text-center text-xs text-gray-400 pt-2 border-t border-white/10">
        <span>{t.auth.hasAccount} </span>
        <Link href="/login" className="font-bold text-brand-pink hover:underline">
          {t.auth.signInBtn}
        </Link>
      </div>
    </div>
  );
}
