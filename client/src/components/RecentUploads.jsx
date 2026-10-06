import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight, Calendar, Link2, User, Grid } from 'lucide-react'
import axios from 'axios'
import { getApiBase } from '../lib/utils'
import { CATEGORIES } from './CategoriesSection'

const API = getApiBase()
const getCategory = (slug) => CATEGORIES.find(category => category.slug === slug)

export default function RecentUploads() {
  const [resources, setResources] = useState([])
  const [loading, setLoading] = useState(true)
  const [limit, setLimit]       = useState(6)
  const [total, setTotal]       = useState(0)

  useEffect(() => {
    setLoading(true)
    axios
      .get(`${API}/resources?limit=${limit}`)
      .then(res => {
        setResources(res.data.resources || [])
        setTotal(res.data.total || 0)
      })
      .catch(() => setResources([]))
      .finally(() => setLoading(false))
  }, [limit])

  return (
    <section className="section-padding bg-canvas border-t border-canvas-soft">
      <div className="container-width">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 gap-4"
        >
          <div>
            <p className="label-text mb-3">Resources Hub</p>
            <h2 className="heading-lg">Latest resources shared</h2>
            <p className="body-muted mt-2 max-w-lg">
              Fresh learning materials, guides, and tools contributed by students.
            </p>
          </div>
          <div className="flex items-center gap-3">
            {limit !== 'all' && total > 0 && (
              <button
                onClick={() => setLimit('all')}
                className="btn-secondary text-sm flex items-center gap-2"
              >
                <Grid size={14} /> View All ({total})
              </button>
            )}
            <Link to="/submit-resource" className="btn-primary text-sm flex items-center gap-2">
              Upload resource <ArrowRight size={14} />
            </Link>
          </div>
        </motion.div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-canvas-soft rounded-wise-xl h-64 animate-pulse" />
            ))}
          </div>
        ) : resources.length === 0 ? (
          <div className="bg-canvas-soft rounded-wise-xl p-10 text-center text-body">
            No resources uploaded yet. Be the first to share one!
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {resources.map((resource, i) => {
              const category = getCategory(resource.category)
              return (
                <motion.div
                  key={resource._id}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.04, duration: 0.4 }}
                >
                  <Link
                    to={`/resources/${resource._id}`}
                    className="group bg-canvas-soft rounded-wise-xl overflow-hidden hover:bg-[#dfe3dc] transition-all duration-200 flex flex-col justify-between h-full border border-transparent hover:border-ink/10"
                  >
                    <div>
                      {resource.image ? (
                        <div className="w-full h-44 overflow-hidden bg-white/40">
                          <img
                            src={resource.image}
                            alt={resource.title}
                            className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-300"
                          />
                        </div>
                      ) : (
                        <div className="w-full h-44 bg-canvas flex items-center justify-center text-mute border-b border-canvas-soft">
                          <Link2 size={24} className="opacity-40" />
                        </div>
                      )}
                      <div className="p-6">
                        {category && (
                          <span
                            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-wise-pill text-xs font-semibold mb-3 bg-white text-ink border border-canvas-soft"
                          >
                            <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: category.accent }} />
                            {category.title}
                          </span>
                        )}
                        <h3 className="font-semibold text-ink text-lg mb-2 line-clamp-2 group-hover:text-ink transition-colors">
                          {resource.title}
                        </h3>
                        <p className="text-sm text-body line-clamp-2 leading-relaxed">
                          {resource.description}
                        </p>
                      </div>
                    </div>
                    <div className="p-6 pt-0 mt-auto">
                      <div className="pt-4 border-t border-[#d8dcd5] flex items-center justify-between text-xs text-mute">
                        <span className="flex items-center gap-1.5">
                          <Calendar size={12} />
                          {new Date(resource.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </span>
                        <span className="flex items-center gap-1.5 max-w-[130px] truncate">
                          <User size={12} />
                          <span className="truncate">{resource.submittedBy?.name || 'Contributor'}</span>
                        </span>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              )
            })}
          </div>
        )}

        {limit !== 'all' && total > 0 && (
          <div className="mt-8 text-center sm:hidden">
            <button
              onClick={() => setLimit('all')}
              className="btn-secondary text-sm w-full py-3"
            >
              View All Resources ({total})
            </button>
          </div>
        )}
      </div>
    </section>
  )
}
