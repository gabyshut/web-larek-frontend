# Проектная работа "Веб-ларек"

Стек: HTML, SCSS, TS, Webpack

Структура проекта:
- src/ - исходные файлы проекта
- src/components/ - папка с JS компонентами
- src/components/base/ - папка с базовым кодом

Важные файлы:
- src/pages/index.html - HTML-файл главной страницы
- src/types/index.ts - файл с типами
- src/index.ts - точка входа приложения
- src/scss/styles.scss - корневой файл стилей
- src/utils/constants.ts - файл с константами
- src/utils/utils.ts - файл с утилитами

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

## Данные и типы данных, используемые в приложении

```
export interface ICardItem {
    id: string;
    description: string;
    image: string;
    title: string;
    category: string;
    price: number;
}

export type TProductId = Pick<ICardItem, 'id'>

export interface IBasket {
    items: ICardItem[];
    total: number;
    getProducts(): ICardItem[];
    deleteItem(itemId: TProductId): void;
    addItem(itemId: TProductId): void;
    clearList(items: ICardItem[]): void;
}

export interface ICardData {
    items: ICardItem[];
    getItemById(id: TProductId): ICardItem | undefined;
}

export interface IUserOrderData {
    payment: TPaymentMethod;
    address: string;
    email: string;
    phone: string;
    products: ICardItem[];
    total: number;
}

export type TPaymentMethod = 'card' | 'cash';


export interface IModal {
    open(content: HTMLElement): void;
    close(): void;
  }  
  
  
export interface IApiClient {
  getProducts(): Promise<ICardItem[]>;
  createOrder(order: IUserOrderData): Promise<void>;
}
  
export type AppEvents = 
    | { type: 'product:add'; payload: ICardItem }
    | { type: 'product:remove'; payload: string }
    | { type: 'basket:open' }
    | { type: 'modal:open'; payload: HTMLElement }
    | { type: 'modal:close' };
  
```

## Архитектура приложения

Проект реализован на основе MVP (Model-View-Presenter) подхода. Классы разделены на слои модели и представления, презентер отвечает за их взаимодействие в приложении.


## Классы и их функциональность

### Базовые классы

1. EventEmitter

- Реализует паттерн "Наблюдатель".
- Позволяет подписываться на события и уведомлять подписчиков о наступлении события.
- Методы: on, off, emit, onAll, offAll, trigger.

2. Api

Реализует первоначальную обработку запросов.

- `handleResponse`: обрабатывает полученные данные в соответствии со статусом ответа.
- `get`: получает данные.
- `post`: отправляет данные.

### Слой данных

1. CardModel  

Этот класс представляет собой модель списка товаров, приходящих с API. Он используется для хранения информации о товарах, получаемой с серверной части и работы с ними. 

Конструктор принимает на вход массив карточек и записывает его в объект, либо при его отсутствии создает пустой массив.

- Содержит массив карточек типа `ICardItem`.
- Сеттер записывает массив карточек, геттер позволяет их получить.
- Метод `getItemById` возвращает карточку `ICardItem` по `id` либо возвращает `undefined`, если карточка не найдена.

2. Basket
  
Класс для работы с корзиной покупок. Он реализует функциональность добавления, удаления товаров в корзину, получения списка товаров в корзине, очищения корзины.

Назначение конструктора: проинициализировать пустую корзину.

- `getProducts()`: возвращает все товары, которые находятся в корзине, в виде массива объектов типа `ICardItem`.
- `addItem(itemId: TProductId)`: добавляет товар в корзину по его `id`.
- `deleteItem(item: TProductId)`: удаляет товар из корзины по его `id`.
- `clearList(items: ICardItem[])`: очищает корзину.

3. UserOrderModel

Класс для оформления заказа. Он хранит всю информацию, необходимую для обработки и отправки заказа.

- Используется при создании заказа и отправке данных на сервер для дальнейшей обработки.
- Метод `validate` проверяет поле на корректность заполнения (или на наличие данных в поле) и генерирует событие, если данные введены некорректно или их в поле нет.
- Метод `submitOrder` отправляет заказ на сервер.

4. ApiClient

Класс для работы с внешним API. Он обеспечивает взаимодействие с сервером для получения данных о товарах и отправки данных о заказах.

- `getProducts()`: получает список товаров с сервера. Этот метод возвращает массив объектов типа `ICardItem`.
- `createOrder(order: IUserOrderData)`: отправляет данные о заказе на сервер для его обработки. Метод принимает объект типа `IUserOrderData`, который содержит информацию о заказе.

