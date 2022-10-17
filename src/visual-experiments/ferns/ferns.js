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

function line(from, angle, length, ctx) {
  const to = newPoint(from, angle, length)
  ctx.lineTo(to.x, to.y)
  return to
}

function fern(from, angle, length, mainTurn, parts, ctx) {
  if (parts < 1 || length < 1) {
    return
  } else {
    ctx.moveTo(from.x, from.y)

    const bendPoint = line(from, angle, length, ctx)
    const bendAngle = angle + mainTurn
    const bendLength = length * getMainFactor()
    const newFrom = line(bendPoint, bendAngle, bendLength, ctx)
    const newAngle = bendAngle + mainTurn
    const newLength = bendLength * getMainFactor()

    fern(newFrom, newAngle + getSideTurn(),  newLength * getSideFactor(), mainTurn, parts - 1, ctx)
    fern(newFrom, newAngle,                  newLength,                   mainTurn, parts - 1, ctx)
    fern(newFrom, newAngle - getSideTurn(),  newLength * getSideFactor(), mainTurn, parts - 1, ctx)
  }
}

function paintFern() {
  const canvas = document.getElementById('main-canvas')
  const ctx = canvas.getContext('2d')
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.beginPath()
  const initialPoint = new Point(canvas.width / 2, canvas.height)
  const initialAngle = 3 * Math.PI / 2

  fern(initialPoint, initialAngle, getInitialLength(), getInitialMainTurn(), getInitialParts(), ctx)
  ctx.stroke()
}
