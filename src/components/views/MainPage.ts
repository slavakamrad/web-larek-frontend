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
	IPopupData,
} from '../../types/views';
import { CatalogView } from './CatalogView';
import { OrderFormView } from './OrderFormView';
// import { SuccessView } from './SuccessView';
import { ensureElement } from '../../utils/utils';
import { IOrder, IProduct } from '../../types/data';
import { ProductPreview } from './ProductPreview';
import { BasketView } from './BasketView';
import { ContactsFormView } from './ContactsFormView';

export class MainPage extends Component<{}> implements IView {
	catalogView: ICatalogView;
	productPreview: IProductPreview;
	basket: IBasketView;
	orderForm: IOrderFormView;
	contactsForm: IContactsFormView;
	success: ISuccessView;
	basketIcon: HTMLElement;
	basketCounter: HTMLElement;
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

		this.orderForm = new OrderFormView(
			ensureElement<HTMLElement>('#modal-container'),
			events
		);

		this.contactsForm = new ContactsFormView(
			ensureElement<HTMLElement>('#modal-container'),
			events
		);
		// this.success = new SuccessView(
		// 	ensureElement<HTMLElement>('#success-modal'),
		// 	events
		// );

		// Обработчики событий между компонентами
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
			if (!product) return;

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

		// Удаление товаров
		this.events.on('basket:remove', (data: { id: string }) => {
			const item = this.basketItems.get(data.id);
			if (!item) return;

			if (item.count > 1) {
				item.count -= 1;
			} else {
				this.basketItems.delete(data.id);
			}

			this.updateBasketIcon();
			this.events.emit('basket:changed', this.basketItems);

			if (this.basketItems.size === 0) {
				this.basket.open();
			}
		});

		// фиксируем изменения корзинки
		this.events.on('basket:changed', () => {
			this.basket.render({ basketItems: this.basketItems });
		});

		// открываем модалку для выбора способа оплаты и адреса доставки
		this.events.on('order:init', (data: IOrder) => {
			this.basket.close();
			this.orderForm.render(data);
			this.orderForm.open();
	});

		//  если все ок передаем orderData дальше открываем форму окнтактов
		this.events.on('order:addContacts', (orderData) => {
			console.log('Данные заказа:', orderData);
			this.orderForm.close();
			this.events.emit('contact:init');
			this.contactsForm.open()
		});

		// вводим контакты покупателя
		this.events.on('contact:init', () => {
			this.basket.close();
			this.contactsForm.render({
				valid: false,
				errors: [],
			});
			this.contactsForm.open();
		});
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

	private calculateTotal(
		items: Array<{ product: IProduct; count: number }>
	): number {
		return items.reduce(
			(total, item) => total + item.product.price * item.count,
			0
		);
	}
}
