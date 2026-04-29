import { useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import DoctorCard from '../../../components/dashboard/DoctorCard';
import { MOCK_DOCTORS } from '../../../constants/doctors';

const INITIAL_MONITORED = [
  { id: 1, name: 'Sarah Miller (Mother)', status: 'Missed Dose', time: '10:30 AM', med: 'Blood Pressure', urgency: 'high' },
  { id: 2, name: 'James Miller (Father)', status: 'On Track', time: '8:00 AM', med: 'Vitamins', urgency: 'low' },
];

export default function CaregiverDashboard() {
  const { user } = useOutletContext();
  const [searchQuery, setSearchQuery] = useState('');
  const [monitored, setMonitored] = useState(INITIAL_MONITORED);
  const [activeNetwork, setActiveNetwork] = useState([]);

  const filteredDoctors = MOCK_DOCTORS.filter(doc =>
    doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    doc.specialty.toLowerCase().includes(searchQuery.toLowerCase()) ||
    doc.diseases.some(d => d.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handleAddPatient = () => {
    const name = window.prompt('Enter patient name to monitor:');
    if (!name) return;
    const med = window.prompt('Enter primary medication:', 'General Care');

    const newPatient = {
      id: Date.now(),
      name,
      status: 'On Track',
      time: '9:00 AM',
      med: med || 'General',
      urgency: 'low'
    };
    setMonitored([...monitored, newPatient]);
  };

  const handleRemove = (id) => {
    if (window.confirm('Stop monitoring this patient?')) {
      setMonitored(monitored.filter(p => p.id !== id));
    }
  };

  const handleBook = (doctor) => {
    if (activeNetwork.some(d => d.name === doctor.name)) {
      alert(`${doctor.name} is already in your active network.`);
      return;
    }
    setActiveNetwork([doctor, ...activeNetwork]);
    alert(`${doctor.name} has been added to your Active Care Network.`);
  };

  const handleRemoveSpecialist = (name) => {
    setActiveNetwork(activeNetwork.filter(d => d.name !== name));
  };

  return (
    <div className="animate-fade-in space-y-12">
      <div className="mb-10 px-1 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black theme-text tracking-tight uppercase">Caregiver Portal, {user.name}</h1>
          <p className="theme-text-sub text-sm mt-1.5 font-medium">Manage and monitor health schedules for your clinical network.</p>
        </div>
        <button
          onClick={handleAddPatient}
          className="bg-gray-900 dark:bg-teal-600 text-white px-8 py-4 rounded-xl text-[10px] font-black uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-xl shadow-teal-500/20"
        >
          + Register Patient
        </button>
      </div>

      {/* Monitored Patients Section */}
      <section className="space-y-8">
        <div className="flex items-center justify-between px-2">
          <h2 className="text-[10px] font-black theme-text-sub uppercase tracking-[0.2em]">Active Monitored Nodes</h2>
          <span className="text-[10px] font-black text-teal-600 bg-teal-50 dark:bg-teal-900/20 px-4 py-2 rounded-xl border border-teal-100 dark:border-teal-800/50 uppercase tracking-widest shadow-sm">{monitored.length} Accounts</span>
        </div>
        <div className="grid grid-cols-1 gap-6">
          {monitored.map((p) => (
            <div key={p.id} className="theme-surface border theme-border rounded-[2.5rem] p-8 shadow-sm hover:shadow-2xl hover:border-teal-100 dark:hover:border-teal-900 transition-all duration-300 group card-hover relative overflow-hidden">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 relative z-10">
                <div className="flex items-center gap-6">
                  <div className={`w-16 h-16 rounded-2xl flex items-center justify-center font-black text-2xl transition-transform group-hover:scale-110 shadow-lg border-2 ${p.urgency === 'high' ? 'bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 border-red-100 dark:border-red-900/50' : 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 border-green-100 dark:border-green-800/50'}`}>
                    {p.name.charAt(0)}
                  </div>
                  <div>
                    <h3 className="text-xl font-black theme-text group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors uppercase tracking-tight">{p.name}</h3>
                    <p className="text-[10px] theme-text-sub font-black mt-1.5 uppercase tracking-widest opacity-70">Activity: {p.med} · {p.time}</p>
                  </div>
                </div>

                <div className="flex items-center gap-6">
                  <div className={`px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-sm border ${p.urgency === 'high' ? 'bg-red-600 text-white border-red-700 shadow-red-500/20' : 'theme-bg theme-text-sub theme-border'}`}>
                    {p.status}
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => alert(`Initiating secure consult for ${p.name}...`)} className="bg-gray-900 dark:bg-teal-600 text-white px-8 py-3.5 rounded-xl text-[10px] font-black uppercase tracking-widest hover:scale-105 transition-all active:scale-95 shadow-xl shadow-gray-900/10">
                      Consult
                    </button>
                    <button onClick={() => handleRemove(p.id)} className="w-12 h-12 rounded-xl border theme-border flex items-center justify-center theme-text-sub hover:text-red-500 transition-all">
                      ✕
                    </button>
                  </div>
                </div>
              </div>
              <div className="absolute -right-10 -bottom-10 w-32 h-32 bg-teal-500/5 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          ))}

          {monitored.length === 0 && (
            <button onClick={handleAddPatient} className="border-2 border-dashed theme-border rounded-[2.5rem] p-12 flex flex-col items-center justify-center gap-5 hover:border-teal-300 dark:hover:border-teal-700 hover:theme-bg transition-all group shadow-sm">
              <div className="w-16 h-16 rounded-2xl theme-bg flex items-center justify-center theme-text-sub group-hover:bg-teal-100 dark:group-hover:bg-teal-900 group-hover:text-teal-600 transition-all border theme-border shadow-md">
                <span className="text-3xl font-black">+</span>
              </div>
              <div className="text-center">
                <span className="text-[10px] font-black theme-text-sub uppercase tracking-[0.2em] group-hover:text-teal-700 dark:group-hover:text-teal-400 transition-colors">Register Monitored Node</span>
                <p className="text-[9px] theme-text-sub font-bold uppercase tracking-widest mt-1 opacity-60">Add patient to clinical circle</p>
              </div>
            </button>
          )}
        </div>
      </section>

      {/* Active Care Network (Booked Specialists) */}
      {activeNetwork.length > 0 && (
        <section className="space-y-8 pt-4">
          <div className="flex items-center justify-between px-2">
            <h2 className="text-[10px] font-black theme-text-sub uppercase tracking-[0.2em]">Active Care Network</h2>
            <span className="text-[10px] font-black text-teal-600 bg-teal-50 dark:bg-teal-900/20 px-4 py-2 rounded-xl border border-teal-100 dark:border-teal-800/50 uppercase tracking-widest shadow-sm">{activeNetwork.length} Specialists</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {activeNetwork.map((doc) => (
              <div key={doc.name} className="theme-surface border theme-border rounded-[2rem] p-6 shadow-sm hover:shadow-xl transition-all group relative overflow-hidden">
                <div className="flex items-center gap-4 relative z-10">
                  <img src={doc.image} alt={doc.name} className="w-12 h-12 rounded-xl object-cover border theme-border" />
                  <div className="flex-1 min-w-0">
                    <p className="font-black theme-text text-sm uppercase tracking-tight truncate">{doc.name}</p>
                    <p className="text-[9px] theme-text-sub font-black uppercase tracking-widest opacity-70">{doc.specialty}</p>
                  </div>
                  <button onClick={() => handleRemoveSpecialist(doc.name)} className="text-gray-400 hover:text-red-500 transition-colors">✕</button>
                </div>
                <div className="mt-4 pt-4 border-t theme-border flex justify-between items-center relative z-10">
                  <span className="text-[9px] font-black text-green-600 dark:text-green-400 uppercase tracking-widest">Connected</span>
                  <button onClick={() => alert(`Initiating clinical consult with ${doc.name}...`)} className="text-[9px] font-black text-teal-600 uppercase tracking-[0.2em] hover:underline">Consult Now</button>
                </div>
                <div className="absolute -right-8 -bottom-8 w-24 h-24 bg-teal-500/5 rounded-full blur-2xl" />
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Recommended Specialists Section */}
      <section className="space-y-10 pt-12 border-t theme-border">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 px-2">
          <div>
            <h2 className="text-[10px] font-black theme-text-sub uppercase tracking-[0.2em]">Specialist Consultation</h2>
            <p className="text-xs theme-text-sub mt-1.5 font-medium">Select and consult with specialists for your network.</p>
          </div>
          <div className="relative group">
            <input
              type="text"
              placeholder="Filter specialists..."
              className="pl-12 pr-8 py-4 theme-surface border theme-border rounded-2xl text-xs theme-text focus:ring-4 focus:ring-teal-500/10 focus:border-teal-500 outline-none w-full md:w-96 transition-all shadow-sm font-medium"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <span className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 text-lg group-focus-within:text-teal-500 transition-colors">🔍</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredDoctors.map((doc, i) => (
            <DoctorCard key={i} doctor={doc} onBook={handleBook} />
          ))}
        </div>

        {filteredDoctors.length === 0 && (
          <div className="py-20 text-center theme-bg rounded-[2.5rem] border border-dashed theme-border">
            <p className="theme-text-sub font-black text-[10px] uppercase tracking-[0.2em]">No clinical specialists found</p>
            <button
              onClick={() => setSearchQuery('')}
              className="mt-4 text-teal-600 dark:text-teal-400 font-black text-xs hover:underline uppercase tracking-widest"
            >
              Clear Filters
            </button>
          </div>
        )}
      </section>

      {/* Health Insights / Tips for Caregivers */}
      {/* <div className="bg-gray-950 border border-gray-800 rounded-[3rem] p-12 text-white shadow-2xl relative overflow-hidden group">
        <div className="relative z-10 max-w-xl">
          <h3 className="text-3xl font-black mb-4 uppercase tracking-tight">Caregiver Excellence</h3>
          <p className="text-sm opacity-70 leading-relaxed mb-10 font-medium">
            Access exclusive training modules and AI-driven clinical insights to provide the best possible care for your patients.
          </p>
          <button onClick={() => alert('Launching Neural Training Hub...')} className="bg-white text-gray-900 px-10 py-4 rounded-xl text-[10px] font-black uppercase tracking-widest hover:scale-105 transition-all active:scale-95 shadow-xl">
            Launch Training Hub
          </button>
        </div>
        <div className="absolute right-[-60px] top-[-60px] w-96 h-96 bg-teal-500/10 rounded-full blur-[100px] group-hover:bg-teal-500/20 transition-all duration-700"></div>
        <div className="absolute right-[10%] bottom-[-100px] w-80 h-80 bg-white/5 rounded-full blur-[80px]"></div>
      </div> */}
    </div>
  );
}
