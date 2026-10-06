import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight, Calendar, User } from 'lucide-react'
import axios from 'axios'
import { getApiBase } from '../lib/utils'

const API = getApiBase()

export default function BlogPreview() {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    axios
      .get(`${API}/posts?limit=3`)
      .then(res => setPosts(res.data.posts || []))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  if (!loading && posts.length === 0) return null

  return (
    <section className="section-padding bg-canvas border-t border-canvas-soft">
      <div className="container-width">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="flex items-end justify-between mb-12"
        >
          <div>
            <p className="label-text mb-3">Blog</p>
            <h2 className="heading-lg">Latest Updates & Guides</h2>
            <p className="body-muted mt-2 max-w-lg">
              Tutorials, opportunity highlights, and community updates from our writers.
            </p>
          </div>
          <Link to="/blog" className="btn-secondary text-sm hidden sm:inline-flex items-center gap-2">
            All posts <ArrowRight size={14} />
          </Link>
        </motion.div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-canvas-soft rounded-wise-xl h-64 animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {posts.map((post, i) => (
              <motion.div
                key={post._id}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08, duration: 0.4 }}
              >
                <Link
                  to={`/blog/${post._id}`}
                  className="group flex flex-col h-full bg-canvas-soft rounded-wise-xl overflow-hidden hover:bg-[#dfe3dc] transition-all duration-200 border border-transparent hover:border-ink/10"
                >
                  {post.image && (
                    <div className="w-full h-44 overflow-hidden bg-white/40">
                      <img
                        src={post.image}
                        alt={post.title}
                        className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-300"
                      />
                    </div>
                  )}
                  <div className="p-6 flex flex-col flex-1">
                    {post.category && (
                      <span className="inline-flex self-start px-3 py-1 rounded-wise-pill text-xs font-semibold mb-3 bg-white text-ink border border-canvas-soft">
                        {post.category}
                      </span>
                    )}
                    <h3 className="font-semibold text-ink text-lg leading-snug mb-2 group-hover:text-ink transition-colors line-clamp-2">
                      {post.title}
                    </h3>
                    <p className="text-sm text-body line-clamp-2 leading-relaxed flex-1 mb-4">
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

        <div className="mt-8 sm:hidden text-center">
          <Link to="/blog" className="btn-secondary text-sm w-full py-3 justify-center">
            All posts <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </section>
  )
}
