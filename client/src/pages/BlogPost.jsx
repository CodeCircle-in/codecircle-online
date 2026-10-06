import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Calendar, User, ArrowLeft, Tag, ExternalLink } from 'lucide-react'
import axios from 'axios'
import { getApiBase, SITE_BASE_URL } from '../lib/utils'
import Seo from '../components/Seo'

const API = getApiBase()

export default function BlogPost() {
  const { id } = useParams()
  const [post, setPost] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    axios
      .get(`${API}/posts/${id}`)
      .then(res => setPost(res.data))
      .catch(() => setError(true))
      .finally(() => setLoading(false))
  }, [id])

  if (loading) {
    return (
      <div className="min-h-screen bg-canvas pt-32 pb-24 px-6">
        <div className="container-width max-w-3xl">
          <div className="h-8 bg-canvas-soft rounded-wise-md animate-pulse mb-4 w-3/4" />
          <div className="h-4 bg-canvas-soft rounded-wise-md animate-pulse mb-3" />
          <div className="h-4 bg-canvas-soft rounded-wise-md animate-pulse mb-3 w-5/6" />
          <div className="h-80 bg-canvas-soft rounded-wise-xl animate-pulse mt-8" />
        </div>
      </div>
    )
  }

  if (error || !post) {
    return (
      <div className="min-h-screen bg-canvas pt-32 pb-24 px-6 flex items-center justify-center">
        <div className="text-center max-w-md bg-canvas-soft p-10 rounded-wise-xl">
          <p className="text-ink font-bold text-xl mb-2">Post not found</p>
          <p className="text-body text-sm mb-6">The article you requested might have been moved or deleted.</p>
          <Link to="/blog" className="btn-primary text-sm">Back to Blog</Link>
        </div>
      </div>
    )
  }

  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    'headline': post.title,
    'description': post.excerpt || post.content?.slice(0, 160) || 'CodeCircle blog article',
    'image': post.image ? [post.image] : [`${SITE_BASE_URL}/og-image.svg`],
    'datePublished': post.createdAt,
    'dateModified': post.updatedAt || post.createdAt,
    'author': {
      '@type': 'Person',
      'name': post.author?.name || 'CodeCircle Team',
    },
    'publisher': {
      '@type': 'Organization',
      'name': 'CodeCircle',
      'url': SITE_BASE_URL,
      'logo': {
        '@type': 'ImageObject',
        'url': `${SITE_BASE_URL}/favicon.svg`,
      },
    },
    'mainEntityOfPage': {
      '@type': 'WebPage',
      '@id': `${SITE_BASE_URL}/blog/${id}`,
    },
  }

  return (
    <div className="min-h-screen bg-canvas pt-32 pb-24 px-6">
      <Seo
        title={`${post.title} | CodeCircle — CodeCircle.online`}
        description={post.excerpt || post.content?.slice(0, 155) || 'Read this post on CodeCircle (Code Circle / CodeCircle.online).'}
        keywords={`${post.title}, CodeCircle, Code Circle, CodeCircle.online, ${post.category || 'tech tutorial'}`}
        path={`/blog/${id}`}
        image={post.image || `${SITE_BASE_URL}/og-image.svg`}
        type="article"
        schema={articleSchema}
      />
      <div className="container-width max-w-3xl">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
          {/* Back button */}
          <Link to="/blog" className="btn-secondary text-sm mb-8 inline-flex items-center gap-2">
            <ArrowLeft size={14} /> Back to all posts
          </Link>

          {/* Meta bar */}
          <div className="flex flex-wrap items-center gap-3 mb-6 text-xs text-mute font-medium">
            {post.category && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-canvas-soft rounded-wise-pill font-semibold text-ink border border-canvas-soft">
                <Tag size={11} /> {post.category}
              </span>
            )}
            <span className="flex items-center gap-1.5">
              <Calendar size={13} />
              {new Date(post.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
            </span>
            <span>·</span>
            <span className="flex items-center gap-1.5">
              <User size={13} />
              {post.author?.name || 'Admin'}
            </span>
          </div>

          {/* Title */}
          <h1 className="text-3xl md:text-5xl font-black text-ink leading-tight tracking-tight mb-8">
            {post.title}
          </h1>

          {/* Featured Image */}
          {post.image && (
            <div className="w-full rounded-wise-xl overflow-hidden mb-10 border border-canvas-soft shadow-sm">
              <img
                src={post.image}
                alt={post.title}
                className="w-full object-cover max-h-[440px]"
              />
            </div>
          )}

          {/* Excerpt callout */}
          {post.excerpt && (
            <div className="bg-canvas-soft border-l-4 border-primary p-6 rounded-r-wise-xl mb-8">
              <p className="text-base md:text-lg font-semibold text-ink leading-relaxed">
                {post.excerpt}
              </p>
            </div>
          )}

          {/* Content */}
          <div
            className="prose-content text-body text-base md:text-lg leading-relaxed space-y-4"
            dangerouslySetInnerHTML={{ __html: post.content.replace(/\n/g, '<br/>') }}
          />

          {/* Bottom Bar */}
          <div className="mt-14 pt-8 border-t border-canvas-soft flex flex-wrap items-center justify-between gap-4">
            <Link to="/blog" className="btn-secondary text-sm">
              <ArrowLeft size={14} /> All posts
            </Link>
            {post.link && (
              <a href={post.link} target="_blank" rel="noreferrer" className="btn-primary text-sm flex items-center gap-2">
                <span>View Referenced Resource</span>
                <ExternalLink size={14} />
              </a>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  )
}
