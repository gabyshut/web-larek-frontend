import { AllEvents, ICardItem } from "../../types";
import { EventEmitter } from "../base/events";

export class CardView {
    protected cardTemplate: HTMLTemplateElement;
    protected emitter: EventEmitter<AllEvents>;
    protected cardElement: HTMLElement;

    constructor(template: HTMLTemplateElement, emitter: EventEmitter<AllEvents>) {
        this.cardTemplate = template;
        this.emitter = emitter;
    }

    renderCard(
        cardData: ICardItem,
        index?: number,
        disablePreview = false
    ): HTMLElement {
        const clone = this.cardTemplate.content.cloneNode(true) as HTMLElement;
        const card = clone.querySelector('.card') as HTMLElement;

        const category = card.querySelector('.card__category') as HTMLElement;
        const title = card.querySelector('.card__title') as HTMLElement;
        const text = card.querySelector('.card__text') as HTMLElement;
        const image = card.querySelector('.card__image') as HTMLImageElement;
        const price = card.querySelector('.card__price') as HTMLElement;
        const indexEl = card.querySelector('.basket__item-index') as HTMLElement;
        const button = card.querySelector(
            '.card__button'
        ) as HTMLButtonElement | null;

        const categoryClassMap: Record<string, string> = {
            'софт-скил': 'soft',
            'хард-скил': 'hard',
            другое: 'other',
            дополнительное: 'additional',
            кнопка: 'button',
        };

        if (category) {
            const categoryName = cardData.category?.toLowerCase().trim();
            category.textContent = cardData.category;

            const classSuffix = categoryClassMap[categoryName];
            if (category.classList.contains(`card__category_other`)) {
                category.classList.replace(
                    'card__category_other',
                    `card__category_${classSuffix}`
                );
            } else {
                category.classList.add(`card__category_${classSuffix}`);
            }
        }
        if (title) title.textContent = cardData.title;
        if (text) text.textContent = cardData.description;
        if (image) {
            image.src = cardData.image || '';
            image.alt = cardData.title || '';
        }
        if (cardData.price != null) {
            price.textContent = `${cardData.price} синапсов`;
        } else if (cardData.price === null) {
            price.textContent = 'Бесценно';
        }
        if (indexEl) indexEl.textContent = `${index + 1}`;

        card.addEventListener('click', (event) => {
            if ((event.target as HTMLElement).closest('.card__button')) return;
            if (!disablePreview) {
                this.emitter.emit('card:click', cardData);
            }
        });

        if (button) {
            button.classList.contains('basket__item-delete')
                ? button.addEventListener('click', () => {
                        this.emitter.emit('product:remove', cardData);
                  })
                : null;
        }

        this.cardElement = card;
        return card;
    }

    getButton(): HTMLButtonElement {
        if (!this.cardElement) return null;
        return this.cardElement.querySelector('.card__button');
    }
}