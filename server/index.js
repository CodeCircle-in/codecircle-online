require('dotenv').config()
const express = require('express')
const cors = require('cors')
const mongoose = require('mongoose')
const passport = require('passport')

require('./middleware/passport')

const app = express()

// CORS — in production lock this to your Vercel domain
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true,
}))

app.use(express.json())
app.use(passport.initialize())

// Routes
app.use('/api/auth', require('./routes/auth'))
app.use('/api/posts', require('./routes/posts'))
app.use('/api/resources', require('./routes/resources'))
app.use('/api/admin', require('./routes/admin'))

// Health
app.get('/api/health', (_, res) => res.json({ status: 'ok' }))

// MongoDB + listen
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('MongoDB connected')
    const PORT = process.env.PORT || 5000
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`))
  })
  .catch(err => { console.error('MongoDB connection failed:', err); process.exit(1) })
