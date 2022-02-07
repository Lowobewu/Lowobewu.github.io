/** Hitomezashi class */
export class Hitomezashi {
	#context
	#canvas
	#width
	#height
	#grid_size

	/**
	* New hitomezashi
	* @param {HTMLCanvasElement} canvas - Canvas element to draw to
	*/
	constructor(canvas) {
		this.#canvas = canvas
		this.#context = canvas.getContext('2d')
	}

	/**
	 * Set canvas dimesions
	 * @param {number} width - Width of the canavas
	 * @param {number} height - Height of the canvas
	 */
	#setCanvasDimensions(width, height) {
		this.#canvas.width = width + 1
		this.#width = width + 1
		this.#canvas.height = height + 1
		this.#height = height + 1
	}

	/**
	 * Set canvas dimension according to grid_size
	 * and vertical and horizontal patterns
	 * @param {number} pattern_length_horizontal - Horizontal pattern length
	 * @param {number} pattern_length_vertical - Vertical pattern length
	 */
	#setDimensions(pattern_length_horizontal, pattern_length_vertical) {
		const hor = this.#grid_size * pattern_length_horizontal
		const ver = this.#grid_size * pattern_length_vertical

		this.#setCanvasDimensions(ver, hor)
	}

	/**
	 * Set the grid size
	 * @param {number} size - Size of the grid
	 */
	#setGridSize(size) {
		this.#grid_size = size
	}

	/**
	 * Draw a Segmant in the canvas context
	 * @param {number[]} point_a - Point from
	 * @param {number[]} point_b - Point to
	 */
	#drawSegment(point_a, point_b) {
		this.#context.beginPath()
		this.#context.moveTo(...point_a)
		this.#context.lineTo(...point_b)
		this.#context.stroke()
	}

	/**
	 * Draw a Segmant in the canvas context horizontally
	 * with a fixed length from an origin point
	 * @param {number} x - x Origin point
	 * @param {number} y - y Origin point
	 */
	#drawHorizontalSegment(x, y) {
		this.#drawSegment([x, y], [x + this.#grid_size, y])
	}

	/**
	 * Draw a Segmant in the canvas context vertically
	 * with a fixed length from an origin point
	 * @param {number} x - x Origin point
	 * @param {number} y - y Origin point
	 */
	#drawVerticalSegment(x, y) {
		this.#drawSegment([x, y], [x, y + this.#grid_size])
	}

	/**
	 * Draw the vertical pattern
	 * @param {number} pattern_vertical - Number Pattern
	 * @param {number} stopper - Canvas dimension
	 * @param {function(number, number, number):void} drawSegment - Callback to draw a segment
	 */
	#drawPatternHelper(pattern, stopper, drawSegment) {
		pattern.forEach((start, index) => {
			const start_position = start * this.#grid_size
			const axis_constant = (index + 1) * this.#grid_size

			for (let axis_variable = start_position; axis_variable < stopper; axis_variable += 2 * this.#grid_size) {
				drawSegment(axis_constant, axis_variable)
			}
		})
	}

	/**
	 * Draw the horizontal pattern
	 * @param {number} pattern_horizontal - Horizontal Pattern
	 */
	#drawHorizontalPattern(pattern_horizontal) {
		this.#drawPatternHelper(pattern_horizontal, this.#width, (ac, av) => {
			this.#drawHorizontalSegment(av, ac)
		})
	}

	/**
	 * Draw the vertical pattern
	 * @param {number} pattern_vertical - Vertical Pattern
	 */
	#drawVerticalPattern(pattern_vertical) {
		this.#drawPatternHelper(pattern_vertical, this.#height, (ac, av) => {
			this.#drawVerticalSegment(ac, av)
		})
	}

	/**
	 * Draw the pattern
	 * @param {number} grid_size - Grid Size
	 * @param {number[]} pattern_horizontal - Horizontal Pattern
	 * @param {number[]} pattern_vertical - Vertical Pattern
	 */
	draw(grid_size, pattern_horizontal, pattern_vertical) {
		this.#setGridSize(grid_size)
		this.#setDimensions(pattern_horizontal.length, pattern_vertical.length)

		this.#context.clearRect(0, 0, this.#width, this.#height);
		this.#drawHorizontalPattern(pattern_horizontal)
		this.#drawVerticalPattern(pattern_vertical)
	}
}
