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
import { cloneTemplate, ensureElement } from './utils/utils';
import { IProduct, IOrder, PaymentMethod } from './types/data';
import { AppModal } from './components/views/Popup';
import { basketTemplate, cardPreviewTemplate, contactsTemplate, orderTemplate, successTemplate } from './utils/templates';

// import { AppApiMock } from './components/models/AppApiMock';

// Инициализация основных компонентов
const events = new EventEmitter();
const api = new AppApi(CDN_URL, API_URL);
// const api = new AppApiMock(CDN_URL); 
const catalogModel = new CatalogModel(events);
const basketModel = new BasketModel(events);
const modal = new AppModal(ensureElement('#modal-container'), events);

// Создание представлений
const page = new MainPage(document.body, events);
const catalogView = new CatalogView(ensureElement<HTMLElement>('.gallery'), events);
const preview = new ProductPreview(cloneTemplate(cardPreviewTemplate), events);
const basketView = new BasketView(cloneTemplate(basketTemplate), events); 
const orderForm = new OrderFormView(cloneTemplate(orderTemplate), events);
const contactsForm = new ContactsFormView(cloneTemplate(contactsTemplate), events);
const successView = new SuccessView(cloneTemplate(successTemplate), events);


// Загрузка товаров
api.getProductsList()
  .then(catalogModel.setItems.bind(catalogModel))
  .catch((err) => console.error(err));

// Обработчики событий
// events.onAll(({ eventName, data }) => console.log(eventName, data));

// Рендер каталога
events.on('items:changed', () => {
  catalogView.render(catalogModel.getItems());
});

// При клике на товар в каталоге открываем превью
events.on('catalog:item-click', (item: IProduct) => {
  const isInBasket = basketModel.hasItem(item.id);
  const container = preview.render(item, isInBasket);
 
    modal.render({ content: container });
 });


// Обработчик клика на иконку корзины
events.on('basket:open', () => {
  const basket = basketView.render({ basketItems: basketModel.items });
  modal.render({ content: basket });
});

// Добавление товара в корзину
events.on('basket:add', (product: IProduct) => {
  basketModel.addItem(product);
  modal.close();
});

// Удаление товара из корзины
events.on('basket:remove', (data: { id: string; fromPreview?: boolean }) => {
  basketModel.removeItem(data.id);
  if (data.fromPreview) {
    modal.close();
  }
});
 
// мониторим изменения в корзине
events.on('basket:changed', () => {
  page.counter = basketModel.items.size;
  basketView.render({ basketItems: basketModel.items });
});

 

// Обработчики для оформления заказа
// выбор оплаты и ввод адреса
events.on('order:init', () => {
   modal.render({ content: orderForm.render() });
});

//  если все ок передаем orderData дальше открываем форму окнтактов
events.on('order:submit', (orderData: { address: string; payment: PaymentMethod }) => {
  const contactsView = contactsForm.render(orderData)
  modal.render({content: contactsView})
});

// Полетел заказик
events.on('order:complete', (orderData: Omit<IOrder, 'items' | 'total'>) => {
  // Создаем полный объект заказа
  const order: IOrder = {
    email: orderData.email,
    phone: orderData.phone,
    address: orderData.address,
    payment: orderData.payment,
    items: basketModel.getItemsIds(),  
    total: basketModel.getTotal()  
  };

 // в вот и пост запросик
  api.postOrder(order)
    .then(() => {
      basketModel.clear();
      const success = successView.render({ total: order.total });
      modal.render({content: success})
    })
    .catch((err) => {
      console.error('Ошибка оформления заказа:', err);
      events.emit('order:error', err);
    });
});

// закрываем модалку с success
events.on('success:close', () => {
  modal.close();
});

// блокируем страницу, если модалка отрылась
events.on('modal:open', () => {
  page.locked = true;
});

// разблокируем
events.on('modal:close', () => {
  page.locked = false;
});
