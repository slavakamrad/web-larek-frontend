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
// import { ProductPreview } from './ProductPreview';
// import { BasketView } from './BasketView';
// import { OrderFormView } from './OrderFormView';
// import { ContactsFormView } from './ContactsFormView';
// import { SuccessView } from './SuccessView';
import { ensureElement } from '../../utils/utils';
import { IProduct } from '../../types/data';
import { ProductPreview } from './ProductPreview';

export class MainPage extends Component<{}> implements IView {
	catalog: ICatalogView;
	preview: IProductPreview;
	basket: IBasketView;
	orderForm: IOrderFormView;
	contactsForm: IContactsFormView;
	success: ISuccessView;

	constructor(container: HTMLElement, protected events: IEvents) {
		super(container);
	
		this.catalog = new CatalogView(
			ensureElement<HTMLElement>('.gallery'),
			events
		);  

		this.preview = new ProductPreview(
			ensureElement<HTMLElement>('#modal-container'), // Используем modal-container как контейнер
			events
		);
    
		// this.basket = new BasketView(
		// 	ensureElement<HTMLElement>('#basket'),
		// 	events
		// );
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
      this.catalog.render(data.items);
    });	

		// При клике на товар в каталоге открываем превью
		this.catalog.itemClick((product) => {
			this.preview.render(product);
			this.preview.open();
		
		});

		// // При добавлении товара в корзину из превью
		// this.preview.addToCart(() => {
		// 	this.preview.close();
		// 	this.events.emit('basket:add' /* product */);
		// });

		// // При открытии корзины
		// this.events.on('basket:open', () => {
		// 	this.basket.open();
		// });

		// // При оформлении заказа из корзины
		// this.basket.bindCheckout(() => {
		// 	this.basket.close();
		// 	this.orderForm.open();
		// });

		// Другие обработчики событий...
	}

	render(): HTMLElement {
		// Основная логика рендеринга главной страницы
		return this.container;
	}
}
