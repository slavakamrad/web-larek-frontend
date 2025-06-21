import './scss/styles.scss';
import { cloneTemplate, ensureElement } from './utils/utils';
import { API_URL, CDN_URL } from './utils/constants';
import { EventEmitter } from './components/base/events';
import { AppApi } from './components/models/AppApi';
import { CatalogModel } from './components/models/CatalogModel';
import { MainPage } from './components/views/MainPage';
import { AppModal } from './components/views/Popup';
import { IProduct } from './types/data';
// import { BasketView } from './components/views/BasketView';


export const cardCatalogTemplate =
	ensureElement<HTMLTemplateElement>('#card-catalog');
export const cardPreviewTemplate =
	ensureElement<HTMLTemplateElement>('#card-preview');
const cardBasketTemplate = ensureElement<HTMLTemplateElement>('#card-basket');
const basketTemplate = ensureElement<HTMLTemplateElement>('#basket');
const contactsTemplate = ensureElement<HTMLTemplateElement>('#contacts');
const modalElement = ensureElement<HTMLElement>('#modal-container');
const successTemplate = ensureElement<HTMLTemplateElement>('#success');

const events = new EventEmitter();
const api = new AppApi(CDN_URL, API_URL);
const catalog = new CatalogModel(events);

api
	.getProductsList()
	.then(catalog.setItems.bind(catalog))
	.catch((err) => console.log(err));


const page = new MainPage(document.body, events);
export const modal = new AppModal(modalElement, events);
// const basket = new BasketView(cloneTemplate(basketTemplate), events);

events.on('items:changed', (data: { items: IProduct[] }) => {
  page.catalog.render(data.items);
});

// Чтобы мониторить все события, для отладки
events.onAll(({ eventName, data }) => {
	console.log(eventName, data);
});




 