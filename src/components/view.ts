import { ICardData, ICardItem, TProductId } from "../types";
import { EventEmitter } from "./base/events";

export class Page {
    protected gallery: HTMLElement;
    protected basketCounter: HTMLElement;
    protected basketButton: HTMLElement;

    constructor(galleryInit: HTMLElement, basketCounterInit: HTMLElement, basketButtonInit: HTMLElement){
        this.gallery = galleryInit;
        this.basketButton = basketButtonInit;
        this.basketCounter = basketCounterInit;
    }

    setCatalog(items: HTMLElement[]): void{
        items.forEach((item) => {
            this.gallery.prepend(item);
        })
    }

    setBasketCounter(count: number): void{

    }
}

export class CardView extends EventEmitter {
	protected cardTemplate: HTMLTemplateElement;
	protected cardData: ICardItem;

	constructor(template: HTMLTemplateElement, data: ICardItem) {
		super();
		this.cardData = data;
		this.cardTemplate = template;
	}

	renderCard(): HTMLElement {
		const clone = this.cardTemplate.content.cloneNode(true) as HTMLElement;
		const card = clone.querySelector('.card') as HTMLElement;

		const category = card.querySelector('.card__category') as HTMLElement;
		const title = card.querySelector('.card__title') as HTMLElement;
		const image = card.querySelector('.card__image') as HTMLImageElement;
		const price = card.querySelector('.card__price') as HTMLElement;
		const button = card.querySelector('.card__button') as HTMLButtonElement | null;

		if (category) category.textContent = this.cardData.category || 'Без категории';
		if (title) title.textContent = this.cardData.title;
		if (image) {
			image.src = this.cardData.image || '';
			image.alt = this.cardData.title || '';
		}
		if (price) price.textContent = this.cardData.price != null ? `${this.cardData.price} синапсов` : 'Бесценно';

		card.addEventListener('click', (event) => {
			if ((event.target as HTMLElement).closest('.card__button')) return;
			this.emit('card:click', this.cardData);
		});

		if (button) {
			button.addEventListener('click', (event) => {
				event.stopPropagation();
				this.emit('card:add', this.cardData);
			});
		}

		return card;
	}
}