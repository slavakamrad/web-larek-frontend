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
import { basketItemsTemplate, basketTemplate, cardPreviewTemplate, contactsTemplate, orderTemplate, successTemplate } from './utils/templates';
import { OrderModel } from './components/models/OrderModel';
import { BasketItem } from './components/views/BasketItems';

const events = new EventEmitter();
const api = new AppApi(CDN_URL, API_URL);
const catalogModel = new CatalogModel(events);
const basketModel = new BasketModel(events);
const orderModel = new OrderModel(events);
const modal = new AppModal(ensureElement('#modal-container'), events);

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
  modal.render({ content: basketView.render() });
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
  
  const items = Array.from(basketModel.items.values()).map((item, index) => {
    const basketItem = new BasketItem(
      cloneTemplate(basketItemsTemplate),
      events,
      item.product.id
    );
    return basketItem.render({
      product: item.product,
      index: index + 1
    });
  });

  basketView.setItems(items);
  basketView.render({
    items: Array.from(basketModel.items.keys()),
    total: basketModel.getTotal(),
    valid: basketModel.items.size > 0
  });
});

// Оформление заказа
events.on('order:init', () => {
  orderModel.clear();
  modal.render({ 
    content: orderForm.render({
      errors: [], 
      valid: false 
    })
  });
});

// валидируем 1 шаг оформления заказа
events.on('order:validate', (validation: { valid: boolean; errors: string[] }) => {
  orderForm.render({
    errors: validation.errors,
    valid: validation.valid
  });
});

// валидируем 2 шаг оформления заказа
events.on('contacts:validate', (validation: { valid: boolean; errors: string[] }) => {
  contactsForm.render({
    errors: validation.errors,
    valid: validation.valid
  });
});

// Изменение полей заказа
events.on('order:change', (data: { field: keyof IOrder; value: string | PaymentMethod }) => {
  orderModel.setField(data.field, data.value);
});

// если все ок открываем форму окнтактов
events.on('order:submit', () => {
  const validation = orderModel.validateOrderStep();
  
  if (validation.valid) {
    modal.render({ 
      content: contactsForm.render({
        errors: [], 
        valid: false 
      }) 
    });
  } else {
    orderForm.render({
      errors: validation.errors,
      valid: false
    });
  }
});

// Полетел заказик
events.on('order:complete', () => {   
  // Создаем полный объект заказа
  const order = orderModel.getOrder();
  order.items = basketModel.getItemsIds();
  order.total = basketModel.getTotal();
  
  // в вот и пост запросик
  api.postOrder(order)
    .then(() => {
      basketModel.clear();
      modal.render({ 
        content: successView.render({ total: order.total }) 
      });
      orderModel.clear();
    })
    .catch((err) => {
      console.error('Ошибка оформления заказа:', err);
      contactsForm.render({ 
        errors: ['Ошибка оформления заказа'], 
        valid: false 
      });
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