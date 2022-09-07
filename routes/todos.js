/** @format */

const express         = require('express')
const router          = express.Router()
const todosController = require('../controllers/todos')
const { ensureAuth }  = require('../middleware/auth')

router.get('/', ensureAuth, todosController.getTodos)

router.get('/getTasksLeftCount', todosController.getTasksLeftCount)

router.get('/gettotalTasksCount', todosController.getTotalTasksCount)

router.post('/createTodo', todosController.createTodo)

router.put('/toggleComplete', todosController.toggleComplete)

router.put('/markIncomplete', todosController.markIncomplete)

router.put('/saveTodo', todosController.saveTodo)

router.delete('/deleteTodo', todosController.deleteTodo)

module.exports = router
