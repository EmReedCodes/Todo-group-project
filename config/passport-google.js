/** @format */

const GoogleStrategy = require('passport-google-oauth20').Strategy
const User           = require('../models/User')

// const passport       = require('passport')
// const mongoose       = require('mongoose')

module.exports = function (passport) {
  passport.use(
    new GoogleStrategy(
      {
        // options for the google strat
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: `http://localhost:${process.env.PORT}/auth-google/google/redirect`,
        passReqToCallback: true
      },
      async (req, accessToken, refreshToken, profile, done) => {
        console.log('passport callback function fired')

        const newUser = {
          googleId   : profile.id,
          userName   : profile.displayName,
          email      : profile.emails[0].value
          // displayName: profile.displayName,
          // firstName  : profile.name.givenName,
          // lastName   : profile.name.familyName,
          // image      : profile.photos[0].value
        }
        try {
          let user = await User.findOne({ googleId: profile.id })
          if (user) {
            done(null, user)
          } else {
            user = await User.create(newUser)
            done(null, user)
          }
        } catch (err) {
          console.error(err)
        }
      }
    )
  )

  passport.serializeUser((user, done) => {
    done(null, user.id)
  })

  passport.deserializeUser((id, done) => {
    User.findById(id, (err, user) => {
      done(err, user)
    })
  })
}
