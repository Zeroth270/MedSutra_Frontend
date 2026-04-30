import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
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
  const { t } = useTranslation();

  return (
    <main className="theme-bg transition-colors duration-300">

      {/* Hero */}
      <section id="home" className="pt-32 pb-24 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <div className="inline-block px-4 py-1.5 rounded-full text-[10px] font-black theme-text-sub uppercase tracking-widest mb-10">
            {t('hero_badge')}
          </div>
          <h1 className="text-4xl md:text-6xl font-black theme-text leading-tight tracking-tight mb-8">
            {t('hero_title')}
          </h1>
          <p className="text-lg theme-text-sub leading-relaxed mb-12 max-w-xl mx-auto font-medium">
            {t('hero_subtitle')}
          </p>
          <div className="flex flex-wrap items-center justify-center gap-5">
            <Link
              to={ROUTES.SIGN_UP}
              className="btn-primary px-10 py-4 text-xs font-black uppercase tracking-widest rounded-xl no-underline shadow-xl shadow-teal-500/20 active:scale-95 transition-all"
            >
              {t('btn_start')}
            </Link>
            <a
              href="#features"
              className="text-xs font-black uppercase tracking-widest theme-text-sub hover:theme-text px-10 py-4 transition-all no-underline"
            >
              {t('btn_how_it_works')}
            </a>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="about" className="py-24 px-6 theme-bg border-y theme-border">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-20">
            <p className="text-[10px] font-black uppercase tracking-[0.2em] theme-text-sub mb-5">{t('section_workflow')}</p>
            <h2 className="text-3xl md:text-5xl font-black theme-text tracking-tight">
              {t('workflow_title')}
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {STEPS.map((step, i) => (
              <div key={i} className="rounded-3xl p-8 transition-all duration-300 group">
                <p className="text-4xl font-black text-gray-100 dark:text-gray-800 mb-6 group-hover:text-teal-500/20 transition-colors">{step.number}</p>
                <h3 className="font-black theme-text mb-4 text-base uppercase tracking-tight">{t(`step_${i + 1}_title`)}</h3>
                <p className="text-sm theme-text-sub leading-relaxed font-medium">{t(`step_${i + 1}_desc`)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-20">
            <p className="text-[10px] font-black uppercase tracking-[0.2em] theme-text-sub mb-5">{t('section_features')}</p>
            <h2 className="text-3xl md:text-5xl font-black theme-text tracking-tight mb-6">
              {t('features_title')}
            </h2>
            <p className="theme-text-sub max-w-2xl mx-auto leading-relaxed font-medium text-lg">
              {t('features_subtitle')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {FEATURES.map((f, i) => (
              <div
                key={i}
                className="card-hover rounded-3xl p-10 transition-all duration-300 group"
              >
                <div className="w-10 h-10 rounded-xl bg-gray-900 dark:bg-teal-600 flex items-center justify-center mb-8 flex-shrink-0 shadow-lg">
                  <span className="text-white text-xs font-black">{String(i + 1).padStart(2, '0')}</span>
                </div>
                <h3 className="text-xl font-black theme-text mb-4 group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors uppercase tracking-tight">{t(`feat_${i + 1}_title`)}</h3>
                <p className="theme-text-sub leading-relaxed text-base font-medium">{t(`feat_${i + 1}_desc`)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      {/*<section className="py-24 px-6 bg-gray-900">
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
      </section>*/}
    </main>
  );
}
