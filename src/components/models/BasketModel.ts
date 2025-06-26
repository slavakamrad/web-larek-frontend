import { IProduct } from '../../types/data';
import { EventEmitter } from '../base/events';

export class BasketModel {
	private _items: Map<string, { product: IProduct; count: number }> = new Map();

	constructor(protected events: EventEmitter) {}

	get items() {
		return this._items;
	}

	addItem(product: IProduct) {
		if (!this._items.has(product.id)) {
			this._items.set(product.id, { product, count: 1 });
			this.events.emit('basket:changed');
		}
	}

	removeItem(id: string) {
		this._items.delete(id);
		this.events.emit('basket:changed');
	}

	clear() {
		this._items.clear();
		this.events.emit('basket:changed');
	}

	getTotal(): number {
		return Array.from(this._items.values()).reduce(
			(total, item) => total + item.product.price * item.count,
			0
		);
	}

	getItemsIds(): string[] {
		return Array.from(this._items.keys());
	}

	hasItem(id: string): boolean {
		return this._items.has(id);
	}
}
