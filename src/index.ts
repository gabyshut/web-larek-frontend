import './scss/styles.scss';
import { ICardItem, IUserOrderData } from './types';
import { ApiClient, Basket, CardModel, UserOrderModel } from './components/Model';
import { API_URL, CDN_URL } from './utils/constants';
import { CardView, Page } from './components/view';

// const card1: ICardItem = {
//     id: 1234,
//     description: "Pohui pohui pohui",
//     image: "pohui pohui poebat",
//     title: "poebat vashe pohui",
//     category: "bebra",
//     price: 5
// }

// const card2: ICardItem = {
//     id: 2222,
//     description: "jfdknklrngks",
//     image: "aaaaaaaaaaa",
//     title: "popopopopopop",
//     category: "hui",
//     price: 10
// }

// const card3: ICardItem = {
//     id: 5050,
//     description: "иуикф",
//     image: "оооооооооооо",
//     title: "щшщшщшщшщшщ",
//     category: "письпопа",
//     price: 15
// }

// const order: IUserOrderData = {
//     payment: 'cash',
//     address: '34ufjsf jdfoggiod , iofd, jgkei',
//     email: 'fjkhsdjkf@mafhdsk.com',
//     phone: '+78483948549',
//     products: [card1, card2],
//     total: 4564377
// }


// Инициализация клиента API
const apiClient = new ApiClient(API_URL);

// Главная функция — всё делаем тут
(async () => {
  try {
    // 1. Получаем карточки с сервера
    const products = await apiClient.getProducts();
    console.log('🟢 Получены продукты с сервера:', products);

    // 2. Сохраняем карточки в модель
    const cardModel = new CardModel(products);

    // 3. Создаём корзину на основе модели карточек
    const basket = new Basket(cardModel);

    // 4. Добавляем в корзину первые три карточки (если есть)
    products.slice(0, 3).forEach((product) => {
      basket.addItem(product.id);
    });

    console.log('🧺 Содержимое корзины:', basket.items);
    console.log('💰 Сумма заказа:', basket.total);

   // 5. Создаём модель заказа
    const userOrder = new UserOrderModel();

    // Устанавливаем поля заказа
    userOrder.setField('address', 'Пример улица, 123');
    userOrder.setField('email', 'example@email.com');
    userOrder.setField('phone', '+79991234567');
    userOrder.setField('payment', 'card');

    // ✅ Передаём сразу карточки
    userOrder.setItems(basket.getProducts());
    userOrder.setTotal(basket.total);
    
    //тестим карточки вью
    const page = new Page(document.querySelector('.gallery'), document.querySelector('.header__basket-counter'), document.querySelector('.header__basket'));
    products.forEach((product) => {
        const cardViewha = new CardView(document.querySelector('#card-catalog') as HTMLTemplateElement, products[0]);
        const renderedCard:HTMLElement[] = renderedCard.push(cardViewha.renderCard());
    })
    
    page.setCatalog(renderedCard);

  } catch (error) {
    console.error('❌ Ошибка при оформлении заказа:', error);
  }
})();
