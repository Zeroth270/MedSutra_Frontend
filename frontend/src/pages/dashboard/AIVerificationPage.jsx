import { useState, useRef, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useNotification } from '../../context/NotificationContext';
import PageHeader from '../../components/ui/PageHeader';
import Spinner from '../../components/ui/Spinner';
import ConfirmModal from '../../components/ui/ConfirmModal';
import api from '../../services/api';
import { Dna, Microscope, Upload, Camera, CheckCircle, AlertTriangle } from 'lucide-react';

const STEPS = [
  { step: '01', title: 'step_1_title', desc: 'step_1_desc' },
  { step: '02', title: 'step_2_title', desc: 'step_2_desc' },
  { step: '03', title: 'step_3_title', desc: 'step_3_desc' },
];

export default function AIVerificationPage() {
  const { t } = useTranslation();
  const { addNotification } = useNotification();
  const { user } = useOutletContext();
  const [dragging, setDragging] = useState(false);
  const [scanning, setScanning] = useState(false);
  const [history, setHistory] = useState([]);
  const [cameraActive, setCameraActive] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [confirmType, setConfirmType] = useState(null); // 'clear' or 'reminder'
  const [lastScannedMed, setLastScannedMed] = useState('');
  const [medications, setMedications] = useState([]);
  const [selectedMedicationId, setSelectedMedicationId] = useState('');
  const [lastConfidence, setLastConfidence] = useState('0.0');
  const fileInputRef = useRef(null);

  useEffect(() => {
    const fetchMeds = async () => {
      if (!user?.id) return;
      try {
        const data = await api.get(`/medications/${user.id}`);
        setMedications(data);
        if (data.length > 0) {
          setSelectedMedicationId(data[0].medId || data[0].id);
        }
      } catch (err) {
        console.error('Failed to fetch medications:', err);
      }
    };
    fetchMeds();
  }, [user?.id]);

  const handleScan = async (source = 'Photo') => {
    if (!selectedMedicationId) {
      addNotification('Please select a medication first', 'error');
      return;
    }
    
    // For camera/drop we need a file. For camera we don't have real capture yet, 
    // so we'll just mock a file if it's not provided
    const dummyFile = new File([''], 'camera-capture.jpg', { type: 'image/jpeg' });
    await processScan(dummyFile, source);
  };

  const processScan = async (file, source) => {
    if (!selectedMedicationId) {
      addNotification('Please select a medication first', 'error');
      return;
    }

    setScanning(true);
    setCameraActive(false);

    try {
      const formData = new FormData();
      formData.append('patientId', user.id);
      formData.append('medicationId', selectedMedicationId);
      formData.append('image', file);

      // We'll use actual response, or handle errors
      const response = await api.post('/verification/verify', formData);

      const log = response.data || response;
      const ok = log.result === 'MATCH';
      
      const newLog = {
          id: log.id || Date.now(),
          med: `${log.detectedName || 'Unknown'} (${source})`,
          date: t('today'),
          result: ok ? 'ai_scan_match' : 'ai_scan_mismatch',
          ok: ok
      };
      
      setHistory(prev => [newLog, ...prev]);
      setLastScannedMed(newLog.med);
      
      if (log.confidenceScore !== undefined) {
         setLastConfidence((log.confidenceScore).toFixed(1));
      }

      addNotification(`${t(newLog.result)}: ${newLog.med}`, ok ? 'success' : 'error');
      
      if (ok) {
        setConfirmType('reminder');
        setConfirmOpen(true);
      }
    } catch (error) {
      console.error('Scan error:', error);
      addNotification('Verification failed', 'error');
    } finally {
      setScanning(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleCameraToggle = () => {
    setCameraActive(true);
  };

  const handleFileUpload = (e) => {
    if (e.target.files && e.target.files[0]) {
        processScan(e.target.files[0], 'Upload');
    }
  };

  const onConfirm = () => {
    if (confirmType === 'clear') {
        setHistory([]);
        addNotification(t('notif_removed'), 'warning');
    } else if (confirmType === 'reminder') {
        addNotification(t('notif_updated'), 'info');
    }
    setConfirmOpen(false);
  };

  const clearLogs = () => {
    setConfirmType('clear');
    setConfirmOpen(true);
  };

  return (
    <div className="animate-fade-in space-y-10">
      <PageHeader title={t('nav_ai_verification')} subtitle={t('ai_subtitle')} />

      <ConfirmModal
        isOpen={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        onConfirm={onConfirm}
        title={confirmType === 'clear' ? t('med_remove_title') : t('rem_upcoming_schedule')}
        message={confirmType === 'clear' ? t('med_confirm_delete') : `${t('rem_dose_taken')}: ${lastScannedMed} ${t('ai_scan_match')}. Would you like to set an automatic reminder?`}
        type={confirmType === 'clear' ? 'danger' : 'info'}
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div
          onDragOver={e => { e.preventDefault(); setDragging(true); }}
          onDragLeave={() => setDragging(false)}
          onDrop={e => { 
              e.preventDefault(); 
              setDragging(false); 
              if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                  processScan(e.dataTransfer.files[0], 'Drop');
              }
          }}
          className={`group relative flex flex-col items-center justify-center gap-8 rounded-[3rem] p-16 border-2 border-dashed transition-all duration-500 overflow-hidden shadow-sm hover:shadow-2xl ${dragging || scanning || cameraActive ? 'border-teal-500 bg-teal-50/50 dark:bg-teal-900/10' : 'theme-border theme-surface hover:border-teal-400 hover:bg-teal-50/30 dark:hover:bg-teal-900/5'}`}
        >
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
                <div className={`w-28 h-28 rounded-[2.5rem] flex items-center justify-center transition-all duration-500 shadow-xl group-hover:scale-110 ${dragging || scanning ? 'bg-teal-100 dark:bg-teal-900 text-teal-600 scale-110' : 'theme-bg border theme-border text-teal-500'}`}>
                    {scanning ? <Dna size={48} className="animate-pulse" /> : <Microscope size={48} />}
                </div>
                
                <div className="text-center relative z-10 mb-2">
                    <h3 className="font-black theme-text text-xl uppercase tracking-tight mb-2">{scanning ? 'Neural Processing...' : t('ai_neural_scanner')}</h3>
                    <p className="theme-text-sub text-sm font-medium">{scanning ? 'Analyzing chemical markers via AI Vision' : t('ai_scanner_desc')}</p>
                </div>

                <div className="w-full max-w-sm relative z-10 mb-2">
                  <select 
                    value={selectedMedicationId} 
                    onChange={(e) => setSelectedMedicationId(e.target.value)}
                    className="w-full bg-gray-900/5 dark:bg-gray-800/50 border theme-border rounded-xl px-4 py-3 text-sm font-black theme-text uppercase tracking-widest focus:ring-2 focus:ring-teal-500 outline-none transition-all"
                    disabled={scanning}
                  >
                    <option value="">Select Medication To Verify</option>
                    {medications.map(med => (
                      <option key={med.medId || med.id} value={med.medId || med.id}>{med.name}</option>
                    ))}
                  </select>
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
                        {scanning ? <Spinner /> : <><Upload size={16} /> {t('btn_signin')}</>}
                    </button>
                    <button 
                        onClick={handleCameraToggle}
                        disabled={scanning}
                        className="flex-1 flex items-center justify-center gap-3 theme-bg border theme-border theme-text-sub px-8 py-4 rounded-xl text-[10px] font-black uppercase tracking-widest hover:border-teal-500 hover:text-teal-600 transition-all active:scale-95 shadow-sm"
                    >
                        <Camera size={16} /> {t('ai_btn_start')}
                    </button>
                </div>
            </>
          )}
        </div>

        <div className="theme-surface border theme-border rounded-[3rem] p-10 shadow-lg hover:shadow-xl transition-all">
          <div className="flex items-center justify-between mb-10 px-2">
            <h2 className="font-black theme-text text-lg uppercase tracking-tight">Workflow Logic</h2>
            <div className="px-3 py-1 text-teal-600 dark:text-teal-400 rounded-lg text-[9px] font-black uppercase tracking-widest border border-teal-200 dark:border-teal-800/50">Neural Net v2.4</div>
          </div>
          
          <div className="space-y-8">
            {STEPS.map((s) => (
              <div key={s.step} className="flex gap-6 group">
                <div className="w-12 h-12 theme-bg border theme-border rounded-2xl flex items-center justify-center text-sm font-black theme-text flex-shrink-0 shadow-md group-hover:bg-teal-600 group-hover:text-white group-hover:border-teal-600 transition-all duration-300 group-hover:scale-110">{s.step}</div>
                <div>
                  <p className="text-sm font-black theme-text uppercase tracking-tight mb-1.5 transition-colors group-hover:text-teal-600 dark:group-hover:text-teal-400">{t(s.title)}</p>
                  <p className="text-xs theme-text-sub leading-relaxed font-medium">{t(s.desc)}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-12 bg-gray-950 rounded-[2rem] p-8 border border-gray-800 shadow-2xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-teal-500/5 rounded-full blur-3xl -mr-16 -mt-16 group-hover:bg-teal-500/20 transition-all" />
            <p className="text-teal-400 text-[9px] font-black uppercase tracking-[0.2em] mb-3">{t('ai_stat_confidence')}</p>
            <div className="flex items-baseline gap-2 mb-4">
                <span className="text-3xl font-black text-white">{lastConfidence}%</span>
                <span className="text-[10px] font-black text-gray-500 uppercase">Accuracy Rate</span>
            </div>
            <div className="w-full bg-gray-800 h-1.5 rounded-full overflow-hidden">
                <div className="bg-teal-500 h-full rounded-full shadow-[0_0_10px_rgba(20,184,166,0.5)] transition-all duration-1000" style={{ width: `${lastConfidence}%` }} />
            </div>
          </div>
        </div>
      </div>

      <div className="theme-surface border theme-border rounded-[3rem] shadow-lg hover:shadow-2xl transition-all overflow-hidden">
        <div className="px-10 py-8 border-b theme-border flex items-center justify-between theme-bg/30">
          <h2 className="font-black theme-text text-lg uppercase tracking-tight">{t('ai_recent_scans')}</h2>
          <button onClick={clearLogs} className="text-[10px] font-black text-teal-600 dark:text-teal-400 hover:underline uppercase tracking-widest">{t('med_confirm_delete')}</button>
        </div>
        <div className="divide-y theme-border">
          {history.map((h) => (
            <div key={h.id} className="flex flex-col sm:flex-row sm:items-center justify-between px-10 py-7 hover:theme-bg transition-all group gap-4">
              <div className="flex items-center gap-6">
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg group-hover:scale-110 transition-transform ${h.ok ? 'border border-green-200 dark:border-green-900/30' : 'border border-red-200 dark:border-red-900/30'}`}>
                    {h.ok ? <CheckCircle size={24} className="text-green-500" /> : <AlertTriangle size={24} className="text-red-500" />}
                </div>
                <div>
                  <p className="text-lg font-black theme-text group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors uppercase tracking-tight">{h.med}</p>
                  <p className="text-[10px] theme-text-sub font-black mt-1 uppercase tracking-widest opacity-60">{h.date}</p>
                </div>
              </div>
              <span className={`text-[10px] font-black px-5 py-2.5 rounded-xl uppercase tracking-widest border shadow-sm self-start sm:self-auto transition-all ${h.ok ? 'border-green-200 dark:border-green-900/30 text-green-700 dark:text-green-400' : 'border-red-200 dark:border-red-900/30 text-red-600 dark:text-red-400'}`}>{t(h.result)}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
