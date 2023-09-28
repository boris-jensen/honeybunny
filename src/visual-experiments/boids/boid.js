class Boid {
  constructor(position, velocity, index) {
    this.position = position
    this.velocity = velocity
    this.index = index
  }

  accelerate(force) {
    // shortcut by setting mass to 1, in F=ma
    const acceleration = force
    this.velocity = this.velocity.add(acceleration).withMaxLength(BOID_MAX_SPEED)
  }

  move(width, height) {
    this.position = this.position.add(this.velocity)
    
    if (this.position.x < 0) {
      this.position.x = this.position.x + width
    } else if (this.position.x >= width) {
      this.position.x = this.position.x - width
    }

    if (this.position.y < 0) {
      this.position.y = this.position.y + height
    } else if (this.position.y >= height) {
      this.position.y = this.position.y - height
    }
  }

  static random(width, height, index) {
    return new Boid(
      Vector.randomPosition(width, height),
      Vector.randomDirection().scale(Math.random() * BOID_MAX_SPEED),
      index,
    )
  }
}
