const router = require('express').Router()
const Resource = require('../models/Resource')
const { auth, adminOnly } = require('../middleware/auth')

// GET /api/resources — public
router.get('/', async (req, res) => {
  try {
    const { limit = 12, category } = req.query
    const query = {}
    if (category) query.category = category
    const resources = await Resource.find(query).sort({ createdAt: -1 }).limit(Number(limit))
    res.json({ resources })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// POST /api/resources — admin only
router.post('/', auth, adminOnly, async (req, res) => {
  try {
    const resource = await Resource.create({ ...req.body, submittedBy: req.user._id })
    res.status(201).json(resource)
  } catch (err) {
    res.status(400).json({ error: err.message })
  }
})

// PUT /api/resources/:id — admin only
router.put('/:id', auth, adminOnly, async (req, res) => {
  try {
    const resource = await Resource.findByIdAndUpdate(req.params.id, req.body, { new: true })
    if (!resource) return res.status(404).json({ error: 'Not found' })
    res.json(resource)
  } catch (err) {
    res.status(400).json({ error: err.message })
  }
})

// DELETE /api/resources/:id — admin only
router.delete('/:id', auth, adminOnly, async (req, res) => {
  try {
    await Resource.findByIdAndDelete(req.params.id)
    res.json({ ok: true })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

module.exports = router
