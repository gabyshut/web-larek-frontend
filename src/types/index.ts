export interface ICardItem {
    id: number;
    description: string;
    image: string;
    title: string;
    category: string;
    price: number;
}

export type TProductId = ICardItem['id']

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
    items: number[];
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

export interface IProductListResponse {
	items: ICardItem[];
	total: number;
}
  
export type AllEvents = {
  'product:add': ICardItem;
  'product:remove': ICardItem;
  'card:click': ICardItem;
  'submit:click': void;
  'modal:close': void;
  'address:input': string;
  'payment:selected': string;
  'order:error': { field: string; message?: string };
  'order:ready': IUserOrderData;
  'form:submit': void;
  'email:input': string;
  'phone:input': string;
  'basket:click': void;
};
