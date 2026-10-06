import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  ArrowLeft,
  Calendar,
  Copy,
  Check,
  ExternalLink,
  Link2,
  MessageCircle,
  Share2,
  User,
} from 'lucide-react'
import axios from 'axios'
import { CATEGORIES } from '../components/CategoriesSection'
import { getApiBase, SITE_BASE_URL } from '../lib/utils'
import Seo from '../components/Seo'

const API = getApiBase()
const getCategory = (slug) => CATEGORIES.find(category => category.slug === slug)
const getHostname = (url) => {
  try {
    return new URL(url).hostname
  } catch {
    return url
  }
}

export default function ResourceDetail() {
  const { id } = useParams()
  const [resource, setResource] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    axios
      .get(`${API}/resources/${id}`)
      .then(res => setResource(res.data))
      .catch(() => setError(true))
      .finally(() => setLoading(false))
  }, [id])

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      setCopied(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-canvas pt-32 pb-24 px-6">
        <div className="container-width max-w-4xl">
          <div className="h-8 w-1/3 rounded-wise-md bg-canvas-soft animate-pulse mb-4" />
          <div className="h-4 w-2/3 rounded-wise-md bg-canvas-soft animate-pulse mb-3" />
          <div className="h-80 rounded-wise-xl bg-canvas-soft animate-pulse mt-8" />
        </div>
      </div>
    )
  }

  if (error || !resource) {
    return (
      <div className="min-h-screen bg-canvas pt-32 pb-24 px-6 flex items-center justify-center">
        <div className="text-center max-w-md bg-canvas-soft p-10 rounded-wise-xl">
          <p className="text-xl font-bold text-ink mb-2">Resource not found</p>
          <p className="text-sm text-body mb-6">The requested resource could not be found or has been removed.</p>
          <Link to="/" className="btn-primary text-sm">Return Home</Link>
        </div>
      </div>
    )
  }

  const category = getCategory(resource.category)
  const shareText = encodeURIComponent(
    `Check out this resource on CodeCircle: ${resource.title}\n${window.location.href}`
  )

  const learningSchema = {
    '@context': 'https://schema.org',
    '@type': 'LearningResource',
    'name': resource.title,
    'description': resource.description,
    'url': `${SITE_BASE_URL}/resources/${resource._id}`,
    'image': resource.image || `${SITE_BASE_URL}/og-image.svg`,
    'author': {
      '@type': 'Person',
      'name': resource.submittedBy?.name || 'CodeCircle Contributor',
    },
    'publisher': {
      '@type': 'Organization',
      'name': 'CodeCircle',
      'url': SITE_BASE_URL,
    },
  }

  return (
    <div className="min-h-screen bg-canvas pt-32 pb-24 px-6">
      <Seo
        title={`${resource.title} | CodeCircle — CodeCircle.online`}
        description={resource.description || 'Verified student coding resource on CodeCircle (Code Circle / CodeCircle.online).'}
        keywords={`${resource.title}, CodeCircle resource, Code Circle, CodeCircle.online, ${resource.category || 'tech'}`}
        path={`/resources/${resource._id}`}
        image={resource.image || `${SITE_BASE_URL}/og-image.svg`}
        schema={learningSchema}
      />

      <div className="container-width max-w-5xl">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
          <Link to="/" className="btn-secondary text-sm mb-8 inline-flex items-center gap-2">
            <ArrowLeft size={14} /> Back to resources
          </Link>

          <div className="grid grid-cols-1 xl:grid-cols-[minmax(0,1fr)_340px] gap-8 items-start">
            <article className="bg-canvas-soft rounded-wise-xl overflow-hidden border border-canvas-soft">
              {resource.image ? (
                <div className="w-full h-80 overflow-hidden bg-white/40">
                  <img src={resource.image} alt={resource.title} className="w-full h-full object-cover" />
                </div>
              ) : (
                <div className="w-full h-48 bg-canvas border-b border-canvas-soft flex items-center justify-center text-mute">
                  <Link2 size={36} className="opacity-40" />
                </div>
              )}

              <div className="p-8 md:p-10">
                {category && (
                  <div className="mb-4 inline-flex items-center gap-1.5 px-3 py-1 rounded-wise-pill text-xs font-semibold bg-white text-ink border border-canvas-soft">
                    <span className="h-2 w-2 rounded-full" style={{ backgroundColor: category.accent }} />
                    {category.title}
                  </div>
                )}

                <h1 className="text-3xl md:text-5xl font-black text-ink leading-tight tracking-tight mb-4">
                  {resource.title}
                </h1>

                <div className="flex flex-wrap items-center gap-4 text-xs font-medium text-mute pb-8 border-b border-[#d8dcd5]">
                  <span className="flex items-center gap-1.5">
                    <Calendar size={13} />
                    {new Date(resource.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                  </span>
                  <span>·</span>
                  <span className="flex items-center gap-1.5">
                    <User size={13} />
                    {resource.submittedBy?.name || 'Contributor'}
                  </span>
                  <span>·</span>
                  <span className="flex items-center gap-1.5 truncate max-w-[200px]">
                    <Link2 size={13} />
                    <span className="truncate">{getHostname(resource.link)}</span>
                  </span>
                </div>

                <div className="mt-8 bg-canvas rounded-wise-lg p-6 border border-canvas-soft">
                  <h2 className="text-sm font-bold text-ink uppercase tracking-wider mb-3">About this resource</h2>
                  <p className="text-base leading-relaxed text-body whitespace-pre-wrap">
                    {resource.description}
                  </p>
                </div>
              </div>
            </article>

            {/* Sidebar actions */}
            <aside className="bg-canvas-soft rounded-wise-xl p-8 space-y-6 border border-canvas-soft xl:sticky xl:top-28">
              <div>
                <h2 className="text-ink font-bold text-xl">Access Resource</h2>
                <p className="text-sm text-body mt-1.5 leading-relaxed">
                  Open the verified link to view documentation, repository, or tool directly.
                </p>
              </div>

              <a
                href={resource.link}
                target="_blank"
                rel="noreferrer"
                className="btn-primary w-full justify-center py-3.5 text-base"
              >
                <span>Visit original link</span>
                <ExternalLink size={15} />
              </a>

              <div className="space-y-2.5 pt-6 border-t border-[#d8dcd5]">
                <div className="text-xs font-bold uppercase tracking-wider text-mute mb-2">Share resource</div>
                <button onClick={copyLink} className="btn-secondary w-full justify-center text-xs py-2.5">
                  {copied ? <><Check size={13} className="text-positive" /> Link copied</> : <><Copy size={13} /> Copy page link</>}
                </button>
                <a
                  href={`https://twitter.com/intent/tweet?text=${shareText}`}
                  target="_blank"
                  rel="noreferrer"
                  className="btn-secondary w-full justify-center text-xs py-2.5"
                >
                  <Share2 size={13} /> Share on X / Twitter
                </a>
                <a
                  href={`https://wa.me/?text=${shareText}`}
                  target="_blank"
                  rel="noreferrer"
                  className="btn-secondary w-full justify-center text-xs py-2.5"
                >
                  <MessageCircle size={13} /> Share on WhatsApp
                </a>
              </div>

              {resource.submittedBy?.username && (
                <div className="pt-6 border-t border-[#d8dcd5]">
                  <Link to={`/u/${resource.submittedBy.username}`} className="btn-tertiary w-full justify-center text-xs py-2.5">
                    <User size={13} /> Contributor Profile
                  </Link>
                </div>
              )}
            </aside>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
