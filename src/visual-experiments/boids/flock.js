const LOCAL_RADIUS = 40
const LOCAL_RADIUS_SQUARE = LOCAL_RADIUS * LOCAL_RADIUS
const BORDER_REPULSION_WIDTH = 50
const AVG_VELOCITY_ACCELERATION_SCALE = 0.1

class Flock {
  constructor(count, width, height) {
    this.boids = Array.from(Array(count).keys()).map(index => randomBoid(width, height, index))
    this.width = width
    this.height = height
  }

  updateVelocities() {
    const localTable = this.makeLocalBoidsTable()
    const initialVelocities = this.boids.map(boid => boid.velocity)
    this.boids.forEach(boid => this.updateVelocity(boid, localTable, initialVelocities))
  }

  updateVelocity(boid, localTable, initialVelocities) {
    const localBoids = this.localBoidsForBoid(boid, localTable)
    const borderAcc = this.accelerationFromBorders(boid)
    const avgVelocityAcc = this.accelerationFromAvgVelocity(boid, localBoids, initialVelocities)
    const totalAcc = borderAcc.add(avgVelocityAcc)
    boid.accelerate(totalAcc)
  }

  updatePositions() {
    this.boids.forEach(boid => boid.move())
  }

  accelerationFromAvgVelocity(boid, localBoids, initialVelocities) {
    if (localBoids.length == 0) {
      return emptyVector()
    } else {
      const avgVelocity = localBoids
        .map(boid => initialVelocities[boid.index])
        .reduce((acc, elem) => acc.add(elem), emptyVector())
        .scale(1 / localBoids.length)

      return avgVelocity.subtract(boid.velocity).scale(AVG_VELOCITY_ACCELERATION_SCALE)
    }
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


  localBoidsForBoid(boid, localBoidTable) {
    return this.boids.filter(otherBoid => {
      if (boid.index == otherBoid.index) {
        return false
      } else if (boid.index > otherBoid.index) {
        return localBoidTable[boid.index][otherBoid.index]
      } else {
        return localBoidTable[otherBoid.index][boid.index]
      }
    })
  }

  // Triangular table, since the relation is symmetric. A boid is never local to itself
  makeLocalBoidsTable() {
    return this.boids.map(boid => 
      Array.from(Array(boid.index)).map((_, index) =>
        this.isLocalBoidPair(boid, this.boids[index])
      )
    )
  }

  isLocalBoidPair(boid1, boid2) {
    const posDiff = boid1.position.subtract(boid2.position)
    return posDiff.x * posDiff.x + posDiff.y * posDiff.y < LOCAL_RADIUS_SQUARE
  }
}
