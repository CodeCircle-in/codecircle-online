import { motion } from 'framer-motion'
import { useAuth } from '../context/AuthContext'
import { ArrowRight } from 'lucide-react'

export default function JoinSection() {
  const { user, loginWithGoogle } = useAuth()

  return (
    <section className="section-padding border-t border-white/8">
      <div className="container-width">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="glass rounded-3xl p-12 md:p-16 text-center"
        >
          <p className="label-text mb-6">Open to all students</p>
          <h2 className="heading-lg text-white mb-4 max-w-xl mx-auto">
            Be a part of CodeCircle
          </h2>
          <p className="body-muted max-w-md mx-auto mb-10">
            Sign up with Google to start contributing — share resources, post opportunities,
            and help your fellow students grow.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4">
            {user ? (
              <div className="flex items-center gap-3">
                <img src={user.avatar} alt={user.name} className="w-8 h-8 rounded-full border border-white/20" />
                <span className="text-neutral-300">Welcome, {user.name.split(' ')[0]}</span>
                <ArrowRight size={14} className="text-neutral-600" />
                <a href="/submit-resource" className="btn-primary">Post a Resource</a>
              </div>
            ) : (
              <>
                <button onClick={() => loginWithGoogle('/dashboard')} className="btn-primary flex items-center gap-2">
                  <GoogleIcon />
                  Sign in with Google
                </button>
                <a
                  href="https://chat.whatsapp.com/G9coEcncT13EjxeVbk2xAE"
                  target="_blank"
                  rel="noreferrer"
                  className="btn-secondary"
                >
                  Join WhatsApp
                </a>
                <a
                  href="https://discord.gg/XYUAKXET"
                  target="_blank"
                  rel="noreferrer"
                  className="btn-ghost"
                >
                  Join Discord
                </a>
              </>
            )}
          </div>

          <p className="mt-8 text-xs text-neutral-700">
            Free forever · No credit card · Student-run open source project
          </p>
        </motion.div>
      </div>
    </section>
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
