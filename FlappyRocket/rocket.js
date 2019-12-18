class Rocket extends Particle {
	/**
	* New rocket
	* @param {Object} options - Rocket's options
	* @param {Number} options.speed - Rocket's horizontal speed
	* @param {Number} options.impulse - Rocket's impulse
	* @param {Number} options.height - Rocket's height
	* @param {Number} options.width - Rocket's width
	*/
	constructor(options, positionPadding, speed) {
		super(1, positionPadding, positionPadding, 0, 0)

		this.impulseMagnitude = -options.impulse
		this.height = options.height
		this.width = options.width
		this.heightHalf = options.height / 2
		this.widthHalf = options.width / 2
		this.speed = speed
		this.paramA = 3 * options.width / 25
		// this.paramB = 30 * options.width / 25
		this.paramC = 5 * options.height / 70
		this.paramD = options.height / 70
		this.paramE = this.heightHalf + this.paramC
		this.paramF = 8 * this.width / 25
	}

	get fakeVelocityUnit() {
		return this.velocity.add(new Vector(this.speed, 0)).unit
	}

	get hitBoxCorners() {
		const vectorA = this.fakeVelocityUnit.times(this.heightHalf)
		const vectorB = this.fakeVelocityUnit.perpendicular.times(this.widthHalf)
		const vectorC = this.position.add(vectorA)
		const vectorD = this.position.sub(vectorA)

		return [
			vectorC.add(vectorB),
			vectorC.sub(vectorB),
			vectorD.sub(vectorB),
			vectorD.add(vectorB)
		]
	}

	draw = context => {
		const vectorA = this.fakeVelocityUnit.perpendicular.times(this.paramA)
		const vectorB = vectorA.times(10) // this.fakeVelocityUnit.perpendicular.times(this.paramB)
		const vectorC = this.fakeVelocityUnit.times(this.paramC)
		const angle = this.fakeVelocityUnit.angle + 0.5 * Math.PI
		const fingerJoin = this.position.add(this.fakeVelocityUnit.times(this.heightHalf)).xy

		// Red finger
		context.strokeStyle = "#FF0000"
		context.beginPath()
		context.moveTo(...fingerJoin)
		context.arc(...this.position.add(this.fakeVelocityUnit.times(this.paramE)).xy, this.paramF, angle, angle + Math.PI, true)
		context.lineTo(...fingerJoin)
		context.lineWidth = this.paramA
		context.stroke()
		context.closePath()

		// Yellow body
		context.fillStyle = "#FFFF00"
		context.beginPath()
		context.moveTo(...this.hitBoxCorners[0].xy)
		context.lineTo(...this.hitBoxCorners[1].xy)
		context.lineTo(...this.hitBoxCorners[2].xy)
		context.lineTo(...this.hitBoxCorners[3].xy)
		context.closePath()
		context.fill()

		// Red wings
		context.fillStyle = "#FF0000"
		context.beginPath()
		context.moveTo(...this.hitBoxCorners[0].sub(this.hitBoxCorners[0].sub(this.hitBoxCorners[3]).times(0.5)).add(vectorA).xy)
		context.lineTo(...this.hitBoxCorners[1].sub(this.hitBoxCorners[1].sub(this.hitBoxCorners[2]).times(0.5)).sub(vectorA).xy)
		context.lineTo(...this.hitBoxCorners[2].sub(vectorB).add(vectorC).xy)
		context.lineTo(...this.hitBoxCorners[2].sub(vectorB).xy)
		context.lineTo(...this.hitBoxCorners[3].add(vectorB).xy)
		context.lineTo(...this.hitBoxCorners[3].add(vectorB).add(vectorC).xy)
		context.closePath()
		context.fill()

		// Red Front
		context.strokeStyle = '#FF0000'
		context.beginPath()
		context.moveTo(...this.hitBoxCorners[0].xy)
		context.lineTo(...this.hitBoxCorners[1].xy)
		context.lineWidth = this.paramD
		context.stroke()
		context.closePath()

		// Reset colors
		context.fillStyle = "#000000"
		context.strokeStyle = '#000000'

		// context.fillText(this.x, 10, 10)
		// context.fillText(this.y, 10, 30)
		// context.fillText(this.velocity.x, 200, 10)
		// context.fillText(this.velocity.y, 200, 30)
		// context.fillText(this.velocity.angle, 320, 30)

		// context.fillText('#0', ...this.hitBoxCorners[0].xy)
		// context.fillText('#1', ...this.hitBoxCorners[1].xy)
		// context.fillText('#2', ...this.hitBoxCorners[2].xy)
		// context.fillText('#3', ...this.hitBoxCorners[3].xy)
	}

	impulse = () => {
		this.velocity = new Vector(0, this.impulseMagnitude)
	}

}