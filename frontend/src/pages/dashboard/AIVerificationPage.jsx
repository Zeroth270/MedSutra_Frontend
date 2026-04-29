import { useState, useRef } from 'react';
import PageHeader from '../../components/ui/PageHeader';
import Spinner from '../../components/ui/Spinner';

const STEPS = [
  { step: '01', title: 'Capture High-Res Photo', desc: 'Photograph your medication label or pill packet in clear lighting.' },
  { step: '02', title: 'Neural Analysis', desc: 'Our AI Vision model extracts medical identifiers and dosages.' },
  { step: '03', title: 'Safety Verification', desc: 'AI cross-references with your prescriptions to ensure safety.' },
];

const INITIAL_HISTORY = [
  { id: 1, med: 'Metformin 500mg', date: 'Today, 8:02 AM', result: 'Verified', ok: true },
  { id: 2, med: 'Lisinopril 10mg', date: 'Yesterday, 2:15 PM', result: 'Verified', ok: true },
  { id: 3, med: 'Unknown tablet', date: 'Apr 26, 6:00 PM', result: 'Mismatch Identified', ok: false },
];

export default function AIVerificationPage() {
  const [dragging, setDragging] = useState(false);
  const [scanning, setScanning] = useState(false);
  const [history, setHistory] = useState(INITIAL_HISTORY);
  const [cameraActive, setCameraActive] = useState(false);
  const fileInputRef = useRef(null);

  const handleScan = (source = 'Photo') => {
    setScanning(true);
    setCameraActive(false);
    setTimeout(() => {
        setScanning(false);
        const medName = 'Aspirin 75mg';
        const newLog = {
            id: Date.now(),
            med: `${medName} (${source})`,
            date: 'Just now',
            result: 'Verified',
            ok: true
        };
        setHistory([newLog, ...history]);
        
        // "Give its reminders" part
        const addReminder = window.confirm(`Neural scan complete: ${medName} verified.\n\nWould you like to set an automatic reminder for this medication?`);
        if (addReminder) {
            alert('Reminder schedule synchronized. You will be notified for the next dose.');
        }
    }, 2500);
  };

  const handleCameraToggle = () => {
    setCameraActive(true);
    // Simulate camera warm up
    setTimeout(() => {
        // No-op, just show camera UI
    }, 500);
  };

  const handleFileUpload = (e) => {
    if (e.target.files && e.target.files[0]) {
        handleScan('Upload');
    }
  };

  const clearLogs = () => {
    if (window.confirm('Wipe neural verification history?')) {
        setHistory([]);
    }
  };

  return (
    <div className="animate-fade-in space-y-10">
      <PageHeader title="Neural Verification" subtitle="AI Vision analysis for precise medication safety confirmation." />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Scanner Box */}
        <div
          onDragOver={e => { e.preventDefault(); setDragging(true); }}
          onDragLeave={() => setDragging(false)}
          onDrop={e => { e.preventDefault(); setDragging(false); handleScan('Drop'); }}
          className={`group relative flex flex-col items-center justify-center gap-8 rounded-[3rem] p-16 border-2 border-dashed transition-all duration-500 overflow-hidden shadow-sm hover:shadow-2xl ${dragging || scanning || cameraActive ? 'border-teal-500 bg-teal-50/50 dark:bg-teal-900/10' : 'theme-border theme-surface hover:border-teal-400 hover:bg-teal-50/30 dark:hover:bg-teal-900/5'}`}
        >
          {/* Decorative Background Element */}
          <div className="absolute inset-0 bg-gradient-to-br from-teal-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          
          {cameraActive ? (
            <div className="relative w-full aspect-video theme-bg rounded-3xl border-2 border-teal-500 overflow-hidden flex items-center justify-center group/cam">
                <div className="absolute inset-0 bg-black opacity-20" />
                <div className="relative z-10 text-center">
                    <div className="w-20 h-20 border-2 border-white/50 rounded-full animate-ping mb-4 mx-auto" />
                    <p className="text-white text-[10px] font-black uppercase tracking-[0.2em]">Neural Lens Active</p>
                    <button onClick={() => handleScan('Camera')} className="mt-8 bg-white text-teal-600 px-10 py-3.5 rounded-xl font-black text-xs uppercase tracking-widest shadow-2xl hover:scale-105 active:scale-95 transition-all">Capture & Analysis</button>
                </div>
                <button onClick={() => setCameraActive(false)} className="absolute top-4 right-4 text-white text-xl p-2 hover:bg-white/10 rounded-lg">✕</button>
            </div>
          ) : (
            <>
                <div className={`w-28 h-28 rounded-[2.5rem] flex items-center justify-center text-5xl transition-all duration-500 shadow-xl group-hover:scale-110 group-hover:rotate-6 ${dragging || scanning ? 'bg-teal-100 dark:bg-teal-900 text-teal-600 scale-110' : 'theme-bg border theme-border'}`}>
                    {scanning ? '🧬' : '🔬'}
                </div>
                
                <div className="text-center relative z-10">
                    <h3 className="font-black theme-text text-xl uppercase tracking-tight mb-2">{scanning ? 'Neural Processing...' : 'Initialize Scanner'}</h3>
                    <p className="theme-text-sub text-sm font-medium">{scanning ? 'Analyzing chemical markers via AI Vision' : 'Select a capture method to begin analysis'}</p>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-4 relative z-10 w-full max-w-sm">
                    <input 
                        type="file" 
                        ref={fileInputRef} 
                        className="hidden" 
                        onChange={handleFileUpload}
                        accept="image/*"
                    />
                    <button 
                        onClick={() => fileInputRef.current?.click()}
                        disabled={scanning}
                        className="flex-1 flex items-center justify-center gap-3 bg-gray-900 dark:bg-teal-600 text-white px-8 py-4 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-teal-500/20 active:scale-95 transition-all"
                    >
                        {scanning ? <Spinner /> : '📁 Upload Photo'}
                    </button>
                    <button 
                        onClick={handleCameraToggle}
                        disabled={scanning}
                        className="flex-1 flex items-center justify-center gap-3 theme-bg border theme-border theme-text-sub px-8 py-4 rounded-xl text-[10px] font-black uppercase tracking-widest hover:border-teal-500 hover:text-teal-600 transition-all active:scale-95 shadow-sm"
                    >
                        📷 Take Photo
                    </button>
                </div>
                
                <p className="text-[10px] font-black theme-text-sub uppercase tracking-widest opacity-60">OR DROP FILE DIRECTLY INTO ARCHIVE</p>
            </>
          )}
        </div>

        {/* Instructions Box */}
        <div className="theme-surface border theme-border rounded-[3rem] p-10 shadow-lg hover:shadow-xl transition-all">
          <div className="flex items-center justify-between mb-10 px-2">
            <h2 className="font-black theme-text text-lg uppercase tracking-tight">Workflow Logic</h2>
            <div className="px-3 py-1 bg-teal-100 dark:bg-teal-900/30 text-teal-600 dark:text-teal-400 rounded-lg text-[9px] font-black uppercase tracking-widest border border-teal-200 dark:border-teal-800/50">Neural Net v2.4</div>
          </div>
          
          <div className="space-y-8">
            {STEPS.map((s) => (
              <div key={s.step} className="flex gap-6 group">
                <div className="w-12 h-12 theme-bg border theme-border rounded-2xl flex items-center justify-center text-sm font-black theme-text flex-shrink-0 shadow-md group-hover:bg-teal-600 group-hover:text-white group-hover:border-teal-600 transition-all duration-300 group-hover:scale-110">{s.step}</div>
                <div>
                  <p className="text-sm font-black theme-text uppercase tracking-tight mb-1.5 transition-colors group-hover:text-teal-600 dark:group-hover:text-teal-400">{s.title}</p>
                  <p className="text-xs theme-text-sub leading-relaxed font-medium">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-12 bg-gray-950 rounded-[2rem] p-8 border border-gray-800 shadow-2xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-teal-500/5 rounded-full blur-3xl -mr-16 -mt-16 group-hover:bg-teal-500/20 transition-all" />
            <p className="text-teal-400 text-[9px] font-black uppercase tracking-[0.2em] mb-3">System Confidence</p>
            <div className="flex items-baseline gap-2 mb-4">
                <span className="text-3xl font-black text-white">99.8%</span>
                <span className="text-[10px] font-black text-gray-500 uppercase">Accuracy Rate</span>
            </div>
            <div className="w-full bg-gray-800 h-1.5 rounded-full overflow-hidden">
                <div className="bg-teal-500 h-full rounded-full w-[99.8%] shadow-[0_0_10px_rgba(20,184,166,0.5)]" />
            </div>
          </div>
        </div>
      </div>

      {/* History Box */}
      <div className="theme-surface border theme-border rounded-[3rem] shadow-lg hover:shadow-2xl transition-all overflow-hidden">
        <div className="px-10 py-8 border-b theme-border flex items-center justify-between theme-bg/30">
          <h2 className="font-black theme-text text-lg uppercase tracking-tight">Neural Verification Logs</h2>
          <button onClick={clearLogs} className="text-[10px] font-black text-teal-600 dark:text-teal-400 hover:underline uppercase tracking-widest">Clear Logs</button>
        </div>
        <div className="divide-y theme-border">
          {history.map((h) => (
            <div key={h.id} className="flex flex-col sm:flex-row sm:items-center justify-between px-10 py-7 hover:theme-bg transition-all group gap-4">
              <div className="flex items-center gap-6">
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl flex-shrink-0 shadow-lg group-hover:scale-110 transition-transform ${h.ok ? 'bg-green-50 dark:bg-green-900/20 border border-green-100 dark:border-green-800/50' : 'bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-900/50'}`}>{h.ok ? '✅' : '⚠️'}</div>
                <div>
                  <p className="text-lg font-black theme-text group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors uppercase tracking-tight">{h.med}</p>
                  <p className="text-[10px] theme-text-sub font-black mt-1 uppercase tracking-widest opacity-60">{h.date}</p>
                </div>
              </div>
              <span className={`text-[10px] font-black px-5 py-2.5 rounded-xl uppercase tracking-widest border shadow-sm self-start sm:self-auto ${h.ok ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 border-green-100 dark:border-green-800/50' : 'bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 border-red-100 dark:border-red-900/50'}`}>{h.result}</span>
            </div>
          ))}
          {history.length === 0 && (
            <div className="p-20 text-center theme-text-sub font-black text-[10px] uppercase tracking-widest opacity-60">No verification data on record</div>
          )}
        </div>
      </div>
    </div>
  );
}
