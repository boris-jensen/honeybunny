// Array with index 0-maxIters inclusive, of rgb objects
function getColorCache(maxIters) {
  let ret = []
  for (let i = 0; i <= maxIters; i++) {
    ret[i] = itersToRgb(i, maxIters)
  }
  return ret
}

// If iters == maxIters, then return black. Otherwise interpret the iters as a hue in the HSV color space, and convert to RGB, assuming full brightness and saturation.
function itersToRgb(iters, maxIters) {
  if (iters === maxIters) {
      return { r: 0, g: 0, b: 0 }
  } else {
      return hsv2rgb(iters / maxIters, 1.0, 1.0)
  }
}

// Hue, saturation and value input range = 0 to 1.0
// r, g and b output range = 0 to 255
// Conversion algorithm from https://www.easyrgb.com/en/math.php
function hsv2rgb(hue, saturation, value) {
  if ( saturation == 0 )
  {
    R = value * 255
    G = value * 255
    B = value * 255
  }
  else
  {
    var_h = hue * 6
    if ( var_h == 6 ) {
      var_h = 0      // hue must be < 1
    }
    var_i = Math.floor( var_h )
    var_1 = value * ( 1 - saturation )
    var_2 = value * ( 1 - saturation * ( var_h - var_i ) )
    var_3 = value * ( 1 - saturation * ( 1 - ( var_h - var_i ) ) )

    if      ( var_i == 0 ) { var_r = value     ; var_g = var_3 ; var_b = var_1 }
    else if ( var_i == 1 ) { var_r = var_2 ; var_g = value     ; var_b = var_1 }
    else if ( var_i == 2 ) { var_r = var_1 ; var_g = value     ; var_b = var_3 }
    else if ( var_i == 3 ) { var_r = var_1 ; var_g = var_2 ; var_b = value     }
    else if ( var_i == 4 ) { var_r = var_3 ; var_g = var_1 ; var_b = value     }
    else                   { var_r = value     ; var_g = var_1 ; var_b = var_2 }
    
    return { r: var_r * 255, g: var_g * 255, b:  var_b * 255 }
  }
}
