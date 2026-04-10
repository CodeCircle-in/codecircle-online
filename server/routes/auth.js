const router = require('express').Router()
const passport = require('passport')
const jwt = require('jsonwebtoken')
const { auth } = require('../middleware/auth')

const isPlaceholder = (value = '') =>
  !value || value.startsWith('your_') || value.includes('replace_me')

const ensureGoogleOAuthConfigured = (req, res, next) => {
  const missing = []
  if (isPlaceholder(process.env.GOOGLE_CLIENT_ID)) missing.push('GOOGLE_CLIENT_ID')
  if (isPlaceholder(process.env.GOOGLE_CLIENT_SECRET)) missing.push('GOOGLE_CLIENT_SECRET')
  if (isPlaceholder(process.env.CLIENT_URL)) missing.push('CLIENT_URL')
  if (isPlaceholder(process.env.SERVER_URL)) missing.push('SERVER_URL')

  if (missing.length) {
    return res.status(500).json({
      message: `Google OAuth is not configured. Missing/placeholder env vars: ${missing.join(', ')}`,
    })
  }

  next()
}

const makeToken = (user) =>
  jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '30d' })

// Initiate Google OAuth
router.get('/google', ensureGoogleOAuthConfigured, passport.authenticate('google', { scope: ['profile', 'email'], session: false }))

// Google OAuth callback
router.get(
  '/google/callback',
  ensureGoogleOAuthConfigured,
  passport.authenticate('google', { session: false, failureRedirect: `${process.env.CLIENT_URL}/?auth=failed` }),
  (req, res) => {
    const token = makeToken(req.user)
    const user = {
      _id: req.user._id,
      name: req.user.name,
      email: req.user.email,
      avatar: req.user.avatar,
      isAdmin: req.user.isAdmin,
    }
    const encoded = encodeURIComponent(JSON.stringify(user))
    res.redirect(`${process.env.CLIENT_URL}/auth/callback?token=${token}&user=${encoded}`)
  }
)

// Get current user
router.get('/me', auth, (req, res) => {
  res.json({
    _id: req.user._id,
    name: req.user.name,
    email: req.user.email,
    avatar: req.user.avatar,
    isAdmin: req.user.isAdmin,
  })
})

module.exports = router
