const router = require('express').Router()
const User = require('../models/User')
const { auth, adminOnly } = require('../middleware/auth')

// GET /api/admin/users
router.get('/users', auth, adminOnly, async (req, res) => {
  try {
    const users = await User.find().sort({ createdAt: -1 })
    res.json(users)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// Admin role is fixed to the first OAuth user only.
// Contributors can submit resources, but blog/admin permissions stay locked to one admin.
router.patch('/users/:id/toggle-admin', auth, adminOnly, async (_req, res) => {
  res.status(403).json({ error: 'Only one admin is allowed. Contributors cannot be promoted.' })
})

module.exports = router
