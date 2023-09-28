class Boid {
  constructor(position, velocity, index) {
    this.position = position
    this.velocity = velocity
    this.index = index
  }

  accelerate(force) {
    // shortcut by setting mass to 1, in F=ma
    const acceleration = force
    this.velocity = this.velocity.add(acceleration)
  }

  move() {
    this.position = this.position.add(this.velocity)
  }

  static random(width, height, index) {
    return new Boid(
      Vector.randomPosition(width, height),
      Vector.randomDirection().scale(Math.random() * MAX_SPEED),
      index,
    )
  }
}
