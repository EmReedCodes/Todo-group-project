/** @format */

const Todo = require('../models/Todo')

module.exports = {
    getTodos: async (req,res)=>{
        console.log(req.user)
        try{
            const todoItems = await Todo.find({userId:req.user.id})
            const itemsLeft = await Todo.countDocuments({userId:req.user.id,completed: false})
            res.render('todos.ejs', {todos: todoItems, left: itemsLeft, user: req.user})
        }catch(err){
            console.log(err)
        }
    },
    createTodo: async (req, res)=>{
        try{
            await Todo.create({todo: req.body.todoItem, completed: false, userId: req.user.id, priority: "Normal"})
            console.log('Todo has been added!')
            res.redirect('/todos')
        }catch(err){
            console.log(err)
        }
    },
    markComplete: async (req, res)=>{
        try{
            await Todo.findOneAndUpdate({_id:req.body.todoIdFromJSFile},{
                completed: true
            })
            console.log('Marked Complete')
            res.json('Marked Complete')
        }catch(err){
            console.log(err)
        }
    },
    markIncomplete: async (req, res)=>{
        try{
            await Todo.findOneAndUpdate({_id:req.body.todoIdFromJSFile},{
                completed: false
            })
            console.log('Marked Incomplete')
            res.json('Marked Incomplete')
        }catch(err){
            console.log(err)
        }
    },
    //need to send over the new text content
    saveTodo: async(req, res) => {
        try{
            await Todo.findOneAndUpdate
            ({_id: req.body.todoIdFromJSFile},
            {
            //sending over text content to db
                todo: req.body.todo
            })
            res.status(200).send({msg: "a-ok!"})
        }
        catch(err){
            console.log(err)
            res.status(400).send(err)
        }
    },
    deleteTodo: async (req, res)=>{
        console.log(req.body.todoIdFromJSFile)
        try{
            await Todo.findOneAndDelete({_id:req.body.todoIdFromJSFile},
              {Priority:Normal})
            console.log('Deleted Todo')
            res.json('Deleted It')
        }catch(err){
            console.log(err)
        }
    },

    changeTodoPriority: async (req, res) => {
      try {
        console.log(req.body)
        await Todo.findOneAndUpdate(
          { _id: req.body.todoIdFromJSFile },
          {
            priority: req.body.todoPriorityFromJSFile
          },
        )
        console.log('Changed priority')
      } catch (err) {
        console.log(err)
      }
    }
}    
