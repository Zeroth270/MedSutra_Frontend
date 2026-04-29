import { useOutletContext } from 'react-router-dom';
import { useState } from 'react';

export default function PatientDashboard({ selectedPatient, isDoctorView }) {
    const { user } = useOutletContext();
    const [meds, setMeds] = useState([
        { id: 1, name: 'Metformin 500mg', type: 'Tablet', frequency: 'Twice Daily', time: '8 AM & 9 PM', status: 'Active' },
        { id: 2, name: 'Lisinopril 10mg', type: 'Tablet', frequency: 'Once Daily', time: '2 PM', status: 'Active' },
        { id: 3, name: 'Atorvastatin 20mg', type: 'Tablet', frequency: 'Once Daily', time: '6 PM', status: 'Active' },
    ]);

    const stats = [
        { label: 'Doses Taken', value: '142', sub: 'This month' },
        { label: 'Adherence Rate', value: '94%', sub: 'Last 30 days' },
        { label: 'Missed Doses', value: '9', sub: 'This month' },
        { label: 'Next Reminder', value: '8 PM', sub: 'Metformin 500mg' },
    ];

    const log = [
        { time: '8:00 AM', med: 'Metformin 500mg', status: 'Taken', dot: 'bg-green-400' },
        { time: '2:00 PM', med: 'Lisinopril 10mg', status: 'Taken', dot: 'bg-green-400' },
        { time: '6:00 PM', med: 'Atorvastatin 20mg', status: 'Missed', dot: 'bg-red-400' },
        { time: '9:00 PM', med: 'Metformin 500mg', status: 'Pending', dot: 'bg-yellow-400' },
    ];

    const removeMed = (id) => {
        if (window.confirm('Are you sure you want to remove this medication?')) {
            setMeds(meds.filter(m => m.id !== id));
        }
    };

    const addMed = () => {
        const name = window.prompt('Enter medication name (e.g. Aspirin 75mg):');
        if (name) {
            const newMed = {
                id: Date.now(),
                name,
                type: 'Tablet',
                frequency: 'Once Daily',
                time: '9 AM',
                status: 'Active'
            };
            setMeds([...meds, newMed]);
        }
    };

    return (
        <div className="animate-fade-in">
            <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6 px-1">
                <div>
                    <h1 className="text-3xl font-black theme-text tracking-tight uppercase">
                        {selectedPatient ? `Clinical Profile: ${selectedPatient.name}` : `Health Overview, ${user.name}`}
                    </h1>
                    <p className="theme-text-sub text-sm mt-1.5 font-medium">
                        {selectedPatient ? `Comprehensive adherence analytics and medication management.` : 'Track your clinical goals and medication schedules.'}
                    </p>
                </div>
                {isDoctorView && (
                    <button 
                        onClick={addMed}
                        className="btn-primary px-8 py-4 rounded-xl text-xs font-black uppercase tracking-widest shadow-xl shadow-teal-500/20 hover:scale-105 active:scale-95 transition-all"
                    >
                        + Prescribe Medication
                    </button>
                )}
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 xl:grid-cols-4 gap-6 mb-12">
                {stats.map(s => (
                    <div key={s.label} className="border theme-border hover:border-teal-500 rounded-3xl p-8 transition-all group card-hover shadow-sm hover:shadow-xl">
                        <p className="text-[10px] font-black theme-text uppercase tracking-[0.2em] mb-6">{s.label}</p>
                        <p className="text-4xl font-black theme-text mb-2 group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors">{s.value}</p>
                        <p className="text-[10px] theme-text-sub font-black uppercase tracking-widest">{s.sub}</p>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                {/* Medication Management */}
                <div className="lg:col-span-2 space-y-10">
                    <section>
                        <div className="flex items-center justify-between mb-6 px-2">
                            <h2 className="font-black theme-text text-xs uppercase tracking-[0.2em]">Active Prescription Plan</h2>
                            {isDoctorView ? (
                                <span className="text-[10px] font-black text-teal-600 bg-teal-50 dark:bg-teal-900/20 px-3 py-1.5 rounded-xl border border-teal-100 dark:border-teal-800/50 uppercase tracking-widest shadow-sm">Clinical Mode</span>
                            ) : (
                                <span className="text-[10px] font-black theme-text-sub theme-bg px-3 py-1.5 rounded-xl border theme-border uppercase tracking-widest flex items-center gap-2">
                                    <span className="w-1.5 h-1.5 rounded-full bg-teal-500" />
                                    Clinical Sync Active
                                </span>
                            )}
                        </div>
                        <div className="space-y-4">
                            {meds.map((med) => (
                                <div key={med.id} className="border theme-border hover:border-teal-500 rounded-[2rem] px-8 py-8 flex items-center justify-between transition-all group card-hover relative overflow-hidden shadow-sm hover:shadow-2xl">
                                    <div className="flex items-center gap-6 relative z-10">
                                        <div className="w-16 h-16 rounded-2xl theme-bg flex items-center justify-center text-3xl group-hover:scale-110 transition-transform shadow-lg">💊</div>
                                        <div>
                                            <p className="text-xl font-black theme-text group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors uppercase tracking-tight">{med.name}</p>
                                            <p className="text-[10px] text-teal-600 dark:text-teal-400 font-black mt-1.5 uppercase tracking-widest">{med.frequency} · SCHED: {med.time}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-5 relative z-10">
                                        <span className={`text-[10px] font-black px-4 py-2 rounded-xl uppercase tracking-widest border transition-all ${
                                            med.status === 'Active' 
                                            ? 'border-green-200 dark:border-green-900/30 text-green-700 dark:text-green-400'
                                            : 'border-gray-200 dark:border-gray-700 text-gray-500'
                                        }`}>
                                            {med.status}
                                        </span>
                                        {isDoctorView && (
                                            <button 
                                                onClick={() => removeMed(med.id)}
                                                className="w-11 h-11 rounded-2xl border theme-border flex items-center justify-center theme-text-sub hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 hover:border-red-100 dark:hover:border-red-900 transition-all shadow-sm"
                                                title="Remove Medication"
                                            >
                                                ✕
                                            </button>
                                        )}
                                    </div>
                                    {!isDoctorView && (
                                        <div className="absolute right-6 top-6 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <span className="text-[8px] font-black theme-text-sub uppercase tracking-widest border theme-border px-2 py-1 rounded">Verified</span>
                                        </div>
                                    )}
                                    <div className="absolute -right-8 -bottom-8 w-24 h-24 bg-teal-500/5 rounded-full blur-3xl" />
                                </div>
                            ))}
                        </div>
                        {!isDoctorView && (
                            <div className="mt-6 px-4 py-3 theme-bg border theme-border border-dashed rounded-2xl flex items-center justify-center gap-3 opacity-60">
                                <span className="text-xs">🔒</span>
                                <p className="text-[10px] font-black theme-text-sub uppercase tracking-widest">Protocol managed by Clinical Specialist. Contact care team for adjustments.</p>
                            </div>
                        )}
                    </section>

                    {/* Schedule Log */}
                    <section>
                        <div className="flex items-center justify-between mb-6 px-2">
                            <h2 className="font-black theme-text text-xs uppercase tracking-[0.2em]">Daily Adherence Log</h2>
                        </div>
                        <div className="space-y-4">
                            {log.map((item, i) => (
                                <div key={i} className="border theme-border hover:border-teal-500 rounded-3xl px-8 py-6 flex flex-col sm:flex-row sm:items-center justify-between transition-all group gap-4 relative overflow-hidden shadow-sm hover:shadow-xl">
                                    <div className="flex items-center gap-6 relative z-10">
                                        <div className={`w-3 h-3 rounded-full ${item.dot} shadow-[0_0_12px_rgba(0,0,0,0.15)] animate-pulse`} />
                                        <span className="text-[10px] theme-text-sub font-black w-24 uppercase tracking-[0.2em]">{item.time}</span>
                                        <span className="text-sm font-black theme-text uppercase tracking-tight group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors">{item.med}</span>
                                    </div>
                                    <span className={`text-[10px] font-black px-4 py-2 rounded-xl uppercase tracking-widest border transition-all self-start sm:self-auto relative z-10 ${
                                        item.status === 'Taken' 
                                            ? 'border-green-200 dark:border-green-900/30 text-green-700 dark:text-green-400' 
                                            : item.status === 'Missed'
                                                ? 'border-red-200 dark:border-red-900/30 text-red-600 dark:text-red-400'
                                                : 'border-yellow-200 dark:border-yellow-900/30 text-yellow-700 dark:text-yellow-500'
                                    }`}>
                                        {item.status}
                                    </span>
                                    <div className="absolute -left-10 -top-10 w-24 h-24 bg-teal-500/5 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
                                </div>
                            ))}
                        </div>
                    </section>
                </div>

                {/* Sidebar Info */}
                <div className="space-y-8">
                    <div className="bg-gray-950 border border-gray-800 rounded-[3rem] p-10 text-white shadow-2xl relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-48 h-48 bg-teal-500/10 rounded-full blur-[80px] -mr-24 -mt-24 group-hover:bg-teal-500/20 transition-all duration-700"></div>
                        <h3 className="text-[10px] font-black text-teal-400 uppercase tracking-[0.3em] mb-10 relative z-10">Neural Analysis</h3>
                        <div className="space-y-6 relative z-10">
                            <div className="p-7 bg-white/5 rounded-[2rem] border border-white/10 hover:bg-white/10 transition-all cursor-default group/item">
                                <p className="text-[9px] font-black text-green-400 mb-3 uppercase tracking-[0.2em]">Adherence Trend</p>
                                <p className="text-sm leading-relaxed text-gray-300 font-medium italic opacity-90">"Morning compliance has improved by <span className="text-green-400 font-black not-italic">12%</span> this week. Performance is optimal."</p>
                            </div>
                            <div className="p-7 bg-white/5 rounded-[2rem] border border-white/10 hover:bg-white/10 transition-all cursor-default group/item">
                                <p className="text-[9px] font-black text-yellow-400 mb-3 uppercase tracking-[0.2em]">Optimization</p>
                                <p className="text-sm leading-relaxed text-gray-300 font-medium italic opacity-90">"Evening doses are occasionally delayed. Suggest adjusting 21:00 nudge to 20:45."</p>
                            </div>
                        </div>
                    </div>

                    {isDoctorView && (
                        <div className="border theme-border hover:border-teal-500 rounded-[3rem] p-10 transition-all shadow-sm hover:shadow-xl">
                            <h3 className="font-black theme-text text-[10px] uppercase tracking-[0.3em] mb-10 px-2">Clinical Logic</h3>
                            <div className="space-y-3">
                                <button className="w-full text-left px-6 py-5 rounded-2xl border theme-border text-[10px] font-black theme-text-sub hover:theme-bg hover:text-teal-600 dark:hover:text-teal-400 transition-all uppercase tracking-[0.2em] flex items-center gap-4 group">
                                    <span className="text-2xl group-hover:scale-125 transition-transform">📄</span> Export Clinical Data
                                </button>
                                <button className="w-full text-left px-6 py-5 rounded-2xl border theme-border text-[10px] font-black theme-text-sub hover:theme-bg hover:text-teal-600 dark:hover:text-teal-400 transition-all uppercase tracking-[0.2em] flex items-center gap-4 group">
                                    <span className="text-2xl group-hover:scale-125 transition-transform">🔔</span> Push Neural Nudge
                                </button>
                                <button className="w-full text-left px-6 py-5 rounded-2xl border border-red-100 dark:border-red-900/50 text-[10px] font-black text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/10 transition-all uppercase tracking-[0.2em] flex items-center gap-4 group">
                                    <span className="text-2xl group-hover:scale-125 transition-transform">⚠️</span> Flag Critical Review
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
