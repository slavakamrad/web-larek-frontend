# Проектная работа "Веб-ларек"
## Краткое описание проекта:
[Web-ларёк](https://github.com/slavakamrad/web-larek-frontend) - проект небольшого интернет магазина. При помощи каталога товаров можно выбрать необходимый, добавить его в корзину и введя данные доставки, оформить заказ.

Стек:  

<img src="https://img.shields.io/badge/HTML-E34F26?style=for-the-badge&logo=html5&logoColor=white"/>&nbsp;<img src="https://img.shields.io/badge/SCSS-3178C6?style=for-the-badge&logo=css3&logoColor=white"/>&nbsp;<img src="https://img.shields.io/badge/TypeSript-3178C6?style=for-the-badge&logo=typescript&logoColor=white"/>&nbsp;<img src="https://img.shields.io/badge/Webpack-8DD6F9?style=for-the-badge&logo=webpack&logoColor=white"/>


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
└── models.ts      # Модели ICatalogModel, IBasketModel, IOrderModel 
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

### Модели (models.ts)
#### Структура моделей

```typescript
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
  clear(): void;                      // очистка корзины
}
interface IOrderModel {
  payment: PaymentMethod;       // текущий способ оплаты
  address: string;             // адрес доставки
  email: string;               // email пользователя
  phone: string;               // телефон пользователя
  items: string[];             // массив ID товаров в заказе
  total: number;               // итоговая сумма заказа
  updateField<K extends keyof IOrder>(field: K, value: IOrder[K]): void; // Обновляет конкретное поле заказа, все поля заказа уже объединены в IOrder  
  validate(): { isValid: boolean; errors: FormErrors }; // валидация
  getOrderData(): IOrder; // метод получения всех данных для отправки заказа на сервер
}

```

### Представления (views.ts)
#### Компонентная структура:

```typescript          
interface IView<T = unknown> {    // Интерфейс Базовое view
  render(data?: T): HTMLElement;  // рендер элементов
}

interface ICatalogView extends IView<IProduct[]> {        // view каталога товаров, расширяется за счет базового IView
  itemClick(handler: (product: IProduct) => void): void;  // обработчик клика по товару
  setLoading(loading: boolean): void; // метод для обновления состояния загрузки товаров в каталог
}       
        
interface IPopup extends IView {             // view модального окна, расширяется за счет базового IView 
  content: HTMLElement;                      // Контейнер содержимого модалки
  closeButton: HTMLButtonElement;            // Кнопка закрытия
  open(): void;                              // Открывает модальное окно
  close(): void;                             // Закрывает модальное окно
  handleESC(evt: KeyboardEvent): void;       // Обрабатывает нажатие ESC 
}

interface IProductPreview extends IPopup { // view попапа превью товара
  addToCart(handler: () => void): void;    // обработчик добавления в корзину
}

interface IBasketView extends IPopup {   // view попапа корзины, расширяется за счет базового IPopup
  update(items: Map<string, { product: IProduct, count: number }>): void;  // Обновляет список товаров в корзине
  deleteItem(handler: (id: string) => void): void;  // обработчик удаления товара
  basketButton: HTMLButtonElement;                  // Кнопка оформления заказа
  onSubmit(callback: () => void): void;             // обработчик кнопки оформления товара
}

interface IOrderFormView extends IPopup { // view модального окна формы заказа (шаг 1 - оплата/адрес), расширяется за счет базового IPopup
  method: PaymentMethod;                  // способ оплаты
  address: string;                        // адрес доставки
  submitButton: HTMLButtonElement;        // кнопка для продолжения оформления заказа
  errors: HTMLElement;                    // блок отображения ошибок
  render(state: IFormState): HTMLElement; // рендер формы с учетом состояния
  onSubmit(callback: () => void): void;   // обработчик кнопки для продолжения оформления товара
}

interface IContactsFormView extends IPopup { //  view модального окна формы контактов (шаг 2 - email/телефон), расширяется за счет базового IPopup
  email: string;                          // почта
  phone: string;                          // телефон
  submitButton: HTMLButtonElement;        // кнопка для продолжения оформления заказа
  errors: HTMLElement;                    // блок отображения ошибок
  render(state: IFormState): HTMLElement; // рендер формы с учетом состояния
  onSubmit(callback: () => void): void;   // обработчик кнопки для продолжения оформления товара
}

interface ISuccessView extends IPopup {  // view попапа успешного заказа, расширяется за счет базового IPopup
  total: number;                         // итоговая сумма
  setTotal(total: number): void;         // метод для установки итоговой суммы
}

interface IFormState { // Интерфейс состояния формы
  valid: boolean;      // валидна ли форма
  errors: string[];    // список ошибок
}

type FormErrors = Partial<Record<keyof IOrder, string>>; // Типизация ошибок в форме
```
## Система событий

Проект использует EventEmitter для взаимодействия между компонентами: 

### Каталог товаров
| Событие               | Данные                          | Описание |
|-----------------------|---------------------------------|----------|
| `Catalog:itemsUpdated`| `IProduct[]`                   | Обновление списка товаров |
| `Catalog:loading`     | `boolean`                      | Статус загрузки данных |
| `Catalog:itemClick`   | `IProduct`                     | Клик по товару в каталоге |

### Превью товара
| Событие               | Данные                          | Описание |
|-----------------------|---------------------------------|----------|
| `ProductPreview:add`  | `{ id: string }`        | Добавление товара из превью в корзину |
| `ProductPreview:open` | `IProduct`                     | Открытие превью товара |
| `ProductPreview:close`| `-`                            | Закрытие превью товара |

### Корзина
| Событие               | Данные                          | Описание |
|-----------------------|---------------------------------|----------|
| `Basket:itemsUpdated` | `Map<string, { product: IProduct, count: number }>` | Обновление состава корзины |
| `Basket:itemRemoved`  | `{ id: string }`        | Удаление товара из корзины |
| `Basket:checkout`     | `-`                            | Инициация оформления заказа |
| `Basket:open`         | `-`                            | Открытие корзины |
| `Basket:close`        | `-`                            | Закрытие корзины |

### Формы заказа
#### Шаг 1 (Оплата/Адрес)
| Событие               | Данные                          | Описание |
|-----------------------|---------------------------------|----------|
| `OrderForm:paymentChanged` | `PaymentMethod`           | Изменение способа оплаты |
| `OrderForm:addressChanged` | `string`                 | Изменение адреса доставки |
| `OrderForm:submit`    | `{ payment: PaymentMethod, address: string }` | Отправка формы |

#### Шаг 2 (Контактные данные)
| Событие               | Данные                          | Описание |
|-----------------------|---------------------------------|----------|
| `ContactsForm:emailChanged` | `string`                 | Изменение email |
| `ContactsForm:phoneChanged` | `string`                 | Изменение телефона |
| `ContactsForm:submit` | `{ email: string, phone: string }` | Отправка формы |

### Успешный заказ
| Событие               | Данные                          | Описание |
|-----------------------|---------------------------------|----------|
| `Success:viewClosed`  | `{ total: number }`            | Закрытие окна успешного заказа |

### Общие события
| Событие               | Данные                          | Описание |
|-----------------------|---------------------------------|----------|
| `App:orderCompleted`  | `{ orderId: string, total: number }` | Успешное оформление заказа |
| `App:error`           | `{ message: string }`          | Произошла ошибка |
