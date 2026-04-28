export default function Footer() {
  return (
    <footer className="bg-gray-950 pt-16 pb-10">
      <div className="max-w-6xl mx-auto px-6">
        <div className="pt-8 border-t border-gray-800 flex flex-col sm:flex-row justify-between items-center gap-3">
          <p className="text-xs text-gray-600">© {new Date().getFullYear()} MedSutra AI. All rights reserved.</p>
          <p className="text-xs text-gray-600">Made with care for patients worldwide</p>
        </div>
      </div>
    </footer>
  );
}
