'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { updateSiteSettingAction, upsertPackageAction } from '@/server/actions/admin';
import { Toast, ToastType } from '@/components/ui/Toast';
import { FileText, Save, Settings, Sparkles, Package } from 'lucide-react';

interface AdminContentClientProps {
  settings: Record<string, string>;
  packages: any[];
  faqs: any[];
}

export function AdminContentClientView({ settings, packages, faqs }: AdminContentClientProps) {
  const router = useRouter();

  const [toast, setToast] = useState<{ type: ToastType; message: string } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Settings State
  const [bannerText, setBannerText] = useState(settings.announcement_banner || '');
  const [subsCount, setSubsCount] = useState(settings.subscribers_count || '385000');
  const [viewsCount, setViewsCount] = useState(settings.total_views || '142000000');
  const [videosCount, setVideosCount] = useState(settings.total_videos || '340');
  const [maintenanceMode, setMaintenanceMode] = useState(settings.maintenance_mode || 'false');
  const [registrationOpen, setRegistrationOpen] = useState(settings.registration_open || 'true');

  const handleSaveSettings = async () => {
    setIsSubmitting(true);
    await updateSiteSettingAction('announcement_banner', bannerText);
    await updateSiteSettingAction('subscribers_count', subsCount);
    await updateSiteSettingAction('total_views', viewsCount);
    await updateSiteSettingAction('total_videos', videosCount);
    await updateSiteSettingAction('maintenance_mode', maintenanceMode);
    await updateSiteSettingAction('registration_open', registrationOpen);
    setIsSubmitting(false);

    setToast({ type: 'success', message: 'Site settings updated!' });
    router.refresh();
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
        <h1 className="font-display text-3xl font-black text-white">Dynamic Site Content Editor</h1>
        <p className="text-xs text-gray-400">Update hero announcements, channel metrics, packages, and system toggles.</p>
      </div>

      {/* 1. Global Settings Section */}
      <div className="p-8 rounded-3xl bg-card border border-white/10 backdrop-blur-2xl space-y-6">
        <h2 className="font-display text-xl font-bold text-white flex items-center gap-2">
          <Settings className="w-5 h-5 text-brand-pink" />
          Global Settings & Channel Metrics
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2 md:col-span-2">
            <label className="text-xs font-mono font-bold text-gray-300 uppercase">
              Global Announcement Banner (Leave blank to hide)
            </label>
            <input
              type="text"
              value={bannerText}
              onChange={(e) => setBannerText(e.target.value)}
              placeholder="🚀 Open for Q3 Sponsorship Deals!"
              className="w-full px-4 py-3 rounded-xl bg-black/50 border border-white/10 text-sm text-white focus:border-brand-purple"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-mono font-bold text-gray-300 uppercase">Subscribers Count</label>
            <input
              type="text"
              value={subsCount}
              onChange={(e) => setSubsCount(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-black/50 border border-white/10 text-sm text-white font-mono"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-mono font-bold text-gray-300 uppercase">Total Channel Views</label>
            <input
              type="text"
              value={viewsCount}
              onChange={(e) => setViewsCount(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-black/50 border border-white/10 text-sm text-white font-mono"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-mono font-bold text-gray-300 uppercase">Total Videos Count</label>
            <input
              type="text"
              value={videosCount}
              onChange={(e) => setVideosCount(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-black/50 border border-white/10 text-sm text-white font-mono"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-mono font-bold text-gray-300 uppercase">Registration Status</label>
            <select
              value={registrationOpen}
              onChange={(e) => setRegistrationOpen(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-[#0c0c14] border border-white/10 text-sm text-white"
            >
              <option value="true">Open (New users can register)</option>
              <option value="false">Closed (Registration disabled)</option>
            </select>
          </div>
        </div>

        <button
          onClick={handleSaveSettings}
          disabled={isSubmitting}
          className="px-6 py-3 rounded-xl bg-gradient-to-r from-brand-purple to-brand-pink text-white text-xs font-bold shadow-glow flex items-center gap-2"
        >
          <Save className="w-4 h-4" /> Save Global Settings
        </button>
      </div>

      {/* 2. Sponsorship Packages List */}
      <div className="p-8 rounded-3xl bg-card border border-white/10 space-y-6">
        <h2 className="font-display text-xl font-bold text-white flex items-center gap-2">
          <Package className="w-5 h-5 text-brand-cyan" />
          Sponsorship Packages Configuration
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {packages.map((pkg) => (
            <div key={pkg.id} className="p-6 rounded-2xl bg-white/5 border border-white/10 space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-bold text-white text-sm">{pkg.titleEn}</span>
                <span className="font-mono text-brand-pink font-bold text-xs">{pkg.price}</span>
              </div>
              <p className="text-xs text-gray-400 leading-relaxed">{pkg.descEn}</p>
              <div className="text-[11px] font-mono text-gray-500">
                Show Price: {pkg.showPrice ? 'YES' : 'NO'} • Popular: {pkg.isPopular ? 'YES' : 'NO'}
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
