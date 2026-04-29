import { useState } from 'react';
import PageHeader from '../../components/ui/PageHeader';

const INITIAL_REMINDERS = [
  { id: 1, med: 'Metformin 500mg', time: '8:00 AM', days: 'Every Day', status: 'Active', next: 'Tomorrow 8:00 AM', icon: '☀️' },
  { id: 2, med: 'Lisinopril 10mg', time: '2:00 PM', days: 'Every Day', status: 'Active', next: 'Today 2:00 PM', icon: '🌤️' },
  { id: 3, med: 'Atorvastatin 20mg', time: '6:00 PM', days: 'Every Day', status: 'Snoozed', next: 'Today 6:00 PM', icon: '🌆' },
  { id: 4, med: 'Metformin 500mg', time: '9:00 PM', days: 'Every Day', status: 'Active', next: 'Today 9:00 PM', icon: '🌙' },
];

export default function RemindersPage() {
  const [reminders, setReminders] = useState(INITIAL_REMINDERS);

  const handleAdd = () => {
    const med = window.prompt('Enter medication for reminder:');
    if (!med) return;
    const time = window.prompt('Enter time (e.g. 10:00 PM):', '10:00 PM');

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
    if (window.confirm('Disable this clinical alert?')) {
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
        title="Reminders"
        subtitle="Smart clinical alerts to keep your schedule precise."
        actionLabel="+ New Reminder"
        onAction={handleAdd}
      />

      {/* Stats Boxes */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        {[
          { label: 'Active Alerts', value: reminders.filter(r => r.status === 'Active').length, color: 'text-teal-600' },
          { label: 'Snoozed', value: reminders.filter(r => r.status === 'Snoozed').length, color: 'text-yellow-500' },
          { label: 'Total Set', value: reminders.length, color: 'theme-text' },
        ].map(s => (
          <div key={s.label} className="theme-surface border theme-border rounded-[2rem] p-8 shadow-sm hover:shadow-xl transition-all card-hover group">
            <p className="text-[10px] font-black theme-text-sub uppercase tracking-[0.2em] mb-4">{s.label}</p>
            <p className={`text-4xl font-black ${s.color} group-hover:scale-110 transition-transform origin-left`}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Reminders Boxes */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {reminders.map((r) => {
          const isActive = r.status === 'Active';
          return (
            <div key={r.id} className="theme-surface border theme-border rounded-[2.5rem] p-8 shadow-sm hover:shadow-2xl transition-all group card-hover relative overflow-hidden">
              {/* Decorative Glow */}
              <div className={`absolute top-0 right-0 w-32 h-32 blur-[60px] opacity-10 -mr-16 -mt-16 transition-all group-hover:opacity-20 ${isActive ? 'bg-teal-500' : 'bg-yellow-500'}`} />

              <div className="flex items-start justify-between mb-8 relative z-10">
                <div className="flex items-center gap-5">
                  <div className="w-16 h-16 rounded-2xl theme-bg border theme-border flex items-center justify-center text-3xl group-hover:scale-110 group-hover:rotate-6 transition-all shadow-lg">
                    {r.icon}
                  </div>
                  <div>
                    <h3 className="text-xl font-black theme-text group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors uppercase tracking-tight">{r.med}</h3>
                    <p className="text-[10px] theme-text-sub font-black mt-1.5 uppercase tracking-widest opacity-70">{r.days}</p>
                  </div>
                </div>
                <button
                  onClick={() => handleToggle(r.id)}
                  className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border shadow-sm transition-all active:scale-95 ${isActive
                    ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 border-green-100 dark:border-green-800/50'
                    : 'bg-yellow-50 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-400 border-yellow-100 dark:border-yellow-800/50'}`}
                >
                  {r.status}
                </button>
              </div>

              <div className="flex items-end justify-between relative z-10">
                <div>
                  <p className="text-[10px] font-black theme-text-sub uppercase tracking-widest mb-2 px-1">Scheduled Time</p>
                  <p className="text-5xl font-black theme-text group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors tracking-tighter">{r.time}</p>
                  <div className="mt-6 flex items-center gap-2">
                    <div className={`w-1.5 h-1.5 rounded-full ${isActive ? 'bg-teal-500 animate-pulse' : 'bg-gray-400'}`} />
                    <p className="text-[10px] theme-text-sub font-black uppercase tracking-widest opacity-60">Next: {r.next}</p>
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

        {/* Add New Reminder Box */}
        {/* <button onClick={handleAdd} className="border-2 border-dashed theme-border rounded-[2.5rem] p-10 flex flex-col items-center justify-center gap-5 hover:border-teal-300 dark:hover:border-teal-700 hover:theme-bg transition-all group min-h-[300px] shadow-sm">
          <div className="w-16 h-16 rounded-2xl theme-bg border theme-border flex items-center justify-center theme-text-sub group-hover:bg-teal-100 dark:group-hover:bg-teal-900 group-hover:text-teal-600 transition-all shadow-md">
            <span className="text-3xl font-black">+</span>
          </div>
          <div className="text-center">
            <p className="text-[10px] font-black theme-text group-hover:text-teal-700 dark:group-hover:text-teal-400 uppercase tracking-[0.2em] transition-colors mb-1">Configure New Alert</p>
            <p className="text-[9px] theme-text-sub font-bold uppercase tracking-[0.2em] opacity-60">Set smart reminder logic</p>
          </div>
        </button> */}
      </div>
    </div>
  );
}
