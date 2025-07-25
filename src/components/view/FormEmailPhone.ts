import { AllEvents } from "../../types";
import { EventEmitter } from "../base/events";

export class FormEmailPhone {
	private formElement: HTMLFormElement;
	private emailInput: HTMLInputElement;
	private phoneInput: HTMLInputElement;
	private submitButton: HTMLButtonElement;
	protected emitter: EventEmitter<AllEvents>;

	constructor(template: HTMLTemplateElement, emitter: EventEmitter<AllEvents>) {
		this.emitter = emitter;
		const content = template.content.cloneNode(true) as HTMLElement;
		this.formElement = content.querySelector('form[name="contacts"]')!;
		this.emailInput = this.formElement.querySelector('input[name="email"]')!;
		this.phoneInput = this.formElement.querySelector('input[name="phone"]')!;
		this.submitButton = this.formElement.querySelector(
			'button[type="submit"]'
		)!;

		this.emailInput.addEventListener('input', () => {
			this.emitter.emit('email:input', this.emailInput.value);
		});

		this.phoneInput.addEventListener('input', () => {
			this.emitter.emit('phone:input', this.phoneInput.value);
		});

		this.formElement.addEventListener('submit', (event) => {
			event.preventDefault();
			this.emitter.emit('form:submit');
		});
	}

	getElement(): HTMLFormElement {
		return this.formElement;
	}

	setSubmitDisabled(disabled: boolean): void {
		this.submitButton.disabled = disabled;
	}

	clearFields(): void {
		this.emailInput.value = '';
		this.phoneInput.value = '';
		this.setSubmitDisabled(true);
	}
}