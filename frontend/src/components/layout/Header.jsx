import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import { useTheme } from '../../context/ThemeContext';
import { useTranslation } from 'react-i18next';
import { NAV_LINKS } from '../../constants/navigation';
import ROUTES from '../../constants/routes';
import LanguageSelector from '../ui/LanguageSelector';

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { user, isAuthenticated, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { t } = useTranslation();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 theme-surface shadow-sm h-20">
      <div className="max-w-6xl mx-auto px-6 flex items-center justify-between h-full">
        <Link to={ROUTES.HOME} className="flex items-center gap-2.5 no-underline group">
          <div className="w-9 h-9 rounded-xl bg-gray-900 dark:bg-teal-600 flex items-center justify-center flex-shrink-0 shadow-lg group-hover:scale-110 transition-all duration-300">
            <span className="text-white font-black text-xs tracking-tight">MS</span>
          </div>
          <span className="theme-text font-black text-lg tracking-tight uppercase group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors duration-300">{t('app_name')}</span>
        </Link>

        <nav className="hidden md:flex items-center gap-2">
          {NAV_LINKS.map(link => (
            <a 
              key={link.label} 
              href={link.href} 
              className="px-5 py-2 text-[10px] font-black uppercase tracking-widest transition-all duration-300 no-underline rounded-xl hover:scale-105 active:scale-95 theme-text-sub hover:theme-text hover:theme-bg"
            >
              {t(`nav_${link.label.toLowerCase().replace(/\s+/g, '_')}`)}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-4">
          <LanguageSelector />
          <button 
            onClick={toggleTheme}
            className="w-11 h-11 rounded-2xl flex items-center justify-center transition-all duration-300 shadow-sm active:scale-90 hover:scale-110 theme-bg theme-text-sub hover:theme-text"
            title={t('switch_theme')}
          >
            <span className="text-xl transform transition-transform group-hover:scale-120">{theme === 'light' ? '🌙' : '☀️'}</span>
          </button>
          
          <div className="mx-1"></div>

          {isAuthenticated ? (
            <div className="flex items-center gap-3">
              <Link 
                to={ROUTES.DASHBOARD} 
                className="text-[10px] font-black uppercase tracking-widest px-5 py-2.5 rounded-xl transition-all duration-300 flex items-center gap-3 no-underline shadow-sm hover:scale-105 active:scale-95 theme-text-sub hover:theme-text theme-bg hover:theme-bg"
              >
                <div className="w-7 h-7 rounded-lg bg-gray-900 dark:bg-teal-600 flex items-center justify-center text-white text-xs font-black shadow-md group-hover:scale-110">{user.avatar}</div>
                {t('dashboard')}
              </Link>
              <button onClick={logout} className="text-[10px] font-black uppercase tracking-widest text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 px-5 py-2.5 rounded-xl transition-all duration-300 hover:scale-105 active:scale-95">{t('exit')}</button>
            </div>
          ) : (
            <div className="flex items-center gap-4">
              <Link to={ROUTES.LOGIN} className="text-[10px] font-black uppercase tracking-widest px-6 py-2.5 rounded-xl transition-all duration-300 no-underline hover:scale-105 active:scale-95 theme-text-sub hover:theme-text hover:theme-bg">{t('btn_signin')}</Link>
              <Link to={ROUTES.SIGN_UP} className="btn-primary text-[10px] font-black uppercase tracking-[0.15em] px-8 py-3.5 rounded-xl no-underline shadow-xl shadow-teal-500/20 hover:scale-105 active:scale-95 transition-all duration-300 hover:shadow-teal-500/40">{t('btn_join')}</Link>
            </div>
          )}
        </div>

        <button onClick={() => setMenuOpen(v => !v)} className="md:hidden p-3 rounded-xl border transition-all duration-300 hover:scale-105 active:scale-95 theme-text-sub hover:theme-bg theme-border">
          <div className="w-6 space-y-1.5">
            <div className="h-0.5 bg-current rounded-full" />
            <div className="h-0.5 bg-current rounded-full" />
            <div className="h-0.5 bg-current rounded-full" />
          </div>
        </button>
      </div>

      {menuOpen && (
        <div className="md:hidden theme-surface border-t theme-border px-8 py-8 flex flex-col gap-2 shadow-2xl animate-fade-in">
          {NAV_LINKS.map(link => (
            <a key={link.label} href={link.href} onClick={() => setMenuOpen(false)} className="block py-4 text-xs font-black uppercase tracking-widest theme-text no-underline border-b theme-border last:border-0 hover:text-teal-600 transition-colors">{t(`nav_${link.label.toLowerCase().replace(/\s+/g, '_')}`)}</a>
          ))}
          <div className="pt-6 mt-4 flex flex-col gap-6">
            <div className="flex items-center justify-between">
              <button onClick={toggleTheme} className="flex items-center gap-3 text-xs font-black uppercase tracking-widest theme-text hover:text-teal-600 transition-colors">
                <span className="text-xl">{theme === 'light' ? '🌙' : '☀️'}</span>
                Switch Theme
              </button>
              <LanguageSelector />
            </div>
            {isAuthenticated ? (
              <button onClick={logout} className="text-xs text-red-500 font-black uppercase tracking-widest text-left hover:bg-red-50 dark:hover:bg-red-900/10 p-2 rounded-lg transition-all">Sign Out Account</button>
            ) : (
              <div className="flex flex-col gap-4">
                <Link to={ROUTES.LOGIN} onClick={() => setMenuOpen(v => !v)} className="text-xs font-black uppercase tracking-widest theme-text no-underline hover:text-teal-600 transition-colors">{t('btn_signin')}</Link>
                <Link to={ROUTES.SIGN_UP} onClick={() => setMenuOpen(v => !v)} className="btn-primary text-center py-4 rounded-xl no-underline text-xs font-black uppercase tracking-widest shadow-xl shadow-teal-500/20">{t('btn_join')}</Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
