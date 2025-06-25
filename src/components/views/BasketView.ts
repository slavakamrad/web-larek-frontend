import { basketTemplate } from '../../utils/templates';
import { IProduct } from '../../types/data';
import { IBasketView } from '../../types/views';
import { createElement, ensureElement } from '../../utils/utils';
import { IEvents } from '../base/events';
import { Component } from '../base/component';
 

export class BasketView extends Component<IProduct>  implements IBasketView {
	list: HTMLElement;
	total: HTMLElement;
	button: HTMLButtonElement;
	basketItems: Map<string, { product: IProduct; count: number }>;

	constructor(protected container: HTMLElement, protected events: IEvents) {
		super(container);
		this.list = ensureElement('.basket__list', this.container);
		this.total = ensureElement('.basket__price', this.container);
		this.button = ensureElement<HTMLButtonElement>('.basket__button', this.container);

	}
	render(data?: Partial<IProduct> & { basketItems?: Map<string, { product: IProduct; count: number }> }): HTMLElement {
		if (!data?.basketItems || data.basketItems.size === 0) {
			this.list.replaceChildren(
				createElement('p', { textContent: 'Корзина пуста' })
			);
			this.setDisabled(this.button, true);
			return this.container;
		}

		let total = 0;
		let index = 1;
		this.list.innerHTML = '';

		data.basketItems.forEach(({ product }, id) => {
			const item = document.createElement('li');
			item.className = 'basket__item card card_compact';
			item.innerHTML = `
					<span class="basket__item-index">${index++}</span>
					<span class="card__title">${product.title}</span>
					<span class="card__price">${product.price} синапсов</span>
					<button class="basket__item-delete card__button" aria-label="удалить"></button>
			`;

			item.querySelector('.basket__item-delete')?.addEventListener('click', () => {
				this.events.emit('basket:remove', { id });
			});

			this.list.appendChild(item);
			total += product.price;
		});

		this.setText(this.total, `${total} синапсов`);
		this.setDisabled(this.button, false);

		this.button.addEventListener('click', () => {
			this.events.emit('order:init');
		});


		return this.container;
	}
}