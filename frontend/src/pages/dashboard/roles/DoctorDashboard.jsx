import { useOutletContext } from 'react-router-dom';
import { useState } from 'react';
import PatientDashboard from './PatientDashboard';

const INITIAL_PATIENTS = [
    { id: 1, name: 'John Doe', status: 'At Risk', adherence: '65%', lastSeen: '2 hrs ago', color: 'text-red-600', bg: 'bg-red-50', avatar: 'JD' },
    { id: 2, name: 'Jane Smith', status: 'Stable', adherence: '98%', lastSeen: '5 hrs ago', color: 'text-green-700', bg: 'bg-green-50', avatar: 'JS' },
    { id: 3, name: 'Robert Fox', status: 'Stable', adherence: '92%', lastSeen: '1 day ago', color: 'text-green-700', bg: 'bg-green-50', avatar: 'RF' },
];

export default function DoctorDashboard() {
    const { user } = useOutletContext();
    const [selectedPatient, setSelectedPatient] = useState(null);
    const [patients, setPatients] = useState(INITIAL_PATIENTS);

    const quickStats = [
        { label: 'Total Patients', value: patients.length, icon: '👥' },
        { label: 'Professional Rating', value: '4.9', sub: 'Based on 128 reviews', icon: '⭐' },
        { label: 'Consultations', value: '12', icon: '📅' },
    ];

    const handleRegister = () => {
        const name = window.prompt('Enter new patient full name:');
        if (!name) return;
        const initials = name.split(' ').map(n => n[0]).join('').toUpperCase();

        const newPatient = {
            id: Date.now(),
            name,
            status: 'Stable',
            adherence: '100%',
            lastSeen: 'Just now',
            avatar: initials || 'P'
        };
        setPatients([...patients, newPatient]);
    };

    const handleRemovePatient = (e, id) => {
        e.stopPropagation(); // Prevent card click
        if (window.confirm('Are you sure you want to remove this patient from your clinical oversight?')) {
            setPatients(patients.filter(p => p.id !== id));
        }
    };

    if (selectedPatient) {
        return (
            <div className="animate-fade-in">
                <button
                    onClick={() => setSelectedPatient(null)}
                    className="mb-6 flex items-center gap-2 text-sm font-black theme-text-sub hover:theme-text transition-all group"
                >
                    <span className="group-hover:-translate-x-1 transition-transform">←</span>
                    <span className="uppercase tracking-widest text-[10px]">Back to Overview</span>
                </button>
                <PatientDashboard selectedPatient={selectedPatient} isDoctorView={true} />
            </div>
        );
    }

    return (
        <div className="animate-fade-in space-y-10">
            <div className="mb-8 px-1">
                <h1 className="text-3xl font-black theme-text tracking-tight uppercase">Doctor Portal, Dr. {user.name}</h1>
                <p className="theme-text-sub text-sm mt-1.5 font-medium">Monitor patient adherence, manage clinical care plans, and track performance.</p>
            </div>

            {/* Performance Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {quickStats.map(s => (
                    <div key={s.label} className="theme-surface border theme-border rounded-3xl p-8 shadow-sm hover:shadow-xl transition-all group card-hover">
                        <div className="flex items-center justify-between mb-6">
                            <p className="text-[10px] font-black theme-text-sub uppercase tracking-[0.2em]">{s.label}</p>
                            <span className="text-2xl group-hover:scale-125 transition-transform drop-shadow-sm">{s.icon}</span>
                        </div>
                        <p className="text-4xl font-black theme-text mb-2 group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors">{s.value}</p>
                        <p className="text-[10px] theme-text-sub font-black uppercase tracking-widest">{s.sub || 'Real-time Sync'}</p>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                {/* Patient List Column */}
                <div className="lg:col-span-2 space-y-8">
                    <div className="flex items-center justify-between px-2">
                        <h2 className="font-black theme-text text-xl uppercase tracking-tight">Active Clinical Accounts</h2>
                        <button onClick={handleRegister} className="text-[10px] font-black text-teal-600 dark:text-teal-400 hover:underline uppercase tracking-widest">+ Register New</button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {patients.map((p) => (
                            <div
                                key={p.id}
                                onClick={() => setSelectedPatient(p)}
                                className="theme-surface border theme-border rounded-[2.5rem] p-8 shadow-sm hover:shadow-2xl hover:border-teal-300 dark:hover:border-teal-700 transition-all cursor-pointer group card-hover relative overflow-hidden"
                            >
                                <div className="flex items-start justify-between mb-8 relative z-10">
                                    <div className="flex items-center gap-6">
                                        <div className="w-16 h-16 rounded-2xl bg-gray-900 dark:bg-teal-600 flex items-center justify-center font-black text-white text-xl group-hover:rotate-6 transition-transform shadow-xl border-2 border-white dark:border-gray-800">
                                            {p.avatar}
                                        </div>
                                        <div className="min-w-0">
                                            <h3 className="font-black theme-text text-lg truncate group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors uppercase tracking-tight">{p.name}</h3>
                                            <p className="text-[10px] theme-text-sub font-black uppercase tracking-widest mt-1.5 opacity-60">Activity: {p.lastSeen}</p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={(e) => handleRemovePatient(e, p.id)}
                                        className="w-10 h-10 rounded-xl border theme-border flex items-center justify-center theme-text-sub hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all shadow-sm"
                                        title="Remove Patient"
                                    >
                                        ✕
                                    </button>
                                </div>

                                <div className="flex items-center justify-between pt-6 border-t theme-border relative z-10">
                                    <div>
                                        <p className="text-[9px] font-black theme-text-sub uppercase tracking-[0.2em] mb-1.5">Compliance Rate</p>
                                        <p className="text-xl font-black theme-text">{p.adherence}</p>
                                    </div>
                                    <span className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border shadow-sm ${p.status === 'At Risk'
                                        ? 'bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 border-red-100 dark:border-red-900/50'
                                        : 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 border-green-100 dark:border-green-800/50'
                                        }`}>
                                        {p.status}
                                    </span>
                                </div>
                                <div className="absolute -right-8 -bottom-8 w-24 h-24 bg-teal-500/5 rounded-full blur-3xl" />
                            </div>
                        ))}

                        {/* <button onClick={handleRegister} className="border-2 border-dashed theme-border rounded-[2.5rem] p-10 flex flex-col items-center justify-center gap-5 hover:border-teal-300 dark:hover:border-teal-700 hover:theme-bg transition-all group min-h-[220px] shadow-sm">
                            <div className="w-16 h-16 rounded-2xl theme-bg flex items-center justify-center theme-text-sub group-hover:bg-teal-100 dark:group-hover:bg-teal-900 group-hover:text-teal-600 transition-all shadow-md border theme-border">
                                <span className="text-3xl font-black">+</span>
                            </div>
                            <div className="text-center">
                                <span className="text-[10px] font-black theme-text group-hover:text-teal-700 dark:group-hover:text-teal-400 uppercase tracking-widest transition-colors mb-1">Onboard Patient</span>
                                <p className="text-[9px] theme-text-sub font-bold uppercase tracking-widest opacity-60">Register new medical node</p>
                            </div>
                        </button> */}
                    </div>
                </div>

                {/* Feedback Hub */}
                <div className="space-y-8">
                    <div className="flex items-center justify-between px-2">
                        <h2 className="font-black theme-text text-xl uppercase tracking-tight">Feedback Hub</h2>
                    </div>

                    <div className="theme-surface border theme-border rounded-[3rem] overflow-hidden shadow-lg hover:shadow-2xl transition-all">
                        <div className="p-10 border-b theme-border theme-bg/50">
                            <div className="flex items-baseline gap-2">
                                <span className="text-6xl font-black theme-text">4.9</span>
                                <span className="text-base font-black theme-text-sub opacity-40 uppercase tracking-widest">/ 5.0</span>
                            </div>
                            <div className="flex gap-1.5 mt-6">
                                {[1, 2, 3, 4, 5].map(i => (
                                    <span key={i} className="text-yellow-400 text-2xl drop-shadow-sm">★</span>
                                ))}
                            </div>
                            <p className="text-[10px] theme-text-sub font-black uppercase tracking-[0.2em] mt-8 opacity-70">98% Positive Adherence Outcomes</p>
                        </div>

                        <div className="p-4 space-y-2">
                            {[
                                { author: 'Sarah Miller', role: 'Caregiver', comment: 'Excellent coordination on medication reports.', date: '2d ago' },
                                { author: 'John Doe', role: 'Patient', comment: 'The AI feedback has been life-changing.', date: '1w ago' }
                            ].map((review, i) => (
                                <div key={i} className="p-6 hover:theme-bg rounded-[1.5rem] transition-all group">
                                    <div className="flex items-center justify-between mb-3">
                                        <div className="flex items-center gap-3">
                                            <span className="text-xs font-black theme-text group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors">{review.author}</span>
                                            <span className="text-[8px] font-black theme-text-sub uppercase px-2 py-0.5 theme-bg rounded-md tracking-widest border theme-border">{review.role}</span>
                                        </div>
                                        <span className="text-[9px] theme-text-sub font-bold opacity-50">{review.date}</span>
                                    </div>
                                    <p className="text-xs theme-text leading-relaxed font-medium italic opacity-80">"{review.comment}"</p>
                                </div>
                            ))}
                        </div>

                        <button onClick={() => alert('Loading full clinical feedback archives...')} className="w-full py-6 text-[10px] font-black theme-text-sub hover:text-teal-600 dark:hover:text-teal-400 border-t theme-border theme-bg/30 transition-all uppercase tracking-[0.2em] hover:bg-teal-50/20 dark:hover:bg-teal-900/10">
                            Read Archives
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
