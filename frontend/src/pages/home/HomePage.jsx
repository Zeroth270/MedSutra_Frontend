import { Link } from 'react-router-dom';
import ROUTES from '../../constants/routes';

const FEATURES = [
  {
    title: 'Smart Reminders',
    desc: 'Receive adaptive notifications and alerts tailored to your schedule. Never miss a dose with intelligent snooze and rescheduling options.',
  },
  {
    title: 'AI Medication Verification',
    desc: 'Photograph your medication to verify it matches your prescription. Our AI Vision model catches errors before they reach you.',
  },
  {
    title: 'Adherence Risk Prediction',
    desc: 'AI analyzes your medication history to predict non-adherence risk and delivers personalized recommendations to keep you on track.',
  },
  {
    title: 'Caregiver Access',
    desc: 'Share your real-time adherence data with family members or physicians. Critical alerts notify caregivers when doses are repeatedly missed.',
  },
];

const STEPS = [
  { number: '01', title: 'Create your profile', desc: 'Sign up and enter your medications, dosages, and daily schedule in minutes.' },
  { number: '02', title: 'Set your reminders', desc: 'Configure smart alerts. Our AI personalizes timing based on your daily routine.' },
  { number: '03', title: 'Verify each dose', desc: 'Use AI Vision to scan and confirm every medication matches your prescription.' },
  { number: '04', title: 'Track your progress', desc: 'View weekly adherence reports and AI-generated insights for better outcomes.' },
];

export default function HomePage() {
  return (
    <main className="bg-white">

      {/* Hero */}
      <section id="home" className="pt-32 pb-24 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <div className="inline-block px-3 py-1 bg-gray-100 rounded-full text-xs font-semibold text-gray-600 tracking-wide mb-8">
            AI-Powered Medication Management
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-gray-900 leading-tight tracking-tight mb-6">
            Manage your medications<br />with confidence and clarity
          </h1>
          <p className="text-lg text-gray-500 leading-relaxed mb-10 max-w-xl mx-auto">
            MedSutra AI helps patients stay on track with smart reminders, AI verification, and real-time caregiver alerts — all in one place.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link
              to={ROUTES.SIGN_UP}
              className="btn-primary px-8 py-3.5 text-sm rounded-xl no-underline"
            >
              Start for Free
            </Link>
            <a
              href="#features"
              className="text-sm font-medium text-gray-600 hover:text-gray-900 px-8 py-3.5 border border-gray-200 rounded-xl hover:border-gray-300 transition-all no-underline bg-white"
            >
              See how it works
            </a>
          </div>
          <p className="text-xs text-gray-400 mt-6">
            No credit card required &nbsp;·&nbsp; HIPAA compliant &nbsp;·&nbsp; Free forever plan
          </p>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-4">Features</p>
            <h2 className="text-3xl md:text-4xl font-black text-gray-900 tracking-tight mb-4">
              Everything you need to stay on track
            </h2>
            <p className="text-gray-500 max-w-xl mx-auto leading-relaxed">
              A complete platform designed to eliminate medication errors and bring peace of mind to patients and caregivers alike.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {FEATURES.map((f, i) => (
              <div
                key={i}
                className="card-hover bg-white border border-gray-100 rounded-2xl p-8"
              >
                <div className="w-8 h-8 rounded-lg bg-gray-900 flex items-center justify-center mb-5 flex-shrink-0">
                  <span className="text-white text-xs font-black">{String(i + 1).padStart(2, '0')}</span>
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-3">{f.title}</h3>
                <p className="text-gray-500 leading-relaxed text-sm">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="about" className="py-24 px-6 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-4">How It Works</p>
            <h2 className="text-3xl md:text-4xl font-black text-gray-900 tracking-tight">
              Up and running in minutes
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {STEPS.map((step, i) => (
              <div key={i} className="bg-white border border-gray-100 rounded-2xl p-7">
                <p className="text-3xl font-black text-gray-200 mb-4">{step.number}</p>
                <h3 className="font-bold text-gray-900 mb-3 text-base">{step.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-6 bg-gray-900">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-black text-white mb-5 tracking-tight">
            Start managing your medications the smart way
          </h2>
          <p className="text-gray-400 text-base mb-10 leading-relaxed">
            Join thousands of patients who trust MedSutra AI to keep them safe, informed, and adherent.
          </p>
          <Link
            to={ROUTES.SIGN_UP}
            className="inline-block bg-white text-gray-900 font-bold px-10 py-4 rounded-xl text-sm hover:bg-gray-100 transition-all no-underline"
          >
            Create a Free Account
          </Link>
          <p className="text-gray-600 text-xs mt-5">No credit card required · Cancel anytime</p>
        </div>
      </section>
    </main>
  );
}
