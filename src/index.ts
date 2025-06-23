import './scss/styles.scss';
import { API_URL, CDN_URL } from './utils/constants';
import { EventEmitter } from './components/base/events';
import { AppApi } from './components/models/AppApi';
import { CatalogModel } from './components/models/CatalogModel';
import { MainPage } from './components/views/MainPage';
import { IProduct, IOrder, PaymentMethod } from './types/data';
import { AppModal } from './components/views/Popup';

const events = new EventEmitter();
const api = new AppApi(CDN_URL, API_URL);
const catalog = new CatalogModel(events);
const page = new MainPage(document.body, events);
 

// Загрузка товаров
api
  .getProductsList()
  .then(catalog.setItems.bind(catalog))
  .catch((err) => console.log(err));


// Обработчики событий

// Рендер каталога
events.on('items:changed', (data: { items: IProduct[] }) => {
  page.catalogView.render(data.items);
});

// При клике на товар в каталоге открываем превью
events.on('catalog:item-click', (product: IProduct) => {
  page.productPreview.render(product);
  page.productPreview.open();
});

// Обработчик клика на иконку корзины
events.on('basket:open', () => {
  page.basket.render({ basketItems: page.basketItems });
  page.basket.open();
});

// Добавление товаров в корзину
events.on('basket:add', (product: IProduct) => {
  if (!product || page.basketItems.has(product.id)) return;
  
  page.basketItems.set(product.id, {
    product,
    count: 1
  });
  
  page.updateBasketIcon();
  events.emit('basket:changed', page.basketItems);
});

// Проверка, есть ли товар в корзине
events.on('basket:check', (data: { id: string; callback: (isInBasket: boolean) => void }) => {
  data.callback(page.basketItems.has(data.id));
});

// Удаление товаров
events.on('basket:remove', (data: { id: string }) => {
  page.basketItems.delete(data.id);
  page.updateBasketIcon();
  events.emit('basket:changed', page.basketItems);
});

// фиксируем изменения корзинки
events.on('basket:changed', () => {
  page.basket.render({ basketItems: page.basketItems });
});

// открываем модалку для выбора способа оплаты и адреса доставки
events.on('order:init', (data: IOrder) => {
  page.basket.close();
  page.orderForm.render(data);
  page.orderForm.open();
});

//  если все ок передаем orderData дальше открываем форму окнтактов
events.on('order:addContacts', (orderData: { address: string; payment: PaymentMethod }) => {
  page.newOrder.address = orderData.address;
  page.newOrder.payment = orderData.payment;
  page.orderForm.close();
  events.emit('contact:init');
});

// вводим контакты покупателя
events.on('contact:init', () => {
  page.basket.close();
  page.contactsForm.render({
    valid: false,
    errors: []
  });
  page.contactsForm.open();
});

// полетел заказик
events.on('contacts:submit', (contacts: { email: string; phone: string }) => {
  page.newOrder.email = contacts.email;
  page.newOrder.phone = contacts.phone;
  page.newOrder.items = Array.from(page.basketItems.values()).map(item => item.product.id);
  page.newOrder.total = page.calculateTotal(Array.from(page.basketItems.values()));

  try {
    api.postOrder(page.newOrder);
    page.contactsForm.close();

		// открываем модалку успеха
    page.success.render({ total: page.newOrder.total });
    page.success.open();
    page.basketItems.clear();
    page.updateBasketIcon();
    events.emit('order:success', { total: page.newOrder.total });
    
    page.newOrder = {
      payment: 'card',
      email: '',
      phone: '',
      address: '',
      total: 0,
      items: []
    };
  } catch (error) {
    console.error('Ошибка оформления заказа:', error);
    events.emit('order:error', error);
  }
});


// Чтобы мониторить все события, для отладки
// events.onAll(({ eventName, data }) => {
// 	console.log(eventName, data);
// });




 