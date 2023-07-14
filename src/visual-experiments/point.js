class Point {
  constructor(x, y) {
    this.x = x
    this.y = y
  }
}

function newPoint(from, angle, length) {
  const deltaX = Math.cos(angle) * length
  const deltaY = Math.sin(angle) * length
  return new Point(from.x + deltaX, from.y + deltaY)
}
