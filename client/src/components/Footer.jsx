import { Link } from 'react-router-dom'
import { Github } from 'lucide-react'
import { CATEGORIES } from './CategoriesSection'

export default function Footer() {
  return (
    <footer className="bg-ink text-canvas-soft border-t border-ink-deep">
      <div className="container-width py-16 px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          {/* Brand */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-8 h-8 rounded-wise-md bg-primary text-on-primary flex items-center justify-center font-black text-sm">
                CC
              </div>
              <span className="font-extrabold text-canvas text-base tracking-tight">
                CodeCircle <span className="text-primary text-xs font-semibold ml-1">· CodeCircle.online</span>
              </span>
            </div>
            <p className="text-sm text-mute leading-relaxed">
              <strong>CodeCircle</strong> (<strong>Code Circle</strong>) is the student tech community empowering developers through open learning resources, peer mentorship, and collaborative projects.
            </p>
            <div className="mt-6 flex gap-3">
              <a
                href="https://github.com/codecircle-online"
                target="_blank"
                rel="noreferrer"
                className="p-2.5 rounded-full bg-white/10 text-canvas-soft hover:bg-primary hover:text-on-primary transition-colors cursor-pointer"
                aria-label="GitHub"
              >
                <Github size={16} />
              </a>
            </div>
          </div>

          {/* Topics 1 */}
          <div>
            <div className="text-xs font-bold uppercase tracking-[0.18em] text-mute mb-5">Topics</div>
            <ul className="flex flex-col gap-3">
              {CATEGORIES.slice(0, 4).map(c => (
                <li key={c.slug}>
                  <Link
                    to={`/category/${c.slug}`}
                    className="text-sm text-canvas-soft/80 hover:text-primary transition-colors"
                  >
                    {c.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Topics 2 */}
          <div>
            <div className="text-xs font-bold uppercase tracking-[0.18em] text-mute mb-5">More Topics</div>
            <ul className="flex flex-col gap-3">
              {CATEGORIES.slice(4).map(c => (
                <li key={c.slug}>
                  <Link
                    to={`/category/${c.slug}`}
                    className="text-sm text-canvas-soft/80 hover:text-primary transition-colors"
                  >
                    {c.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Links */}
          <div>
            <div className="text-xs font-bold uppercase tracking-[0.18em] text-mute mb-5">Connect</div>
            <ul className="flex flex-col gap-3">
              {[
                { label: 'WhatsApp Community', href: 'https://chat.whatsapp.com/G9coEcncT13EjxeVbk2xAE' },
                { label: 'Discord Server', href: 'https://discord.gg/XYUAKXET' },
                { label: 'GitHub Repository', href: 'https://github.com/codecircle-online' },
                { label: 'Community Blog', to: '/blog' },
                { label: 'Submit a Resource', to: '/submit-resource' },
              ].map(({ label, href, to }) => (
                <li key={label}>
                  {href ? (
                    <a
                      href={href}
                      target="_blank"
                      rel="noreferrer"
                      className="text-sm text-canvas-soft/80 hover:text-primary transition-colors"
                    >
                      {label}
                    </a>
                  ) : (
                    <Link
                      to={to}
                      className="text-sm text-canvas-soft/80 hover:text-primary transition-colors"
                    >
                      {label}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs text-mute">
          <p>
            &copy; {new Date().getFullYear()} CodeCircle (Code Circle) · CodeCircle.online · Built for student developers.
          </p>
          <p>Open source · Free forever for students</p>
        </div>
      </div>
    </footer>
  )
}
