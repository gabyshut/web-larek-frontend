import './scss/styles.scss';
import { ICardItem, IUserOrderData, TPaymentMethod } from './types';
import {
	ApiClient,
	Basket,
	CardModel,
	UserOrderModel,
} from './components/Model';
import { API_URL, CDN_URL } from './utils/constants';
import {
	CardView,
	FormPaymentAddress,
	FormEmailPhone,
	Modal,
	ModalBasket,
	Page,
	ModalSuccess,
} from './components/view';

const apiClient = new ApiClient(API_URL);

(async () => {
	const products = await apiClient.getProducts();
	const cardModel = new CardModel(products);
	const basket = new Basket(cardModel);
	const userOrder = new UserOrderModel();

	const modalElement = document.querySelector('.modal')! as HTMLElement;
	const modalContent = modalElement.querySelector('.modal__content')!;
	const modal = new Modal(modalElement);
	const modalClose = document.querySelector('.modal__close');

	// Каталог
	const page = new Page(
		document.querySelector('.gallery')!,
		document.querySelector('.header__basket-counter')!,
		document.querySelector('.header__basket')!
	);

	const cards = products.map((product) => {
		const cardView = new CardView(
			document.querySelector('#card-catalog'),
			product
		);
		const elem = cardView.renderCard();
		cardView.on('card:click', (data) => {
			const cardModal = new CardView(
				document.querySelector('#card-preview'),
				data
			);
			const renderedCardModal = cardModal.renderCard();
			const button = renderedCardModal.querySelector(
				'.card__button'
			) as HTMLButtonElement;

			if (data.price === null) {
				modal.disableButton(button);
				button.textContent = 'Недоступно';
			} else if (basket.items.some((item) => item.id === data.id)) {
				modal.disableButton(button);
				button.textContent = 'Уже в корзине';
			}

			modalContent.appendChild(renderedCardModal);
			modal.open();

			cardModal.on('product:add', (data) => {
				basket.addItem(data.id);
				page.setBasketCounter(basket.items.length);
				button.disabled = true;
				button.textContent = 'Уже в корзине';
			});
		});

		return elem;
	});

	page.setCatalog(cards);
	page.setBasketCounter(basket.items.length);

	modalClose.addEventListener('click', () => {
		modal.close();
		while (modalContent.firstChild) {
			modalContent.removeChild(modalContent.firstChild);
		}
	});

	//Корзина
	page.basketButton.addEventListener('click', () => {
		const basketModal = new ModalBasket(document.querySelector('#basket')!);

		basketModal.on('submit:click', () => {
			console.log('Заказ отправлен!');
			const order = new UserOrderModel();
			const formPayment = new FormPaymentAddress(
				document.querySelector('#order')
			);
			while (modalContent.firstChild) {
				modalContent.removeChild(modalContent.firstChild);
			}
			modalContent.appendChild(formPayment.getElement());
			formPayment.on('address:input', (value: string) => {
				order.setField('address', value);
				const isValid = order.validate('address');

				if (isValid) {
					formPayment.clearFieldError('address');
				}

				formPayment.setSubmitDisabled(!(isValid && order.getField('payment')));
			});

			formPayment.on('payment:selected', (value: string) => {
				order.setField('payment', value as TPaymentMethod);
				const isAddressValid = order.validate('address');
				const isPaymentValid = order.validate('payment');
				formPayment.setSubmitDisabled(!(isAddressValid && isPaymentValid));
			});

			order.on('order:error', ({ field, message }) => {
				formPayment.setFieldError(field, message);
			});

			formPayment.on('form:submit', () => {
				while (modalContent.firstChild) {
					modalContent.removeChild(modalContent.firstChild);
				}
				const formContacts = new FormEmailPhone(
					document.querySelector('#contacts')
				);
				modalContent.appendChild(formContacts.getElement());
				const updateButtonState = () => {
					const isEmailValid = order.validate('email');
					const isPhoneValid = order.validate('phone');
					formContacts.setSubmitDisabled(!(isEmailValid && isPhoneValid));
				};

				formContacts.on('email:input', (value: string) => {
					order.setField('email', value);
					updateButtonState();
				});

				formContacts.on('phone:input', (value: string) => {
					order.setField('phone', value);
					updateButtonState();
				});

				formContacts.on('form:submit', () => {
					order.setItems(basket.items);
					order.setTotal(basket.total);

					const handleReady = async (data: IUserOrderData) => {
						order.off('order:ready', handleReady);
						try {
							await apiClient.createOrder(data);
							basket.clearList();
              page.setBasketCounter(basket.items.length);
							const modalSuccess = new ModalSuccess(
								document.querySelector('#success')
							);
							while (modalContent.firstChild) {
								modalContent.removeChild(modalContent.firstChild);
							}
              
							modalContent.appendChild(modalSuccess.renderSuccessModal(basket.total));
              modalSuccess.on('modal:close', () => {
                modal.close();
              })
						} catch (e) {
							console.error('Ошибка отправки заказа:', e);
						}
					};

					order.on('order:ready', handleReady);
					order.prepareOrder();
				});
			});
		});

		const renderBasket = () => {
			const basketCards = basket.items.map((item) => {
				const cardBasket = new CardView(
					document.querySelector('#card-basket')!,
					item
				);

				cardBasket.on('product:remove', (data) => {
					basket.deleteItem(data.id);
					page.setBasketCounter(basket.items.length);

					renderBasket();
				});

				return cardBasket.renderCard();
			});

			basketModal.setItems(basketCards);
			basketModal.setTotal(basket.total);
			modalContent.replaceChildren(basketModal.getBasketElement());
		};

		renderBasket();
		basketModal.setOrderHandler();
		modal.open();
	});
})();
