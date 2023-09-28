class Flock {
  constructor(boids, width, height) {
    this.boids = boids
    this.width = width
    this.height = height
  }

  updateVelocities() {
    const localBoidsTable = new LocalBoidsTable(this.boids)
    const forces = this.boids.map(boid => this.forcesForBoid(boid, this.boids, localBoidsTable))
    this.boids.forEach(boid => boid.accelerate(forces[boid.index]))
  }

  updatePositions() {
    this.boids.forEach(boid => boid.move(this.width, this.height))
  }

  forcesForBoid(boid, boids, localBoidsTable) {
    const localBoids = localBoidsTable.localBoidsForBoid(boid, boids)
    const avoidanceBoids = localBoidsTable.avoidanceBoidsForBoid(boid, boids)
    const accelerations =
      [ Vector.zero
      , this.borderForce(boid)
      , this.alignmentForce(boid, localBoids)
      , this.cohesionForce(boid, localBoids)
      , this.avoidanceForce(boid, avoidanceBoids)
      , this.boidAccelerationForce(boid)
      ]
    return accelerations.reduce((total, elem) => total.add(elem), Vector.zero)
  }

  alignmentForce(boid, localBoids) {
    if (localBoids.length == 0) {
      return Vector.zero
    } else {
      const avgVelocity = localBoids
        .map(local => local.velocity)
        .reduce((acc, elem) => acc.add(elem), Vector.zero)
        .scale(1 / localBoids.length)

      return avgVelocity.subtract(boid.velocity).scale(ALIGNMENT_FORCE_SCALE)
    }
  }

  /**
   * If we don't add an acceleration force, then the boids will eventually align on the global average velocity, which is 0.
   * So this keeps them in motion
   */
  boidAccelerationForce(boid) {
    return boid.velocity.scale(BOID_ACCELERATION_FORCE_SCALE)
  }

  borderForce(boid) {
    const x = boid.position.x
    const y = boid.position.y

    const accXLow = Math.max(0, BORDER_REPULSION_WIDTH - x)
    const accXHigh = Math.min(0, this.width - BORDER_REPULSION_WIDTH - x)
    const accYLow = Math.max(0, BORDER_REPULSION_WIDTH - y)
    const accYHigh = Math.min(0, this.height - BORDER_REPULSION_WIDTH - y)

    const accX = accXLow + accXHigh
    const accY = accYLow + accYHigh

    return new Vector(accX, accY).scale(BORDER_FORCE_SCALE)
  }

  cohesionForce(boid, localBoids) {
    if (localBoids.length == 0) {
      return Vector.zero
    } else {
      const localCenterMass = localBoids
        .map(local => local.position)
        .reduce((acc, elem) => acc.add(elem), Vector.zero)
        .scale(1 / localBoids.length)
      
      return localCenterMass.subtract(boid.position).scale(COHESION_FORCE_SCALE)
    }
  }

  avoidanceForce(boid, avoidanceBoids) {
    const avoidanceAcc = avoidanceBoids
      .map(local => this.avoidanceForceDueToOtherBoid(boid, local))
      .reduce((acc, elem) => acc.add(elem), Vector.zero)

    return avoidanceAcc.scale(AVOIDANCE_FORCE_SCALE)
  }

  // Avoid another boid by applying a force in the opposite direction than the vector from boid to otherBoid.
  // If the boids are close, we want to apply a larger force than if they are far apart. Therefore we divide the
  // opposite vector with the its own length twice (i.e. divide by the square length). The first time is to get the unit
  // direction vector, and the second time to actually get the inverse proportionality.
  avoidanceForceDueToOtherBoid(boid, otherBoid) {
    const directionAwayFromBoid = boid.position.subtract(otherBoid.position)
    const inverseProportionalForce = directionAwayFromBoid.scale(1 / directionAwayFromBoid.squareLength())
    return inverseProportionalForce
  }

  static random(count, width, height) {
    const boids = range(count)
      .map(index => Boid.random(width, height, index))

    return new Flock(boids, width, height)
  }

  static test(width, height) {
    const boids =
      [ new Boid(new Vector(100, 100), new Vector(1, 0), 0)
      , new Boid(new Vector(100, 130), new Vector(1, 0), 1)
      ]

    return new Flock(boids, width, height)
  }
}
