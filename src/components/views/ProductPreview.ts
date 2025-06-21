import { cardPreviewTemplate } from "../../index";
import { IProduct } from "../../types/data";
import { IProductPreview } from "../../types/views";
import { ensureElement } from "../../utils/utils";
import { IEvents } from "../base/events";
import { AppModal } from "./Popup";

export class ProductPreview extends AppModal implements IProductPreview {
  _button: HTMLButtonElement;

  constructor(container: HTMLElement, events: IEvents) {
    super(container, events);
    const content = cardPreviewTemplate.content.cloneNode(true) as DocumentFragment;
    this.content.replaceChildren(content);
    this._button = ensureElement<HTMLButtonElement>('.card__button', this.content);
  }

  render(data?: IProduct): HTMLElement {
    if (!data) return this.container;

    const content = cardPreviewTemplate.content.cloneNode(true) as DocumentFragment;
    this.content.replaceChildren(content);
 
    const card = this.content.querySelector('.card') as HTMLElement;
    this.setText(ensureElement('.card__title', card), data.title);

    return this.container;
}

  addToCart(handler: () => void): void {
    this._button.addEventListener('click', handler);
  }
}