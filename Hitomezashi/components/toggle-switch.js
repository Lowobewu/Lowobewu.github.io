/**
 * @typedef {Object} ToggleSwitchDom
 * @property {HTMLElement} label - ToggleSwitch container
 * @property {HTMLElement} input - HTML input type checked
 */

/**
 * Creates a label containing an input an a span
 * @param {boolean} checked
 * @returns {ToggleSwitchDom}
 */
const cretateToggleSwitchDom = checked => {
	const slider = document.createElement('span');

	const input = document.createElement('input')
	input.type = 'checkbox'
	input.checked = checked

	const label = document.createElement('label')

	label.appendChild(input)
	label.appendChild(slider)

	return { label, input }
}

const template = document.createElement('template');
template.innerHTML = `
	<style>
		:host {
			--toggle-padding: 4px;
			--toggle-short: var(--short, 34px);
			--toggle-long: calc(2*calc(var(--toggle-short) - var(--toggle-padding)));
			--toggle-inner: calc(var(--toggle-long) / 2 - var(--toggle-padding));
			--toggle-on: #2196F3;
			--toggle-off: #CCC;
			--toggle-focus: var(--togle-on);
			--toggle-time: var(--time, .4s);
		}

		:host, label {
			position: relative;
			display: inline-block;
			width: var(--toggle-long);
			height: var(--toggle-short);
		}

		:host([vertical]), :host([vertical]) label {
			width: var(--toggle-short);
			height: var(--toggle-long);
		}

		input {
			opacity: 0;
			width: 0;
			height: 0;
		}

		span {
			position: absolute;
			cursor: pointer;
			top: 0;
			left: 0;
			right: 0;
			bottom: 0;
			background-color: var(--toggle-off);
			transition: var(--toggle-time);
		}

		:host([round]) span {
			border-radius: var(--toggle-short);
		}

		span:before {
			position: absolute;
			content: "";
			height: var(--toggle-inner);
			width: var(--toggle-inner);
			left: var(--toggle-padding);
			bottom: var(--toggle-padding);
			background-color: white;
			transition: var(--toggle-time);
		}

		:host([round]) span:before {
			border-radius: 50%;
		}

		input:checked + span {
			background-color: var(--toggle-on);
		}

		input:focus + span {
			box-shadow: 0 0 1px var(--toggle-focus);
		}

		input:checked + span:before {
			transform: translateX(var(--toggle-inner));
		}

		:host([vertical]) input:checked + span:before {
			transform: translateY(calc(-1*var(--toggle-inner)));
		}
	</style>
`;

/** ToggleSwitch class */
export default class ToggleSwitch extends HTMLElement {
	/** New ToggleSwitch */
	constructor() {
		super()
		this.attachShadow({ mode: 'open' })
		this.template_content = template.content.cloneNode(true)

		this.shadowRoot.appendChild(this.template_content)
		const { label, input } = cretateToggleSwitchDom(this.hasAttribute('checked'))
		this.shadowRoot.appendChild(label)
		this.input = input
	}

	/**
	 * @type {boolean}
	 */
	get checked() {
		return this.input.checked
	}

	set checked(is_hecked) {
		this.input.checked = !!is_hecked

		if (this.input.checked) {
			this.setAttribute('checked', '');
		} else {
			this.removeAttribute('checked');
		}
	}

	/**
	 * @type {boolean}
	 */
	get vertical() {
		return this.hasAttribute('vertical')
	}

	set vertical(is_ertical) {
		if (is_ertical) {
			this.setAttribute('vertical', '');
		} else {
			this.removeAttribute('vartical');
		}
	}

	/**
	 * Adds a click event listener to the input element
	 * @param { function(event): any } listener
	 */
	addClickListener(listener) {
		this.input.addEventListener('click', listener)
	}
}

