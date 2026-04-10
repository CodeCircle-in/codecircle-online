import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight, Calendar, User } from 'lucide-react'
import axios from 'axios'

const API = import.meta.env.VITE_API_URL || '/api'

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
    <section className="section-padding border-t border-white/8">
      <div className="container-width">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex items-end justify-between mb-12"
        >
          <div>
            <p className="label-text mb-4">Blog</p>
            <h2 className="heading-lg text-white">Latest Updates</h2>
          </div>
          <Link to="/blog" className="btn-ghost text-sm hidden sm:flex">
            All posts <ArrowRight size={14} />
          </Link>
        </motion.div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="glass rounded-xl h-48 animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {posts.map((post, i) => (
              <motion.div
                key={post._id}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <Link to={`/blog/${post._id}`} className="group flex flex-col h-full glass rounded-xl overflow-hidden hover:border-white/20 transition-all">
                  {post.image && (
                    <img
                      src={post.image}
                      alt={post.title}
                      className="w-full h-36 object-cover opacity-80 group-hover:opacity-100 transition-opacity"
                    />
                  )}
                  <div className="p-5 flex flex-col flex-1">
                    {post.category && (
                      <span className="label-text mb-2">{post.category}</span>
                    )}
                    <h3 className="font-medium text-white text-base leading-snug mb-2 group-hover:text-neutral-200 transition-colors line-clamp-2">
                      {post.title}
                    </h3>
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

        <div className="mt-6 sm:hidden">
          <Link to="/blog" className="btn-ghost text-sm">
            All posts <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </section>
  )
}
