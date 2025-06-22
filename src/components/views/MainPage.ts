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
import { OrderFormView } from './OrderFormView';
import { ensureElement } from '../../utils/utils';
import { IOrder, IProduct, PaymentMethod } from '../../types/data';
import { ProductPreview } from './ProductPreview';
import { BasketView } from './BasketView';
import { ContactsFormView } from './ContactsFormView';
import { AppApi } from '../models/AppApi';
import { CDN_URL, API_URL } from '../../utils/constants';
import { SuccessView } from './SuccessView';

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
	newOrder: IOrder;
	private api: AppApi;

	constructor(container: HTMLElement, protected events: IEvents) {
		super(container);
		this.api = new AppApi(CDN_URL, API_URL);
		this.newOrder = {
			payment: 'card',
			email: '',
			phone: '',
			address: '',
			total: 0,
			items: [],
		};

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
		this.success = new SuccessView(
			ensureElement<HTMLElement>('#modal-container'),
			events
		);

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

		// Проверка, есть ли товар в корзине
		this.events.on(
			'basket:check',
			(data: { id: string; callback: (isInBasket: boolean) => void }) => {
				data.callback(this.basketItems.has(data.id));
			}
		);

		// Добавление товаров в корзину
		this.events.on('basket:add', (product: IProduct) => {
			if (!product || this.basketItems.has(product.id)) return;

			this.basketItems.set(product.id, {
				product,
				count: 1, // Всегда 1, так как нельзя добавить несколько одинаковых товаров
			});

			this.updateBasketIcon();
			this.events.emit('basket:changed', this.basketItems);
		});

		// Удаление товаров
		this.events.on('basket:remove', (data: { id: string }) => {
			this.basketItems.delete(data.id);
			this.updateBasketIcon();
			this.events.emit('basket:changed', this.basketItems);
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
		this.events.on(
			'order:addContacts',
			(orderData: { address: string; payment: PaymentMethod }) => {
				this.newOrder.address = orderData.address;
				this.newOrder.payment = orderData.payment;
				this.orderForm.close();
				this.events.emit('contact:init');
				this.contactsForm.open();
			}
		);

		// вводим контакты покупателя
		this.events.on('contact:init', () => {
			this.basket.close();
			this.contactsForm.render({
				valid: false,
				errors: [],
			});
			this.contactsForm.open();
		});

		// полетел заказик
		this.events.on(
			'contacts:submit',
			(contacts: { email: string; phone: string }) => {
				this.newOrder.email = contacts.email;
				this.newOrder.phone = contacts.phone;
				this.newOrder.items = Array.from(this.basketItems.values()).map(
					(item) => item.product.id
				);
				this.newOrder.total = this.calculateTotal(
					Array.from(this.basketItems.values())
				);

				try {
					// Отправка на сервер
					const response = this.api.postOrder(this.newOrder);

					// Закрываем форму контактов
					this.contactsForm.close();

					// Обновляем SuccessView и открываем его
					this.success.render({ total: this.newOrder.total });
					this.success.open();

					// Очищаем корзину
					this.basketItems.clear();
					this.updateBasketIcon();

					// Можно также эмитнуть событие успеха, если оно нужно другим компонентам
					this.events.emit('order:success', { total: this.newOrder.total });
					
					// Обнуляем заказик
					this.newOrder = {
						payment: 'card',
						email: '',
						phone: '',
						address: '',
						total: 0,
						items: []
					}; 
 
  
				} catch (error) {
					console.error('Ошибка оформления заказа:', error);
					this.events.emit('order:error', error);
				}
			}
		);
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
