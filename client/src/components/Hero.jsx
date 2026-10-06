import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ArrowRight, Github } from 'lucide-react'

export default function Hero() {
  return (
    <section className="bg-canvas-soft pt-24 md:pt-32 pb-16 md:pb-24">
      <div className="container-width px-6">
        {/* Announcement banner */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8 flex flex-wrap items-center gap-2 px-4 py-2 bg-canvas rounded-wise-pill text-sm text-body w-fit border border-canvas-soft shadow-sm"
        >
          <span className="w-2 h-2 rounded-full bg-positive" />
          <span className="font-bold text-ink">CodeCircle.online</span>
          <span className="text-mute">·</span>
          <span>Open source student tech community</span>
          <a
            href="https://github.com/codecircle-online"
            target="_blank"
            rel="noreferrer"
            className="ml-1 text-ink hover:text-primary-deep font-semibold transition-colors flex items-center gap-1"
          >
            <Github size={14} />
            GitHub
          </a>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left — headline */}
          <div>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="heading-mega"
              style={{ fontSize: 'clamp(2.5rem, 6.5vw, 4.75rem)' }}
            >
              CodeCircle
              <br />
              <span className="text-body font-bold block mt-1" style={{ fontSize: 'clamp(1.75rem, 4vw, 3rem)' }}>
                Student Tech Community
              </span>
              <span className="text-mute font-medium block" style={{ fontSize: 'clamp(1.25rem, 2.5vw, 1.85rem)' }}>
                For Students, By Students
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35, duration: 0.6 }}
              className="mt-6 text-body max-w-lg leading-relaxed"
              style={{ fontSize: 'clamp(0.95rem, 2vw, 1.125rem)' }}
            >
              Welcome to <strong>CodeCircle</strong> (<strong>Code Circle</strong>) at <strong>CodeCircle.online</strong> — the open tech community empowering students worldwide. We curate the latest trending tech updates, student internship alerts, AI/ML tutorials, Linux guides, cybersecurity practices, and open source projects.
            </motion.p>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.5 }}
              className="mt-8 flex flex-wrap items-center gap-3"
            >
              <a
                href="https://chat.whatsapp.com/G9coEcncT13EjxeVbk2xAE"
                target="_blank"
                rel="noreferrer"
                className="btn-primary"
              >
                Join WhatsApp
              </a>
              <a
                href="https://discord.gg/XYUAKXET"
                target="_blank"
                rel="noreferrer"
                className="btn-secondary"
              >
                Join Discord
              </a>
              <Link
                to="/blog"
                className="btn-ghost group"
              >
                Read Blog
                <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
              </Link>
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
              className="mt-12 flex items-center gap-8"
            >
              {[
                { value: '2k+', label: 'Members' },
                { value: '8', label: 'Topics' },
                { value: '100%', label: 'Free' },
              ].map(({ value, label }) => (
                <div key={label}>
                  <div className="text-2xl font-black text-ink">{value}</div>
                  <div className="text-xs font-semibold text-mute mt-0.5 uppercase tracking-wider">{label}</div>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Right — feature card */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="card-base shadow-xl"
          >
            <div className="text-xs font-semibold text-mute uppercase tracking-wider mb-4">What you get</div>
            <div className="space-y-4">
              {[
                { emoji: '📡', title: 'Trending Tech Updates', desc: 'Stay current with the latest in tech, AI, and developer tools.' },
                { emoji: '💼', title: 'Internship Opportunities', desc: 'Curated job drops and hackathon alerts from top companies.' },
                { emoji: '🔐', title: 'Cybersecurity & Linux', desc: 'CTF writeups, system administration, and ethical hacking resources.' },
                { emoji: '🌍', title: 'Open Source Projects', desc: 'Find good first issues and collaborate with developers globally.' },
              ].map(item => (
                <div key={item.title} className="flex gap-4 p-4 rounded-wise-lg bg-canvas-soft hover:bg-primary-pale transition-colors group">
                  <span className="text-2xl shrink-0">{item.emoji}</span>
                  <div>
                    <div className="font-semibold text-ink text-sm">{item.title}</div>
                    <div className="text-sm text-body mt-0.5">{item.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
