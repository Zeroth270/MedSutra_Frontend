import { useOutletContext } from 'react-router-dom';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNotification } from '../../../context/NotificationContext';
import ConfirmModal from '../../../components/ui/ConfirmModal';
import EntityModal from '../../../components/ui/EntityModal';

export default function PatientDashboard({ selectedPatient, isDoctorView }) {
    const { t } = useTranslation();
    const { user } = useOutletContext();
    const { addNotification } = useNotification();
    const [meds, setMeds] = useState([
        { id: 1, name: 'Metformin 500mg', type: 'med_type_tablet', frequency: 'med_freq_twice', time: '8 AM & 9 PM', status: 'dash_stable' },
        { id: 2, name: 'Lisinopril 10mg', type: 'med_type_tablet', frequency: 'med_freq_once', time: '2 PM', status: 'dash_stable' },
        { id: 3, name: 'Atorvastatin 20mg', type: 'med_type_tablet', frequency: 'med_freq_once', time: '6 PM', status: 'dash_stable' },
    ]);
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [deletingId, setDeletingId] = useState(null);
    const [modalOpen, setModalOpen] = useState(false);

    const fields = [
        { name: 'name', labelKey: 'med_prompt_name', placeholder: 'e.g. Aspirin', required: true },
        { name: 'time', labelKey: 'med_prompt_time', type: 'time', required: true },
        { 
            name: 'frequency', 
            labelKey: 'med_timing', 
            type: 'select', 
            options: [
                { value: 'med_freq_once', labelKey: 'med_freq_once' },
                { value: 'med_freq_twice', labelKey: 'med_freq_twice' }
            ] 
        }
    ];

    const handleSave = (data) => {
        const newMed = {
            id: Date.now(),
            ...data,
            type: 'med_type_tablet',
            status: 'dash_stable'
        };
        setMeds([...meds, newMed]);
        addNotification(`${t('notif_added')} (${data.name})`, 'success');
    };

    const stats = [
        { label: 'dash_stat_doses', value: '142', sub: 'dash_month' },
        { label: 'dash_stat_rate', value: '94%', sub: 'dash_last_30' },
        { label: 'dash_stat_missed', value: '9', sub: 'dash_month' },
        { label: 'dash_stat_next', value: '8 PM', sub: 'Metformin 500mg' },
    ];

    const log = [
        { time: '8:00 AM', med: 'Metformin 500mg', status: 'Taken', dot: 'bg-green-400' },
        { time: '2:00 PM', med: 'Lisinopril 10mg', status: 'Taken', dot: 'bg-green-400' },
        { time: '6:00 PM', med: 'Atorvastatin 20mg', status: 'Missed', dot: 'bg-red-400' },
        { time: '9:00 PM', med: 'Metformin 500mg', status: 'Pending', dot: 'bg-yellow-400' },
    ];

    const handleRemove = (id) => {
        setDeletingId(id);
        setConfirmOpen(true);
    };

    const executeRemove = () => {
        const med = meds.find(m => m.id === deletingId);
        setMeds(meds.filter(m => m.id !== deletingId));
        addNotification(`${t('notif_removed')} (${med.name})`, 'warning');
        setConfirmOpen(false);
        setDeletingId(null);
    };


    return (
        <div className="animate-fade-in">
            <ConfirmModal
                isOpen={confirmOpen}
                onClose={() => setConfirmOpen(false)}
                onConfirm={executeRemove}
                title={t('med_remove_title')}
                message={t('med_confirm_delete')}
            />

            <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6 px-1">
                <div>
                    <h1 className="text-3xl font-black theme-text tracking-tight uppercase">
                        {selectedPatient ? `${t('dash_health_overview')}: ${selectedPatient.nameKey ? t(selectedPatient.nameKey) : selectedPatient.name}` : `${t('dash_health_overview')}, ${user.name}`}
                    </h1>
                    <p className="theme-text-sub text-sm mt-1.5 font-medium">
                        {selectedPatient ? t('med_subtitle_specialist') : t('dash_track_goals')}
                    </p>
                </div>
                {isDoctorView && (
                    <button 
                        onClick={() => setModalOpen(true)}
                        className="btn-primary px-8 py-4 rounded-xl text-xs font-black uppercase tracking-widest shadow-xl shadow-teal-500/20 hover:scale-105 active:scale-95 transition-all"
                    >
                        {t('med_btn_add')}
                    </button>
                )}
            </div>

            <EntityModal
                isOpen={modalOpen}
                onClose={() => setModalOpen(false)}
                onSave={handleSave}
                title={t('med_btn_add')}
                fields={fields}
            />

            {/* Stats */}
            <div className="grid grid-cols-2 xl:grid-cols-4 gap-6 mb-12">
                {stats.map(s => (
                    <div key={s.label} className="border theme-border hover:border-teal-500 rounded-3xl p-8 transition-all group card-hover shadow-sm hover:shadow-xl">
                        <p className="text-[10px] font-black theme-text uppercase tracking-[0.2em] mb-6">{t(s.label)}</p>
                        <p className="text-4xl font-black theme-text mb-2 group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors">{s.value}</p>
                        <p className="text-[10px] theme-text-sub font-black uppercase tracking-widest">{t(s.sub)}</p>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                {/* Medication Management */}
                <div className="lg:col-span-2 space-y-10">
                    <section>
                        <div className="flex items-center justify-between mb-6 px-2">
                            <h2 className="font-black theme-text text-xs uppercase tracking-[0.2em]">{t('dash_active_plan')}</h2>
                            {isDoctorView ? (
                                <span className="text-[10px] font-black text-teal-600 bg-teal-50 dark:bg-teal-900/20 px-3 py-1.5 rounded-xl border border-teal-100 dark:border-teal-800/50 uppercase tracking-widest shadow-sm">{t('dash_clinical_mode')}</span>
                            ) : (
                                <span className="text-[10px] font-black theme-text-sub theme-bg px-3 py-1.5 rounded-xl border theme-border uppercase tracking-widest flex items-center gap-2">
                                    <span className="w-1.5 h-1.5 rounded-full bg-teal-500" />
                                    {t('dash_clinical_sync')}
                                </span>
                            )}
                        </div>
                        <div className="space-y-4">
                            {meds.map((med) => (
                                <div key={med.id} className="border theme-border hover:border-teal-500 rounded-[2rem] px-8 py-8 flex items-center justify-between transition-all group card-hover relative overflow-hidden shadow-sm hover:shadow-2xl">
                                    <div className="flex items-center gap-6 relative z-10">
                                        <div className="w-16 h-16 rounded-2xl theme-bg flex items-center justify-center text-3xl group-hover:scale-110 transition-transform shadow-lg">💊</div>
                                        <div>
                                            <p className="text-xl font-black theme-text group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors uppercase tracking-tight">{med.name}</p>
                                            <p className="text-[10px] text-teal-600 dark:text-teal-400 font-black mt-1.5 uppercase tracking-widest">{t(med.frequency)} · SCHED: {med.time}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-5 relative z-10">
                                        <span className={`text-[10px] font-black px-4 py-2 rounded-xl uppercase tracking-widest border transition-all ${
                                            med.status === 'dash_stable' 
                                            ? 'border-green-200 dark:border-green-900/30 text-green-700 dark:text-green-400'
                                            : 'border-red-200 dark:border-red-900/30 text-red-600 dark:text-red-400'
                                        }`}>
                                            {t(med.status)}
                                        </span>
                                        {isDoctorView && (
                                            <button 
                                                onClick={() => handleRemove(med.id)}
                                                className="w-11 h-11 rounded-2xl border theme-border flex items-center justify-center theme-text-sub hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 hover:border-red-200 dark:hover:border-red-800 transition-all shadow-sm"
                                                title={t('med_remove_title')}
                                            >
                                                🗑️
                                            </button>
                                        )}
                                    </div>
                                    {!isDoctorView && (
                                        <div className="absolute right-6 top-6 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <span className="text-[8px] font-black theme-text-sub uppercase tracking-widest border theme-border px-2 py-1 rounded">{t('dash_verified')}</span>
                                        </div>
                                    )}
                                    <div className="absolute -right-8 -bottom-8 w-24 h-24 bg-teal-500/5 rounded-full blur-3xl" />
                                </div>
                            ))}
                        </div>
                        {!isDoctorView && (
                            <div className="mt-6 px-4 py-3 theme-bg border theme-border border-dashed rounded-2xl flex items-center justify-center gap-3 opacity-60">
                                <span className="text-xs">🔒</span>
                                <p className="text-[10px] font-black theme-text-sub uppercase tracking-widest">{t('dash_protocol_managed')}</p>
                            </div>
                        )}
                    </section>

                    {/* Schedule Log */}
                    <section>
                        <div className="flex items-center justify-between mb-6 px-2">
                            <h2 className="font-black theme-text text-xs uppercase tracking-[0.2em]">{t('dash_adherence_log')}</h2>
                        </div>
                        <div className="space-y-4">
                            {log.map((item, i) => (
                                <div key={i} className="border theme-border hover:border-teal-500 rounded-3xl px-8 py-6 flex flex-col sm:flex-row sm:items-center justify-between transition-all group gap-4 relative overflow-hidden shadow-sm hover:shadow-xl">
                                    <div className="flex items-center gap-6 relative z-10">
                                        <div className={`w-3 h-3 rounded-full ${item.dot} shadow-[0_0_12px_rgba(0,0,0,0.15)] animate-pulse`} />
                                        <span className="text-[10px] theme-text-sub font-black w-24 uppercase tracking-[0.2em]">{item.time}</span>
                                        <span className="text-sm font-black theme-text uppercase tracking-tight group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors">{item.med}</span>
                                    </div>
                                    <span className={`text-[10px] font-black px-4 py-2 rounded-xl uppercase tracking-widest border transition-all self-start sm:self-auto relative z-10 ${
                                        item.status === 'Taken' 
                                            ? 'border-green-200 dark:border-green-900/30 text-green-700 dark:text-green-400' 
                                            : item.status === 'Missed'
                                                ? 'border-red-200 dark:border-red-900/30 text-red-600 dark:text-red-400'
                                                : 'border-yellow-200 dark:border-yellow-900/30 text-yellow-700 dark:text-yellow-500'
                                    }`}>
                                        {t(`dash_${item.status.toLowerCase()}`)}
                                    </span>
                                    <div className="absolute -left-10 -top-10 w-24 h-24 bg-teal-500/5 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
                                </div>
                            ))}
                        </div>
                    </section>
                </div>

                {/* Sidebar Info */}
                <div className="space-y-8">
                    <div className="bg-gray-950 border border-gray-800 rounded-[3rem] p-10 text-white shadow-2xl relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-48 h-48 bg-teal-500/10 rounded-full blur-[80px] -mr-24 -mt-24 group-hover:bg-teal-500/20 transition-all duration-700"></div>
                        <h3 className="text-[10px] font-black text-teal-400 uppercase tracking-[0.3em] mb-10 relative z-10">{t('dash_neural_analysis')}</h3>
                        <div className="space-y-6 relative z-10">
                            <div className="p-7 bg-white/5 rounded-[2rem] border border-white/10 hover:bg-white/10 transition-all cursor-default group/item">
                                <p className="text-[9px] font-black text-green-400 mb-3 uppercase tracking-[0.2em]">{t('dash_adherence_trend')}</p>
                                <p className="text-sm leading-relaxed text-gray-300 font-medium italic opacity-90">"{t('dash_trend_msg')}"</p>
                            </div>
                            <div className="p-7 bg-white/5 rounded-[2rem] border border-white/10 hover:bg-white/10 transition-all cursor-default group/item">
                                <p className="text-[9px] font-black text-yellow-400 mb-3 uppercase tracking-[0.2em]">{t('dash_optimization')}</p>
                                <p className="text-sm leading-relaxed text-gray-300 font-medium italic opacity-90">"{t('dash_opt_msg')}"</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
