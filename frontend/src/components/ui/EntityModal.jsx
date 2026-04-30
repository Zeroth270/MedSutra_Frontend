import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

const EntityModal = ({ isOpen, onClose, onSave, title, initialData = {}, fields = [] }) => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState(initialData || {});

  useEffect(() => {
    if (isOpen) {
      setFormData(initialData || {});
    }
  }, [isOpen, initialData]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-white/40 dark:bg-gray-950/80 backdrop-blur-md animate-fade-in"
        onClick={onClose}
      />
      
      {/* Modal Content */}
      <div className="relative w-full max-w-lg theme-surface border theme-border rounded-[2.5rem] shadow-2xl overflow-hidden animate-slide-in p-8 sm:p-10">
        <div className="absolute top-0 right-0 w-64 h-64 bg-teal-500/10 rounded-full blur-[80px] -mr-32 -mt-32" />
        
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-8 px-1">
            <h2 className="text-2xl font-black theme-text uppercase tracking-tight">{title}</h2>
            <button 
              onClick={onClose}
              className="w-10 h-10 rounded-xl border theme-border flex items-center justify-center theme-text-sub hover:theme-text hover:theme-bg transition-all active:scale-90"
            >
              ✕
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {fields.map(field => (
              <div key={field.name} className="group">
                <label className="block text-[10px] font-black theme-text-sub uppercase tracking-[0.2em] mb-3 px-1 group-focus-within:text-teal-600 transition-colors">
                  {t(field.labelKey)}
                </label>
                {field.type === 'select' ? (
                  <select
                    name={field.name}
                    value={formData[field.name] || ''}
                    onChange={handleChange}
                    className="w-full px-6 py-4 theme-bg border theme-border rounded-xl text-sm theme-text focus:outline-none focus:border-teal-500 focus:ring-4 focus:ring-teal-500/5 transition-all font-medium appearance-none"
                    required={field.required}
                  >
                    {field.options.map(opt => (
                      <option key={opt.value} value={opt.value}>{t(opt.labelKey)}</option>
                    ))}
                  </select>
                ) : (
                  <input
                    type={field.type || 'text'}
                    name={field.name}
                    value={formData[field.name] || ''}
                    onChange={handleChange}
                    placeholder={field.placeholder || (field.placeholderKey ? t(field.placeholderKey) : '')}
                    className="w-full px-6 py-4 theme-bg border theme-border rounded-xl text-sm theme-text placeholder-gray-500 focus:outline-none focus:border-teal-500 focus:ring-4 focus:ring-teal-500/5 transition-all font-medium"
                    required={field.required}
                  />
                )}
              </div>
            ))}

            <div className="pt-4 flex flex-col sm:flex-row gap-4">
              <button
                type="submit"
                className="bg-gray-900 dark:bg-teal-600 text-white flex-1 py-4.5 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] shadow-xl shadow-teal-500/10 hover:scale-[1.02] active:scale-95 transition-all order-2 sm:order-1"
              >
                {t('settings_commit')}
              </button>
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-4.5 bg-white dark:bg-gray-800 border theme-border rounded-xl text-[10px] font-black theme-text-sub uppercase tracking-[0.2em] hover:theme-text transition-all order-1 sm:order-2"
              >
                {t('exit')}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EntityModal;
