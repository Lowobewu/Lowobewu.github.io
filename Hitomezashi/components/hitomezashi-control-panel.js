import AddRemoveButton from './add-remove-button.js'
import ToggleSwitch from './toggle-switch.js'
import { Hitomezashi } from '../hitomezashi.js'

customElements.define('add-remove-button', AddRemoveButton);
customElements.define('toggle-switch', ToggleSwitch);

/**
 * Creates the HTML Template Element
 * @param {number} grid_size - Size of the grid
 * @returns {HTMLTemplateElement}
 */
const createTemplate = grid_size => {
	const margin = 2
	const corner_size = grid_size * 2
	const template = document.createElement('template');
	template.innerHTML = `
		<style>
			:host {
				--margin: ${margin}px;
				--margin-extra: calc(var(--margin) + 5px);
				--grid-size: ${grid_size}px;
				--corner-size: ${corner_size}px;
				display: grid;
				grid-template-rows: var(--corner-size) repeat(auto-fill, var(--grid-size));
				grid-template-columns: var(--corner-size) repeat(auto-fill, var(--grid-size));
				grid-auto-columns:var(--grid-size);
				grid-auto-rows:var(--grid-size);
			}

			canvas {
				grid-column-start: 2;
				grid-row-start: 2;
			}

			div {
				grid-column-start: 1;
				grid-row-start: 1;
				display: grid;
				grid-template-columns: repeat(2, 1fr);
				grid-template-rows: repeat(2, 1fr);
			}

			toggle-switch {
				--short: ${grid_size - margin * 2}px;
				margin: var(--margin);
			}

			toggle-switch:not([vertical]) {
				grid-column-start: 1;
				justify-self: end;
				top: calc(var(--short)/2);
				margin-right: var(--margin-extra);
			}

			toggle-switch[vertical] {
				grid-row-start: 1;
				align-self: end;
				left: calc(var(--short)/2);
				margin-bottom: var(--margin-extra);
			}

		</style>
		<div></div>
		<canvas></canvas>
	`;

	return template
}

export default class HitomezashiControlPanel extends HTMLElement {
	constructor() {
		super()
		this.attachShadow({ mode: 'open' })
		this.grid_size = parseInt(this.getAttribute('grid-size'), 10)

		this.template_content = createTemplate(this.grid_size).content.cloneNode(true)

		this.shadowRoot.appendChild(this.template_content)

		const canvas = this.shadowRoot.querySelector('canvas')

		this.toggles_horizontal = []
		this.toggles_vertical = []

		this.hitomezashi = new Hitomezashi(canvas)
	}

	#getPatternFromToggles(toggles) {
		return toggles.map(toggle => Number(toggle.checked))
	}

	#draw() {
		const pattern_horizontal = this.#getPatternFromToggles(this.toggles_horizontal)
		const pattern_vertical = this.#getPatternFromToggles(this.toggles_vertical)

		this.hitomezashi.draw(this.grid_size, pattern_horizontal, pattern_vertical)
	}

	#createToggle(is_vertical, is_checked = false) {
		const toggle = document.createElement('toggle-switch')
		toggle.checked = is_checked
		toggle.vertical = is_vertical
		toggle.addClickListener(() => this.#draw())

		return toggle
	}

	#appendToggle(toggle) {
		this.shadowRoot.appendChild(toggle)
	}

	#addToggle(toggle) {
		const toggles = toggle.vertical ? this.toggles_vertical : this.toggles_horizontal
		toggles.push(toggle)

		this.#appendToggle(toggle)
	}

	#removeToggle(vertical) {
		const toggles = vertical ? this.toggles_vertical : this.toggles_horizontal
		const toggle = toggles.pop()
		toggle.remove()
	}

	#creteTogglesFromPatternString(pattern_string, vertical) {
		pattern_string.split(',').map(Number).forEach(is_checked => {
			this.#addToggle(this.#createToggle(vertical, is_checked))
		})
	}

	#createButton(container, mode, vertical, event) {
		const button = document.createElement('add-remove-button')

		button.setAttribute('mode', mode)
		button.className = vertical ? 'vertical' : 'horizontal'
		button.addEventListener('click', () => {
			event()
			this.#draw()
		})

		container.appendChild(button)
	}

	#createAddButton(container, vertical) {
		this.#createButton(container, 'add', vertical, () => {
			const toggle = this.#createToggle(vertical)
			this.#addToggle(toggle)
		})
	}

	#createRemoveButton(container, vertical) {
		this.#createButton(container, 'remove', vertical, () => {
			this.#removeToggle(vertical)
		})
	}

	#createCreateRemoveTogglePanel() {
		const container = this.shadowRoot.querySelector('div')

		this.#createAddButton(container, true)
		this.#createRemoveButton(container, true)
		this.#createAddButton(container, false)
		this.#createRemoveButton(container, false)
	}

	connectedCallback() {
		this.#createCreateRemoveTogglePanel()
		this.#creteTogglesFromPatternString(this.getAttribute('horizontal'), false)
		this.#creteTogglesFromPatternString(this.getAttribute('vertical'), true)
		this.#draw()
	}
}
