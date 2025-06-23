import { basketTemplate } from '../../utils/templates';
import { IProduct } from '../../types/data';
import { IBasketView } from '../../types/views';
import { ensureElement } from '../../utils/utils';
import { IEvents } from '../base/events';
import { AppModal, IPopupData } from './Popup';

export class BasketView extends AppModal implements IBasketView {
	list: HTMLElement;
	total: HTMLElement;
	button: HTMLButtonElement;
	basketItems: Map<string, { product: IProduct; count: number }>;

	constructor(container: HTMLElement, events: IEvents) {
		super(container, events);

	}

	render(data: { basketItems: Map<string, { product: IProduct; count: number }> }): HTMLElement {
		if (!data) return this.container;

		const content = basketTemplate.content.cloneNode(true) as DocumentFragment;
		this.content.replaceChildren(content);

		this.list = ensureElement('.basket__list', this.content);
		this.total = ensureElement('.basket__price', this.content);
		this.button = ensureElement<HTMLButtonElement>('.basket__button', this.content);

		if (data.basketItems.size === 0) {
			this.list.innerHTML = 'Корзина пуста';
			this.setDisabled(this.button, true);
			return this.container;
		}

		let total = 0;
		let index = 1;

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