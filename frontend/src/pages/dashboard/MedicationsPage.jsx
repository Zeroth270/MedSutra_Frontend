import { useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useNotification } from '../../context/NotificationContext';
import PageHeader from '../../components/ui/PageHeader';
import EntityModal from '../../components/ui/EntityModal';
import ConfirmModal from '../../components/ui/ConfirmModal';

const INITIAL_MEDS = [
  { id: 1, name: 'Metformin 500mg', type: 'med_type_tablet', frequency: 'med_freq_twice', time: '8 AM & 9 PM', stock: 28, status: 'dash_stable' },
  { id: 2, name: 'Lisinopril 10mg', type: 'med_type_tablet', frequency: 'med_freq_once', time: '2 PM', stock: 14, status: 'dash_stable' },
  { id: 3, name: 'Atorvastatin 20mg', type: 'med_type_tablet', frequency: 'med_freq_once', time: '6 PM', stock: 6, status: 'dash_at_risk' },
  { id: 4, name: 'Aspirin 75mg', type: 'med_type_tablet', frequency: 'med_freq_once', time: '8 AM', stock: 30, status: 'dash_stable' },
];

export default function MedicationsPage() {
  const { t } = useTranslation();
  const { user } = useOutletContext();
  const { addNotification } = useNotification();
  const [meds, setMeds] = useState(INITIAL_MEDS);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingMed, setEditingMed] = useState(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  const isPatient = user?.role?.toLowerCase() === 'patient';

  const fields = [
    { name: 'name', labelKey: 'auth_name_label', placeholderKey: 'med_prompt_name', required: true },
    { 
      name: 'type', 
      labelKey: 'med_type_tablet', 
      type: 'select', 
      options: [
        { value: 'med_type_tablet', labelKey: 'med_type_tablet' },
        { value: 'med_type_capsule', labelKey: 'med_type_capsule' },
        { value: 'med_type_syrup', labelKey: 'med_type_syrup' }
      ] 
    },
    { 
      name: 'frequency', 
      labelKey: 'settings_alert_logic', 
      type: 'select', 
      options: [
        { value: 'med_freq_once', labelKey: 'med_freq_once' },
        { value: 'med_freq_twice', labelKey: 'med_freq_twice' }
      ] 
    },
    { name: 'time', labelKey: 'med_timing', type: 'time', required: true },
    { name: 'stock', labelKey: 'med_stock', type: 'number', required: true }
  ];

  const handleSave = (data) => {
    const processedData = {
      ...data,
      stock: parseInt(data.stock, 10) || 0
    };

    if (editingMed) {
      setMeds(meds.map(m => m.id === editingMed.id ? { ...m, ...processedData } : m));
      addNotification(`${t('notif_updated')} (${processedData.name})`, 'success');
    } else {
      const newMed = {
        ...processedData,
        id: Date.now(),
        status: processedData.stock < 10 ? 'dash_at_risk' : 'dash_stable'
      };
      setMeds([...meds, newMed]);
      addNotification(`${t('notif_added')} (${processedData.name})`, 'success');
    }
  };

  const handleRemove = (id) => {
    setDeletingId(id);
    setConfirmOpen(true);
  };

  const executeRemove = () => {
    const med = meds.find(m => m.id === deletingId);
    setMeds(meds.filter(m => m.id !== deletingId));
    addNotification(`${t('notif_removed')} (${med.name})`, 'warning');
    setDeletingId(null);
    setConfirmOpen(false);
  };

  return (
    <div className="animate-fade-in">
      <PageHeader
        title={t('nav_medications')}
        subtitle={isPatient ? t('med_subtitle_patient') : t('med_subtitle_specialist')}
        actionLabel={!isPatient ? t('med_btn_add') : null}
        onAction={() => {
          setEditingMed(null);
          setModalOpen(true);
        }}
      />

      <ConfirmModal
        isOpen={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        onConfirm={executeRemove}
        title={t('med_remove_title')}
        message={t('med_confirm_delete')}
      />

      <EntityModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={handleSave}
        title={editingMed ? t('dash_optimization') : t('dash_register_new')}
        initialData={editingMed || { type: 'med_type_tablet', frequency: 'med_freq_once', stock: 30 }}
        fields={fields}
      />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {[
          { label: 'med_stat_total', value: meds.length, icon: '📋' },
          { label: 'med_stat_active', value: meds.filter(m => m.status === 'dash_stable').length, icon: '⚡' },
          { label: 'med_stat_critical', value: meds.filter(m => m.status === 'dash_at_risk').length, icon: '⚠️' },
          { label: 'med_stat_refill', value: `3 ${t('dash_days')}`, icon: '📦' },
        ].map(s => (
          <div key={s.label} className="border theme-border hover:border-teal-500 rounded-[2rem] p-8 transition-all group card-hover shadow-sm hover:shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <p className="text-[10px] font-black theme-text uppercase tracking-[0.2em]">{t(s.label)}</p>
              <span className="text-xl group-hover:scale-110 transition-transform">{s.icon}</span>
            </div>
            <p className="text-4xl font-black theme-text mb-1 group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors">{s.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {meds.map((med) => {
          const isLow = med.status === 'dash_at_risk';
          return (
            <div key={med.id} className="border theme-border hover:border-teal-500 rounded-[2.5rem] p-8 transition-all group card-hover relative overflow-hidden shadow-sm hover:shadow-2xl">
              <div className="flex items-start justify-between mb-8 relative z-10">
                <div className="flex items-center gap-5">
                  <div className="w-14 h-14 rounded-2xl theme-bg flex items-center justify-center text-3xl group-hover:scale-110 transition-all shadow-sm">💊</div>
                  <div>
                    <h3 className="text-xl font-black theme-text  transition-colors uppercase tracking-tight">{med.name}</h3>
                    <p className="text-[10px] text-teal-600 dark:text-teal-400 font-black mt-1.5 uppercase tracking-widest">{t(med.type)} · {t(med.frequency)}</p>
                  </div>
                </div>
                <span className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all ${isLow
                  ? 'border-red-200 dark:border-red-900/30 text-red-600 dark:text-red-400'
                  : 'border-green-200 dark:border-green-900/30 text-green-700 dark:text-green-400'}`}>
                  {t(med.status)}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-6 mb-8 p-6 rounded-[1.5rem] relative z-10 shadow-sm border theme-border hover:border-teal-500/30 transition-colors">
                <div>
                  <p className="text-[9px] font-black text-teal-600 dark:text-teal-400 uppercase tracking-widest mb-1.5">{t('med_timing')}</p>
                  <p className="text-sm font-black theme-text">{med.time}</p>
                </div>
                <div>
                  <p className="text-[9px] font-black text-teal-600 dark:text-teal-400 uppercase tracking-widest mb-1.5">{t('med_stock')}</p>
                  <p className={`text-sm font-black ${isLow ? 'text-red-500' : 'theme-text'}`}>{med.stock} {t('med_units_left')}</p>
                </div>
              </div>

              <div className="flex items-center justify-between gap-6 relative z-10">
                <div className="flex-1">
                  <div className="flex justify-between items-center mb-2.5">
                    <span className="text-[9px] font-black theme-text-sub uppercase tracking-widest">{t('med_inventory_level')}</span>
                    <span className="text-[9px] font-black theme-text-sub">{Math.round(((30 - med.stock) / 30) * 100)}%</span>
                  </div>
                  <div className="theme-bg rounded-full h-2 border theme-border overflow-hidden shadow-inner">
                    <div className={`h-full rounded-full transition-all duration-700 ${isLow ? 'bg-red-500 shadow-[0_0_12px_rgba(239,68,68,0.3)]' : 'bg-teal-500 shadow-[0_0_12px_rgba(20,184,166,0.3)]'}`} style={{ width: `${((30 - med.stock) / 30) * 100}%` }} />
                  </div>
                </div>
                {!isPatient && (
                  <div className="flex gap-2">
                    <button 
                      onClick={() => {
                        setEditingMed(med);
                        setModalOpen(true);
                      }} 
                      className="w-10 h-10 rounded-xl border theme-border flex items-center justify-center theme-text-sub hover:theme-text hover:bg-gray-100 dark:hover:bg-gray-800 transition-all"
                    >
                      ✎
                    </button>
                    <button onClick={() => handleRemove(med.id)} className="w-10 h-10 rounded-xl border theme-border flex items-center justify-center theme-text-sub hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 hover:border-red-200 dark:hover:border-red-800 transition-all" title={t('med_remove_title')}>
                      🗑️
                    </button>
                  </div>
                )}
              </div>

              <div className="absolute -right-10 -bottom-10 w-32 h-32 bg-teal-500/5 rounded-full blur-3xl" />
            </div>
          );
        })}
      </div>
    </div>
  );
}
