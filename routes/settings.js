/** @format */

const express            = require('express')
const router             = express.Router()
const settingsController = require('../controllers/settings')
const { ensureAuth }     = require('../middleware/auth')

router.get('/', ensureAuth, settingsController.getSettings)

router.put('/changeTheme', settingsController.changeTheme)

router.put('/changeDefaultPriority', settingsController.changeDefaultPriority)

// router.delete('/deleteTodo', settingsController.deleteTodo)

module.exports = router
