const reminders = [
  { med: 'Metformin 500mg',   time: '8:00 AM', days: 'Every Day', status: 'Active',  next: 'Tomorrow 8:00 AM' },
  { med: 'Lisinopril 10mg',   time: '2:00 PM', days: 'Every Day', status: 'Active',  next: 'Today 2:00 PM' },
  { med: 'Atorvastatin 20mg', time: '6:00 PM', days: 'Every Day', status: 'Snoozed', next: 'Today 6:00 PM' },
  { med: 'Metformin 500mg',   time: '9:00 PM', days: 'Every Day', status: 'Active',  next: 'Today 9:00 PM' },
];

export default function Reminders() {
  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-black text-gray-900 tracking-tight">Reminders</h1>
          <p className="text-gray-500 text-sm mt-1">Smart alerts to keep you on track.</p>
        </div>
        <button className="btn-primary px-5 py-2.5 rounded-lg text-sm">
          New Reminder
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {[
          { label: 'Active',   value: reminders.filter(r => r.status === 'Active').length },
          { label: 'Snoozed',  value: reminders.filter(r => r.status === 'Snoozed').length },
          { label: 'Total Set', value: reminders.length },
        ].map(s => (
          <div key={s.label} className="bg-white border border-gray-100 rounded-xl p-5">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">{s.label}</p>
            <p className="text-2xl font-black text-gray-900">{s.value}</p>
          </div>
        ))}
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {reminders.map((r, i) => {
          const isActive = r.status === 'Active';
          return (
            <div key={i} className="bg-white border border-gray-100 rounded-xl p-6 hover:shadow-sm transition-all">
              <div className="flex items-start justify-between mb-5">
                <div>
                  <p className="font-semibold text-gray-900 text-sm">{r.med}</p>
                  <p className="text-xs text-gray-400 mt-1">{r.days}</p>
                </div>
                <span className={`text-xs font-semibold px-2.5 py-1 rounded-full flex-shrink-0 ${isActive ? 'bg-green-50 text-green-700' : 'bg-yellow-50 text-yellow-700'}`}>
                  {r.status}
                </span>
              </div>

              <div className="flex items-end justify-between">
                <div>
                  <p className="text-3xl font-black text-gray-900">{r.time}</p>
                  <p className="text-xs text-gray-400 mt-2">Next: {r.next}</p>
                </div>
                <div className="flex gap-2">
                  <button className="text-xs border border-gray-200 hover:bg-gray-100 px-3 py-1.5 rounded-lg text-gray-500 transition-all font-medium">
                    Edit
                  </button>
                  <button className="text-xs border border-gray-200 hover:bg-red-50 hover:text-red-500 hover:border-red-100 px-3 py-1.5 rounded-lg text-gray-400 transition-all font-medium">
                    Delete
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
