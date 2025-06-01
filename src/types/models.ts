import { IOrder, IProduct, PaymentMethod } from "./data";
import { FormErrors } from "./views";

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
  add(id: string): void;
  remove(id: string): void;
  getCartValue(cost: number): number;
}

// Интерфейс модели заказа
export interface IOrderModel {
  payment: PaymentMethod;       // текущий способ оплаты
  address: string;             // адрес доставки
  email: string;               // email пользователя
  phone: string;               // телефон пользователя
  items: string[];             // массив ID товаров в заказе
  total: number;               // итоговая сумма заказа
  updateField<K extends keyof IOrder>(field: K, value: IOrder[K]): void;
  validate(): { isValid: boolean; errors: FormErrors };
  getOrderData(): IOrder;
}
