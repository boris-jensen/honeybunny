const LOCAL_RADIUS = 50
const CLOSE_RANGE_LOCAL = LOCAL_RADIUS * 0.5
const BORDER_REPULSION_WIDTH = 50
const PUSH_FORCE = 10
const AVG_VELOCITY_ACCELERATION_SCALE = 0.005
const LOCAL_CENTER_MASS_SCALE = 0.0001

class Flock {
  constructor(boids, width, height) {
    this.boids = boids
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
    const accelerations = 
      [ emptyVector()
      , this.accelerationFromBorders(boid)
      , this.accelerationFromAvgVelocity(boid, localBoids, initialVelocities)
      , this.accelerationFromAvoidance(boid, localBoids)
      , this.accelerationFromLocalPull(boid, localBoids)
      ]
    const totalAcceleration = accelerations.reduce((total, elem) => total.add(elem), emptyVector())
    boid.accelerate(totalAcceleration)
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
      
      const avgVelocityAcc = avgVelocity.subtract(boid.velocity).scale(AVG_VELOCITY_ACCELERATION_SCALE)

      return avgVelocityAcc
    }
  }

  accelerationFromAvoidance(boid, localBoids) {
    const avoidanceAcc = localBoids
      .map(local => this.pushFrom(boid, local))
      .reduce((acc, elem) => acc.add(elem), emptyVector())
      .scale(PUSH_FORCE)

    return avoidanceAcc
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
      
      const localPull = localCenterMass.subtract(boid.position).scale(LOCAL_CENTER_MASS_SCALE)
      return localPull
    }
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
    const isLocalPair =  boid1.position
      .subtract(boid2.position)
      .isSmallerThan(LOCAL_RADIUS)

    return isLocalPair
  }
}

function randomBoids(count, width, height) {
  return Array
    .from(Array(count).keys())
    .map(index => randomBoid(width, height, index))
}

function testBoids() {
  const boids =
    [ new Boid(new Vector(100, 100), new Vector(1, 0), 0)
    , new Boid(new Vector(100, 130), new Vector(1, 0), 1)
    ]

  return boids
}
