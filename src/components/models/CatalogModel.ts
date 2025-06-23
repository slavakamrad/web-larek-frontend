import { IProduct } from "../../types/data";
import { ICatalogModel } from "../../types/models";
import { EventEmitter } from '../base/events';


export class CatalogModel implements ICatalogModel {
  _items: IProduct[] = [];
  preview: string | null;

  constructor(
    protected events: EventEmitter
  ) { }

  items: IProduct[];

  setItems(items: IProduct[]): void {
    this._items = items;
    this.events.emit('items:changed', { items: this._items });
  }

  setItem(item: IProduct): void {
    this.preview = item.id;
    this.events.emit('preview:change', item);
  }

  getItems(): IProduct[] {
    return this._items;
  }

  getItem(id: string): IProduct {
    const item = this._items.find(product => product.id === id);
    if (!item) {
      throw new Error(`Product with id ${id} not found`);
    }
    return item;
  }
}