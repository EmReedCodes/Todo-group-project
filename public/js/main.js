/** @format */



const editBtn = document.querySelectorAll('.edit')
const saveBtn = document.querySelectorAll('.save')

const deleteBtn = document.querySelectorAll('.del')
const todoItem = document.querySelectorAll('span.not')
const todoComplete = document.querySelectorAll('span.completed')

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

Array.from(todoComplete).forEach(el => {
  el.addEventListener('click', markIncomplete)
})

function editTodo(event) {


    let parentElm = event.target.closest("li")
    let contentElm = parentElm.querySelector(".content")
    //this is the magic that allows the super clean edit on page
    contentElm.setAttribute("contenteditable", true)
    parentElm.classList.add("editing")
  }
  

async function saveTodo(event) {
  
  //need to grab the value out of .content

  const todoId = this.parentNode.dataset.id
  console.log(todoId)

  let parentElm = event.target.closest("li")
  console.log(parentElm)
  //the element within that parentElm's
  let contentElm = parentElm.querySelector(".content")
  console.log(contentElm)
  //where is content stored?
  let content = contentElm.innerText
  
  try{
    const response = await fetch('todos/saveTodo', {
        method: 'put',
        headers: {'Content-type': 'application/json'},
        body: JSON.stringify({
            'todoIdFromJSFile': todoId,
            'todo': content
        })
    })
    const data = await response.json()
    console.log(data)
    if(response.status == 200){
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