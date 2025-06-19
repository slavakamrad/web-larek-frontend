import { cardCatalogTemplate } from "../..";
import { IProduct } from "../../types/data";
import { ICatalogView } from "../../types/views";
import { ensureElement } from "../../utils/utils";
import { Component } from "../base/component";
import { IEvents } from "../base/events";

// Каталог товаров
export class CatalogView extends Component<IProduct[]> implements ICatalogView {
  protected _items: HTMLElement[] = [];

  constructor(container: HTMLElement, protected events: IEvents) {
    super(container);
  }

  set items(items: IProduct[]) {
    this._items = items.map(item => {
      const element = cardCatalogTemplate.content.cloneNode(true) as DocumentFragment;
      const card = element.querySelector('.card') as HTMLElement;
      
      this.setText(ensureElement('.card__title', card), item.title);
      this.setText(ensureElement('.card__price', card), `${item.price} синапсов`);
      this.setImage(ensureElement<HTMLImageElement>('.card__image', card), item.image);
      
      const category = ensureElement('.card__category', card);
      category.className = `card__category card__category_${item.category}`;
      category.textContent = item.category;
      
      return card;
    });
  }

  render(data?: IProduct[]): HTMLElement {
    if (data) this.items = data;
    this.container.replaceChildren(...this._items);
    return this.container;
  }

  itemClick(handler: (product: IProduct) => void): void {
    this.container.addEventListener('click', (event) => {
      const target = event.target as HTMLElement;
      const card = target.closest('.card');
      if (card) {
        const index = this._items.indexOf(card as HTMLElement);
        if (index !== -1) handler(this.items[index]);
      }
    });
  }

  setLoading(loading: boolean): void {
    this.setText(this.container, loading ? 'Загрузка...' : '');
  }
}



