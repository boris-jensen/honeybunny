function drawPoint(point, ctx) {
  const x = Math.round(point.x)
  const y = Math.round(point.y)
  ctx.fillRect(x, y, 1, 1)
}

function drawCorner(point, ctx) {
  const x = Math.round(point.x)
  const y = Math.round(point.y)
  const side = 6
  const halfSide = side / 2

  ctx.fillRect(x - halfSide, y - halfSide, side, side)
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

function paintSierpinski() {
  const canvas = document.getElementById('main-canvas')
  const ctx = canvas.getContext('2d')
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.beginPath()

  ctx.fillStyle = "#FF0000"
  console.log(ctx.strokeStyle)
  drawCorner(config.corners.pointA, ctx)
  drawCorner(config.corners.pointB, ctx)
  drawCorner(config.corners.pointC, ctx)
  ctx.stroke()

  ctx.fillStyle = "#000000"
  let current = selectCorner()
  for (let i = 0; i < getDots(); i++) {
    current = midwayPoint(current, selectCorner())
    drawPoint(current, ctx)
  }
  ctx.stroke()
}
