import { IApi, IOrderResponse } from '../../types/api';
import { IOrder } from '../../types/data';
import { IProduct } from '../../types/data';
import { Api, ApiListResponse } from '../base/api';


interface IAppAPI {
	readonly imageUrl: string;

	getProductsList(): Promise<IProduct[]>;
	getProductItem(id: string): Promise<IProduct>;
	postOrder(order: IOrder): Promise<IOrder>;
}

export class AppApi extends Api implements IAppAPI {
	readonly imageUrl: string;

	constructor(imageUrl: string, baseUrl: string, options?: RequestInit) {
		super(baseUrl, options);
		this.imageUrl = imageUrl;
	}

	getProductsList(): Promise<IProduct[]> {
		return this.get('/product').then((data: ApiListResponse<IProduct>) =>
			data.items.map((item) => ({
				...item,
				image: this.imageUrl + item.image,
			}))
		);
	}

	getProductItem(id: string): Promise<IProduct> {
		return this.get(`/product/${id}`).then((item: IProduct) => ({
			...item,
			image: this.imageUrl + item.image,
		}));
	}

	postOrder(order: IOrder): Promise<IOrder> {
		return this.post('/order', order).then((data: IOrder) => data);
	}
}