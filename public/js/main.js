const editBtn = document.querySelectorAll('.edit')
const saveBtn = document.querySelectorAll('.save')

const deleteBtn = document.querySelectorAll('.del')
const todoItem = document.querySelectorAll('.check')
// const todoComplete = document.querySelectorAll('.span.not')

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
// CODE PEN
let emitterSize = 20,
dotQuantity = 40,
dotSizeMin = 6,
dotSizeMax = 8,
speed = 2.4,
gravity = 0.7,
explosionQuantity = 5,
emitter = document.querySelector('#emitter'),
explosions = [],
currentExplosion = 0,
container, i, move;

function createExplosion(container) {
  let tl = new TimelineLite({paused: true}),
  dots = [],
  angle, duration, length, dot, i, size, r, g, b;
  for (i = 0; i < dotQuantity; i++) {
    dot = document.createElement('div');
    dots.push(dot);
    dot.className = 'dot';
    r = getRandom(30, 255);
    g = getRandom(30, 230);
    b = getRandom(30, 230);
    TweenLite.set(dot, {
      backgroundColor: 'rgb('+r+','+g+','+b+')',
      visibility: 'hidden'
    });
    size = getRandom(dotSizeMin, dotSizeMax);
    container.appendChild(dot);
    angle = getRandom(0.65, 0.85) * Math.PI * 2; // a vector pointed up
    // get maximum distance from the center, factoring in size of dot, and then pick a random spot along that vector to plot a point
    length = Math.random() * (emitterSize / 2 - size / 2);
    duration = 3 + Math.random();
    // place the dot at a random spot within the emitter, and set its size
    TweenLite.set(dot, {
      x: Math.cos(angle) * length, 
      y: Math.sin(angle) * length, 
      width: size, 
      height: size, 
      xPercent: -50, 
      yPercent: -50,
      visibility: 'hidden',
      force3D: true
    });
    tl.to(dot, duration / 2, {
      opacity: 0,
      ease: RoughEase.ease.config({
        points: 20,
        strength: 1.75,
        clamp: true
      })
    }, 0).to(dot, duration, {
      visibility: 'visible',
      rotationX: '-='+getRandom(720, 1440),
      rotationZ: '+='+getRandom(720, 1440),
      physics2D: {
        angle: angle * 180 / Math.PI, // translate radians to degrees
        velocity: (100 + Math.random() * 250) * speed, // initial velocity
        gravity: 700 * gravity,
        friction: getRandom(0.1, 0.15)
      }
     }, 0).to(dot, 1.25 + Math.random(), {
      opacity: 0
    }, duration / 2);
  }
  // hide the dots at the end for improved performance (better than opacity: 0 because the browser can ignore the elements)
  // console.log('setting', dots);
  // tl.set(dots, {visibility: 'hidden'});
  return tl;
}

function explode(element) {
  let bounds = element.getBoundingClientRect(),
  explosion;
  if (++currentExplosion === explosions.length) {
    currentExplosion = 0;
  }
  explosion = explosions[currentExplosion];
  TweenLite.set(explosion.container, {
    x: bounds.left + bounds.width / 2,
    y: bounds.top + bounds.height / 2
  });
  explosion.animation.restart();
}

function getRandom(min, max) {
  let rand = min + Math.random() * (max - min);
  return rand;
}

function play() {
  move.play(0);
  let intervalCount = 0,
  interval = setInterval(function() {
    if (intervalCount < 5) {
      explode(emitter);
      intervalCount++;
    } else {
      clearInterval(interval);
    }
  }, 150);
}

function setup() {
  for (i = 0; i < explosionQuantity; i++) {
    container = document.createElement('div');
    container.className = 'dot-container';
    document.body.appendChild(container);
    explosions.push({
      container: container,
      animation: createExplosion(container)
    });
  }
  
  move = new TimelineLite({
    paused: true
  }).fromTo(emitter, 0.4, {
    left: '40%'
  }, {
    left: '60%',
    ease: Linear.easeNone
  }).fromTo(emitter, 0.4, {
    left: '60%'
  }, {
    left: '40%',
    ease: Linear.easeNone
  });
  
  document.querySelector('.check').onclick = function () {
    play();
  };
  
  play();
}

setup();

