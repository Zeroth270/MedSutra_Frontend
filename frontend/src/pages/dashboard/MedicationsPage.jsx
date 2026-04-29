import { useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import PageHeader from '../../components/ui/PageHeader';

const INITIAL_MEDS = [
  { id: 1, name: 'Metformin 500mg', type: 'Tablet', frequency: 'Twice Daily', time: '8 AM & 9 PM', stock: 28, status: 'Active' },
  { id: 2, name: 'Lisinopril 10mg', type: 'Tablet', frequency: 'Once Daily', time: '2 PM', stock: 14, status: 'Active' },
  { id: 3, name: 'Atorvastatin 20mg', type: 'Tablet', frequency: 'Once Daily', time: '6 PM', stock: 6, status: 'Low Stock' },
  { id: 4, name: 'Aspirin 75mg', type: 'Tablet', frequency: 'Once Daily', time: '8 AM', stock: 30, status: 'Active' },
];

export default function MedicationsPage() {
  const { user } = useOutletContext();
  const [meds, setMeds] = useState(INITIAL_MEDS);

  const isPatient = user?.role?.toLowerCase() === 'patient';

  const handleAdd = () => {
    if (isPatient) return;
    const name = window.prompt('Enter medication name:');
    if (!name) return;
    const time = window.prompt('Enter schedule (e.g. 9 AM):', '9 AM');

    const newMed = {
      id: Date.now(),
      name,
      type: 'Tablet',
      frequency: 'Once Daily',
      time: time || '9 AM',
      stock: 30,
      status: 'Active'
    };
    setMeds([...meds, newMed]);
  };

  const handleRemove = (id) => {
    if (isPatient) return;
    if (window.confirm('Delete this medication protocol?')) {
      setMeds(meds.filter(m => m.id !== id));
    }
  };

  const handleEdit = (id) => {
    if (isPatient) return;
    const med = meds.find(m => m.id === id);
    const newName = window.prompt('Edit medication name:', med.name);
    if (newName) {
      setMeds(meds.map(m => m.id === id ? { ...m, name: newName } : m));
    }
  };

  return (
    <div className="animate-fade-in">
      <PageHeader
        title="Medications"
        subtitle={isPatient ? "View your prescribed medications. Managed by your Clinical Care Team." : "Manage and track prescription pharmacy protocols."}
        actionLabel={!isPatient ? "+ Add Medication" : null}
        onAction={handleAdd}
      />

      {/* Stats Boxes */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {[
          { label: 'Total Scripts', value: meds.length, icon: '📋' },
          { label: 'Active Course', value: meds.filter(m => m.status === 'Active').length, icon: '⚡' },
          { label: 'Critical Refill', value: meds.filter(m => m.status === 'Low Stock').length, icon: '⚠️' },
          { label: 'Next Refill', value: '3 days', icon: '📦' },
        ].map(s => (
          <div key={s.label} className="theme-surface border theme-border rounded-[2rem] p-8 shadow-sm hover:shadow-xl transition-all group card-hover">
            <div className="flex items-center justify-between mb-4">
              <p className="text-[10px] font-black theme-text-sub uppercase tracking-[0.2em]">{s.label}</p>
              <span className="text-xl group-hover:scale-110 transition-transform">{s.icon}</span>
            </div>
            <p className="text-4xl font-black theme-text mb-1 group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors">{s.value}</p>
          </div>
        ))}
      </div>

      {/* Medication Cards (Boxes) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {meds.map((med) => {
          const isLow = med.status === 'Low Stock';
          return (
            <div key={med.id} className="theme-surface border theme-border rounded-[2.5rem] p-8 shadow-sm hover:shadow-2xl transition-all group card-hover relative overflow-hidden">
              <div className="flex items-start justify-between mb-8 relative z-10">
                <div className="flex items-center gap-5">
                  <div className="w-14 h-14 rounded-2xl theme-bg border theme-border flex items-center justify-center text-3xl group-hover:scale-110 group-hover:rotate-6 transition-all shadow-sm">💊</div>
                  <div>
                    <h3 className="text-xl font-black theme-text group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors uppercase tracking-tight">{med.name}</h3>
                    <p className="text-[10px] theme-text-sub font-black mt-1.5 uppercase tracking-widest opacity-70">{med.type} · {med.frequency}</p>
                  </div>
                </div>
                <span className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border shadow-sm ${isLow
                  ? 'bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 border-red-100 dark:border-red-900/50'
                  : 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 border-green-100 dark:border-green-800/50'}`}>
                  {med.status}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-6 mb-8 p-6 theme-bg rounded-[1.5rem] border theme-border relative z-10">
                <div>
                  <p className="text-[9px] font-black theme-text-sub uppercase tracking-widest mb-1.5">Timing</p>
                  <p className="text-sm font-black theme-text">{med.time}</p>
                </div>
                <div>
                  <p className="text-[9px] font-black theme-text-sub uppercase tracking-widest mb-1.5">Current Stock</p>
                  <p className={`text-sm font-black ${isLow ? 'text-red-500' : 'theme-text'}`}>{med.stock} Units Left</p>
                </div>
              </div>

              <div className="flex items-center justify-between gap-6 relative z-10">
                <div className="flex-1">
                  <div className="flex justify-between items-center mb-2.5">
                    <span className="text-[9px] font-black theme-text-sub uppercase tracking-widest">Inventory Level</span>
                    <span className="text-[9px] font-black theme-text-sub">{Math.round((med.stock / 30) * 100)}%</span>
                  </div>
                  <div className="theme-bg rounded-full h-2 border theme-border overflow-hidden shadow-inner">
                    <div className={`h-full rounded-full transition-all duration-700 ${isLow ? 'bg-red-500 shadow-[0_0_12px_rgba(239,68,68,0.3)]' : 'bg-teal-500 shadow-[0_0_12px_rgba(20,184,166,0.3)]'}`} style={{ width: `${(med.stock / 30) * 100}%` }} />
                  </div>
                </div>
                {!isPatient && (
                  <div className="flex gap-2">
                    <button onClick={() => handleEdit(med.id)} className="w-10 h-10 rounded-xl border theme-border flex items-center justify-center theme-text-sub hover:theme-text hover:bg-gray-100 dark:hover:bg-gray-800 transition-all">
                      ✎
                    </button>
                    <button onClick={() => handleRemove(med.id)} className="w-10 h-10 rounded-xl border theme-border flex items-center justify-center theme-text-sub hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all">
                      ✕
                    </button>
                  </div>
                )}
              </div>

              <div className="absolute -right-10 -bottom-10 w-32 h-32 bg-teal-500/5 rounded-full blur-3xl" />
            </div>
          );
        })}

        {/* Add New Box (Only for Non-Patients) */}
        {/* {!isPatient ? (
            <button onClick={handleAdd} className="border-2 border-dashed theme-border rounded-[2.5rem] p-10 flex flex-col items-center justify-center gap-5 hover:border-teal-300 dark:hover:border-teal-700 hover:theme-bg transition-all group min-h-[300px] shadow-sm">
                <div className="w-16 h-16 rounded-2xl theme-bg border theme-border flex items-center justify-center theme-text-sub group-hover:bg-teal-100 dark:group-hover:bg-teal-900 group-hover:text-teal-600 transition-all shadow-md">
                    <span className="text-3xl font-black">+</span>
                </div>
                <div className="text-center">
                    <p className="text-[10px] font-black theme-text group-hover:text-teal-700 dark:group-hover:text-teal-400 uppercase tracking-[0.2em] transition-colors mb-1">Add New Medication</p>
                    <p className="text-[9px] theme-text-sub font-bold uppercase tracking-[0.2em] opacity-60">Initialize new protocol</p>
                </div>
            </button>
        ) : (
            <div className="border-2 border-dashed theme-border rounded-[2.5rem] p-10 flex flex-col items-center justify-center gap-5 bg-gray-50/30 dark:bg-gray-900/10 opacity-60 min-h-[300px]">
                <div className="w-16 h-16 rounded-2xl theme-bg border theme-border flex items-center justify-center theme-text-sub text-3xl">🔒</div>
                <div className="text-center">
                    <p className="text-[10px] font-black theme-text uppercase tracking-[0.2em] mb-1">Restricted Access</p>
                    <p className="text-[9px] theme-text-sub font-bold uppercase tracking-[0.2em]">Contact your doctor to edit medications</p>
                </div>
            </div>
        )} */}
      </div>
    </div>
  );
}
