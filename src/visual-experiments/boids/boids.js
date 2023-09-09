const TAU = Math.PI * 2
const BOID_SCALE = 10
const HALF_BOID_SCALE = BOID_SCALE / 2
const BOID_MOVE = 4
const BOID_MAX_TURN = TAU / 100

class Boid {
  constructor(point, direction, id) {
    this.point = point
    this.direction = direction
    this.id = id
  }

  move() {
    this.point = newPoint(this.point, this.direction, BOID_MOVE)
  }

  turnTowardsPoint(point) {
    const vectorToPoint = new Point(point.x - this.point.x, point.y - this.point.y)
    // It goes y then x. Extended version of Math.atan, which takes y/x for the tangent
    const directionToPoint = Math.atan2(vectorToPoint.y, vectorToPoint.x)

    this.turnTowardsDirection(directionToPoint)
  }

  turnTowardsDirection(direction) {
    const angleToDirection = positiveMod(direction - this.direction, TAU)
    const turn = angleToDirection < TAU / 2 
      ? Math.min(angleToDirection, BOID_MAX_TURN)
      : Math.max(angleToDirection - TAU, -BOID_MAX_TURN)
    const newDirection = positiveMod(this.direction + turn, TAU)
    this.direction = newDirection
  }
}

function positiveMod(n, m) {
  return ((n % m) + m) % m
}

function paintBoid(boid, ctx) {
  const initial = boid.point
  const tip = newPoint(initial, boid.direction, BOID_SCALE)
  const left = newPoint(initial, boid.direction + TAU / 3, HALF_BOID_SCALE)
  const right = newPoint(initial, boid.direction - TAU / 3, HALF_BOID_SCALE)

  ctx.beginPath()
  ctx.moveTo(initial.x, initial.y)
  ctx.lineTo(right.x, right.y)
  ctx.lineTo(tip.x, tip.y)
  ctx.lineTo(left.x, left.y)
  ctx.closePath()

  ctx.fill()
}

function centerOfBoids(boids) {
  const centerX = boids.map(boid => boid.point.x).reduce((total, elem) => total + elem, 0) / boids.length
  const centerY = boids.map(boid => boid.point.y).reduce((total, elem) => total + elem, 0) / boids.length
  return new Point(centerX, centerY)
}

function randomBoid(width, height, id) {
  const x = Math.random() * width
  const y = Math.random() * height
  const direction = Math.random() * TAU
  const point = new Point(x, y)
  const boid = new Boid(point, direction, id)
  return boid
}

function initializeBoids(count, width, height) {
  const ids = Array.from(Array(count).keys())
  const boids = ids.map(id => randomBoid(width, height, id))
  return boids
}

function paintBoids(boids, ctx) {
  boids.forEach(boid => paintBoid(boid, ctx))
}

function turnBoids(boids) {
  const centerMass = centerOfBoids(boids)
  boids.forEach(boid => boid.turnTowardsPoint(centerMass))
}

function moveBoids(boids) {
  boids.forEach(boid => boid.move())
}

let timestep

function timestepWithData(boids, width, height, ctx) {
  return _ => {
    ctx.clearRect(0, 0, width, height)
    paintBoids(boids, ctx)
    const center = centerOfBoids(boids)
    ctx.fillRect(center.x, center.y, 10, 10)
    turnBoids(boids)
    moveBoids(boids)
    window.requestAnimationFrame(timestep)
  }
}

function runBoids() {
  const canvas = document.getElementById('main-canvas')
  const width = canvas.width = window.innerWidth
  const height = canvas.height = window.innerHeight
  const ctx = canvas.getContext('2d')
  const boids = initializeBoids(10, width, height)
  timestep = timestepWithData(boids,width, height, ctx)
  window.requestAnimationFrame(timestep);
}