import { motion } from 'framer-motion'
import { MessageSquare, Disc as DiscordIcon, ExternalLink } from 'lucide-react'

const platforms = [
  {
    name: 'WhatsApp',
    handle: 'codecircle-community',
    description:
      'Instant updates, internship notifications, resource announcements, and fast-paced discussions right in your messaging app.',
    href: 'https://chat.whatsapp.com/G9coEcncT13EjxeVbk2xAE',
    label: 'Join WhatsApp Group',
    primary: true,
  },
  {
    name: 'Discord',
    handle: 'XYUAKXET',
    description:
      'Structured technical channels, study spaces, voice rooms, live event hosting, and deep collaborative projects with fellow student developers.',
    href: 'https://discord.gg/XYUAKXET',
    label: 'Join Discord Server',
    primary: false,
  },
]

export default function CommunitiesSection() {
  return (
    <section id="community" className="section-padding bg-canvas border-t border-canvas-soft">
      <div className="container-width">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-12"
        >
          <p className="label-text mb-3">Community</p>
          <h2 className="heading-lg">Join Our Channels</h2>
          <p className="body-muted mt-2 max-w-lg">
            Connect with thousands of student developers across your preferred discussion platforms.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {platforms.map((p, i) => (
            <motion.div
              key={p.name}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.4 }}
              className="bg-canvas-soft rounded-wise-xl p-8 flex flex-col justify-between gap-6 hover:bg-[#dfe3dc] transition-all border border-transparent hover:border-ink/10"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="font-bold text-ink text-2xl">{p.name}</div>
                  <span className="text-xs font-semibold px-3 py-1 rounded-wise-pill bg-canvas text-body border border-canvas-soft">
                    /{p.handle}
                  </span>
                </div>
                <p className="text-sm text-body leading-relaxed">{p.description}</p>
              </div>
              <div>
                <a
                  href={p.href}
                  target="_blank"
                  rel="noreferrer"
                  className={p.primary ? 'btn-primary' : 'btn-tertiary'}
                >
                  <span>{p.label}</span>
                  <ExternalLink size={14} />
                </a>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
