const LIMITS = {
  DOTS:    { MAX: 10000, MIN: 1 },
  SPEED:   { MAX: 100,   MIN: 1 },
  COLOR:   { MAX: 100,   MIN: 0 },
}

const DEFAULTS = {
  DOTS: 100,
  SPEED: 50,
  COLOR: 0
}

class Point {
  constructor(x, y) {
    this.x = x
    this.y = y
  }
}

function initialConfig() {
  return {
    dots: DEFAULTS.DOTS,
    speed: DEFAULTS.SPEED,
    color: DEFAULTS.COLOR,
    corners: {
      pointA: new Point(500, 50),
      pointB: new Point(50, 800),
      pointC: new Point(950, 800),
    }
  }
}

let config = initialConfig()

function getDots() { return config.dots }
function getSpeed() { return config.speed }
function getColor() { return config.color}

function hookupConfig() {
  hookupConfigElement("dots-input", "dots-value", "dots", "DOTS")
  hookupConfigElement("speed-input", "speed-value", "speed", "SPEED")
  hookupConfigElement("color-input", "color-value", "color", "COLOR")
  hookupCorners()
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

function hookupCorners() {
  
}