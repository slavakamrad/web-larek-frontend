import { IOrder, IProduct } from './data';

// Интерфейс Базовое представление
export interface IView {
  render(data?: object): HTMLElement;
}

// Интерфейс модального окна
export interface IPopup {
  content: HTMLElement;
  closeButton: HTMLButtonElement;
  open(): void;
  close(): void;
  handleESC(evt: KeyboardEvent): void;
  render(data: IPopup): boolean;
}

// Интерфейс формы
export interface IForm {
  submit: HTMLButtonElement;
  errors: HTMLElement;
  onInputChange(): void;
  render(state: IFormState): HTMLElement;
}

// Интерфейс состояния формы
export interface IFormState {
  valid: boolean;
  errors: string[];
}

// Интерфейс каталога товаров (Model-View)
export interface ICatalogModel {
  items: IProduct[];
  setItems(items: IProduct[]): void;
  getItems(): IProduct[];
  getItem(id: string): IProduct;
}

// Интерфейс корзины товаров (Model)
export interface IBasketModel {
  items: Map<string, number>;
  add(id: string): void;
  remove(id: string): void;
  getCartValue(cost: number): number;
}

// Интерфейс корзины товаров (View) 
export interface IBasketView {
  render(): void;
  update(items: Map<string, number>): void;
  clear(): void;
}

// Типизация ошибок в форме 
export type FormErrors = Partial<Record<keyof IOrder, string>>;