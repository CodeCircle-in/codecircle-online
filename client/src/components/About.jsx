import { motion } from 'framer-motion'

const pillars = [
  {
    title: 'Learn Together',
    description:
      'Collaborate with fellow students, share knowledge, and explore trending technologies through curated resources and real discussions.',
  },
  {
    title: 'Share Opportunities',
    description:
      'Get instant updates on internships, hackathons, and job opportunities tailored for students and early-career developers.',
  },
  {
    title: 'Grow as a Developer',
    description:
      'Build real projects, participate in events, and develop skills that matter in the tech industry through hands-on experience.',
  },
]

export default function About() {
  return (
    <section id="about" className="section-padding border-t border-white/8">
      <div className="container-width">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          {/* Left */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <p className="label-text mb-4">About</p>
            <h2 className="heading-lg text-white mb-6">
              Built by students,
              <br />
              <span className="text-neutral-500">for students</span>
            </h2>
            <p className="body-muted mb-4">
              CodeCircle is a vibrant open student community dedicated to empowering future developers
              and tech enthusiasts. We exist to bridge the gap between learning and real-world
              opportunities.
            </p>
            <p className="body-muted">
              Everything we share — internship leads, open source projects, learning resources, event
              announcements — comes from community members who are students themselves, navigating the
              same challenges.
            </p>
            <div className="mt-8 flex gap-2">
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
            </div>
          </motion.div>

          {/* Right — pillars */}
          <div className="flex flex-col gap-px bg-white/8 rounded-2xl overflow-hidden border border-white/8">
            {pillars.map((p, i) => (
              <motion.div
                key={p.title}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                className="bg-surface-0 px-6 py-5 hover:bg-surface-1 transition-colors"
              >
                <div className="flex items-start gap-4">
                  <span className="font-mono text-xs text-neutral-700 mt-0.5 shrink-0">
                    0{i + 1}
                  </span>
                  <div>
                    <h3 className="font-medium text-white mb-1.5">{p.title}</h3>
                    <p className="text-sm text-neutral-500 leading-relaxed">{p.description}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
