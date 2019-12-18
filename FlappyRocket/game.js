class MovingBox {
	constructor(width, height, x, y, horizontalSpeed) {
		this.widthHalf = width / 2
		this.heightHalf = height / 2
		this.position = new Vector(x, y)
		this.horizontalSpeed = horizontalSpeed
	}

	get hitBoxCorners() {
		return [
			this.position.add(new Vector(this.widthHalf, this.heightHalf)),
			this.position.add(new Vector(this.widthHalf, -this.heightHalf)),
			this.position.add(new Vector(-this.widthHalf, -this.heightHalf)),
			this.position.add(new Vector(-this.widthHalf, this.heightHalf))
		]
	}

	update = timeStep => {
		this.position = this.position.sub((new Vector(this.horizontalSpeed * timeStep, 0)))
	}

	checkCollision = pointPosition => {
		const delta = this.position.sub(pointPosition)

		return Math.abs(delta.x) < this.widthHalf && Math.abs(delta.y) < this.heightHalf
	}

	draw = context => {
		context.beginPath()
		context.moveTo(...this.hitBoxCorners[0].xy)
		context.lineTo(...this.hitBoxCorners[1].xy)
		context.lineTo(...this.hitBoxCorners[2].xy)
		context.lineTo(...this.hitBoxCorners[3].xy)
		context.closePath()
		context.fill()
	}
}
const randomBetween = (max = 1, min = 0) => Math.floor(Math.random() * (1 + max - min)) + min
class BoxesController {
	constructor(canvasWidth, canvasHeight) {
		this.canvasWidth = canvasWidth
		this.canvasHeight = canvasHeight
		this.boxSpeed = 150
		this.boxes = [
			new MovingBox(70, 50, canvasWidth, randomBetween(canvasHeight - 100, 100), this.boxSpeed)
		]
	}

	generator = () => {
		// TODO: Rethink this
		let notFull = false
		const firstBox = this.boxes[0]

		if (firstBox.position.x + firstBox.widthHalf < 0) {
			this.boxes.shift()
			notFull = true
		}

		if (notFull && firstBox.position.x - firstBox.widthHalf < 0) {
			const newBoxWidth = randomBetween(100, 50)
			const newBoxHeight = randomBetween(100, 50)
			const newBoxPositonX = this.canvasWidth + newBoxWidth / 2
			const newBoxPositonY = randomBetween(newBoxHeight / 2, this.canvasHeight - newBoxHeight / 2)

			this.boxes.push(new MovingBox(newBoxWidth, newBoxHeight, newBoxPositonX, newBoxPositonY, this.boxSpeed))
			notFull = false
		}

	}

	update = timeStep => {
		this.generator()
		this.boxes.forEach(box => box.update(timeStep))
	}

	checkCollision = pointPosition => this.boxes.some(box => box.checkCollision(pointPosition))

	draw = context => {
		this.boxes.forEach(box => box.draw(context))
	}
}

/** Game class */
class Game {
	/**
	* New game
	* @param {HTMLCanvasElement} canvas - Canvas element to draw the game
	* @param {Object} rocketOptions - Rocket's options
	* @param {Number} [topScore=0] - Topscore
	*/
	constructor(canvas, rocketOptions, topScore = 0) {
		this.topScore = topScore
		this.canvasWidth = canvas.width
		this.canvasHeight = canvas.height
		this.context = canvas.getContext('2d')
		this.request = undefined
		this.initialTime = undefined
		this.rocketOptions = rocketOptions
		this.rocket = undefined
		this.gameIsRuning = false
		this.drawOffset = rocketOptions.height + 10
		this.movingBox = undefined
		this.movingBoxes = undefined
	}

	get time() {
		return performance.now() - this.initialTime
	}

	start = () => {
		this.initialTime = performance.now()
		this.rocket = new Rocket(this.rocketOptions, this.drawOffset)
		this.movingBoxes = new BoxesController(this.canvasWidth, this.canvasHeight)

		this.startLoop()
	}

	startLoop = () => {
		this.gameIsRuning = true
		if (!this.request) {
			this.request = requestAnimationFrame(this.loop);
		}
	}

	loop = t => {
		this.request = undefined
		this.update(t)
		this.draw()
		if (this.gameEndCondition()) {
			this.stop()
		} else {
			this.startLoop()
		}
	}

	draw = () => {
		this.context.clearRect(0, 0, this.canvasWidth, this.canvasHeight)
		this.movingBoxes.draw(this.context)
		this.rocket.draw(this.context)
		this.context.fillText(Math.floor(this.time / 100), 10, 50);
	}

	gameEndCondition = () => this.rocket.hitBoxCorners.some(corner => this.movingBoxes.checkCollision(corner) || corner.y > this.canvasHeight || corner.y < 0)

	update = t => {
		window.onkeypress = e => e.key === ' ' && this.rocket.impulse()

		this.rocket.applyForce(() => new Vector(0, this.rocketOptions.impulse))
		this.rocket.update(1 / 60)
		this.movingBoxes.update(1 / 60)
	}

	stop = () => {
		this.gameIsRuning = false

		if (this.request) {
			window.cancelAnimationFrame(this.request);
			this.request = undefined;
		}
	}
}