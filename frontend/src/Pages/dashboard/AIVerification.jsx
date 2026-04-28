import { useState } from 'react';

const STEPS = [
  { step: '01', title: 'Take a clear photo', desc: 'Photograph your medication label or pill packet in good lighting.' },
  { step: '02', title: 'Upload to AI', desc: 'Our AI Vision model reads and extracts all medication details.' },
  { step: '03', title: 'Verify match', desc: 'AI compares it against your prescription and flags any mismatches.' },
];

const HISTORY = [
  { med: 'Metformin 500mg', date: 'Today, 8:02 AM', result: 'Verified', ok: true },
  { med: 'Lisinopril 10mg', date: 'Yesterday, 2:15 PM', result: 'Verified', ok: true },
  { med: 'Unknown tablet', date: 'Apr 26, 6:00 PM', result: 'Mismatch', ok: false },
];

export default function AIVerification() {
  const [dragging, setDragging] = useState(false);

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-black text-gray-900 tracking-tight">AI Verification</h1>
        <p className="text-gray-400 text-sm mt-1">Scan and verify your medications with AI Vision</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Upload panel */}
        <div
          onDragOver={e => { e.preventDefault(); setDragging(true); }}
          onDragLeave={() => setDragging(false)}
          onDrop={e => { e.preventDefault(); setDragging(false); }}
          className={`flex flex-col items-center justify-center gap-5 rounded-2xl p-12 border-2 border-dashed cursor-pointer transition-all ${dragging ? 'border-yellow-400 bg-yellow-50' : 'border-gray-200 bg-white hover:border-yellow-400 hover:bg-amber-50/30'}`}
        >
          <div className={`w-20 h-20 rounded-3xl flex items-center justify-center text-4xl transition-all ${dragging ? 'bg-yellow-100 border-yellow-300' : 'bg-yellow-50 border border-yellow-100'}`}>
            🔬
          </div>
          <div className="text-center">
            <p className="font-bold text-gray-800 text-base">Drop your medication image here</p>
            <p className="text-gray-400 text-sm mt-1.5">or click to browse from your device</p>
          </div>
          <button className="btn-primary px-7 py-3 rounded-xl text-sm">
            Choose File
          </button>
          <p className="text-xs text-gray-400">Supports JPG, PNG, WEBP — Max 10MB</p>
        </div>

        {/* How it works */}
        <div className="bg-white border border-gray-100 rounded-2xl p-7 shadow-sm">
          <h2 className="font-bold text-gray-900 mb-6 text-base">How It Works</h2>
          <div className="space-y-6">
            {STEPS.map((s, i) => (
              <div key={s.step} className="flex gap-4">
                <div className="w-10 h-10 bg-gradient-to-br from-yellow-400 to-amber-500 rounded-xl flex items-center justify-center text-sm font-black text-black flex-shrink-0 shadow-md shadow-yellow-100">
                  {s.step}
                </div>
                <div className="pt-1">
                  <p className="text-sm font-semibold text-gray-900">{s.title}</p>
                  <p className="text-xs text-gray-400 mt-1 leading-relaxed">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 bg-gray-950 rounded-2xl p-5">
            <p className="text-yellow-400 text-xs font-bold uppercase tracking-widest mb-2">🤖 AI Model</p>
            <p className="text-white text-sm font-semibold">Vision Verification v2.1</p>
            <p className="text-gray-500 text-xs mt-1">99.2% accuracy on prescription matches</p>
          </div>
        </div>
      </div>

      {/* Verification history */}
      <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
        <div className="px-7 py-5 border-b border-gray-50">
          <h2 className="font-bold text-gray-900">Recent Verifications</h2>
        </div>
        <div className="divide-y divide-gray-50">
          {HISTORY.map((h, i) => (
            <div key={i} className="flex items-center justify-between px-7 py-4 hover:bg-gray-50/60 transition-colors">
              <div className="flex items-center gap-4">
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-lg flex-shrink-0 ${h.ok ? 'bg-green-50' : 'bg-red-50'}`}>
                  {h.ok ? '✅' : '⚠️'}
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-900">{h.med}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{h.date}</p>
                </div>
              </div>
              <span className={`text-xs font-bold px-3 py-1.5 rounded-full ${h.ok ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'}`}>
                {h.result}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
