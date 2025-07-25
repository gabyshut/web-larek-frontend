import { AllEvents } from "../../types";
import { EventEmitter } from "../base/events";

export class FormPaymentAddress {
    private formElement: HTMLFormElement;
    private addressInput: HTMLInputElement;
    private errorElement: HTMLElement;
    private submitButton: HTMLButtonElement;
    protected emitter: EventEmitter<AllEvents>;

    constructor(template: HTMLTemplateElement, emitter: EventEmitter<AllEvents>) {
        this.emitter = emitter;
        const content = template.content.cloneNode(true) as HTMLElement;
        this.formElement = content.querySelector('form[name="order"]')!;
        this.addressInput = this.formElement.querySelector(
            'input[name="address"]'
        )!;
        this.errorElement = this.formElement.querySelector('.form__errors')!;
        this.submitButton = this.formElement.querySelector('.order__button')!;

        this.formElement
            .querySelectorAll('.order__buttons .button')
            .forEach((button) => {
                button.addEventListener('click', () => {
                    this.formElement
                        .querySelectorAll('.order__buttons .button')
                        .forEach((btn) => btn.classList.remove('button_alt-active'));
                    const selected = button.getAttribute('name');
                    if (selected) {
                        button.classList.add('button_alt-active');
                        this.emitter.emit('payment:selected', selected);
                    }
                });
            });

        this.addressInput.addEventListener('input', () => {
            this.emitter.emit('address:input', this.addressInput.value);
        });

        this.formElement.addEventListener('submit', (event) => {
            event.preventDefault();
            this.emitter.emit('form:submit');
        });
    }

    getElement(): HTMLFormElement {
        return this.formElement;
    }

    setFieldError(field: string, message: string): void {
        if (field === 'address') {
            this.addressInput.classList.add('form__input_error');
        }
        this.errorElement.textContent = message;
    }

    clearFieldError(field: string): void {
        if (field === 'address') {
            this.addressInput.classList.remove('form__input_error');
        }
        this.errorElement.textContent = '';
    }

    setSubmitDisabled(disabled: boolean): void {
        this.submitButton.disabled = disabled;
    }

    clearFields(): void {
        this.addressInput.value = '';
        this.clearFieldError('address');
        this.setSubmitDisabled(true);

        this.formElement
            .querySelectorAll('.order__buttons .button')
            .forEach((btn) => btn.classList.remove('button_alt-active'));
    }
}