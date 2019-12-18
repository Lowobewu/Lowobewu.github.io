const canvas = document.getElementById('canvas')
const rocketOptions = {
	impulse: 500,
	height: 126,
	width: 15
}
const game = new Game(canvas, rocketOptions, 150)

window.addEventListener('keyup', event => {
	if (event.code === 'Space' && !game.gameIsRuning) {
		game.start()
	}
})
