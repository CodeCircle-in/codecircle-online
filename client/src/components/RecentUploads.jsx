import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowRight, Calendar, Link2, User } from 'lucide-react'
import axios from 'axios'

const API = import.meta.env.VITE_API_URL || '/api'

export default function RecentUploads() {
  const [resources, setResources] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    axios
      .get(`${API}/resources?limit=6`)
      .then(res => setResources(res.data.resources || []))
      .catch(() => setResources([]))
      .finally(() => setLoading(false))
  }, [])

  return (
    <section className="section-padding border-t border-white/8">
      <div className="container-width">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="flex items-end justify-between mb-12"
        >
          <div>
            <p className="label-text mb-4">Recent Uploads</p>
            <h2 className="heading-lg text-white">Latest resources shared</h2>
          </div>
          <a href="/dashboard" className="btn-ghost text-sm hidden sm:flex">
            Upload more <ArrowRight size={14} />
          </a>
        </motion.div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="glass rounded-2xl h-44 animate-pulse" />
            ))}
          </div>
        ) : resources.length === 0 ? (
          <div className="glass rounded-xl p-8 text-sm text-neutral-500">
            No resources uploaded yet.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {resources.map((resource, i) => (
              <motion.a
                key={resource._id}
                href={resource.link}
                target="_blank"
                rel="noreferrer"
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05, duration: 0.4 }}
                className="group glass rounded-2xl overflow-hidden hover:border-white/20 transition-all"
              >
                {resource.image ? (
                  <img src={resource.image} alt={resource.title} className="w-full h-40 object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
                ) : (
                  <div className="w-full h-40 bg-white/5" />
                )}
                <div className="p-5">
                  {resource.category && <span className="label-text mb-2 block">{resource.category}</span>}
                  <h3 className="font-medium text-white text-base mb-2 line-clamp-2">{resource.title}</h3>
                  <p className="text-sm text-neutral-500 line-clamp-2">{resource.description}</p>
                  <div className="mt-4 flex flex-wrap items-center gap-4 text-xs text-neutral-700">
                    <span className="flex items-center gap-1">
                      <Calendar size={10} />
                      {new Date(resource.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </span>
                    <span className="flex items-center gap-1 min-w-0">
                      <User size={10} />
                      <span className="truncate">{resource.submittedBy?.name || 'Contributor'}</span>
                    </span>
                    <span className="flex items-center gap-1 truncate">
                      <Link2 size={10} />
                      Link
                    </span>
                  </div>
                </div>
              </motion.a>
            ))}
          </div>
        )}

        <div className="mt-6 sm:hidden">
          <a href="/dashboard" className="btn-ghost text-sm">
            Upload more <ArrowRight size={14} />
          </a>
        </div>
      </div>
    </section>
  )
}