import { useEffect, useState } from 'react';
import { useNavigate, Link, Outlet, useLocation } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import { DASHBOARD_NAV } from '../../constants/navigation';
import ROUTES from '../../constants/routes';

export default function DashboardLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isAuthenticated, logout } = useAuth();
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
    <div className="flex min-h-screen bg-gray-50" style={{ fontFamily: "'Inter', sans-serif" }}>
      <aside style={{ width: sidebarW, minWidth: sidebarW, transition: 'width 0.22s ease, min-width 0.22s ease' }} className="fixed left-0 top-0 h-screen z-50 bg-white border-r border-gray-100 flex flex-col overflow-hidden">
        <div className="flex items-center border-b border-gray-100 flex-shrink-0" style={{ height: 64, padding: '0 16px', justifyContent: sidebarOpen ? 'space-between' : 'center' }}>
          {sidebarOpen && (
            <Link to={ROUTES.HOME} className="flex items-center gap-2 no-underline min-w-0">
              <div className="w-7 h-7 rounded-md bg-gray-900 flex items-center justify-center flex-shrink-0"><span className="text-white font-black text-xs">MS</span></div>
              <span className="font-bold text-gray-900 text-sm truncate">MedSutra AI</span>
            </Link>
          )}
          <button onClick={() => setSidebarOpen(v => !v)} className="w-7 h-7 rounded-md border border-gray-200 bg-white hover:bg-gray-100 flex items-center justify-center text-gray-500 transition-all flex-shrink-0">
            <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24" style={{ transform: sidebarOpen ? 'rotate(0deg)' : 'rotate(180deg)', transition: 'transform 0.22s' }}>
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </button>
        </div>

        {sidebarOpen ? (
          <div className="px-4 py-4 border-b border-gray-100 flex-shrink-0">
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
              <div className="w-9 h-9 rounded-lg bg-gray-900 flex items-center justify-center font-bold text-white text-sm flex-shrink-0">{user.avatar}</div>
              <div className="min-w-0">
                <p className="font-semibold text-gray-900 text-sm truncate">{user.name}</p>
                <p className="text-xs text-gray-400 truncate">{user.email}</p>
              </div>
            </div>
            <div className="flex items-center justify-between mt-3 px-1">
              <span className="text-xs bg-gray-100 text-gray-600 px-2.5 py-1 rounded-full font-medium">{user.role}</span>
              <span className="text-xs text-gray-400">{user.joined}</span>
            </div>
          </div>
        ) : (
          <div className="py-4 border-b border-gray-100 flex justify-center flex-shrink-0">
            <div className="w-9 h-9 rounded-lg bg-gray-900 flex items-center justify-center font-bold text-white text-sm">{user.avatar}</div>
          </div>
        )}

        <nav className="flex-1 px-3 py-4 overflow-y-auto overflow-x-hidden">
          {sidebarOpen && <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest px-2 mb-3">Navigation</p>}
          <div className="space-y-0.5">
            {DASHBOARD_NAV.map(item => {
              const isActive = item.path === ROUTES.DASHBOARD ? location.pathname === ROUTES.DASHBOARD : location.pathname.startsWith(item.path);
              return (
                <Link key={item.label} to={item.path} title={!sidebarOpen ? item.label : undefined} className={`nav-item no-underline ${isActive ? 'active' : ''}`} style={{ justifyContent: sidebarOpen ? 'flex-start' : 'center' }}>
                  <div className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${isActive ? 'bg-white' : 'bg-gray-300'}`} />
                  {sidebarOpen && <span className="truncate">{item.label}</span>}
                </Link>
              );
            })}
          </div>
        </nav>

        <div className="px-3 pb-4 border-t border-gray-100 pt-3 flex-shrink-0">
          <button onClick={handleLogout} title={!sidebarOpen ? 'Logout' : undefined} className="nav-item hover:bg-red-50 hover:text-red-500 w-full" style={{ justifyContent: sidebarOpen ? 'flex-start' : 'center' }}>
            <div className="w-1.5 h-1.5 rounded-full bg-gray-300 flex-shrink-0" />
            {sidebarOpen && <span>Logout</span>}
          </button>
        </div>
      </aside>

      <main style={{ marginLeft: sidebarW, transition: 'margin-left 0.22s ease', flex: 1 }} className="min-h-screen flex flex-col">
        <div className="sticky top-0 z-40 bg-white border-b border-gray-100 px-8 h-16 flex items-center justify-between flex-shrink-0">
          <div>
            <p className="text-base font-bold text-gray-900">{activePage?.label ?? 'Dashboard'}</p>
            <p className="text-xs text-gray-400 mt-0.5">MedSutra AI Platform</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right hidden sm:block">
              <p className="text-xs text-gray-400">Today</p>
              <p className="text-xs font-semibold text-gray-700 mt-0.5">{new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' })}</p>
            </div>
            <div className="w-8 h-8 rounded-lg bg-gray-900 flex items-center justify-center font-bold text-white text-sm flex-shrink-0">{user.avatar}</div>
          </div>
        </div>
        <div className="p-8 flex-1">
          <Outlet context={{ user }} />
        </div>
      </main>
    </div>
  );
}
