class Ball extends Particle {
	constructor(mass, x, y, vx, vy, radi, color) {
		super(mass, x, y, vx, vy)
		this.radi = radi
		this.color = color || '#000000'
	}

	draw(context) {
		context.beginPath();
		context.arc(this.x, this.y, this.radi, 0, 2 * Math.PI, true);
		context.fillStyle = this.color;
		context.fill();
	}
}

function getPosition(element) {
	let x = 0;
	let y = 0;

	while (element) {
		x += (element.offsetLeft - element.scrollLeft + element.clientLeft);
		y += (element.offsetTop - element.scrollTop + element.clientTop);
		element = element.offsetParent;
	}
	return { x, y };
}
let mousePosition;
function setMousePosition(e) {
    mousePosition = new Vector(e.clientX - canvasPos.x, e.clientY - canvasPos.y);
}

const canvas = document.getElementById('canvas'),
	canvasWidth = canvas.width,
	canvasHeight = canvas.height,
	centerX = canvasWidth / 2,
	centerY = canvasHeight / 2,
	context = canvas.getContext('2d'),
	canvasPos = getPosition(canvas);

canvas.addEventListener('mousemove', setMousePosition, false);

const ball = new Ball(10, centerX, centerY, 0, 0, 10, '#FF6A6A')

function springForce(springConstant, relaxedLength, elongation) {
    const magnitude = -springConstant * (elongation.length - relaxedLength);

	return function () {
		return elongation.unit.times(magnitude)
	}
}

let numberOfPoints = 20;
const numberOfPointsInput = document.getElementById('numberOfPoints');
numberOfPointsInput.value = numberOfPoints;
let sawWidth = 5;
const sawWidthInput = document.getElementById('sawWidth');
sawWidthInput.value = sawWidth;
const spring = {
	k: 50,
	restLength: 100
};

/**
 * Draws a saw from Postion A to position B
 * @param {Vector} positionA - Position to start the drawing
 * @param {Vector} positionB - Position to stop the drawing
 * @param {Vector} _distance - Distance from position A to position B
 * @param {Integer} numberOfPoints - Number of saws
 * @param {Number} sawWidth - Width of the saw
 */
function drawSpring(positionA, positionB, _distance, numberOfPoints, sawWidth) {
    const distance = _distance || positionB.sub(positionA);
    const distanceUnit = distance.unit;
    const widthVector = distanceUnit.times(sawWidth)
    const perpendicularDistance = [new Vector(widthVector.y, -widthVector.x), new Vector(-widthVector.y, widthVector.x)]
	const step = distance.length / numberOfPoints;

	context.moveTo(positionA.x, positionA.y);
	for (let i = 1; i < numberOfPoints; i++) {
        const vector = Vector.sum(positionA, distanceUnit.times(step * i), perpendicularDistance[i % 2])
		context.lineTo(vector.x, vector.y);
	}
	context.lineTo(positionB.x, positionB.y)
	//context.fillStyle = "#000000";
	context.stroke();
}

let stop = false
function change() {
	t = performance.now() / 1000;
	draw()
}
function stopAnimation() {
	stop = !stop;
	change()
}
window.onkeypress = e => e.key === ' ' && stopAnimation();

function draw() {
	const dt = performance.now() / 1000 - t;
	t += dt //performance.now()
	context.clearRect(0, 0, canvasWidth, canvasHeight);

	mousePosition = mousePosition || new Vector();

	const distance = ball.position.sub(mousePosition);

	ball.applyForce(springForce(spring.k,spring.restLength,distance))
	ball.update(dt)
	ball.draw(context)

	drawSpring(mousePosition, ball.position, distance, numberOfPoints, sawWidth)
	if (!stop) requestAnimationFrame(draw);
}
let t = performance.now() / 1000
draw()
