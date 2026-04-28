/**
 * Reusable loading spinner.
 * @param {string} size - Tailwind size class (default: 'w-4 h-4')
 */
export default function Spinner({ size = 'w-4 h-4' }) {
  return (
    <span
      className={`${size} border-2 border-white/30 border-t-white rounded-full animate-spin inline-block`}
    />
  );
}
