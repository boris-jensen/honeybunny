const BOID_SCALE = 10
const HALF_BOID_SCALE = BOID_SCALE / 2
const THIRD_OF_CIRCLE = TAU / 3

function paintBoid(boid, ctx) {
  const initial = boid.position
  const direction = boid.velocity.angle()
  const tip = initial.add(Vector.fromPolar(BOID_SCALE, direction))
  const left = initial.add(Vector.fromPolar(HALF_BOID_SCALE, direction + THIRD_OF_CIRCLE))
  const right = initial.add(Vector.fromPolar(HALF_BOID_SCALE, direction - THIRD_OF_CIRCLE))

  ctx.beginPath()
  ctx.moveTo(initial.x, initial.y)
  ctx.lineTo(right.x, right.y)
  ctx.lineTo(tip.x, tip.y)
  ctx.lineTo(left.x, left.y)
  ctx.closePath()

  ctx.fill()
}

function paintBoids(flock, ctx) {
  flock.boids.forEach(boid => paintBoid(boid, ctx))
}

let timestep

function timestepWithData(flock, width, height, params, ctx) {
  return _ => {
    ctx.clearRect(0, 0, width, height)
    paintBoids(flock, ctx)
    flock.updateVelocities(params)
    flock.updatePositions()
    window.requestAnimationFrame(timestep)
  }
}

function runBoids() {
  const canvas = document.getElementById('main-canvas')
  const width = canvas.width = window.innerWidth
  const height = canvas.height = window.innerHeight
  const params = initialParameters()
  hookupPointerEvents(canvas, params)
  hookupTouchEvents(canvas, params)
  hookupParams(params)
  const flock = Flock.random(400, width, height, params)
  const ctx = canvas.getContext('2d')
  timestep = timestepWithData(flock, width, height, params, ctx)
  window.requestAnimationFrame(timestep);
}

function hookupPointerEvents(canvas, params) {
  canvas.onmousedown = function() { params.mouseDown = true; }
  canvas.onmouseup = function() { params.mouseDown = false; params.pointerPosition = null }
  canvas.onmousemove = function(event) {
    event.preventDefault()
    if (params.mouseDown) {  
      params.pointerPosition = new Vector(event.offsetX, event.offsetY)
    }
  }
}

function hookupTouchEvents(canvas, params) {
  const offsetX = canvas.getBoundingClientRect().left
  const offsetY = canvas.getBoundingClientRect().top

  canvas.ontouchstart = function() { params.mouseDown = true; }
  canvas.ontouchend = function() { params.mouseDown = false; params.pointerPosition = null }
  canvas.ontouchcancel = function() { params.mouseDown = false; params.pointerPosition = null }
  canvas.ontouchmove = function(event) { 
    event.preventDefault()
    if (params.mouseDown && event.targetTouches.length > 0) {
      primaryTouch = event.targetTouches[0]
      params.pointerPosition = new Vector(primaryTouch.clientX - offsetX, primaryTouch.clientY - offsetY)
    }
  }
}

function hookupParams(params) {
  hookupRange("cohesion-scale", params, 50)
  hookupRange("avoidance-scale", params, 50)
  hookupRange("alignment-scale", params, 50)
  hookupRange("local-radius", params, 50)
  hookupRange("max-speed", params, 50)
  hookupBorders(params)
  hookupPointerBehavior(params)
}

function hookupRange(elementPrefix, params, initialPercentage) {
  const inputElement = document.getElementById(elementPrefix + "-range")
  const valueElement = document.getElementById(elementPrefix + "-value")

  inputElement.setAttribute("min", 0)
  inputElement.setAttribute("max", 100)
  inputElement.value = initialPercentage
  valueElement.innerHTML = initialPercentage
  setRangeByElementPrefix(elementPrefix, initialPercentage, params)
  inputElement.oninput = function() {
    valueElement.innerHTML = this.value
    setRangeByElementPrefix(elementPrefix, this.value, params)
  }
}

function hookupBorders(params) {
  const inputElement = document.getElementById("use-borders-checkbox")
  inputElement.checked = params.useBorders

  inputElement.oninput = function() {
    params.useBorders = inputElement.checked
  }
}

function hookupPointerBehavior(params) {
  const attractElement = document.getElementById("attract-radio")
  const repelElement = document.getElementById("repel-radio")

  if (params.pointerAttract) {
    attractElement.checked = true
  } else {
    repelElement.checked = true
  }

  attractElement.oninput = function() {
    params.pointerAttract = attractElement.checked
  }

  repelElement.oninput = function() {
    params.pointerAttract = !repelElement.checked
  }
}
