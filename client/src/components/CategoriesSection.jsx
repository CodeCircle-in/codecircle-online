import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'

export const CATEGORIES = [
  {
    slug: 'trending-tech',
    title: 'Trending Tech',
    description: 'Stay updated with the latest technological trends and innovations shaping the industry.',
    accent: '#0284c7',
  },
  {
    slug: 'internships',
    title: 'Internships',
    description: 'Discover internship opportunities from top companies worldwide, curated for students.',
    accent: '#d97706',
  },
  {
    slug: 'ai-ml',
    title: 'AI / ML',
    description: 'Dive into artificial intelligence and machine learning — resources, papers, and projects.',
    accent: '#2563eb',
  },
  {
    slug: 'linux',
    title: 'Linux',
    description: 'Master Linux systems, commands, shell scripting, and administration skills from scratch.',
    accent: '#16a34a',
  },
  {
    slug: 'cybersecurity',
    title: 'Cybersecurity',
    description: 'Learn security practices, ethical hacking, CTF writeups, and system protection strategies.',
    accent: '#dc2626',
  },
  {
    slug: 'open-source',
    title: 'Open Source',
    description: 'Contribute to open source projects, find good first issues, and collaborate globally.',
    accent: '#059669',
  },
  {
    slug: 'web-development',
    title: 'Web Development',
    description: 'Build modern websites and applications with the latest frameworks, tools, and techniques.',
    accent: '#7c3aed',
  },
  {
    slug: 'projects-hackathons',
    title: 'Projects & Hackathons',
    description: 'Participate in exciting projects and competitive hackathons to grow your portfolio.',
    accent: '#e11d48',
  },
]

export default function CategoriesSection() {
  return (
    <section id="topics" className="section-padding bg-canvas-soft border-t border-[#d8dcd5]">
      <div className="container-width">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-14"
        >
          <p className="label-text mb-3">CodeCircle Topics</p>
          <h2 className="heading-lg">What We Share Across CodeCircle</h2>
          <p className="body-muted mt-3 max-w-xl text-base">
            Explore the diverse tech domains curated on <strong>CodeCircle.online</strong> (<strong>Code Circle</strong>) to help you advance your developer journey.
          </p>
        </motion.div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {CATEGORIES.map((cat, i) => (
            <motion.div
              key={cat.slug}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.04, duration: 0.4 }}
            >
              <Link
                to={`/category/${cat.slug}`}
                className="group flex flex-col h-full p-6 bg-canvas rounded-wise-xl hover:shadow-sm border border-transparent hover:border-ink/10 transition-all duration-200"
              >
                {/* Accent bar */}
                <div
                  className="w-8 h-1 mb-5 rounded-wise-pill transition-all duration-300 group-hover:w-12"
                  style={{ backgroundColor: cat.accent }}
                />
                <h3 className="font-bold text-ink text-lg mb-2 group-hover:text-ink">
                  {cat.title}
                </h3>
                <p className="text-sm text-body leading-relaxed flex-1 mb-4">
                  {cat.description}
                </p>
                <div className="flex items-center gap-1.5 text-xs font-semibold text-ink group-hover:gap-2.5 transition-all">
                  <span>Explore resources</span>
                  <ArrowRight size={13} />
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
