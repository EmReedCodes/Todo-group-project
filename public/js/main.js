
//LEON'S CODE//
const editBtn = document.querySelectorAll('.edit')
const saveBtn = document.querySelectorAll('.save')

const deleteBtn = document.querySelectorAll('.del')
const todoItem = document.querySelectorAll('.check')



// const todoComplete = document.querySelectorAll('.span.not')
const todoPriority = document.querySelectorAll('.priority')

Array.from(todoPriority).forEach((el)=>{
    el.addEventListener('change', changeTodoPriority)
})

Array.from(editBtn).forEach((el)=>{
    el.addEventListener('click', editTodo)
})

Array.from(saveBtn).forEach((el)=>{
    el.addEventListener('click', saveTodo)
})

Array.from(deleteBtn).forEach((el)=>{
    el.addEventListener('click', deleteTodo)
})

Array.from(todoItem).forEach(el => {
  el.addEventListener('click', markComplete)
})

// Array.from(todoComplete).forEach(el => {
//   el.addEventListener('click', markIncomplete)
// })

function editTodo(event) {
  //find closest li (I dont know why I couldnt use this.target but I had to use event.target)
    let parentElm = event.target.closest("li")
    let contentElm = parentElm.querySelector(".content")
    //this is the magic that allows the super clean edit on page
    contentElm.setAttribute("contenteditable", true)
    //since edit was clicked add the class 'editing' now
    parentElm.classList.add("editing")
  }
  
//Im looking to grab the value out of .content (el.todo)
async function saveTodo(event) {
  //this is grabbing the unique id for each document
  const todoId = this.parentNode.dataset.id
//since my save button is not a direct child I had to grab the closest li which would be the one to edit
  let parentElm = event.target.closest("li")
  //grabbing the element span we are on
  let contentElm = parentElm.querySelector(".content")
  //now here is the actual text we want to send the DB
  let content = contentElm.innerText
  console.log(content)
  try{
    const response = await fetch('todos/saveTodo', {
        method: 'put',
        headers: {'Content-type': 'application/json'},
        body: JSON.stringify({
            'todoIdFromJSFile': todoId,
            'todo': content
        })
    })
   //if we get a 200 response back from db its been added and we can remove editing class from the 'li'
    if(response.status == 200){
    //we received confirmation our word was replaced in db we can take off 'editing' 
        parentElm.classList.remove('editing')
        location.reload()
    }
    
}catch(err){
    console.log(err)
}

}

async function deleteTodo(){
    const todoId = this.parentNode.dataset.id
    console.log(todoId)
    try{
        const response = await fetch('todos/deleteTodo', {
            method: 'delete',
            headers: {'Content-type': 'application/json'},
            body: JSON.stringify({
                'todoIdFromJSFile': todoId
            })
        })
        const data = await response.json()
        console.log(data)
        location.reload()
    }catch(err){
        console.log(err)
    }
}



async function markComplete() {
  const todoId = this.parentNode.dataset.id
  try {
    const response = await fetch('todos/markComplete', {
      method: 'put',
      headers: { 'Content-type': 'application/json' },
      body: JSON.stringify({
        todoIdFromJSFile: todoId
      })
    })
    const data = await response.json()
    console.log(data)
    location.reload()
  } catch (err) {
    console.log(err)
  }
}
//hello
async function markIncomplete(){
    const todoId = this.parentNode.dataset.id
    
    try{
        const response = await fetch('todos/markIncomplete', {
            method: 'put',
            headers: {'Content-type': 'application/json'},
            body: JSON.stringify({
                'todoIdFromJSFile': todoId
            })
        })
        const data = await response.json()
        console.log(data)
        location.reload()
    }catch(err){
        console.log(err)
    }
}

async function changeTodoPriority() {

  //Grabs todoID to be used for database document retrieval
  const todoId = this.parentNode.dataset.id

  //Grabs parent task element
  let parentElm = event.target.closest("li")
  //Grabs the select element for priorities
  let contentElm = parentElm.querySelector(".priority")
  //grabs the last selected priority option
  let newPriority = contentElm.options[contentElm.selectedIndex].value;
  

  try {
    const response = await fetch('todos/changeTodoPriority', {
      method: 'put',
      headers: { 'Content-type': 'application/json' },
      body: JSON.stringify({
        todoIdFromJSFile: todoId,
        todoPriorityFromJSFile: newPriority
      })
    })
    const data = await response.json()
    console.log(data)
    location.reload()
  } catch (err) {
    console.log(err)
  }}
