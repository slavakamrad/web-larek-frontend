import './scss/styles.scss';
 import { API_URL, CDN_URL } from './utils/constants';
import { EventEmitter } from './components/base/events';
import { AppApi } from './components/models/AppApi';
import { CatalogModel } from './components/models/CatalogModel';
import { MainPage } from './components/views/MainPage';
import { IProduct } from './types/data';
 

const events = new EventEmitter();
const api = new AppApi(CDN_URL, API_URL);
const catalog = new CatalogModel(events);

api
	.getProductsList()
	.then(catalog.setItems.bind(catalog))
	.catch((err) => console.log(err));


const page = new MainPage(document.body, events);

events.on('items:changed', (data: { items: IProduct[] }) => {
  page.catalogView.render(data.items);
});

// // Чтобы мониторить все события, для отладки
// events.onAll(({ eventName, data }) => {
// 	console.log(eventName, data);
// });




 