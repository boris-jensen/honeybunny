const LOCAL_RADIUS = 150
const CLOSE_RANGE_LOCAL = LOCAL_RADIUS * 0.8
const BORDER_REPULSION_WIDTH = 50
const PUSH_FORCE = 100009
const AVG_VELOCITY_ACCELERATION_SCALE = 0.01
const LOCAL_CENTER_MASS_SCALE = 0.2

class Flock {
  constructor(count, width, height) {
    this.boids = Array.from(Array(count).keys()).map(index => randomBoid(width, height, index))
    this.width = width
    this.height = height
    this.center = new Vector(width / 2, height / 2)
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
    const localPushAcc = this.accelerationFromAvoidance(boid, localBoids)
    const localPullAcc = this.accelerationFromLocalPull(boid, localBoids)
    const centerPullAcc = this.accelerationFromCenterPull(boid)
    const totalAcc = borderAcc
      .add(avgVelocityAcc)
      .add(localPushAcc)
      .add(localPullAcc)
      .add(centerPullAcc)
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
        .map(local => initialVelocities[local.index])
        .reduce((acc, elem) => acc.add(elem), emptyVector())
        .scale(1 / localBoids.length)

      return avgVelocity.subtract(boid.velocity).scale(AVG_VELOCITY_ACCELERATION_SCALE)
    }
  }

  accelerationFromAvoidance(boid, localBoids) {
    return localBoids
      .map(local => this.pushFrom(boid, local))
      .reduce((acc, elem) => acc.add(elem), emptyVector())
      .scale(PUSH_FORCE)
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

  accelerationFromLocalPull(boid, localBoids) {
    if (localBoids.length == 0) {
      return emptyVector()
    } else {
      const localCenterMass = localBoids
        .map(local => local.position)
        .reduce((acc, elem) => acc.add(elem), emptyVector())
        .scale(1 / localBoids.length)

      return localCenterMass.subtract(boid.position).scale(LOCAL_CENTER_MASS_SCALE)
    }
  }

  accelerationFromCenterPull(boid) {
    return this.center.subtract(boid.position)  
  }

  pushFrom(boid, other) {
    const directionToBoid = boid.position.subtract(other.position)
    const length = directionToBoid.length()
    if (length < CLOSE_RANGE_LOCAL) {
      if (length == 0) {
        return emptyVector()
      } else {
        const normalized = directionToBoid.scale(1 / length)
        const force = 1 / (length * length)
        return normalized.scale(force)
      }
    } else {
      return emptyVector()
    }
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
    boid1.position
      .subtract(boid2.position)
      .isSmallerThan(LOCAL_RADIUS)
  }
}
