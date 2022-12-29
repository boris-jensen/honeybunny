const LIMITS = {
  LENGTH: { MAX: 200, MIN: 10 },
  PARTS: { MAX: 25, MIN: 1 },
  MAIN_TURN: { MAX: 100, MIN: 0 },
  MAIN_FACTOR: { MAX: 100, MIN: 0 },
  SIDE_TURN: { MAX: 100, MIN: 0 },
  SIDE_FACTOR: { MAX: 100, MIN: 0 },
  COLOR: { MAX: 100, MIN: 0 },
}

const DEFAULTS = {
  INITIAL_LENGTH: 100,
  INITIAL_PARTS: 18,
  MAIN_TURN: 20,
  MAIN_FACTOR: 90,
  SIDE_TURN: 50,
  SIDE_FACTOR: 40,
  COLOR: 0
}

function initialConfig() {
  return {
    initialLength: DEFAULTS.INITIAL_LENGTH,
    initialParts: DEFAULTS.INITIAL_PARTS,
    mainTurn: DEFAULTS.MAIN_TURN,
    mainFactor: DEFAULTS.MAIN_FACTOR,
    sideTurn: DEFAULTS.SIDE_TURN,
    sideFactor: DEFAULTS.SIDE_FACTOR,
    color: DEFAULTS.COLOR,
  }
}

let config = initialConfig()

function resetConfig() {
  config = initialConfig()
}

function getInitialLength() { return config.initialLength }
function getInitialParts() { return config.initialParts }
function getMainTurn() { return (config.mainTurn / 500) * (Math.PI / 2) }
function getMainFactor() { return config.mainFactor / 100 }
function getSideTurn() { return (config.sideTurn / 100) * (Math.PI / 2) }
function getSideFactor() { return config.sideFactor / 100 }
function getColor() { return config.color}

function hookupConfig() {
  hookupConfigElement("length-input", "length-value", "initialLength", "LENGTH")
  hookupConfigElement("parts-input", "parts-value", "initialParts", "PARTS")
  hookupConfigElement("mainturn-input", "mainturn-value", "mainTurn", "MAIN_TURN")
  hookupConfigElement("mainfactor-input", "mainfactor-value", "mainFactor", "MAIN_FACTOR")
  hookupConfigElement("sideturn-input", "sideturn-value", "sideTurn", "SIDE_TURN")
  hookupConfigElement("sidefactor-input", "sidefactor-value", "sideFactor", "SIDE_FACTOR")
  hookupConfigElement("color-input", "color-value", "color", "COLOR")
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
    console.log(this.value)
    config[configField] = this.value
    paintFern()
  }
}