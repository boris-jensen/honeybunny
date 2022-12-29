
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

function reset() {
  resetConfig()
}

const corners = [
  new Point(100, 500),
  new Point(600, 700),
  new Point(200, 100),
]

function drawPoint(point, ctx) {
  const x = Math.round(point.x)
  const y = Math.round(point.y)
  ctx.fillRect(x, y, 1, 1)
}

function midwayPoint(p1, p2) {
  const midX = (p1.x + p2.x) / 2
  const midY = (p1.y + p2.y) / 2

  return new Point(midX, midY)
}

function selectCorner() {
  const idx = Math.floor(Math.random() * 3)
  return corners[idx]
}

function paintSierpinski() {
  const canvas = document.getElementById('main-canvas')
  const ctx = canvas.getContext('2d')
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.beginPath()
  ctx.strokeStyle = toColor(getColor())
  for (let i = 0; i < 3; i++) {
    drawPoint(corners[i], ctx)
  }

  let current = selectCorner()
  for (let i = 0; i < getDots(); i++) {
    current = midwayPoint(current, selectCorner())
    drawPoint(current, ctx)
  }
  ctx.stroke()
}
