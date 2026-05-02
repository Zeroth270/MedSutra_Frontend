import { useOutletContext } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNotification } from '../../../context/NotificationContext';
import PatientDashboard from './PatientDashboard';
import ConfirmModal from '../../../components/ui/ConfirmModal';
import EntityModal from '../../../components/ui/EntityModal';
import api from '../../../services/api';
import { Users, CheckCircle, AlertTriangle, Trash2 } from 'lucide-react';

export default function DoctorDashboard() {
    const { t } = useTranslation();
    const { user } = useOutletContext();
    const { addNotification } = useNotification();
    const [selectedPatient, setSelectedPatient] = useState(null);
    const [patients, setPatients] = useState([]);
    const [alerts, setAlerts] = useState([]);
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [deletingId, setDeletingId] = useState(null);
    const [modalOpen, setModalOpen] = useState(false);

    const fetchPatients = async () => {
        if (!user?.id) return;
        try {
            const data = await api.get(`/dashboard/doctor/${user.id}`);
            const dashboards = data?.patientDashboards || [];
            const allAlerts = [];
            const mapped = dashboards.map(p => {
                const initials = p.patientName?.split(' ').map(n => n[0]).join('').toUpperCase() || 'P';
                
                // Map backend riskLevel to frontend status strings
                let statusClass = 'dash_stable';
                if (p.riskLevel === 'HIGH' || p.riskLevel === 'CRITICAL') {
                    statusClass = 'dash_at_risk';
                }

                if (p.alerts && p.alerts.length > 0) {
                    p.alerts.forEach(a => allAlerts.push({ ...a, patientName: p.patientName }));
                }

                return {
                    id: p.patientId,
                    name: p.patientName,
                    status: statusClass,
                    adherence: `${Math.round(p.adherencePercentage || 0)}%`,
                    lastSeen: 'Recently',
                    avatar: initials
                };
            });
            setPatients(mapped);
            setAlerts(allAlerts.sort((a,b) => new Date(b.timestamp) - new Date(a.timestamp)).slice(0, 10));
        } catch (err) {
            console.error('Failed to fetch patients dashboard:', err);
            addNotification('Failed to load patient overview', 'error');
        }
    };

    useEffect(() => {
        fetchPatients();
    }, [user?.id]);

    const fields = [
        { name: 'name', labelKey: 'auth_name_label', placeholder: 'e.g. John Doe', required: true },
        { 
            name: 'status', 
            labelKey: 'settings_alert_logic', 
            type: 'select', 
            options: [
                { value: 'dash_stable', labelKey: 'dash_stable' },
                { value: 'dash_at_risk', labelKey: 'dash_at_risk' }
            ] 
        }
    ];

    const handleSave = (data) => {
        const initials = data.name.split(' ').map(n => n[0]).join('').toUpperCase();
        const newPatient = {
            id: Date.now(),
            ...data,
            adherence: '100%',
            lastSeen: 'Just now',
            avatar: initials || 'P'
        };
        // This is still local since we don't have an endpoint to just "add" a patient in the dashboard.
        // A real system would POST to a patient registration API.
        setPatients([...patients, newPatient]);
        addNotification(`${t('notif_added')} (${data.name})`, 'success');
    };

    const quickStats = [
        { label: 'dash_total_patients', value: patients.length, icon: <Users size={28} className="text-blue-500" /> },
        { label: 'dash_stable', value: patients.filter(p => p.status === 'dash_stable').length, icon: <CheckCircle size={28} className="text-green-500" /> },
        { label: 'dash_at_risk', value: patients.filter(p => p.status === 'dash_at_risk').length, icon: <AlertTriangle size={28} className="text-amber-500" /> },
    ];

    const handleRemovePatient = (e, id) => {
        e.stopPropagation();
        setDeletingId(id);
        setConfirmOpen(true);
    };

    const executeRemove = () => {
        const patient = patients.find(p => p.id === deletingId);
        setPatients(patients.filter(p => p.id !== deletingId));
        addNotification(`${t('notif_removed')} (${patient.nameKey ? t(patient.nameKey) : patient.name})`, 'warning');
        setConfirmOpen(false);
        setDeletingId(null);
    };

    if (selectedPatient) {
        return (
            <div className="animate-fade-in">
                <button
                    onClick={() => setSelectedPatient(null)}
                    className="mb-6 flex items-center gap-2 text-sm font-black theme-text-sub hover:theme-text transition-all group"
                >
                    <span className="group-hover:-translate-x-1 transition-transform">←</span>
                    <span className="uppercase tracking-widest text-[10px]">{t('dash_back_to_overview')}</span>
                </button>
                <PatientDashboard selectedPatient={selectedPatient} isDoctorView={true} />
            </div>
        );
    }

    return (
        <div className="animate-fade-in space-y-10">
            <ConfirmModal
                isOpen={confirmOpen}
                onClose={() => setConfirmOpen(false)}
                onConfirm={executeRemove}
                title={t('med_remove_title')}
                message="Are you sure you want to remove this patient from your clinical oversight?"
            />

            <EntityModal
                isOpen={modalOpen}
                onClose={() => setModalOpen(false)}
                onSave={handleSave}
                title={t('dash_register_patient')}
                fields={fields}
            />

            <div className="mb-8 px-1">
                <h1 className="text-3xl font-black theme-text tracking-tight uppercase">{t('dash_doctor_portal')}, Dr. {user.name}</h1>
                <p className="theme-text-sub text-sm mt-1.5 font-medium">{t('dash_doctor_desc')}</p>
            </div>

            {/* Performance Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {quickStats.map(s => (
                    <div key={s.label} className="border theme-border hover:border-teal-500 rounded-3xl p-8 transition-all group card-hover shadow-sm hover:shadow-xl">
                        <div className="flex items-center justify-between mb-6">
                            <p className="text-[10px] font-black theme-text-sub uppercase tracking-[0.2em]">{t(s.label)}</p>
                            <span className="group-hover:scale-125 transition-transform drop-shadow-sm">{s.icon}</span>
                        </div>
                        <p className="text-4xl font-black theme-text mb-2 group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors">{s.value}</p>
                        <p className="text-[10px] theme-text-sub font-black uppercase tracking-widest">{s.sub || 'Real-time Sync'}</p>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                {/* Patient List Column */}
                <div className="lg:col-span-2 space-y-8">
                    <div className="flex items-center justify-between px-2">
                        <h2 className="font-black theme-text text-xl uppercase tracking-tight">{t('dash_active_accounts')}</h2>
                        <button onClick={() => setModalOpen(true)} className="text-[10px] font-black text-teal-600 dark:text-teal-400 hover:underline uppercase tracking-widest">{t('dash_register_new')}</button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {patients.map((p) => (
                            <div
                                key={p.id}
                                onClick={() => setSelectedPatient(p)}
                                className="border theme-border hover:border-teal-500 rounded-[2.5rem] p-8 transition-all cursor-pointer group card-hover relative overflow-hidden shadow-sm hover:shadow-2xl"
                            >
                                <div className="flex items-start justify-between mb-8 relative z-10">
                                    <div className="flex items-center gap-6">
                                        <div className="w-16 h-16 rounded-2xl bg-gray-900 dark:bg-teal-600 flex items-center justify-center font-black text-white text-xl transition-transform shadow-xl border-2 border-white dark:border-gray-800">
                                            {p.avatar}
                                        </div>
                                        <div className="min-w-0">
                                            <h3 className="font-black theme-text text-lg truncate group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors uppercase tracking-tight">
                                                {p.nameKey ? t(p.nameKey) : p.name}
                                            </h3>
                                            <p className="text-[10px] theme-text-sub font-black uppercase tracking-widest mt-1.5 opacity-60">{t('dash_activity')}: {p.lastSeen}</p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={(e) => handleRemovePatient(e, p.id)}
                                        className="w-10 h-10 rounded-xl border theme-border flex items-center justify-center theme-text-sub hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 hover:border-red-200 dark:hover:border-red-800 transition-all shadow-sm"
                                        title={t('med_remove_title')}
                                    >
                                        <Trash2 size={20} />
                                    </button>
                                </div>

                                <div className="flex items-center justify-between pt-6 border-t theme-border relative z-10">
                                    <div>
                                        <p className="text-[9px] font-black theme-text-sub uppercase tracking-[0.2em] mb-1.5">{t('dash_compliance_rate')}</p>
                                        <p className="text-xl font-black theme-text">{p.adherence}</p>
                                    </div>
                                    <span className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all ${p.status === 'dash_at_risk'
                                        ? 'border-red-200 dark:border-red-900/30 text-red-600 dark:text-red-400'
                                        : 'border-green-200 dark:border-green-900/30 text-green-700 dark:text-green-400'
                                        }`}>
                                        {t(p.status)}
                                    </span>
                                </div>
                                <div className="absolute -right-8 -bottom-8 w-24 h-24 bg-teal-500/5 rounded-full blur-3xl" />
                            </div>
                        ))}
                    </div>
                </div>

                {/* Clinical Alerts */}
                <div className="space-y-8">
                    <div className="flex items-center justify-between px-2">
                        <h2 className="font-black theme-text text-xl uppercase tracking-tight">Clinical Alerts</h2>
                    </div>

                    <div className="border theme-border hover:border-teal-500 rounded-[3rem] overflow-hidden transition-all shadow-sm hover:shadow-2xl">
                        <div className="p-6 space-y-4">
                            {alerts.map((alert, i) => (
                                <div key={i} className="p-5 border theme-border rounded-[1.5rem] hover:theme-bg transition-all group">
                                    <div className="flex items-center justify-between mb-3">
                                        <div className="flex items-center gap-3">
                                            <span className={`text-[8px] font-black uppercase px-2 py-0.5 rounded-md tracking-widest border theme-border ${
                                                alert.severity === 'CRITICAL' ? 'bg-red-500/10 text-red-500 border-red-500/20' : 
                                                alert.severity === 'WARNING' ? 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20' : 
                                                'bg-teal-500/10 text-teal-600 border-teal-500/20'
                                            }`}>
                                                {alert.severity}
                                            </span>
                                        </div>
                                        <span className="text-[9px] theme-text-sub font-bold opacity-50">
                                            {alert.timestamp ? new Date(alert.timestamp).toLocaleDateString() : 'Recent'}
                                        </span>
                                    </div>
                                    <p className="text-xs font-black theme-text group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors">{alert.patientName}</p>
                                    <p className="text-[10px] theme-text leading-relaxed font-medium mt-1 opacity-80">{alert.message}</p>
                                </div>
                            ))}
                            {alerts.length === 0 && (
                                <p className="text-sm theme-text-sub text-center p-8 opacity-70">No active alerts across network.</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
