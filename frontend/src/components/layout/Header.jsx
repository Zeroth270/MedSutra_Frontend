import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import { useTheme } from '../../context/ThemeContext';
import { NAV_LINKS } from '../../constants/navigation';
import ROUTES from '../../constants/routes';

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { user, isAuthenticated, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 theme-surface border-b theme-border shadow-sm">
      <div className="max-w-6xl mx-auto px-6 flex items-center justify-between h-20">
        <Link to={ROUTES.HOME} className="flex items-center gap-2.5 no-underline">
          <div className="w-9 h-9 rounded-xl bg-gray-900 dark:bg-teal-600 flex items-center justify-center flex-shrink-0 shadow-lg">
            <span className="text-white font-black text-xs tracking-tight">MS</span>
          </div>
          <span className="theme-text font-black text-lg tracking-tight uppercase">MedSutra AI</span>
        </Link>

        <nav className="hidden md:flex items-center gap-2">
          {NAV_LINKS.map(link => (
            <a key={link.label} href={link.href} className="px-5 py-2 text-[10px] font-black uppercase tracking-widest theme-text-sub hover:theme-text hover:theme-bg rounded-xl transition-all no-underline">
              {link.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-4">
          <button 
            onClick={toggleTheme}
            className="w-11 h-11 rounded-2xl theme-bg border theme-border flex items-center justify-center theme-text-sub hover:theme-text hover:border-teal-500/50 transition-all shadow-sm active:scale-90"
            title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
          >
            <span className="text-xl">{theme === 'light' ? '🌙' : '☀️'}</span>
          </button>
          
          <div className="h-8 w-px theme-border mx-2"></div>

          {isAuthenticated ? (
            <div className="flex items-center gap-3">
              <Link to={ROUTES.DASHBOARD} className="text-[10px] font-black uppercase tracking-widest theme-text-sub hover:theme-text px-5 py-2.5 rounded-xl hover:theme-bg transition-all flex items-center gap-3 no-underline border theme-border shadow-sm">
                <div className="w-7 h-7 rounded-lg bg-gray-900 dark:bg-teal-600 flex items-center justify-center text-white text-xs font-black shadow-md">{user.avatar}</div>
                Dashboard
              </Link>
              <button onClick={logout} className="text-[10px] font-black uppercase tracking-widest text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 px-5 py-2.5 rounded-xl transition-all">Exit</button>
            </div>
          ) : (
            <div className="flex items-center gap-4">
              <Link to={ROUTES.LOGIN} className="text-[10px] font-black uppercase tracking-widest theme-text-sub hover:theme-text px-6 py-2.5 rounded-xl hover:theme-bg transition-all no-underline">Sign In</Link>
              <Link to={ROUTES.SIGN_UP} className="btn-primary text-[10px] font-black uppercase tracking-[0.15em] px-8 py-3.5 rounded-xl no-underline shadow-xl shadow-teal-500/20 active:scale-95 transition-all">Join Free</Link>
            </div>
          )}
        </div>

        <button onClick={() => setMenuOpen(v => !v)} className="md:hidden p-3 theme-text-sub hover:theme-bg rounded-xl border theme-border transition-all">
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
            <a key={link.label} href={link.href} onClick={() => setMenuOpen(false)} className="block py-4 text-xs font-black uppercase tracking-widest theme-text no-underline border-b theme-border last:border-0">{link.label}</a>
          ))}
          <div className="pt-6 mt-4 flex flex-col gap-6">
            <button onClick={toggleTheme} className="flex items-center gap-3 text-xs font-black uppercase tracking-widest theme-text">
              <span className="text-xl">{theme === 'light' ? '🌙' : '☀️'}</span>
              Switch Theme
            </button>
            {isAuthenticated ? (
              <button onClick={logout} className="text-xs text-red-500 font-black uppercase tracking-widest text-left">Sign Out Account</button>
            ) : (
              <div className="flex flex-col gap-4">
                <Link to={ROUTES.LOGIN} onClick={() => setMenuOpen(v => !v)} className="text-xs font-black uppercase tracking-widest theme-text no-underline">Sign In</Link>
                <Link to={ROUTES.SIGN_UP} onClick={() => setMenuOpen(v => !v)} className="btn-primary text-center py-4 rounded-xl no-underline text-xs font-black uppercase tracking-widest shadow-xl shadow-teal-500/20">Join MedSutra</Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
