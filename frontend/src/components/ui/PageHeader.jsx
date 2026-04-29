/**
 * Reusable page header with title, subtitle, and optional action button.
 * Used across most dashboard sub-pages.
 */
export default function PageHeader({ title, subtitle, actionLabel, onAction }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-10">
      <div>
        <h1 className="text-3xl font-black theme-text tracking-tight uppercase">{title}</h1>
        {subtitle && <p className="theme-text-sub text-sm mt-1.5 font-medium">{subtitle}</p>}
      </div>
      {actionLabel && (
        <button onClick={onAction} className="btn-primary px-6 py-3 rounded-xl text-xs font-black uppercase tracking-widest shadow-lg shadow-teal-500/20 active:scale-95 transition-all">
          {actionLabel}
        </button>
      )}
    </div>
  );
}
