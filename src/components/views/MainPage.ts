import { Component } from '../base/component';
import { IEvents } from '../base/events';
import {
	IView,
	ICatalogView,
	IProductPreview,
	IBasketView,
	IOrderFormView,
	IContactsFormView,
	ISuccessView,
} from '../../types/views';
import { CatalogView } from './CatalogView';
// import { OrderFormView } from './OrderFormView';
// import { ContactsFormView } from './ContactsFormView';
// import { SuccessView } from './SuccessView';
import { ensureElement } from '../../utils/utils';
import { IProduct } from '../../types/data';
import { ProductPreview } from './ProductPreview';
import { BasketView } from './BasketView';

export class MainPage extends Component<{}> implements IView {
	catalogView: ICatalogView;
	productPreview: IProductPreview;
	basket: IBasketView;
	orderForm: IOrderFormView;
	contactsForm: IContactsFormView;
	success: ISuccessView;
	basketIcon: HTMLElement;
	basketCounter;
	basketItems: Map<string, { product: IProduct; count: number }> = new Map();

	constructor(container: HTMLElement, protected events: IEvents) {
		super(container);

		this.catalogView = new CatalogView(
			ensureElement<HTMLElement>('.gallery'),
			events
		);

		this.productPreview = new ProductPreview(
			ensureElement<HTMLElement>('#modal-container'),
			events
		);

		this.basket = new BasketView(
			ensureElement<HTMLElement>('#modal-container'),
			events
		);

		this.basketIcon = ensureElement<HTMLElement>('.header__basket');
		this.basketCounter = ensureElement<HTMLElement>(
			'.header__basket-counter',
			this.basketIcon
		);
		// this.orderForm = new OrderFormView(
		// 	ensureElement<HTMLElement>('#order-modal'),
		// 	events
		// );
		// this.contactsForm = new ContactsFormView(
		// 	ensureElement<HTMLElement>('#contacts-modal'),
		// 	events
		// );
		// this.success = new SuccessView(
		// 	ensureElement<HTMLElement>('#success-modal'),
		// 	events
		// );

		// Настраиваем обработчики событий между компонентами
		this.setupEventHandlers();
	}

	// Настройка обработчиков событий между компонентами
	setupEventHandlers(): void {
		
		this.events.on('items:changed', (data: { items: IProduct[] }) => {
			this.catalogView.render(data.items);
		});

		// При клике на товар в каталоге открываем превью
		this.catalogView.itemClick((product) => {
			this.productPreview.render(product);
			this.productPreview.open();
		});

		// Обработчик клика на иконку корзины
		this.basketIcon.addEventListener('click', () => {
			this.basket.render({ basketItems: this.basketItems });
			this.basket.open();
		});

		// Добавление товаров в корзину
		this.events.on('basket:add', (product: IProduct) => {
			console.log('Добавляем в корзину:', product);
			// if (!product) return;

			const existing = this.basketItems.get(product.id);
			if (existing) {
				existing.count += 1;
			} else {
				this.basketItems.set(product.id, {
					product,
					count: 1,
				});
			}

			this.updateBasketIcon();
			this.events.emit('basket:changed', this.basketItems);
		});
		
		this.events.on('basket:changed', () => {
			this.basket.render({ basketItems: this.basketItems });
		});

		// // При оформлении заказа из корзины
		// this.basket.bindCheckout(() => {
		// 	this.basket.close();
		// 	this.orderForm.open();
		// });

		// Другие обработчики событий...
	}

	render(): HTMLElement {
		// Рендерим главную
		return this.container;
	}
	private updateBasketIcon(): void {
		let totalCount = 0;
		this.basketItems.forEach((item) => {
			totalCount += item.count;
		});
		this.basketCounter.textContent = String(totalCount);
	}
}
