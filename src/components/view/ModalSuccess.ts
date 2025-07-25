import { AllEvents } from "../../types";
import { EventEmitter } from "../base/events";

export class ModalSuccess {
	private template: HTMLTemplateElement;
	private element: HTMLElement;
	protected emitter: EventEmitter<AllEvents>;

	constructor(template: HTMLTemplateElement, emitter: EventEmitter<AllEvents>) {
		this.emitter = emitter;
		this.template = template;
		this.element = this.template.content.firstElementChild!.cloneNode(
			true
		) as HTMLElement;
	}

	renderSuccessModal(total: number): HTMLElement {
		const description = this.element.querySelector(
			'.order-success__description'
		);
		if (description) {
			description.textContent = `Списано ${total} синапсов`;
		}

		const closeButton = this.element.querySelector(
			'.order-success__close'
		) as HTMLButtonElement;
		if (closeButton) {
			closeButton.addEventListener('click', () => {
				this.emitter.emit('modal:close');
			});
		}

		return this.element;
	}
}