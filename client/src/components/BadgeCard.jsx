import { motion } from 'framer-motion'

const TIER_META = {
  codespark: {
    label: 'Spark',
    icon: '⚡',
    iconUrl: '/assets/badge_spark.jpg',
    color: 'text-[#6b21a8]',
    border: 'border-[#e9d5ff]',
    bg: 'bg-[#faf5ff]',
    pillBg: 'bg-[#f3e8ff]',
    desc: '1+ resources shared this month',
  },
  codeflame: {
    label: 'Catalyst',
    icon: '🔥',
    iconUrl: '/assets/badge_catalyst.jpg',
    color: 'text-[#c2410c]',
    border: 'border-[#fed7aa]',
    bg: 'bg-[#fff7ed]',
    pillBg: 'bg-[#ffedd5]',
    desc: '5+ resources shared this month',
  },
  codeelite: {
    label: 'Titan',
    icon: '👑',
    iconUrl: '/assets/badge_titan.jpg',
    color: 'text-[#a16207]',
    border: 'border-[#fef08a]',
    bg: 'bg-[#fefce8]',
    pillBg: 'bg-[#fef9c3]',
    desc: '10+ resources shared this month',
  },
}

/**
 * BadgeCard — displays a single badge with Wise aesthetic.
 *
 * Props:
 *   tier      — 'codespark' | 'codeflame' | 'codeelite'
 *   month     — number (1-12)
 *   year      — number
 *   count     — resource count at award time
 *   compact   — if true render a smaller inline pill
 */
export default function BadgeCard({ tier, month, year, count, compact = false }) {
  const meta = TIER_META[tier]
  if (!meta) return null

  const monthName = new Date(year, month - 1).toLocaleString('default', { month: 'long' })

  if (compact) {
    return (
      <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-wise-pill border text-xs font-semibold ${meta.pillBg} ${meta.border} ${meta.color}`}>
        {meta.iconUrl ? (
          <img src={meta.iconUrl} className="w-3.5 h-3.5 object-contain rounded-full" alt={meta.label} />
        ) : (
          <span>{meta.icon}</span>
        )}
        <span>{meta.label}</span>
      </div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ y: -2 }}
      transition={{ duration: 0.2 }}
      className={`rounded-wise-xl border p-6 flex flex-col items-center text-center gap-2.5 ${meta.bg} ${meta.border} shadow-sm`}
    >
      {meta.iconUrl ? (
        <img src={meta.iconUrl} className="w-20 h-20 object-contain rounded-full shadow-sm mb-1" alt={meta.label} />
      ) : (
        <div className="text-4xl mb-1">{meta.icon}</div>
      )}
      <div className={`text-base font-bold ${meta.color}`}>{meta.label}</div>
      <div className="text-xs font-medium text-body">{monthName} {year}</div>
      {count > 0 && (
        <div className="text-xs text-mute font-medium">{count} resource{count !== 1 ? 's' : ''} shared</div>
      )}
    </motion.div>
  )
}

export { TIER_META }
