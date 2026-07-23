'use client';

import React from 'react';
import { AlertTriangle, X } from 'lucide-react';

interface ConfirmModalProps {
  isOpen: boolean;
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
  isDestructive?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmModal({
  isOpen,
  title,
  description,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  isDestructive = false,
  onConfirm,
  onCancel,
}: ConfirmModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="w-full max-w-md bg-[#0f0f17] border border-white/10 rounded-2xl p-6 shadow-2xl space-y-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className={`p-2.5 rounded-xl ${isDestructive ? 'bg-red-500/20 text-red-400 border border-red-500/30' : 'bg-brand-purple/20 text-brand-pink border border-brand-purple/30'}`}>
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">{title}</h3>
              <p className="text-xs text-gray-400 mt-0.5">{description}</p>
            </div>
          </div>
          <button onClick={onCancel} className="text-gray-400 hover:text-white p-1">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10">
          <button
            onClick={onCancel}
            className="px-4 py-2 text-xs font-semibold text-gray-300 hover:text-white bg-white/5 border border-white/10 rounded-xl transition-all"
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            className={`px-4 py-2 text-xs font-bold rounded-xl transition-all shadow-md ${
              isDestructive
                ? 'bg-gradient-to-r from-red-600 to-rose-700 text-white hover:opacity-90'
                : 'bg-gradient-to-r from-brand-purple to-brand-pink text-white hover:opacity-90'
            }`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
