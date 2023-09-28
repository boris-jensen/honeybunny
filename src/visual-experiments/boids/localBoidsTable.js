class LocalBoidsTable {

  constructor(boids) {
    const avoidanceRadius = LOCAL_RADIUS * AVOIDANCE_RADIUS_RATIO
    const squareDistanceTable = this.makeSquareDistanceTable(boids)
    this.isLocalBoidTable = this.makeSquareDistanceIsLessThan(LOCAL_RADIUS * LOCAL_RADIUS, squareDistanceTable)
    this.isAvoidanceBoidTable = this.makeSquareDistanceIsLessThan(avoidanceRadius * avoidanceRadius, squareDistanceTable)
  }

  localBoidsForBoid(boid, boids) {
    return this.filterBoidsByTable(boid, boids, this.isLocalBoidTable)
  }

  avoidanceBoidsForBoid(boid, boids) {
    return this.filterBoidsByTable(boid, boids, this.isAvoidanceBoidTable)
  }

  filterBoidsByTable(boid, boids, table) {
    return boids.filter(otherBoid => {
      if (boid.index == otherBoid.index) {
        return false
      } else if (boid.index > otherBoid.index) {
        return table[boid.index][otherBoid.index]
      } else {
        return table[otherBoid.index][boid.index]
      }
    })

  }

  // Triangular table, since the relation is symmetric.
  /**
   * [
   *  [ ]
   *  [ sq_dist_1_0 ]
   *  [ sq_dist_2_0, sq_dist_2_1 ]
   *  [ sq_dist_3_0, sq_dist_3_1, sq_dist_3_2 ]
   *  ...
   * ]  
   * 
   */
  makeSquareDistanceTable(boids) {
    return boids.map(boid => 
      range(boid.index).map(index => {
        const otherBoid = boids[index]
        const diff = boid.position.subtract(otherBoid.position)
        return diff.squareLength()
      })
    )
  }

  makeSquareDistanceIsLessThan(maxSquareDistance, squareDistanceTable) {
    return squareDistanceTable.map(squareDistancesForBoid =>
      squareDistancesForBoid.map(squareDistance => squareDistance <= maxSquareDistance)
    )
  }
}
