import { useEffect, useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowRight, Github, Link2, Sparkles } from 'lucide-react'
import axios from 'axios'
import { getApiBase } from '../lib/utils'

const API = getApiBase()
const REPO = import.meta.env.VITE_GITHUB_REPO || 'codecircle-online/codecircle-online'

export default function HallOfFame() {
  const [contributors, setContributors] = useState([])
  const [uploaders, setUploaders] = useState([])
  const [contributorsLoading, setContributorsLoading] = useState(true)
  const [uploadersLoading, setUploadersLoading] = useState(true)
  const [contributorsError, setContributorsError] = useState(false)
  const [uploadersError, setUploadersError] = useState(false)

  useEffect(() => {
    axios
      .get(`https://api.github.com/repos/${REPO}/contributors?per_page=10`)
      .then(res => setContributors(res.data || []))
      .catch(() => setContributorsError(true))
      .finally(() => setContributorsLoading(false))
  }, [])

  useEffect(() => {
    axios
      .get(`${API}/resources?limit=200`)
      .then(res => {
        const grouped = new Map()

        for (const resource of res.data.resources || []) {
          const submitter = resource.submittedBy
          if (!submitter?._id) continue

          const existing = grouped.get(submitter._id) || {
            id: submitter._id,
            name: submitter.name,
            avatar: submitter.avatar,
            count: 0,
            resources: [],
          }

          existing.count += 1
          existing.resources.push({
            title: resource.title,
            link: resource.link,
          })
          grouped.set(submitter._id, existing)
        }

        setUploaders(Array.from(grouped.values()).sort((a, b) => b.count - a.count))
      })
      .catch(() => setUploadersError(true))
      .finally(() => setUploadersLoading(false))
  }, [])

  const featuredResourceCount = useMemo(
    () => uploaders.reduce((total, uploader) => total + uploader.count, 0),
    [uploaders]
  )

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
          <p className="label-text mb-4">Community Hall of Fame</p>
          <h2 className="heading-lg text-white">Hall of Fame</h2>
          <p className="body-muted mt-4 max-w-lg">
            GitHub contributors and community members who upload useful resources are both
            featured here.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
          <div>
            <div className="flex items-center justify-between mb-4 text-sm text-neutral-500">
              <span>GitHub contributors</span>
              <span>{contributors.length} people</span>
            </div>

            {contributorsLoading && (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="glass rounded-2xl p-4 h-40 animate-pulse" />
                ))}
              </div>
            )}

            {contributorsError && (
              <div className="glass rounded-xl p-6 text-neutral-500 text-sm">
                Could not load GitHub contributors.
              </div>
            )}

            {!contributorsLoading && !contributorsError && (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {contributors.map((c, i) => (
                  <motion.a
                    key={c.id}
                    href={c.html_url}
                    target="_blank"
                    rel="noreferrer"
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.05, duration: 0.4 }}
                    className="group glass rounded-2xl p-4 flex flex-col items-center gap-3 hover:border-white/20 transition-all"
                  >
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
                        <Sparkles size={10} />
                        {c.contributions}
                      </div>
                    </div>
                  </motion.a>
                ))}
              </div>
            )}
          </div>

          <div>
            <div className="flex items-center justify-between mb-4 text-sm text-neutral-500">
              <span>Resource uploaders</span>
              <span>{featuredResourceCount} resources shared</span>
            </div>

            {uploadersLoading && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="glass rounded-2xl p-5 h-40 animate-pulse" />
                ))}
              </div>
            )}

            {uploadersError && (
              <div className="glass rounded-xl p-6 text-neutral-500 text-sm">
                Could not load resource uploaders.
              </div>
            )}

            {!uploadersLoading && !uploadersError && (
              uploaders.length === 0 ? (
                <div className="glass rounded-xl p-6 text-neutral-500 text-sm">
                  No resources have been uploaded yet.
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {uploaders.map((uploader, i) => (
                    <motion.div
                      key={uploader.id}
                      initial={{ opacity: 0, y: 16 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.06, duration: 0.4 }}
                      className="group glass rounded-2xl p-5 hover:border-white/20 transition-all"
                    >
                      <div className="flex items-center gap-4 mb-4">
                        <div className="relative shrink-0">
                          <img
                            src={uploader.avatar}
                            alt={uploader.name}
                            className="w-14 h-14 rounded-full border border-white/10 group-hover:border-white/30 transition-colors object-cover"
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

                        <div className="min-w-0 flex-1">
                          <div className="text-sm font-medium text-white truncate">{uploader.name}</div>
                          <div className="mt-1 flex items-center gap-1 text-xs text-neutral-600">
                            <Sparkles size={10} />
                            {uploader.count} resource{uploader.count === 1 ? '' : 's'}
                          </div>
                        </div>
                      </div>

                      <div className="space-y-2">
                        {uploader.resources.slice(0, 3).map((resource, index) => (
                          <a
                            key={`${resource.link}-${index}`}
                            href={resource.link}
                            target="_blank"
                            rel="noreferrer"
                            className="flex items-center gap-2 text-xs text-neutral-400 hover:text-white transition-colors truncate"
                          >
                            <Link2 size={11} className="shrink-0" />
                            <span className="truncate">{resource.title}</span>
                          </a>
                        ))}
                      </div>

                      {uploader.resources.length > 3 && (
                        <div className="mt-4 text-xs text-neutral-600 flex items-center gap-1">
                          <ArrowRight size={11} />
                          {uploader.resources.length - 3} more resource{uploader.resources.length - 3 === 1 ? '' : 's'}
                        </div>
                      )}
                    </motion.div>
                  ))}
                </div>
              )
            )}
          </div>
        </div>

        <div className="mt-8">
          <a href="/submit-resource" className="btn-ghost text-sm">
            <Link2 size={14} />
            Upload a resource
          </a>
          <a
            href={`https://github.com/${REPO}`}
            target="_blank"
            rel="noreferrer"
            className="btn-ghost text-sm ml-3"
          >
            <Github size={14} />
            View repository
          </a>
        </div>
      </div>
    </section>
  )
}
