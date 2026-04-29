import { useOutletContext } from 'react-router-dom';
import { useState } from 'react';
import PageHeader from '../../components/ui/PageHeader';

const NOTIFS = ['Medication Reminders', 'Missed Dose Alerts', 'Weekly Summary', 'Caregiver Alerts', 'AI Insight Reports'];

export default function SettingsPage() {
  const { user } = useOutletContext();
  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [phone, setPhone] = useState(user.phone || '+91 00000-00000');
  const [saved, setSaved] = useState(false);
  const [notifs, setNotifs] = useState(NOTIFS.reduce((a, n) => ({ ...a, [n]: true }), {}));

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="animate-fade-in space-y-10">
      <PageHeader title="Clinical Settings" subtitle="Configure your identity, security, and notification triggers." />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {/* Identity Box */}
          <div className="rounded-[3rem] p-10 transition-all">
            <h2 className="font-black theme-text text-[10px] uppercase tracking-[0.2em] mb-10 px-1">Identity & Authentication</h2>

            <div className="flex items-center gap-6 mb-12 p-8 rounded-[2.5rem] shadow-sm border theme-border hover:border-teal-500/30 transition-colors">
              <div className="w-20 h-20 rounded-2xl bg-gray-900 dark:bg-teal-600 flex items-center justify-center font-black text-white text-3xl flex-shrink-0 shadow-2xl border-4 border-white dark:border-gray-800">{user.avatar}</div>
              <div>
                <p className="font-black theme-text text-2xl uppercase tracking-tight">{user.name}</p>
                <p className="text-[10px] theme-text-sub font-black uppercase tracking-[0.2em] mt-1 opacity-70">{user.role} · Verified Patient Entity</p>
              </div>
            </div>

            <div className="space-y-8">
              <div className="group">
                <label className="block text-[10px] font-black theme-text-sub uppercase tracking-[0.2em] mb-3 px-2 group-focus-within:text-teal-600 transition-colors">Legal Full Name</label>
                <input value={name} onChange={e => setName(e.target.value)} className="w-full px-6 py-4 rounded-2xl text-sm theme-text border border-transparent focus:outline-none focus:border-teal-500 hover:border-teal-500/30 focus:ring-4 focus:ring-teal-500/5 transition-all font-black uppercase tracking-tight" />
              </div>
              <div className="group">
                <label className="block text-[10px] font-black theme-text-sub uppercase tracking-[0.2em] mb-3 px-2 group-focus-within:text-teal-600 transition-colors">Primary Email Node</label>
                <input value={email} onChange={e => setEmail(e.target.value)} type="email" className="w-full px-6 py-4 rounded-2xl text-sm theme-text border border-transparent focus:outline-none focus:border-teal-500 hover:border-teal-500/30 focus:ring-4 focus:ring-teal-500/5 transition-all font-black uppercase tracking-tight" />
              </div>
              <div className="group">
                <label className="block text-[10px] font-black theme-text-sub uppercase tracking-[0.2em] mb-3 px-2 group-focus-within:text-teal-600 transition-colors">Emergency Contact Phone</label>
                <input value={phone} onChange={e => setPhone(e.target.value)} type="tel" className="w-full px-6 py-4 rounded-2xl text-sm theme-text border border-transparent focus:outline-none focus:border-teal-500 hover:border-teal-500/30 focus:ring-4 focus:ring-teal-500/5 transition-all font-black uppercase tracking-tight" />
              </div>
              <div className="group opacity-60">
                <label className="block text-[10px] font-black theme-text-sub uppercase tracking-[0.2em] mb-3 px-2">Assigned Clinical Role</label>
                <input value={user.role} readOnly className="w-full px-6 py-4 rounded-2xl text-[10px] theme-text-sub cursor-not-allowed font-black uppercase tracking-[0.2em]" />
              </div>

              <div className="pt-4">
                <button
                  onClick={handleSave}
                  className={`w-full py-5 rounded-2xl text-xs font-black uppercase tracking-[0.2em] shadow-2xl transition-all active:scale-95 ${saved ? 'bg-green-600 text-white shadow-green-500/30' : 'bg-gray-900 dark:bg-teal-600 text-white shadow-teal-500/20'}`}
                >
                  {saved ? '✓ Parameters Synced' : 'Commit Changes'}
                </button>
              </div>
            </div>
          </div>

          {/* Security Box */}
          <div className="border border-red-100 dark:border-red-900/30 hover:border-red-500 rounded-[3rem] p-10 hover:shadow-2xl hover:shadow-red-500/5 transition-all group">
            {/* <h2 className="font-black text-red-500 dark:text-red-400 text-[10px] uppercase tracking-[0.2em] mb-8 px-1">Restrictive Actions</h2> */}
            <div className="flex flex-col md:flex-row md:items-center justify-between p-8 bg-red-50 dark:bg-red-900/10 rounded-[2rem] border border-red-100 dark:border-red-900/20 gap-6">
              <div>
                <p className="text-lg font-black text-red-600 dark:text-red-400 uppercase tracking-tight">Delete User Account</p>
              </div>
              <button className="w-full md:w-auto text-[10px] font-black text-red-600 dark:text-red-400 border-2 border-red-200 dark:border-red-900/50 hover:bg-red-600 hover:text-white px-8 py-4 rounded-xl transition-all uppercase tracking-[0.2em] shadow-sm active:scale-90">Delete</button>
            </div>
          </div>
        </div>

        {/* Sidebar Settings Column */}
        <div className="space-y-8">
          <div className="rounded-[3rem] p-10 transition-all">
            <h2 className="font-black theme-text text-[10px] uppercase tracking-[0.2em] mb-3">Alert Logic</h2>
            <p className="text-[10px] theme-text-sub font-bold uppercase tracking-widest mb-10 opacity-70">Personalize real-time triggers</p>

            <div className="space-y-2">
              {NOTIFS.map(n => (
                <div key={n} className="flex items-center justify-between py-5 border-b theme-border last:border-0 group">
                  <span className="text-xs font-black theme-text group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors uppercase tracking-tight">{n}</span>
                  <button
                    onClick={() => setNotifs(prev => ({ ...prev, [n]: !prev[n] }))}
                    className={`relative w-14 h-8 rounded-full transition-all duration-500 flex-shrink-0 p-1.5 border ${notifs[n] ? 'bg-teal-600 border-teal-500 shadow-lg shadow-teal-500/30' : 'theme-bg theme-border'}`}
                  >
                    <span className={`block w-4 h-4 bg-white rounded-full shadow-md transform transition-all duration-500 ${notifs[n] ? 'translate-x-6' : 'translate-x-0'}`} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* <div className="bg-gray-950 rounded-[2.5rem] p-10 border border-gray-800 shadow-2xl relative overflow-hidden group">
            <div className="absolute top-0 left-0 w-32 h-32 bg-teal-500/5 rounded-full blur-3xl -ml-16 -mt-16 group-hover:bg-teal-500/10 transition-all" />
            <p className="text-gray-500 text-[10px] font-black uppercase tracking-[0.2em] mb-4">Security Level</p>
            <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-xl bg-gray-800 flex items-center justify-center text-2xl">🔐</div>
                <div>
                    <p className="text-white font-black text-sm uppercase tracking-tight">Two-Factor Active</p>
                    <p className="text-teal-500 text-[9px] font-black uppercase tracking-widest mt-0.5">Highly Secure</p>
                </div>
            </div>
            <button className="w-full py-4 bg-gray-800 hover:bg-gray-700 text-white text-[10px] font-black uppercase tracking-[0.2em] rounded-xl transition-all active:scale-95">Configure Security Keys</button>
          </div> */}
        </div>
      </div>
    </div>
  );
}
