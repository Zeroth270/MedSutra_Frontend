import { useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import DoctorCard from '../../../components/dashboard/DoctorCard';
import { MOCK_DOCTORS } from '../../../constants/doctors';

export default function CaregiverDashboard() {
  const { user } = useOutletContext();
  const [searchQuery, setSearchQuery] = useState('');

  const monitoredPatients = [
    { name: 'Sarah Miller (Mother)', status: 'Missed Dose', time: '10:30 AM', med: 'Blood Pressure', urgency: 'high' },
    { name: 'James Miller (Father)', status: 'On Track', time: '8:00 AM', med: 'Vitamins', urgency: 'low' },
  ];

  const filteredDoctors = MOCK_DOCTORS.filter(doc =>
    doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    doc.specialty.toLowerCase().includes(searchQuery.toLowerCase()) ||
    doc.diseases.some(d => d.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="animate-fade-in space-y-10">
      <div className="mb-8">
        <h1 className="text-2xl font-black text-gray-900 tracking-tight">Caregiver Dashboard, {user.name}</h1>
        <p className="text-gray-500 text-sm mt-1.5">Manage and monitor health schedules for your loved ones.</p>
      </div>

      {/* Monitored Patients Section */}
      <section className="space-y-5">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold text-gray-400 uppercase tracking-widest px-1">Monitored Accounts</h2>
          <span className="text-xs font-bold text-teal-600 bg-teal-50 px-2 py-1 rounded-md">2 Patients</span>
        </div>
        <div className="grid grid-cols-1 gap-5">
          {monitoredPatients.map((p, i) => (
            <div key={i} className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all group">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold text-lg transition-transform group-hover:scale-105 ${p.urgency === 'high' ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'}`}>
                    {p.name.charAt(0)}
                  </div>
                  <div>
                    <h3 className="font-black text-gray-900 group-hover:text-teal-700 transition-colors">{p.name}</h3>
                    <p className="text-xs text-gray-500 italic">Last medication: {p.med} at {p.time}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className={`px-4 py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest ${p.urgency === 'high' ? 'bg-red-600 text-white shadow-lg shadow-red-100' : 'bg-gray-100 text-gray-600'}`}>
                    {p.status}
                  </div>
                  <button className="bg-gray-900 text-white px-5 py-2 rounded-xl text-xs font-bold hover:bg-teal-600 transition-all active:scale-95 shadow-sm">
                    Contact
                  </button>
                </div>
              </div>
            </div>
          ))}

          <button className="border-2 border-dashed border-gray-200 rounded-2xl p-8 flex flex-col items-center justify-center gap-2 hover:border-teal-300 hover:bg-teal-50/30 transition-all text-gray-400 group">
            <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center group-hover:bg-teal-100 group-hover:text-teal-600 transition-colors">
              <span className="text-2xl">+</span>
            </div>
            <span className="text-sm font-bold text-gray-500 group-hover:text-teal-700">Add Patient to Monitor</span>
          </button>
        </div>
      </section>

      {/* Recommended Specialists Section */}
      <section className="space-y-6 pt-6 border-t border-gray-100">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-sm font-bold text-gray-400 uppercase tracking-widest px-1">Specialist Consultation</h2>
            <p className="text-xs text-gray-500 mt-1">Select and consult with specialists for your patients.</p>
          </div>
          <div className="relative">
            <input
              type="text"
              placeholder="Search specialists or diseases..."
              className="pl-10 pr-4 py-2.5 bg-white border border-gray-100 rounded-xl text-xs focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none w-full md:w-72 transition-all shadow-sm"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400">🔍</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDoctors.map((doc, i) => (
            <DoctorCard key={i} doctor={doc} />
          ))}
        </div>

        {filteredDoctors.length === 0 && (
          <div className="py-12 text-center bg-gray-50 rounded-2xl border border-dashed border-gray-200">
            <p className="text-gray-500 font-medium text-sm">No specialists found for your search criteria.</p>
            <button
              onClick={() => setSearchQuery('')}
              className="mt-2 text-teal-600 font-bold text-xs hover:underline"
            >
              View all specialists
            </button>
          </div>
        )}
      </section>

      {/* Health Insights / Tips for Caregivers */}
      <div className="bg-gradient-to-r from-gray-900 to-teal-900 rounded-2xl p-8 text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10 max-w-lg">
          <h3 className="text-xl font-black mb-2">Caregiver Excellence Program</h3>
          <p className="text-sm opacity-80 leading-relaxed mb-6">
            Access exclusive training modules and AI-driven insights to provide the best possible care for your patients.
          </p>
          <button className="bg-white text-teal-900 px-6 py-3 rounded-xl text-xs font-black hover:bg-teal-50 transition-all active:scale-95">
            Learn More
          </button>
        </div>
        <div className="absolute right-[-20px] top-[-20px] w-64 h-64 bg-white/5 rounded-full blur-3xl"></div>
        <div className="absolute right-[10%] bottom-[-50px] w-48 h-48 bg-teal-400/10 rounded-full blur-2xl"></div>
      </div>
    </div>
  );
}

