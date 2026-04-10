import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Github, GitCommit } from 'lucide-react'
import axios from 'axios'

const REPO = import.meta.env.VITE_GITHUB_REPO || 'codecircle-online/codecircle-online'

export default function HallOfFame() {
  const [contributors, setContributors] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    axios
      .get(`https://api.github.com/repos/${REPO}/contributors?per_page=10`)
      .then(res => setContributors(res.data))
      .catch(() => setError(true))
      .finally(() => setLoading(false))
  }, [])

  return (
    <section id="hall-of-fame" className="section-padding border-t border-white/8">
      <div className="container-width">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-12"
        >
          <p className="label-text mb-4">Contributors</p>
          <h2 className="heading-lg text-white">Hall of Fame</h2>
          <p className="body-muted mt-4 max-w-lg">
            The people who make CodeCircle what it is — ranked by contributions to our open source
            repository.
          </p>
        </motion.div>

        {loading && (
          <div className="flex gap-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="w-16 h-16 rounded-full bg-white/5 animate-pulse" />
            ))}
          </div>
        )}

        {error && (
          <div className="glass rounded-xl p-6 text-neutral-500 text-sm">
            Could not load contributors. Configure{' '}
            <span className="font-mono text-neutral-400">VITE_GITHUB_REPO</span> to point to your
            repository.
          </div>
        )}

        {!loading && !error && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
            {contributors.map((c, i) => (
              <motion.a
                key={c.id}
                href={c.html_url}
                target="_blank"
                rel="noreferrer"
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.06, duration: 0.4 }}
                className="group glass rounded-xl p-4 flex flex-col items-center gap-3 hover:border-white/20 transition-all"
              >
                {/* Rank badge */}
                <div className="relative">
                  <img
                    src={c.avatar_url}
                    alt={c.login}
                    className="w-14 h-14 rounded-full border border-white/10 group-hover:border-white/30 transition-colors"
                  />
                  {i < 3 && (
                    <div className={`absolute -top-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold
                      ${i === 0 ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30' :
                        i === 1 ? 'bg-neutral-400/20 text-neutral-300 border border-neutral-400/30' :
                          'bg-orange-600/20 text-orange-400 border border-orange-600/30'}`}
                    >
                      {i + 1}
                    </div>
                  )}
                </div>
                <div className="text-center w-full">
                  <div className="text-sm font-medium text-white truncate">{c.login}</div>
                  <div className="flex items-center justify-center gap-1 mt-1 text-xs text-neutral-600">
                    <GitCommit size={10} />
                    {c.contributions}
                  </div>
                </div>
              </motion.a>
            ))}
          </div>
        )}

        <div className="mt-8">
          <a
            href={`https://github.com/${REPO}`}
            target="_blank"
            rel="noreferrer"
            className="btn-ghost text-sm"
          >
            <Github size={14} />
            View repository
          </a>
        </div>
      </div>
    </section>
  )
}
