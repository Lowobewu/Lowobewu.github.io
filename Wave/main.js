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
			this.links.push({ linkedParticle, springConstant, relaxedLength })
		}
	}

	static link(linkedParticleA, linkedParticleB, springConstant, relaxedLength) {
		linkedParticleA.linkTo(linkedParticleB, springConstant, relaxedLength)
		linkedParticleB.linkTo(linkedParticleA, springConstant, relaxedLength)
	}

	// To do: Unlink
}

const allParticles = []

for (let i = 0; i < numberOfRows; i++) {
	for (let j = 0; j < numberOfColumns; j++) {
		allParticles.push(new LinkedParticle(`${i} - ${j}`, 30, l * (j + 1), l * (i + 1) ))
	}
	let k = 0
	for (let j = allParticles.length - numberOfColumns + 1; j < allParticles.length; j++ , k++) {
		const springConstant = i > k - 5 ? constant : constant * constantModifier
		LinkedParticle.link(allParticles[j - 1], allParticles[j], springConstant, l)
	}
	allParticles[allParticles.length - numberOfColumns].velocity.x += 20
}

function springForce(springConstant, relaxedLength, elongation) {
	return function () {
		return elongation.unit.times(springConstant * (elongation.length - relaxedLength))
	}
}

function linkedSpringForce(particle, link) {
	const elongation = link.linkedParticle.position.sub(particle.position)
	return springForce(link.springConstant, link.relaxedLength, elongation)
}

function airResistanceForce(airResistance) {
	return function (mass, position, velocity) {
		return velocity.unit.times(-airResistance)
	}
}

document.addEventListener("DOMContentLoaded", function (event) {
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
			context.arc(x, y, radi, 0, 2 * Math.PI, true);
			context.fillStyle = color;
			context.fill();
		}
	}

	let lastTime = 0;
	(function draw() {
		context.clearRect(0, 0, canvasWidth, canvasHeight); // To clear the canvas each frame
		const dt = 1 / 60 // Delta time in seconds

		allParticles.map(particle => {
			particle.applyForce(airResistanceForce(airResistanceConstant))
			particle.links.forEach(link => {
				particle.applyForce(linkedSpringForce(particle, link))
			})

			return particle
		}).forEach(particle => particle.update(dt))

		drawIn(allParticles.map(particle => drawCircle(particle.x, particle.y, 1 + Math.min(Math.max(particle.velocity.x, 0), 5), '#FF0000')))

		requestAnimationFrame(draw);
	})();
});
