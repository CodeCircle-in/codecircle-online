import { motion } from 'framer-motion'
import { useAuth } from '../context/AuthContext'
import { ArrowRight } from 'lucide-react'

export default function JoinSection() {
  const { user, loginWithGoogle } = useAuth()

  return (
    <section className="section-padding bg-canvas border-t border-canvas-soft">
      <div className="container-width">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="bg-ink rounded-wise-xl p-10 md:p-16 text-center text-canvas relative overflow-hidden"
        >
          <p className="inline-block text-xs font-semibold uppercase tracking-[0.2em] text-primary mb-4 bg-ink-deep/60 px-4 py-1.5 rounded-wise-pill border border-primary/20">
            Open to all student builders
          </p>
          <h2 className="heading-xl text-primary mb-4 max-w-2xl mx-auto">
            Be a part of CodeCircle (Code Circle).
          </h2>
          <p className="text-canvas-soft max-w-xl mx-auto mb-10 text-base md:text-lg leading-relaxed">
            Join the <strong>CodeCircle.online</strong> community. Sign in with Google to start sharing verified tech resources, earning contributor badges, and growing alongside student developers worldwide.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4">
            {user ? (
              <div className="flex flex-wrap items-center justify-center gap-4">
                <div className="flex items-center gap-3 bg-white/10 px-4 py-2 rounded-wise-pill">
                  <img src={user.avatar} alt={user.name} className="w-8 h-8 rounded-full border border-primary" />
                  <span className="text-canvas font-medium text-sm">Welcome, {user.name.split(' ')[0]}</span>
                </div>
                <a href="/submit-resource" className="btn-primary">
                  <span>Post a Resource</span>
                  <ArrowRight size={14} />
                </a>
              </div>
            ) : (
              <>
                <button
                  onClick={() => loginWithGoogle('/dashboard')}
                  className="btn-primary flex items-center gap-2.5"
                >
                  <GoogleIcon />
                  <span>Sign in with Google</span>
                </button>
                <a
                  href="https://chat.whatsapp.com/G9coEcncT13EjxeVbk2xAE"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-white/10 text-canvas text-base font-semibold rounded-wise-xl hover:bg-white/20 transition-colors"
                >
                  Join WhatsApp
                </a>
                <a
                  href="https://discord.gg/XYUAKXET"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3 text-canvas-soft text-base font-semibold rounded-wise-xl hover:text-white transition-colors"
                >
                  Join Discord
                </a>
              </>
            )}
          </div>

          <p className="mt-8 text-xs text-mute">
            Free forever · No credit card required · Student-run open source community
          </p>
        </motion.div>
      </div>
    </section>
  )
}

function GoogleIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24">
      <path fill="#0e0f0c" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
      <path fill="#0e0f0c" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
      <path fill="#0e0f0c" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
      <path fill="#0e0f0c" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
    </svg>
  )
}
