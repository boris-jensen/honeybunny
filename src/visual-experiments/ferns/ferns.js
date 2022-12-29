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

function byteToHex(byte) {
  if (byte < 16) {
    return '0' + byte.toString(16)
  } else {
    return byte.toString(16)
  }
}

function toColor(color) {
  const colorShare = 255 * (color / 100)
  const red = Math.round(255 - colorShare)
  const green = Math.round(colorShare)

  return '#' + byteToHex(red) + byteToHex(green) + '00'
}


function fern(from, angle, length, parts, turnRight, ctx) {
  if (parts < 1 || length < 1) {
    return
  } else {
    ctx.moveTo(from.x, from.y)
    const mainTurn = turnRight ? getMainTurn() : -getMainTurn()
    const mainFactor = getMainFactor()
    const sideTurn = turnRight ? getSideTurn() : -getSideTurn()
    const sideFactor = getSideFactor()

    const bendPoint = line(from, angle, length, ctx)
    const bendAngle = angle + mainTurn
    const bendLength = length * mainFactor
    const newFrom = line(bendPoint, bendAngle, bendLength, ctx)
    const newAngle = bendAngle + mainTurn
    const newLength = bendLength * mainFactor
    
    fern(newFrom, newAngle,            newLength,              parts - 1,  turnRight, ctx)
    fern(newFrom, newAngle + sideTurn, newLength * sideFactor, parts - 1, !turnRight, ctx)
    fern(newFrom, newAngle - sideTurn, newLength * sideFactor, parts - 1,  turnRight, ctx)
  }
}

function paintFern() {
  const canvas = document.getElementById('main-canvas')
  const ctx = canvas.getContext('2d')
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.beginPath()
  const initialPoint = new Point(canvas.width / 3, canvas.height)
  const initialAngle = 3 * Math.PI / 2
  ctx.strokeStyle = toColor(getColor())

  fern(initialPoint, initialAngle, getInitialLength(), getInitialParts(), true, ctx)

  ctx.stroke()
}
