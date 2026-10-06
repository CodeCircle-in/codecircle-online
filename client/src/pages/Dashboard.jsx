import { useEffect, useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { motion } from 'framer-motion'
import {
  Check, Edit2, Plus, Save, Sparkles, UploadCloud, X,
  Award, Download, Share2, Trophy, Zap, Flame, Crown, Trash2
} from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { CATEGORIES } from '../components/CategoriesSection'
import { fileToDataUrl, getApiBase } from '../lib/utils'
import Seo from '../components/Seo'
import BadgeCard, { TIER_META } from '../components/BadgeCard'
import ShareCard from '../components/ShareCard'

const API = getApiBase()
const emptyForm = { title: '', description: '', category: '', link: '', image: '' }
const TIER_ORDER = ['codespark', 'codeflame', 'codeelite']
const TIER_THRESHOLDS = { codespark: 1, codeflame: 5, codeelite: 10 }
const getCategoryMeta = (slug) => CATEGORIES.find(category => category.slug === slug)

export default function Dashboard() {
  const { user, loading, loginWithGoogle } = useAuth()
  const navigate = useNavigate()

  // Resource form
  const [resources, setResources]               = useState([])
  const [form, setForm]                         = useState(emptyForm)
  const [editingId, setEditingId]               = useState(null)
  const [submitting, setSubmitting]             = useState(false)
  const [message, setMessage]                   = useState('')
  const [loadingResources, setLoadingResources] = useState(true)

  // Badges & certificates
  const [badgeData, setBadgeData]               = useState(null)
  const [certificates, setCertificates]         = useState([])
  const [loadingBadges, setLoadingBadges]       = useState(true)

  // Leaderboard (for rank)
  const [leaderboard, setLeaderboard]           = useState([])

  // UI
  const [showShare, setShowShare]               = useState(false)
  const [downloading, setDownloading]           = useState(null)

  useEffect(() => {
    if (!loading && !user) loginWithGoogle('/dashboard')
  }, [loading, user, loginWithGoogle])

  const fetchAll = useCallback(async () => {
    if (!user) return
    setLoadingResources(true)
    setLoadingBadges(true)

    try {
      const [resRes, badgeRes, certRes, lbRes] = await Promise.allSettled([
        axios.get(`${API}/resources/mine`),
        axios.get(`${API}/badges/mine`),
        axios.get(`${API}/certificates/mine`),
        axios.get(`${API}/badges/leaderboard`),
      ])
      if (resRes.status === 'fulfilled')   setResources(resRes.value.data.resources || [])
      if (badgeRes.status === 'fulfilled') setBadgeData(badgeRes.value.data)
      if (certRes.status === 'fulfilled')  setCertificates(certRes.value.data.certificates || [])
      if (lbRes.status === 'fulfilled')    setLeaderboard(lbRes.value.data.leaderboard || [])
    } catch {
      setMessage('Could not load some data.')
    } finally {
      setLoadingResources(false)
      setLoadingBadges(false)
    }
  }, [user])

  useEffect(() => { fetchAll() }, [fetchAll])

  const startEdit = (resource) => {
    setEditingId(resource._id)
    setForm({
      title: resource.title || '',
      description: resource.description || '',
      category: resource.category || '',
      link: resource.link || '',
      image: resource.image || ''
    })
    setMessage('')
    window.scrollTo({ top: 300, behavior: 'smooth' })
  }

  const resetForm = () => { setEditingId(null); setForm(emptyForm) }

  const handleImageUpload = async (event) => {
    const file = event.target.files?.[0]
    if (!file) return
    const dataUrl = await fileToDataUrl(file)
    setForm(cur => ({ ...cur, image: dataUrl }))
  }

  const submit = async (event) => {
    event.preventDefault()
    setSubmitting(true)
    setMessage('')
    try {
      if (editingId) {
        await axios.put(`${API}/resources/${editingId}`, form)
        setMessage('Resource updated successfully.')
      } else {
        await axios.post(`${API}/resources`, form)
        setMessage('Resource uploaded successfully.')
      }
      resetForm()
      await fetchAll()
    } catch (err) {
      setMessage(!err.response ? 'Could not reach server.' : err.response?.data?.error || 'Could not save resource.')
    } finally {
      setSubmitting(false)
    }
  }

  const removeResource = async (id) => {
    if (!confirm('Delete this resource?')) return
    try {
      await axios.delete(`${API}/resources/${id}`)
      setResources(items => items.filter(r => r._id !== id))
      setMessage('Resource deleted.')
    } catch (err) {
      setMessage(err.response?.data?.error || 'Could not delete resource.')
    }
  }

  const downloadCertificate = async (cert) => {
    setDownloading(cert._id)
    try {
      const res = await axios.get(`${API}/certificates/${cert._id}/download`)
      const { imageData, badgeName } = res.data
      const link = document.createElement('a')
      link.href     = imageData
      link.download = `CodeCircle_${badgeName}_Certificate.png`
      link.click()
      setCertificates(prev => prev.map(c => c._id === cert._id ? { ...c, downloaded: true } : c))
    } catch {
      setMessage('Could not download certificate.')
    } finally {
      setDownloading(null)
    }
  }

  const currentMonth = badgeData?.currentMonth
  const myRank       = leaderboard.findIndex(e => String(e.userId) === String(user?._id)) + 1 || null
  const profileUrl   = user ? `${window.location.origin}/u/${user.username || user._id}` : ''
  const selectedCategory = getCategoryMeta(form.category)

  const count        = currentMonth?.resourceCount || 0
  const nextTier     = currentMonth?.nextTier
  const nextTarget   = nextTier ? TIER_THRESHOLDS[nextTier.tier] : 10
  const progress     = nextTier ? Math.min((count / nextTarget) * 100, 100) : 100

  const latestBadgesThisMonth = badgeData?.badges?.filter(b => {
    const now = new Date()
    return b.month === now.getMonth() + 1 && b.year === now.getFullYear()
  }) || []
  const latestBadge = latestBadgesThisMonth.sort(
    (a, b) => TIER_ORDER.indexOf(b.tier) - TIER_ORDER.indexOf(a.tier)
  )[0] || null

  if (loading || !user) {
    return (
      <div className="min-h-screen bg-canvas pt-32 pb-24 px-6 flex items-center justify-center">
        <div className="text-body text-sm font-medium animate-pulse">Loading dashboard...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-canvas">
      <Seo title="Dashboard" description="Manage your uploaded resources and contributions on CodeCircle." path="/dashboard" noindex />

      {/* Wise Hero Header Band */}
      <section className="bg-canvas-soft pt-32 pb-14 border-b border-[#d8dcd5] px-6">
        <div className="container-width">
          <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="label-text mb-2">Contributor Hub</p>
              <h1 className="heading-xl">Hi, {user.name.split(' ')[0]} 👋</h1>
              <p className="body-muted mt-2 max-w-xl text-base md:text-lg">
                Track your badge progress, manage your community uploads, and download verified certificates.
              </p>
            </div>
            <div className="flex items-center gap-3 flex-wrap">
              <button onClick={() => setShowShare(true)} className="btn-primary text-sm flex items-center gap-2">
                <Share2 size={15} /> Share Profile
              </button>
              <button onClick={() => navigate('/submit-resource')} className="btn-secondary text-sm flex items-center gap-2">
                <UploadCloud size={15} /> Upload resource
              </button>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-10">
            {[
              { label: 'Total Uploads', value: resources.length, icon: <Sparkles size={18} className="text-primary-deep" /> },
              { label: 'This Month',    value: count,             icon: <Zap size={18} className="text-warning-deep" /> },
              { label: 'Leaderboard',   value: myRank ? `#${myRank}` : '—', icon: <Trophy size={18} className="text-positive" /> },
              { label: 'Certificates',  value: certificates.length, icon: <Award size={18} className="text-ink" /> },
            ].map(stat => (
              <div key={stat.label} className="bg-canvas rounded-wise-xl p-6 border border-canvas-soft shadow-sm flex flex-col justify-between">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-mute uppercase tracking-wider">{stat.label}</span>
                  {stat.icon}
                </div>
                <div className="text-3xl font-black text-ink">{stat.value}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <section className="section-padding px-6">
        <div className="container-width space-y-12">

          {/* ── Badges & Certificates Box ─────────────────────────────────────────── */}
          <div className="bg-canvas-soft rounded-wise-xl p-8 md:p-10 border border-canvas-soft space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="heading-md flex items-center gap-2.5">
                  <Award size={22} className="text-positive-deep" /> Badges & Certificates
                </h2>
                <p className="text-sm text-body mt-1">
                  Share 1 (Spark), 5 (Catalyst), or 10 (Titan) resources in a calendar month to unlock verifiable credentials.
                </p>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="bg-canvas rounded-wise-lg p-6 border border-canvas-soft space-y-3">
              <div className="flex items-center justify-between text-xs font-bold">
                <span className="text-ink">{count} resource{count !== 1 ? 's' : ''} shared this month</span>
                {nextTier && <span className="text-body">Next milestone: {nextTier.badgeName} at {nextTarget}</span>}
                {!nextTier && count >= 10 && <span className="text-warning-deep">👑 Maximum tier achieved this month!</span>}
              </div>
              <div className="h-2.5 bg-canvas-soft rounded-wise-pill overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.8, ease: 'easeOut' }}
                  className="h-full rounded-wise-pill bg-primary"
                />
              </div>
              <div className="flex justify-between text-xs font-semibold text-mute pt-1">
                <span className="flex items-center gap-1"><Zap size={11} /> 1 Spark</span>
                <span className="flex items-center gap-1"><Flame size={11} /> 5 Catalyst</span>
                <span className="flex items-center gap-1"><Crown size={11} /> 10 Titan</span>
              </div>
            </div>

            {/* Badges Grid */}
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-mute mb-4">Earned Badges</h3>
              {loadingBadges ? (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {[...Array(3)].map((_, i) => <div key={i} className="h-36 rounded-wise-xl bg-canvas animate-pulse" />)}
                </div>
              ) : badgeData?.badges?.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {badgeData.badges.map(badge => (
                    <BadgeCard key={badge._id} tier={badge.tier} month={badge.month} year={badge.year} count={badge.resourceCount} />
                  ))}
                </div>
              ) : (
                <div className="bg-canvas rounded-wise-lg p-6 text-sm text-body border border-canvas-soft">
                  No badges yet. Upload your first resource to unlock the <strong>Spark</strong> badge!
                </div>
              )}
            </div>

            {/* Certificates List */}
            {certificates.length > 0 && (
              <div className="space-y-3 pt-2">
                <h3 className="text-xs font-bold uppercase tracking-wider text-mute mb-3">Issued Certificates</h3>
                {certificates.map(cert => {
                  const meta = TIER_META[cert.tier]
                  const monthName = new Date(cert.year, cert.month - 1).toLocaleString('default', { month: 'long' })
                  return (
                    <motion.div
                      key={cert._id}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-canvas rounded-wise-lg border border-canvas-soft p-5 flex items-center justify-between gap-4 shadow-sm"
                    >
                      <div className="flex items-center gap-4">
                        {meta?.iconUrl ? (
                          <img src={meta.iconUrl} className="w-10 h-10 object-contain rounded-full" alt={cert.badgeName} />
                        ) : (
                          <span className="text-3xl">{meta?.icon}</span>
                        )}
                        <div>
                          <div className={`font-bold text-base ${meta?.color}`}>{cert.badgeName} Certificate</div>
                          <div className="text-xs text-mute font-medium mt-0.5">
                            {monthName} {cert.year} · {cert.resourceCount} contributions
                          </div>
                        </div>
                      </div>
                      <button
                        onClick={() => downloadCertificate(cert)}
                        disabled={downloading === cert._id}
                        className="btn-primary text-xs py-2 px-4"
                      >
                        <Download size={13} />
                        <span>{downloading === cert._id ? 'Generating...' : 'Download PNG'}</span>
                      </button>
                    </motion.div>
                  )
                })}
              </div>
            )}
          </div>

          {/* ── Resource Form + Uploads List ─────────────────────────────────── */}
          <div className="grid grid-cols-1 lg:grid-cols-[minmax(340px,400px)_minmax(0,1fr)] gap-8 items-start">
            {/* Form */}
            <motion.form
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              onSubmit={submit}
              className="bg-canvas-soft rounded-wise-xl p-8 border border-canvas-soft flex flex-col gap-5"
            >
              <div className="flex items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl font-bold text-ink">{editingId ? 'Edit Resource' : 'Upload Resource'}</h2>
                  <p className="text-xs text-mute mt-1">{editingId ? 'Modify details of your upload.' : 'Share a new contribution.'}</p>
                </div>
                {editingId && (
                  <button type="button" onClick={resetForm} className="btn-secondary text-xs"><X size={13} /> Cancel</button>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-mute mb-1.5">Title</label>
                <input required value={form.title} onChange={e => setForm(cur => ({ ...cur, title: e.target.value }))} placeholder="Resource title" className="input-base" />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-mute mb-1.5">Description</label>
                <textarea required value={form.description} onChange={e => setForm(cur => ({ ...cur, description: e.target.value }))} placeholder="Description & highlights" rows={3} className="input-base" />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-mute mb-2">Category</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-2 max-h-48 overflow-y-auto pr-1">
                  {CATEGORIES.map(category => {
                    const active = form.category === category.slug
                    return (
                      <button
                        key={category.slug}
                        type="button"
                        onClick={() => setForm(cur => ({ ...cur, category: category.slug }))}
                        className={`flex items-center gap-2.5 rounded-wise-md px-3 py-2 text-left transition-colors cursor-pointer text-xs ${
                          active ? 'bg-canvas border-2 border-primary font-bold' : 'bg-canvas border border-[#d8dcd5] font-medium'
                        }`}
                      >
                        <span className="h-2.5 w-2.5 rounded-full shrink-0" style={{ backgroundColor: category.accent }} />
                        <span className="text-ink flex-1 truncate">{category.title}</span>
                        {active && <Check size={14} className="text-positive shrink-0" />}
                      </button>
                    )
                  })}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-mute mb-1.5">Link URL</label>
                <input required value={form.link} onChange={e => setForm(cur => ({ ...cur, link: e.target.value }))} placeholder="https://example.com" className="input-base" />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-mute mb-1.5">Image (optional)</label>
                <input type="file" accept="image/*" onChange={handleImageUpload} className="input-base file:mr-3 file:rounded-wise-md file:border-0 file:bg-primary file:px-3 file:py-1.5 file:text-xs file:font-semibold file:text-on-primary hover:file:bg-primary-active file:cursor-pointer" />
                {form.image && <p className="text-xs text-positive font-semibold mt-1">✓ Image attached</p>}
              </div>

              {message && (
                <div className="text-xs font-semibold p-3 bg-canvas border border-canvas-soft rounded-wise-md text-ink">
                  {message}
                </div>
              )}

              <div className="flex flex-wrap gap-2.5 pt-2">
                <button type="submit" disabled={submitting} className="btn-primary text-sm flex-1 justify-center">
                  <Save size={14} />
                  <span>{submitting ? 'Saving...' : editingId ? 'Update' : 'Publish'}</span>
                </button>
                <button type="button" onClick={resetForm} className="btn-secondary text-sm">
                  <Plus size={14} /> Clear
                </button>
              </div>
            </motion.form>

            {/* Uploads list */}
            <div className="bg-canvas-soft rounded-wise-xl p-8 border border-canvas-soft">
              <div className="mb-6 flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-ink">Your Uploads</h2>
                  <p className="text-xs text-mute mt-0.5">Everything you have shared with the community.</p>
                </div>
                <span className="rounded-wise-pill bg-canvas px-3 py-1 text-xs font-bold text-ink border border-canvas-soft">
                  {resources.length} total
                </span>
              </div>

              {loadingResources ? (
                <div className="space-y-3">
                  {[...Array(3)].map((_, i) => <div key={i} className="h-24 rounded-wise-lg bg-canvas animate-pulse" />)}
                </div>
              ) : resources.length === 0 ? (
                <div className="bg-canvas rounded-wise-lg p-8 text-center text-sm text-body border border-canvas-soft">
                  You haven't uploaded any resources yet. Use the form on the left to share your first!
                </div>
              ) : (
                <div className="space-y-3 max-h-[640px] overflow-auto pr-1">
                  {resources.map(resource => (
                    <div key={resource._id} className="bg-canvas rounded-wise-lg border border-canvas-soft p-5 shadow-sm">
                      <div className="flex items-start gap-4">
                        {resource.image ? (
                          <img src={resource.image} alt={resource.title} className="w-16 h-16 rounded-wise-md object-cover shrink-0" />
                        ) : (
                          <div className="w-16 h-16 rounded-wise-md bg-canvas-soft flex items-center justify-center shrink-0 border border-canvas-soft text-mute">
                            <Sparkles size={18} className="opacity-40" />
                          </div>
                        )}
                        <div className="min-w-0 flex-1">
                          {getCategoryMeta(resource.category) && (
                            <div className="mb-1.5 inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider" style={{ color: getCategoryMeta(resource.category).accent }}>
                              <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: getCategoryMeta(resource.category).accent }} />
                              {getCategoryMeta(resource.category).title}
                            </div>
                          )}
                          <div className="truncate text-sm font-bold text-ink">{resource.title}</div>
                          <div className="mt-1 line-clamp-2 text-xs text-body leading-relaxed">{resource.description}</div>
                        </div>
                      </div>
                      <div className="mt-4 pt-3 border-t border-canvas-soft flex items-center justify-end gap-2">
                        <button onClick={() => startEdit(resource)} className="btn-secondary text-xs py-1.5 px-3">
                          <Edit2 size={12} /> Edit
                        </button>
                        <button onClick={() => removeResource(resource._id)} className="btn-secondary text-xs py-1.5 px-3 text-negative hover:bg-[#fee2e2]">
                          <Trash2 size={12} /> Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Share Modal */}
      {showShare && (
        <ShareCard
          user={user}
          badge={latestBadge}
          resourceCount={count}
          rank={myRank || null}
          profileUrl={profileUrl}
          onClose={() => setShowShare(false)}
        />
      )}
    </div>
  )
}
