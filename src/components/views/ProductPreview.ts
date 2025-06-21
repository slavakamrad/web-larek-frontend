import { cardPreviewTemplate } from "../../index";
import { IProduct, ProductCategory } from "../../types/data";
import { IProductPreview } from "../../types/views";
import { ensureElement } from "../../utils/utils";
import { IEvents } from "../base/events";
import { AppModal } from "./Popup";

export class ProductPreview extends AppModal implements IProductPreview {
  _button: HTMLButtonElement;
    categoryNames: Record<ProductCategory, string> = {
      "дополнительное": "additional",
      "софт-скил": "soft",
      "кнопка": "button",
      "хард-скил": "hard",
      "другое": "other",
    };

  constructor(container: HTMLElement, events: IEvents) {
    super(container, events);
    const content = cardPreviewTemplate.content.cloneNode(true) as DocumentFragment;
    this.content.replaceChildren(content);
    this._button = ensureElement<HTMLButtonElement>('.card__button', this.content);
  }

  render(data?: IProduct): HTMLElement {
    if (!data) return this.container;
    
    // Копируем шаблон в контент модалки
    const content = cardPreviewTemplate.content.cloneNode(true) as DocumentFragment;
    this.content.replaceChildren(content);
 
    // Заполняем данными
    const card = this.content.querySelector('.card') as HTMLElement;
    const category = ensureElement('.card__category', card);     
    const categoryName = this.categoryNames[data.category]
    category.className = `card__category card__category_${categoryName}`;
    category.textContent = data.category;

    this.setText(ensureElement<HTMLImageElement>('.card__title', card), data.title);
    this.setText(ensureElement<HTMLImageElement>('.card__text', card), data.description);
    this.setImage(ensureElement<HTMLImageElement>('.card__image', card), data.image);
    this.setText(ensureElement<HTMLImageElement>('.card__price', card), `${data.price} синапсов`);
    
    

    return this.container;
}

  addToCart(handler: () => void): void {
    this._button.addEventListener('click', handler);
  }
}