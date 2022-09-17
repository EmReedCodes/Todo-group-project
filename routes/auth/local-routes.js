/** @format */

const express                     = require('express')
const router                      = express.Router()
const authLocalController         = require('../../controllers/authLocal')
const homeController              = require('../../controllers/home')

// const { ensureAuth, ensureGuest } = require('../../middleware/auth')

router.get('/', homeController.getIndex)
router.get('/login', authLocalController.getLogin)
router.post('/login', authLocalController.postLogin)
router.get('/logout', authLocalController.logout)
router.get('/settings', authLocalController.getSettings)
router.get('/signup', authLocalController.getSignup)
router.post('/signup', authLocalController.postSignup)

module.exports = router
