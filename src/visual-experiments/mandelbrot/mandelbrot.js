function drawPixel(x, y, r, g, b, a, width, canvasData) {
  var index = (x + y * width) * 4

  canvasData.data[index + 0] = r
  canvasData.data[index + 1] = g
  canvasData.data[index + 2] = b
  canvasData.data[index + 3] = a
}

function updateCanvas(ctx, canvasData) {
  ctx.putImageData(canvasData, 0, 0)
}

function drawBlack(ctx, canvasData, width, height) {
  for (let cx = 0; cx < width; cx++) {
      for (let cy = 0; cy < height; cy++) {
          drawPixel(cx, cy, 0, 0, 0, 255, width, canvasData)
      }
  }
  updateCanvas(ctx, canvasData)
}

function drawMandel(centerX, centerY, diffX, diffY, width, height, maxIters, ctx, canvasData) {
  drawBlack(ctx, canvasData, width, height)

  const minX = centerX - (diffX / 2)
  const minY = centerY - (diffY / 2)

  for (let cx = 0; cx < width; cx++) {
      for (let cy = 0; cy < height; cy++) {
          var mandelX = (cx / width) * diffX + minX
          var mandelY = (cy / height) * diffY + minY
          var mandelCoord = new Complex(mandelX, mandelY)
          var mandelIters = getMandelIters(mandelCoord, maxIters)
          var colors = mandelColor2(mandelIters, maxIters)
          drawPixel(cx, cy, colors.r, colors.g, colors.b, 255, width, canvasData)
      }
  }
  
  updateCanvas(ctx, canvasData)
}

function paintMandelbrot() {
  var canvas = document.getElementById('main-canvas')
  var width = canvas.width = window.innerWidth
  var height = canvas.height = window.innerHeight
  var ctx = canvas.getContext('2d')
  ctx.fillStyle = 'rgb(0, 0, 0)'
  ctx.fillRect(0, 0, width, height)
  var canvasData = ctx.getImageData(0, 0, width, height)

  const maxIterations = 100

  var centerX = -0.5
  var centerY = 0
  var diffX = 3.5
  var diffY = (height / width) * diffX

  const movePct = 0.2
  const zoomPct = 0.7

  drawMandel(centerX, centerY, diffX, diffY, width, height, maxIterations, ctx, canvasData)

  document.onkeydown = function (e) {
      switch (e.key) {
          case 'ArrowUp':
              centerY = centerY - diffY * movePct
              break
          case 'ArrowDown':
              centerY = centerY + diffY * movePct
              break
          case 'ArrowLeft':
              centerX = centerX - diffX * movePct
              break
          case 'ArrowRight':
              centerX = centerX + diffX * movePct
              break
          case ' ':
              diffX = diffX * zoomPct
              diffY = diffY * zoomPct
              break
      }
      drawMandel(centerX, centerY, diffX, diffY, width, height, maxIterations, ctx, canvasData)
  };
}