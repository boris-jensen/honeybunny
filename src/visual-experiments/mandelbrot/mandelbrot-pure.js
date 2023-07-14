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
