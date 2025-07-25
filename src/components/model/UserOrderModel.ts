import { AllEvents, ICardItem, IUserOrderData } from '../../types';
import { EventEmitter } from '../base/events';

export class UserOrderModel {
	protected UserOrderData: IUserOrderData;
	protected emitter: EventEmitter<AllEvents>;

	constructor(emitter: EventEmitter<AllEvents>) {
		this.UserOrderData = {
			payment: undefined,
			address: '',
			email: '',
			phone: '',
			items: [],
			total: 0,
		};
		this.emitter = emitter;
	}
	setField<T extends keyof IUserOrderData>(
		field: T,
		value: IUserOrderData[T]
	): void {
		this.UserOrderData[field] = value;
	}

	getField<K extends keyof IUserOrderData>(field: K): IUserOrderData[K] {
		return this.UserOrderData[field];
	}

	validate(field: keyof IUserOrderData): boolean {
		const value = this.UserOrderData[field];

		let isValid = true;

		if (typeof value === 'string' && !value.trim()) {
			isValid = false;
		}

		if (!isValid) {
			this.emitter.emit('order:error', {
				field,
				message: 'Необходимо указать адрес',
			});
		}

		return isValid;
	}

	prepareOrder(): void {
		const requiredFields: (keyof IUserOrderData)[] = [
			'address',
			'email',
			'phone',
			'payment',
		];
		let isFormValid = true;

		// Валидация текстовых полей
		for (const field of requiredFields) {
			if (!this.validate(field)) {
				isFormValid = false;
			}
		}

		// Валидация продуктов
		const products = this.UserOrderData.items;

		if (!Array.isArray(products) || products.length === 0) {
			this.emitter.emit('order:error', {
				field: 'items',
				message: 'Корзина пуста',
			});
			isFormValid = false;
		} else {
			for (const product of products) {
				const hasAllFields = Object.values(product).every(
					(value) => value !== null && value !== undefined
				);
				if (!hasAllFields) {
					this.emitter.emit('order:error', {
						field: 'products',
					});
					isFormValid = false;
					break;
				}
			}
		}

		if (isFormValid) {
			this.emitter.emit('order:ready', this.UserOrderData);
		}
	}

	setItems(items: ICardItem[]): void {
		this.UserOrderData.items = items.map((item) => item.id);
	}

	setTotal(total: number): void {
		this.UserOrderData.total = total;
	}

	get data(): IUserOrderData {
		return this.UserOrderData;
	}

	clear() {
		this.UserOrderData = {
			address: '',
			email: '',
			phone: '',
			payment: null,
			items: [],
			total: 0,
		};
	}
}
