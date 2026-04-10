import { useRef } from 'react'
import { useScroll, useTransform, motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ArrowRight, Github } from 'lucide-react'
import { GoogleGeminiEffect } from './ui/google-gemini-effect'

export default function Hero() {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })

  const p1 = useTransform(scrollYProgress, [0, 0.8], [0.2, 1.2])
  const p2 = useTransform(scrollYProgress, [0, 0.8], [0.15, 1.2])
  const p3 = useTransform(scrollYProgress, [0, 0.8], [0.1, 1.2])
  const p4 = useTransform(scrollYProgress, [0, 0.8], [0.05, 1.2])
  const p5 = useTransform(scrollYProgress, [0, 0.8], [0, 1.2])

  return (
    <section
      ref={ref}
      className="relative h-[300vh] bg-surface-0 w-full overflow-clip"
    >
      {/* Radial glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-blue-900/10 blur-[120px]" />
      </div>

      {/* Sticky content */}
      <div className="sticky top-0 h-screen flex flex-col items-center justify-center px-6 overflow-hidden">
        {/* Announcement banner */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8 flex items-center gap-2 px-4 py-1.5 glass rounded-full text-xs text-neutral-400"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse-slow" />
          Open source · Student community · Free to join
          <a
            href="https://github.com/codecircle-online"
            target="_blank"
            rel="noreferrer"
            className="ml-1 text-neutral-300 hover:text-white transition-colors flex items-center gap-1"
          >
            <Github size={12} />
            GitHub
          </a>
        </motion.div>

        {/* Main heading */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.7 }}
          className="text-center font-light tracking-tight text-white"
          style={{ fontSize: 'clamp(2.5rem, 7vw, 5.5rem)', lineHeight: 1.1 }}
        >
          A Student Community
          <br />
          <span className="text-neutral-400">For Students, By Students</span>
        </motion.h1>

        {/* Subheading */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35, duration: 0.7 }}
          className="mt-6 text-center text-neutral-500 max-w-lg mx-auto leading-relaxed"
          style={{ fontSize: 'clamp(0.9rem, 2vw, 1.1rem)' }}
        >
          We share trending tech updates, internship opportunities, AI resources,
          Linux guides, Cybersecurity, Open Source, and more — all curated by students, for students.
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="mt-10 flex flex-wrap items-center justify-center gap-3"
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

        {/* Stats row */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="mt-16 flex items-center gap-8 text-center"
        >
          {[
            { value: '2k+', label: 'Members' },
            { value: '8', label: 'Topics' },
            { value: '100%', label: 'Free' },
          ].map(({ value, label }) => (
            <div key={label}>
              <div className="text-2xl font-light text-white">{value}</div>
              <div className="text-xs text-neutral-600 mt-0.5 font-mono uppercase tracking-widest">{label}</div>
            </div>
          ))}
        </motion.div>

        {/* Gemini effect — behind content */}
        <div className="absolute inset-0 pointer-events-none">
          <GoogleGeminiEffect pathLengths={[p1, p2, p3, p4, p5]} />
        </div>
      </div>
    </section>
  )
}