### Слой представления

1. Page

Отвечает за отображение главной страницы.

Конструктор принимает на вход элементы главной страницы `gallery: HTMLElement`, `basketButton: HTMLElement`, `basketCounter: HTMLElement` и записывает их.

Методы:

- `setCatalog(items: HTMLElement[]): void` - отрисовать карточки в каталоге.
- `setBasketCounter(count: number): void` - обновить счётчик корзины.

2. Modal

Класс для управления модальными окнами. Он предоставляет интерфейс для открытия и закрытия модальных окон.

Конструктор принимает DOM-элемент модального контейнера.

- `open(content: HTMLElement)`: открывает модальное окно с заданным содержимым.
- `close()`: закрывает текущее открытое модальное окно.

3. CardView

Отвечает за отображение карточки в заданном виде.

Конструктор принимает шаблон карточки и данные о товаре.

Методы:

- `renderCard(): HTMLElement` - возвращает DOM-элемент карточки.
- `setClickHandler(handler: (id: TProductId) => void): void` - обработчик клика на карточку.
- `setAddToBasketHandler(handler: (id: TProductId) => void): void` - клик на кнопку "в корзину".

4. ModalForm

Отвечает за отображение модалки с формой (2 шага), наследует `Modal`.

Конструктор вызывает конструктор `Modal` и принимает шаблон формы.

Методы:

- `setStep(step: 1 | 2): void` - переключение между шагами формы.
- `setSubmitHandler(handler: (formData: IOrderFormData) => void): void` - обработчик отправки формы.
- `setFieldError(field: string, message: string): void` - показать ошибку поля.

5. ModalCardView

Отвечает за отображение карточки в модальном окне, наследует `Modal`.

Конструктор принимает шаблон карточки и данные о товаре.

Методы:

- `setCloseHandler(handler: () => void): void` - закрытие модалки карточки.

6. ModalSuccess

Отвечает за отображение модального окна успешного оформления заказа, наследует `Modal`. Конструктор не принимает параметров.

7. ModalBasket

Отвечает за отображение модального окна корзины, наследует `Modal`.

Конструктор принимает шаблон корзины.

Методы:

-`setItems(items: HTMLElement[]): void` - отрисовать товары в корзине.
-`setTotal(total: number): void` - отобразить общую сумму заказа.
-`setOrderHandler(handler: () => void): void` - обработчик кнопки "Оформить заказ".
-`setRemoveHandler(handler: (id: string) => void): void` - обработчик удаления из корзины.

### Взаимодействие между компонентами:

1. Загрузка и отображение товаров

Презентер инициализируется, запрашивает данные:

`ApiClient.getProducts()` - получает товары с сервера, `CardModel` - сохраняет список карточек.

На основе данных из `CardModel` `CardView` создаёт DOM-элементы карточек. `Page.setCatalog()` получает список карточек и рендерит в `gallery`.

2. Добавление товара в корзину

Пользователь кликает "Добавить в корзину" на карточке:

`CardView.setAddToBasketHandler()` вызывает переданный обработчик. Этот обработчик вызывает `Basket.addItem(id)` - обновляет данные корзины. `Page.setBasketCounter()` обновляет счётчик товаров.

3. Открытие корзины

Пользователь кликает на иконку корзины: вызывается `ModalBasket.open()`, `Basket.getProducts()` - получение текущих товаров, `ModalBasket.setItems()` - рендерим товары в корзине, `ModalBasket.setTotal()` - отображаем сумму.

4. Удаление товара из корзины

В ModalBasket пользователь кликает на кнопку "Удалить": `ModalBasket.setRemoveHandler()` вызывает переданный обработчик, `Basket.deleteItem(id)` - обновление модели, `ModalBasket.setItems()` и `setTotal()` - повторный рендер корзины, `Page.setBasketCounter()` - обновляем счётчик.

5. Оформление заказа

Пользователь нажимает "Оформить заказ": `ModalBasket.setOrderHandler()` открывает ModalForm, `ModalForm.setSubmitHandler()` получает данные формы. `UserOrderModel.validate()` проверяет корректность (Если есть ошибки, то `ModalForm.setFieldError()` показывает ошибки), `UserOrderModel.submitOrder()` сохраняет данные, вызывает ApiClient.createOrder(), после успеха `Basket.clearList()` - очищает корзину, `Page.setBasketCounter(0)`, `ModalSuccess.open()` - показывает окно "Заказ оформлен".
