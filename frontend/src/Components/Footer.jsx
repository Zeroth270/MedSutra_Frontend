import { Link } from 'react-router-dom'

const LINKS = {
  Product: ['Dashboard', 'Medications', 'AI Verification', 'Risk Reports', 'Reminders'],
  Company: ['About Us', 'Blog', 'Careers', 'Contact'],
  Legal: ['Privacy Policy', 'Terms of Service', 'HIPAA Compliance'],
}

export default function Footer() {
  return (
    <footer className="bg-gray-950 pt-16 pb-10">
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">

          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center flex-shrink-0">
                <span className="text-gray-900 font-black text-xs">MS</span>
              </div>
              <span className="text-white font-bold text-base">MedSutra AI</span>
            </div>
            <p className="text-sm text-gray-500 leading-relaxed">
              Empowering every dose with intelligence and real-time assurance. Your trusted medication companion.
            </p>
          </div>

          {/* Links */}
          {Object.entries(LINKS).map(([title, items]) => (
            <div key={title}>
              <h3 className="text-white font-semibold text-sm mb-5">{title}</h3>
              <ul className="space-y-3">
                {items.map(item => (
                  <li key={item}>
                    <a href="#" className="text-sm text-gray-500 hover:text-gray-300 transition-colors no-underline">
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom */}
        <div className="pt-8 border-t border-gray-800 flex flex-col sm:flex-row justify-between items-center gap-3">
          <p className="text-xs text-gray-600">
            © {new Date().getFullYear()} MedSutra AI. All rights reserved.
          </p>
          <p className="text-xs text-gray-600">
            Made with care for patients worldwide
          </p>
        </div>
      </div>
    </footer>
  )
}
