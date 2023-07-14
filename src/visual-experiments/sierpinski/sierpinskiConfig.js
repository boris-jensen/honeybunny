const LIMITS = {
  DOTS: { MAX: 20000, MIN: 1 },
}

const DEFAULTS = {
  DOTS: 100,
}

const ZOOM_FACTOR = 1.05

const CLICK_FUNCTIONALITY = {
  moveCornerA: "MOVE_CORNER_A",
  moveCornerB: "MOVE_CORNER_B",
  moveCornerC: "MOVE_CORNER_C",
  zoom: "ZOOM",
}

function initialConfig() {
  return {
    dots: DEFAULTS.DOTS,
    functionality: CLICK_FUNCTIONALITY.moveCornerA,
    corners: {
      pointA: new Point(500, 50),
      pointB: new Point(50, 800),
      pointC: new Point(950, 800),
    },
    mouseDown: false,
  }
}

let config = initialConfig()

function getDots() { return config.dots }

function hookupControls() {
  hookupConfigElement("dots-input", "dots-value", "dots", "DOTS")
  hookupFunctionalityButtons()
}

function hookupConfigElement(inputId, valueId, configField, limitsField) {
  const input = document.getElementById(inputId)
  const value = document.getElementById(valueId)
  const initialValue = config[configField]
  const inputLimits = LIMITS[limitsField]

  input.setAttribute("min", inputLimits.MIN)
  input.setAttribute("max", inputLimits.MAX)
  input.value = initialValue
  value.innerHTML = initialValue
  input.oninput = function() {
    value.innerHTML = this.value
    config[configField] = this.value
    paintSierpinski()
  }
}

function hookupFunctionalityButtons() {
  const inputs = document.getElementsByName("click-functionality-input")
  for (let i = 0; i < inputs.length; i++) {
    inputs[i].onchange = handleClickFunctionChange
  }
}

function handleClickFunctionChange(event) {
  if (event.target.defaultValue == "A") {
    config.functionality = CLICK_FUNCTIONALITY.moveCornerA
  } else if (event.target.defaultValue == "B") {
    config.functionality = CLICK_FUNCTIONALITY.moveCornerB
  } else if (event.target.defaultValue == "C") {
    config.functionality = CLICK_FUNCTIONALITY.moveCornerC
  } else if (event.target.defaultValue == "ZOOM") {
    config.functionality = CLICK_FUNCTIONALITY.zoom
  }
}

function hookupClickHandling() {
  const canvas = document.getElementById('main-canvas')
  canvas.onmousedown = function(event) { config.mouseDown = true; handleMouseClickAndDrag(event)}
  canvas.onmouseup = function() { config.mouseDown = false}
  canvas.onmousemove = handleMouseClickAndDrag
  canvas.onclick = handleZoom
}

function handleZoom(event) {
  if (config.functionality == CLICK_FUNCTIONALITY.zoom) {
    const canvas = document.getElementById('main-canvas')
    const rect = canvas.getBoundingClientRect()
    const eventX = event.clientX - rect.left
    const eventY = event.clientY - rect.top
    const zoomPoint = new Point(eventX, eventY)

    config.corners.pointA = zoomFrom(zoomPoint, config.corners.pointA)
    config.corners.pointB = zoomFrom(zoomPoint, config.corners.pointB)
    config.corners.pointC = zoomFrom(zoomPoint, config.corners.pointC)
  }
}

function zoomFrom(from, point) {
  const deltaX = point.x - from.x
  const deltaY = point.y - from.y

  const zoomedDeltaX = deltaX * ZOOM_FACTOR
  const zoomedDeltaY = deltaY * ZOOM_FACTOR

  const zoomedX = from.x + zoomedDeltaX
  const zoomedY = from.y + zoomedDeltaY

  return new Point(zoomedX, zoomedY)
}

function handleMouseClickAndDrag(event) {
  if (config.mouseDown) {
    const canvas = document.getElementById('main-canvas')
    const rect = canvas.getBoundingClientRect()
    const eventX = event.clientX - rect.left
    const eventY = event.clientY - rect.top
    const point = new Point(eventX, eventY)
    if (config.functionality == CLICK_FUNCTIONALITY.moveCornerA) {
      config.corners.pointA = point
    } else if (config.functionality == CLICK_FUNCTIONALITY.moveCornerB) {
      config.corners.pointB = point
    } else if (config.functionality == CLICK_FUNCTIONALITY.moveCornerC) {
      config.corners.pointC = point
    }
    paintSierpinski()
  }
}
