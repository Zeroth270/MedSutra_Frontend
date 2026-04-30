import React from 'react';
import { useTranslation } from 'react-i18next';

/**
 * A professional, high-fidelity confirmation modal for destructive or critical actions.
 */
export default function ConfirmModal({ isOpen, onClose, onConfirm, title, message, type = 'danger' }) {
  const { t } = useTranslation();

  if (!isOpen) return null;

  // Icon mapping based on action type
  const typeConfig = {
    danger: {
      icon: '⚠️',
      color: 'text-red-500',
      btn: 'bg-red-600 hover:bg-red-700 shadow-red-500/20',
      glow: 'bg-red-500/5'
    },
    warning: {
      icon: '🔔',
      color: 'text-orange-500',
      btn: 'bg-orange-600 hover:bg-orange-700 shadow-orange-500/20',
      glow: 'bg-orange-500/5'
    },
    info: {
      icon: 'ℹ️',
      color: 'text-teal-500',
      btn: 'bg-teal-600 hover:bg-teal-700 shadow-teal-500/20',
      glow: 'bg-teal-500/5'
    }
  };

  const config = typeConfig[type] || typeConfig.danger;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
      {/* High-fidelity Backdrop */}
      <div 
        className="absolute inset-0 bg-gray-950/40 dark:bg-gray-950/80 backdrop-blur-md animate-fade-in"
        onClick={onClose}
      />
      
      {/* Professional Modal Container */}
      <div className="relative w-full max-w-md bg-white dark:bg-gray-900 rounded-[2.5rem] border theme-border shadow-[0_20px_50px_rgba(0,0,0,0.15)] overflow-hidden animate-slide-in">
        {/* Subtle decorative glow */}
        <div className={`absolute top-0 left-1/2 -translate-x-1/2 w-48 h-48 ${config.glow} rounded-full blur-[60px] -mt-24`} />
        
        <div className="relative z-10 p-10">
          {/* Header Area with Icon */}
          <div className="flex flex-col items-center text-center mb-8">
            <div className={`w-16 h-16 rounded-2xl theme-bg border theme-border flex items-center justify-center text-3xl mb-6 shadow-sm group-hover:scale-110 transition-transform`}>
              {config.icon}
            </div>
            <h2 className="text-2xl font-black theme-text uppercase tracking-tight mb-3">
              {title}
            </h2>
            <div className="w-12 h-1 bg-gray-100 dark:bg-gray-800 rounded-full mb-6" />
            <p className="theme-text-sub text-sm leading-relaxed font-medium px-4">
              {message}
            </p>
          </div>

          {/* Professional Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <button
              onClick={onClose}
              className="flex-1 py-4.5 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] theme-text-sub hover:theme-text theme-surface border theme-border hover:border-gray-400 dark:hover:border-gray-600 transition-all active:scale-95"
            >
              {t('nav_cancel') || 'Cancel'}
            </button>
            <button
              onClick={() => {
                onConfirm();
                onClose();
              }}
              className={`flex-1 py-4.5 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] text-white shadow-xl transition-all active:scale-95 ${config.btn}`}
            >
              {t('nav_confirm') || 'Confirm Action'}
            </button>
          </div>
        </div>

        {/* Dismiss Button (Top Right) */}
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 w-10 h-10 rounded-xl flex items-center justify-center theme-text-sub hover:theme-bg hover:theme-text transition-all active:scale-90"
        >
          ✕
        </button>
      </div>
    </div>
  );
}
