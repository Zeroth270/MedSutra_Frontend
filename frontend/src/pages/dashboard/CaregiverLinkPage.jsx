import { useState } from 'react';
import PageHeader from '../../components/ui/PageHeader';
import DoctorCard from '../../components/dashboard/DoctorCard';
import { MOCK_DOCTORS } from '../../constants/doctors';

const INITIAL_CAREGIVERS = [
  { id: 1, name: 'Dr. Priya Sharma', role: 'Primary Physician', status: 'Connected', initial: 'P' },
  { id: 2, name: 'Anjali Kumar', role: 'Family Caregiver', status: 'Connected', initial: 'A' },
];

const PERMISSIONS = ['Medication Log', 'Adherence Reports', 'Risk Alerts', 'Reminder Notifications'];

export default function CaregiverLinkPage() {
  const [perms, setPerms] = useState(PERMISSIONS.reduce((a, p) => ({ ...a, [p]: true }), {}));
  const [searchQuery, setSearchQuery] = useState('');
  const [caregivers, setCaregivers] = useState(INITIAL_CAREGIVERS);
  const [saving, setSaving] = useState(false);

  const filteredDoctors = MOCK_DOCTORS.filter(doc =>
    doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    doc.specialty.toLowerCase().includes(searchQuery.toLowerCase()) ||
    doc.diseases.some(d => d.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handleInvite = () => {
    const name = window.prompt('Enter caregiver/doctor name:');
    if (!name) return;
    const role = window.prompt('Enter role (e.g. Family, Specialist):', 'Family Caregiver');

    const newCaregiver = {
      id: Date.now(),
      name,
      role: role || 'Caregiver',
      status: 'Connected',
      initial: name.charAt(0).toUpperCase()
    };
    setCaregivers([...caregivers, newCaregiver]);
  };

  const handleRemove = (id) => {
    if (window.confirm('Disconnect this clinical entity?')) {
      setCaregivers(caregivers.filter(c => c.id !== id));
    }
  };

  const handleBook = (doctor) => {
    // Check if doctor is already in network
    if (caregivers.some(c => c.name === doctor.name)) {
        alert(`${doctor.name} is already in your Active Care Network.`);
        return;
    }

    const newCaregiver = {
        id: Date.now(),
        name: doctor.name,
        role: doctor.specialty,
        status: 'Connected',
        initial: doctor.name.charAt(0).toUpperCase()
    };
    
    setCaregivers([newCaregiver, ...caregivers]);
    alert(`${doctor.name} has been added to your clinical care circle.`);
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
        title="Clinical Care Team"
        subtitle="Manage your medical inner circle and coordinate with specialist doctors."
        actionLabel="+ Invite Caregiver"
        onAction={handleInvite}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 space-y-12">
          {/* Connected Caregivers Section */}
          <section>
            <div className="flex items-center justify-between mb-8 px-2">
              <h2 className="font-black theme-text text-xl uppercase tracking-tight">Active Care Network</h2>
              <span className="text-[10px] font-black text-teal-600 bg-teal-50 dark:bg-teal-900/20 px-4 py-2 rounded-xl border border-teal-100 dark:border-teal-800/50 uppercase tracking-[0.2em] shadow-sm">{caregivers.length} Verified</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {caregivers.map((c) => (
                <div key={c.id} className="theme-surface border theme-border rounded-[2.5rem] p-8 flex flex-col gap-6 hover:shadow-2xl hover:border-teal-100 dark:hover:border-teal-900 transition-all duration-300 group card-hover relative overflow-hidden">
                  <div className="flex items-center gap-6 relative z-10">
                    <div className="w-16 h-16 rounded-2xl bg-gray-900 dark:bg-teal-600 flex items-center justify-center font-black text-white text-2xl flex-shrink-0 group-hover:rotate-6 transition-transform shadow-xl border-2 border-white dark:border-gray-800">{c.initial}</div>
                    <div className="flex-1 min-w-0">
                      <p className="font-black theme-text text-lg uppercase tracking-tight group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors truncate">{c.name}</p>
                      <p className="text-[10px] theme-text-sub font-black mt-1.5 uppercase tracking-[0.2em] opacity-70">{c.role}</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-6 border-t theme-border relative z-10">
                    <span className="text-[10px] font-black bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 px-4 py-2 rounded-xl border border-green-100 dark:border-green-800/50 uppercase tracking-widest shadow-sm">{c.status}</span>
                    <div className="flex gap-2">
                      <button onClick={() => alert(`Configuring access for ${c.name}...`)} className="text-[10px] theme-text-sub hover:text-teal-600 dark:hover:text-teal-400 font-black uppercase tracking-[0.2em] transition-all">Configure</button>
                      <button onClick={() => handleRemove(c.id)} className="text-[10px] text-red-500 font-black uppercase tracking-[0.2em] transition-all ml-2">Disconnect</button>
                    </div>
                  </div>

                  <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-teal-500/5 rounded-full blur-3xl" />
                </div>
              ))}

              {/* <button onClick={handleInvite} className="theme-surface border-2 border-dashed theme-border hover:border-teal-300 dark:hover:border-teal-700 hover:theme-bg rounded-[2.5rem] p-8 flex flex-col items-center justify-center gap-4 cursor-pointer transition-all group shadow-sm min-h-[220px]">
                <div className="w-16 h-16 rounded-2xl theme-bg border theme-border group-hover:bg-teal-100 dark:group-hover:bg-teal-900 flex items-center justify-center theme-text-sub group-hover:text-teal-600 text-3xl flex-shrink-0 transition-all shadow-md">+</div>
                <div className="text-center">
                  <p className="font-black theme-text group-hover:text-teal-700 dark:group-hover:text-teal-400 text-xs uppercase tracking-widest transition-colors mb-1">Add Entity</p>
                  <p className="text-[9px] theme-text-sub font-bold uppercase tracking-[0.2em] opacity-60">Invite via secure channel</p>
                </div>
              </button> */}
            </div>
          </section>

          {/* Find Specialists Section */}
          <section className="space-y-10 pt-10 border-t theme-border">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 px-2">
              <div>
                <h2 className="font-black theme-text text-xl uppercase tracking-tight">Clinical Specialists</h2>
                <p className="text-xs theme-text-sub mt-1.5 font-medium">Curated recommendations based on neural patterns.</p>
              </div>
              <div className="relative group">
                <input
                  type="text"
                  placeholder="Filter by specialty..."
                  className="pl-12 pr-8 py-4 theme-surface border theme-border rounded-2xl text-xs theme-text focus:ring-4 focus:ring-teal-500/10 focus:border-teal-500 outline-none w-full md:w-96 transition-all shadow-sm font-medium"
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
                  <p className="theme-text-sub font-black text-[10px] uppercase tracking-[0.2em]">No clinical entities found matching query</p>
                  <button
                    onClick={() => setSearchQuery('')}
                    className="mt-4 text-teal-600 dark:text-teal-400 font-black text-xs hover:underline uppercase tracking-widest"
                  >
                    Reset Filter
                  </button>
                </div>
              )}
            </div>
          </section>
        </div>

        {/* Global Permissions Column */}
        <div className="space-y-8">
          <div className="theme-surface border theme-border rounded-[3rem] p-10 sticky top-24 shadow-2xl hover:shadow-xl transition-all">
            <div className="flex items-center gap-3 mb-10 px-1">
              <div className="w-2 h-7 bg-teal-500 rounded-full"></div>
              <h2 className="font-black theme-text text-lg uppercase tracking-tight">Global Logic</h2>
            </div>

            <div className="space-y-2">
              {PERMISSIONS.map(perm => (
                <div key={perm} className="flex items-center justify-between py-5 border-b theme-border last:border-0 group">
                  <div className="flex flex-col">
                    <span className="text-xs font-black theme-text group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors uppercase tracking-tight">{perm}</span>
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
              {saving ? 'Synchronizing...' : 'Commit Logic Changes'}
            </button>
          </div>

          {/* <div className="bg-gray-950 rounded-[2.5rem] p-10 border border-gray-800 shadow-2xl relative overflow-hidden group hover:border-teal-500/30 transition-all">
            <div className="absolute top-0 right-0 w-32 h-32 bg-teal-500/5 rounded-full blur-3xl -mr-16 -mt-16 group-hover:bg-teal-500/10 transition-all" />
            <p className="text-gray-500 text-[9px] font-black uppercase tracking-[0.3em] mb-4">Privacy Core</p>
            <h3 className="text-white font-black text-xl uppercase tracking-tight mb-4">Neural Encryption</h3>
            <p className="text-gray-500 text-xs font-medium leading-relaxed mb-8">
              Medical records are processed via 256-bit AES encryption before care-team transmission.
            </p>
            <div className="flex items-center gap-2 text-teal-500 text-[10px] font-black uppercase tracking-widest">
                <span className="w-2 h-2 rounded-full bg-teal-500 animate-pulse" />
                End-to-End Verified
            </div>
          </div> */}
        </div>
      </div>
    </div>
  );
}
