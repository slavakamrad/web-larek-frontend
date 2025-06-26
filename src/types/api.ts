import { PaymentMethod } from './data';

// Интерфейс для api
export interface IApi {
	baseUrl: string;
	options: RequestInit;
	handleResponse(response: Response): Promise<object>;
	get(uri: string): Promise<object>;
	post(uri: string, data: object, method: string): Promise<object>;
}

// Данные заказа для API
export interface IContactsOrder {
	email: string;
	phone: string;
	payment: PaymentMethod;
	address: string;
	validate(email: string, phone: string, address: string): boolean;
}

// Интерфейс ответа на POST Order
export interface IOrderResponse {
	success: boolean;
	total?: number;
	id?: string;
	error?: string;
}
