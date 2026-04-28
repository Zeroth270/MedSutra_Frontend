const meds = [
  { name: 'Metformin 500mg',   type: 'Tablet', frequency: 'Twice Daily', time: '8 AM & 9 PM', stock: 28, status: 'Active' },
  { name: 'Lisinopril 10mg',   type: 'Tablet', frequency: 'Once Daily',  time: '2 PM',        stock: 14, status: 'Active' },
  { name: 'Atorvastatin 20mg', type: 'Tablet', frequency: 'Once Daily',  time: '6 PM',        stock: 6,  status: 'Low Stock' },
  { name: 'Aspirin 75mg',      type: 'Tablet', frequency: 'Once Daily',  time: '8 AM',        stock: 30, status: 'Active' },
];

export default function Medications() {
  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-black text-gray-900 tracking-tight">Medications</h1>
          <p className="text-gray-500 text-sm mt-1">Manage and track all your prescriptions.</p>
        </div>
        <button className="btn-primary px-5 py-2.5 rounded-lg text-sm">
          Add Medication
        </button>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[
          { label: 'Total',      value: meds.length },
          { label: 'Active',     value: meds.filter(m => m.status === 'Active').length },
          { label: 'Low Stock',  value: meds.filter(m => m.status === 'Low Stock').length },
          { label: 'Next Refill', value: '3 days' },
        ].map(s => (
          <div key={s.label} className="bg-white border border-gray-100 rounded-xl p-5">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">{s.label}</p>
            <p className="text-2xl font-black text-gray-900">{s.value}</p>
          </div>
        ))}
      </div>

      {/* Table */}
      <div className="bg-white border border-gray-100 rounded-xl overflow-hidden">
        {/* Header */}
        <div
          className="grid px-6 py-3 bg-gray-50 border-b border-gray-100 text-xs font-bold text-gray-400 uppercase tracking-wide"
          style={{ gridTemplateColumns: '2fr 1fr 1fr 120px 100px 80px' }}
        >
          <span>Medication</span>
          <span>Frequency</span>
          <span>Schedule</span>
          <span>Stock</span>
          <span>Status</span>
          <span></span>
        </div>

        {meds.map((med, i) => {
          const isLow = med.status === 'Low Stock';
          return (
            <div
              key={i}
              className="grid px-6 py-4 border-b border-gray-50 last:border-0 items-center hover:bg-gray-50 transition-colors"
              style={{ gridTemplateColumns: '2fr 1fr 1fr 120px 100px 80px' }}
            >
              <div>
                <p className="text-sm font-semibold text-gray-900">{med.name}</p>
                <p className="text-xs text-gray-400 mt-0.5">{med.type}</p>
              </div>
              <span className="text-sm text-gray-600">{med.frequency}</span>
              <span className="text-sm text-gray-600">{med.time}</span>
              <div className="flex items-center gap-2">
                <div className="flex-1 bg-gray-100 rounded-full h-1.5 max-w-14">
                  <div
                    className={`h-1.5 rounded-full ${isLow ? 'bg-red-400' : 'bg-green-400'}`}
                    style={{ width: `${Math.min((med.stock / 30) * 100, 100)}%` }}
                  />
                </div>
                <span className="text-xs text-gray-500">{med.stock}</span>
              </div>
              <span className={`text-xs font-semibold px-2.5 py-1 rounded-full w-fit ${isLow ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-700'}`}>
                {med.status}
              </span>
              <button className="text-xs text-gray-400 hover:text-gray-700 font-medium hover:bg-gray-100 px-3 py-1.5 rounded-lg transition-all">
                Edit
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
