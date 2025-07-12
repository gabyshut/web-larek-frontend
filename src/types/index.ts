export interface ICardItem {
    id: string;
    description: string;
    image: string;
    title: string;
    category: string;
    price: number;
}

export type TProductId = Pick<ICardItem, 'id'>

export interface IBasket {
    items: ICardItem[];
    total: number;
    getProducts(): ICardItem[];
    deleteItem(itemId: TProductId): void;
    addItem(itemId: TProductId): void;
    clearList(items: ICardItem[]): void;
}

export interface ICardData {
    items: ICardItem[];
    getItemById(id: TProductId): ICardItem | undefined;
}

export interface IUserOrderData {
    payment: TPaymentMethod;
    address: string;
    email: string;
    phone: string;
    products: ICardItem[];
    total: number;
}

export type TPaymentMethod = 'card' | 'cash';


export interface IModal {
    open(content: HTMLElement): void;
    close(): void;
  }  
  
  
export interface IApiClient {
  getProducts(): Promise<ICardItem[]>;
  createOrder(order: IUserOrderData): Promise<void>;
}
  
export type AppEvents = 
    | { type: 'product:add'; payload: ICardItem }
    | { type: 'product:remove'; payload: string }
    | { type: 'basket:open' }
    | { type: 'modal:open'; payload: HTMLElement }
    | { type: 'modal:close' };
  