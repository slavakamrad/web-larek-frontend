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

#### OrderModel (models/OrderModel.ts)
- Хранит данные о заказе
- Валиидрует данные заказа
- Очищает инфо о заказе

### Представления

#### CatalogView (views/CatalogView.ts)
- Отображает список товаров
- Обрабатывает клики по товарам
- Поддерживает состояние загрузки

#### ProductPreview (views/ProductPreview.ts)
- Показывает детальную информацию о товаре
- Позволяет добавлять/удалять товары из корзины

#### BasketView (views/BasketView.ts)
- Показывает итоговую сумму
- Обрабатывает удаление товаров
- Инициирует оформление заказа

#### BasketItems(view/BasketItems.ts)
- Отображает содержимое корзины

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
  isInBasket?: boolean;
  id: string;
  description: string;
  image: string;
  title: string;
  category: ProductCategory;
  price: number | null;
}

interface IBasketData {
  items: Map<string, { product: IProduct; count: number }>;
  
}

type PaymentMethod = 'cash' | 'card';

interface IOrder {
  payment: PaymentMethod;
  email: string;
  phone: string;
  address: string;
  total: number;
  items: string[];
  errors?: string[];
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

interface IBasketModel {
  items: Map<string, number>;
  addItem(id: string): void;
  removeItem(id: string): void;
  getCartValue(cost: number): number;
  clear(): void;
  getTotal():number;
  getItemsIds():string[];
  hasItem(id: string): boolean;
}

interface IOrder {
  payment: PaymentMethod;
  email: string;
  phone: string;
  address: string;
  total: number;
  items: string[];
  errors?: string[];
  valid?: boolean; 
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
}

interface IProductPreview {
  button: HTMLButtonElement;
  currentProduct: IProduct;
}

interface IBasketView {
  basketItems: Map<string, { product: IProduct; count: number }>;
}

interface IBasketItem {
    product: IProduct;
    index: number;
}

interface IOrderFormView {
  method: PaymentMethod;
  address: string;
  submitButton: HTMLButtonElement;
  errors: HTMLElement;
  render(state: IOrder): HTMLElement;
}

interface IContactsFormView {
  emailInput: HTMLInputElement;
  phoneInput: HTMLInputElement;
  submitButton: HTMLButtonElement;
  errors: HTMLElement;
  render(state: IFormState): HTMLElement;
}

interface ISuccessView {
  total: number;
}
```

Вот обновленная таблица событий с учетом предоставленного кода:

## Система событий
## События приложения

### Каталог товаров
| Событие          | Данные              | Описание | Обработчик |
|------------------|---------------------|----------|------------|
| `items:changed`  | -                   | Обновление списка товаров | `catalogView.render(catalogModel.getItems())` |
| `catalog:item-click` | `IProduct` | Клик по товару | Открывает превью товара с проверкой наличия в корзине через `basketModel.hasItem()` |

### Превью товара
| Событие          | Данные              | Описание | Обработчик |
|------------------|---------------------|----------|------------|
| `basket:add`     | `IProduct`          | Добавление в корзину | `basketModel.addItem()`, закрытие модалки через `modal.close()` |
| `basket:remove`  | `{ id: string, fromPreview?: boolean }` | Удаление из корзины | `basketModel.removeItem()`, при `fromPreview` закрывает модалку через `modal.close()` |

### Корзина
| Событие          | Данные              | Описание | Обработчик |
|------------------|---------------------|----------|------------|
| `basket:changed` | -                   | Изменение состава корзины | Обновляет счетчик через `page.counter`, перерисовывает корзину через `basketView.render()` |
| `basket:open`    | -                   | Открытие корзины | Рендер корзины в модальном окне через `modal.render()` |

### Оформление заказа
#### Шаг 1 (Оплата и адрес)
| Событие          | Данные              | Описание | Обработчик |
|------------------|---------------------|----------|------------|
| `order:init`     | -                   | Инициация оформления | Очищает `orderModel`, открывает форму заказа в модалке через `modal.render()` |
| `order:change`   | `{ field: keyof IOrder; value: string \| PaymentMethod }` | Изменение полей заказа | Обновляет данные в `orderModel` через `orderModel.setField()` |
| `order:validate` | `{ valid: boolean; errors: string[] }` | Валидация данных заказа | Обновляет форму заказа через `orderForm.render()` |
| `order:submit`   | -                   | Подтверждение данных | Проверяет валидность через `orderModel.validateOrderStep()`, при успехе открывает форму контактов |

#### Шаг 2 (Контактные данные)
| Событие          | Данные              | Описание | Обработчик |
|------------------|---------------------|----------|------------|
| `contacts:validate` | `{ valid: boolean; errors: string[] }` | Валидация контактных данных | Обновляет форму контактов через `contactsForm.render()` |
| `contacts:submit` | -                   | Подтверждение контактов | Формирует полный заказ через `orderModel.getOrder()`, отправляет на сервер через `api.postOrder()` |

### Успешное оформление
| Событие          | Данные              | Описание | Обработчик |
|------------------|---------------------|----------|------------|
| `order:complete` | -                   | Успешное оформление | Очищает корзину через `basketModel.clear()`, показывает успех через `modal.render()` с `successView` |
| `success:close`  | -                   | Закрытие окна успеха | Закрывает модальное окно через `modal.close()` |

### Модальные окна
| Событие          | Данные              | Описание | Обработчик |
|------------------|---------------------|----------|------------|
| `modal:open`     | -                   | Открытие модалки | Блокирует страницу через `page.locked = true` |
| `modal:close`    | -                   | Закрытие модалки | Разблокирует страницу через `page.locked = false` |

### Примечание:

Все модальные окна управляются через события `modal:open` и `modal:close`