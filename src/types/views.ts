import { IOrder, IProduct, PaymentMethod } from './data';

// Интерфейс Базовое представление
export interface IView<T = unknown> {
  render(data?: T): HTMLElement;
}

// Интерфейс каталога товаров
export interface ICatalogView extends IView<IProduct[]> {
  itemClick(handler: (product: IProduct) => void): void;
  setLoading(loading: boolean): void;
}

// Интерфейс модального окна, один на всех и все на одного =)
export interface IPopup extends IView {
  content: HTMLElement;
  closeButton: HTMLButtonElement;
  open(): void;
  close(): void;
  handleESC(evt: KeyboardEvent): void;
}

// Интерфейс попапа превью товара
export interface IProductPreview extends IPopup {
  button: HTMLButtonElement;
  currentProduct: IProduct; 
}

// Интерфейс попапа корзины
export interface IBasketView extends IPopup {
  basketItems: Map<string, { product: IProduct; count: number }>;
  // update(items: Map<string, { product: IProduct, count: number }>): void;
  deleteItem(handler: (id: string) => void): void;
  bindCheckout(handler: () => void): void;
}

// Интерфейс формы заказа (шаг 1 - оплата/адрес)
export interface IOrderFormView extends IPopup {
  method: PaymentMethod;
  address: string;
  submitButton: HTMLButtonElement;
  errors: HTMLElement;
  render(state: IFormState): HTMLElement;
  onSubmit(callback: () => void): void;
}

// Интерфейс формы контактов (шаг 2 - email/телефон)
export interface IContactsFormView extends IPopup {
  email: string;
  phone: string;
  submitButton: HTMLButtonElement;
  errors: HTMLElement;
  render(state: IFormState): HTMLElement;
  onSubmit(callback: () => void): void;
}

// Попап успешного заказа
export interface ISuccessView extends IPopup {
  total: number;
  setTotal(total: number): void;
}

// Интерфейс состояния формы
export interface IFormState {
  valid: boolean;
  errors: string[];
}

// Типизация ошибок в форме
export type FormErrors = Partial<Record<keyof IOrder, string>>;