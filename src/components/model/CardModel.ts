import { ICardData, ICardItem, TProductId } from "../../types";

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