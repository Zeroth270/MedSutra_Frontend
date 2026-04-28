import { useOutletContext } from 'react-router-dom';
import { Link } from 'react-router-dom';
import ROUTES from '../../constants/routes';

const stats = [
  { label: 'Doses Taken', value: '142', sub: 'This month', border: 'border-gray-200' },
  { label: 'Adherence Rate', value: '94%', sub: 'Last 30 days', border: 'border-green-200' },
  { label: 'Missed Doses', value: '9', sub: 'This month', border: 'border-red-200' },
  { label: 'Next Reminder', value: '8 PM', sub: 'Metformin 500mg', border: 'border-blue-200' },
];

const log = [
  { time: '8:00 AM', med: 'Metformin 500mg', status: 'Taken', dot: 'bg-green-400', badge: 'bg-green-50 text-green-700' },
  { time: '2:00 PM', med: 'Lisinopril 10mg', status: 'Taken', dot: 'bg-green-400', badge: 'bg-green-50 text-green-700' },
  { time: '6:00 PM', med: 'Atorvastatin 20mg', status: 'Missed', dot: 'bg-red-400', badge: 'bg-red-50 text-red-600' },
  { time: '9:00 PM', med: 'Metformin 500mg', status: 'Pending', dot: 'bg-yellow-400', badge: 'bg-yellow-50 text-yellow-700' },
];

const week = [
  { day: 'Mon', pct: 100 }, { day: 'Tue', pct: 100 }, { day: 'Wed', pct: 66 },
  { day: 'Thu', pct: 100 }, { day: 'Fri', pct: 100 }, { day: 'Sat', pct: 33 }, { day: 'Sun', pct: 0 },
];

export default function OverviewPage() {
  const { user } = useOutletContext();
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good Morning' : hour < 17 ? 'Good Afternoon' : 'Good Evening';

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-black text-gray-900 tracking-tight">
          {greeting}, {user.name.split(' ')[0]}
        </h1>
        <p className="text-gray-500 text-sm mt-1.5">Here is your medication summary for today.</p>
      </div>

      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
        {stats.map(s => (
          <div key={s.label} className={`bg-white border ${s.border} rounded-xl p-5`}>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">{s.label}</p>
            <p className="text-3xl font-black text-gray-900 mb-1">{s.value}</p>
            <p className="text-xs text-gray-400">{s.sub}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mb-5">
        <div className="lg:col-span-2 bg-white border border-gray-100 rounded-xl overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-50">
            <h2 className="font-bold text-gray-900 text-sm">Today's Medication Log</h2>
            <span className="text-xs text-gray-400">
              {new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
            </span>
          </div>
          <div className="divide-y divide-gray-50">
            {log.map((item, i) => (
              <div key={i} className="flex items-center justify-between px-6 py-4">
                <div className="flex items-center gap-4">
                  <div className={`w-2 h-2 rounded-full ${item.dot} flex-shrink-0`} />
                  <span className="text-xs text-gray-400 w-14 font-medium">{item.time}</span>
                  <span className="text-sm text-gray-700 font-medium">{item.med}</span>
                </div>
                <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${item.badge}`}>{item.status}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white border border-gray-100 rounded-xl p-6">
          <h2 className="font-bold text-gray-900 text-sm mb-5">Weekly Adherence</h2>
          <div className="space-y-4">
            {week.map(({ day, pct }) => (
              <div key={day} className="flex items-center gap-3">
                <span className="text-xs text-gray-400 w-7 font-medium">{day}</span>
                <div className="flex-1 bg-gray-100 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full transition-all duration-500 ${pct === 100 ? 'bg-gray-900' : pct > 50 ? 'bg-gray-500' : pct > 0 ? 'bg-gray-400' : 'bg-gray-200'}`}
                    style={{ width: `${pct}%` }}
                  />
                </div>
                <span className="text-xs text-gray-500 w-8 text-right font-medium">{pct}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-gray-900 rounded-xl p-7 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5">
        <div>
          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">AI Insight</p>
          <h3 className="text-lg font-bold text-white mb-2">Your adherence is above average</h3>
          <p className="text-gray-400 text-sm leading-relaxed">
            Consistent medication intake improves long-term health outcomes by up to 40%. Keep it up.
          </p>
        </div>
        <Link
          to={ROUTES.DASHBOARD_RISK_REPORT}
          className="flex-shrink-0 bg-white text-gray-900 font-semibold px-5 py-2.5 rounded-lg text-sm hover:bg-gray-100 transition-all no-underline whitespace-nowrap"
        >
          View Full Report
        </Link>
      </div>
    </div>
  );
}
