import { useState, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'

const NAV_LINKS = [
  { label: 'Home', href: '/' },
  { label: 'About', href: '/#about' },
  { label: 'Features', href: '/#features' },
]

export default function Header() {
  const [scrolled, setScrolled] = useState(false)
  const [user, setUser] = useState(null)
  const [menuOpen, setMenuOpen] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    const sync = () => {
      const stored = localStorage.getItem('medsutra_user')
      setUser(stored ? JSON.parse(stored) : null)
    }
    sync()
    window.addEventListener('storage', sync)
    return () => window.removeEventListener('storage', sync)
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('medsutra_user')
    window.dispatchEvent(new Event('storage'))
    navigate('/')
  }

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-white border-b border-gray-100 shadow-sm' : 'bg-white/80 backdrop-blur-md'
      }`}
    >
      <div className="max-w-6xl mx-auto px-6 flex items-center justify-between h-16">

        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 no-underline">
          <div className="w-8 h-8 rounded-lg bg-gray-900 flex items-center justify-center flex-shrink-0">
            <span className="text-white font-black text-xs tracking-tight">MS</span>
          </div>
          <span className="text-gray-900 font-bold text-base tracking-tight">MedSutra AI</span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-1">
          {NAV_LINKS.map(link => (
            <a
              key={link.label}
              href={link.href}
              className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 rounded-lg hover:bg-gray-100 transition-all no-underline"
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Auth */}
        <div className="hidden md:flex items-center gap-3">
          {user ? (
            <>
              <button
                onClick={() => navigate('/Dashboard')}
                className="text-sm font-medium text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-100 transition-all flex items-center gap-2"
              >
                <div className="w-6 h-6 rounded-md bg-gray-900 flex items-center justify-center text-white text-xs font-bold">
                  {user.avatar}
                </div>
                Dashboard
              </button>
              <button
                onClick={handleLogout}
                className="text-sm font-medium text-gray-500 hover:text-red-500 px-4 py-2 rounded-lg hover:bg-red-50 transition-all"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/Login" className="text-sm font-medium text-gray-600 hover:text-gray-900 px-4 py-2 rounded-lg hover:bg-gray-100 transition-all no-underline">
                Sign In
              </Link>
              <Link to="/SignUp" className="btn-primary text-sm px-5 py-2.5 rounded-lg no-underline">
                Get Started
              </Link>
            </>
          )}
        </div>

        {/* Mobile burger */}
        <button
          onClick={() => setMenuOpen(v => !v)}
          className="md:hidden p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-all"
        >
          <div className="w-5 space-y-1">
            <div className="h-0.5 bg-current rounded" />
            <div className="h-0.5 bg-current rounded" />
            <div className="h-0.5 bg-current rounded" />
          </div>
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 px-6 py-4 flex flex-col gap-1">
          {NAV_LINKS.map(link => (
            <a
              key={link.label}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              className="block py-2.5 text-sm font-medium text-gray-700 no-underline"
            >
              {link.label}
            </a>
          ))}
          <div className="pt-3 border-t border-gray-100 mt-2 flex gap-3">
            {user ? (
              <button onClick={handleLogout} className="text-sm text-red-500 font-medium">Logout</button>
            ) : (
              <>
                <Link to="/Login" onClick={() => setMenuOpen(false)} className="text-sm font-medium text-gray-700 no-underline">Sign In</Link>
                <Link to="/SignUp" onClick={() => setMenuOpen(false)} className="btn-primary text-sm px-4 py-2 rounded-lg no-underline">Get Started</Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  )
}