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
    
    // Сохраняем оригинальный контент
    const content = basketTemplate.content.cloneNode(true) as DocumentFragment;
    this.content.replaceChildren(content);
    
    // Инициализируем элементы после создания
    this.list = ensureElement<HTMLElement>('.basket__list', this.content);
    this.total = ensureElement<HTMLElement>('.basket__price', this.content);
    this.button = ensureElement<HTMLButtonElement>('.basket__button', this.content);
    
    console.log('Basket elements initialized:', {
        list: this.list,
        total: this.total,
        button: this.button
    });
}

	render(data: IBasketView): HTMLElement {
		if (!data) return this.container;

		const content = basketTemplate.content.cloneNode(true) as DocumentFragment;
		this.content.replaceChildren(content);

    this.list = ensureElement('.basket__list', this.content);
    this.total = ensureElement<HTMLElement>('.basket__price', this.content);
    this.button = ensureElement<HTMLButtonElement>('.basket__button', this.content);
    

		this.list.innerHTML = '';
		let total = 0;
		let index = 1;      
    console.log(data, "эй бля")
		data.basketItems.forEach(({ product, count }, id) => {
        console.log(product)
		    const item = document.createElement('li');
		    item.className = 'basket__item card card_compact';
		    item.innerHTML = `
		        <span class="basket__item-index">${index++}</span>
		        <span class="card__title">${product.title}</span>
		        <span class="card__price">${product.price * count} синапсов</span>
		        <button class="basket__item-delete card__button" aria-label="удалить"></button>
		    `;
		    this.list.appendChild(item);
		    total += product.price * count;
		});

		this.setText(this.total, `${total} синапсов`);
		this.setDisabled(this.button, data.basketItems.size === 0);

		return this.container;
	}

	deleteItem(handler: (id: string) => void): void {
		this.list.addEventListener('click', (e) => {
			const target = e.target as HTMLElement;
			if (target.classList.contains('basket__item-delete')) {
				const itemId = target.closest('li')?.getAttribute('data-id');
				if (itemId) handler(itemId);
			}
		});
	}

	bindCheckout(handler: () => void): void {
		this.button.addEventListener('click', handler);
	}
}
