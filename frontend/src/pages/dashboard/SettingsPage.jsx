import { useOutletContext } from 'react-router-dom';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import PageHeader from '../../components/ui/PageHeader';

const NOTIF_KEYS = [
  { key: 'notif_med_reminders', label: 'Medication Reminders' },
  { key: 'notif_missed_dose', label: 'Missed Dose Alerts' },
  { key: 'notif_weekly_summary', label: 'Weekly Summary' },
  { key: 'notif_caregiver_alerts', label: 'Caregiver Alerts' },
  { key: 'notif_ai_insights', label: 'AI Insight Reports' }
];

export default function SettingsPage() {
  const { t } = useTranslation();
  const { user } = useOutletContext();
  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [phone, setPhone] = useState(user.phone || '+91 00000-00000');
  const [saved, setSaved] = useState(false);
  const [notifs, setNotifs] = useState(NOTIF_KEYS.reduce((a, n) => ({ ...a, [n.key]: true }), {}));

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="animate-fade-in space-y-10">
      <PageHeader title={t('settings_title')} subtitle={t('settings_subtitle')} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {/* Identity Box */}
          <div className="rounded-[3rem] p-10 transition-all">
            <h2 className="font-black theme-text text-[10px] uppercase tracking-[0.2em] mb-10 px-1">{t('settings_identity')}</h2>

            <div className="flex items-center gap-6 mb-12 p-8 rounded-[2.5rem] shadow-sm border theme-border hover:border-teal-500/30 transition-colors">
              <div className="w-20 h-20 rounded-2xl bg-gray-900 dark:bg-teal-600 flex items-center justify-center font-black text-white text-3xl flex-shrink-0 shadow-2xl border-4 border-white dark:border-gray-800">{user.avatar}</div>
              <div>
                <p className="font-black theme-text text-2xl uppercase tracking-tight">{user.name}</p>
                <p className="text-[10px] theme-text-sub font-black uppercase tracking-[0.2em] mt-1 opacity-70">{t(`auth_role_${user.role.toLowerCase()}`)} · Verified Patient Entity</p>
              </div>
            </div>

            <div className="space-y-8">
              <div className="group">
                <label className="block text-[10px] font-black theme-text-sub uppercase tracking-[0.2em] mb-3 px-2 group-focus-within:text-teal-600 transition-colors">{t('settings_name_label')}</label>
                <input value={name} onChange={e => setName(e.target.value)} className="w-full px-6 py-4 rounded-2xl text-sm theme-text border border-transparent focus:outline-none focus:border-teal-500 hover:border-teal-500/30 focus:ring-4 focus:ring-teal-500/5 transition-all font-black uppercase tracking-tight" />
              </div>
              <div className="group">
                <label className="block text-[10px] font-black theme-text-sub uppercase tracking-[0.2em] mb-3 px-2 group-focus-within:text-teal-600 transition-colors">{t('settings_email_label')}</label>
                <input value={email} onChange={e => setEmail(e.target.value)} type="email" className="w-full px-6 py-4 rounded-2xl text-sm theme-text border border-transparent focus:outline-none focus:border-teal-500 hover:border-teal-500/30 focus:ring-4 focus:ring-teal-500/5 transition-all font-black uppercase tracking-tight" />
              </div>
              <div className="group">
                <label className="block text-[10px] font-black theme-text-sub uppercase tracking-[0.2em] mb-3 px-2 group-focus-within:text-teal-600 transition-colors">{t('settings_phone_label')}</label>
                <input value={phone} onChange={e => setPhone(e.target.value)} type="tel" className="w-full px-6 py-4 rounded-2xl text-sm theme-text border border-transparent focus:outline-none focus:border-teal-500 hover:border-teal-500/30 focus:ring-4 focus:ring-teal-500/5 transition-all font-black uppercase tracking-tight" />
              </div>
              <div className="group opacity-60">
                <label className="block text-[10px] font-black theme-text-sub uppercase tracking-[0.2em] mb-3 px-2">{t('settings_role_label')}</label>
                <input value={t(`auth_role_${user.role.toLowerCase()}`)} readOnly className="w-full px-6 py-4 rounded-2xl text-[10px] theme-text-sub cursor-not-allowed font-black uppercase tracking-[0.2em]" />
              </div>

              <div className="pt-4">
                <button
                  onClick={handleSave}
                  className={`w-full py-5 rounded-2xl text-xs font-black uppercase tracking-[0.2em] shadow-2xl transition-all active:scale-95 ${saved ? 'bg-green-600 text-white shadow-green-500/30' : 'bg-gray-900 dark:bg-teal-600 text-white shadow-teal-500/20'}`}
                >
                  {saved ? `✓ ${t('settings_synced')}` : t('settings_commit')}
                </button>
              </div>
            </div>
          </div>

          {/* Security Box */}
          <div className="border border-red-100 dark:border-red-900/30 hover:border-red-500 rounded-[3rem] p-10 hover:shadow-2xl hover:shadow-red-500/5 transition-all group">
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
            <h2 className="font-black theme-text text-[10px] uppercase tracking-[0.2em] mb-3">{t('settings_alert_logic')}</h2>
            <p className="text-[10px] theme-text-sub font-bold uppercase tracking-widest mb-10 opacity-70">{t('settings_personalize_triggers')}</p>

            <div className="space-y-2">
              {NOTIF_KEYS.map(n => (
                <div key={n.key} className="flex items-center justify-between py-5 border-b theme-border last:border-0 group">
                  <span className="text-xs font-black theme-text group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors uppercase tracking-tight">{t(n.key)}</span>
                  <button
                    onClick={() => setNotifs(prev => ({ ...prev, [n.key]: !prev[n.key] }))}
                    className={`relative w-14 h-8 rounded-full transition-all duration-500 flex-shrink-0 p-1.5 border ${notifs[n.key] ? 'bg-teal-600 border-teal-500 shadow-lg shadow-teal-500/30' : 'theme-bg theme-border'}`}
                  >
                    <span className={`block w-4 h-4 bg-white rounded-full shadow-md transform transition-all duration-500 ${notifs[n.key] ? 'translate-x-6' : 'translate-x-0'}`} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
