import { IProduct, PaymentMethod } from './data';

// Интерфейс модели каталога товаров
export interface ICatalogModel {
	items: IProduct[];
	setItems(items: IProduct[]): void;
	getItems(): IProduct[];
	getItem(id: string): IProduct;
}

// Интерфейс модели корзины товаров
export interface IBasketModel {
	items: Map<string, number>;
	addItem(id: string): void;
	removeItem(id: string): void;
	getCartValue(cost: number): number;
	clear(): void;
	getTotal(): number;
	getItemsIds(): string[];
	hasItem(id: string): boolean;
}

// Интерфейс модели заказа
export interface IOrderModel {
	payment: PaymentMethod; // текущий способ оплаты
	address: string; // адрес доставки
	email: string; // email пользователя
	phone: string; // телефон пользователя
	items: string[]; // массив ID товаров в заказе
	total: number; // итоговая сумма заказа
}
