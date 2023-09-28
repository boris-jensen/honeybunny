function initialParameters() {
  return {
    localRadius: 100,
    borderWidth: 70,
    borderForceScale: 0.01,
    alignmentForceScale: 0.01,
    cohesionForceScale: 0.005,
    avoidanceRadiusRatio: 0.8,
    avoidanceForceScale: 0.5,
    boidAccelerationForceScale: 0.01,
    maxSpeed: 3,
    useBorders: true,
    pointerAttract: true,
    pointerPosition: null,
    mouseDown: false,
  }
}

function setRangeByElementPrefix(prefix, percentage, params) {
  percentage = percentage / 100
  switch(prefix) {
    case "cohesion-scale":
      params.cohesionForceScale = percentage * 0.01
      break
    case "avoidance-scale":
      params.avoidanceForceScale = percentage * 1.2
      break
    case "alignment-scale": 
      params.alignmentForceScale = percentage * 0.04
      break
    case "local-radius": 
      params.localRadius = percentage * 200
      break
    case "avoidance-radius-ratio":
      params.avoidanceRadiusRatio = percentage * 1
      break
    case "max-speed":
      params.maxSpeed = percentage * 6
      break
    case "boid-acceleration":
      params.boidAccelerationForceScale = percentage * 0.02
      break
  } 
}
