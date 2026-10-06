import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import axios from 'axios'
import { motion } from 'framer-motion'
import { CheckCircle2, AlertTriangle, ArrowLeft, Calendar, Award, ExternalLink, Globe, MessageSquare, Linkedin, Share2 } from 'lucide-react'
import { getApiBase } from '../lib/utils'
import Seo from '../components/Seo'

const API = getApiBase()

const TIER_META = {
  codespark:  { label: 'Spark',     color: 'text-[#6b21a8]',  bg: 'bg-[#faf5ff] border-[#e9d5ff]',  pillBg: 'bg-[#f3e8ff]', icon: '⚡', iconUrl: '/assets/badge_spark.jpg' },
  codeflame:  { label: 'Catalyst',  color: 'text-[#c2410c]',  bg: 'bg-[#fff7ed] border-[#fed7aa]',  pillBg: 'bg-[#ffedd5]', icon: '🔥', iconUrl: '/assets/badge_catalyst.jpg' },
  codeelite:  { label: 'Titan',     color: 'text-[#a16207]',  bg: 'bg-[#fefce8] border-[#fef08a]',  pillBg: 'bg-[#fef9c3]', icon: '👑', iconUrl: '/assets/badge_titan.jpg' },
  custom:     { label: 'Custom',    color: 'text-[#0369a1]',  bg: 'bg-[#f0f9ff] border-[#bae6fd]',  pillBg: 'bg-[#e0f2fe]', icon: '✨' },
}

