const router = require('express').Router()
const Resource = require('../models/Resource')
const { auth, adminOnly } = require('../middleware/auth')

const canManageResource = (resource, user) => resource && (user?.isAdmin || String(resource.submittedBy) === String(user?._id))

// GET /api/resources — public
router.get('/', async (req, res) => {
  try {
    const { limit = 12, category } = req.query
    const query = {}
    if (category) query.category = category
    const resources = await Resource.find(query)
      .sort({ createdAt: -1 })
      .limit(Number(limit))
      .populate('submittedBy', 'name avatar')
    res.json({ resources })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// POST /api/resources — authenticated users can submit resources
router.post('/', auth, async (req, res) => {
  try {
    const resource = await Resource.create({ ...req.body, submittedBy: req.user._id })
    res.status(201).json(resource)
  } catch (err) {
    res.status(400).json({ error: err.message })
  }
})

// GET /api/resources/mine — authenticated users can view their own uploads
router.get('/mine', auth, async (req, res) => {
  try {
    const resources = await Resource.find({ submittedBy: req.user._id }).sort({ createdAt: -1 })
    res.json({ resources })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// PUT /api/resources/:id — admin only
router.put('/:id', auth, async (req, res) => {
  try {
    const resource = await Resource.findById(req.params.id)
    if (!resource) return res.status(404).json({ error: 'Not found' })

    if (!canManageResource(resource, req.user)) {
      return res.status(403).json({ error: 'Forbidden' })
    }

    Object.assign(resource, req.body)
    await resource.save()
    res.json(resource)
  } catch (err) {
    res.status(400).json({ error: err.message })
  }
})

// DELETE /api/resources/:id — admin only
router.delete('/:id', auth, async (req, res) => {
  try {
    const resource = await Resource.findById(req.params.id)
    if (!resource) return res.status(404).json({ error: 'Not found' })

    if (!canManageResource(resource, req.user)) {
      return res.status(403).json({ error: 'Forbidden' })
    }

    await Resource.findByIdAndDelete(req.params.id)
    res.json({ ok: true })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

module.exports = router
