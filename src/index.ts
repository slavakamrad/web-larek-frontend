import './scss/styles.scss';
import { API_URL, CDN_URL } from './utils/constants';
import { EventEmitter } from './components/base/events';
import { AppApi } from './components/models/AppApi';
import { CatalogModel } from './components/models/CatalogModel';
import { BasketModel } from './components/models/BasketModel';
import { MainPage } from './components/views/MainPage';
import { CatalogView } from './components/views/CatalogView';
import { ProductPreview } from './components/views/ProductPreview';
import { BasketView } from './components/views/BasketView';
import { OrderFormView } from './components/views/OrderFormView';
import { ContactsFormView } from './components/views/ContactsFormView';
import { SuccessView } from './components/views/SuccessView';
import { ensureElement } from './utils/utils';
import { IProduct, IOrder, PaymentMethod } from './types/data';

// import { AppApiMock } from './components/models/AppApiMock';

// Инициализация основных компонентов
const events = new EventEmitter();
const api = new AppApi(CDN_URL, API_URL);
// const api = new AppApiMock(CDN_URL); 
const catalogModel = new CatalogModel(events);
const basketModel = new BasketModel(events);

// Создание представлений
const page = new MainPage(document.body, events);
const catalogView = new CatalogView(ensureElement<HTMLElement>('.gallery'), events);
const productPreview = new ProductPreview(ensureElement<HTMLElement>('#modal-container'), events);
const basketView = new BasketView(ensureElement<HTMLElement>('#modal-container'), events);
const orderForm = new OrderFormView(ensureElement<HTMLElement>('#modal-container'), events);
const contactsForm = new ContactsFormView(ensureElement<HTMLElement>('#modal-container'), events);
const successView = new SuccessView(ensureElement<HTMLElement>('#modal-container'), events);

// Загрузка товаров
api.getProductsList()
  .then(catalogModel.setItems.bind(catalogModel))
  .catch((err) => console.error(err));

// Обработчики событий
// Рендер каталога
events.on('items:changed', () => {
  catalogView.render(catalogModel.getItems());
});

// При клике на товар в каталоге открываем превью
events.on('catalog:item-click', (product: IProduct) => {
  productPreview.render(product);
  productPreview.open();
});

// Обработчик клика на иконку корзины
events.on('basket:open', () => {
  basketView.render({ basketItems: basketModel.items });
  basketView.open();
});

// Добавление товаров в корзину
events.on('basket:add', (product: IProduct) => {
  basketModel.addItem(product);
});

// Удаление товаров
events.on('basket:remove', (data: { id: string }) => {
  basketModel.removeItem(data.id);
});

events.on('basket:changed', () => {
  page.counter = basketModel.items.size;
  basketView.render({ basketItems: basketModel.items });
});

events.on('basket:check', (data: { id: string; callback: (isInBasket: boolean) => void }) => {
  data.callback(basketModel.hasItem(data.id));
});

// Обработчики для оформления заказа
// выбор оплаты и ввод адреса
events.on('order:init', () => {
  orderForm.render({
    payment: 'card',
    address: ''
  });
  orderForm.open();
});

//  если все ок передаем orderData дальше открываем форму окнтактов
events.on('order:submit', (orderData: { address: string; payment: PaymentMethod }) => {
  contactsForm.render({
    valid: false,
    errors: []
  });
  contactsForm.open();
});

// вводим контакты покупателя
events.on('contacts:submit', (contacts: { email: string; phone: string }) => {
  const order: IOrder = {
    ...contacts,
    address: orderForm.address,
    payment: orderForm.method,
    items: basketModel.getItemsIds(),
    total: basketModel.getTotal()
  };

  // полетел заказик
  api.postOrder(order)
    .then(() => {
      basketModel.clear();
      successView.render({ total: order.total });
    })
    .catch((err) => {
      console.error('Ошибка оформления заказа:', err);
      events.emit('order:error', err);
    });
});