import { AllEvents } from "../../types";
import { EventEmitter } from "../base/events";

export class ModalBasket {
    protected basketTemplate: HTMLTemplateElement;
    protected basketElement: HTMLElement;
    protected submitButton: HTMLElement;
    protected listContainer: HTMLElement;
    protected emitter: EventEmitter<AllEvents>;

    constructor(template: HTMLTemplateElement, emitter: EventEmitter<AllEvents>) {
        this.basketTemplate = template;
        this.emitter = emitter;

        const fragment = this.basketTemplate.content.cloneNode(
            true
        ) as DocumentFragment;
        this.basketElement = fragment.querySelector('.basket') as HTMLElement;
        this.submitButton = this.basketElement.querySelector(
            '.basket__button'
        ) as HTMLButtonElement;
        this.listContainer = this.basketElement.querySelector(
            '.basket__list'
        ) as HTMLElement;

        this.submitButton.addEventListener('click', () => {
            this.emitter.emit('submit:click');
        });
    }

    render(): HTMLElement {
        return this.basketElement;
    }

    setItems(items: HTMLElement[]): void {
        const list = this.listContainer;

        list.innerHTML = '';

        items.forEach((item) => {
            list.appendChild(item);
        });
        if (items.length > 0) {
            this.submitButton.removeAttribute('disabled');
        } else {
            this.submitButton.setAttribute('disabled', 'true');
        }
    }

    setTotal(total: number): void {
        const totalElement = this.basketElement.querySelector(
            '.basket__price'
        ) as HTMLElement;
        totalElement.textContent = `${total} синапсов`;
    }
}