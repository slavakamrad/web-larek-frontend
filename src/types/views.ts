// import { IPopupData } from '../components/views/Popup';
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
export interface IProductPreview {
  button: HTMLButtonElement;
  currentProduct: IProduct;
}

// Интерфейс попапа корзины
export interface IBasketView {
  list: HTMLElement;
	total: HTMLElement;
	button: HTMLButtonElement;
}

// Интерфейс формы заказа (шаг 1 - оплата/адрес)
export interface IOrderFormView{
  paymentButtons: HTMLButtonElement[];
  addressInput: HTMLInputElement;
  submitButton: HTMLButtonElement;
  errors: HTMLElement;
  render(state: IOrder): HTMLElement;
}

// Интерфейс формы контактов (шаг 2 - email/телефон)
export interface IContactsFormView {
  emailInput: HTMLInputElement;
  phoneInput: HTMLInputElement;
  submitButton: HTMLButtonElement;
  errors: HTMLElement;
  render(state: IFormState): HTMLElement;

}

// Попап успешного заказа
export interface ISuccessView {
  total: number;
}

// Интерфейс состояния формы
export interface IFormState {
  valid: boolean;
  errors: string[];
}

// Типизация ошибок в форме
export type FormErrors = Partial<Record<keyof IOrder, string>>;

// export { IPopupData };
