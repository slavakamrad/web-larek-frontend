import { Component } from '../base/component';
import { createElement, ensureElement } from '../../utils/utils';
import { IEvents } from '../base/events';
import { IOrder } from '../../types/data';

export class BasketView extends Component<IOrder> {
	list: HTMLElement;
	_total: HTMLElement;
	button: HTMLButtonElement;

	constructor(container: HTMLElement, protected events: IEvents) {
		super(container);

		this.list = ensureElement('.basket__list', this.container);
		this._total = ensureElement('.basket__price', this.container);
		this.button = ensureElement<HTMLButtonElement>(
			'.basket__button',
			this.container
		);

		this.button.addEventListener('click', () => {
			events.emit('order:init');
		});
	}

	setItems(items: HTMLElement[]) {
		this.list.replaceChildren(...items);
	}

	render(data?: Partial<IOrder>): HTMLElement {
		super.render(data);

		if (data?.total !== undefined) {
			this.setText(this._total, `${data.total} синапсов`);
			this.setDisabled(this.button, false);
		}

		if (this.list.children.length == 0) {
			this.list.replaceChildren(
				createElement('p', { textContent: 'Корзина пуста' })
			);
			this.setDisabled(this.button, true);
		}

		return this.container;
	}
}
