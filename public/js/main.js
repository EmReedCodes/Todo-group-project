const deleteBtn = document.querySelectorAll('.del')
const todoItem = document.querySelectorAll('span.not')
const todoComplete = document.querySelectorAll('span.completed')

Array.from(deleteBtn).forEach((el)=>{
    el.addEventListener('click', deleteTodo)
})

Array.from(todoItem).forEach((el)=>{
    el.addEventListener('click', markComplete)
})

Array.from(todoComplete).forEach((el)=>{
    el.addEventListener('click', markIncomplete)
})

function edit(id, event) {
    let parentElm = event.target.closest("li")
    let contentElm = parentElm.querySelector(".content")
    //this is the magic that allows the super clean edit on page
    contentElm.setAttribute("contenteditable", true)
    parentElm.classList.add("editing")
  }
  

async function save(id, event) {
  //so leon uses below to grab id since its directly near no containers or elements between
  
  //need to grab the value out of .content
  const todoId = this.parentNode.dataset.id
  
    // let parentElm = event.target.closest("li")
    console.log(parentElm)
    //the element within that parentElm's
    let contentElm = parentElm.querySelector(".content")
    console.log(contentElm)

    let content = contentElm.innerText
  
 
    let rawResponse = await fetch("/save", {
  
  
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },

      body: JSON.stringify({ id: id, content: content })
    })
  
    if (rawResponse.status == 200) {
      parentElm.classList.remove('editing')

    
    } else { // everything is not good
      console.log(rawResponse)

      alert("something went wrong in the server")

    }

}

async function deleteTodo(){
    const todoId = this.parentNode.dataset.id
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

async function markComplete(){
    const todoId = this.parentNode.dataset.id
    try{
        const response = await fetch('todos/markComplete', {
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