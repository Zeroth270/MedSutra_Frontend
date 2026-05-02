import { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useNotification } from '../../../context/NotificationContext';
import DoctorCard from '../../../components/dashboard/DoctorCard';
import EntityModal from '../../../components/ui/EntityModal';
import ConfirmModal from '../../../components/ui/ConfirmModal';
import { MOCK_DOCTORS } from '../../../constants/doctors';
import api from '../../../services/api';

export default function CaregiverDashboard() {
  const { t } = useTranslation();
  const { user } = useOutletContext();
  const { addNotification } = useNotification();
  const [searchQuery, setSearchQuery] = useState('');
  const [monitored, setMonitored] = useState([]);
  const [activeNetwork, setActiveNetwork] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    const fetchCaregiverDashboard = async () => {
      if (!user?.id) return;
      try {
        const data = await api.get(`/dashboard/caregiver/${user.id}`);
        if (data && data.patientDashboards) {
          const mapped = data.patientDashboards.map(p => ({
            id: p.patientId,
            name: p.patientName,
            status: p.riskLevel === 'HIGH' || p.riskLevel === 'CRITICAL' ? 'dash_at_risk' : 'dash_stable',
            time: 'Recent',
            med: p.riskDescription || 'Monitoring',
            adherence: Math.round(p.adherencePercentage || 0) + '%',
            urgency: p.riskLevel === 'HIGH' || p.riskLevel === 'CRITICAL' ? 'high' : 'low'
          }));
          setMonitored(mapped);
        }
      } catch (err) {
        console.error('Failed to fetch caregiver dashboard:', err);
        addNotification('Failed to load monitored patients', 'error');
      }
    };

    fetchCaregiverDashboard();
  }, [user?.id]);

  const fields = [
    { name: 'name', labelKey: 'auth_name_label', placeholder: 'e.g. Sarah Miller', required: true },
    { name: 'med', labelKey: 'med_prompt_name', placeholder: 'e.g. Heart Rate Monitoring', required: true },
    { name: 'time', labelKey: 'med_prompt_time', type: 'time', required: true },
    { 
      name: 'urgency', 
      labelKey: 'settings_alert_logic', 
      type: 'select', 
      options: [
        { value: 'low', labelKey: 'dash_stable' },
        { value: 'high', labelKey: 'dash_at_risk' }
      ] 
    }
  ];

  const handleSave = (data) => {
    const newPatient = {
      ...data,
      id: Date.now(),
      status: 'dash_taken',
    };
    setMonitored([...monitored, newPatient]);
    addNotification(`${t('notif_added')} (${data.name})`, 'success');
  };

  const handleRemove = (id) => {
    setDeletingId(id);
    setConfirmOpen(true);
  };

  const executeRemove = () => {
    const patient = monitored.find(p => p.id === deletingId);
    setMonitored(monitored.filter(p => p.id !== deletingId));
    addNotification(`${t('notif_removed')} (${patient.nameKey ? t(patient.nameKey) : patient.name})`, 'warning');
    setConfirmOpen(false);
    setDeletingId(null);
  };

  const filteredDoctors = MOCK_DOCTORS.filter(doc => {
    const name = doc.nameKey ? t(doc.nameKey).toLowerCase() : (doc.name || '').toLowerCase();
    const specialty = doc.specialtyKey ? t(doc.specialtyKey).toLowerCase() : (doc.specialty || '').toLowerCase();
    const query = searchQuery.toLowerCase();
    
    return name.includes(query) || 
           specialty.includes(query) || 
           (doc.diseases && doc.diseases.some(d => d.toLowerCase().includes(query)));
  });

  const handleBook = (doctor) => {
    const doctorName = doctor.nameKey ? t(doctor.nameKey) : doctor.name;
    if (activeNetwork.some(d => (d.nameKey ? t(d.nameKey) : d.name) === doctorName)) {
      addNotification(`${doctorName} is already in your active network.`, 'info');
      return;
    }
    setActiveNetwork([doctor, ...activeNetwork]);
    addNotification(`${doctorName} has been added to your Active Care Network.`, 'success');
  };

  const handleRemoveSpecialist = (doctor) => {
    const doctorName = doctor.nameKey ? t(doctor.nameKey) : doctor.name;
    setActiveNetwork(activeNetwork.filter(d => (d.nameKey ? t(d.nameKey) : d.name) !== doctorName));
    addNotification(`${doctorName} removed from network.`, 'info');
  };

  return (
    <div className="animate-fade-in space-y-12">
      <ConfirmModal
        isOpen={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        onConfirm={executeRemove}
        title={t('med_remove_title')}
        message={t('med_confirm_delete')}
      />

      <EntityModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={handleSave}
        title={t('dash_register_patient')}
        fields={fields}
      />

      <div className="mb-10 px-1 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black theme-text tracking-tight uppercase">{t('dash_caregiver_portal')}, {user.name}</h1>
          <p className="theme-text-sub text-sm mt-1.5 font-medium">{t('dash_caregiver_desc')}</p>
        </div>
        <button
          onClick={() => setModalOpen(true)}
          className="bg-gray-900 dark:bg-teal-600 text-white px-8 py-4 rounded-xl text-[10px] font-black uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-xl shadow-teal-500/20"
        >
          {t('dash_register_patient')}
        </button>
      </div>

      {/* Monitored Patients Section */}
      <section className="space-y-8">
        <div className="flex items-center justify-between px-2">
          <h2 className="text-[10px] font-black theme-text-sub uppercase tracking-[0.2em]">{t('dash_monitored_nodes')}</h2>
          <span className="text-[10px] font-black text-teal-600 border border-teal-200 dark:border-teal-900/30 px-4 py-2 rounded-xl uppercase tracking-widest shadow-sm">{monitored.length} {t('dash_accounts')}</span>
        </div>
        <div className="grid grid-cols-1 gap-6">
          {monitored.map((p) => (
            <div key={p.id} className="theme-surface border theme-border rounded-[2.5rem] p-8 shadow-sm hover:shadow-2xl hover:border-teal-100 dark:hover:border-teal-900 transition-all duration-300 group card-hover relative overflow-hidden">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 relative z-10">
                <div className="flex items-center gap-6">
                  <div className={`w-16 h-16 rounded-2xl flex items-center justify-center font-black text-2xl transition-transform group-hover:scale-110 shadow-lg border-2 ${p.urgency === 'high' ? 'border-red-200 dark:border-red-900/30 text-red-600 dark:text-red-400' : 'border-green-200 dark:border-green-900/30 text-green-700 dark:text-green-400'}`}>
                    {(p.nameKey ? t(p.nameKey) : p.name).charAt(0)}
                  </div>
                  <div>
                    <h3 className="text-xl font-black theme-text group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors uppercase tracking-tight">
                      {p.nameKey ? t(p.nameKey) : p.name}
                    </h3>
                    <p className="text-[10px] theme-text-sub font-black mt-1.5 uppercase tracking-widest opacity-70">{t('dash_activity')}: {p.med} · ADH: {p.adherence}</p>
                  </div>
                </div>

                <div className="flex items-center gap-6">
                  <div className={`px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-sm border ${p.urgency === 'high' ? 'bg-red-600 text-white border-red-700 shadow-red-500/20' : 'theme-bg theme-text-sub theme-border'}`}>
                    {t(p.status)}
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => addNotification(`Initiating secure consult for ${p.nameKey ? t(p.nameKey) : p.name}...`, 'info')} className="bg-gray-900 dark:bg-teal-600 text-white px-8 py-3.5 rounded-xl text-[10px] font-black uppercase tracking-widest hover:scale-105 transition-all active:scale-95 shadow-xl shadow-gray-900/10">
                      {t('dash_consult')}
                    </button>
                    <button onClick={() => handleRemove(p.id)} className="w-12 h-12 rounded-xl border theme-border flex items-center justify-center theme-text-sub hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 hover:border-red-200 dark:border-red-800 transition-all shadow-sm" title={t('med_remove_title')}>
                      🗑️
                    </button>
                  </div>
                </div>
              </div>
              <div className="absolute -right-10 -bottom-10 w-32 h-32 bg-teal-500/5 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          ))}

          {monitored.length === 0 && (
            <button onClick={() => setModalOpen(true)} className="border-2 border-dashed theme-border rounded-[2.5rem] p-12 flex flex-col items-center justify-center gap-5 hover:border-teal-300 dark:hover:border-teal-700 hover:theme-bg transition-all group shadow-sm">
              <div className="w-16 h-16 rounded-2xl theme-bg flex items-center justify-center theme-text-sub group-hover:bg-teal-100 dark:group-hover:bg-teal-900 group-hover:text-teal-600 transition-all border theme-border shadow-md">
                <span className="text-3xl font-black">+</span>
              </div>
              <div className="text-center">
                <span className="text-[10px] font-black theme-text-sub uppercase tracking-[0.2em] group-hover:text-teal-700 dark:group-hover:text-teal-400 transition-colors">{t('dash_register_patient')}</span>
                <p className="text-[9px] theme-text-sub font-bold uppercase tracking-widest mt-1 opacity-60">{t('dash_caregiver_desc')}</p>
              </div>
            </button>
          )}
        </div>
      </section>

      {/* Active Care Network (Booked Specialists) */}
      {activeNetwork.length > 0 && (
        <section className="space-y-8 pt-4">
          <div className="flex items-center justify-between px-2">
            <h2 className="text-[10px] font-black theme-text-sub uppercase tracking-[0.2em]">{t('link_active_handshakes')}</h2>
            <span className="text-[10px] font-black text-teal-600 border border-teal-200 dark:border-teal-900/30 px-4 py-2 rounded-xl uppercase tracking-widest shadow-sm">{activeNetwork.length} {t('dash_stable')}</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {activeNetwork.map((doc) => (
              <div key={doc.nameKey || doc.name} className="theme-surface border theme-border rounded-[2rem] p-6 shadow-sm hover:shadow-xl transition-all group relative overflow-hidden">
                <div className="flex items-center gap-4 relative z-10">
                  <img src={doc.image} alt={doc.nameKey ? t(doc.nameKey) : doc.name} className="w-12 h-12 rounded-xl object-cover border theme-border" />
                  <div className="flex-1 min-w-0">
                    <p className="font-black theme-text text-sm uppercase tracking-tight truncate">{doc.nameKey ? t(doc.nameKey) : doc.name}</p>
                    <p className="text-[9px] theme-text-sub font-black uppercase tracking-widest opacity-70">{doc.specialtyKey ? t(doc.specialtyKey) : doc.specialty}</p>
                  </div>
                  <button onClick={() => handleRemoveSpecialist(doc)} className="text-gray-400 hover:text-red-500 transition-colors">✕</button>
                </div>
                <div className="mt-4 pt-4 border-t theme-border flex justify-between items-center relative z-10">
                  <span className="text-[9px] font-black text-green-600 dark:text-green-400 uppercase tracking-widest">{t('dash_clinical_sync')}</span>
                  <button onClick={() => addNotification(`Initiating clinical consult with ${doc.nameKey ? t(doc.nameKey) : doc.name}...`, 'info')} className="text-[9px] font-black text-teal-600 uppercase tracking-[0.2em] hover:underline">{t('dash_consult')}</button>
                </div>
                <div className="absolute -right-8 -bottom-8 w-24 h-24 bg-teal-500/5 rounded-full blur-2xl" />
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Recommended Specialists Section */}
      <section className="space-y-10 pt-12 border-t theme-border">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 px-2">
          <div>
            <h2 className="text-[10px] font-black theme-text-sub uppercase tracking-[0.2em]">{t('dash_specialist_consult')}</h2>
            <p className="text-xs theme-text-sub mt-1.5 font-medium">{t('dash_caregiver_desc')}</p>
          </div>
          <div className="relative group">
            <input
              type="text"
              placeholder={t('dash_filter_specialists')}
              className="pl-12 pr-8 py-4 border theme-border rounded-2xl text-xs theme-text focus:ring-4 focus:ring-teal-500/10 focus:border-teal-500 outline-none w-full md:w-96 transition-all shadow-sm font-medium"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <span className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 text-lg group-focus-within:text-teal-500 transition-colors">🔍</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredDoctors.map((doc, i) => (
            <DoctorCard key={i} doctor={doc} onBook={handleBook} />
          ))}
        </div>

        {filteredDoctors.length === 0 && (
          <div className="py-20 text-center theme-bg rounded-[2.5rem] border border-dashed theme-border">
            <p className="theme-text-sub font-black text-[10px] uppercase tracking-[0.2em]">{t('dash_no_specialists')}</p>
            <button
              onClick={() => setSearchQuery('')}
              className="mt-4 text-teal-600 dark:text-teal-400 font-black text-xs hover:underline uppercase tracking-widest"
            >
              {t('dash_clear_filters')}
            </button>
          </div>
        )}
      </section>
    </div>
  );
}
