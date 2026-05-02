import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNotification } from '../../context/NotificationContext';
import useAuth from '../../hooks/useAuth';
import authService from '../../services/authService';
import Spinner from '../../components/ui/Spinner';
import ROUTES from '../../constants/routes';

export default function LoginPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { login } = useAuth();
  const { addNotification } = useNotification();
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const userData = await authService.login(form.email, form.password);
      login(userData);
      addNotification(`Welcome back, ${userData.name}`, 'success');
      navigate(ROUTES.DASHBOARD);
    } catch (err) {
      console.error('Login failed:', err);
      addNotification('Authentication failed. Please check your credentials.', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2 theme-bg animate-fade-in">
      {/* Left — Brand/Intro */}
      <div className="hidden lg:flex flex-col justify-between bg-gray-950 p-16 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-teal-500/10 rounded-full blur-[100px] -mr-32 -mt-32" />

        <Link to={ROUTES.HOME} className="flex items-center gap-2.5 no-underline relative z-10">
        </Link>

        <div className="relative z-10">
          <h2 className="text-4xl lg:text-5xl font-black text-white leading-[1.1] mb-8 uppercase tracking-tighter">
            {t('auth_welcome_back')}<br />
            {t('auth_health_profile')}<br />
            <span className="text-teal-500">{t('auth_is_ready')}</span>
          </h2>
          <p className="text-gray-400 text-base leading-relaxed max-w-sm font-medium">
            {t('auth_intro_desc')}
          </p>
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
            <h1 className="text-3xl font-black theme-text mb-2 tracking-tight uppercase">{t('auth_authentication')}</h1>
            <p className="theme-text-sub text-sm font-medium">{t('auth_credentials_desc')}</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-6">
              <div className="group">
                <label className="block text-[10px] font-black uppercase tracking-[0.2em] theme-text-sub mb-2 px-1 group-focus-within:text-teal-600 transition-colors">{t('auth_email_label')}</label>
                <input
                  type="email"
                  placeholder={t('auth_email_placeholder')}
                  required
                  value={form.email}
                  onChange={e => setForm({ ...form, email: e.target.value })}
                  className="w-full px-5 py-4 theme-surface border theme-border rounded-xl text-sm theme-text placeholder-gray-500 dark:placeholder-gray-600 focus:outline-none focus:border-teal-500 focus:ring-4 focus:ring-teal-500/5 transition-all font-medium"
                />
              </div>

              <div className="group">
                <div className="flex justify-between items-center mb-2 px-1">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] theme-text-sub group-focus-within:text-teal-600 transition-colors">{t('auth_password_label')}</label>
                </div>
                <input
                  type="password"
                  placeholder={t('auth_password_placeholder')}
                  required
                  value={form.password}
                  onChange={e => setForm({ ...form, password: e.target.value })}
                  className="w-full px-5 py-4 theme-surface border theme-border rounded-xl text-sm theme-text placeholder-gray-500 dark:placeholder-gray-600 focus:outline-none focus:border-teal-500 focus:ring-4 focus:ring-teal-500/5 transition-all font-medium"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full py-4.5 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] shadow-2xl shadow-teal-500/20 active:scale-[0.98] transition-all flex items-center justify-center gap-3 mt-4"
            >
              {loading
                ? <><Spinner /> {t('auth_btn_authenticating')}</>
                : t('auth_btn_login')
              }
            </button>
          </form>

          <div className="mt-12 pt-8 border-t theme-border text-center">
            <p className="text-sm theme-text-sub font-medium">
              {t('auth_new_entity')}{' '}
              <Link to={ROUTES.SIGN_UP} className="text-teal-600 dark:text-teal-400 font-black hover:underline no-underline uppercase tracking-widest ml-1 text-xs">
                {t('auth_init_profile')}
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
