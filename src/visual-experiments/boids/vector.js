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
    return Math.sqrt(this.x * this.x + this.y * this.y)
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
}

function emptyVector() {
  return new Vector(0, 0)
}

function vectorFromPolar(length, direction) {
  const x = Math.cos(direction) * length
  const y = Math.sin(direction) * length
  return new Vector(x, y)
}