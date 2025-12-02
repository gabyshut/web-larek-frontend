import { IBasket, ICardData, ICardItem, TProductId } from "../../types";

export class Basket implements IBasket {
    protected _items: ICardItem[];
    protected _cardData: ICardData;
    protected _total = 0;

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
        return this._items;
    }

    addItem(itemId: TProductId): void {
        const product = this._cardData.getItemById(itemId);
        if (!product) {
            throw new Error(`Product with ID ${itemId} not found`);
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