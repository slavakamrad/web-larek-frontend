# Проектная работа "Веб-ларек"
## Краткое описание проекта:
[Web-ларёк](https://github.com/slavakamrad/web-larek-frontend) - проект небольшого интернет магазина. При помощи каталога товаров можно выбрать необходимый, добавить его в корзину и введя данные доставки, оформить заказ.

Стек:  

<img src="https://img.shields.io/badge/HTML-E34F26?style=for-the-badge&logo=html5&logoColor=white"/>
<img src="https://img.shields.io/badge/SCSS-3178C6?style=for-the-badge&logo=css3&logoColor=white"/>
<img src="https://img.shields.io/badge/TypeSript-3178C6?style=for-the-badge&logo=typescript&logoColor=white"/>
<img src="https://img.shields.io/badge/Webpack-8DD6F9?style=for-the-badge&logo=webpack&logoColor=white"/>


Структура проекта:
- src/ — исходные файлы проекта
- src/components/ — папка с JS компонентами
- src/components/base/ — папка с базовым кодом

Важные файлы:
- src/pages/index.html — HTML-файл главной страницы
- src/types/ — директория с файлами типизации
- src/index.ts — точка входа приложения
- src/scss/styles.scss — корневой файл стилей
- src/utils/constants.ts — файл с константами
- src/utils/utils.ts — файл с утилитами

## Установка и запуск
Для установки и запуска проекта необходимо выполнить команды

```
npm install
npm run start
```

или

```
yarn
yarn start
```
## Сборка

```
npm run build
```

или

```
yarn build
```

## Архитектура

1. Выбрана ахритектура на основе MVP
2. UI создан по [макету](https://www.figma.com/design/0KMR7HxUUMyRPMjuCvQEN1/%D0%92%D0%B5%D0%B1-%D0%BB%D0%B0%D1%80%D1%91%D0%BA?node-id=0-1)
3. Описаны типы используемых данных. 
4. Сформирована документация.

### Ключевые особенности архитектуры

1. Строгая типизация:

   - Все сущности имеют четкие интерфейсы

   - Категории товаров типизированы

   - Цена товара может быть null

2. Гибкость API:

   - Отдельные методы для каждого endpoint

   - Описаны типы запросов/ответов

3. EventEmitter для связи компонентов

   - Модульность:

   - Компоненты не знают о реализации друг друга

   - Изменение API не требует изменений в View

4. Можно добавить дополнительные фичи 

## Структура типизации

```
src/types/
├── data.ts        # Бизнес-модели и доменные сущности
├── api.ts         # API-контракты и транспортные типы
├── views.ts       # Интерфейсы представлений и UI-компонентов
├── events.ts      # Система событий приложения
```
### Данные (data.ts)
#### Основные сущности:

```typescript   
interface IProduct {
  id: string;               // UUID товара
  description: string;      // Описание
  image: string;            // URL изображения
  title: string;            // Название  
  category: ProductCategory; // Категория из строго типизированного набора
  price: number | null;     // Цена (может отсутствовать)
}
interface IOrder {
  payment: PaymentMethod;   // 'online' | 'offline'
  email: string;            // Email покупателя
  phone: string;            // Телефон
  address: string;          // Адрес доставки
  total: number;            // Итоговая сумма
  items: string[];          // Массив ID товаров
}
```

### API слой (api.ts)
#### Ключевые интерфейсы:

```typescript   
interface IApi {
  baseUrl: string; // Базовый URL
  options: RequestInit; // Настройки подключения
  handleResponse(response: Response): Promise<object>; // Защищенный метод. Принимает Response. Возвращает    Promise<object>. 
  get(uri: string): Promise<object>; // GET запрос к URI. Принимает строку. Возвращает Promise<object>. 
  post(uri: string, data: object, method: string): Promise<object> // POST запрос. Принимает строку URI и возвращает промис с данными ответа.
}
interface IContactsOrder {
  email: string; // Email покупателя
  phone: string; // Номер телефона покупателя
  payment: PaymentMethod; // 'online' | 'offline'
  address: string; // Адрес покупателя
  validate(email: string, phone: string, address: string): boolean; // валидация формы
}
interface IOrderResponse {
  success: boolean; // ответ успешный или нет
  total?: number; // если успешный ответ то сумма
  id?: string; // если успешный ответ то id
  error?: string; // если не успешный ответ то текст ошибки
}
```

### Представления (views.ts)
#### Компонентная структура:

```typescript          
interface IView {
  render(data?: object): HTMLElement; // отображает переданные данные
}  
interface IPopup {
  content: HTMLElement; // разметка popup
  closeButton: HTMLButtonElement; // конпка popup
  open(): void;  // метод открытия popup
  close(): void; // метод зарытия popup
  handleESC(evt: KeyboardEvent): void; // закртие по нажатию ESC
  render(data: IPopup): boolean;       // метод отображения popup
}
interface IForm {
  submit: HTMLButtonElement; // сохранние формы
  errors: HTMLElement;       // вывод ошибок формы
  onInputChange(): void;     // мониторинг изменений поля ввода
  render(state: IFormState): HTMLElement; //
} 
interface IFormState {
  valid: boolean;    //
  errors: string[];  //
}
interface ICatalogModel {
  items: IProduct[]; // Array всех товаров
  setItems(items: IProduct[]): void; // обновление товаров
  getItems(): IProduct[];        // получение товаров
  getItem(id: string): IProduct; // получение товара по id
}
interface IBasketModel {
  items: Map<string, number>;         // массив товаров в корзине
  add(id: string): void;              // метод добавления товаров в корзину
  remove(id: string): void;           // метод удаления товаров из корзины
  getCartValue(cost: number): number; // метод получения итоговой стоиомсти товаров
}
interface IBasketView {
  render(): void; // отображение корзины
  update(items: Map<string, number>): void; // метод обновления корзины
  clear(): void; // метод удаления товаров из корзины
}
```