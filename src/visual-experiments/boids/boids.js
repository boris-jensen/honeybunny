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

function timestepWithData(flock, width, height, ctx) {
  return _ => {
    ctx.clearRect(0, 0, width, height)
    paintBoids(flock, ctx)
    flock.updateVelocities()
    flock.updatePositions()
    window.requestAnimationFrame(timestep)
  }
}

function runBoids() {
  const canvas = document.getElementById('main-canvas')
  const width = canvas.width = window.innerWidth
  const height = canvas.height = window.innerHeight
  const flock = Flock.random(400, width, height)
  const ctx = canvas.getContext('2d')
  timestep = timestepWithData(flock, width, height, ctx)
  window.requestAnimationFrame(timestep);
}