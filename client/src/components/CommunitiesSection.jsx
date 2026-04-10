import { motion } from 'framer-motion'

const platforms = [
  {
    name: 'WhatsApp',
    handle: 'codecircle-community',
    description:
      'Instant updates, internship drops, resource shares, and discussion threads — right on WhatsApp.',
    href: 'https://chat.whatsapp.com/G9coEcncT13EjxeVbk2xAE',
    label: 'Join WhatsApp',
    variant: 'primary',
  },
  {
    name: 'Discord',
    handle: 'XYUAKXET',
    description:
      'Organized channels, voice rooms, study sessions, and real-time tech discussions on Discord.',
    href: 'https://discord.gg/XYUAKXET',
    label: 'Join Discord',
    variant: 'secondary',
  },
]

export default function CommunitiesSection() {
  return (
    <section id="community" className="section-padding border-t border-white/8">
      <div className="container-width">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-12"
        >
          <p className="label-text mb-4">Community</p>
          <h2 className="heading-lg text-white">Join Our Communities</h2>
          <p className="body-muted mt-4 max-w-lg">
            Connect with thousands of students and developers on your preferred platform.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {platforms.map((p, i) => (
            <motion.div
              key={p.name}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              className="glass rounded-2xl p-8 flex flex-col gap-6 hover:border-white/20 transition-all"
            >
              <div>
                <div className="font-medium text-white text-lg mb-1">{p.name} Community</div>
                <div className="font-mono text-xs text-neutral-600">/{p.handle}</div>
              </div>
              <p className="text-sm text-neutral-400 leading-relaxed">{p.description}</p>
              <div>
                <a
                  href={p.href}
                  target="_blank"
                  rel="noreferrer"
                  className={p.variant === 'primary' ? 'btn-primary' : 'btn-secondary'}
                >
                  {p.label}
                </a>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
