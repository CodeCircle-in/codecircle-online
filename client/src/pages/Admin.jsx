import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Plus, Trash2, Edit2, X, Check } from 'lucide-react'
import axios from 'axios'
import { useAuth } from '../context/AuthContext'
import { CATEGORIES } from '../components/CategoriesSection'

const API = import.meta.env.VITE_API_URL || '/api'

const TABS = ['Posts', 'Resources', 'Users']

export default function Admin() {
  const { user, loading } = useAuth()
  const navigate = useNavigate()
  const [tab, setTab] = useState('Posts')
  const [posts, setPosts] = useState([])
  const [resources, setResources] = useState([])
  const [users, setUsers] = useState([])
  const [form, setForm] = useState(null)
  const [submitting, setSubmitting] = useState(false)
  const [msg, setMsg] = useState('')

  useEffect(() => {
    if (!loading && (!user || !user.isAdmin)) navigate('/')
  }, [user, loading])

  useEffect(() => { fetchData() }, [tab])

  const fetchData = () => {
    if (tab === 'Posts') {
      axios.get(`${API}/posts?limit=50`).then(r => setPosts(r.data.posts || [])).catch(() => {})
    } else if (tab === 'Resources') {
      axios.get(`${API}/resources?limit=50`).then(r => setResources(r.data.resources || [])).catch(() => {})
    } else if (tab === 'Users') {
      axios.get(`${API}/admin/users`).then(r => setUsers(r.data || [])).catch(() => {})
    }
  }

  const deletePost = async (id) => {
    if (!confirm('Delete this post?')) return
    await axios.delete(`${API}/posts/${id}`)
    fetchData()
  }

  const deleteResource = async (id) => {
    if (!confirm('Delete this resource?')) return
    await axios.delete(`${API}/resources/${id}`)
    fetchData()
  }

  const submitPost = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    try {
      if (form._id) {
        await axios.put(`${API}/posts/${form._id}`, form)
      } else {
        await axios.post(`${API}/posts`, form)
      }
      setMsg('Saved.')
      setForm(null)
      fetchData()
    } catch { setMsg('Error saving.') }
    setSubmitting(false)
    setTimeout(() => setMsg(''), 3000)
  }

  const submitResource = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    try {
      if (form._id) {
        await axios.put(`${API}/resources/${form._id}`, form)
      } else {
        await axios.post(`${API}/resources`, form)
      }
      setMsg('Saved.')
      setForm(null)
      fetchData()
    } catch { setMsg('Error saving.') }
    setSubmitting(false)
    setTimeout(() => setMsg(''), 3000)
  }

  if (loading) return null

  return (
    <div className="min-h-screen pt-28 pb-24 px-6">
      <div className="container-width">
        <div className="mb-10">
          <p className="label-text mb-3">Admin</p>
          <h1 className="heading-lg text-white">Dashboard</h1>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 mb-8 glass rounded-xl p-1 w-fit">
          {TABS.map(t => (
            <button
              key={t}
              onClick={() => { setTab(t); setForm(null) }}
              className={`px-4 py-2 rounded-lg text-sm transition-colors ${tab === t ? 'bg-white/10 text-white' : 'text-neutral-500 hover:text-white'}`}
            >
              {t}
            </button>
          ))}
        </div>

        {msg && (
          <div className="mb-6 glass border-green-500/30 rounded-lg px-4 py-3 text-sm text-green-400 flex items-center gap-2">
            <Check size={14} /> {msg}
          </div>
        )}

        {/* Posts tab */}
        {tab === 'Posts' && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-sm font-medium text-neutral-400">Blog Posts ({posts.length})</h2>
              <button
                onClick={() => setForm({ title: '', excerpt: '', content: '', category: '', image: '', link: '' })}
                className="btn-primary text-sm flex items-center gap-2"
              >
                <Plus size={14} /> New Post
              </button>
            </div>

            {form !== null && (
              <motion.form
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                onSubmit={submitPost}
                className="glass rounded-2xl p-6 mb-6 flex flex-col gap-4"
              >
                <div className="flex items-center justify-between">
                  <h3 className="font-medium text-white">{form._id ? 'Edit Post' : 'New Post'}</h3>
                  <button type="button" onClick={() => setForm(null)} className="p-1 text-neutral-600 hover:text-white transition-colors">
                    <X size={16} />
                  </button>
                </div>
                <input required value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} placeholder="Title" className="input-base" />
                <input value={form.excerpt} onChange={e => setForm(f => ({ ...f, excerpt: e.target.value }))} placeholder="Excerpt (short summary)" className="input-base" />
                <select value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))} className="input-base">
                  <option value="">No category</option>
                  {CATEGORIES.map(c => <option key={c.slug} value={c.slug}>{c.title}</option>)}
                </select>
                <input value={form.image} onChange={e => setForm(f => ({ ...f, image: e.target.value }))} placeholder="Image URL (optional)" className="input-base" />
                <input value={form.link} onChange={e => setForm(f => ({ ...f, link: e.target.value }))} placeholder="Resource link (optional)" className="input-base" />
                <textarea
                  required
                  value={form.content}
                  onChange={e => setForm(f => ({ ...f, content: e.target.value }))}
                  placeholder="Full content..."
                  rows={8}
                  className="input-base"
                />
                <div className="flex gap-3">
                  <button type="submit" disabled={submitting} className="btn-primary text-sm">
                    {submitting ? 'Saving...' : 'Save Post'}
                  </button>
                  <button type="button" onClick={() => setForm(null)} className="btn-ghost text-sm">Cancel</button>
                </div>
              </motion.form>
            )}

            <div className="flex flex-col gap-px bg-white/8 rounded-2xl overflow-hidden border border-white/8">
              {posts.length === 0 && (
                <div className="bg-surface-0 px-6 py-8 text-center text-sm text-neutral-600">No posts yet.</div>
              )}
              {posts.map(post => (
                <div key={post._id} className="bg-surface-0 hover:bg-surface-1 transition-colors px-5 py-4 flex items-center gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-white text-sm truncate">{post.title}</div>
                    <div className="text-xs text-neutral-600 mt-0.5 flex items-center gap-3">
                      <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                      {post.category && <span className="label-text">{post.category}</span>}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <button onClick={() => setForm(post)} className="p-1.5 text-neutral-600 hover:text-white rounded-lg hover:bg-white/5 transition-colors">
                      <Edit2 size={13} />
                    </button>
                    <button onClick={() => deletePost(post._id)} className="p-1.5 text-neutral-600 hover:text-red-400 rounded-lg hover:bg-white/5 transition-colors">
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Resources tab */}
        {tab === 'Resources' && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-sm font-medium text-neutral-400">Resources ({resources.length})</h2>
              <button
                onClick={() => setForm({ title: '', description: '', category: '', image: '', link: '' })}
                className="btn-primary text-sm flex items-center gap-2"
              >
                <Plus size={14} /> New Resource
              </button>
            </div>

            {form !== null && (
              <motion.form
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                onSubmit={submitResource}
                className="glass rounded-2xl p-6 mb-6 flex flex-col gap-4"
              >
                <div className="flex items-center justify-between">
                  <h3 className="font-medium text-white">{form._id ? 'Edit Resource' : 'New Resource'}</h3>
                  <button type="button" onClick={() => setForm(null)} className="p-1 text-neutral-600 hover:text-white transition-colors">
                    <X size={16} />
                  </button>
                </div>
                <input required value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} placeholder="Title" className="input-base" />
                <textarea required value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} placeholder="Description" rows={3} className="input-base" />
                <select value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))} className="input-base">
                  <option value="">No category</option>
                  {CATEGORIES.map(c => <option key={c.slug} value={c.slug}>{c.title}</option>)}
                </select>
                <input required value={form.link} onChange={e => setForm(f => ({ ...f, link: e.target.value }))} placeholder="Resource URL" className="input-base" />
                <input value={form.image} onChange={e => setForm(f => ({ ...f, image: e.target.value }))} placeholder="Image URL (optional)" className="input-base" />
                <div className="flex gap-3">
                  <button type="submit" disabled={submitting} className="btn-primary text-sm">
                    {submitting ? 'Saving...' : 'Save Resource'}
                  </button>
                  <button type="button" onClick={() => setForm(null)} className="btn-ghost text-sm">Cancel</button>
                </div>
              </motion.form>
            )}

            <div className="flex flex-col gap-px bg-white/8 rounded-2xl overflow-hidden border border-white/8">
              {resources.length === 0 && (
                <div className="bg-surface-0 px-6 py-8 text-center text-sm text-neutral-600">No resources yet.</div>
              )}
              {resources.map(res => (
                <div key={res._id} className="bg-surface-0 hover:bg-surface-1 transition-colors px-5 py-4 flex items-center gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-white text-sm truncate">{res.title}</div>
                    <div className="text-xs text-neutral-600 mt-0.5 font-mono truncate">{res.link}</div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <button onClick={() => setForm(res)} className="p-1.5 text-neutral-600 hover:text-white rounded-lg hover:bg-white/5 transition-colors">
                      <Edit2 size={13} />
                    </button>
                    <button onClick={() => deleteResource(res._id)} className="p-1.5 text-neutral-600 hover:text-red-400 rounded-lg hover:bg-white/5 transition-colors">
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Users tab */}
        {tab === 'Users' && (
          <div>
            <h2 className="text-sm font-medium text-neutral-400 mb-6">Users ({users.length})</h2>
            <div className="flex flex-col gap-px bg-white/8 rounded-2xl overflow-hidden border border-white/8">
              {users.length === 0 && (
                <div className="bg-surface-0 px-6 py-8 text-center text-sm text-neutral-600">No users yet.</div>
              )}
              {users.map(u => (
                <div key={u._id} className="bg-surface-0 hover:bg-surface-1 transition-colors px-5 py-4 flex items-center gap-4">
                  <img src={u.avatar} alt={u.name} className="w-8 h-8 rounded-full border border-white/10 shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-white text-sm">{u.name}</div>
                    <div className="text-xs text-neutral-600">{u.email}</div>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <span className={`text-xs font-mono ${u.isAdmin ? 'text-blue-400' : 'text-neutral-600'}`}>
                      {u.isAdmin ? 'admin' : 'contributor'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
