import { cardCatalogTemplate } from "../../utils/templates";
import { IProduct, ProductCategory } from "../../types/data";
import { ICatalogView } from "../../types/views";
import { ensureElement } from "../../utils/utils";
import { Component } from "../base/component";
import { IEvents } from "../base/events";


export class CatalogView extends Component<IProduct[]> implements ICatalogView {
  protected _items: HTMLElement[] = [];
  protected _products: IProduct[] = []; // Добавляем хранилище продуктов
  categoryNames: Record<ProductCategory, string> = {
    "дополнительное": "additional",
    "софт-скил": "soft",
    "кнопка": "button",
    "хард-скил": "hard",
    "другое": "other",
  };


  constructor(container: HTMLElement, protected events: IEvents) {
    super(container);
  }

  // Сеттер для продуктов
  set items(items: IProduct[]) {
    this._products = items; // Сохраняем продукты
    this._items = items.map(item => {
      const element = cardCatalogTemplate.content.cloneNode(true) as DocumentFragment;
      const card = element.querySelector('.card') as HTMLElement;
      
      this.setText(ensureElement('.card__title', card), item.title);
      this.setText(ensureElement('.card__price', card), item.price ? `${item.price} синапсов` : "Бесценно");
      this.setImage(ensureElement<HTMLImageElement>('.card__image', card), item.image);
      const category = ensureElement('.card__category', card);     
      const categoryName = this.categoryNames[item.category]
      category.className = `card__category card__category_${categoryName}`;

      category.textContent = item.category;
      
      return card;
    });
  }

  // Геттер для продуктов
  get items(): IProduct[] {
    return this._products;
  }

  render(data?: IProduct[]): HTMLElement {
    if (data) this.items = data; // Обновляем продукты и DOM
    this.container.replaceChildren(...this._items);
    return this.container;
  }

  itemClick(handler: (product: IProduct) => void): void {
    this.container.addEventListener('click', (event) => {
      const target = event.target as HTMLElement;
      const card = target.closest('.card');
      if (card) {
        const index = this._items.indexOf(card as HTMLElement);
        if (index !== -1) {
          handler(this.items[index]); // Теперь this.items[index] вернёт продукт
        }
      }
    });
  }

  setLoading(loading: boolean): void {
    this.setText(this.container, loading ? 'Загрузка...' : '');
  }
}