function getPosition(el) {
	let xPosition = 0;
	let yPosition = 0;

	while (el) {
		xPosition += (el.offsetLeft - el.scrollLeft + el.clientLeft);
		yPosition += (el.offsetTop - el.scrollTop + el.clientTop);
		el = el.offsetParent;
	}
	return {
		x: xPosition,
		y: yPosition
	};
}
function setMousePosition(e) {
	mousePos = { x: e.clientX - canvasPos.x, y: e.clientY - canvasPos.y }
}
let mousePos = {};
const canvas = document.getElementById('canvas'),
	canvasWidth = canvas.width,
	canvasHeight = canvas.height,
	centerX = canvasWidth / 2,
	centerY = canvasHeight / 2,
	context = canvas.getContext('2d'),
	canvasPos = getPosition(canvas);

canvas.addEventListener('mousemove', setMousePosition, false);

const gravity = 100;

const ball = {
	mass: 10,
	radi: 10,
	airResistance: 3,
	appliedForce: {},
	acceleration: {},
	velocity: {
		x: 0,
		y: 0
	},
	position: {
		x: centerX,
		y: centerY
	}
};

const spring = {
	k: 50,
	restLength: 100
};
let numberOfPoints = 20;
const numberOfPointsInput = document.getElementById('numberOfPoints');
numberOfPointsInput.value = numberOfPoints;
let sawWidth = 5;
const sawWidthInput = document.getElementById('sawWidth');
sawWidthInput.value = sawWidth;

function drawSpring(pointA, pointB, vector, numberOfPoints, sawWidth) {
	const perpendicular = [{ x: vector.unit.y * sawWidth, y: -vector.unit.x * sawWidth }, { x: -vector.unit.y * sawWidth, y: vector.unit.x * sawWidth }]
	const step = vector.m / numberOfPoints;

	context.moveTo(pointA.x, pointA.y);
	for (let i = 1; i < numberOfPoints; i++) {
		context.lineTo(pointA.x + vector.unit.x * step * i + perpendicular[i % 2].x, pointA.y + vector.unit.y * step * i + perpendicular[i % 2].y);
	}
	context.lineTo(pointB.x, pointB.y)
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

	mousePos.x = mousePos.x || 0;
	mousePos.y = mousePos.y || 0;

	const vectorDistance = {
		x: ball.position.x - mousePos.x,
		y: ball.position.y - mousePos.y,
	};
	vectorDistance.m = Math.sqrt(vectorDistance.x**2 + vectorDistance.y**2);

	vectorDistance.unit = {
		x: vectorDistance.x / vectorDistance.m,
		y: vectorDistance.y / vectorDistance.m
	};
	const restVector = {
		x: mousePos.x + spring.restLength * vectorDistance.unit.x,
		y: mousePos.y + spring.restLength * vectorDistance.unit.y
	}
	const elongationVector = {
		x: ball.position.x - restVector.x,
		y: ball.position.y - restVector.y
	}
	ball.appliedForce = {
		x: -spring.k * elongationVector.x - ball.velocity.x * ball.airResistance,
		y: -spring.k * elongationVector.y - ball.velocity.y * ball.airResistance + gravity * ball.mass
	}
	ball.acceleration = {
		x: ball.appliedForce.x / ball.mass,
		y: ball.appliedForce.y / ball.mass
	}

	ball.velocity.x += ball.acceleration.x * dt
	ball.velocity.y += ball.acceleration.y * dt

	ball.position.x += ball.velocity.x * dt
	ball.position.y += ball.velocity.y * dt


	context.beginPath();
	context.arc(ball.position.x, ball.position.y, ball.radi, 0, 2 * Math.PI, true);
	context.fillStyle = "#FF6A6A";
	context.fill();

	drawSpring(mousePos, ball.position, vectorDistance, numberOfPoints, sawWidth)
	if (!stop) requestAnimationFrame(draw);
}
let t = performance.now() / 1000
draw()
