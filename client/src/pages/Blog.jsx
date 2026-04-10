import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Calendar, User, Search } from 'lucide-react'
import axios from 'axios'
import { CATEGORIES } from '../components/CategoriesSection'

const API = import.meta.env.VITE_API_URL || '/api'

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
    <div className="min-h-screen pt-28 pb-24 px-6">
      <div className="container-width">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <p className="label-text mb-4">Blog</p>
          <h1 className="heading-xl text-white">Latest Updates</h1>
          <p className="body-muted mt-4 max-w-lg">
            Resources, opportunities, tutorials, and announcements — curated by the CodeCircle community.
          </p>
        </motion.div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3 mb-10">
          <div className="relative flex-1 max-w-sm">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-600" />
            <input
              value={search}
              onChange={e => { setSearch(e.target.value); setPage(1) }}
              placeholder="Search posts..."
              className="input-base pl-9"
            />
          </div>
          <select
            value={category}
            onChange={e => { setCategory(e.target.value); setPage(1) }}
            className="input-base w-auto min-w-[160px] cursor-pointer"
          >
            <option value="all">All Topics</option>
            {CATEGORIES.map(c => (
              <option key={c.slug} value={c.slug}>{c.title}</option>
            ))}
          </select>
        </div>

        {/* Posts grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[...Array(9)].map((_, i) => (
              <div key={i} className="glass rounded-xl h-56 animate-pulse" />
            ))}
          </div>
        ) : posts.length === 0 ? (
          <div className="glass rounded-xl p-12 text-center text-neutral-500">
            No posts found.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {posts.map((post, i) => (
              <motion.div
                key={post._id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <Link
                  to={`/blog/${post._id}`}
                  className="group flex flex-col h-full glass rounded-xl overflow-hidden hover:border-white/20 transition-all"
                >
                  {post.image && (
                    <img
                      src={post.image}
                      alt={post.title}
                      className="w-full h-40 object-cover opacity-80 group-hover:opacity-100 transition-opacity"
                    />
                  )}
                  <div className="p-5 flex flex-col flex-1">
                    {post.category && <span className="label-text mb-2">{post.category}</span>}
                    <h2 className="font-medium text-white text-base leading-snug mb-2 line-clamp-2 group-hover:text-neutral-200 transition-colors">
                      {post.title}
                    </h2>
                    <p className="text-sm text-neutral-500 line-clamp-2 flex-1">{post.excerpt}</p>
                    <div className="mt-4 flex items-center gap-4 text-xs text-neutral-700">
                      <span className="flex items-center gap-1">
                        <Calendar size={10} />
                        {new Date(post.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </span>
                      <span className="flex items-center gap-1">
                        <User size={10} />
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
          <div className="flex items-center justify-center gap-2 mt-10">
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
              className="btn-ghost disabled:opacity-30 disabled:cursor-not-allowed text-sm"
            >
              Previous
            </button>
            <span className="text-sm text-neutral-500">
              {page} / {totalPages}
            </span>
            <button
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="btn-ghost disabled:opacity-30 disabled:cursor-not-allowed text-sm"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
