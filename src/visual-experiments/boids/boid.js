const TAU = Math.PI * 2
const MAX_SPEED = 10

class Boid {
  constructor(position, velocity) {
    this.position = position
    this.velocity = velocity
  }

  accelerate(acceleration) {
    this.velocity = this.velocity.add(acceleration)
    const speed = this.velocity.length
    if (speed > MAX_SPEED) {
      this.velocity = this.velocity.normalize().scale(MAX_SPEED)
    }
  }

  move() {
    this.position = this.position.add(this.velocity)
  }
}

function randomBoid(width, height) {
  const positionX = Math.random() * width
  const positionY = Math.random() * height
  const position = new Vector(positionX, positionY)

  const direction = Math.random() * TAU
  const speed = Math.random() * MAX_SPEED
  const velocityX = Math.cos(direction) * speed
  const velocityY = Math.sin(direction) * speed
  const velocity = new Vector(velocityX, velocityY)

  return new Boid(position, velocity)
}