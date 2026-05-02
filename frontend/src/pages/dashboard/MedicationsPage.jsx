import { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useNotification } from '../../context/NotificationContext';
import PageHeader from '../../components/ui/PageHeader';
import EntityModal from '../../components/ui/EntityModal';
import ConfirmModal from '../../components/ui/ConfirmModal';
import api from '../../services/api';
import { ClipboardList, Zap, AlertTriangle, Package, Pill, Pencil, Trash2 } from 'lucide-react';

export default function MedicationsPage() {
  const { t } = useTranslation();
  const { user } = useOutletContext();
  const { addNotification } = useNotification();
  const [meds, setMeds] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingMed, setEditingMed] = useState(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  const [currentTime, setCurrentTime] = useState(() => {
    const now = new Date();
    return `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
  });

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      setCurrentTime(`${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`);
    }, 60000);
    return () => clearInterval(timer);
  }, []);

  const getIntakeStatus = (med) => {
    const today = new Date().toISOString().split('T')[0];
    const savedStatus = localStorage.getItem(`med-${med.id}-status-${today}`);
    if (savedStatus === 'taken' || med.intakeStatus === 'taken') return 'taken';

    if (!med.time) return 'pending';
    
    const [cHr, cMin] = currentTime.split(':').map(Number);
    const [mHr, mMin] = med.time.split(':').map(Number);
    
    const currentTotalMins = cHr * 60 + cMin;
    const medTotalMins = mHr * 60 + mMin;
    
    if (currentTotalMins > medTotalMins) {
      return 'missed';
    } else if (medTotalMins - currentTotalMins <= 2) {
      return 'pending';
    } else {
      return 'too_early';
    }
  };

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

  const handleTake = (id) => {
    const today = new Date().toISOString().split('T')[0];
    localStorage.setItem(`med-${id}-status-${today}`, 'taken');
    setMeds(meds.map(m => m.id === id ? { ...m, intakeStatus: 'taken' } : m));
    addNotification('Medication marked as taken', 'success');
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
          { label: 'Total Medications', value: meds.length, icon: <ClipboardList size={28} className="text-blue-500" /> },
          { label: 'Taken Dosages', value: meds.filter(m => getIntakeStatus(m) === 'taken').length, icon: <Zap size={28} className="text-teal-500" /> },
          { label: 'Missed Dosages', value: meds.filter(m => getIntakeStatus(m) === 'missed').length, icon: <AlertTriangle size={28} className="text-red-500" /> },
          { label: 'Medications Refill', value: `3 ${t('dash_days')}`, icon: <Package size={28} className="text-indigo-500" /> },
        ].map(s => (
          <div key={s.label} className="border theme-border hover:border-teal-500 rounded-[2rem] p-8 transition-all group card-hover shadow-sm hover:shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <p className="text-[10px] font-black theme-text uppercase tracking-[0.2em]">{t(s.label)}</p>
              <span className="group-hover:scale-110 transition-transform">{s.icon}</span>
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
                  <div className="w-14 h-14 rounded-2xl theme-bg border theme-border flex items-center justify-center group-hover:scale-110 transition-all shadow-sm">
                    <Pill size={24} className="text-teal-500" />
                  </div>
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
                  <p className="text-[9px] font-black text-teal-600 dark:text-teal-400 uppercase tracking-widest mb-1.5">{t('Days Left')}</p>
                  <p className={`text-sm font-black ${isLow ? 'text-red-500' : 'theme-text'}`}>{med.startDate} to {med.endDate}</p>
                </div>
              </div>

              <div className="flex items-center justify-between gap-6 relative z-10">
                <div className="flex-1">
                  {getIntakeStatus(med) === 'pending' ? (
                    <button 
                      onClick={() => handleTake(med.id)}
                      className="w-full py-3 bg-teal-500/10 hover:bg-teal-500/20 text-teal-600 dark:text-teal-400 border border-teal-500/20 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all"
                    >
                      ✓ {t('Taken')}
                    </button>
                  ) : getIntakeStatus(med) === 'too_early' ? (
                    <button 
                      disabled
                      className="w-full py-3 bg-gray-500/5 text-gray-400 dark:text-gray-500 border border-gray-500/10 rounded-xl text-[10px] font-black uppercase tracking-widest cursor-not-allowed transition-all"
                    >
                      ⏱ Available at {med.time}
                    </button>
                  ) : (
                    <div className={`flex items-center justify-center py-3 px-4 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all ${getIntakeStatus(med) === 'taken' ? 'bg-teal-500/10 text-teal-600 dark:text-teal-400 border-teal-500/20' : 'bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20'}`}>
                      {getIntakeStatus(med) === 'taken' ? `✓ ${t('Taken')}` : `✕ ${t('Missed')}`}
                    </div>
                  )}
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
                      <Pencil size={18} />
                    </button>
                    <button onClick={() => handleRemove(med.id)} className="w-10 h-10 rounded-xl border theme-border flex items-center justify-center theme-text-sub hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 hover:border-red-200 dark:hover:border-red-800 transition-all" title={t('med_remove_title')}>
                      <Trash2 size={18} />
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
