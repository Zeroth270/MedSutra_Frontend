import { useOutletContext } from 'react-router-dom';
import { useState } from 'react';
import PatientDashboard from './PatientDashboard';

export default function DoctorDashboard() {
    const { user } = useOutletContext();
    const [selectedPatient, setSelectedPatient] = useState(null);

    const patientUpdates = [
        { id: 1, name: 'John Doe', status: 'At Risk', adherence: '65%', lastSeen: '2 hrs ago', color: 'text-red-600', bg: 'bg-red-50', avatar: 'JD' },
        { id: 2, name: 'Jane Smith', status: 'Stable', adherence: '98%', lastSeen: '5 hrs ago', color: 'text-green-700', bg: 'bg-green-50', avatar: 'JS' },
        { id: 3, name: 'Robert Fox', status: 'Stable', adherence: '92%', lastSeen: '1 day ago', color: 'text-green-700', bg: 'bg-green-50', avatar: 'RF' },
    ];

    const quickStats = [
        { label: 'Total Patients', value: '42', sub: '+3 this week', icon: '👥' },
        { label: 'Professional Rating', value: '4.9', sub: 'Based on 128 reviews', icon: '⭐' },
        { label: 'Consultations', value: '12', sub: 'Today', icon: '📅' },
    ];

    const recentReviews = [
        { id: 1, author: 'Sarah Miller', role: 'Caregiver', rating: 5, comment: 'Dr. Johnson is incredibly professional. The way he handles the medication adherence reports for my mother is impressive.', date: '2 days ago' },
        { id: 2, author: 'John Doe', role: 'Patient', rating: 4, comment: 'Very helpful and always available for consultations. The AI verification feedback has been life-changing.', date: '1 week ago' },
        { id: 3, author: 'Emily Watson', role: 'Caregiver', rating: 5, comment: 'Expert advice and very compassionate. Highly recommend for any heart-related concerns.', date: '2 weeks ago' },
    ];

    if (selectedPatient) {
        return (
            <div className="animate-fade-in">
                <button
                    onClick={() => setSelectedPatient(null)}
                    className="mb-6 flex items-center gap-2 text-sm font-semibold text-gray-500 hover:text-gray-900 transition-colors"
                >
                    <span>← Back to Overview</span>
                </button>
                <PatientDashboard selectedPatient={selectedPatient} isDoctorView={true} />
            </div>
        );
    }

    return (
        <div className="animate-fade-in space-y-10">
            <div className="mb-8">
                <h1 className="text-2xl font-black text-gray-900 tracking-tight">Doctor Portal, Dr. {user.name}</h1>
                <p className="text-gray-500 text-sm mt-1.5">Monitor patient adherence, manage clinical care plans, and track your professional performance.</p>
            </div>

            {/* Performance Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {quickStats.map(s => (
                    <div key={s.label} className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all group">
                        <div className="flex items-center justify-between mb-4">
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{s.label}</p>
                            <span className="text-xl group-hover:scale-110 transition-transform">{s.icon}</span>
                        </div>
                        <p className="text-3xl font-black text-gray-900 mb-1">{s.value}</p>
                        <p className="text-xs text-gray-400 font-medium">{s.sub}</p>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Patient List Column */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="flex items-center justify-between">
                        <h2 className="font-black text-gray-900 text-lg">Patient Accounts</h2>
                        <button className="text-xs font-bold text-teal-600 hover:underline">View All Patients</button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        {patientUpdates.map((p) => (
                            <div
                                key={p.id}
                                onClick={() => setSelectedPatient(p)}
                                className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm hover:shadow-lg hover:border-teal-100 transition-all cursor-pointer group card-hover"
                            >
                                <div className="flex items-center gap-4 mb-5">
                                    <div className="w-12 h-12 rounded-xl bg-gray-900 flex items-center justify-center font-bold text-white text-lg group-hover:bg-teal-600 transition-colors">
                                        {p.avatar}
                                    </div>
                                    <div className="min-w-0">
                                        <h3 className="font-bold text-gray-900 truncate group-hover:text-teal-700 transition-colors">{p.name}</h3>
                                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-tighter">Last activity: {p.lastSeen}</p>
                                    </div>
                                </div>

                                <div className="flex items-center justify-between pt-4 border-t border-gray-50">
                                    <div>
                                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Adherence</p>
                                        <p className="text-sm font-black text-gray-900">{p.adherence}</p>
                                    </div>
                                    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${p.bg} ${p.color}`}>
                                        {p.status}
                                    </span>
                                </div>
                            </div>
                        ))}

                        <button className="border-2 border-dashed border-gray-100 rounded-2xl p-6 flex flex-col items-center justify-center gap-2 hover:border-teal-300 hover:bg-teal-50/30 transition-all group min-h-[160px]">
                            <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 group-hover:bg-teal-100 group-hover:text-teal-600 transition-colors">
                                <span className="text-xl">+</span>
                            </div>
                            <span className="text-xs font-bold text-gray-500 group-hover:text-teal-700">Register New Patient</span>
                        </button>
                    </div>
                </div>

                {/* Ratings & Reviews Column */}
                <div className="space-y-6">
                    <div className="flex items-center justify-between">
                        <h2 className="font-black text-gray-900 text-lg">Reviews & Feedback</h2>
                        <span className="text-[10px] font-black bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded-md">⭐ Top Rated</span>
                    </div>

                    <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm">
                        <div className="p-6 border-b border-gray-50 bg-gray-50/50">
                            <div className="flex items-baseline gap-2">
                                <span className="text-4xl font-black text-gray-900">4.9</span>
                                <span className="text-sm font-bold text-gray-400">/ 5.0</span>
                            </div>
                            <div className="flex gap-1 mt-2">
                                {[1, 2, 3, 4, 5].map(i => (
                                    <span key={i} className="text-yellow-400 text-sm">★</span>
                                ))}
                            </div>
                            <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mt-4">98% Positive Feedback</p>
                        </div>

                        <div className="p-2 space-y-1">
                            {recentReviews.map(review => (
                                <div key={review.id} className="p-4 hover:bg-gray-50 rounded-xl transition-colors group">
                                    <div className="flex items-center justify-between mb-2">
                                        <div className="flex items-center gap-2">
                                            <span className="text-xs font-bold text-gray-900">{review.author}</span>
                                            <span className="text-[9px] font-bold text-gray-400 uppercase px-1.5 py-0.5 bg-gray-100 rounded">{review.role}</span>
                                        </div>
                                        <span className="text-[10px] text-gray-300 font-medium">{review.date}</span>
                                    </div>
                                    <div className="flex gap-0.5 mb-2">
                                        {[...Array(review.rating)].map((_, i) => (
                                            <span key={i} className="text-yellow-400 text-[10px]">★</span>
                                        ))}
                                    </div>
                                    <p className="text-xs text-gray-600 leading-relaxed italic">"{review.comment}"</p>
                                </div>
                            ))}
                        </div>

                        <button className="w-full py-4 text-xs font-black text-gray-400 hover:text-gray-900 border-t border-gray-50 transition-colors">
                            Read All 128 Reviews
                        </button>
                    </div>

                    {/* <div className="bg-gray-900 rounded-2xl p-6 text-white shadow-lg shadow-gray-200">
                        <p className="text-[10px] font-bold text-teal-400 uppercase tracking-widest mb-2">Professional Growth</p>
                        <h3 className="text-sm font-black mb-3">Improve your rating?</h3>
                        <p className="text-[11px] opacity-70 leading-relaxed mb-4">Complete patient follow-ups within 24 hours to increase your "Response Time" score.</p>
                        <button className="text-[10px] font-black underline hover:text-teal-400 transition-colors">View performance tips</button>
                    </div> */}
                </div>
            </div>
        </div>
    );
}

