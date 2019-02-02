class Vector {
	constructor(x = 0, y = 0) {
		this.x = x
		this.y = y
	}

	calculateLength() {
		return Math.sqrt(this.x**2+this.y**2)
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
		return this.length ? new Vector(this.x/this.length, this.y/this.length) : new Vector()
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

	static add(vectorA, vectorB) {
		return vectorA.add(vectorB)
	}

	static sub(vectorA, vectorB) {
		return vectorA.sub(vectorB)
	}

	static dot(vectorA, vectorB) {
		return vectorA.x*vectorB.x + vectorA.y*vectorB.y
	}
}
