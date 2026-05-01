import { useEffect, useState } from 'react';
import { useNavigate, Link, Outlet, useLocation } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import { useTheme } from '../../context/ThemeContext';
import { useTranslation } from 'react-i18next';
import { DASHBOARD_NAV } from '../../constants/navigation';
import ROUTES from '../../constants/routes';
import LanguageSelector from '../ui/LanguageSelector';

export default function DashboardLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isAuthenticated, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { t, i18n } = useTranslation();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) navigate(ROUTES.LOGIN);
  }, [isAuthenticated, navigate]);

  const handleLogout = () => { logout(); navigate(ROUTES.HOME); };

  if (!user) return null;

  const activePage = DASHBOARD_NAV.find(n =>
    n.path === ROUTES.DASHBOARD
      ? location.pathname === ROUTES.DASHBOARD
      : location.pathname.startsWith(n.path)
  );

  const sidebarW = sidebarOpen ? 240 : 64;

  return (
    <div className="flex min-h-screen theme-bg">
      <aside style={{ width: sidebarW, minWidth: sidebarW, transition: 'width 0.22s ease, min-width 0.22s ease' }} className="fixed left-0 top-0 h-screen z-50 border-r theme-border flex flex-col overflow-hidden">
        <div className="flex items-center border-b theme-border flex-shrink-0" style={{ height: 64, padding: '0 16px', justifyContent: sidebarOpen ? 'space-between' : 'center' }}>
          {sidebarOpen && (
            <Link to={ROUTES.HOME} className="flex items-center gap-2 no-underline min-w-0">
              <div className="w-7 h-7 rounded-md bg-gray-900 dark:bg-teal-600 flex items-center justify-center flex-shrink-0 shadow-sm"><span className="text-white font-black text-xs">MS</span></div>
              <span className="font-bold theme-text text-sm truncate tracking-tight uppercase">{t('app_name')}</span>
            </Link>
          )}
          <button onClick={() => setSidebarOpen(v => !v)} className="w-7 h-7 rounded-md border theme-border theme-surface hover:theme-bg theme-text-sub transition-all flex-shrink-0 flex items-center justify-center shadow-sm">
            <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24" style={{ transform: sidebarOpen ? 'rotate(0deg)' : 'rotate(180deg)', transition: 'transform 0.22s' }}>
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </button>
        </div>

        {sidebarOpen ? (
          <div className="px-4 py-4 border-b theme-border flex-shrink-0">
            <div className="flex items-center gap-3 p-3 rounded-xl border theme-border">
              <div className="w-9 h-9 rounded-lg bg-gray-900 dark:bg-teal-600 flex items-center justify-center font-bold text-white text-sm flex-shrink-0 shadow-md">{user.avatar}</div>
              <div className="min-w-0">
                <p className="font-black theme-text text-sm truncate">{user.name}</p>
                <p className="text-[10px] theme-text-sub truncate font-bold uppercase tracking-tight">{user.email}</p>
              </div>
            </div>
            <div className="flex items-center justify-between mt-3 px-1">
              <span className="text-[9px] theme-bg theme-text font-black px-2.5 py-1 rounded-lg border theme-border uppercase tracking-widest">{t(`auth_role_${user.role.toLowerCase()}`)}</span>
              <span className="text-[10px] theme-text-sub font-bold uppercase tracking-tight opacity-70">{user.joined}</span>
            </div>
          </div>
        ) : (
          <div className="py-4 border-b theme-border flex justify-center flex-shrink-0">
            <div className="w-9 h-9 rounded-lg bg-gray-900 dark:bg-teal-600 flex items-center justify-center font-bold text-white text-sm shadow-md">{user.avatar}</div>
          </div>
        )}

        <nav className="flex-1 px-3 py-6 overflow-y-auto overflow-x-hidden">
          {sidebarOpen && <p className="text-[10px] font-black theme-text-sub uppercase tracking-[0.2em] px-3 mb-4">{t('core_nav')}</p>}
          <div className="space-y-1">
            {DASHBOARD_NAV
              .filter(item => !item.roles || item.roles.includes(user.role))
              .map(item => {
              const isActive = item.path === ROUTES.DASHBOARD ? location.pathname === ROUTES.DASHBOARD : location.pathname.startsWith(item.path);
              return (
                <Link 
                  key={item.label} 
                  to={item.path} 
                  title={!sidebarOpen ? item.label : undefined} 
                  className={`nav-item no-underline flex items-center group theme-text-sub hover:theme-bg hover:theme-text ${isActive ? 'active shadow-sm' : ''}`} 
                  style={{ 
                    justifyContent: sidebarOpen ? 'flex-start' : 'center',
                    padding: sidebarOpen ? '10px 14px' : '12px 0'
                  }}
                >
                  <span className={`text-xl flex-shrink-0 transition-transform group-hover:scale-110 ${sidebarOpen ? 'mr-3' : 'm-0'} ${isActive ? 'grayscale-0' : 'grayscale group-hover:grayscale-0'}`}>
                    {item.icon}
                  </span>
                  {sidebarOpen && <span className="truncate font-black text-sm uppercase tracking-tight">{t(`nav_${item.label.toLowerCase().replace(/\s+/g, '_')}`)}</span>}
                </Link>
              );
            })}
          </div>
        </nav>

        <div className="px-3 pb-6 border-t theme-border pt-4 flex-shrink-0">
          <button 
            onClick={handleLogout} 
            title={!sidebarOpen ? 'Logout' : undefined} 
            className="nav-item hover:bg-red-50 dark:hover:bg-red-900/10 hover:text-red-500 w-full flex items-center group theme-text-sub transition-colors" 
            style={{ 
              justifyContent: sidebarOpen ? 'flex-start' : 'center',
              padding: sidebarOpen ? '10px 14px' : '12px 0'
            }}
          >
            <span className={`text-xl flex-shrink-0 transition-transform group-hover:scale-110 ${sidebarOpen ? 'mr-3' : 'm-0'}`}>🚪</span>
            {sidebarOpen && <span className="font-black tracking-tight text-xs uppercase">{t('sign_out')}</span>}
          </button>
        </div>
      </aside>

      <main style={{ marginLeft: sidebarW, transition: 'margin-left 0.22s ease', flex: 1 }} className="min-h-screen flex flex-col theme-bg">
        <div className="sticky top-0 z-40 px-8 h-16 flex items-center justify-between flex-shrink-0 shadow-sm border-b theme-border bg-theme-bg/80 backdrop-blur-md">
          <div>
            <p className="text-sm font-black theme-text tracking-tight uppercase">{activePage ? t(`nav_${activePage.label.toLowerCase().replace(/\s+/g, '_')}`) : t('dashboard')}</p>
            <p className="text-[10px] theme-text-sub mt-0.5 font-bold uppercase tracking-widest opacity-80">{t('platform')}</p>
          </div>
          <div className="flex items-center gap-6">
            <LanguageSelector />
            <button 
              onClick={toggleTheme}
              className="w-10 h-10 rounded-xl theme-bg border theme-border flex items-center justify-center theme-text-sub hover:theme-text hover:border-teal-500/50 transition-all shadow-sm active:scale-90"
              title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
            >
              <span className="text-lg">{theme === 'light' ? '🌙' : '☀️'}</span>
            </button>
            <div className="flex items-center gap-4 border-l theme-border pl-6">
              <div className="text-right hidden sm:block">
                <p className="text-[10px] theme-text-sub uppercase font-black tracking-widest opacity-60">{t('today')}</p>
                <p className="text-xs font-black theme-text mt-0.5 uppercase tracking-tight">{new Date().toLocaleDateString(i18n.language === 'en' ? 'en-IN' : i18n.language, { weekday: 'long', day: 'numeric', month: 'short' })}</p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-gray-900 dark:bg-teal-600 flex items-center justify-center font-black text-white text-base flex-shrink-0 shadow-md border-2 theme-border">{user.avatar}</div>
            </div>
          </div>
        </div>
        <div className="p-8 flex-1 animate-fade-in theme-bg">
          <Outlet context={{ user }} />
        </div>
      </main>
    </div>
  );
}
