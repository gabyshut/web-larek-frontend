import { AllEvents } from "../../types";
import { EventEmitter } from "../base/events";

export class Page {
    protected gallery: HTMLElement;
    protected basketCounter: HTMLElement;
    protected _basketButton: HTMLButtonElement;
    protected emitter: EventEmitter<AllEvents>;

    constructor(
        galleryInit: HTMLElement,
        basketCounterInit: HTMLElement,
        basketButtonInit: HTMLButtonElement,
        emitter: EventEmitter<AllEvents>
    ) {
        this.gallery = galleryInit;
        this._basketButton = basketButtonInit;
        this.basketCounter = basketCounterInit;
        this.emitter = emitter;
        this._basketButton.addEventListener('click', () => {
            this.emitter.emit('basket:click');
        });
    }

    get basketButton(): HTMLButtonElement {
        return this._basketButton;
    }

    setCatalog(items: HTMLElement[]): void {
        items.forEach((item) => {
            this.gallery.append(item);
        });
    }

    setBasketCounter(count: number): void {
        this.basketCounter.textContent = `${count}`;
    }
}