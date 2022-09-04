const router = require('express').Router();
const passport = require('passport');

//const authGoogleController = require('../../controllers/authGoogle') 
const homeController = require('../../controllers/home')
const { ensureAuth, ensureGuest } = require('../../middleware/auth')

router.get('/', homeController.getIndex)
//router.get('/login', authGoogleController.getLogin)
//router.post('/login', authGoogleController.postLogin)
//router.get('/logout', authGoogleController.logout)
//router.get('/signup', authGoogleController.getSignup)
//router.post('/signup', authGoogleController.postSignup)

router.get('/google',
    passport.authenticate('google', { scope: ['profile'] })); 

// callback route for google to redirect to
router.get('/google/redirect', passport.authenticate('google'), (req, res)=> {
    // res.send('you reached the callback URI from google');
    res.redirect('/todos');
});

module.exports = router
