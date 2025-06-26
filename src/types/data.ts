// Типизация данных

// категории товаров как тип
export type ProductCategory =
	| 'софт-скил'
	| 'другое'
	| 'дополнительное'
	| 'кнопка'
	| 'хард-скил';

//  Интерфейс для продукта
export interface IProduct {
	isInBasket?: boolean;
	id: string;
	description: string;
	image: string;
	title: string;
	category: ProductCategory;
	price: number | null;
}

// Интерфейс корзины
export interface IBasketData {
	items: Map<string, { product: IProduct; count: number }>;
}

// Тип оплаты онлайн или при получении заказа
export type PaymentMethod = 'cash' | 'card';

// Интерфейс заказа
export interface IOrder {
	payment: PaymentMethod;
	email: string;
	phone: string;
	address: string;
	total: number;
	items: string[];
	errors?: string[];
	valid?: boolean;
}
