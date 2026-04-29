import PageHeader from '../../components/ui/PageHeader';

const factors = [
  { label: 'Missed Doses (Last 30 Days)', value: 9, max: 30, risk: 'Medium', barColor: 'bg-yellow-400', badgeClass: 'bg-yellow-50 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-400 border-yellow-100 dark:border-yellow-800/50' },
  { label: 'Adherence Rate', value: 94, max: 100, risk: 'Low', barColor: 'bg-teal-500', badgeClass: 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 border-green-100 dark:border-green-800/50' },
  { label: 'Refill Delay Risk', value: 30, max: 100, risk: 'Low', barColor: 'bg-teal-500', badgeClass: 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 border-green-100 dark:border-green-800/50' },
  { label: 'Non-Adherence Prediction', value: 15, max: 100, risk: 'Low', barColor: 'bg-teal-500', badgeClass: 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 border-green-100 dark:border-green-800/50' },
];

const tips = [
  { title: 'Urgent Refill', desc: 'Atorvastatin supply is critical. Only 6 units remaining in your tracked stock.' },
  { title: 'Adaptive Nudges', desc: 'Enable push notifications for 9:00 PM doses to reduce historical variance.' },
  { title: 'Pattern Detected', desc: 'Wednesday adherence is 28% lower than average. Consider a mid-week check-in.' },
];

export default function RiskReportPage() {
  return (
    <div className="animate-fade-in space-y-10">
      <PageHeader title="Precision Analytics" subtitle="AI-driven pattern recognition for medication adherence risk." />

      {/* Hero Analytics Box */}
      <div className="bg-gray-950 rounded-[3rem] p-10 flex flex-col lg:flex-row items-center justify-between gap-10 shadow-2xl relative overflow-hidden group">
        <div className="absolute inset-0 bg-gradient-to-br from-teal-500/10 to-transparent opacity-50" />
        <div className="relative z-10 text-center lg:text-left">
          <p className="text-[10px] font-black text-teal-400 uppercase tracking-[0.3em] mb-6">Aggregate Adherence Profile</p>
          <h2 className="text-5xl lg:text-7xl font-black text-white mb-4 tracking-tighter uppercase">Low Risk</h2>
          <p className="text-gray-500 text-sm font-medium">Model confidence: 98.4% based on 6-month historical data</p>
        </div>
        
        <div className="flex items-center gap-10 relative z-10">
          <div className="text-center lg:text-right border-r border-gray-800 pr-10">
            <p className="text-7xl lg:text-8xl font-black text-white tracking-tighter">94<span className="text-3xl text-teal-500">%</span></p>
            <p className="text-gray-500 text-[10px] font-black uppercase tracking-widest mt-2">Precision Score</p>
          </div>
          <div className="w-32 h-32 rounded-full border-8 border-teal-500/20 flex items-center justify-center relative">
            <div className="absolute inset-0 rounded-full border-8 border-teal-500 border-t-transparent animate-spin-slow" />
            <span className="text-white text-xs font-black uppercase">Active</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Risk Factors Box */}
        <div className="lg:col-span-2 theme-surface border theme-border rounded-[3rem] p-10 shadow-lg hover:shadow-xl transition-all">
          <div className="flex items-center justify-between mb-10 px-2">
            <h2 className="font-black theme-text text-xl uppercase tracking-tight">Risk Vector Analysis</h2>
            <button className="text-[10px] font-black text-teal-600 dark:text-teal-400 hover:underline uppercase tracking-widest">Detail View</button>
          </div>
          <div className="space-y-10">
            {factors.map((f, i) => (
              <div key={i} className="group">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-[10px] font-black theme-text uppercase tracking-widest transition-colors group-hover:text-teal-600 dark:group-hover:text-teal-400">{f.label}</span>
                  <span className={`text-[9px] font-black px-3 py-1.5 rounded-xl uppercase tracking-widest border shadow-sm ${f.badgeClass}`}>{f.risk}</span>
                </div>
                <div className="theme-bg border theme-border rounded-full h-3 overflow-hidden shadow-inner">
                  <div className={`h-full rounded-full ${f.barColor} transition-all duration-[1500ms] ease-out shadow-[0_0_10px_rgba(20,184,166,0.3)]`} style={{ width: `${(f.value / f.max) * 100}%` }} />
                </div>
                <div className="flex justify-between mt-2">
                    <p className="text-[9px] font-black theme-text-sub uppercase tracking-widest opacity-60">Current Value: {f.value}</p>
                    <p className="text-[9px] font-black theme-text-sub uppercase tracking-widest opacity-60">Target: {f.max}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* AI Recommendations Column */}
        <div className="space-y-8">
          <div className="theme-surface border theme-border rounded-[3rem] p-8 shadow-lg hover:shadow-xl transition-all">
            <div className="flex items-center gap-3 mb-8 px-2">
                <div className="w-2 h-6 bg-teal-500 rounded-full" />
                <h2 className="font-black theme-text text-lg uppercase tracking-tight">AI Insights</h2>
            </div>
            <div className="space-y-4">
              {tips.map((tip, i) => (
                <div key={i} className="group p-6 theme-bg border theme-border rounded-[2rem] hover:border-teal-500/50 transition-all cursor-default">
                  <p className="text-[9px] font-black text-teal-600 dark:text-teal-400 mb-2 uppercase tracking-[0.2em]">{tip.title}</p>
                  <p className="text-xs theme-text leading-relaxed font-medium group-hover:theme-text transition-colors">{tip.desc}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-gray-950 rounded-[2.5rem] p-8 border border-gray-800 shadow-2xl group hover:border-teal-500/30 transition-all relative overflow-hidden">
            <div className="absolute bottom-0 right-0 w-32 h-32 bg-teal-500/5 rounded-full blur-3xl -mr-16 -mb-16" />
            <p className="text-gray-500 text-[10px] font-black uppercase tracking-[0.2em] mb-4">Lifecycle Update</p>
            <p className="text-white font-black text-2xl uppercase tracking-tight mb-2">Next Audit: 7 Days</p>
            <p className="text-gray-500 text-xs font-medium leading-relaxed">System performs a deep pattern audit every Monday at 00:00 GMT.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
