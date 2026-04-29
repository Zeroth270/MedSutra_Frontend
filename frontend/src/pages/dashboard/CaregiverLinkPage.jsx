import { useState } from 'react';
import PageHeader from '../../components/ui/PageHeader';
import DoctorCard from '../../components/dashboard/DoctorCard';
import { MOCK_DOCTORS } from '../../constants/doctors';

const initialCaregivers = [
  { name: 'Dr. Priya Sharma', role: 'Primary Physician', status: 'Connected', initial: 'P' },
  { name: 'Anjali Kumar', role: 'Family Caregiver', status: 'Connected', initial: 'A' },
];

const permissions = ['Medication Log', 'Adherence Reports', 'Risk Alerts', 'Reminder Notifications'];

export default function CaregiverLinkPage() {
  const [perms, setPerms] = useState(permissions.reduce((a, p) => ({ ...a, [p]: true }), {}));
  const [searchQuery, setSearchQuery] = useState('');
  const [caregivers, setCaregivers] = useState(initialCaregivers);

  const filteredDoctors = MOCK_DOCTORS.filter(doc => 
    doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    doc.specialty.toLowerCase().includes(searchQuery.toLowerCase()) ||
    doc.diseases.some(d => d.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="animate-fade-in">
      <PageHeader
        title="Caregivers & Specialists"
        subtitle="Manage your care team and find the right specialists for your health needs."
        actionLabel="Invite Caregiver"
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {/* Connected Caregivers Section */}
          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-bold text-gray-900 text-lg tracking-tight">Connected Care Team</h2>
              <span className="text-xs font-medium text-teal-600 bg-teal-50 px-2 py-1 rounded-md">{caregivers.length} Active</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {caregivers.map((c, i) => (
                <div key={i} className="bg-white border border-gray-100 rounded-2xl p-5 flex items-center gap-4 hover:shadow-md transition-all group">
                  <div className="w-12 h-12 rounded-xl bg-gray-900 flex items-center justify-center font-bold text-white text-lg flex-shrink-0 group-hover:bg-teal-600 transition-colors">{c.initial}</div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-gray-900 text-sm">{c.name}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{c.role}</p>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <span className="text-[10px] font-bold bg-green-50 text-green-700 px-2 py-0.5 rounded-full">{c.status}</span>
                    <button className="text-[10px] text-gray-400 hover:text-red-500 font-bold transition-colors">Manage</button>
                  </div>
                </div>
              ))}
              <div className="bg-white border-2 border-dashed border-gray-100 hover:border-teal-200 rounded-2xl p-5 flex items-center gap-4 cursor-pointer transition-all group">
                <div className="w-12 h-12 rounded-xl bg-gray-50 group-hover:bg-teal-50 flex items-center justify-center text-gray-400 group-hover:text-teal-500 text-2xl flex-shrink-0 transition-all">+</div>
                <div>
                  <p className="font-bold text-gray-500 group-hover:text-teal-700 text-sm transition-colors">Add Caregiver</p>
                  <p className="text-[11px] text-gray-400 mt-0.5">Invite via email or code</p>
                </div>
              </div>
            </div>
          </section>

          {/* Find Specialists Section */}
          <section className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h2 className="font-bold text-gray-900 text-lg tracking-tight">Recommended Specialists</h2>
                <p className="text-xs text-gray-500 mt-1">Based on your medical history and AI analysis.</p>
              </div>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search by disease or specialty..."
                  className="pl-10 pr-4 py-2.5 bg-white border border-gray-100 rounded-xl text-xs focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none w-full md:w-64 transition-all"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400">🔍</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {filteredDoctors.map((doc, i) => (
                <DoctorCard key={i} doctor={doc} />
              ))}
              {filteredDoctors.length === 0 && (
                <div className="col-span-full py-12 text-center bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                  <p className="text-gray-500 font-medium">No doctors found matching your search.</p>
                  <button
                    onClick={() => setSearchQuery('')}
                    className="mt-2 text-teal-600 font-bold text-sm hover:underline"
                  >
                    Clear filters
                  </button>
                </div>
              )}
            </div>
          </section>
        </div>

        <div className="space-y-6">
          <div className="bg-white border border-gray-100 rounded-2xl p-6 sticky top-24 shadow-sm">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-2 h-6 bg-teal-500 rounded-full"></div>
              <h2 className="font-bold text-gray-900 text-base">Global Permissions</h2>
            </div>
            <p className="text-xs text-gray-500 mb-6">These settings apply to all connected caregivers unless overridden individually.</p>

            <div className="space-y-2">
              {permissions.map(perm => (
                <div key={perm} className="flex items-center justify-between py-3.5 border-b border-gray-50 last:border-0">
                  <div className="flex flex-col">
                    <span className="text-sm font-semibold text-gray-700">{perm}</span>
                    <span className="text-[10px] text-gray-400">Real-time data sync</span>
                  </div>
                  <button
                    onClick={() => setPerms(p => ({ ...p, [perm]: !p[perm] }))}
                    className={`relative w-11 h-6 rounded-full transition-all duration-300 flex-shrink-0 p-1 ${perms[perm] ? 'bg-teal-600' : 'bg-gray-200'}`}
                  >
                    <span className={`block w-4 h-4 bg-white rounded-full shadow-sm transform transition-transform duration-300 ${perms[perm] ? 'translate-x-5' : 'translate-x-0'}`} />
                  </button>
                </div>
              ))}
            </div>

            <button className="w-full mt-6 py-3 bg-gray-900 text-white rounded-xl text-xs font-bold hover:bg-teal-600 transition-all shadow-md active:scale-95">
              Update Preferences
            </button>
          </div>

          {/* <div className="bg-gradient-to-br from-teal-500 to-teal-700 rounded-2xl p-6 text-white shadow-lg relative overflow-hidden group">
             <div className="relative z-10">
              <p className="text-xs font-bold uppercase tracking-widest opacity-80 mb-2">MedSutra Premium</p>
              <h3 className="text-lg font-black leading-tight mb-3">Get 24/7 Priority <br />Doctor Access</h3>
              <p className="text-[11px] opacity-90 leading-relaxed mb-4">Unlimited video consultations with top-rated specialists at just $29/month.</p>
              <button className="bg-white text-teal-700 px-4 py-2 rounded-lg text-[11px] font-black hover:bg-teal-50 transition-all">
                Upgrade Now
              </button>
            </div>
            
            <div className="absolute -right-8 -bottom-8 w-32 h-32 bg-white/10 rounded-full group-hover:scale-110 transition-transform duration-500"></div>
            <div className="absolute -left-4 -top-4 w-20 h-20 bg-black/5 rounded-full group-hover:scale-110 transition-transform duration-500"></div>
          </div> */}

          {/* <div className="bg-gray-50 border border-gray-100 rounded-2xl p-5">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-teal-600 text-lg">🛡️</span>
              <p className="text-xs font-bold text-gray-900">Privacy First</p>
            </div>
            <p className="text-[11px] text-gray-500 leading-relaxed">
              We use 256-bit encryption to protect your medical records. You have full control over who sees your data.
            </p>
          </div> */}
        </div>
      </div>
    </div>
  );
}

