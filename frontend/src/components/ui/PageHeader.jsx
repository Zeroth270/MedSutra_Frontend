/**
 * Reusable page header with title, subtitle, and optional action button.
 * Used across most dashboard sub-pages.
 */
export default function PageHeader({ title, subtitle, actionLabel, onAction }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
      <div>
        <h1 className="text-2xl font-black text-gray-900 tracking-tight">{title}</h1>
        {subtitle && <p className="text-gray-500 text-sm mt-1">{subtitle}</p>}
      </div>
      {actionLabel && (
        <button onClick={onAction} className="btn-primary px-5 py-2.5 rounded-lg text-sm">
          {actionLabel}
        </button>
      )}
    </div>
  );
}
