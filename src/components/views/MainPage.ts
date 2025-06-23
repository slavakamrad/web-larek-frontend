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

		this.basketIcon.addEventListener('click',()=> events.emit('basket:open'))
		 
	}

	render(): HTMLElement {
		// Рендерим главную
		return this.container;
	}

	updateBasketIcon(): void {
		let totalCount = 0;
		this.basketItems.forEach((item) => {
			totalCount += item.count;
		});
		this.basketCounter.textContent = String(totalCount);
	}

	calculateTotal(
		items: Array<{ product: IProduct; count: number }>
	): number {
		return items.reduce(
			(total, item) => total + item.product.price * item.count,
			0
		);
	}
}
