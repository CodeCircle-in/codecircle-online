import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Copy, Check, Twitter, Linkedin, MessageCircle, ExternalLink } from 'lucide-react'
import { TIER_META } from './BadgeCard'

/**
 * ShareCard — modal that lets a user share their profile, badge, and ranking.
 */
export default function ShareCard({ user, badge, resourceCount, rank, profileUrl, onClose }) {
  const [copied, setCopied] = useState(false)

  const meta = badge ? TIER_META[badge.tier] : null

  const shareText = [
    `🚀 I'm a CodeCircle contributor!`,
    badge   ? `🏅 Badge: ${badge.badgeName} ${meta?.icon}` : '',
    rank    ? `🏆 Leaderboard rank: #${rank}` : '',
    resourceCount ? `📚 ${resourceCount} resource${resourceCount !== 1 ? 's' : ''} shared this month` : '',
    `\nCheck it out: ${profileUrl}`,
  ].filter(Boolean).join('\n')

  const encodedText = encodeURIComponent(shareText)
  const encodedUrl  = encodeURIComponent(profileUrl)

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(profileUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 2500)
    } catch {
      /* fallback */
    }
  }

  const shareLinks = [
    {
      label: 'Twitter / X',
      icon: <Twitter size={15} />,
      href: `https://twitter.com/intent/tweet?text=${encodedText}`,
      color: 'bg-canvas-soft text-ink hover:bg-[#dfe3dc] border border-canvas-soft',
    },
    {
      label: 'LinkedIn',
      icon: <Linkedin size={15} />,
      href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
      color: 'bg-canvas-soft text-ink hover:bg-[#dfe3dc] border border-canvas-soft',
    },
    {
      label: 'WhatsApp',
      icon: <MessageCircle size={15} />,
      href: `https://wa.me/?text=${encodedText}`,
      color: 'bg-primary text-on-primary hover:bg-primary-active border border-primary',
    },
  ]

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink/50 backdrop-blur-sm"
        onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 16 }}
          transition={{ duration: 0.2 }}
          className="bg-canvas rounded-wise-xl p-6 md:p-8 w-full max-w-md relative border border-canvas-soft shadow-2xl"
        >
          {/* Close */}
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-1.5 rounded-full bg-canvas-soft text-body hover:text-ink transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X size={16} />
          </button>

          {/* Profile card preview */}
          <div className="flex flex-col items-center text-center mb-6 gap-3">
            <img
              src={user.avatar}
              alt={user.name}
              className="w-18 h-18 rounded-full border-2 border-primary shadow-sm"
            />
            <div>
              <div className="text-ink font-bold text-xl">{user.name}</div>
              <div className="text-xs font-semibold text-mute uppercase tracking-wider mt-0.5">CodeCircle Contributor</div>
            </div>

            {/* Stats row */}
            <div className="flex items-center gap-5 mt-2 bg-canvas-soft px-5 py-3 rounded-wise-lg w-full justify-center">
              {resourceCount > 0 && (
                <div className="text-center">
                  <div className="text-lg font-black text-ink">{resourceCount}</div>
                  <div className="text-xs text-mute font-medium">resources</div>
                </div>
              )}
              {rank && (
                <div className="text-center">
                  <div className="text-lg font-black text-ink">#{rank}</div>
                  <div className="text-xs text-mute font-medium">leaderboard</div>
                </div>
              )}
              {badge && meta && (
                <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-wise-pill border text-xs font-bold ${meta.pillBg} ${meta.border} ${meta.color}`}>
                  {meta.iconUrl ? (
                    <img src={meta.iconUrl} className="w-4 h-4 object-contain rounded-full" alt={badge.badgeName} />
                  ) : (
                    <span>{meta.icon}</span>
                  )}
                  <span>{badge.badgeName}</span>
                </div>
              )}
            </div>
          </div>

          {/* Profile link */}
          <div className="mb-5">
            <div className="text-xs font-bold text-mute mb-2 uppercase tracking-wider">Your profile link</div>
            <div className="flex items-center gap-2 bg-canvas-soft border border-[#d8dcd5] rounded-wise-md px-3.5 py-2.5">
              <ExternalLink size={14} className="text-mute shrink-0" />
              <span className="text-xs text-body flex-1 truncate font-medium">{profileUrl}</span>
              <button
                onClick={copyToClipboard}
                className="shrink-0 flex items-center gap-1 text-xs font-semibold text-ink hover:text-ink/70 transition-colors cursor-pointer"
              >
                {copied ? <><Check size={13} className="text-positive" /> Copied!</> : <><Copy size={13} /> Copy</>}
              </button>
            </div>
          </div>

          {/* Share buttons */}
          <div className="text-xs font-bold text-mute mb-2 uppercase tracking-wider">Share on</div>
          <div className="flex flex-col gap-2.5">
            {shareLinks.map(link => (
              <a
                key={link.label}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className={`flex items-center gap-3 px-4 py-3 rounded-wise-lg text-sm font-semibold transition-all ${link.color}`}
              >
                {link.icon}
                <span>{link.label}</span>
                <ExternalLink size={13} className="ml-auto opacity-60" />
              </a>
            ))}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
