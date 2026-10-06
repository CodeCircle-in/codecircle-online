import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowRight, Github, Link2, Sparkles, Trophy, Upload, X } from 'lucide-react'
import axios from 'axios'
import { getApiBase } from '../lib/utils'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'

const API = getApiBase()
const REPO = import.meta.env.VITE_GITHUB_REPO || 'codecircle-online/codecircle-online'

function initials(name = '') {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map(part => part[0]?.toUpperCase())
    .join('') || 'CC'
}

function AvatarStack({ items, getName, getImage }) {
  return (
    <div className="flex -space-x-2">
      {items.map((item, index) => (
        <Avatar
          key={`${getName(item)}-${index}`}
          className="h-9 w-9 ring-2 ring-white bg-canvas-soft border border-canvas-soft"
          style={{ zIndex: items.length - index }}
        >
          <AvatarImage src={getImage(item)} alt={getName(item)} />
          <AvatarFallback className="text-xs font-semibold text-ink bg-canvas-soft">
            {initials(getName(item))}
          </AvatarFallback>
        </Avatar>
      ))}
    </div>
  )
}

function FameModal({ open, onClose, title, subtitle, items, type }) {
  useEffect(() => {
    if (!open) return undefined

    const handleEscape = (event) => {
      if (event.key === 'Escape') onClose()
    }

    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', handleEscape)

    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', handleEscape)
    }
  }, [open, onClose])

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[70] bg-ink/50 backdrop-blur-sm px-4 py-8 flex items-center justify-center"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.98 }}
            transition={{ duration: 0.2 }}
            className="w-full max-w-2xl bg-canvas rounded-wise-xl border border-canvas-soft shadow-2xl overflow-hidden max-h-[85vh] flex flex-col"
            onClick={event => event.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-4 border-b border-canvas-soft px-6 py-5 bg-canvas-soft/40">
              <div>
                <p className="label-text mb-1">{title}</p>
                <h3 className="text-xl font-bold text-ink">{subtitle}</h3>
              </div>
              <button
                onClick={onClose}
                className="rounded-full bg-canvas border border-ink/10 p-2 text-mute hover:text-ink transition-colors cursor-pointer"
                aria-label="Close dialog"
              >
                <X size={16} />
              </button>
            </div>

            <div className="overflow-y-auto px-6 py-5 flex-1">
              <div className="space-y-3">
                {items.map((item, index) => (
                  <div
                    key={item.id || item.login}
                    className="bg-canvas-soft rounded-wise-lg px-5 py-4 border border-canvas-soft hover:border-ink/10 transition-colors"
                  >
                    <div className="flex items-start gap-4">
                      <Avatar className="h-11 w-11 ring-2 ring-white">
                        <AvatarImage src={item.avatar || item.avatar_url} alt={item.name || item.login} />
                        <AvatarFallback className="bg-white text-ink font-semibold">
                          {initials(item.name || item.login)}
                        </AvatarFallback>
                      </Avatar>

                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between gap-3">
                          <div className="min-w-0">
                            <p className="text-base font-semibold text-ink truncate">
                              {item.name || item.login}
                            </p>
                            <p className="text-xs text-mute font-medium">
                              Rank #{index + 1}
                            </p>
                          </div>

                          {type === 'contributors' ? (
                            <a
                              href={item.html_url}
                              target="_blank"
                              rel="noreferrer"
                              className="btn-secondary text-xs shrink-0 py-1.5 px-3"
                            >
                              <Github size={12} />
                              Profile
                            </a>
                          ) : (
                            <span className="rounded-wise-pill bg-white border border-canvas-soft px-3 py-1 text-xs font-semibold text-ink">
                              {item.count} resource{item.count === 1 ? '' : 's'}
                            </span>
                          )}
                        </div>

                        {type === 'contributors' ? (
                          <p className="mt-2.5 flex items-center gap-1.5 text-xs font-medium text-body">
                            <Sparkles size={13} className="text-warning-deep" />
                            {item.contributions} contribution{item.contributions === 1 ? '' : 's'}
                          </p>
                        ) : (
                          <div className="mt-3 space-y-1.5">
                            {item.resources.map((resource, resourceIndex) => (
                              <Link
                                key={`${resource.id}-${resourceIndex}`}
                                to={`/resources/${resource.id}`}
                                className="flex items-center gap-2 text-xs font-medium text-body hover:text-ink transition-colors"
                              >
                                <Link2 size={12} className="shrink-0 text-mute" />
                                <span className="truncate">{resource.title}</span>
                              </Link>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default function HallOfFame() {
  const [contributors, setContributors] = useState([])
  const [uploaders, setUploaders] = useState([])
  const [contributorsLoading, setContributorsLoading] = useState(true)
  const [uploadersLoading, setUploadersLoading] = useState(true)
  const [contributorsError, setContributorsError] = useState(false)
  const [uploadersError, setUploadersError] = useState(false)
  const [openPanel, setOpenPanel] = useState(null)

  useEffect(() => {
    axios
      .get(`https://api.github.com/repos/${REPO}/contributors?per_page=24`)
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
            id: resource._id,
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

  const contributorPreview = contributors.slice(0, 6)
  const uploaderPreview = uploaders.slice(0, 6)

  return (
    <>
      <section id="hall-of-fame" className="section-padding bg-canvas-soft border-t border-[#d8dcd5]">
        <div className="container-width">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="mb-12"
          >
            <p className="label-text mb-3">Community Hall of Fame</p>
            <h2 className="heading-lg">Small wins. Real people.</h2>
            <p className="body-muted mt-3 max-w-2xl">
              The builders building the codebase and the active members sharing the top resources.
              Tap either cohort to view the complete roster.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            <motion.button
              type="button"
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4 }}
              onClick={() => contributors.length && setOpenPanel('contributors')}
              className="bg-canvas rounded-wise-xl p-8 text-left transition-all hover:shadow-sm border border-transparent hover:border-ink/10 cursor-pointer"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-4">
                  <div className="inline-flex h-12 w-12 items-center justify-center rounded-wise-lg bg-primary-pale text-positive-deep font-bold">
                    <Trophy size={22} />
                  </div>
                  <div>
                    <p className="text-xl font-bold text-ink">GitHub Contributors</p>
                    <p className="mt-1.5 text-sm text-body">
                      {contributorsLoading
                        ? 'Loading contributors...'
                        : contributorsError
                          ? 'Could not load contributors.'
                          : `${contributors.length} developers actively writing code.`}
                    </p>
                  </div>
                </div>

                <span className="rounded-wise-pill bg-canvas-soft px-3.5 py-1 text-xs font-semibold text-ink">
                  View all
                </span>
              </div>

              <div className="mt-8 flex items-center justify-between gap-4 pt-6 border-t border-canvas-soft">
                {contributorPreview.length ? (
                  <AvatarStack
                    items={contributorPreview}
                    getName={item => item.login}
                    getImage={item => item.avatar_url}
                  />
                ) : (
                  <div className="flex gap-2">
                    {[...Array(4)].map((_, index) => (
                      <div key={index} className="h-8 w-8 rounded-full bg-canvas-soft animate-pulse" />
                    ))}
                  </div>
                )}

                <div className="flex items-center gap-2 text-xs font-semibold text-ink">
                  <Github size={14} />
                  <span>
                    {contributorsLoading || contributorsError
                      ? 'No data'
                      : `${contributors.reduce((total, item) => total + item.contributions, 0)} commits`}
                  </span>
                </div>
              </div>
            </motion.button>

            <motion.button
              type="button"
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.08, duration: 0.4 }}
              onClick={() => uploaders.length && setOpenPanel('uploaders')}
              className="bg-canvas rounded-wise-xl p-8 text-left transition-all hover:shadow-sm border border-transparent hover:border-ink/10 cursor-pointer"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-4">
                  <div className="inline-flex h-12 w-12 items-center justify-center rounded-wise-lg bg-[#e0f2fe] text-[#0369a1] font-bold">
                    <Upload size={22} />
                  </div>
                  <div>
                    <p className="text-xl font-bold text-ink">Resource Uploaders</p>
                    <p className="mt-1.5 text-sm text-body">
                      {uploadersLoading
                        ? 'Loading uploaders...'
                        : uploadersError
                          ? 'Could not load resource uploaders.'
                          : `${uploaders.length} students curated ${featuredResourceCount} resources.`}
                    </p>
                  </div>
                </div>

                <span className="rounded-wise-pill bg-canvas-soft px-3.5 py-1 text-xs font-semibold text-ink">
                  View all
                </span>
              </div>

              <div className="mt-8 flex items-center justify-between gap-4 pt-6 border-t border-canvas-soft">
                {uploaderPreview.length ? (
                  <AvatarStack
                    items={uploaderPreview}
                    getName={item => item.name}
                    getImage={item => item.avatar}
                  />
                ) : (
                  <div className="flex gap-2">
                    {[...Array(4)].map((_, index) => (
                      <div key={index} className="h-8 w-8 rounded-full bg-canvas-soft animate-pulse" />
                    ))}
                  </div>
                )}

                <div className="flex items-center gap-2 text-xs font-semibold text-ink">
                  <Sparkles size={14} className="text-warning-deep" />
                  <span>
                    {uploadersLoading || uploadersError ? 'No data' : `${featuredResourceCount} shared`}
                  </span>
                </div>
              </div>
            </motion.button>
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link to="/submit-resource" className="btn-secondary text-sm">
              <Link2 size={14} />
              Upload a resource
            </Link>
            <a
              href={`https://github.com/${REPO}`}
              target="_blank"
              rel="noreferrer"
              className="btn-tertiary text-sm"
            >
              <Github size={14} />
              View GitHub repository
            </a>
          </div>
        </div>
      </section>

      <FameModal
        open={openPanel === 'contributors'}
        onClose={() => setOpenPanel(null)}
        title="Hall of Fame"
        subtitle="All GitHub Contributors"
        items={contributors}
        type="contributors"
      />

      <FameModal
        open={openPanel === 'uploaders'}
        onClose={() => setOpenPanel(null)}
        title="Hall of Fame"
        subtitle="All Resource Uploaders"
        items={uploaders}
        type="uploaders"
      />
    </>
  )
}
