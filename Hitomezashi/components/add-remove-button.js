const template = document.createElement('template');
template.innerHTML = `
	<style>
		:host {
			--thickness: 4px;
			--outer-color: #000;
			--inner-color: #FFF;
			aspect-ratio: 1/1;
			border: var(--thickness) solid var(--outer-color);
			display: inline-block;
			background-position: calc(100% + var(--thickness)/2) calc(100% + var(--thickness)/2);
			background-size: calc(50%  + var(--thickness)) calc(50%  + var(--thickness));
		}

		:host([mode="add"]) {
			background-image: conic-gradient(from 90deg at var(--thickness) var(--thickness), var(--outer-color) 90deg, var(--inner-color) 0);
		}

		:host([mode="remove"]) {
			background-image: conic-gradient(from 90deg at var(--thickness) var(--thickness), var(--outer-color) 180deg, var(--inner-color) 0);
		}
	</style>
`;

/** AddRemoveButton class */
export default class AddRemoveButton extends HTMLElement {
	/** New AddRemoveButton */
	constructor() {
		super()
		this.attachShadow({ mode: 'open' })
		this.template_content = template.content.cloneNode(true)
		this.shadowRoot.appendChild(this.template_content)
	}
}
