import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Calendar, User, ArrowLeft, ExternalLink, Link2 } from 'lucide-react'
import axios from 'axios'
import { CATEGORIES } from '../components/CategoriesSection'
import { getApiBase } from '../lib/utils'
import Seo from '../components/Seo'

const API = getApiBase()
const getHostname = (url) => {
  try {
    return new URL(url).hostname
  } catch {
    return url
  }
}

export default function CategoryPage() {
  const { slug } = useParams()
  const category = CATEGORIES.find(c => c.slug === slug)
  const [posts, setPosts] = useState([])
  const [resources, setResources] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      axios.get(`${API}/posts?category=${slug}&limit=12`).then(r => r.data.posts || []).catch(() => []),
      axios.get(`${API}/resources?category=${slug}&limit=12`).then(r => r.data.resources || []).catch(() => []),
    ]).then(([p, r]) => { setPosts(p); setResources(r) }).finally(() => setLoading(false))
  }, [slug])

  if (!category) {
    return (
      <div className="min-h-screen bg-canvas pt-32 pb-24 flex items-center justify-center px-6">
        <div className="text-center max-w-md bg-canvas-soft p-10 rounded-wise-xl">
          <p className="text-xl font-bold text-ink mb-2">Category not found</p>
          <p className="text-sm text-body mb-6">The topic you're looking for does not exist.</p>
          <Link to="/" className="btn-primary text-sm">Return Home</Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-canvas">
      <Seo
        title={`${category.title} Resources & Guides | CodeCircle — CodeCircle.online`}
        description={`Explore curated ${category.title} resources, tutorials, repositories, and learning pathways on CodeCircle (Code Circle / CodeCircle.online). ${category.description}`}
        keywords={`${category.title}, ${category.slug}, CodeCircle ${category.title}, Code Circle, CodeCircle.online, student tech community, free ${category.title} resources`}
        path={`/category/${slug}`}
      />

      {/* Wise Hero Header Band */}
      <section className="bg-canvas-soft pt-32 pb-14 border-b border-[#d8dcd5] px-6">
        <div className="container-width">
          <Link to="/#topics" className="btn-secondary text-sm mb-8 inline-flex items-center gap-2">
            <ArrowLeft size={14} /> All topics
          </Link>

          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
            <div className="w-10 h-1.5 rounded-wise-pill mb-4" style={{ backgroundColor: category.accent }} />
            <p className="label-text mb-2">Topic Hub</p>
            <h1 className="heading-xl">{category.title}</h1>
            <p className="body-muted mt-3 max-w-xl text-base md:text-lg">{category.description}</p>
          </motion.div>
        </div>
      </section>

      {/* Content Section */}
      <section className="section-padding px-6">
        <div className="container-width">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-canvas-soft rounded-wise-xl h-56 animate-pulse" />
              ))}
            </div>
          ) : posts.length === 0 && resources.length === 0 ? (
            <div className="bg-canvas-soft rounded-wise-xl p-14 text-center">
              <p className="text-lg font-bold text-ink mb-2">No content yet in this category</p>
              <p className="text-sm text-body mb-6">Be the first to share a tutorial or resource for {category.title}.</p>
              <Link to="/submit-resource" className="btn-primary text-sm">
                Share a Resource
              </Link>
            </div>
          ) : (
            <div className="space-y-16">
              {/* Resources list */}
              {resources.length > 0 && (
                <div>
                  <div className="flex items-center justify-between mb-8">
                    <div>
                      <h2 className="heading-md">Community Resources</h2>
                      <p className="text-sm text-mute mt-1">Useful links, repositories, and learning paths</p>
                    </div>
                    <Link to="/submit-resource" className="btn-primary text-xs">
                      + Add resource
                    </Link>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {resources.map((res, i) => (
                      <motion.div key={res._id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}>
                        <Link
                          to={`/resources/${res._id}`}
                          className="group bg-canvas-soft rounded-wise-xl p-6 flex flex-col sm:flex-row gap-5 hover:bg-[#dfe3dc] transition-all duration-200 border border-transparent hover:border-ink/10 h-full justify-between"
                        >
                          <div className="flex gap-4">
                            {res.image ? (
                              <img src={res.image} alt={res.title} className="w-20 h-20 rounded-wise-md object-cover shrink-0 shadow-sm" />
                            ) : (
                              <div className="w-20 h-20 rounded-wise-md bg-canvas flex items-center justify-center shrink-0 border border-canvas-soft text-mute">
                                <Link2 size={24} className="opacity-40" />
                              </div>
                            )}
                            <div className="min-w-0">
                              <span
                                className="mb-2 inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-wise-pill text-[11px] font-bold bg-white text-ink border border-canvas-soft"
                              >
                                <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: category.accent }} />
                                {category.title}
                              </span>
                              <h3 className="font-bold text-ink text-base mb-1.5 line-clamp-1 group-hover:text-ink">{res.title}</h3>
                              <p className="text-xs text-body line-clamp-2 leading-relaxed">{res.description}</p>
                              {res.link && (
                                <span className="mt-2.5 inline-block text-xs text-mute font-medium truncate max-w-full">
                                  {getHostname(res.link)}
                                </span>
                              )}
                            </div>
                          </div>
                        </Link>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}

              {/* Posts list */}
              {posts.length > 0 && (
                <div>
                  <div className="mb-8">
                    <h2 className="heading-md">Articles & Guides</h2>
                    <p className="text-sm text-mute mt-1">Deep dives and updates from our contributors</p>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {posts.map((post, i) => (
                      <motion.div key={post._id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}>
                        <Link
                          to={`/blog/${post._id}`}
                          className="group flex flex-col h-full bg-canvas-soft rounded-wise-xl overflow-hidden hover:bg-[#dfe3dc] transition-all duration-200 border border-transparent hover:border-ink/10"
                        >
                          {post.image && (
                            <img src={post.image} alt={post.title} className="w-full h-40 object-cover" />
                          )}
                          <div className="p-6 flex flex-col flex-1">
                            <h3 className="font-bold text-ink text-base leading-snug mb-2 line-clamp-2">{post.title}</h3>
                            <p className="text-xs text-body line-clamp-2 flex-1 mb-4 leading-relaxed">{post.excerpt}</p>
                            <div className="pt-3 border-t border-[#d8dcd5] flex items-center justify-between text-xs text-mute">
                              <span className="flex items-center gap-1"><Calendar size={11} />{new Date(post.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                              <span className="flex items-center gap-1"><User size={11} />{post.author?.name || 'Admin'}</span>
                            </div>
                          </div>
                        </Link>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
