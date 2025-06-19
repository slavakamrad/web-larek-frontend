import './scss/styles.scss';
import { ensureElement } from './utils/utils';
import { API_URL, CDN_URL } from './utils/constants';
import { EventEmitter } from './components/base/events';
import { AppApi } from './components/models/AppApi';
import { CatalogModel } from './components/models/CatalogModel';
import { MainPage } from './components/views/MainPage';


const events = new EventEmitter();
const api = new AppApi(CDN_URL, API_URL);
const app = new CatalogModel(events);
	
// Создаем главную страницу
const page = new MainPage(document.body, events);

// Чтобы мониторить все события, для отладки
events.onAll(({ eventName, data }) => {
    console.log(eventName, data);
})

const successTemplate = ensureElement<HTMLTemplateElement>('#success');
export const cardCatalogTemplate = ensureElement<HTMLTemplateElement>('#card-catalog');
export const cardPreviewTemplate = ensureElement<HTMLTemplateElement>('#card-preview');
const cardBasketTemplate = ensureElement<HTMLTemplateElement>('#card-basket');
const basketTemplate = ensureElement<HTMLTemplateElement>('#basket');
const contactsTemplate = ensureElement<HTMLTemplateElement>('#contacts');

api
	.getProductsList()
	.then(app.setItems.bind(app))
	.catch((err) => console.log(err));