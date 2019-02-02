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

	function drawCircle(x, y, radi, color = '#FF0000') {
		return function () {
			context.beginPath();
			context.arc(x, y, radi, 0, 2*Math.PI, true);
			context.fillStyle = color;
			context.fill();
		}
	}

	let lastTime = 0;
	(function draw(currentTime) { // Current time in miliseconds
		context.clearRect(0, 0, canvasWidth, canvasHeight); // To clear the canvas each frame
		const dt = (currentTime - lastTime) / 1000 // Delta time in seconds

		drawIn([
			drawCircle(150, 140, 50)
		])

		context.fillText('dt : ' + dt, 10, 25);
		context.fillText('1/dt : ' + 1/dt, 10, 40);
		lastTime = currentTime
		requestAnimationFrame(draw);
	})();
});
