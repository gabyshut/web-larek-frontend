import { ICardData, ICardItem, IModal, TProductId } from '../types';
import { EventEmitter } from './base/events';

export class Page {
	protected gallery: HTMLElement;
	protected basketCounter: HTMLElement;
	protected _basketButton: HTMLButtonElement;

	constructor(
		galleryInit: HTMLElement,
		basketCounterInit: HTMLElement,
		basketButtonInit: HTMLButtonElement
	) {
		this.gallery = galleryInit;
		this._basketButton = basketButtonInit;
		this.basketCounter = basketCounterInit;
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
		const text = card.querySelector('.card__text') as HTMLElement;
		const image = card.querySelector('.card__image') as HTMLImageElement;
		const price = card.querySelector('.card__price') as HTMLElement;
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
			const categoryName = this.cardData.category?.toLowerCase().trim();
			category.textContent = this.cardData.category;

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
		if (title) title.textContent = this.cardData.title;
		if (text) text.textContent = this.cardData.description;
		if (image) {
			image.src = this.cardData.image || '';
			image.alt = this.cardData.title || '';
		}
		if (this.cardData.price != null) {
			price.textContent = `${this.cardData.price} синапсов`;
		} else if (this.cardData.price === null) {
			price.textContent = 'Бесценно';
		}

		card.addEventListener('click', (event) => {
			if ((event.target as HTMLElement).closest('.card__button')) return;
			this.emit('card:click', this.cardData);
		});

		if (button) {
			button.addEventListener('click', () => {
				if (button.classList.contains('basket__item-delete')){
					console.log('клик удаление карточки');
					this.emit('product:remove', this.cardData);
				} else {
									console.log(
					'🔥 Клик по кнопке: добавление товара в корзину',
					this.cardData
				);

				this.emit('product:add', this.cardData);
				}

			});
		}

		return card;
	}
}

export class Modal implements IModal {
	protected modalContainer: HTMLElement;

	constructor(container: HTMLElement) {
		this.modalContainer = container;
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
}

export class ModalBasket extends EventEmitter {
	protected basketTemplate: HTMLTemplateElement;
	protected basketElement: HTMLElement;
	protected submitButton: HTMLElement;

	constructor(template: HTMLTemplateElement) {
		super();
		this.basketTemplate = template;
const fragment = this.basketTemplate.content.cloneNode(true) as DocumentFragment;

	this.basketElement = fragment.querySelector('.basket') as HTMLElement;
		this.submitButton = this.basketElement.querySelector(
			'.basket__button'
		) as HTMLElement;
	}

	getBasketElement(): HTMLElement {
		return this.basketElement;
	}

	setItems(items: HTMLElement[]): void {
		const list = this.getBasketElement().querySelector(
			'.basket__list'
		) as HTMLElement;

while (list.firstChild) {
	list.removeChild(list.firstChild);
}

		items.forEach((item, index) => {
			const indexElement = item.querySelector(
				'.basket__item-index'
			) as HTMLElement;
			if (indexElement) {
				indexElement.textContent = `${index + 1}`;
			}
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

	setOrderHandler(): void {
		const submitOrderButton = this.basketElement.querySelector(
			'.basket__button'
		) as HTMLElement;
		submitOrderButton.addEventListener('click', () => {
			this.emit('submit:click');
		});
	}
}

export class FormPaymentAddress extends EventEmitter {
	private formElement: HTMLFormElement;
	private addressInput: HTMLInputElement;
	private errorElement: HTMLElement;
	private submitButton: HTMLButtonElement;

	constructor(template: HTMLTemplateElement) {
		super();

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
						this.emit('payment:selected', selected);
					}
				});
			});

		this.addressInput.addEventListener('input', () => {
			this.emit('address:input', this.addressInput.value);
		});

		this.formElement.addEventListener('submit', (event) => {
			event.preventDefault();
			this.emit('form:submit');
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
}

export class FormEmailPhone extends EventEmitter {
	private formElement: HTMLFormElement;
	private emailInput: HTMLInputElement;
	private phoneInput: HTMLInputElement;
	private submitButton: HTMLButtonElement;

	constructor(template: HTMLTemplateElement) {
		super();

		const content = template.content.cloneNode(true) as HTMLElement;
		this.formElement = content.querySelector('form[name="contacts"]')!;
		this.emailInput = this.formElement.querySelector('input[name="email"]')!;
		this.phoneInput = this.formElement.querySelector('input[name="phone"]')!;
		this.submitButton = this.formElement.querySelector(
			'button[type="submit"]'
		)!;

		this.emailInput.addEventListener('input', () => {
			this.emit('email:input', this.emailInput.value);
		});

		this.phoneInput.addEventListener('input', () => {
			this.emit('phone:input', this.phoneInput.value);
		});

		this.formElement.addEventListener('submit', (event) => {
			event.preventDefault();
			this.emit('form:submit', {
				email: this.emailInput.value,
				phone: this.phoneInput.value,
			});
		});
	}

	getElement(): HTMLFormElement {
		return this.formElement;
	}

	setSubmitDisabled(disabled: boolean): void {
		this.submitButton.disabled = disabled;
	}
}

export class ModalSuccess extends EventEmitter{
	private template: HTMLTemplateElement;
	private element: HTMLElement;

	constructor(template: HTMLTemplateElement) {
		super();
		this.template = template;
		this.element = this.template.content.firstElementChild!.cloneNode(true) as HTMLElement;
	}

	renderSuccessModal(total: number): HTMLElement {
		const description = this.element.querySelector('.order-success__description');
		if (description) {
			description.textContent = `Списано ${total} синапсов`;
		}

		const closeButton = this.element.querySelector('.order-success__close') as HTMLButtonElement;
		if (closeButton) {
			closeButton.addEventListener('click', () => {
					this.emit('modal:close');
			});
		}

		return this.element;
	}
}
