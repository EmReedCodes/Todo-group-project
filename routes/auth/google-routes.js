/** @format */

const router             = require('express').Router()
const passport           = require('passport')
const homeController     = require('../../controllers/home')

// const authGoogleController        = require('../../controllers/authGoogle')
// const { ensureAuth, ensureGuest } = require('../../middleware/auth')

router.get('/', homeController.getIndex)
//router.get('/login', authGoogleController.getLogin)
//router.post('/login', authGoogleController.postLogin)
//router.get('/logout', authGoogleController.logout)
//router.get('/signup', authGoogleController.getSignup)
//router.post('/signup', authGoogleController.postSignup)

router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }))

// callback route for google to redirect to
router.get(
  '/google/redirect',
  passport.authenticate('google', {
    // res.send('you reached the callback URI from google');
    successRedirect: '/todos',
    failureRedirect: '/'
  })
)

module.exports = router
