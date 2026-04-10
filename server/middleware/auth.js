const jwt = require('jsonwebtoken')
const User = require('../models/User')

const auth = async (req, res, next) => {
  const header = req.headers.authorization
  if (!header || !header.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized' })
  }
  try {
    const decoded = jwt.verify(header.split(' ')[1], process.env.JWT_SECRET)
    req.user = await User.findById(decoded.id)
    if (!req.user) return res.status(401).json({ error: 'User not found' })
    next()
  } catch {
    res.status(401).json({ error: 'Invalid token' })
  }
}

const adminOnly = (req, res, next) => {
  if (!req.user?.isAdmin) return res.status(403).json({ error: 'Forbidden' })
  next()
}

module.exports = { auth, adminOnly }