export default function VerifyCertificate() {
  const { certId } = useParams()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [data, setData] = useState(null)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    setLoading(true)
    setError(null)
    axios.get(`${API}/certificates/${certId}/verify`)
      .then(res => {
        setData(res.data.cert)
      })
      .catch(err => {
        setError(err.response?.data?.error || 'Certificate could not be verified.')
      })
      .finally(() => {
        setLoading(false)
      })
  }, [certId])

  const copyLink = () => {
    navigator.clipboard.writeText(window.location.href)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const monthLabel = (m, y) =>
    new Date(y, m - 1).toLocaleString('default', { month: 'long', year: 'numeric' })

  if (loading) {
    return (
      <div className="min-h-screen bg-canvas pt-32 pb-24 px-6 flex flex-col items-center justify-center">
        <div className="w-10 h-10 rounded-full border-3 border-canvas-soft border-t-ink animate-spin mb-4" />
        <div className="text-body text-sm font-medium">Verifying certificate authenticity...</div>
      </div>
    )
  }

  if (error || !data) {
    return (
      <div className="min-h-screen bg-canvas pt-32 pb-24 px-6 flex flex-col items-center justify-center">
        <div className="bg-canvas-soft rounded-wise-xl p-8 max-w-md w-full text-center border border-canvas-soft">
          <AlertTriangle className="mx-auto text-negative mb-4" size={44} />
          <h2 className="text-xl font-bold text-ink mb-2">Verification Failed</h2>
          <p className="text-sm text-body mb-6">{error || 'This certificate record is invalid or does not exist.'}</p>
          <Link to="/" className="btn-primary w-full justify-center">
            Back to Home
          </Link>
        </div>
      </div>
    )
  }

  const meta = TIER_META[data.tier] || TIER_META.custom
  const profileSlug = data.username || data.userId

  return (
    <div className="min-h-screen bg-canvas pt-32 pb-24 px-6">
      <Seo
        title={`Verified Achievement: ${data.userName} — ${data.badgeName} | CodeCircle — CodeCircle.online`}
        description={`Official verified Certificate of Achievement awarded to ${data.userName} for contributions to CodeCircle (Code Circle / CodeCircle.online). Certificate ID: ${certId}.`}
        keywords={`CodeCircle certificate, ${data.userName}, Code Circle, CodeCircle.online, verified credential, student tech achievement`}
        path={`/verify/${certId}`}
      />

      <div className="container-width max-w-2xl">
        <Link to="/" className="btn-secondary text-sm inline-flex items-center gap-2 mb-8">
          <ArrowLeft size={14} /> Back to CodeCircle
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="bg-canvas-soft rounded-wise-xl p-8 md:p-12 border border-canvas-soft shadow-sm"
        >
          {/* Status Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#d8dcd5] mb-8">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="text-positive shrink-0" size={26} />
              <div>
                <span className="inline-block text-xs font-bold uppercase tracking-wider text-positive-deep bg-primary-pale px-3 py-1 rounded-wise-pill border border-primary/20">
                  Verified Authentic Credential
                </span>
                <p className="text-xs text-mute font-mono mt-1.5">ID: {data._id}</p>
              </div>
            </div>
            <button
              onClick={copyLink}
              className="btn-secondary text-xs py-2 px-3.5 flex items-center gap-1.5 self-start sm:self-auto"
            >
              <Share2 size={13} /> {copied ? 'Link Copied!' : 'Share Verification'}
            </button>
          </div>

          {/* Profile Card */}
          <div className="flex items-center gap-4 mb-8 bg-canvas rounded-wise-lg p-5 border border-canvas-soft">
            {data.userAvatar ? (
              <img src={data.userAvatar} alt={data.userName} className="w-14 h-14 rounded-full border-2 border-canvas shadow-sm" />
            ) : (
              <div className="w-14 h-14 rounded-full bg-canvas-soft flex items-center justify-center text-lg font-bold text-ink border-2 border-canvas">
                {data.userName.charAt(0)}
              </div>
            )}
            <div>
              <h2 className="text-xl font-black text-ink">{data.userName}</h2>
              {profileSlug ? (
                <Link to={`/u/${profileSlug}`} className="text-xs text-body hover:text-ink flex items-center gap-1 mt-0.5 font-medium transition-colors">
                  {data.username ? `@${data.username}` : 'View public profile'} <ExternalLink size={11} />
                </Link>
              ) : (
                <span className="text-xs text-mute font-medium">CodeCircle Contributor</span>
              )}
            </div>
          </div>

          {/* Achievement Details */}
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-canvas rounded-wise-lg p-5 border border-canvas-soft">
                <div className="text-xs text-mute font-bold uppercase tracking-wider">Awarded Badge</div>
                <div className="flex items-center gap-2.5 mt-2">
                  {meta.iconUrl ? (
                    <img src={meta.iconUrl} className="w-7 h-7 object-contain rounded-full" alt={data.badgeName} />
                  ) : (
                    <span className="text-2xl">{meta.icon}</span>
                  )}
                  <span className={`font-bold text-base ${meta.color}`}>{data.badgeName}</span>
                </div>
              </div>

              <div className="bg-canvas rounded-wise-lg p-5 border border-canvas-soft">
                <div className="text-xs text-mute font-bold uppercase tracking-wider">Issue Date</div>
                <div className="flex items-center gap-2 mt-2">
                  <Calendar size={18} className="text-body" />
                  <span className="font-bold text-ink text-sm">{monthLabel(data.month, data.year)}</span>
                </div>
              </div>
            </div>

            {/* Contribution description */}
            <div className="bg-canvas rounded-wise-lg p-6 border border-canvas-soft space-y-4">
              <div className="flex items-start gap-3">
                <Award className="text-ink mt-1 shrink-0" size={20} />
                <div>
                  <div className="text-xs text-mute font-bold uppercase tracking-wider mb-2">Contribution Scope</div>
                  {data.isCustom ? (
                    <div className="space-y-3">
                      <p className="text-sm text-body leading-relaxed">
                        Presented to <strong>{data.userName}</strong> for outstanding contributions to the CodeCircle community.
                      </p>
                      {data.platforms && data.platforms.length > 0 && (
                        <div className="flex flex-wrap gap-2 pt-1">
                          {data.platforms.map(p => (
                            <span key={p} className="px-3 py-1 rounded-wise-pill bg-canvas-soft border border-canvas-soft text-xs text-ink font-semibold flex items-center gap-1.5">
                              {p === 'Website' && <Globe size={11} />}
                              {p === 'WhatsApp' && <MessageSquare size={11} />}
                              {p === 'Discord' && <MessageSquare size={11} />}
                              {p === 'LinkedIn' && <Linkedin size={11} />}
                              {p}
                            </span>
                          ))}
                        </div>
                      )}
                      {data.contribution && (
                        <p className="text-xs text-body bg-canvas-soft p-3.5 rounded-wise-md border border-canvas-soft leading-relaxed">
                          {data.contribution}
                        </p>
                      )}
                    </div>
                  ) : (
                    <p className="text-sm text-body leading-relaxed">
                      Successfully shared learning resources with the student developer community to support open peer learning and collaborative growth within CodeCircle.
                    </p>
                  )}
                </div>
              </div>

              {data.customMessage && (
                <div className="pt-3 border-t border-canvas-soft">
                  <p className="text-xs italic text-body">
                    "{data.customMessage}"
                  </p>
                </div>
              )}
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-[#d8dcd5] flex items-center justify-between text-xs text-mute font-medium">
            <span>Verified by CodeCircle Community</span>
            <span>Founder: DEVIDAS CHINNARATHOD</span>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
