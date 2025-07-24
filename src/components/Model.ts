import {
	IApiClient,
	IBasket,
	ICardData,
	ICardItem,
	IUserOrderData,
	TProductId,
} from '../types';
import { CDN_URL } from '../utils/constants';
import { Api } from './base/api';
import { EventEmitter } from './base/events';

export class CardModel implements ICardData {
	private _items: ICardItem[] = [];

	constructor(initialItems?: ICardItem[]) {
		this._items = initialItems ?? [];
	}

	getItemById(id: TProductId): ICardItem | undefined {
		return this._items.find((item) => item.id === id);
	}

	get items(): ICardItem[] {
		return this._items;
	}

	set items(products: ICardItem[]) {
		this._items = products;
	}
}

export class Basket implements IBasket {
	protected _items: ICardItem[];
	protected _cardData: ICardData;
	protected _total: number = 0;

	constructor(card: ICardData) {
		this._items = [];
		this._cardData = card;
	}

	get items(): ICardItem[] {
		return this._items;
	}

	get total(): number {
		return this._total;
	}

	getProducts(): ICardItem[] {
		//нахуя это дублирование
		return this._items;
	}

	addItem(itemId: TProductId): void {
		const product = this._cardData.getItemById(itemId);
		if (!product) {
			throw new Error(`Product with ID ${itemId} not found`);
		// } else if (this._items.find((card) => card.id === itemId).id === itemId) {
		// 	throw new Error(`Product with ID ${itemId} already exists in basket`);
		} else {
			this._items.push(product);
		}

		this.updateTotal();
	}

	deleteItem(itemId: TProductId): void {
		this._items = this._items.filter((item) => item.id !== itemId);
    this.updateTotal();
	}

	clearList(): void {
		this._items = [];
	}

	protected updateTotal(): void {
		this._total = this._items.reduce((sum, item) => sum + (item.price || 0), 0);
	}
}

export class UserOrderModel extends EventEmitter {
	protected UserOrderData: IUserOrderData;

	constructor() {
		super();
		this.UserOrderData = {
			payment: undefined,
			address: '',
			email: '',
			phone: '',
			items: [],
			total: 0,
		};
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
			this.emit('order:error', {
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
			this.emit('order:error', { field: 'items', message: 'Корзина пуста' });
			isFormValid = false;
		} else {
			for (const product of products) {
				const hasAllFields = Object.values(product).every(
					(value) => value !== null && value !== undefined
				);
				if (!hasAllFields) {
					this.emit('order:error', {
						field: 'products',
					});
					isFormValid = false;
					break;
				}
			}
		}

		// Финальный шаг
		if (isFormValid) {
			this.emit('order:ready', this.UserOrderData);
		}
	}

	setItems(items: ICardItem[]): void {
		this.UserOrderData.items = items.map((item) => item.id);
	}

	setTotal(total: number): void {
		//нахуя он нужен
		this.UserOrderData.total = total;
	}

	get data(): IUserOrderData {
		return this.UserOrderData;
	}
}

interface IProductListResponse {
	items: ICardItem[];
	total: number;
}

export class ApiClient extends Api implements IApiClient {
	constructor(baseUrl: string, options: RequestInit = {}) {
		super(baseUrl, options);
	}

	async getProducts(): Promise<ICardItem[]> {
		const response = await this.get<IProductListResponse>('/product');
		return response.items.map((item) => ({
			...item,
			image: item.image ? `${CDN_URL}/${item.image}` : null,
		}));
	}

	async createOrder(order: IUserOrderData): Promise<void> {
		await this.post('/order', order);
	}
}
