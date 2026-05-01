import { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useNotification } from '../../context/NotificationContext';
import PageHeader from '../../components/ui/PageHeader';
import EntityModal from '../../components/ui/EntityModal';
import ConfirmModal from '../../components/ui/ConfirmModal';
import api from '../../services/api';

export default function MedicationsPage() {
  const { t } = useTranslation();
  const { user } = useOutletContext();
  const { addNotification } = useNotification();
  const [meds, setMeds] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingMed, setEditingMed] = useState(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  const isDoctor = user?.role?.toLowerCase() === 'doctor';

  const baseFields = [
    { name: 'name', labelKey: 'auth_name_label', placeholderKey: 'med_prompt_name', required: true },
    { name: 'dosage', labelKey: 'med_dosage', type: 'text', placeholderKey: 'e.g., 500mg', required: true },
    { 
      name: 'frequency', 
      labelKey: 'settings_alert_logic', 
      type: 'select', 
      options: [
        { value: 'Daily', labelKey: 'med_freq_once' },
        { value: 'Twice a Day', labelKey: 'med_freq_twice' }
      ] 
    },
    { name: 'time', labelKey: 'med_timing', type: 'time', required: true },
    { name: 'startDate', labelKey: 'start_date', type: 'date', required: true },
    { name: 'endDate', labelKey: 'end_date', type: 'date', required: true }
  ];

  const fields = isDoctor ? [
    { name: 'patientId', labelKey: 'Patient ID', type: 'number', required: true },
    ...baseFields
  ] : baseFields;

  const fetchMeds = async () => {
    if (!user?.id) return;
    try {
      // Backend returns medication list for the patient
      const data = await api.get(`/medications/${user.id}`);
      // Ensure we map medId to id for internal state if needed, but backend gives medId
      const formatted = data.map(m => ({ ...m, id: m.medId, status: 'dash_stable' }));
      setMeds(formatted);
    } catch (err) {
      console.error('Failed to fetch medications:', err);
    }
  };

  useEffect(() => {
    fetchMeds();
  }, [user?.id]);

  const handleSave = async (data) => {
    try {
      if (editingMed) {
        // Assume PUT /medications/{id} exists, if not we will just update locally for now
        // await api.put(`/medications/${editingMed.id}`, { ...data, patientId: user.id });
        setMeds(meds.map(m => m.id === editingMed.id ? { ...m, ...data } : m));
        addNotification(`${t('notif_updated')} (${data.name})`, 'success');
      } else {
        const payload = {
          patientId: data.patientId || user.id,
          name: data.name,
          dosage: data.dosage,
          time: data.time,
          frequency: data.frequency,
          startDate: data.startDate,
          endDate: data.endDate
        };
        const newMed = await api.post('/medications', payload);
        setMeds([...meds, { ...newMed, id: newMed.medId || Date.now(), status: 'dash_stable' }]);
        addNotification(`${t('notif_added')} (${data.name})`, 'success');
      }
    } catch (err) {
      console.error('Failed to save medication:', err);
      addNotification('Failed to save medication', 'error');
    }
  };

  const handleRemove = (id) => {
    setDeletingId(id);
    setConfirmOpen(true);
  };

  const executeRemove = async () => {
    try {
      const med = meds.find(m => m.id === deletingId);
      await api.delete(`/medications/${deletingId}`);
      setMeds(meds.filter(m => m.id !== deletingId));
      addNotification(`${t('notif_removed')} (${med.name})`, 'warning');
    } catch (err) {
      console.error('Failed to delete medication:', err);
      addNotification('Failed to delete medication', 'error');
    } finally {
      setDeletingId(null);
      setConfirmOpen(false);
    }
  };

  return (
    <div className="animate-fade-in">
      <PageHeader
        title={t('nav_medications')}
        subtitle={!isDoctor ? t('med_subtitle_patient') : t('med_subtitle_specialist')}
        actionLabel={isDoctor ? t('med_btn_add') : null}
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
        initialData={editingMed || { frequency: 'Daily', time: '08:00', startDate: new Date().toISOString().split('T')[0], endDate: new Date().toISOString().split('T')[0] }}
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
                    <p className="text-[10px] text-teal-600 dark:text-teal-400 font-black mt-1.5 uppercase tracking-widest">{med.dosage} · {med.frequency}</p>
                  </div>
                </div>
                <span className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all ${isLow
                  ? 'border-red-200 dark:border-red-900/30 text-red-600 dark:text-red-400'
                  : 'border-green-200 dark:border-green-900/30 text-green-700 dark:text-green-400'}`}>
                  {t(med.status || 'dash_stable')}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-6 mb-8 p-6 rounded-[1.5rem] relative z-10 shadow-sm border theme-border hover:border-teal-500/30 transition-colors">
                <div>
                  <p className="text-[9px] font-black text-teal-600 dark:text-teal-400 uppercase tracking-widest mb-1.5">{t('med_timing')}</p>
                  <p className="text-sm font-black theme-text">{med.time}</p>
                </div>
                <div>
                  <p className="text-[9px] font-black text-teal-600 dark:text-teal-400 uppercase tracking-widest mb-1.5">Date Range</p>
                  <p className={`text-sm font-black ${isLow ? 'text-red-500' : 'theme-text'}`}>{med.startDate} to {med.endDate}</p>
                </div>
              </div>

              <div className="flex items-center justify-between gap-6 relative z-10">
                <div className="flex-1">
                  <div className="flex justify-between items-center mb-2.5">
                    <span className="text-[9px] font-black theme-text-sub uppercase tracking-widest">Progress</span>
                    <span className="text-[9px] font-black theme-text-sub">50%</span>
                  </div>
                  <div className="theme-bg rounded-full h-2 border theme-border overflow-hidden shadow-inner">
                    <div className={`h-full rounded-full transition-all duration-700 ${isLow ? 'bg-red-500 shadow-[0_0_12px_rgba(239,68,68,0.3)]' : 'bg-teal-500 shadow-[0_0_12px_rgba(20,184,166,0.3)]'}`} style={{ width: `50%` }} />
                  </div>
                </div>
                {isDoctor && (
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
