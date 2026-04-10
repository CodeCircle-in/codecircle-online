import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { motion } from 'framer-motion'
import { useAuth } from '../context/AuthContext'
import { CATEGORIES } from '../components/CategoriesSection'
import { fileToDataUrl, getApiBase } from '../lib/utils'

const API = getApiBase()

export default function SubmitResource() {
  const { user, loading, loginWithGoogle } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ title: '', description: '', category: '', link: '', image: '' })
  const [submitting, setSubmitting] = useState(false)
  const [message, setMessage] = useState('')

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
      setMessage('Resource submitted successfully.')
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
      <div className="min-h-screen pt-28 pb-24 px-6 flex items-center justify-center">
        <div className="text-neutral-500 text-sm">Redirecting to Google sign in...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen pt-28 pb-24 px-6">
      <div className="container-width max-w-3xl">
        <div className="mb-10">
          <p className="label-text mb-3">Submit Resource</p>
          <h1 className="heading-lg text-white">Share a resource with the community</h1>
          <p className="body-muted mt-3 max-w-2xl">
            Add a useful link, tutorial, event, or tool for other students.
          </p>
        </div>

        <motion.form
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          onSubmit={submit}
          className="glass rounded-2xl p-6 md:p-8 flex flex-col gap-4"
        >
          <input
            required
            value={form.title}
            onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
            placeholder="Title"
            className="input-base"
          />
          <textarea
            required
            value={form.description}
            onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
            placeholder="Description"
            rows={4}
            className="input-base"
          />
          <select
            value={form.category}
            onChange={e => setForm(f => ({ ...f, category: e.target.value }))}
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
            onChange={e => setForm(f => ({ ...f, link: e.target.value }))}
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
              {submitting ? 'Submitting...' : 'Submit Resource'}
            </button>
            <button type="button" onClick={() => navigate('/')} className="btn-ghost">
              Back to Home
            </button>
          </div>
        </motion.form>
      </div>
    </div>
  )
}