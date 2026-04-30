import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNotification } from '../../context/NotificationContext';
import PageHeader from '../../components/ui/PageHeader';
import EntityModal from '../../components/ui/EntityModal';
import ConfirmModal from '../../components/ui/ConfirmModal';

const INITIAL_REMINDERS = [
  { id: 1, name: 'Atorvastatin', time: '09:00 AM', status: 'Active', type: 'Tablet', next: 'Tomorrow', icon: '💊' },
  { id: 2, name: 'Lisinopril', time: '08:00 PM', status: 'Active', type: 'Tablet', next: 'In 2 hrs', icon: '💊' },
];

export default function RemindersPage() {
  const { t } = useTranslation();
  const { addNotification } = useNotification();
  const [reminders, setReminders] = useState(INITIAL_REMINDERS);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingReminder, setEditingReminder] = useState(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  const fields = [
    { name: 'name', labelKey: 'med_prompt_name', placeholder: 'e.g. Lisinopril', required: true },
    { name: 'time', labelKey: 'med_prompt_time', type: 'time', required: true },
    { 
      name: 'type', 
      labelKey: 'auth_select_role', 
      type: 'select', 
      options: [
        { value: 'Tablet', labelKey: 'med_type_tablet' },
        { value: 'Capsule', labelKey: 'med_type_capsule' },
        { value: 'Syrup', labelKey: 'med_type_syrup' }
      ] 
    }
  ];

  const handleSave = (data) => {
    if (editingReminder) {
      setReminders(reminders.map(r => r.id === editingReminder.id ? { ...r, ...data } : r));
      addNotification(`${t('notif_updated')} (${data.name})`, 'success');
    } else {
      setReminders([...reminders, { ...data, id: Date.now(), status: 'Active', next: 'Soon', icon: '💊' }]);
      addNotification(`${t('notif_added')} (${data.name})`, 'success');
    }
  };

  const handleRemove = (id) => {
    setDeletingId(id);
    setConfirmOpen(true);
  };

  const executeRemove = () => {
    const reminder = reminders.find(r => r.id === deletingId);
    setReminders(reminders.filter(r => r.id !== deletingId));
    addNotification(`${t('notif_removed')} (${reminder.name})`, 'warning');
    setDeletingId(null);
    setConfirmOpen(false);
  };

  const handleToggle = (id) => {
    const reminder = reminders.find(r => r.id === id);
    const newStatus = reminder.status === 'Active' ? 'Snoozed' : 'Active';
    setReminders(reminders.map(r =>
      r.id === id
        ? { ...r, status: newStatus }
        : r
    ));
    addNotification(`${reminder.name}: ${newStatus === 'Active' ? t('notif_activated') : t('notif_snoozed')}`, newStatus === 'Active' ? 'success' : 'info');
  };

  return (
    <div className="animate-fade-in">
      <PageHeader
        title={t('nav_reminders')}
        subtitle={t('rem_subtitle')}
        actionLabel={t('med_btn_add')}
        onAction={() => {
          setEditingReminder(null);
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
        title={editingReminder ? t('dash_optimization') : t('med_btn_add')}
        initialData={editingReminder}
        fields={fields}
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        {[
          { label: 'dash_active_accounts', value: reminders.filter(r => r.status === 'Active').length, color: 'text-teal-600' },
          { label: 'dash_missed', value: reminders.filter(r => r.status === 'Snoozed').length, color: 'text-yellow-500' },
          { label: 'med_stat_total', value: reminders.length, color: 'theme-text' },
        ].map(s => (
          <div key={s.label} className="border theme-border hover:border-teal-500 rounded-[2rem] p-8 transition-all card-hover group shadow-sm hover:shadow-xl">
            <p className="text-[10px] font-black theme-text-sub uppercase tracking-[0.2em] mb-4">{t(s.label)}</p>
            <p className={`text-4xl font-black ${s.color} group-hover:scale-110 transition-transform origin-left`}>{s.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {reminders.map((r) => {
          const isActive = r.status === 'Active';
          return (
            <div key={r.id} className="border theme-border hover:border-teal-500 rounded-[2.5rem] p-8 transition-all group card-hover relative overflow-hidden shadow-sm hover:shadow-2xl">
              <div className={`absolute top-0 right-0 w-32 h-32 blur-[60px] opacity-10 -mr-16 -mt-16 transition-all group-hover:opacity-20 ${isActive ? 'bg-teal-500' : 'bg-yellow-500'}`} />

              <div className="flex items-start justify-between mb-8 relative z-10">
                <div className="flex items-center gap-5">
                  <div className="w-16 h-16 rounded-2xl theme-bg flex items-center justify-center text-3xl group-hover:scale-110 transition-all shadow-lg">
                    {r.icon}
                  </div>
                  <div>
                    <h3 className="text-xl font-black theme-text group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors uppercase tracking-tight">{r.name}</h3>
                    <p className="text-[10px] theme-text-sub font-black mt-1.5 uppercase tracking-widest opacity-70">{t('med_timing')}</p>
                  </div>
                </div>
                <button
                  onClick={() => handleToggle(r.id)}
                  className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all active:scale-95 ${isActive
                    ? 'border-green-200 dark:border-green-900/30 text-green-700 dark:text-green-400'
                    : 'border-yellow-200 dark:border-yellow-900/30 text-yellow-700 dark:text-yellow-500'}`}
                >
                  {t(isActive ? 'dash_stable' : 'dash_at_risk')}
                </button>
              </div>

              <div className="flex items-end justify-between relative z-10">
                <div>
                  <p className="text-[10px] font-black theme-text-sub uppercase tracking-widest mb-2 px-1">{t('med_timing')}</p>
                  <p className="text-5xl font-black theme-text group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors tracking-tighter">{r.time}</p>
                  <div className="mt-6 flex items-center gap-2">
                    <div className={`w-1.5 h-1.5 rounded-full ${isActive ? 'bg-teal-500 animate-pulse' : 'bg-gray-400'}`} />
                    <p className="text-[10px] theme-text-sub font-black uppercase tracking-widest opacity-60">{t('dash_stat_next')}: {r.next}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button 
                    onClick={() => {
                      setEditingReminder(r);
                      setModalOpen(true);
                    }} 
                    className="w-12 h-12 rounded-2xl border theme-border flex items-center justify-center theme-text-sub hover:theme-text hover:bg-gray-100 dark:hover:bg-gray-800 transition-all shadow-sm" 
                    title="Edit"
                  >
                    ✏️
                  </button>
                  <button onClick={() => handleToggle(r.id)} className="w-12 h-12 rounded-2xl border theme-border flex items-center justify-center theme-text-sub hover:theme-text hover:bg-gray-100 dark:hover:bg-gray-800 transition-all shadow-sm" title="Toggle Status">
                    {isActive ? '⏸️' : '▶️'}
                  </button>
                  <button onClick={() => handleRemove(r.id)} className="w-12 h-12 rounded-2xl border theme-border flex items-center justify-center theme-text-sub hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all shadow-sm" title="Delete">
                    🗑️
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
