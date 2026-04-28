import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';

export default function Login() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      const username = form.email.split('@')[0];
      localStorage.setItem('medsutra_user', JSON.stringify({
        name: username.charAt(0).toUpperCase() + username.slice(1),
        email: form.email,
        role: 'Patient',
        joined: new Date().toLocaleDateString('en-IN', { month: 'long', year: 'numeric' }),
        avatar: username.charAt(0).toUpperCase(),
      }));
      window.dispatchEvent(new Event('storage'));
      navigate('/Dashboard');
    }, 900);
  };

  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2">

      {/* Left panel */}
      <div className="hidden lg:flex flex-col justify-between bg-gray-900 p-14">
        <Link to="/" className="flex items-center gap-2 no-underline">
          <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center flex-shrink-0">
            <span className="text-gray-900 font-black text-xs">MS</span>
          </div>
          <span className="text-white font-bold text-base">MedSutra AI</span>
        </Link>

        <div>
          <h2 className="text-3xl font-black text-white leading-snug mb-5">
            Welcome back.<br />
            Your health journey<br />
            continues here.
          </h2>
          <p className="text-gray-400 text-sm leading-relaxed max-w-xs">
            MedSutra AI helps 50,000+ patients manage medications safely with smart reminders and AI verification.
          </p>

          <div className="mt-10 grid grid-cols-3 gap-4">
            {[
              { val: '94%', label: 'Adherence' },
              { val: '50K+', label: 'Patients' },
              { val: '2M+', label: 'Doses Tracked' },
            ].map(s => (
              <div key={s.val} className="bg-white/5 rounded-xl p-4 border border-white/10">
                <p className="text-white font-black text-xl mb-1">{s.val}</p>
                <p className="text-gray-500 text-xs">{s.label}</p>
              </div>
            ))}
          </div>
        </div>

        <p className="text-gray-700 text-xs">
          © {new Date().getFullYear()} MedSutra AI. All rights reserved.
        </p>
      </div>

      {/* Right — Form */}
      <div className="flex items-center justify-center px-6 py-16 bg-gray-50">
        <div className="w-full max-w-sm">

          {/* Mobile logo */}
          <Link to="/" className="lg:hidden flex items-center gap-2 no-underline mb-10">
            <div className="w-7 h-7 rounded-md bg-gray-900 flex items-center justify-center">
              <span className="text-white font-black text-xs">MS</span>
            </div>
            <span className="font-bold text-gray-900">MedSutra AI</span>
          </Link>

          <h1 className="text-2xl font-black text-gray-900 mb-2">Sign in</h1>
          <p className="text-gray-500 text-sm mb-8">Enter your credentials to access your account</p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Email address</label>
              <input
                type="email"
                placeholder="you@example.com"
                required
                value={form.email}
                onChange={e => setForm({ ...form, email: e.target.value })}
                className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-gray-400 focus:ring-2 focus:ring-gray-200 transition-all"
              />
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-sm font-semibold text-gray-700">Password</label>
                <a href="#" className="text-xs text-gray-500 hover:text-gray-800 no-underline transition-colors">
                  Forgot password?
                </a>
              </div>
              <input
                type="password"
                placeholder="••••••••"
                required
                value={form.password}
                onChange={e => setForm({ ...form, password: e.target.value })}
                className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-gray-400 focus:ring-2 focus:ring-gray-200 transition-all"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full py-3 rounded-xl text-sm gap-2"
            >
              {loading
                ? <span className="flex items-center justify-center gap-2">
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Signing in...
                  </span>
                : 'Sign in'
              }
            </button>
          </form>

          <p className="text-sm text-gray-500 text-center mt-7">
            Don't have an account?{' '}
            <Link to="/SignUp" className="text-gray-900 font-semibold hover:underline no-underline">
              Sign up for free
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
