const passport = require('passport')
const GoogleStrategy = require('passport-google-oauth20').Strategy
const User = require('../models/User')
const serverUrl = process.env.SERVER_URL

if (!serverUrl) {
  throw new Error('SERVER_URL is required')
}

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: `${serverUrl}/api/auth/google/callback`,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        let user = await User.findOne({ googleId: profile.id })
        if (!user) {
          // First user ever becomes admin
          const count = await User.countDocuments()
          user = await User.create({
            googleId: profile.id,
            name: profile.displayName,
            email: profile.emails[0].value,
            avatar: profile.photos[0]?.value,
            isAdmin: count === 0,
          })
        }
        return done(null, user)
      } catch (err) {
        return done(err, null)
      }
    }
  )
)
