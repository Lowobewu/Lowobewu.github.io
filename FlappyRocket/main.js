const canvas = document.getElementById('canvas')
const rocketOptions = {
	speed: 150,
	impulse: 500,
	height: 126,
	width: 15
}
const game = new Game(canvas, rocketOptions)

window.addEventListener('keyup', event => {
	if (event.code === 'Space' && !game.gameIsRuning) {
		game.start()
	}
})
