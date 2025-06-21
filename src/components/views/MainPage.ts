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
import { BasketView } from './BasketView';

export class MainPage extends Component<{}> implements IView {
	catalogView: ICatalogView;
	productPreview: IProductPreview;
	basket: IBasketView;
	orderForm: IOrderFormView;
	contactsForm: IContactsFormView;
	success: ISuccessView;
	basketIcon: HTMLElement;

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
			this.basket.render({ 
					// items: this.getBasketItems()  
			});
			this.basket.open();
	});


		// При добавлении товара в корзину из превью
		// this.preview.addToCart(() => {
		// 	this.preview.close();
		// 	this.events.emit('basket:add' /* product */);
		// });

		// При открытии корзины
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
