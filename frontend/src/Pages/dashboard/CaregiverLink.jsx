import { useState } from 'react';

const caregivers = [
  { name: 'Dr. Priya Sharma', role: 'Primary Physician', status: 'Connected', initial: 'P' },
  { name: 'Anjali Kumar',     role: 'Family Caregiver',  status: 'Connected', initial: 'A' },
];

const permissions = ['Medication Log', 'Adherence Reports', 'Risk Alerts', 'Reminder Notifications'];

export default function CaregiverLink() {
  const [perms, setPerms] = useState(permissions.reduce((a, p) => ({ ...a, [p]: true }), {}));

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-black text-gray-900 tracking-tight">Caregiver Link</h1>
          <p className="text-gray-500 text-sm mt-1">Share your health data with trusted contacts.</p>
        </div>
        <button className="btn-primary px-5 py-2.5 rounded-lg text-sm">Invite Caregiver</button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2 space-y-4">
          <h2 className="font-bold text-gray-900 text-sm">Connected Caregivers</h2>

          {caregivers.map((c, i) => (
            <div key={i} className="bg-white border border-gray-100 rounded-xl p-5 flex items-center gap-4 hover:shadow-sm transition-all">
              <div className="w-10 h-10 rounded-lg bg-gray-900 flex items-center justify-center font-bold text-white text-sm flex-shrink-0">
                {c.initial}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-gray-900 text-sm">{c.name}</p>
                <p className="text-xs text-gray-400 mt-0.5">{c.role}</p>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-xs font-semibold bg-green-50 text-green-700 px-2.5 py-1 rounded-full">
                  {c.status}
                </span>
                <button className="text-xs border border-gray-200 hover:bg-red-50 hover:text-red-500 hover:border-red-100 px-3 py-1.5 rounded-lg text-gray-400 transition-all font-medium">
                  Remove
                </button>
              </div>
            </div>
          ))}

          {/* Add slot */}
          <div className="bg-white border-2 border-dashed border-gray-200 hover:border-gray-400 rounded-xl p-5 flex items-center gap-4 cursor-pointer transition-all group">
            <div className="w-10 h-10 rounded-lg bg-gray-100 group-hover:bg-gray-200 flex items-center justify-center text-gray-400 text-xl flex-shrink-0 transition-all">
              +
            </div>
            <div>
              <p className="font-medium text-gray-500 group-hover:text-gray-900 text-sm transition-colors">Add a caregiver</p>
              <p className="text-xs text-gray-400 mt-0.5">Send an invite via email</p>
            </div>
          </div>
        </div>

        {/* Permissions */}
        <div className="space-y-4">
          <div className="bg-white border border-gray-100 rounded-xl p-6">
            <h2 className="font-bold text-gray-900 text-sm mb-1">Access Permissions</h2>
            <p className="text-xs text-gray-400 mb-5">Control what your caregivers can see</p>
            <div className="space-y-1">
              {permissions.map(perm => (
                <div key={perm} className="flex items-center justify-between py-3 border-b border-gray-50 last:border-0">
                  <span className="text-sm text-gray-700">{perm}</span>
                  <button
                    onClick={() => setPerms(p => ({ ...p, [perm]: !p[perm] }))}
                    className={`relative w-10 h-5 rounded-full transition-colors duration-200 flex-shrink-0 ${perms[perm] ? 'bg-gray-900' : 'bg-gray-200'}`}
                  >
                    <span className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform duration-200 ${perms[perm] ? 'translate-x-5' : 'translate-x-0'}`} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-gray-50 border border-gray-100 rounded-xl p-5">
            <p className="text-xs font-bold text-gray-900 mb-1">Privacy Protected</p>
            <p className="text-xs text-gray-500 leading-relaxed">All data sharing is end-to-end encrypted and HIPAA compliant.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
