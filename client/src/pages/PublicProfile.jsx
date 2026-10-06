import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import axios from 'axios'
import { motion } from 'framer-motion'
import { Trophy, BookOpen, CalendarDays, Copy, Check, ExternalLink, ArrowLeft } from 'lucide-react'
import { getApiBase } from '../lib/utils'
import BadgeCard, { TIER_META } from '../components/BadgeCard'
import Seo from '../components/Seo'

const API = getApiBase()

export default function PublicProfile() {
  const { username } = useParams()
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError]     = useState(null)
  const [copied, setCopied]   = useState(false)

  useEffect(() => {
    if (!username) return
    setLoading(true)
    setError(null)
    axios.get(`${API}/users/by-username/${username}`)
      .then(res => setProfile(res.data))
      .catch(() =>
        axios.get(`${API}/users/${username}/public`)
          .then(res => setProfile(res.data))
          .catch(() => setError('Profile not found.'))
      )
      .finally(() => setLoading(false))
  }, [username])

  const copyLink = async () => {
    await navigator.clipboard.writeText(window.location.href)
    setCopied(true)
    setTimeout(() => setCopied(false), 2500)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-canvas pt-32 pb-24 px-6 flex items-center justify-center">
        <div className="text-body text-sm font-medium animate-pulse">Loading profile...</div>
      </div>
    )
  }

  if (error || !profile) {
    return (
      <div className="min-h-screen bg-canvas pt-32 pb-24 px-6 flex flex-col items-center justify-center gap-4">
        <div className="text-center max-w-md bg-canvas-soft p-10 rounded-wise-xl">
          <p className="text-xl font-bold text-ink mb-2">Profile not found</p>
          <p className="text-sm text-body mb-6">{error || 'This user does not exist or has not published any resources yet.'}</p>
          <Link to="/" className="btn-primary text-sm">Back to Home</Link>
        </div>
      </div>
    )
  }

  const { user, badges, stats } = profile
  const topBadge  = badges[0]
  const topMeta   = topBadge ? TIER_META[topBadge.tier] : null
  const memberYear = new Date(user.memberSince).getFullYear()

  return (
    <div className="min-h-screen bg-canvas pt-32 pb-24 px-6">
      <Seo
        title={`${user.name} (@${user.username || 'user'}) — Contributor | CodeCircle — CodeCircle.online`}
        description={`${user.name} is a student developer and contributor on CodeCircle (Code Circle / CodeCircle.online) with ${stats.totalResources} resources shared.${topBadge ? ` Earned the ${topBadge.badgeName} badge.` : ''}`}
        keywords={`${user.name}, ${user.username}, CodeCircle contributor, Code Circle, CodeCircle.online, student developer profile`}
        path={`/u/${user.username || user._id}`}
        image={user.avatar || `${SITE_BASE_URL}/og-image.svg`}
      />

      <div className="container-width max-w-2xl mx-auto space-y-8">
        <Link to="/" className="btn-secondary text-sm inline-flex items-center gap-2">
          <ArrowLeft size={14} /> Back to CodeCircle
        </Link>

        {/* ── Profile card ─────────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-canvas-soft rounded-wise-xl p-8 md:p-10 flex flex-col items-center text-center gap-6 border border-canvas-soft shadow-sm"
        >
          {/* Avatar */}
          <div className="relative">
            <img
              src={user.avatar}
              alt={user.name}
              className="w-24 h-24 rounded-full border-4 border-canvas shadow-md"
            />
            {topMeta && (
              <div className={`absolute -bottom-1 -right-1 w-9 h-9 rounded-full border-2 border-canvas flex items-center justify-center text-lg ${topMeta.pillBg}`}>
                {topMeta.icon}
              </div>
            )}
          </div>

          {/* Name + username */}
          <div>
            <h1 className="text-2xl md:text-3xl font-black text-ink">{user.name}</h1>
            {user.username && (
              <p className="text-sm text-mute font-semibold mt-1">@{user.username}</p>
            )}
            <p className="text-xs text-body font-medium mt-2 flex items-center justify-center gap-1.5">
              <CalendarDays size={13} className="text-mute" /> Contributor since {memberYear}
            </p>
          </div>

          {/* Stats Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 w-full">
            <div className="bg-canvas rounded-wise-lg p-4 border border-canvas-soft text-center">
              <div className="text-2xl font-black text-ink">{stats.totalResources}</div>
              <div className="text-xs text-mute font-semibold mt-0.5 flex items-center gap-1 justify-center">
                <BookOpen size={11} /> Total Shared
              </div>
            </div>
            <div className="bg-canvas rounded-wise-lg p-4 border border-canvas-soft text-center">
              <div className="text-2xl font-black text-ink">{stats.monthlyResources}</div>
              <div className="text-xs text-mute font-semibold mt-0.5">This Month</div>
            </div>
            {stats.rank ? (
              <div className="bg-canvas rounded-wise-lg p-4 border border-canvas-soft text-center col-span-2 sm:col-span-1">
                <div className="text-2xl font-black text-positive flex items-center gap-1 justify-center">
                  <Trophy size={18} />#{stats.rank}
                </div>
                <div className="text-xs text-mute font-semibold mt-0.5">Leaderboard</div>
              </div>
            ) : null}
          </div>

          {/* Copy link button */}
          <button onClick={copyLink} className="btn-secondary text-xs flex items-center gap-2">
            {copied
              ? <><Check size={13} className="text-positive font-bold" /> Profile link copied!</>
              : <><Copy size={13} /> Copy profile link</>
            }
          </button>
        </motion.div>

        {/* ── Badges ───────────────────────────────────────────────────── */}
        {badges.length > 0 ? (
          <div className="space-y-4">
            <h2 className="text-xs font-bold uppercase tracking-wider text-mute">Badges Earned</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {badges.map(badge => (
                <BadgeCard
                  key={badge._id}
                  tier={badge.tier}
                  month={badge.month}
                  year={badge.year}
                  count={badge.resourceCount}
                />
              ))}
            </div>
          </div>
        ) : (
          <div className="bg-canvas-soft rounded-wise-xl p-8 text-center text-sm text-body border border-canvas-soft">
            No badges awarded yet. Check back after this month's leaderboard snapshot!
          </div>
        )}
      </div>
    </div>
  )
}
