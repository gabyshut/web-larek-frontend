import { IModal } from "../../types";

export class Modal implements IModal {
    protected modalContainer: HTMLElement;
    protected modalContent: HTMLElement;
    protected closeButton: HTMLButtonElement;

    constructor(container: HTMLElement) {
        this.modalContainer = container;
        this.modalContent = this.modalContainer.querySelector('.modal__content');
        this.closeButton = this.modalContainer.querySelector('.modal__close');

        this.closeButton.addEventListener('click', () => this.close());
    }

    open(): void {
        this.modalContainer.classList.add('modal_active');
    }

    close(): void {
        this.modalContainer.classList.remove('modal_active');
    }

    disableButton(button: HTMLButtonElement): void {
        button.setAttribute('disabled', 'true');
    }

    setContent(content: HTMLElement): void {
        this.modalContent.innerHTML = '';
        this.modalContent.appendChild(content);
    }
}