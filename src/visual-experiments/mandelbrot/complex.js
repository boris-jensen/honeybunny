class Complex {
        
    constructor(real, imaginary) {
        this._real = real
        this._imaginary = imaginary
    }

    get real () { return this._real }
    get imaginary () { return this._imaginary }

    plus(that) {
        var newReal = this.real + that.real
        var newImaginary = this.imaginary + that.imaginary
        
        return new Complex(newReal, newImaginary)
    }

    times(that) {
        var newReal = this._real * that.real - this.imaginary * that.imaginary
        var newImaginary = this.real * that.imaginary + this.imaginary * that.real

        return new Complex(newReal, newImaginary)
    }

    square() {
        return this.times(this)
    }

    sqrLen() {
        return Math.pow(this.real, 2) + Math.pow(this.imaginary, 2)
    }

    length() {
        return Math.sqrt(this.sqrLen())
    }
}