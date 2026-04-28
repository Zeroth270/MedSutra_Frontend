import { useState } from 'react';

const factors = [
  { label: 'Missed Doses (Last 30 Days)',  value: 9,  max: 30,  risk: 'Medium', barColor: 'bg-yellow-400', badgeClass: 'bg-yellow-50 text-yellow-700' },
  { label: 'Adherence Rate',               value: 94, max: 100, risk: 'Low',    barColor: 'bg-green-400',  badgeClass: 'bg-green-50 text-green-700' },
  { label: 'Refill Delay Risk',            value: 30, max: 100, risk: 'Low',    barColor: 'bg-green-400',  badgeClass: 'bg-green-50 text-green-700' },
  { label: 'Non-Adherence Prediction',     value: 15, max: 100, risk: 'Low',    barColor: 'bg-green-400',  badgeClass: 'bg-green-50 text-green-700' },
];

const tips = [
  'Refill Atorvastatin soon — only 6 doses remaining.',
  'Enable push notifications to reduce missed evening doses.',
  'Your Wednesday adherence dropped to 66% — review your schedule.',
];

export default function RiskReport() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-black text-gray-900 tracking-tight">Risk Report</h1>
        <p className="text-gray-500 text-sm mt-1">AI-powered analysis of your adherence patterns.</p>
      </div>

      {/* Score card */}
      <div className="bg-gray-900 rounded-xl p-8 mb-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div>
          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Overall Risk Score</p>
          <p className="text-4xl font-black text-white mb-2">Low Risk</p>
          <p className="text-gray-400 text-sm">Based on the last 30 days of data</p>
        </div>
        <div className="text-left sm:text-right">
          <p className="text-6xl font-black text-white">94<span className="text-3xl text-gray-400">%</span></p>
          <p className="text-gray-500 text-sm mt-1">Adherence Rate</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Risk factors */}
        <div className="lg:col-span-2 bg-white border border-gray-100 rounded-xl p-7">
          <h2 className="font-bold text-gray-900 text-sm mb-6">Risk Factors</h2>
          <div className="space-y-6">
            {factors.map((f, i) => (
              <div key={i}>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-gray-700 font-medium">{f.label}</span>
                  <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${f.badgeClass}`}>{f.risk}</span>
                </div>
                <div className="bg-gray-100 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full ${f.barColor} transition-all duration-700`}
                    style={{ width: `${(f.value / f.max) * 100}%` }}
                  />
                </div>
                <p className="text-xs text-gray-400 mt-1.5">{f.value} / {f.max}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Recommendations */}
        <div className="space-y-4">
          <div className="bg-white border border-gray-100 rounded-xl p-6">
            <h2 className="font-bold text-gray-900 text-sm mb-5">AI Recommendations</h2>
            <div className="space-y-3">
              {tips.map((tip, i) => (
                <div key={i} className="flex gap-3 p-3.5 bg-gray-50 rounded-lg">
                  <div className="w-5 h-5 rounded bg-gray-900 flex items-center justify-center text-white text-xs font-black flex-shrink-0 mt-0.5">
                    {i + 1}
                  </div>
                  <p className="text-xs text-gray-600 leading-relaxed">{tip}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-gray-900 rounded-xl p-6">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Next Analysis</p>
            <p className="text-white font-bold text-base">In 7 days</p>
            <p className="text-gray-500 text-xs mt-1">AI refreshes your report every week</p>
          </div>
        </div>
      </div>
    </div>
  );
}
