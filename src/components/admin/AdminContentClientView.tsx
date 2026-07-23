'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { updateSiteSettingAction, upsertPackageAction, deletePackageAction } from '@/server/actions/admin';
import { Toast, ToastType } from '@/components/ui/Toast';
import { ConfirmModal } from '@/components/ui/ConfirmModal';
import { FileText, Save, Settings, Sparkles, Package, Edit, Plus, Trash2, X, CheckCircle2 } from 'lucide-react';

interface AdminContentClientProps {
  settings: Record<string, string>;
  packages: any[];
  faqs: any[];
}

export function AdminContentClientView({ settings, packages, faqs }: AdminContentClientProps) {
  const router = useRouter();

  const [toast, setToast] = useState<{ type: ToastType; message: string } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingPkg, setEditingPkg] = useState<any | null>(null);
  const [deletePkgId, setDeletePkgId] = useState<string | null>(null);

  // Settings State
  const [bannerText, setBannerText] = useState(settings.announcement_banner || '');
  const [subsCount, setSubsCount] = useState(settings.subscribers_count || '385000');
  const [viewsCount, setViewsCount] = useState(settings.total_views || '142000000');
  const [videosCount, setVideosCount] = useState(settings.total_videos || '340');
  const [registrationOpen, setRegistrationOpen] = useState(settings.registration_open || 'true');

  // Package Form State
  const [pkgForm, setPkgForm] = useState({
    id: '',
    titleEn: '',
    titleTr: '',
    descEn: '',
    descTr: '',
    price: '$50',
    showPrice: true,
    isPopular: false,
    orderIndex: 1,
    featuresEnText: '',
    featuresTrText: '',
  });

  const handleSaveSettings = async () => {
    setIsSubmitting(true);
    await updateSiteSettingAction('announcement_banner', bannerText);
    await updateSiteSettingAction('subscribers_count', subsCount);
    await updateSiteSettingAction('total_views', viewsCount);
    await updateSiteSettingAction('total_videos', videosCount);
    await updateSiteSettingAction('registration_open', registrationOpen);
    setIsSubmitting(false);

    setToast({ type: 'success', message: 'Global site settings updated successfully!' });
    router.refresh();
  };

  const handleOpenEditPkg = (pkg?: any) => {
    if (pkg) {
      let fEn = pkg.featuresEn;
      let fTr = pkg.featuresTr;
      try {
        if (typeof fEn === 'string' && fEn.startsWith('[')) fEn = JSON.parse(fEn).join('\n');
        if (typeof fTr === 'string' && fTr.startsWith('[')) fTr = JSON.parse(fTr).join('\n');
      } catch (e) {}

      setPkgForm({
        id: pkg.id,
        titleEn: pkg.titleEn || '',
        titleTr: pkg.titleTr || '',
        descEn: pkg.descEn || '',
        descTr: pkg.descTr || '',
        price: pkg.price || '$50',
        showPrice: Boolean(pkg.showPrice),
        isPopular: Boolean(pkg.isPopular),
        orderIndex: pkg.orderIndex || 1,
        featuresEnText: Array.isArray(fEn) ? fEn.join('\n') : (fEn || ''),
        featuresTrText: Array.isArray(fTr) ? fTr.join('\n') : (fTr || ''),
      });
    } else {
      setPkgForm({
        id: '',
        titleEn: '',
        titleTr: '',
        descEn: '',
        descTr: '',
        price: '$100',
        showPrice: true,
        isPopular: false,
        orderIndex: packages.length + 1,
        featuresEnText: 'Feature 1\nFeature 2\nFeature 3',
        featuresTrText: 'Özellik 1\nÖzellik 2\nÖzellik 3',
      });
    }
    setEditingPkg(pkg || {});
  };

  const handleSavePackage = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const featuresEnArray = pkgForm.featuresEnText.split('\n').map(s => s.trim()).filter(Boolean);
    const featuresTrArray = pkgForm.featuresTrText.split('\n').map(s => s.trim()).filter(Boolean);

    const payload = {
      id: pkgForm.id || undefined,
      titleEn: pkgForm.titleEn,
      titleTr: pkgForm.titleTr,
      descEn: pkgForm.descEn,
      descTr: pkgForm.descTr,
      price: pkgForm.price,
      showPrice: pkgForm.showPrice,
      isPopular: pkgForm.isPopular,
      orderIndex: Number(pkgForm.orderIndex) || 1,
      featuresEn: JSON.stringify(featuresEnArray),
      featuresTr: JSON.stringify(featuresTrArray),
    };

    const res = await upsertPackageAction(payload);
    setIsSubmitting(false);

    if (res.success) {
      setToast({ type: 'success', message: 'Sponsorship Package saved successfully!' });
      setEditingPkg(null);
      router.refresh();
    } else {
      setToast({ type: 'error', message: res.error || 'Failed to save package' });
    }
  };

  const handleDeletePackage = async () => {
    if (!deletePkgId) return;
    setIsSubmitting(true);
    const res = await deletePackageAction(deletePkgId);
    setIsSubmitting(false);
    setDeletePkgId(null);

    if (res.success) {
      setToast({ type: 'success', message: 'Package deleted successfully.' });
      router.refresh();
    } else {
      setToast({ type: 'error', message: res.error || 'Failed to delete package' });
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

      <ConfirmModal
        isOpen={Boolean(deletePkgId)}
        title="Delete Sponsorship Package?"
        description="Are you sure you want to permanently delete this sponsorship package?"
        confirmText="Yes, Delete Package"
        isDestructive={true}
        onConfirm={handleDeletePackage}
        onCancel={() => setDeletePkgId(null)}
      />

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
              placeholder="🚀 Open for Sponsorship Deals!"
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

      {/* 2. Sponsorship Packages List & Management */}
      <div className="p-8 rounded-3xl bg-card border border-white/10 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h2 className="font-display text-xl font-bold text-white flex items-center gap-2">
            <Package className="w-5 h-5 text-brand-cyan" />
            Sponsorship Packages Configuration
          </h2>
          <button
            onClick={() => handleOpenEditPkg()}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-brand-purple to-brand-pink text-white text-xs font-bold shadow-glow flex items-center gap-2"
          >
            <Plus className="w-4 h-4" /> Add New Package
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {packages.map((pkg) => (
            <div key={pkg.id} className="p-6 rounded-2xl bg-white/5 border border-white/10 space-y-4 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-center justify-between border-b border-white/10 pb-3">
                  <div>
                    <span className="font-bold text-white text-base block">{pkg.titleEn}</span>
                    <span className="text-xs text-brand-pink font-semibold">{pkg.titleTr}</span>
                  </div>
                  <span className="font-mono text-emerald-400 font-black text-lg">{pkg.price}</span>
                </div>

                <p className="text-xs text-gray-300 leading-relaxed">{pkg.descEn}</p>

                <div className="flex flex-wrap gap-2 text-[10px] font-mono">
                  <span className="px-2 py-0.5 rounded bg-white/10 text-gray-300">
                    Show Price: {pkg.showPrice ? 'YES' : 'NO'}
                  </span>
                  {pkg.isPopular && (
                    <span className="px-2 py-0.5 rounded bg-brand-pink/20 text-brand-pink font-bold border border-brand-pink/40">
                      POPULAR BADGE
                    </span>
                  )}
                  <span className="px-2 py-0.5 rounded bg-white/10 text-gray-400">
                    Order: #{pkg.orderIndex}
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-white/5">
                <button
                  onClick={() => handleOpenEditPkg(pkg)}
                  className="px-3.5 py-1.5 rounded-lg bg-brand-purple/20 text-brand-purple border border-brand-purple/40 hover:bg-brand-purple/30 font-bold text-xs transition-all flex items-center gap-1.5"
                >
                  <Edit className="w-3.5 h-3.5" /> Edit Package
                </button>
                <button
                  onClick={() => setDeletePkgId(pkg.id)}
                  className="p-1.5 rounded-lg bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 transition-all"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}

          {packages.length === 0 && (
            <div className="col-span-2 p-8 text-center text-gray-400 font-mono text-xs">
              No sponsorship packages found. Click "Add New Package" to create one.
            </div>
          )}
        </div>
      </div>

      {/* Package Edit/Create Modal */}
      {editingPkg && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-2xl max-h-[90vh] bg-[#0c0c14] border border-white/15 rounded-3xl overflow-hidden flex flex-col shadow-2xl">
            
            {/* Modal Header */}
            <div className="p-6 bg-white/5 border-b border-white/10 flex items-center justify-between">
              <h3 className="font-display font-bold text-lg text-white">
                {pkgForm.id ? 'Edit Sponsorship Package' : 'Create New Sponsorship Package'}
              </h3>
              <button
                onClick={() => setEditingPkg(null)}
                className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-gray-300 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Form Content */}
            <form onSubmit={handleSavePackage} className="p-6 overflow-y-auto space-y-4 flex-grow text-xs">
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-gray-300 font-mono font-bold uppercase block mb-1">Title (English)</label>
                  <input
                    type="text"
                    required
                    value={pkgForm.titleEn}
                    onChange={(e) => setPkgForm({ ...pkgForm, titleEn: e.target.value })}
                    placeholder="e.g. YouTube Shorts Integration"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-black/60 border border-white/10 text-white focus:border-brand-purple"
                  />
                </div>

                <div>
                  <label className="text-gray-300 font-mono font-bold uppercase block mb-1">Title (Turkish)</label>
                  <input
                    type="text"
                    required
                    value={pkgForm.titleTr}
                    onChange={(e) => setPkgForm({ ...pkgForm, titleTr: e.target.value })}
                    placeholder="e.g. YouTube Shorts Entegrasyonu"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-black/60 border border-white/10 text-white focus:border-brand-purple"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="text-gray-300 font-mono font-bold uppercase block mb-1">Price</label>
                  <input
                    type="text"
                    required
                    value={pkgForm.price}
                    onChange={(e) => setPkgForm({ ...pkgForm, price: e.target.value })}
                    placeholder="$50"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-black/60 border border-white/10 text-white font-mono"
                  />
                </div>

                <div>
                  <label className="text-gray-300 font-mono font-bold uppercase block mb-1">Show Price</label>
                  <select
                    value={pkgForm.showPrice ? 'true' : 'false'}
                    onChange={(e) => setPkgForm({ ...pkgForm, showPrice: e.target.value === 'true' })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#0c0c14] border border-white/10 text-white"
                  >
                    <option value="true">YES (Display Price)</option>
                    <option value="false">NO (Hide Price)</option>
                  </select>
                </div>

                <div>
                  <label className="text-gray-300 font-mono font-bold uppercase block mb-1">Popular Badge</label>
                  <select
                    value={pkgForm.isPopular ? 'true' : 'false'}
                    onChange={(e) => setPkgForm({ ...pkgForm, isPopular: e.target.value === 'true' })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#0c0c14] border border-white/10 text-white"
                  >
                    <option value="false">NO</option>
                    <option value="true">YES (Show Popular Badge)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-gray-300 font-mono font-bold uppercase block mb-1">Description (English)</label>
                <textarea
                  rows={2}
                  required
                  value={pkgForm.descEn}
                  onChange={(e) => setPkgForm({ ...pkgForm, descEn: e.target.value })}
                  placeholder="30-60 second dedicated Shorts video showcasing your Minecraft server or app."
                  className="w-full p-3 rounded-xl bg-black/60 border border-white/10 text-white resize-none"
                />
              </div>

              <div>
                <label className="text-gray-300 font-mono font-bold uppercase block mb-1">Description (Turkish)</label>
                <textarea
                  rows={2}
                  required
                  value={pkgForm.descTr}
                  onChange={(e) => setPkgForm({ ...pkgForm, descTr: e.target.value })}
                  placeholder="Minecraft sunucunuzu veya uygulamanızı tanıtan 30-60 saniyelik Shorts videosu."
                  className="w-full p-3 rounded-xl bg-black/60 border border-white/10 text-white resize-none"
                />
              </div>

              <div>
                <label className="text-gray-300 font-mono font-bold uppercase block mb-1">Features List (English - 1 feature per line)</label>
                <textarea
                  rows={3}
                  value={pkgForm.featuresEnText}
                  onChange={(e) => setPkgForm({ ...pkgForm, featuresEnText: e.target.value })}
                  placeholder="30-60 Second Shorts Video&#10;Pinned Comment Link&#10;7-Day Performance Report"
                  className="w-full p-3 rounded-xl bg-black/60 border border-white/10 text-white font-mono text-xs resize-none"
                />
              </div>

              <div>
                <label className="text-gray-300 font-mono font-bold uppercase block mb-1">Features List (Turkish - 1 feature per line)</label>
                <textarea
                  rows={3}
                  value={pkgForm.featuresTrText}
                  onChange={(e) => setPkgForm({ ...pkgForm, featuresTrText: e.target.value })}
                  placeholder="30-60 Saniye Shorts Videosu&#10;Sabitlenmiş Yorum Bağlantısı&#10;7 Günlük Performans Raporu"
                  className="w-full p-3 rounded-xl bg-black/60 border border-white/10 text-white font-mono text-xs resize-none"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setEditingPkg(null)}
                  className="px-4 py-2.5 rounded-xl bg-white/10 text-gray-300 font-bold hover:bg-white/20 transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-brand-purple via-brand-pink to-brand-cyan text-white font-bold shadow-glow hover:opacity-95 transition-all flex items-center gap-2"
                >
                  <Save className="w-4 h-4" /> Save Package
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
}
