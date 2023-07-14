function *genMandel(orig) {
    var curr = orig
    while (true) {
        yield curr
        curr = curr.square().plus(orig)
    }
}

function getMandelIters(orig, maxIters) {
    var mandelSqrLengths = genMandelSqrLengths(orig)
    var currIter = 0
    while (currIter < maxIters) {
        var currSqrLength = mandelSqrLengths.next().value
        if (currSqrLength > 4) {
            return currIter
        }
        currIter++
    }
    return currIter
}

function *genMandelSqrLengths(orig) {
    var mandels = genMandel(orig)
    while (true) {
        yield mandels.next().value.sqrLen()
    }
}

function mandelColor1(iters, maxIters) {
    if (iters === maxIters) {
        return { r: 0, g: 0, b: 0 }
    } else {
        return { r: 256, g: 0, b: 0}
    }
}

function mandelColor2(iters, maxIters) {
    if (iters === maxIters) {
        return { r: 0, g: 0, b: 0 }
    } else {
        return { r: iters * 20 % 256, g: (iters * 10) % 256, b: (iters * 5) % 256}
    }
}

