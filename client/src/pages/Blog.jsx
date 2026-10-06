import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Calendar, User, Search } from 'lucide-react'
import axios from 'axios'
import { CATEGORIES } from '../components/CategoriesSection'
import { getApiBase } from '../lib/utils'
import Seo from '../components/Seo'

const API = getApiBase()

export default function Blog() {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('all')
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  useEffect(() => {
    setLoading(true)
    const params = new URLSearchParams({ page, limit: 9 })
    if (search) params.set('search', search)
    if (category !== 'all') params.set('category', category)
    axios
      .get(`${API}/posts?${params}`)
      .then(res => {
        setPosts(res.data.posts || [])
        setTotalPages(res.data.totalPages || 1)
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [search, category, page])

  return (
    <div className="min-h-screen bg-canvas">
      <Seo
        title="Tech Blog & Guides | CodeCircle — CodeCircle.online"
        description="Read the latest tech articles, student career guides, programming tutorials, and community news on CodeCircle (Code Circle / CodeCircle.online)."
        keywords="CodeCircle blog, Code Circle articles, CodeCircle.online blog, student coding tutorials, tech insights, software engineering guides"
        path="/blog"
      />

      {/* Wise Hero Header Band */}
      <section className="bg-canvas-soft pt-32 pb-14 border-b border-[#d8dcd5] px-6">
        <div className="container-width">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <p className="label-text mb-3">Blog & Insights</p>
            <h1 className="heading-xl">Latest Updates & Guides</h1>
            <p className="body-muted mt-3 max-w-xl text-base md:text-lg">
              Resources, career opportunities, tutorials, and announcements curated by the CodeCircle student community.
            </p>

            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-3 mt-8">
              <div className="relative flex-1 max-w-md">
                <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-mute" />
                <input
                  value={search}
                  onChange={e => { setSearch(e.target.value); setPage(1) }}
                  placeholder="Search articles & tutorials..."
                  className="input-base pl-10"
                />
              </div>
              <select
                value={category}
                onChange={e => { setCategory(e.target.value); setPage(1) }}
                className="input-base w-auto min-w-[180px] cursor-pointer"
              >
                <option value="all">All Topics</option>
                {CATEGORIES.map(c => (
                  <option key={c.slug} value={c.slug}>{c.title}</option>
                ))}
              </select>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Posts Section */}
      <section className="section-padding px-6">
        <div className="container-width">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-canvas-soft rounded-wise-xl h-72 animate-pulse" />
              ))}
            </div>
          ) : posts.length === 0 ? (
            <div className="bg-canvas-soft rounded-wise-xl p-16 text-center text-body">
              <p className="text-lg font-semibold text-ink mb-1">No posts found</p>
              <p className="text-sm text-mute">Try adjusting your search criteria or topic filter.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {posts.map((post, i) => (
                <motion.div
                  key={post._id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.04 }}
                >
                  <Link
                    to={`/blog/${post._id}`}
                    className="group flex flex-col h-full bg-canvas-soft rounded-wise-xl overflow-hidden hover:bg-[#dfe3dc] transition-all duration-200 border border-transparent hover:border-ink/10"
                  >
                    {post.image ? (
                      <div className="w-full h-44 overflow-hidden bg-white/40">
                        <img
                          src={post.image}
                          alt={post.title}
                          className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-300"
                        />
                      </div>
                    ) : (
                      <div className="w-full h-32 bg-canvas border-b border-canvas-soft" />
                    )}
                    <div className="p-6 flex flex-col flex-1">
                      {post.category && (
                        <span className="inline-flex self-start px-3 py-1 rounded-wise-pill text-xs font-semibold mb-3 bg-white text-ink border border-canvas-soft">
                          {post.category}
                        </span>
                      )}
                      <h2 className="font-semibold text-ink text-lg leading-snug mb-2 line-clamp-2 group-hover:text-ink transition-colors">
                        {post.title}
                      </h2>
                      <p className="text-sm text-body line-clamp-3 leading-relaxed flex-1 mb-4">
                        {post.excerpt}
                      </p>
                      <div className="pt-4 border-t border-[#d8dcd5] flex items-center justify-between text-xs text-mute mt-auto">
                        <span className="flex items-center gap-1.5">
                          <Calendar size={12} />
                          {new Date(post.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </span>
                        <span className="flex items-center gap-1.5">
                          <User size={12} />
                          {post.author?.name || 'Admin'}
                        </span>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-3 mt-12">
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="btn-secondary disabled:opacity-40 disabled:cursor-not-allowed text-sm"
              >
                Previous
              </button>
              <span className="text-sm font-semibold text-ink px-3">
                Page {page} of {totalPages}
              </span>
              <button
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="btn-secondary disabled:opacity-40 disabled:cursor-not-allowed text-sm"
              >
                Next
              </button>
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
