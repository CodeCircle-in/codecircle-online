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
      <div className="fixed top-4 left-0 right-0 z-50 flex justify-center px-4">
        <motion.nav
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
          className={`w-full max-w-4xl rounded-2xl transition-all duration-300 ${
            scrolled
              ? 'glass-strong shadow-[0_8px_32px_rgba(0,0,0,0.4)]'
              : 'glass'
          }`}
        >
          <div className="flex items-center justify-between px-5 py-3">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2.5 shrink-0">
              <div className="w-7 h-7 rounded-lg bg-white/10 border border-white/20 flex items-center justify-center">
                <span className="font-mono text-xs font-bold text-white">CC</span>
              </div>
              <span className="font-medium text-white text-sm tracking-tight hidden sm:block">
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
                      className="px-3 py-1.5 text-sm text-neutral-400 hover:text-white rounded-lg hover:bg-white/5 transition-all"
                    >
                      {label}
                    </button>
                  ) : (
                    <Link
                      to={to}
                      className={`px-3 py-1.5 text-sm rounded-lg hover:bg-white/5 transition-all ${
                        location.pathname === to ? 'text-white' : 'text-neutral-400 hover:text-white'
                      }`}
                    >
                      {label}
                    </Link>
                  )}
                </li>
              ))}
              {user?.isAdmin && (
                <li>
                  <Link to="/admin" className="px-3 py-1.5 text-sm text-neutral-400 hover:text-white rounded-lg hover:bg-white/5 transition-all">
                    Admin
                  </Link>
                </li>
              )}
            </ul>

            {/* Auth */}
            <div className="hidden md:flex items-center gap-2">
              {user ? (
                <div className="flex items-center gap-3">
                  <img src={user.avatar} alt={user.name} className="w-7 h-7 rounded-full border border-white/20" />
                  <span className="text-sm text-neutral-300">{user.name.split(' ')[0]}</span>
                  <button onClick={logout} className="text-xs text-neutral-500 hover:text-white transition-colors">
                    Sign out
                  </button>
                </div>
              ) : (
                <button
                  onClick={loginWithGoogle}
                  className="flex items-center gap-2 px-4 py-2 bg-white text-black text-xs font-medium rounded-xl hover:bg-neutral-100 transition-colors"
                >
                  <GoogleIcon />
                  Sign in
                </button>
              )}
            </div>

            {/* Mobile toggle */}
            <button
              onClick={() => setMobileOpen(v => !v)}
              className="md:hidden p-2 text-neutral-400 hover:text-white rounded-lg hover:bg-white/5 transition-colors"
            >
              {mobileOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </motion.nav>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="fixed top-20 left-4 right-4 z-40 glass-strong rounded-2xl p-4"
          >
            <ul className="flex flex-col gap-1">
              {navLinks.map(({ label, to }) => (
                <li key={label}>
                  {to.startsWith('/#') ? (
                    <button
                      onClick={() => { handleNavClick(to); setMobileOpen(false) }}
                      className="w-full text-left px-4 py-3 text-sm text-neutral-300 hover:text-white rounded-xl hover:bg-white/5 transition-all"
                    >
                      {label}
                    </button>
                  ) : (
                    <Link
                      to={to}
                      className="block px-4 py-3 text-sm text-neutral-300 hover:text-white rounded-xl hover:bg-white/5 transition-all"
                    >
                      {label}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
            <div className="mt-3 pt-3 border-t border-white/8">
              {user ? (
                <div className="flex items-center justify-between px-4 py-2">
                  <div className="flex items-center gap-2">
                    <img src={user.avatar} alt={user.name} className="w-6 h-6 rounded-full" />
                    <span className="text-sm text-neutral-300">{user.name}</span>
                  </div>
                  <button onClick={logout} className="text-xs text-neutral-500 hover:text-white transition-colors">Sign out</button>
                </div>
              ) : (
                <button onClick={loginWithGoogle} className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-white text-black text-sm font-medium rounded-xl hover:bg-neutral-100 transition-colors">
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
