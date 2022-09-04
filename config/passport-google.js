const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const mongoose = require('mongoose')
const User = require('../models/User')

module.exports = function(passport) {
    passport.use(
        new GoogleStrategy({
            // options for the google strat
            clientID: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            callbackURL: `http://localhost:${process.env.PORT}/auth-google/google/redirect`
        },
        async (accessToken, refreshToken, profile, done) => {
            console.log('passport callback function fired');
            // console.log(profile);

            const newUser = {
                googleId: profile.id,
                userName: profile.displayName, 
                //displayName: profile.displayName,
                //firstName: profile.name.givenName,
                //lastName: profile.name.familyName,
                //image: profile.photos[0].value
            }
            try {
                let user = await User.findOne({googleId: profile.id})
                if(user) {
                    done(null, user)
                } else {
                    user = await User.create(newUser)
                    done(null, user)
                }
            } catch (err) {
                console.error(err)
            }
        })
    );

    passport.serializeUser((user,done) => {
        done(null,user.id)
    });

    passport.deserializeUser((id,done) => {
        User.findById(id,(err, user) => {
            done(err, user)
        })
    });
}
