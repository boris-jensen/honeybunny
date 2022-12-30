function paintSierpinski() {
  const canvas = document.getElementById('main-canvas')
  const ctx = canvas.getContext('2d')
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.beginPath()

  drawCorners(ctx)
  drawPoints(canvas, ctx)
}

// draw corners

function drawCorners(ctx) {
  drawCorner(config.corners.pointA, "#FF0000", ctx)
  drawCorner(config.corners.pointB, "#00FF00", ctx)
  drawCorner(config.corners.pointC, "#0000FF", ctx)
}

function drawCorner(point, color, ctx) {
  const x = Math.round(point.x)
  const y = Math.round(point.y)
  const side = 6
  const halfSide = side / 2

  ctx.fillStyle = color
  ctx.fillRect(x - halfSide, y - halfSide, side, side)
  ctx.stroke()
}

// draw points

function drawPoints(canvas, ctx) {
  let current = selectCorner()
  
  ctx.fillStyle = "#000000"
  let i = 0
  while (i < getDots()) {
    current = midwayPoint(current, selectCorner())
    if (pointIsVisible(current, canvas)) {
      drawPoint(current, ctx)
      i++
    }
  }
  ctx.stroke()
}

function pointIsVisible(point, canvas) {
  return point.x < canvas.width && point.x > 0 && point.y < canvas.height && point.y > 0
}

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
  if (idx == 0) return config.corners.pointA
  else if (idx == 1) return config.corners.pointB
  else return config.corners.pointC
}