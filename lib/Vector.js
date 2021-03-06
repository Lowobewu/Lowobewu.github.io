/** Class representing a vector */
class Vector {
	/**
	* Create vector
	* @param {Number} [x=0] - The x component of the vector
	* @param {Number} [y=0] - The y component of the vector
	*/
	constructor(x = 0, y = 0) {
		this.x = x
		this.y = y
	}

	calculateLength() {
		return Math.sqrt(this.x ** 2 + this.y ** 2)
	}

	calculateAngle() {
		return Math.atan2(this.y, this.x)
	}

	get length() {
		return this.calculateLength()
	}

	get angle() {
		return this.calculateAngle()
	}

	get unit() {
		return this.length ? new Vector(this.x / this.length, this.y / this.length) : new Vector()
	}

	get perpendicular() {
		return new Vector(-this.y, this.x)
	}

	get xy () {
		return [this.x, this.y]
	}

	times(number) {
		return new Vector(this.x * number, this.y * number)
	}

	add(vector) {
		return new Vector(this.x + vector.x, this.y + vector.y)
	}

	sub(vector) {
		return new Vector(this.x - vector.x, this.y - vector.y)
	}

	static sum() {
		return Array.from(arguments).reduce((acumulator, currentVector) => acumulator.add(currentVector), new Vector())
	}

	static dot(vectorA, vectorB) {
		return vectorA.x * vectorB.x + vectorA.y * vectorB.y
	}
}
