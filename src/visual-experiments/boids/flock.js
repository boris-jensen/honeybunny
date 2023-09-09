const LOCAL_RADIUS = 50
const BORDER_REPULSION_WIDTH = 20

class Flock {
  constructor(count, width, height) {
    this.boids = Array.from(Array(count)).map(_ => randomBoid(width, height))
    this.width = width
    this.height = height
  }

  updateVelocities() {
    this.boids.forEach(boid => this.updateVelocity(boid))
  }

  updateVelocity(boid) {
    const borderAcc = this.accelerationFromBorders(boid)
    boid.accelerate(borderAcc)
  }

  updatePositions() {
    this.boids.forEach(boid => boid.move())
  }

  accelerationFromBorders(boid) {
    const x = boid.position.x
    const y = boid.position.y

    const accXLow = Math.max(0, BORDER_REPULSION_WIDTH - x)
    const accXHigh = Math.min(0, this.width - BORDER_REPULSION_WIDTH - x)
    const accYLow = Math.max(0, BORDER_REPULSION_WIDTH - y)
    const accYHigh = Math.min(0, this.height - BORDER_REPULSION_WIDTH - y)

    const accX = accXLow + accXHigh
    const accY = accYLow + accYHigh

    return new Vector(accX, accY)
  }
}
