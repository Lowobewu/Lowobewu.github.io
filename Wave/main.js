class LinkedParticle extends Particle {
	constructor(id, ...args) {
		super(...args)
		this.id = id
		this.links = []
	}

	linkTo(linkedParticle, springConstant, relaxedLength) {
		if (linkedParticle === this) {
			console.error(new Error(`Can't link particle "${linkedParticle.id}" to itself`))
		} else if (this.links.includes(linkedParticle)) {
			console.error(new Error(`Particle "${linkedParticle.id}" already linked to particle "${this.id}"`))
		} else {
			this.links.push({linkedParticle, springConstant, relaxedLength})
		}
	}

	static link (linkedParticleA, linkedParticleB, springConstant, relaxedLength) {
		linkedParticleA.linkTo(linkedParticleB, springConstant, relaxedLength)
		linkedParticleB.linkTo(linkedParticleA, springConstant, relaxedLength)
	}

	// To do: Unlink
}

const numberOfColumns = 35
const numberOfRows = 20
const airResistanceConstant = 25
const l = 25
const constant = 300

const allParticles = []

for (let i = 0; i < numberOfRows; i++) {
	for (let j = 0; j < numberOfColumns; j++) {
		allParticles.push(new LinkedParticle(`${i} - ${j}`, 30, l * ( j + 1 ), l * ( i + 1 ) + 45))
	}
	let k = 0
	for (let j = allParticles.length - numberOfColumns + 1; j < allParticles.length; j++, k++) {
		const springConstant = i > k - 5 ? constant : constant * 10
		LinkedParticle.link(allParticles[j-1], allParticles[j], springConstant, l)
	}
	allParticles[allParticles.length - numberOfColumns + 1].velocity.x -= 100
}

function springForce(springConstant, relaxedLength, springPositionEnd) {
	return function(mass, springPositionOrigin) {
		const currentLength = springPositionOrigin.sub(springPositionEnd)
		return currentLength.unit.times(springConstant*(currentLength.length - relaxedLength))
	}
}

function linkedSpring(particle, link) {
	return function() {
		return link.linkedParticle.generateForce(springForce(link.springConstant, link.relaxedLength, particle.position))
	}
}

function airResistanceForce(airResistance) {
	return function(mass, position, velocity) {
		return velocity.times(-airResistance)
	}
}

document.addEventListener("DOMContentLoaded", function(event) {
	const canvas = document.getElementById('canvas'),
	canvasWidth = canvas.width,
	canvasHeight = canvas.height,
	centerX = canvasWidth / 2,
	centerY = canvasHeight / 2,
	context = canvas.getContext('2d');

	function drawIn(callbacks) {
		callbacks.forEach(callback => {
			callback();
			context.fillStyle = '#000000';
		});
	}

	function drawCircle(x, y, radi, color = '#000000') {
		return function () {
			context.beginPath();
			context.arc(x, y, radi, 0, 2*Math.PI, true);
			context.fillStyle = color;
			context.fill();
		}
	}

	let lastTime = 0;
	(function draw(currentTime = 0) { // Current time in miliseconds
		context.clearRect(0, 0, canvasWidth, canvasHeight); // To clear the canvas each frame
		const dt = (currentTime - lastTime) / 1000 // Delta time in seconds

		allParticles.map(particle => {
			// particle.applyForce(particle.links.reduce((totalForce, link) => {
			//	return totalForce.add(link.linkedParticle.generateForce(springForce(link.springConstant, link.relaxedLength, particle.position)))
			// }, particle.velocity.times(-airResistance)))

			particle.applyForce(airResistanceForce(airResistanceConstant))
			particle.links.forEach(link => {
				particle.applyForce(linkedSpring(particle, link))
			})


			return particle
		}).forEach(particle => particle.update(dt))

		drawIn(allParticles.map(particle => drawCircle(particle.x, particle.y, 1 + Math.min(Math.max(particle.velocity.x,0),5), '#FF0000')))

		context.fillText('dt : ' + dt, 10, 25);
		context.fillText('1/dt : ' + 1/dt, 10, 40);
		lastTime = currentTime
		requestAnimationFrame(draw);
	})();
});
