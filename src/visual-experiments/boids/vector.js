class Vector {
  constructor(x, y) {
    this.x = x
    this.y = y
  }

  add(other) {
    return new Vector(this.x + other.x, this.y + other.y)
  }

  subtract(other) {
    return new Vector(this.x - other.x, this.y - other.y)
  }

  scale(scalar) {
    return new Vector(this.x * scalar, this.y * scalar)
  }

  length() {
    return Math.sqrt(this.squareLength())
  }

  squareLength() {
    return this.x * this.x + this.y * this.y
  }

  asUnitVector() {
    return this.scale(1/this.length())
  }

  setLength(newLength) {
    return this.asUnitVector().scale(newLength)
  }

  withMaxLength(maxLength) {
    const length = this.length()
    return length > maxLength
      ? this.scale(maxLength / length)
      : this
  }

  angle() {
    // Argument order goes y then x. Extended version of Math.atan, which takes y/x for the tangent
    return Math.atan2(this.y, this.x)
  }

  isSmallerThan(length) {
    return this.x * this.x + this.y * this.y < length * length
  }

  static zero = new Vector(0, 0)

  static randomDirection() {
    const direction = Math.random() * TAU
    return new Vector(Math.cos(direction), Math.sin(direction))
  }

  static randomPosition(width, height) {
    const positionX = Math.random() * width
    const positionY = Math.random() * height
    return new Vector(positionX, positionY)
  }

  static fromPolar(length, direction) {
    const x = Math.cos(direction) * length
    const y = Math.sin(direction) * length
    return new Vector(x, y)
  }
}
