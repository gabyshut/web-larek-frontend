export interface ICardItemAPI {
    id: string;
    description: string;
    image: string;
    title: string;
    category: string;
    price: number;
}

export interface IBasket{
    getProducts(): IItemView[];
    deleteItem(item: IItemView): void;
    addItem(itemId: string): void;
}

export interface IModal {
    open(content: HTMLElement): void;
    close(): void;
  }  
  
export interface IItemView {
  id: string;
  title: string;
  category: string;
  price: number;
  imageUrl: string;
}
  
export interface IOrder {
  payment: string;
  address: string;
  email: string;
  phone: string;
  items: string[];
}
  
export interface IApiClient {
  getProducts(): Promise<ICardItemAPI[]>;
  createOrder(order: IOrder): Promise<void>;
}
  
export type AppEvents = 
    | { type: 'product:add'; payload: ICardItemAPI }
    | { type: 'product:remove'; payload: string }
    | { type: 'basket:open' }
    | { type: 'modal:open'; payload: HTMLElement }
    | { type: 'modal:close' };
  