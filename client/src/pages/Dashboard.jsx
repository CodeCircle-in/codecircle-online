import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { motion } from 'framer-motion'
import { Edit2, Plus, Save, Sparkles, UploadCloud, X } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { CATEGORIES } from '../components/CategoriesSection'
import { fileToDataUrl, getApiBase } from '../lib/utils'
import Seo from '../components/Seo'

const API = getApiBase()

const emptyForm = {
  title: '',
  description: '',
  category: '',
  link: '',
  image: '',
}

export default function Dashboard() {
  const { user, loading, loginWithGoogle } = useAuth()
  const navigate = useNavigate()
  const [resources, setResources] = useState([])
  const [form, setForm] = useState(emptyForm)
  const [editingId, setEditingId] = useState(null)
  const [submitting, setSubmitting] = useState(false)
  const [message, setMessage] = useState('')
  const [loadingResources, setLoadingResources] = useState(true)

  useEffect(() => {
    if (!loading && !user) {
      loginWithGoogle('/dashboard')
    }
  }, [loading, user, loginWithGoogle])

  useEffect(() => {
    if (!user) return
    setLoadingResources(true)
    axios
      .get(`${API}/resources/mine`)
      .then(res => setResources(res.data.resources || []))
      .catch(() => setMessage('Could not load your uploads.'))
      .finally(() => setLoadingResources(false))
  }, [user])

  const startEdit = (resource) => {
    setEditingId(resource._id)
    setForm({
      title: resource.title || '',
      description: resource.description || '',
      category: resource.category || '',
      link: resource.link || '',
      image: resource.image || '',
    })
    setMessage('')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const resetForm = () => {
    setEditingId(null)
    setForm(emptyForm)
  }

  const handleImageUpload = async (event) => {
    const file = event.target.files?.[0]
    if (!file) return
    const dataUrl = await fileToDataUrl(file)
    setForm(current => ({ ...current, image: dataUrl }))
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
      const refreshed = await axios.get(`${API}/resources/mine`)
      setResources(refreshed.data.resources || [])
    } catch (err) {
      if (!err.response) {
        setMessage('Could not reach server. Please check backend status.')
      } else {
        setMessage(err.response?.data?.error || 'Could not save resource.')
      }
    } finally {
      setSubmitting(false)
    }
  }

  const removeResource = async (id) => {
    if (!confirm('Delete this resource?')) return
    try {
      await axios.delete(`${API}/resources/${id}`)
      setResources(items => items.filter(resource => resource._id !== id))
      setMessage('Resource deleted.')
    } catch (err) {
      setMessage(err.response?.data?.error || 'Could not delete resource.')
    }
  }

  if (loading || !user) {
    return (
      <div className="min-h-screen pt-28 pb-24 px-6 flex items-center justify-center">
        <div className="text-neutral-500 text-sm">Loading your dashboard...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen pt-28 pb-24 px-6">
      <Seo
        title="Dashboard"
        description="Manage your uploaded resources and contributions on CodeCircle."
        path="/dashboard"
        noindex
      />
      <div className="container-width">
        <div className="mb-10 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="label-text mb-3">Contributor Dashboard</p>
            <h1 className="heading-lg text-white">Hi, {user.name.split(' ')[0]}</h1>
            <p className="body-muted mt-3 max-w-xl">
              Manage the resources you have uploaded, update old entries, or share another useful link.
            </p>
          </div>
          <button onClick={() => navigate('/submit-resource')} className="btn-ghost text-sm">
            <UploadCloud size={14} /> Upload another resource
          </button>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-[1.1fr_0.9fr] gap-8">
          <motion.form
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            onSubmit={submit}
            className="glass rounded-2xl p-6 md:p-8 flex flex-col gap-4"
          >
            <div className="flex items-center justify-between gap-4">
              <div>
                <h2 className="text-white font-medium text-lg">
                  {editingId ? 'Edit your resource' : 'Upload a resource'}
                </h2>
                <p className="text-sm text-neutral-500 mt-1">
                  {editingId ? 'Update the selected upload.' : 'Add a new contribution for the community.'}
                </p>
              </div>
              {editingId && (
                <button type="button" onClick={resetForm} className="btn-ghost text-sm">
                  <X size={14} /> Cancel
                </button>
              )}
            </div>

            <input
              required
              value={form.title}
              onChange={e => setForm(current => ({ ...current, title: e.target.value }))}
              placeholder="Title"
              className="input-base"
            />
            <textarea
              required
              value={form.description}
              onChange={e => setForm(current => ({ ...current, description: e.target.value }))}
              placeholder="Description"
              rows={4}
              className="input-base"
            />
            <select
              value={form.category}
              onChange={e => setForm(current => ({ ...current, category: e.target.value }))}
              className="input-base"
            >
              <option value="">Select category</option>
              {CATEGORIES.map(c => (
                <option key={c.slug} value={c.slug}>{c.title}</option>
              ))}
            </select>
            <input
              required
              value={form.link}
              onChange={e => setForm(current => ({ ...current, link: e.target.value }))}
              placeholder="Resource URL"
              className="input-base"
            />
            <div className="flex flex-col gap-2">
              <label className="text-xs uppercase tracking-[0.2em] text-neutral-600">Image upload</label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="input-base file:mr-4 file:rounded-lg file:border-0 file:bg-white file:px-3 file:py-2 file:text-xs file:font-medium file:text-black hover:file:bg-neutral-100"
              />
              {form.image && <p className="text-xs text-neutral-500">Image selected.</p>}
            </div>

            {message && <div className="text-sm text-neutral-300">{message}</div>}

            <div className="flex flex-wrap gap-3 pt-2">
              <button type="submit" disabled={submitting} className="btn-primary">
                <Save size={14} /> {submitting ? 'Saving...' : editingId ? 'Save changes' : 'Publish resource'}
              </button>
              <button type="button" onClick={resetForm} className="btn-ghost">
                <Plus size={14} /> New upload
              </button>
            </div>
          </motion.form>

          <div className="glass rounded-2xl p-6 md:p-8">
            <div className="flex items-center justify-between mb-5">
              <div>
                <h2 className="text-white font-medium text-lg">Your uploads</h2>
                <p className="text-sm text-neutral-500 mt-1">Everything you’ve shared so far.</p>
              </div>
              <div className="flex items-center gap-2 text-xs text-neutral-600">
                <Sparkles size={12} /> {resources.length} total
              </div>
            </div>

            {loadingResources ? (
              <div className="space-y-3">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="h-24 rounded-xl bg-white/5 animate-pulse" />
                ))}
              </div>
            ) : resources.length === 0 ? (
              <div className="text-sm text-neutral-500">
                You have not uploaded any resources yet.
              </div>
            ) : (
              <div className="space-y-3 max-h-[680px] overflow-auto pr-1">
                {resources.map(resource => (
                  <div key={resource._id} className="rounded-xl border border-white/10 bg-white/5 p-4">
                    <div className="flex items-start gap-3">
                      {resource.image ? (
                        <img src={resource.image} alt={resource.title} className="w-14 h-14 rounded-lg object-cover shrink-0" />
                      ) : (
                        <div className="w-14 h-14 rounded-lg bg-white/5 shrink-0" />
                      )}
                      <div className="min-w-0 flex-1">
                        <div className="text-sm font-medium text-white truncate">{resource.title}</div>
                        <div className="text-xs text-neutral-500 mt-1 line-clamp-2">{resource.description}</div>
                        <div className="mt-2 flex items-center gap-2 text-xs text-neutral-600">
                          <span className="font-mono truncate">{resource.link}</span>
                        </div>
                      </div>
                    </div>
                    <div className="mt-4 flex items-center gap-2">
                      <button onClick={() => startEdit(resource)} className="btn-ghost text-xs">
                        <Edit2 size={12} /> Edit
                      </button>
                      <button onClick={() => removeResource(resource._id)} className="btn-ghost text-xs">
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
