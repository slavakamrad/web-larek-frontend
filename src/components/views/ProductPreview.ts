import { IProduct, ProductCategory } from '../../types/data';
import { IProductPreview } from '../../types/views';
import { ensureElement } from '../../utils/utils';
import { Component } from '../base/component';
import { IEvents } from '../base/events';

export class ProductPreview
	extends Component<IProduct>
	implements IProductPreview
{
	button: HTMLButtonElement;
	currentProduct: IProduct;
	category: HTMLElement;
	title: HTMLElement;
	description: HTMLElement;
	image: HTMLImageElement;
	price: HTMLElement;

	categoryNames: Record<ProductCategory, string> = {
		дополнительное: 'additional',
		'софт-скил': 'soft',
		кнопка: 'button',
		'хард-скил': 'hard',
		другое: 'other',
	};
	testContent: HTMLElement;

	constructor(protected container: HTMLElement, protected events: IEvents) {
		super(container);

		this.title = ensureElement<HTMLElement>('.card__title', this.container);
		this.image = ensureElement<HTMLImageElement>(
			'.card__image',
			this.container
		);
		this.button = ensureElement<HTMLButtonElement>(
			'.card__button',
			this.container
		);
		this.description = ensureElement<HTMLElement>(
			'.card__text',
			this.container
		);
		this.price = ensureElement<HTMLElement>('.card__price', this.container);
	}

	blockProductSale(
		button: HTMLButtonElement,
		data: IProduct,
		isInBasket: boolean
	) {
		if (!data.price) {
			button.disabled = true;
			return 'Товар не продается';
		}
		button.disabled = false;
		return isInBasket ? 'Убрать' : 'В корзину';
	}

	render(data?: IProduct, isInBasket: boolean = false): HTMLElement {
		const category = ensureElement<HTMLElement>(
			'.card__category',
			this.container
		);
		const categoryName = this.categoryNames[data.category];
		category.className = `card__category card__category_${categoryName}`;
		category.textContent = data.category;

		this.setText(this.title, data.title);
		this.setText(this.description, data.description);
		this.setImage(this.image, data.image);
		this.setText(
			this.price,
			data.price ? `${data.price} синапсов` : 'Бесценно'
		);

		this.button.textContent = this.blockProductSale(
			this.button,
			data,
			isInBasket
		);
		this.button.replaceWith(this.button.cloneNode(true));
		this.button = ensureElement<HTMLButtonElement>(
			'.card__button',
			this.container
		);

		this.button.addEventListener('click', () => {
			if (this.button.textContent === 'Убрать') {
				this.events.emit('basket:remove', { id: data.id, fromPreview: true });
				this.button.textContent = 'В корзину';
			} else {
				this.events.emit('basket:add', data);
				this.button.textContent = 'Убрать';
			}
		});

		return this.container;
	}
}
