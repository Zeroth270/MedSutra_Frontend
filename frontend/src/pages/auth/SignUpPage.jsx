import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import useAuth from '../../hooks/useAuth';
import authService from '../../services/authService';
import Spinner from '../../components/ui/Spinner';
import ROUTES from '../../constants/routes';

export default function SignUpPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const userData = await authService.register(form.name, form.email, form.password);
      login(userData);
      navigate(ROUTES.DASHBOARD);
    } catch (err) {
      console.error('Registration failed:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2">

      {/* Left panel */}
      <div className="hidden lg:flex flex-col justify-between bg-gray-900 p-14">
        <Link to={ROUTES.HOME} className="flex items-center gap-2 no-underline">
          <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center flex-shrink-0">
            <span className="text-gray-900 font-black text-xs">MS</span>
          </div>
          <span className="text-white font-bold text-base">MedSutra AI</span>
        </Link>

        <div>
          <h2 className="text-3xl font-black text-white leading-snug mb-5">
            Your medication<br />
            management starts<br />
            <span className="text-gray-400">right here.</span>
          </h2>
          <p className="text-gray-400 text-sm leading-relaxed max-w-xs">
            Set up your full medication schedule in minutes. Let AI handle the reminders, verification, and insights.
          </p>

          <div className="mt-10 space-y-3">
            {[
              'AI-powered medication verification',
              'Smart adaptive reminders',
              'Real-time caregiver alerts',
              'HIPAA-compliant and secure',
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-white flex-shrink-0" />
                <span className="text-gray-400 text-sm">{item}</span>
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
          <Link to={ROUTES.HOME} className="lg:hidden flex items-center gap-2 no-underline mb-10">
            <div className="w-7 h-7 rounded-md bg-gray-900 flex items-center justify-center">
              <span className="text-white font-black text-xs">MS</span>
            </div>
            <span className="font-bold text-gray-900">MedSutra AI</span>
          </Link>

          <h1 className="text-2xl font-black text-gray-900 mb-2">Create account</h1>
          <p className="text-gray-500 text-sm mb-8">Start your intelligent medication journey today</p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Full Name</label>
              <input
                type="text"
                placeholder="John Doe"
                required
                value={form.name}
                onChange={e => setForm({ ...form, name: e.target.value })}
                className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-gray-400 focus:ring-2 focus:ring-gray-200 transition-all"
              />
            </div>

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
              <label className="block text-sm font-semibold text-gray-700 mb-2">Password</label>
              <input
                type="password"
                placeholder="Create a strong password"
                required
                value={form.password}
                onChange={e => setForm({ ...form, password: e.target.value })}
                className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-gray-400 focus:ring-2 focus:ring-gray-200 transition-all"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full py-3 rounded-xl text-sm"
            >
              {loading
                ? <span className="flex items-center justify-center gap-2">
                    <Spinner />
                    Creating account...
                  </span>
                : 'Create Account'
              }
            </button>
          </form>

          <p className="text-xs text-gray-400 text-center mt-5 leading-relaxed">
            By creating an account you agree to our{' '}
            <a href="#" className="text-gray-600 hover:underline">Terms</a> and{' '}
            <a href="#" className="text-gray-600 hover:underline">Privacy Policy</a>.
          </p>

          <p className="text-sm text-gray-500 text-center mt-6">
            Already have an account?{' '}
            <Link to={ROUTES.LOGIN} className="text-gray-900 font-semibold hover:underline no-underline">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
