import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

const navLinks = [
  { label: 'Home', to: '/' },
  { label: 'Topics', to: '/#topics' },
  { label: 'Blog', to: '/blog' },
  { label: 'Community', to: '/#community' },
  { label: 'Hall of Fame', to: '/#hall-of-fame' },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const { user, loginWithGoogle, logout } = useAuth()
  const location = useLocation()

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handler)
    return () => window.removeEventListener('scroll', handler)
  }, [])

  useEffect(() => setMobileOpen(false), [location])

  const handleNavClick = (to) => {
    if (to.startsWith('/#')) {
      const id = to.replace('/#', '')
      if (location.pathname !== '/') {
        window.location.href = to
      } else {
        document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
      }
    }
  }

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? 'bg-canvas/95 backdrop-blur-md shadow-[0_1px_0_0_#e8ebe6]'
            : 'bg-canvas'
        }`}
      >
        <div className="container-width flex items-center justify-between px-6 py-3">
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center gap-2.5 shrink-0"
            title="CodeCircle (Code Circle) — CodeCircle.online"
            aria-label="CodeCircle Home"
          >
            <div className="w-8 h-8 rounded-wise-md bg-primary flex items-center justify-center">
              <span className="font-display text-sm font-black text-on-primary">CC</span>
            </div>
            <span className="font-bold text-ink text-sm tracking-tight hidden sm:block">
              CodeCircle
            </span>
          </Link>

          {/* Desktop links */}
          <ul className="hidden md:flex items-center gap-1">
            {navLinks.map(({ label, to }) => (
              <li key={label}>
                {to.startsWith('/#') ? (
                  <button
                    onClick={() => handleNavClick(to)}
                    className="px-3 py-1.5 text-sm font-semibold text-body hover:text-ink rounded-wise-xl hover:bg-canvas-soft transition-all"
                  >
                    {label}
                  </button>
                ) : (
                  <Link
                    to={to}
                    className={`px-3 py-1.5 text-sm font-semibold rounded-wise-xl hover:bg-canvas-soft transition-all ${
                      location.pathname === to ? 'text-ink' : 'text-body hover:text-ink'
                    }`}
                  >
                    {label}
                  </Link>
                )}
              </li>
            ))}
            {user && (
              <li>
                <Link
                  to="/dashboard"
                  className={`px-3 py-1.5 text-sm font-semibold rounded-wise-xl hover:bg-canvas-soft transition-all ${
                    location.pathname === '/dashboard' ? 'text-ink' : 'text-body hover:text-ink'
                  }`}
                >
                  Dashboard
                </Link>
              </li>
            )}
            {user?.isAdmin && (
              <li>
                <Link to="/admin" className="px-3 py-1.5 text-sm font-semibold text-body hover:text-ink rounded-wise-xl hover:bg-canvas-soft transition-all">
                  Admin
                </Link>
              </li>
            )}
          </ul>

          {/* Auth */}
          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <div className="flex items-center gap-3">
                <img src={user.avatar} alt={user.name} className="w-7 h-7 rounded-full ring-2 ring-canvas-soft" />
                <span className="text-sm font-semibold text-ink">{user.name.split(' ')[0]}</span>
                <button onClick={logout} className="text-xs font-semibold text-mute hover:text-ink transition-colors">
                  Sign out
                </button>
              </div>
            ) : (
              <button
                onClick={() => loginWithGoogle('/dashboard')}
                className="btn-primary text-sm py-2 px-5"
              >
                <GoogleIcon />
                Sign in
              </button>
            )}
          </div>

          {/* Mobile toggle */}
          <button
            onClick={() => setMobileOpen(v => !v)}
            className="md:hidden p-2 text-body hover:text-ink rounded-wise-xl hover:bg-canvas-soft transition-colors"
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="fixed top-14 left-0 right-0 z-40 bg-canvas border-b border-canvas-soft px-6 pb-4 shadow-lg"
          >
            <ul className="flex flex-col gap-1 pt-2">
              {navLinks.map(({ label, to }) => (
                <li key={label}>
                  {to.startsWith('/#') ? (
                    <button
                      onClick={() => { handleNavClick(to); setMobileOpen(false) }}
                      className="w-full text-left px-4 py-3 text-sm font-semibold text-body hover:text-ink rounded-wise-xl hover:bg-canvas-soft transition-all"
                    >
                      {label}
                    </button>
                  ) : (
                    <Link
                      to={to}
                      className="block px-4 py-3 text-sm font-semibold text-body hover:text-ink rounded-wise-xl hover:bg-canvas-soft transition-all"
                    >
                      {label}
                    </Link>
                  )}
                </li>
              ))}
              {user && (
                <li>
                  <Link
                    to="/dashboard"
                    className="block px-4 py-3 text-sm font-semibold text-body hover:text-ink rounded-wise-xl hover:bg-canvas-soft transition-all"
                  >
                    Dashboard
                  </Link>
                </li>
              )}
              {user?.isAdmin && (
                <li>
                  <Link
                    to="/admin"
                    className="block px-4 py-3 text-sm font-semibold text-body hover:text-ink rounded-wise-xl hover:bg-canvas-soft transition-all"
                  >
                    Admin
                  </Link>
                </li>
              )}
            </ul>
            <div className="mt-3 pt-3 border-t border-canvas-soft">
              {user ? (
                <div className="flex items-center justify-between px-4 py-2">
                  <div className="flex items-center gap-2">
                    <img src={user.avatar} alt={user.name} className="w-6 h-6 rounded-full" />
                    <span className="text-sm font-semibold text-ink">{user.name}</span>
                  </div>
                  <button onClick={logout} className="text-xs font-semibold text-mute hover:text-ink transition-colors">Sign out</button>
                </div>
              ) : (
                <button onClick={() => loginWithGoogle('/dashboard')} className="btn-primary w-full justify-center text-sm">
                  <GoogleIcon />
                  Sign in with Google
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

function GoogleIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24">
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
    </svg>
  )
}
