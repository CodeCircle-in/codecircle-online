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

// PATCH /api/admin/users/:id/toggle-admin
router.patch('/users/:id/toggle-admin', auth, adminOnly, async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
    if (!user) return res.status(404).json({ error: 'User not found' })
    user.isAdmin = !user.isAdmin
    await user.save()
    res.json(user)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

module.exports = router
