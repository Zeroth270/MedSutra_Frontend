import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import PageHeader from '../../components/ui/PageHeader';
import DoctorCard from '../../components/dashboard/DoctorCard';
import { MOCK_DOCTORS } from '../../constants/doctors';

const INITIAL_CAREGIVERS = [
  { id: 1, nameKey: 'doc_priya', roleKey: 'spec_primary', status: 'dash_stable', initial: 'P' },
  { id: 2, nameKey: 'doc_anjali', roleKey: 'spec_family', status: 'dash_stable', initial: 'A' },
];

const PERMISSIONS = ['link_permissions', 'dash_adherence_log', 'nav_risk_report', 'nav_reminders'];

export default function CaregiverLinkPage() {
  const { t } = useTranslation();
  const [perms, setPerms] = useState(PERMISSIONS.reduce((a, p) => ({ ...a, [p]: true }), {}));
  const [searchQuery, setSearchQuery] = useState('');
  const [caregivers, setCaregivers] = useState(INITIAL_CAREGIVERS);
  const [saving, setSaving] = useState(false);

  const filteredDoctors = MOCK_DOCTORS.filter(doc => {
    const name = doc.nameKey ? t(doc.nameKey).toLowerCase() : doc.name.toLowerCase();
    const specialty = doc.specialtyKey ? t(doc.specialtyKey).toLowerCase() : doc.specialty.toLowerCase();
    const query = searchQuery.toLowerCase();
    
    return name.includes(query) || 
           specialty.includes(query) || 
           doc.diseases.some(d => d.toLowerCase().includes(query));
  });

  const handleInvite = () => {
    const name = window.prompt(t('link_btn_invite'));
    if (!name) return;
    const role = window.prompt(t('auth_select_role'), 'Family Caregiver');

    const newCaregiver = {
      id: Date.now(),
      name,
      role: role || 'Caregiver',
      status: 'dash_stable',
      initial: name.charAt(0).toUpperCase()
    };
    setCaregivers([...caregivers, newCaregiver]);
  };

  const handleRemove = (id) => {
    if (window.confirm(t('med_confirm_delete'))) {
      setCaregivers(caregivers.filter(c => c.id !== id));
    }
  };

  const handleBook = (doctor) => {
    const doctorName = doctor.nameKey ? t(doctor.nameKey) : doctor.name;
    if (caregivers.some(c => (c.nameKey ? t(c.nameKey) : c.name) === doctorName)) {
        alert(`${doctorName} is already in your Active Care Network.`);
        return;
    }

    const newCaregiver = {
        id: Date.now(),
        nameKey: doctor.nameKey,
        name: doctor.name,
        roleKey: doctor.specialtyKey,
        role: doctor.specialty,
        status: 'dash_stable',
        initial: doctorName.charAt(0).toUpperCase()
    };
    
    setCaregivers([newCaregiver, ...caregivers]);
    alert(`${doctorName} has been added to your clinical care circle.`);
  };

  const handleCommit = () => {
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      alert('Global access logic synchronized successfully.');
    }, 1000);
  };

  return (
    <div className="animate-fade-in space-y-12">
      <PageHeader
        title={t('nav_caregiver_link')}
        subtitle={t('link_subtitle')}
        actionLabel={t('link_btn_invite')}
        onAction={handleInvite}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 space-y-12">
          <section>
            <div className="flex items-center justify-between mb-8 px-2">
              <h2 className="font-black theme-text text-xl uppercase tracking-tight">{t('link_active_handshakes')}</h2>
              <span className="text-[10px] font-black text-teal-600 border border-teal-200 dark:border-teal-900/30 px-4 py-2 rounded-xl uppercase tracking-[0.2em] shadow-sm">{caregivers.length} {t('dash_stable')}</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {caregivers.map((c) => (
                <div key={c.id} className="border theme-border hover:border-teal-500 rounded-[2.5rem] p-8 flex flex-col gap-6 transition-all duration-300 group card-hover relative overflow-hidden shadow-sm hover:shadow-2xl">
                  <div className="flex items-center gap-6 relative z-10">
                    <div className="w-16 h-16 rounded-2xl bg-gray-900 dark:bg-teal-600 flex items-center justify-center font-black text-white text-2xl flex-shrink-0 transition-transform shadow-xl border-2 border-white dark:border-gray-800">{c.initial}</div>
                    <div className="flex-1 min-w-0">
                      <p className="font-black theme-text text-lg uppercase tracking-tight group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors truncate">
                        {c.nameKey ? t(c.nameKey) : c.name}
                      </p>
                      <p className="text-[10px] theme-text-sub font-black mt-1.5 uppercase tracking-[0.2em] opacity-70">
                        {c.roleKey ? t(c.roleKey) : c.role}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-6 border-t theme-border relative z-10">
                    <span className="text-[10px] font-black border border-green-200 dark:border-green-900/30 text-green-700 dark:text-green-400 px-4 py-2 rounded-xl uppercase tracking-widest shadow-sm">{t(c.status)}</span>
                    <div className="flex gap-2">
                      <button onClick={() => alert(`Configuring access for ${c.nameKey ? t(c.nameKey) : c.name}...`)} className="text-[10px] theme-text-sub hover:text-teal-600 dark:hover:text-teal-400 font-black uppercase tracking-[0.2em] transition-all">{t('risk_configure')}</button>
                      <button onClick={() => handleRemove(c.id)} className="text-[10px] text-red-500 font-black uppercase tracking-[0.2em] transition-all ml-2">{t('link_btn_revoke')}</button>
                    </div>
                  </div>

                  <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-teal-500/5 rounded-full blur-3xl" />
                </div>
              ))}
            </div>
          </section>

          <section className="space-y-10 pt-10 border-t theme-border">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 px-2">
              <div>
                <h2 className="font-black theme-text text-xl uppercase tracking-tight">{t('dash_consult')}</h2>
                <p className="text-xs theme-text-sub mt-1.5 font-medium">{t('dash_caregiver_desc')}</p>
              </div>
              <div className="relative group">
                <input
                  type="text"
                  placeholder={t('dash_filter_specialists')}
                  className="pl-12 pr-8 py-4 border theme-border hover:border-teal-500 rounded-2xl text-xs theme-text focus:ring-4 focus:ring-teal-500/10 focus:border-teal-500 outline-none w-full md:w-96 transition-all shadow-sm font-medium"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <span className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 text-lg group-focus-within:text-teal-500 transition-colors">🔍</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {filteredDoctors.map((doc, i) => (
                <DoctorCard key={i} doctor={doc} onBook={handleBook} />
              ))}
              {filteredDoctors.length === 0 && (
                <div className="col-span-full py-20 text-center theme-bg rounded-[3rem] border border-dashed theme-border">
                  <p className="theme-text-sub font-black text-[10px] uppercase tracking-[0.2em]">{t('dash_no_specialists')}</p>
                  <button
                    onClick={() => setSearchQuery('')}
                    className="mt-4 text-teal-600 dark:text-teal-400 font-black text-xs hover:underline uppercase tracking-widest"
                  >
                    {t('dash_clear_filters')}
                  </button>
                </div>
              )}
            </div>
          </section>
        </div>

        <div className="space-y-8">
          <div className="border theme-border hover:border-teal-500 rounded-[3rem] p-10 sticky top-24 transition-all shadow-sm hover:shadow-xl">
            <div className="flex items-center gap-3 mb-10 px-1">
              <div className="w-2 h-7 bg-teal-500 rounded-full"></div>
              <h2 className="font-black theme-text text-lg uppercase tracking-tight">{t('link_permissions')}</h2>
            </div>

            <div className="space-y-2">
              {PERMISSIONS.map(perm => (
                <div key={perm} className="flex items-center justify-between py-5 border-b theme-border last:border-0 group">
                  <div className="flex flex-col">
                    <span className="text-xs font-black theme-text group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors uppercase tracking-tight">{t(perm)}</span>
                    <span className="text-[9px] theme-text-sub font-black uppercase tracking-widest mt-1.5 opacity-60">Synchronous Sync</span>
                  </div>
                  <button
                    onClick={() => setPerms(p => ({ ...p, [perm]: !p[perm] }))}
                    className={`relative w-14 h-8 rounded-full transition-all duration-500 flex-shrink-0 p-1.5 border ${perms[perm] ? 'bg-teal-600 border-teal-500 shadow-lg shadow-teal-500/30' : 'theme-bg theme-border'}`}
                  >
                    <span className={`block w-4 h-4 bg-white rounded-full shadow-md transform transition-all duration-500 ${perms[perm] ? 'translate-x-6' : 'translate-x-0'}`} />
                  </button>
                </div>
              ))}
            </div>

            <button
              onClick={handleCommit}
              disabled={saving}
              className="btn-primary w-full mt-12 py-5 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] shadow-2xl shadow-teal-500/20 active:scale-95 transition-all"
            >
              {saving ? 'Synchronizing...' : t('settings_commit')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
