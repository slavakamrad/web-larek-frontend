import { cardPreviewTemplate } from "../..";
import { IProduct } from "../../types/data";
import { IProductPreview } from "../../types/views";
import { ensureElement } from "../../utils/utils";
import { IEvents } from "../base/events";
import { Modal } from "./Popup";

export class ProductPreview extends Modal<IProduct> implements IProductPreview {
  protected _button: HTMLButtonElement;

  constructor(container: HTMLElement, events: IEvents) {
    super(container, events);
    const content = cardPreviewTemplate.content.cloneNode(true) as DocumentFragment;
    this.content.replaceChildren(content);
    this._button = ensureElement<HTMLButtonElement>('.card__button', this.content);
  }

  render(data?: IProduct): HTMLElement {
    if (!data) return this.container;
    
    // Исправляем приведением типа
    const card = this.content.querySelector('.card') as HTMLElement;
    
    this.setText(ensureElement('.card__title', card), data.title);
    this.setText(ensureElement('.card__price', card), `${data.price} синапсов`);
    this.setImage(ensureElement<HTMLImageElement>('.card__image', card), data.image);
    this.setText(ensureElement('.card__text', card), data.description);
    
    const category = ensureElement('.card__category', card);
    category.className = `card__category card__category_${data.category}`;
    category.textContent = data.category;
    
    return this.container;
  }

  addToCart(handler: () => void): void {
    this._button.addEventListener('click', handler);
  }
}