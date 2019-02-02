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
		this.x *= number
		this.y *= number
		return this
	}

	add(vector) {
		this.x += vector.x
		this.y += vector.y
		return this
	}

	sub(vector) {
		this.x -= vector.x
		this.y -= vector.y
		return this
	}

	static add(vectorA, vectorB) {
		return new Vector(vectorA.x + vectorB.x, vectorA.y + vectorB.y)
	}

	static sub(vectorA, vectorB) {
		return new Vector(vectorA.x - vectorB.x, vectorA.y - vectorB.y)
	}

	static dot(vectorA, vectorB) {
		return vectorA.x*vectorB.x + vectorA.y*vectorB.y
	}
}
