import { Link } from 'react-router-dom'
import { Github } from 'lucide-react'
import { CATEGORIES } from './CategoriesSection'

export default function Footer() {
  return (
    <footer className="border-t border-white/8 bg-surface-0">
      <div className="container-width section-padding">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
          {/* Brand */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-7 h-7 rounded-lg bg-white/10 border border-white/20 flex items-center justify-center">
                <span className="font-mono text-xs font-bold text-white">CC</span>
              </div>
              <span className="font-medium text-white text-sm">CodeCircle</span>
            </div>
            <p className="text-sm text-neutral-600 leading-relaxed">
              Empowering students through technology, collaboration, and continuous learning.
            </p>
            <div className="mt-5 flex gap-3">
              <a
                href="https://github.com/codecircle-online"
                target="_blank"
                rel="noreferrer"
                className="p-2 glass rounded-lg text-neutral-500 hover:text-white transition-colors"
              >
                <Github size={14} />
              </a>
            </div>
          </div>

          {/* Topics */}
          <div>
            <div className="label-text mb-4">Topics</div>
            <ul className="flex flex-col gap-2">
              {CATEGORIES.slice(0, 4).map(c => (
                <li key={c.slug}>
                  <Link
                    to={`/category/${c.slug}`}
                    className="text-sm text-neutral-600 hover:text-neutral-300 transition-colors"
                  >
                    {c.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <div className="label-text mb-4">More Topics</div>
            <ul className="flex flex-col gap-2">
              {CATEGORIES.slice(4).map(c => (
                <li key={c.slug}>
                  <Link
                    to={`/category/${c.slug}`}
                    className="text-sm text-neutral-600 hover:text-neutral-300 transition-colors"
                  >
                    {c.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Links */}
          <div>
            <div className="label-text mb-4">Connect</div>
            <ul className="flex flex-col gap-2">
              {[
                { label: 'WhatsApp', href: 'https://chat.whatsapp.com/G9coEcncT13EjxeVbk2xAE' },
                { label: 'Discord', href: 'https://discord.gg/XYUAKXET' },
                { label: 'GitHub', href: 'https://github.com/codecircle-online' },
                { label: 'Blog', to: '/blog' },
              ].map(({ label, href, to }) => (
                <li key={label}>
                  {href ? (
                    <a href={href} target="_blank" rel="noreferrer" className="text-sm text-neutral-600 hover:text-neutral-300 transition-colors">
                      {label}
                    </a>
                  ) : (
                    <Link to={to} className="text-sm text-neutral-600 hover:text-neutral-300 transition-colors">
                      {label}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="pt-6 border-t border-white/8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
          <p className="text-xs text-neutral-700">
            &copy; {new Date().getFullYear()} CodeCircle.online · Built by students, for students.
          </p>
          <p className="text-xs text-neutral-700">Open source · Free forever</p>
        </div>
      </div>
    </footer>
  )
}
