/** @format */

//LEON'S CODE//
const editBtn   = document.querySelectorAll('.edit')
const saveBtn   = document.querySelectorAll('.save')

const deleteBtn = document.querySelectorAll('.delete')
const todoItem  = document.querySelectorAll('.check')

const todoPriority = document.querySelectorAll('.priority')

Array.from(todoPriority).forEach((el)=>{
    el.addEventListener('change', changeTodoPriority)
})

Array.from(editBtn).forEach(el => {
  el.addEventListener('click', editTodo)
})

Array.from(saveBtn).forEach(el => {
  el.addEventListener('click', saveTodo)
})

Array.from(deleteBtn).forEach(el => {
  el.addEventListener('click', deleteTodo)
})

Array.from(todoItem).forEach(el => {
  el.addEventListener('click', toggleComplete)
})

// Array.from(todoComplete).forEach(el => {
//   el.addEventListener('click', markIncomplete)
// })

function editTodo(event) {
  let parentElm  = event.target.closest('.task')
  let contentElm = parentElm.querySelector('.task-name')

  contentElm.setAttribute('contenteditable', true)
  parentElm.classList.add('todo-editing')
}

//Im looking to grab the value out of .task-name (el.todo)
async function saveTodo(event) {
  // setup loading
  event.target.setAttribute('aria-busy', 'true')
  
  let todoId     = event.target.closest('.task').dataset.id
  let parentElm  = event.target.closest('.task')
  let contentElm = parentElm.querySelector('.task-name')


  let content = contentElm.innerText
  try {
    const response = await fetch('todos/saveTodo', {
      method: 'put',
      headers: { 'Content-type': 'application/json' },
      body: JSON.stringify({
        todoIdFromJSFile: todoId,
        todo: content
      })
    })
    if (response.status == 200) {
      parentElm.classList.remove('editing')
      // location.reload()
      clientsideEditTodo(event)
    }
  } catch (err) {
    console.err(err)
  }
}

async function deleteTodo(event) {
  event.target.setAttribute('aria-busy', 'true')

  let todoId = event.target.closest('.task').dataset.id
  try {
    const response = await fetch('todos/deleteTodo', {
      method: 'delete',
      headers: { 'Content-type': 'application/json' },
      body: JSON.stringify({
        todoIdFromJSFile: todoId
      })
    })
    const data = await response.json()

    // location.reload()
    clientsideDeleteTodo(event)
  } catch (err) {
    console.err(err)
  }
}

//if time create promise.all
async function toggleComplete(event) {
  event.target.setAttribute('aria-busy', 'true')

  let todoId = event.target.closest('.task').dataset.id

  try {
    const response = await fetch('todos/toggleComplete', {
      method: 'put',
      headers: { 'Content-type': 'application/json' },
      body: JSON.stringify({
        todoIdFromJSFile: todoId
      })
    })
    const data = await response.json()

    const response2 = await fetch('todos/getTasksLeftCount')
    const data2     = await response2.json()

    if (data2.count == 0) {
      const jsConfetti = new JSConfetti()
      jsConfetti.addConfetti({
        emojis: ['🎉', '🥳', '👏', '⚡', '🎈'],
        emojiSize: 40,
        confettiNumber: 100,
        confettiColors: ['#ff0a54', '#ff477e', '#ff7096', '#ff85a1', '#fbb1bd', '#f9bec7']
      })
    }

    // location.reload()
    clientsideToggleComplete(event, data2.count)
  } catch (err) {
    console.err(err)
  }
}

async function clientsideToggleComplete(event, leftCount) {
  event.target.setAttribute('aria-busy', 'false')

  let elm = event.target.closest('.task')

  elm.classList.toggle('todo-completed')
  
  updateProgress()
}

async function clientsideDeleteTodo(event) {
  event.target.setAttribute('aria-busy', 'false')
  let elm = event.target.closest('.task')
  
  elm.remove()

  updateProgress()
}

function clientsideEditTodo(event) {
  event.target.setAttribute('aria-busy', 'false')

  let elm = event.target.closest('.task')

  elm.querySelector('[contenteditable]').setAttribute('contenteditable', false)
  elm.classList.toggle('todo-editing')
}

async function updateProgress() {
  let progBar = document.querySelector('.progress .bar progress')
  let progNum = document.querySelector('.progress .nums')

  const leftCount  = (await (await fetch('todos/getTasksLeftCount')).json()).count
  const totalCount = (await (await fetch('todos/getTotalTasksCount')).json()).count
  const completed  = totalCount - leftCount

  progBar.setAttribute('value', completed)
  progBar.setAttribute('max', totalCount)

  progNum.innerText = `${completed} / ${totalCount}`

}

function toggleLightDark(setTheme = null) {
  // get elm and current theme
  let root     = document.querySelector('html')
  let theme    = root.getAttribute('data-theme')
  let themeElm = document.querySelector(".user-info .theme")

  // set new theme
  let newTheme = ''
  let inverse = ''

  if (setTheme != null) {
    newTheme = setTheme
  } else {
    if (theme == 'light') {
      newTheme = 'dark'
    } else {
      newTheme = 'light'
    }
  }

  if (newTheme == 'light') {
    inverse  = 'dark'
  } else {
    inverse  = 'light'
  }

  root.setAttribute('data-theme', newTheme)
  themeElm.innerText = inverse

  // save to storage
  storeTheme(newTheme)
}

function loadLightDark() {
  let loadedTheme = readTheme()
  toggleLightDark(loadedTheme)
}

function readTheme() {
  return localStorage.getItem('theme')
}

function storeTheme(theme) {
  localStorage.setItem('theme', theme)
}

loadLightDark()

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