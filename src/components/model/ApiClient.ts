import { IApiClient, ICardItem, IProductListResponse, IUserOrderData } from "../../types";
import { CDN_URL } from "../../utils/constants";
import { Api } from "../base/api";

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