'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { formatDate } from '@/lib/utils';
import { deleteUserAction, toggleUserBanAction, updateUserRoleAction } from '@/server/actions/admin';
import { Toast, ToastType } from '@/components/ui/Toast';
import { ConfirmModal } from '@/components/ui/ConfirmModal';
import { Role } from '@/types';
import {
  Ban,
  CheckCircle2,
  Search,
  Shield,
  Trash2,
  User,
  Users,
} from 'lucide-react';

interface AdminUsersClientProps {
  currentAdmin: any;
  users: any[];
}

export function AdminUsersClientView({ currentAdmin, users }: AdminUsersClientProps) {
  const router = useRouter();

  const [searchTerm, setSearchTerm] = useState('');
  const [toast, setToast] = useState<{ type: ToastType; message: string } | null>(null);
  const [deleteConfirmUserId, setDeleteConfirmUserId] = useState<string | null>(null);

  const filteredUsers = users.filter(
    (u) =>
      u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (u.company && u.company.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleRoleChange = async (userId: string, newRole: Role) => {
    const res = await updateUserRoleAction(userId, newRole);
    if (res.success) {
      setToast({ type: 'success', message: 'User role updated' });
      router.refresh();
    } else {
      setToast({ type: 'error', message: res.error || 'Failed to update role' });
    }
  };

  const handleToggleBan = async (userId: string, currentBanStatus: boolean) => {
    const res = await toggleUserBanAction(userId, !currentBanStatus);
    if (res.success) {
      setToast({ type: 'success', message: `User ${!currentBanStatus ? 'banned' : 'unbanned'}` });
      router.refresh();
    } else {
      setToast({ type: 'error', message: res.error || 'Failed to toggle ban status' });
    }
  };

  const handleDeleteUser = async () => {
    if (!deleteConfirmUserId) return;
    const res = await deleteUserAction(deleteConfirmUserId);
    setDeleteConfirmUserId(null);
    if (res.success) {
      setToast({ type: 'success', message: 'User account permanently deleted.' });
      router.refresh();
    } else {
      setToast({ type: 'error', message: res.error || 'Failed to delete user.' });
    }
  };

  return (
    <div className="space-y-8">
      {toast && (
        <Toast
          type={toast.type}
          message={toast.message}
          onClose={() => setToast(null)}
        />
      )}

      <ConfirmModal
        isOpen={Boolean(deleteConfirmUserId)}
        title="Permanently Delete User Account?"
        description="Are you sure you want to delete this user? All session tokens and history will be purged."
        confirmText="Permanently Delete"
        isDestructive={true}
        onConfirm={handleDeleteUser}
        onCancel={() => setDeleteConfirmUserId(null)}
      />

      {/* Header */}
      <div className="p-8 rounded-3xl bg-card border border-white/10 backdrop-blur-2xl shadow-2xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-black text-white">Registered User Directory</h1>
          <p className="text-xs text-gray-400">Manage partner accounts, roles, access permissions, and bans.</p>
        </div>

        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 text-gray-500 absolute left-3.5 top-3" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search name, email, company..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-black/50 border border-white/10 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-brand-purple"
          />
        </div>
      </div>

      {/* Users Table */}
      <div className="overflow-x-auto rounded-3xl border border-white/10 bg-card">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="border-b border-white/10 bg-black/40 text-gray-400 font-mono uppercase text-[11px]">
              <th className="p-4">User Details</th>
              <th className="p-4">Company</th>
              <th className="p-4">Role</th>
              <th className="p-4">Status</th>
              <th className="p-4">Tickets Count</th>
              <th className="p-4">Joined Date</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5 text-gray-300">
            {filteredUsers.map((u) => (
              <tr key={u.id} className="hover:bg-white/5 transition-colors">
                <td className="p-4">
                  <div className="font-bold text-white flex items-center gap-2">
                    {u.name}
                    {u.isEmailVerified && (
                      <span title="Verified Email">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                      </span>
                    )}
                  </div>
                  <div className="text-[11px] font-mono text-gray-400">{u.email} • @{u.username}</div>
                </td>
                <td className="p-4 text-gray-300">{u.company || '-'}</td>
                <td className="p-4">
                  <select
                    value={u.role}
                    onChange={(e) => handleRoleChange(u.id, e.target.value as Role)}
                    disabled={currentAdmin.role !== 'SUPER_ADMIN' && currentAdmin.role !== 'ADMIN'}
                    className="px-2.5 py-1 rounded-md bg-[#0c0c14] border border-white/10 text-xs font-mono font-bold text-brand-pink"
                  >
                    <option value="USER">USER</option>
                    <option value="STAFF">STAFF</option>
                    <option value="ADMIN">ADMIN</option>
                    <option value="SUPER_ADMIN">SUPER_ADMIN</option>
                  </select>
                </td>
                <td className="p-4">
                  {u.isBanned ? (
                    <span className="px-2 py-1 rounded-md bg-red-500/10 text-red-400 border border-red-500/30 text-[10px] font-mono font-bold">
                      BANNED
                    </span>
                  ) : (
                    <span className="px-2 py-1 rounded-md bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-[10px] font-mono font-bold">
                      ACTIVE
                    </span>
                  )}
                </td>
                <td className="p-4 font-mono text-white font-bold">{u._count?.tickets || 0}</td>
                <td className="p-4 font-mono text-gray-500">{formatDate(u.createdAt)}</td>
                <td className="p-4 text-right flex items-center justify-end gap-2">
                  <button
                    onClick={() => handleToggleBan(u.id, u.isBanned)}
                    className={`p-1.5 rounded-lg border text-xs font-semibold ${
                      u.isBanned
                        ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/20'
                        : 'bg-amber-500/10 border-amber-500/30 text-amber-400 hover:bg-amber-500/20'
                    }`}
                    title={u.isBanned ? 'Unban User' : 'Ban User'}
                  >
                    <Ban className="w-4 h-4" />
                  </button>

                  {currentAdmin.role === 'SUPER_ADMIN' && (
                    <button
                      onClick={() => setDeleteConfirmUserId(u.id)}
                      className="p-1.5 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 hover:bg-red-500/20"
                      title="Permanently Delete User"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  );
}
