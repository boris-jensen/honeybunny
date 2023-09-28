class Flock {
  constructor(boids, width, height) {
    this.boids = boids
    this.width = width
    this.height = height
  }

  updateVelocities(params) {
    const localBoidsTable = new LocalBoidsTable(this.boids, params)
    const forces = this.boids.map(boid => this.forcesForBoid(boid, this.boids, localBoidsTable, params))
    this.boids.forEach(boid => boid.accelerate(forces[boid.index], params))
  }

  updatePositions() {
    this.boids.forEach(boid => boid.move(this.width, this.height))
  }

  forcesForBoid(boid, boids, localBoidsTable, params) {
    const localBoids = localBoidsTable.localBoidsForBoid(boid, boids)
    const avoidanceBoids = localBoidsTable.avoidanceBoidsForBoid(boid, boids)
    const accelerations =
      [ Vector.zero
      , this.borderForce(boid, params)
      , this.alignmentForce(boid, localBoids, params)
      , this.cohesionForce(boid, localBoids, params)
      , this.avoidanceForce(boid, avoidanceBoids, params)
      , this.boidAccelerationForce(boid, params)
      , this.pointerForce(boid, params)
      ]
    return accelerations.reduce((total, elem) => total.add(elem), Vector.zero)
  }

  alignmentForce(boid, localBoids, params) {
    if (localBoids.length == 0) {
      return Vector.zero
    } else {
      const avgVelocity = localBoids
        .map(local => local.velocity)
        .reduce((acc, elem) => acc.add(elem), Vector.zero)
        .scale(1 / localBoids.length)

      return avgVelocity.subtract(boid.velocity).scale(params.alignmentForceScale)
    }
  }

  /**
   * If we don't add an acceleration force, then the boids will eventually align on the global average velocity, which is 0.
   * So this keeps them in motion
   */
  boidAccelerationForce(boid, params) {
    return boid.velocity.scale(params.boidAccelerationForceScale)
  }

  borderForce(boid, params) {
    if (params.useBorders) {
      const x = boid.position.x
      const y = boid.position.y
      const borderWidth = params.borderWidth
  
      const accXLow = Math.max(0, borderWidth - x)
      const accXHigh = Math.min(0, this.width - borderWidth - x)
      const accYLow = Math.max(0, borderWidth - y)
      const accYHigh = Math.min(0, this.height - borderWidth - y)
  
      const accX = accXLow + accXHigh
      const accY = accYLow + accYHigh
  
      return new Vector(accX, accY).scale(params.borderForceScale)
    } else {
      return Vector.zero
    }
  }

  cohesionForce(boid, localBoids, params) {
    if (localBoids.length == 0) {
      return Vector.zero
    } else {
      const localCenterMass = localBoids
        .map(local => local.position)
        .reduce((acc, elem) => acc.add(elem), Vector.zero)
        .scale(1 / localBoids.length)
      
      return localCenterMass.subtract(boid.position).scale(params.cohesionForceScale)
    }
  }

  avoidanceForce(boid, avoidanceBoids, params) {
    const avoidanceAcc = avoidanceBoids
      .map(local => this.avoidanceForceDueToOtherBoid(boid, local))
      .reduce((acc, elem) => acc.add(elem), Vector.zero)

    return avoidanceAcc.scale(params.avoidanceForceScale)
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

  pointerForce(boid, params) {
    if (params.pointerPosition != null) {
      const directionVector = params.pointerAttract
        ? params.pointerPosition.subtract(boid.position) // force direction is towards pointer
        : boid.position.subtract(params.pointerPosition) // force direction is away from pointer
      
      const inverseProportionalForce = directionVector.asUnitVector().scale(1 / directionVector.squareLength())
      return inverseProportionalForce.scale(1000)
    } else {
      return Vector.zero
    }
  }

  static random(count, width, height, params) {
    const boids = range(count)
      .map(index => Boid.random(width, height, index, params))

    return new Flock(boids, width, height)
  }
}
