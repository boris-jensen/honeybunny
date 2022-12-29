const LIMITS = {
  DOTS:  { MAX: 10000, MIN: 1 },
  SPEED: { MAX: 100,  MIN: 1 },
  COLOR: { MAX: 100,  MIN: 0 },
}
  
const DEFAULTS = {
  DOTS: 100,
  SPEED: 50,
  COLOR: 0
}
  
function initialConfig() {
  return {
    dots: DEFAULTS.DOTS,
    speed: DEFAULTS.SPEED,
    color: DEFAULTS.COLOR,
  }
}
  
  let config = initialConfig()
  
  function resetConfig() {
    config = initialConfig()
  }
  
  function getDots() { return config.dots }
  function getSpeed() { return config.speed }
  function getColor() { return config.color}
  
  function hookupConfig() {
    hookupConfigElement("dots-input", "dots-value", "dots", "DOTS")
    hookupConfigElement("speed-input", "speed-value", "speed", "SPEED")
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
      console.log(config)
      paintSierpinski()
    }
  }