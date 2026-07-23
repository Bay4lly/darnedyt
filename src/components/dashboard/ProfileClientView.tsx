'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { profileUpdateSchema } from '@/lib/zod-schemas';
import { updateProfileAction } from '@/server/actions/auth';
import { Toast, ToastType } from '@/components/ui/Toast';
import { AlertCircle, Building, Lock, Save, User } from 'lucide-react';

export function ProfileClientView({ user }: { user: any }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toast, setToast] = useState<{ type: ToastType; message: string } | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(profileUpdateSchema),
    defaultValues: {
      name: user.name || '',
      company: user.company || '',
      currentPassword: '',
      newPassword: '',
    },
  });

  const onSubmit = async (data: any) => {
    setIsSubmitting(true);
    setToast(null);

    const res = await updateProfileAction(data);
    setIsSubmitting(false);

    if (res.success) {
      setToast({ type: 'success', message: 'Profile updated successfully!' });
    } else {
      setToast({ type: 'error', message: res.error || 'Failed to update profile.' });
    }
  };

  return (
    <div className="p-8 rounded-3xl bg-card border border-white/10 backdrop-blur-2xl shadow-2xl space-y-6">
      {toast && (
        <Toast
          type={toast.type}
          message={toast.message}
          onClose={() => setToast(null)}
        />
      )}

      <div className="space-y-1">
        <h1 className="font-display text-2xl font-bold text-white">Profile & Security Settings</h1>
        <p className="text-xs text-gray-400">Update your account details and password.</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <div className="space-y-2">
          <label className="text-xs font-mono font-bold text-gray-300 uppercase">Full Name</label>
          <input
            {...register('name')}
            className="w-full px-4 py-3 rounded-xl bg-black/50 border border-white/10 text-sm text-white focus:border-brand-purple"
          />
          {errors.name && (
            <p className="text-[11px] text-rose-400">{errors.name.message as string}</p>
          )}
        </div>

        <div className="space-y-2">
          <label className="text-xs font-mono font-bold text-gray-300 uppercase">Email (Read Only)</label>
          <input
            disabled
            value={user.email}
            className="w-full px-4 py-3 rounded-xl bg-black/80 border border-white/5 text-sm text-gray-400 cursor-not-allowed font-mono"
          />
        </div>

        <div className="space-y-2">
          <label className="text-xs font-mono font-bold text-gray-300 uppercase">Company Name</label>
          <input
            {...register('company')}
            className="w-full px-4 py-3 rounded-xl bg-black/50 border border-white/10 text-sm text-white focus:border-brand-purple"
          />
        </div>

        <div className="pt-4 border-t border-white/10 space-y-4">
          <h3 className="text-xs font-mono font-bold text-brand-pink uppercase tracking-wider">Change Password</h3>
          
          <div className="space-y-2">
            <label className="text-xs font-mono font-bold text-gray-300 uppercase">Current Password</label>
            <input
              {...register('currentPassword')}
              type="password"
              placeholder="••••••••"
              className="w-full px-4 py-3 rounded-xl bg-black/50 border border-white/10 text-sm text-white focus:border-brand-purple"
            />
            {errors.currentPassword && (
              <p className="text-[11px] text-rose-400">{errors.currentPassword.message as string}</p>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-xs font-mono font-bold text-gray-300 uppercase">New Password</label>
            <input
              {...register('newPassword')}
              type="password"
              placeholder="••••••••"
              className="w-full px-4 py-3 rounded-xl bg-black/50 border border-white/10 text-sm text-white focus:border-brand-purple"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-3.5 rounded-xl bg-gradient-to-r from-brand-purple to-brand-pink text-white font-bold text-sm hover:opacity-95 transition-all shadow-glow flex items-center justify-center gap-2 disabled:opacity-50"
        >
          {isSubmitting ? <span>Saving...</span> : <><Save className="w-4 h-4" /> Save Changes</>}
        </button>
      </form>
    </div>
  );
}
