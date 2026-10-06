import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { motion } from 'framer-motion'
import { Check, ImagePlus, Link2, UploadCloud, ArrowLeft } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { CATEGORIES } from '../components/CategoriesSection'
import { fileToDataUrl, getApiBase } from '../lib/utils'
import Seo from '../components/Seo'

const API = getApiBase()

export default function SubmitResource() {
  const { user, loading, loginWithGoogle } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ title: '', description: '', category: '', link: '', image: '' })
  const [submitting, setSubmitting] = useState(false)
  const [message, setMessage] = useState('')
  const selectedCategory = CATEGORIES.find(c => c.slug === form.category)

  useEffect(() => {
    if (!loading && !user) {
      loginWithGoogle('/submit-resource')
    }
  }, [loading, user, loginWithGoogle])

  const submit = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    setMessage('')

    try {
      await axios.post(`${API}/resources`, form)
      setMessage('Resource submitted successfully!')
      setForm({ title: '', description: '', category: '', link: '', image: '' })
      setTimeout(() => navigate('/', { replace: true }), 1200)
    } catch (err) {
      if (!err.response) {
        setMessage('Could not reach server. Please check backend status.')
      } else {
        setMessage(err.response?.data?.error || 'Could not submit resource.')
      }
    } finally {
      setSubmitting(false)
    }
  }

  const handleImageUpload = async (event) => {
    const file = event.target.files?.[0]
    if (!file) return
    const dataUrl = await fileToDataUrl(file)
    setForm(f => ({ ...f, image: dataUrl }))
  }

  if (loading || !user) {
    return (
      <div className="min-h-screen bg-canvas pt-32 pb-24 px-6 flex items-center justify-center">
        <div className="text-body text-sm font-medium animate-pulse">Redirecting to Google sign in...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-canvas">
      <Seo
        title="Submit a Resource | CodeCircle — CodeCircle.online"
        description="Share a verified tech tutorial, learning repository, internship opportunity, or developer tool with the CodeCircle (Code Circle / CodeCircle.online) student community."
        keywords="submit resource, share coding tool, CodeCircle submit, Code Circle, CodeCircle.online, student developer resources"
        path="/submit-resource"
      />

      {/* Wise Hero Header Band */}
      <section className="bg-canvas-soft pt-32 pb-14 border-b border-[#d8dcd5] px-6">
        <div className="container-width">
          <button onClick={() => navigate(-1)} className="btn-secondary text-sm mb-6 inline-flex items-center gap-2">
            <ArrowLeft size={14} /> Back
          </button>
          <div>
            <p className="label-text mb-2">Contribute</p>
            <h1 className="heading-xl">Share a Resource</h1>
            <p className="body-muted mt-2 max-w-xl text-base md:text-lg">
              Add a tutorial, tool, repository, or career opportunity to help fellow students level up.
            </p>
          </div>
        </div>
      </section>

      {/* Form Section */}
      <section className="section-padding px-6">
        <div className="container-width">
          <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_380px] gap-10 items-start">
            <motion.form
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              onSubmit={submit}
              className="bg-canvas-soft rounded-wise-xl p-8 md:p-10 flex flex-col gap-6 border border-canvas-soft"
            >
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-mute mb-2">
                  Resource Title *
                </label>
                <input
                  required
                  value={form.title}
                  onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                  placeholder="e.g. Free Fullstack DevOps Roadmap"
                  className="input-base"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-mute mb-2">
                  Direct Link / URL *
                </label>
                <input
                  required
                  value={form.link}
                  onChange={e => setForm(f => ({ ...f, link: e.target.value }))}
                  placeholder="https://example.com/guide"
                  className="input-base"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-mute mb-2">
                  Description *
                </label>
                <textarea
                  required
                  value={form.description}
                  onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                  placeholder="What makes this resource helpful? What will students learn?"
                  rows={4}
                  className="input-base"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-mute mb-3">
                  Category *
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {CATEGORIES.map(category => {
                    const active = form.category === category.slug
                    return (
                      <button
                        key={category.slug}
                        type="button"
                        onClick={() => setForm(f => ({ ...f, category: category.slug }))}
                        className={`flex items-center gap-3 rounded-wise-md px-4 py-3 text-left transition-all cursor-pointer ${
                          active
                            ? 'bg-canvas border-2 border-primary shadow-sm font-semibold'
                            : 'bg-canvas border border-[#d8dcd5] hover:border-ink/20 font-medium'
                        }`}
                      >
                        <span className="h-3 w-3 rounded-full shrink-0" style={{ backgroundColor: category.accent }} />
                        <span className="text-sm text-ink flex-1 truncate">{category.title}</span>
                        {active && <Check size={16} className="text-positive font-bold shrink-0" />}
                      </button>
                    )
                  })}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-mute mb-2">
                  Preview Image (Optional)
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="input-base file:mr-4 file:rounded-wise-md file:border-0 file:bg-primary file:px-4 file:py-2 file:text-xs file:font-semibold file:text-on-primary hover:file:bg-primary-active file:cursor-pointer"
                />
                {form.image && <p className="text-xs text-positive font-semibold mt-2">✓ Image selected</p>}
              </div>

              {message && (
                <div className={`text-sm p-4 rounded-wise-md font-semibold ${
                  message.includes('successfully') ? 'bg-primary-pale text-positive-deep' : 'bg-[#fee2e2] text-negative-darkest'
                }`}>
                  {message}
                </div>
              )}

              <div className="flex flex-wrap gap-3 pt-2">
                <button type="submit" disabled={submitting} className="btn-primary">
                  <UploadCloud size={16} />
                  <span>{submitting ? 'Submitting...' : 'Submit Resource'}</span>
                </button>
                <button type="button" onClick={() => navigate('/')} className="btn-secondary">
                  Cancel
                </button>
              </div>
            </motion.form>

            {/* Live Preview Card */}
            <aside className="bg-canvas-soft rounded-wise-xl overflow-hidden border border-canvas-soft lg:sticky lg:top-28">
              <div className="p-5 border-b border-[#d8dcd5]">
                <h3 className="text-xs font-bold uppercase tracking-wider text-mute">Live Preview</h3>
              </div>
              {form.image ? (
                <img src={form.image} alt={form.title || 'Resource preview'} className="h-48 w-full object-cover" />
              ) : (
                <div className="h-44 w-full bg-canvas flex items-center justify-center text-mute border-b border-canvas-soft">
                  <ImagePlus size={32} className="opacity-40" />
                </div>
              )}
              <div className="p-6">
                {selectedCategory && (
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-wise-pill text-xs font-bold mb-3 bg-canvas text-ink border border-canvas-soft">
                    <span className="h-2 w-2 rounded-full" style={{ backgroundColor: selectedCategory.accent }} />
                    {selectedCategory.title}
                  </div>
                )}
                <h2 className="text-ink font-bold text-lg leading-snug line-clamp-2">
                  {form.title || 'Your resource title will show here'}
                </h2>
                <p className="mt-2 text-sm text-body line-clamp-3 leading-relaxed">
                  {form.description || 'Explain why this tool or guide is valuable to other student developers.'}
                </p>
                <div className="mt-5 pt-4 border-t border-[#d8dcd5] flex items-center gap-2 text-xs text-mute truncate">
                  <Link2 size={13} className="shrink-0" />
                  <span className="truncate">{form.link || 'https://example.com'}</span>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </section>
    </div>
  )
}
