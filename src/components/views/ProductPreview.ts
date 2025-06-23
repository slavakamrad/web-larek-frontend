import { cardPreviewTemplate } from '../../utils/templates';
import { IProduct, ProductCategory } from '../../types/data';
import { IProductPreview } from '../../types/views';
import { ensureElement } from '../../utils/utils';
import { IEvents } from '../base/events';
import { AppModal } from './Popup';

export class ProductPreview extends AppModal implements IProductPreview {
	button: HTMLButtonElement;
	currentProduct: IProduct;

	categoryNames: Record<ProductCategory, string> = {
		'дополнительное': 'additional',
		'софт-скил': 'soft',
		'кнопка': 'button',
		'хард-скил': 'hard',
		'другое': 'other',
	};

	constructor(container: HTMLElement, events: IEvents) {
		super(container, events);
	}

	private updateButtonState(data: IProduct) {
		this.events.emit('basket:check', {
			id: data.id,
			callback: (isInBasket: boolean) => {
				this.setText(
					this.button,
					this.blockProductSale(this.button, data, isInBasket)
				);
			}
		});
	}

	blockProductSale(button: HTMLButtonElement, data: IProduct, isInBasket: boolean) {
		if (!data.price) {
			button.disabled = true;
			return 'Товар не продается';
		}
		button.disabled = false;
		return isInBasket ? 'Убрать' : 'Купить';
	}

	render(data?: IProduct): HTMLElement {
		if (!data) return this.container;

		this.currentProduct = data;

		const content = cardPreviewTemplate.content.cloneNode(true) as DocumentFragment;
		this.content.replaceChildren(content);

		const card = this.content.querySelector('.card') as HTMLElement;
		const category = ensureElement('.card__category', card);
		const categoryName = this.categoryNames[data.category];
		category.className = `card__category card__category_${categoryName}`;
		category.textContent = data.category;

		this.button = ensureElement<HTMLButtonElement>('.card__button', card);

		this.setText(ensureElement('.card__title', card), data.title);
		this.setText(ensureElement('.card__text', card), data.description);
		this.setImage(ensureElement<HTMLImageElement>('.card__image', card), data.image);
		this.setText(ensureElement('.card__price', card),
			data.price ? `${data.price} синапсов` : 'Бесценно');

		this.button.addEventListener('click', () => {
			if (this.button.textContent === 'Убрать') {
				this.events.emit('basket:remove', { id: data.id });
			} else {
				this.events.emit('basket:add', data);
			}
			this.close();
		});

		this.updateButtonState(data);

		return this.container;
	}
}