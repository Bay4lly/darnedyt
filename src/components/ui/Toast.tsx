'use client';

import React, { useEffect } from 'react';
import { CheckCircle2, AlertTriangle, XCircle, Info, X } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

interface ToastProps {
  type: ToastType;
  message: string;
  onClose: () => void;
  duration?: number;
}

export function Toast({ type, message, onClose, duration = 4000 }: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration);
    return () => clearTimeout(timer);
  }, [onClose, duration]);

  const icons = {
    success: <CheckCircle2 className="w-5 h-5 text-emerald-400" />,
    error: <XCircle className="w-5 h-5 text-rose-400" />,
    warning: <AlertTriangle className="w-5 h-5 text-amber-400" />,
    info: <Info className="w-5 h-5 text-cyan-400" />,
  };

  const borders = {
    success: 'border-emerald-500/40 bg-emerald-950/80 text-emerald-100',
    error: 'border-rose-500/40 bg-rose-950/80 text-rose-100',
    warning: 'border-amber-500/40 bg-amber-950/80 text-amber-100',
    info: 'border-cyan-500/40 bg-cyan-950/80 text-cyan-100',
  };

  return (
    <div className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 px-4 py-3 rounded-xl border backdrop-blur-xl shadow-2xl transition-all duration-300 animate-bounce ${borders[type]}`}>
      {icons[type]}
      <span className="text-xs sm:text-sm font-medium">{message}</span>
      <button onClick={onClose} className="p-1 hover:opacity-70">
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}
