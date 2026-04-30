import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import PageHeader from '../../components/ui/PageHeader';

const INITIAL_REMINDERS = [
  { id: 1, med: 'Metformin 500mg', time: '8:00 AM', days: 'Every Day', status: 'Active', next: 'Tomorrow 8:00 AM', icon: '☀️' },
  { id: 2, med: 'Lisinopril 10mg', time: '2:00 PM', days: 'Every Day', status: 'Active', next: 'Today 2:00 PM', icon: '🌤️' },
  { id: 3, med: 'Atorvastatin 20mg', time: '6:00 PM', days: 'Every Day', status: 'Snoozed', next: 'Today 6:00 PM', icon: '🌆' },
  { id: 4, med: 'Metformin 500mg', time: '9:00 PM', days: 'Every Day', status: 'Active', next: 'Today 9:00 PM', icon: '🌙' },
];

export default function RemindersPage() {
  const { t } = useTranslation();
  const [reminders, setReminders] = useState(INITIAL_REMINDERS);

  const handleAdd = () => {
    const med = window.prompt(t('med_prompt_name'));
    if (!med) return;
    const time = window.prompt(t('med_prompt_time'), '10:00 PM');

    const newReminder = {
      id: Date.now(),
      med,
      time: time || '10:00 PM',
      days: 'Every Day',
      status: 'Active',
      next: 'Today ' + (time || '10:00 PM'),
      icon: '🔔'
    };
    setReminders([...reminders, newReminder]);
  };

  const handleRemove = (id) => {
    if (window.confirm(t('med_confirm_delete'))) {
      setReminders(reminders.filter(r => r.id !== id));
    }
  };

  const handleToggle = (id) => {
    setReminders(reminders.map(r =>
      r.id === id
        ? { ...r, status: r.status === 'Active' ? 'Snoozed' : 'Active' }
        : r
    ));
  };

  return (
    <div className="animate-fade-in">
      <PageHeader
        title={t('nav_reminders')}
        subtitle={t('rem_subtitle')}
        actionLabel={t('dash_register_new')}
        onAction={handleAdd}
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
                    <h3 className="text-xl font-black theme-text group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors uppercase tracking-tight">{r.med}</h3>
                    <p className="text-[10px] theme-text-sub font-black mt-1.5 uppercase tracking-widest opacity-70">{r.days}</p>
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
