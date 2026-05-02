import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNotification } from '../../context/NotificationContext';
import useAuth from '../../hooks/useAuth';
import authService from '../../services/authService';
import Spinner from '../../components/ui/Spinner';
import ROUTES from '../../constants/routes';

export default function SignUpPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { login } = useAuth();
  const { addNotification } = useNotification();
  const [form, setForm] = useState({ name: '', email: '', password: '', phone: '', age: '', role: 'PATIENT' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const userData = await authService.register(form.name, form.email, form.password, form.phone, form.age, form.role);
      login(userData);
      addNotification(`Profile created successfully! Welcome, ${userData.name}`, 'success');
      navigate(ROUTES.DASHBOARD);
    } catch (err) {
      console.error('Registration failed:', err);
      addNotification('Registration failed. Please try again.', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2 theme-bg animate-fade-in">

      {/* Left panel */}
      <div className="hidden lg:flex flex-col justify-between bg-gray-950 p-16 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-teal-500/10 rounded-full blur-[100px] -mr-32 -mt-32" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-teal-500/5 rounded-full blur-[80px] -ml-20 -mb-20" />

        <Link to={ROUTES.HOME} className="flex items-center gap-2.5 no-underline relative z-10">
        </Link>

        <div className="relative z-10">
          <h2 className="text-4xl lg:text-5xl font-black text-white leading-[1.1] mb-8 uppercase tracking-tighter">
            {t('auth_journey_title')}<br />
            <span className="text-teal-500">{t('auth_right_here')}</span>
          </h2>
          <p className="text-gray-400 text-base leading-relaxed max-w-sm font-medium">
            {t('auth_journey_desc')}
          </p>

          <div className="mt-12 space-y-5">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex items-center gap-4 group">
                <div className="w-2 h-2 rounded-full bg-teal-500 group-hover:scale-150 transition-transform shadow-[0_0_8px_rgba(20,184,166,0.5)]" />
                <span className="text-gray-400 text-sm font-black uppercase tracking-widest group-hover:text-white transition-colors">
                  {t(`auth_feat_${i}`)}
                </span>
              </div>
            ))}
          </div>
        </div>

        <p className="text-gray-600 text-[10px] font-black uppercase tracking-widest relative z-10">
        </p>
      </div>

      {/* Right — Form */}
      <div className="flex items-center justify-center px-10 py-20 theme-bg">
        <div className="w-full max-w-md">

          {/* Mobile logo */}
          <Link to={ROUTES.HOME} className="lg:hidden flex items-center gap-3 no-underline mb-12">
            <div className="w-9 h-9 rounded-xl bg-gray-900 dark:bg-teal-600 flex items-center justify-center shadow-lg">
              <span className="text-white font-black text-xs">MS</span>
            </div>
            <span className="font-black theme-text text-lg uppercase tracking-tight">{t('app_name')}</span>
          </Link>

          <div className="mb-10">
            <h1 className="text-3xl font-black theme-text mb-2 uppercase tracking-tight">{t('auth_create_entity')}</h1>
            <p className="theme-text-sub text-sm font-medium">{t('auth_init_desc')}</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-[10px] font-black theme-text-sub uppercase tracking-[0.2em] mb-4 px-1">{t('auth_select_role')}</label>
              <div className="grid grid-cols-3 gap-3">
                {[{ key: 'PATIENT', label: 'patient' }, { key: 'CAREGIVER', label: 'caregiver' }, { key: 'DOCTOR', label: 'doctor' }].map(({ key, label }) => (
                  <button
                    key={key}
                    type="button"
                    onClick={() => setForm({ ...form, role: key })}
                    className={`py-3.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border shadow-sm active:scale-95 ${form.role === key
                      ? 'bg-gray-900 dark:bg-teal-600 border-gray-900 dark:border-teal-500 text-white shadow-xl'
                      : 'theme-surface border theme-border theme-text-sub hover:theme-text hover:border-gray-400 dark:hover:border-gray-600'
                      }`}
                  >
                    {t(`auth_role_${label}`)}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-6">
              <div className="group">
                <label className="block text-[10px] font-black theme-text-sub uppercase tracking-[0.2em] mb-2 px-1 group-focus-within:text-teal-600 transition-colors">{t('auth_name_label')}</label>
                <input
                  type="text"
                  placeholder={t('auth_name_placeholder')}
                  required
                  value={form.name}
                  onChange={e => setForm({ ...form, name: e.target.value })}
                  className="w-full px-5 py-4 theme-surface border theme-border rounded-xl text-sm theme-text placeholder-gray-500 focus:outline-none focus:border-teal-500 focus:ring-4 focus:ring-teal-500/5 transition-all font-medium"
                />
              </div>

              <div className="group">
                <label className="block text-[10px] font-black theme-text-sub uppercase tracking-[0.2em] mb-2 px-1 group-focus-within:text-teal-600 transition-colors">{t('auth_email_label')}</label>
                <input
                  type="email"
                  placeholder={t('auth_email_placeholder')}
                  required
                  value={form.email}
                  onChange={e => setForm({ ...form, email: e.target.value })}
                  className="w-full px-5 py-4 theme-surface border theme-border rounded-xl text-sm theme-text placeholder-gray-500 focus:outline-none focus:border-teal-500 focus:ring-4 focus:ring-teal-500/5 transition-all font-medium"
                />
              </div>

              <div className="group">
                <label className="block text-[10px] font-black theme-text-sub uppercase tracking-[0.2em] mb-2 px-1 group-focus-within:text-teal-600 transition-colors">{t('auth_password_label')}</label>
                <input
                  type="password"
                  placeholder={t('auth_password_placeholder')}
                  required
                  value={form.password}
                  onChange={e => setForm({ ...form, password: e.target.value })}
                  className="w-full px-5 py-4 theme-surface border theme-border rounded-xl text-sm theme-text placeholder-gray-500 focus:outline-none focus:border-teal-500 focus:ring-4 focus:ring-teal-500/5 transition-all font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="group">
                  <label className="block text-[10px] font-black theme-text-sub uppercase tracking-[0.2em] mb-2 px-1 group-focus-within:text-teal-600 transition-colors">{t('auth_phone_label') || 'Phone'}</label>
                  <input
                    type="tel"
                    placeholder={t('auth_phone_placeholder') || '+91 XXXXX XXXXX'}
                    required
                    value={form.phone}
                    onChange={e => setForm({ ...form, phone: e.target.value })}
                    className="w-full px-5 py-4 theme-surface border theme-border rounded-xl text-sm theme-text placeholder-gray-500 focus:outline-none focus:border-teal-500 focus:ring-4 focus:ring-teal-500/5 transition-all font-medium"
                  />
                </div>

                <div className="group">
                  <label className="block text-[10px] font-black theme-text-sub uppercase tracking-[0.2em] mb-2 px-1 group-focus-within:text-teal-600 transition-colors">{t('auth_age_label') || 'Age'}</label>
                  <input
                    type="number"
                    placeholder={t('auth_age_placeholder') || 'Age'}
                    required
                    min="1"
                    max="150"
                    value={form.age}
                    onChange={e => setForm({ ...form, age: e.target.value })}
                    className="w-full px-5 py-4 theme-surface border theme-border rounded-xl text-sm theme-text placeholder-gray-500 focus:outline-none focus:border-teal-500 focus:ring-4 focus:ring-teal-500/5 transition-all font-medium"
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full py-4.5 rounded-xl text-xs font-black uppercase tracking-[0.2em] shadow-2xl shadow-teal-500/20 active:scale-[0.98] transition-all flex items-center justify-center gap-3 mt-4"
            >
              {loading
                ? <><Spinner /> {t('auth_btn_initializing')}</>
                : t('auth_btn_signup')
              }
            </button>
          </form>

          <div className="mt-10 pt-8 border-t theme-border text-center">
            <p className="text-sm theme-text-sub font-medium">
              {t('auth_existing_entity')}{' '}
              <Link to={ROUTES.LOGIN} className="text-teal-600 dark:text-teal-400 font-black hover:underline no-underline uppercase tracking-widest ml-1 text-xs">
                {t('auth_signin_access')}
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
