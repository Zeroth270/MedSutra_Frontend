import { useOutletContext } from 'react-router-dom';
import { useState } from 'react';
import PageHeader from '../../components/ui/PageHeader';

const NOTIFS = ['Medication Reminders', 'Missed Dose Alerts', 'Weekly Summary', 'Caregiver Alerts', 'AI Insight Reports'];

export default function SettingsPage() {
  const { user } = useOutletContext();
  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [saved, setSaved] = useState(false);
  const [notifs, setNotifs] = useState(NOTIFS.reduce((a, n) => ({ ...a, [n]: true }), {}));

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div>
      <PageHeader title="Settings" subtitle="Manage your account and preferences." />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2 space-y-5">
          <div className="bg-white border border-gray-100 rounded-xl p-7">
            <h2 className="font-bold text-gray-900 text-sm mb-6">Profile Information</h2>
            <div className="flex items-center gap-4 mb-7 pb-7 border-b border-gray-50">
              <div className="w-14 h-14 rounded-xl bg-gray-900 flex items-center justify-center font-black text-white text-xl flex-shrink-0">{user.avatar}</div>
              <div>
                <p className="font-semibold text-gray-900 text-sm">{user.name}</p>
                <p className="text-xs text-gray-400 mt-0.5">{user.role} · Since {user.joined}</p>
              </div>
            </div>
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Full Name</label>
                <input value={name} onChange={e => setName(e.target.value)} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-900 focus:outline-none focus:border-gray-400 focus:ring-2 focus:ring-gray-200 transition-all" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Email Address</label>
                <input value={email} onChange={e => setEmail(e.target.value)} type="email" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-900 focus:outline-none focus:border-gray-400 focus:ring-2 focus:ring-gray-200 transition-all" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Role</label>
                <input value={user.role} readOnly className="w-full px-4 py-3 bg-gray-100 border border-gray-200 rounded-xl text-sm text-gray-400 cursor-not-allowed" />
              </div>
              <button onClick={handleSave} className={`btn-primary w-full py-3 rounded-xl text-sm ${saved ? 'bg-green-700' : ''}`}>
                {saved ? 'Changes Saved' : 'Save Changes'}
              </button>
            </div>
          </div>

          <div className="bg-white border border-red-100 rounded-xl p-7">
            <h2 className="font-bold text-red-500 text-sm mb-4">Danger Zone</h2>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-gray-900">Delete Account</p>
                <p className="text-xs text-gray-400 mt-0.5">Permanently delete your account and all associated data.</p>
              </div>
              <button className="text-xs font-semibold text-red-500 border border-red-200 hover:bg-red-50 px-4 py-2 rounded-lg transition-all flex-shrink-0 ml-4">Delete Account</button>
            </div>
          </div>
        </div>

        <div className="space-y-5">
          <div className="bg-white border border-gray-100 rounded-xl p-6">
            <h2 className="font-bold text-gray-900 text-sm mb-1">Notifications</h2>
            <p className="text-xs text-gray-400 mb-5">Choose which alerts you receive</p>
            <div className="space-y-1">
              {NOTIFS.map(n => (
                <div key={n} className="flex items-center justify-between py-3 border-b border-gray-50 last:border-0">
                  <span className="text-sm text-gray-700 pr-4">{n}</span>
                  <button
                    onClick={() => setNotifs(prev => ({ ...prev, [n]: !prev[n] }))}
                    className={`relative w-10 h-5 rounded-full transition-colors duration-200 flex-shrink-0 ${notifs[n] ? 'bg-gray-900' : 'bg-gray-200'}`}
                  >
                    <span className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform duration-200 ${notifs[n] ? 'translate-x-5' : 'translate-x-0'}`} />
                  </button>
                </div>
              ))}
            </div>
          </div>
          {/* <div className="bg-gray-900 rounded-xl p-6">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Security</p>
            <p className="text-white font-bold text-sm mb-1">Two-Factor Authentication</p>
            <p className="text-gray-500 text-xs mb-4 leading-relaxed">Add an extra layer of security to your account.</p>
            <button className="w-full bg-white text-gray-900 font-semibold py-2.5 rounded-lg text-sm hover:bg-gray-100 transition-all">Enable 2FA</button>
          </div> */}
        </div>
      </div>
    </div>
  );
}
