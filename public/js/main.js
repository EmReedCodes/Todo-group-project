/** @format */

//LEON'S CODE//
const editBtn   = document.querySelectorAll('.edit')
const saveBtn   = document.querySelectorAll('.save')

const deleteBtn = document.querySelectorAll('.del')
const todoItem  = document.querySelectorAll('.check')

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
  let parentElm  = event.target.closest('td').previousElementSibling
  let contentElm = parentElm.querySelector('.content')
  console.log(contentElm)
  contentElm.setAttribute('contenteditable', true)
  parentElm.closest('.todoItem').classList.add('editing')
}

//Im looking to grab the value out of .content (el.todo)
async function saveTodo(event) {
  // setup loading
  event.target.setAttribute('aria-busy', 'true')
  
  let todoId     = event.target.closest('.todoItem').dataset.id
  let parentElm  = event.target.closest('td').previousElementSibling
  let contentElm = parentElm.querySelector('.content')

  console.log(contentElm)

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
      location.reload()
    }
  } catch (err) {
    console.log(err)
  }
}

async function deleteTodo(event) {
  event.target.setAttribute('aria-busy', 'true')

  let todoId = event.target.closest('.todoItem').dataset.id
  try {
    const response = await fetch('todos/deleteTodo', {
      method: 'delete',
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

//if time create promise.all
async function toggleComplete(event) {
  event.target.setAttribute('aria-busy', 'true')

  console.log(event)
  let todoId = event.target.closest('.todoItem').dataset.id

  try {
    const response = await fetch('todos/toggleComplete', {
      method: 'put',
      headers: { 'Content-type': 'application/json' },
      body: JSON.stringify({
        todoIdFromJSFile: todoId
      })
    })
    const data = await response.json()

    const response2 = await fetch('todos/getTasksLeft')
    const data2 = await response2.json()

    console.log(data2.count)
    if (data2.count == 0) {
      const jsConfetti = new JSConfetti()
      await jsConfetti.addConfetti({
        emojis: ['🎉', '🥳', '👏', '⚡', '🎈'],
        emojiSize: 100,
        confettiNumber: 300,
        confettiColors: ['#ff0a54', '#ff477e', '#ff7096', '#ff85a1', '#fbb1bd', '#f9bec7']
      })
      //window.location.reload();
    }

    location.reload()
  } catch (err) {
    console.log(err)
  }
}

// async function markIncomplete(){
//     const todoId = this.parentNode.dataset.id

//     try{
//         const response = await fetch('todos/markIncomplete', {
//             method: 'put',
//             headers: {'Content-type': 'application/json'},
//             body: JSON.stringify({
//                 'todoIdFromJSFile': todoId
//             })
//         })
//         const data = await response.json()
//         console.log(data)
//         location.reload()
//     }catch(err){
//         console.log(err)
//     }
// }


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