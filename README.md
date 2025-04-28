# Проектная работа "Веб-ларек"

Стек: HTML, SCSS, TS, Webpack

Структура проекта:
- src/ — исходные файлы проекта
- src/components/ — папка с JS компонентами
- src/components/base/ — папка с базовым кодом

Важные файлы:
- src/pages/index.html — HTML-файл главной страницы
- src/types/index.ts — файл с типами
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
## Структура проекта
```
src/
├── common.blocks/                # SCSS-стили для визуальных компонентов интерфейса (по БЭМ)
│   ├── basket.scss
│   ├── button.scss
│   ├── card.scss
│   ├── form.scss
│   ├── gallery.scss
│   ├── header.scss
│   ├── modal.scss
│   ├── order-success.scss
│   ├── order.scss
│   └── page.scss
│
├── components/                   # Основные компоненты приложения
│   ├── base/                     # Базовые классы и утилиты
│   │   ├── events.ts             # Система событий на основе паттерна "Наблюдатель"
│   │   └── api.ts                # Класс для работы с API
│
├── images/                       # Графика и иконки проекта
│   ├── logo.svg
│   ├── shopping_cart.svg
│   ├── Subtract.png
│   ├── Subtract.svg
│   ├── trash-2.svg
│   ├── trash.svg
│   └── x-circle.svg
│
├── pages/
│   └── index.html                # Основной HTML-шаблон страницы
│
├── public/                       # Статические файлы для публикации
│   ├── .nojekyll
│   ├── android-chrome-192x192.png
│   ├── android-chrome-512x512.png
│   ├── apple-touch-icon.png
│   ├── browserconfig.xml
│   ├── favicon-16x16.png
│   ├── favicon-32x32.png
│   ├── favicon.ico
│   ├── manifest.json
│   ├── mstile-70x70.png
│   ├── mstile-144x144.png
│   ├── mstile-150x150.png
│   ├── mstile-310x150.png
│   ├── mstile-310x310.png
│   └── safari-pinned-tab.svg
│
├── scss/                         # SCSS-структура проекта
│   ├── mixins/                   # SCSS-примеси
│   │   ├── _background.scss
│   │   ├── _container.scss
│   │   ├── _fix.scss
│   │   ├── _icon.scss
│   │   ├── _index.scss
│   │   └── _interactive.scss
│   ├── _variables.scss           # Переменные SCSS для проекта
│   └── styles.scss               # Главный файл для импорта всех стилей
│
├── types/                        # Типы и интерфейсы для TypeScript
│   └── index.ts                  # Типизация товаров, заказов, событий
│
├── utils/                        # Вспомогательные утилиты и константы
│   ├── constants.ts              # Глобальные константы проекта
│   └── utils.ts                  # Вспомогательные функции
│
├── vendor/                       # Сторонние библиотеки и шрифты
│   ├── garamond/                 # Шрифт EB Garamond
│   ├── glyphter/                 # Иконочный шрифт Glyphter
│   ├── ys-text/                  # Шрифты Yandex Sans Text / Display
│   └── normalize.css             # Сброс стандартных стилей браузера
│
└── index.ts                      # Главная точка входа в приложение
```

## Классы и их функциональность

1. CardItemAPI  

Этот класс представляет собой модель товара, который приходит с API. Он используется для хранения информации о товаре, получаемой с серверной части. 

- Содержит все данные о товаре, такие как его `id`, `description`, `image`, `title`, `category` и `price`.
- Может быть использован для представления товаров на страницах магазина.

2. Basket
  
Класс для работы с корзиной покупок. Он реализует функциональность добавления, удаления товаров и получения списка товаров в корзине.

- `getProducts()`: возвращает все товары, которые находятся в корзине, в виде массива объектов типа `IItemView`.
- `addItem(itemId: string)`: добавляет товар в корзину по его `id`.
- `deleteItem(item: IItemView)`: удаляет товар из корзины.

3. Modal

Класс для управления модальными окнами. Он предоставляет интерфейс для открытия и закрытия модальных окон.

- `open(content: HTMLElement)`: открывает модальное окно с заданным содержимым.
- `close()`: закрывает текущее открытое модальное окно.

4. ItemView

Класс, представляющий товар в корзине. Этот класс используется для отображения товара в пользовательском интерфейсе с минимальной информацией (например, без описания и дополнительных характеристик).

- Содержит поля, которые нужны для отображения товара в интерфейсе: `id`, `title`, `category`, `price`, `imageUrl`.
- Используется для отображения товаров, добавленных в корзину или в процессе покупки.

5. Order

Класс для оформления заказа. Он хранит всю информацию, необходимую для обработки и отправки заказа.

- Содержит данные о заказе, такие как способ оплаты (`payment`), адрес доставки (`address`), контактные данные пользователя (email, телефон) и список товаров (`items`).
- Используется при создании заказа и отправке данных на сервер для дальнейшей обработки.

6. ApiClient

Класс для работы с внешним API. Он обеспечивает взаимодействие с сервером для получения данных о товарах и отправки данных о заказах.

- `getProducts()`: получает список товаров с сервера. Этот метод возвращает массив объектов типа `ICardItemAPI`.
- `createOrder(order: IOrder)`: отправляет данные о заказе на сервер для его обработки. Метод принимает объект типа `IOrder`, который содержит информацию о заказе.

7. AppEvents

Тип событий, которые могут возникать в приложении. Он используется для управления событиями и их обработки.

Содержит различные типы событий, которые могут быть обработаны в приложении:
- `product:add`: добавление товара в корзину.
- `product:remove`: удаление товара из корзины.
- `basket:open`: открытие корзины.
- `modal:open`: открытие модального окна.
- `modal:close`: закрытие модального окна.

### Взаимодействие между компонентами:

1. API Client используется для получения данных о товарах с сервера (`getProducts`) и для отправки заказов на сервер (`createOrder`).
2. Basket управляет корзиной товаров. Он добавляет товары в корзину и удаляет их, обновляя интерфейс.
3. ItemView используется для отображения товаров в корзине с необходимыми минимальными данными.
4. Modal отвечает за открытие и закрытие модальных окон, например, при оформлении заказа.
5. AppEvents используется для обработки событий, таких как добавление и удаление товаров из корзины, открытие корзины и модальных окон.

## Типы данных

```
export interface ICardItemAPI {
    id: string;
    description: string;
    image: string;
    title: string;
    category: string;
    price: number;
}

export interface IBasket{
    getProducts(): IItemView[];
    deleteItem(item: IItemView): void;
    addItem(itemId: string): void;
}

export interface IModal {
    open(content: HTMLElement): void;
    close(): void;
  }  
  
export interface IItemView {
  id: string;
  title: string;
  category: string;
  price: number;
  imageUrl: string;
}
  
export interface IOrder {
  payment: string;
  address: string;
  email: string;
  phone: string;
  items: string[];
}
  
export interface IApiClient {
  getProducts(): Promise<ICardItemAPI[]>;
  createOrder(order: IOrder): Promise<void>;
}
  
export type AppEvents = 
    | { type: 'product:add'; payload: ICardItemAPI }
    | { type: 'product:remove'; payload: string }
    | { type: 'basket:open' }
    | { type: 'modal:open'; payload: HTMLElement }
    | { type: 'modal:close' };
  
```