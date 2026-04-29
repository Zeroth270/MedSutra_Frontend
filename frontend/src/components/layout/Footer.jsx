export default function Footer() {
  return (
    <footer className="theme-surface border-t theme-border pt-16 pb-10">
      <div className="max-w-6xl mx-auto px-6 text-center">
        <p className="text-xs theme-text-sub">© {new Date().getFullYear()} MedSutra AI. All rights reserved.</p>
        <p className="text-[10px] theme-text-sub uppercase tracking-widest font-bold mt-2">Intelligent Medication Management</p>
      </div>
    </footer>
  );
}
