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

#### Основные сущности:
## Главные компоненты

### MainPage (views/MainPage.ts)

Центральный компонент приложения, который:
- Инициализирует все представления

### Модели

#### CatalogModel (models/CatalogModel.ts)
- Хранит список товаров
- Управляет состоянием превью товара
- Эмитит события при изменении данных

#### AppApi (models/AppApi.ts)
- Обеспечивает взаимодействие с API
- Загружает список товаров
- Отправляет заказы на сервер

#### BasketModel (models/BasketModel.ts)
- Хранит товары в корзине в виде Map (id товара → товар и его количество)
- Управляет состоянием корзины (добавление/удаление товаров, очистка)
- Предоставляет информацию о товарах в корзине 
- Проверяет наличие товара в корзине
- Эмитит событие 'basket:changed' при изменении корзины

### Представления

#### CatalogView (views/CatalogView.ts)
- Отображает список товаров
- Обрабатывает клики по товарам
- Поддерживает состояние загрузки

#### ProductPreview (views/ProductPreview.ts)
- Показывает детальную информацию о товаре
- Позволяет добавлять/удалять товары из корзины

#### BasketView (views/BasketView.ts)
- Отображает содержимое корзины
- Показывает итоговую сумму
- Обрабатывает удаление товаров
- Инициирует оформление заказа

#### OrderFormView (views/OrderFormView.ts)
- Форма выбора способа оплаты и адреса доставки
- Валидация введенных данных

#### ContactsFormView (views/ContactsFormView.ts)
- Форма ввода контактных данных
- Валидация email и телефона

#### SuccessView (views/SuccessView.ts)
- Сообщение об успешном оформлении заказа
- Показывает итоговую сумму

## Структура типизации

### Данные (data.ts)

```typescript
interface IProduct {
  id: string;
  description: string;
  image: string;
  title: string;
  category: ProductCategory;
  price: number | null;
}

interface IOrder {
  payment: PaymentMethod;
  email: string;
  phone: string;
  address: string;
  total: number;
  items: string[];
}
```

### API слой (api.ts)

```typescript
interface IAppAPI {
  readonly imageUrl: string;
  getProductsList(): Promise<IProduct[]>;
  getProductItem(id: string): Promise<IProduct>;
  postOrder(order: IOrder): Promise<IOrder>;
}
```

### Модели (models.ts)

```typescript
interface ICatalogModel {
  items: IProduct[];
  setItems(items: IProduct[]): void;
  getItems(): IProduct[];
  getItem(id: string): IProduct;
}
```

### Представления (views.ts)

```typescript
interface IView<T = unknown> {
  render(data?: T): HTMLElement;
}

interface ICatalogView extends IView<IProduct[]> {
  itemClick(handler: (product: IProduct) => void): void;
  setLoading(loading: boolean): void;
}

interface IPopup extends IView {
  content: HTMLElement;
  closeButton: HTMLButtonElement;
  open(): void;
  close(): void;
  handleESC(evt: KeyboardEvent): void;
}

interface IProductPreview extends IPopup {
  button: HTMLButtonElement;
  currentProduct: IProduct;
}

interface IBasketView extends IPopup {
  basketItems: Map<string, { product: IProduct; count: number }>;
}

interface IOrderFormView extends IPopup {
  method: PaymentMethod;
  address: string;
  submitButton: HTMLButtonElement;
  errors: HTMLElement;
  render(state: IOrder): HTMLElement;
}

interface IContactsFormView extends IPopup {
  emailInput: HTMLInputElement;
  phoneInput: HTMLInputElement;
  submitButton: HTMLButtonElement;
  errors: HTMLElement;
  render(state: IFormState): HTMLElement;
}

interface ISuccessView extends IPopup {
  total: number;
}
```

## Система событий
### Каталог товаров
| Событие          | Данные              | Описание |
|------------------|---------------------|----------|
| `items:changed`  | -                   | Обновление списка товаров (рендер каталога) |
| `catalog:item-click` | `IProduct` | Клик по товару в каталоге |
### Превью товара
| Событие          | Данные              | Описание |
|------------------|---------------------|----------|
| `basket:add`     | `IProduct`          | Добавление товара в корзину |
| `basket:remove`  | `{ id: string }`    | Удаление товара из корзины |
| `basket:check`   | `{ id: string, callback: (isInBasket: boolean) => void }` | Проверка наличия товара в корзине |
### Корзина
| Событие          | Данные              | Описание |
|------------------|---------------------|----------|
| `basket:changed` | -                   | Изменение состава корзины (обновление счетчика и вида) |
| `basket:open`    | -                   | Открытие корзины |
### Оформление заказа
#### Шаг 1 (Оплата/Адрес)
| Событие          | Данные              | Описание |
|------------------|---------------------|----------|
| `order:init`     | -                   | Инициация оформления заказа |
| `order:submit`   | `{ address: string; payment: PaymentMethod }` | Отправка формы оплаты и адреса |
#### Шаг 2 (Контактные данные)
| Событие          | Данные              | Описание |
|------------------|---------------------|----------|
| `contacts:submit` | `{ email: string; phone: string }` | Отправка контактных данных |
### Успешный заказ
| Событие          | Данные              | Описание |
|------------------|---------------------|----------|
| `order:error`    | `Error`             | Ошибка при оформлении заказа |
### Модальные окна
Используются методы .open() напрямую, без событий