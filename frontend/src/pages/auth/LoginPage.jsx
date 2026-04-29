import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import useAuth from '../../hooks/useAuth';
import authService from '../../services/authService';
import Spinner from '../../components/ui/Spinner';
import ROUTES from '../../constants/routes';

export default function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [form, setForm] = useState({ email: '', password: '', role: 'Patient' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const userData = await authService.login(form.email, form.password, form.role);
      login(userData);
      navigate(ROUTES.DASHBOARD);
    } catch (err) {
      console.error('Login failed:', err);
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
          {/* <div className="w-10 h-10 rounded-xl bg-teal-600 flex items-center justify-center flex-shrink-0 shadow-lg">
            <span className="text-white font-black text-sm tracking-tight">MS</span>
          </div>
          <span className="text-white font-black text-xl tracking-tight uppercase">MedSutra AI</span> */}
        </Link>

        <div className="relative z-10">
          <h2 className="text-4xl lg:text-5xl font-black text-white leading-[1.1] mb-8 uppercase tracking-tighter">
            Welcome back.<br />
            Your health profile<br />
            <span className="text-teal-500">is ready.</span>
          </h2>
          <p className="text-gray-400 text-base leading-relaxed max-w-sm font-medium">
            MedSutra AI clinical systems are actively monitoring patient nodes for optimal adherence performance.
          </p>
        </div>

        <p className="text-gray-600 text-[10px] font-black uppercase tracking-widest relative z-10">
          {/* © {new Date().getFullYear()} MedSutra Clinical Systems */}
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
            <span className="font-black theme-text text-lg uppercase tracking-tight">MedSutra AI</span>
          </Link>

          <div className="mb-10">
            <h1 className="text-3xl font-black theme-text mb-2 tracking-tight uppercase">Authentication</h1>
            <p className="theme-text-sub text-sm font-medium">Enter your credentials to access clinical data.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-[10px] font-black uppercase tracking-[0.2em] theme-text-sub mb-4 px-1">Select Access Role</label>
              <div className="grid grid-cols-3 gap-3">
                {['Patient', 'Caregiver', 'Doctor'].map(role => (
                  <button
                    key={role}
                    type="button"
                    onClick={() => setForm({ ...form, role })}
                    className={`py-3.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border shadow-sm active:scale-95 ${form.role === role
                      ? 'bg-gray-900 dark:bg-teal-600 border-gray-900 dark:border-teal-500 text-white shadow-xl'
                      : 'theme-surface theme-border theme-text-sub hover:border-gray-400 dark:hover:border-teal-900/50'
                      }`}
                  >
                    {role}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-6">
              <div className="group">
                <label className="block text-[10px] font-black uppercase tracking-[0.2em] theme-text-sub mb-2 px-1 group-focus-within:text-teal-600 transition-colors">Digital Identity (Email)</label>
                <input
                  type="email"
                  placeholder="you@domain.com"
                  required
                  value={form.email}
                  onChange={e => setForm({ ...form, email: e.target.value })}
                  className="w-full px-5 py-4 theme-surface border theme-border rounded-xl text-sm theme-text placeholder-gray-500 dark:placeholder-gray-600 focus:outline-none focus:border-teal-500 focus:ring-4 focus:ring-teal-500/5 transition-all font-medium"
                />
              </div>

              <div className="group">
                <div className="flex justify-between items-center mb-2 px-1">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] theme-text-sub group-focus-within:text-teal-600 transition-colors">Access Key (Password)</label>
                  {/* <a href="#" className="text-[9px] font-black uppercase tracking-widest theme-text-sub hover:text-teal-600 transition-colors">
                    Reset Key
                  </a> */}
                </div>
                <input
                  type="password"
                  placeholder="••••••••••••"
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
                ? <><Spinner /> Authenticating...</>
                : 'Secure Access'
              }
            </button>
          </form>

          <div className="mt-12 pt-8 border-t theme-border text-center">
            <p className="text-sm theme-text-sub font-medium">
              New entity?{' '}
              <Link to={ROUTES.SIGN_UP} className="text-teal-600 dark:text-teal-400 font-black hover:underline no-underline uppercase tracking-widest ml-1 text-xs">
                Initialize Profile
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
