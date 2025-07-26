import './scss/styles.scss';
import { IUserOrderData, TPaymentMethod } from './types';

import { API_URL } from './utils/constants';

import { ApiClient } from './components/model/ApiClient';
import { CardModel } from './components/model/CardModel';
import { Basket } from './components/model/Basket';
import { UserOrderModel } from './components/model/UserOrderModel';
import { eventBus } from './components/base/events';
import { ModalBasket } from './components/view/ModalBasket';
import { FormEmailPhone } from './components/view/FormEmailPhone';
import { FormPaymentAddress } from './components/view/FormPaymentAddress';
import { Modal } from './components/view/Modal';
import { CardView } from './components/view/CardView';
import { ModalSuccess } from './components/view/ModalSuccess';
import { Page } from './components/view/Page';

const apiClient = new ApiClient(API_URL);

(async () => {
	const products = await apiClient.getProducts();
	const cardModel = new CardModel(products);
	const basket = new Basket(cardModel);
	const userOrder = new UserOrderModel(eventBus);
	const basketModal = new ModalBasket(
		document.querySelector('#basket'),
		eventBus
	);
	const formContacts = new FormEmailPhone(
		document.querySelector('#contacts'),
		eventBus
	);

	const formPayment = new FormPaymentAddress(
		document.querySelector('#order'),
		eventBus
	);

	const modalElement = document.querySelector('.modal')! as HTMLElement;
	const modal = new Modal(modalElement);

	function resetOrderFlow() {
		userOrder.clear();
		formContacts.clearFields();
		formPayment.clearFields();
	}

	// Каталог
	const page = new Page(
		document.querySelector('.gallery')!,
		document.querySelector('.header__basket-counter')!,
		document.querySelector('.header__basket')!,
		eventBus
	);
	eventBus.on('card:click', (data) => {
		const cardModal = new CardView(
			document.querySelector('#card-preview'),
			eventBus
		);
		const renderedCardModal = cardModal.renderCard(data);

        if (data.price === null){
            	cardModal.setButtonStateUnavailable();
        } else if (basket.items.some((item) => item.id === data.id)) {
			cardModal.setButtonStateAlreadyInBasket();
		} else {
			cardModal.setButtonStateAvailable(() => {
				eventBus.emit('product:add', data);
				cardModal.setButtonStateAlreadyInBasket();
			});
		}

		modal.setContent(renderedCardModal);
		modal.open();
	});
	eventBus.on('product:add', (data) => {
		basket.addItem(data.id);
		page.setBasketCounter(basket.items.length);
	});

	eventBus.on('product:remove', (data) => {
		basket.deleteItem(data.id);
		page.setBasketCounter(basket.items.length);
		renderBasket();
	});

	const cards = products.map((product) => {
		const cardView = new CardView(
			document.querySelector('#card-catalog'),
			eventBus
		);
		const elem = cardView.renderCard(product);

		return elem;
	});

	page.setCatalog(cards);
	page.setBasketCounter(basket.items.length);

	eventBus.on('basket:click', () => {
		resetOrderFlow();
		renderBasket();
		modal.open();
	});

	eventBus.on('address:input', (value: string) => {
		userOrder.setField('address', value);
		const isValid = userOrder.validate('address');

		if (isValid) {
			formPayment.clearFieldError('address');
		}

		formPayment.setSubmitDisabled(!(isValid && userOrder.getField('payment')));
	});

	eventBus.on('payment:selected', (value: string) => {
		userOrder.setField('payment', value as TPaymentMethod);
		const isAddressValid = userOrder.validate('address');
		const isPaymentValid = userOrder.validate('payment');
		formPayment.setSubmitDisabled(!(isAddressValid && isPaymentValid));
	});

	eventBus.on('order:error', ({ field, message }) => {
		formPayment.setFieldError(field, message);
	});
	const updateButtonState = () => {
		const isEmailValid = userOrder.validate('email');
		const isPhoneValid = userOrder.validate('phone');
		formContacts.setSubmitDisabled(!(isEmailValid && isPhoneValid));
	};
	eventBus.on('email:input', (value: string) => {
		userOrder.setField('email', value);
		updateButtonState();
	});
	eventBus.on('phone:input', (value: string) => {
		userOrder.setField('phone', value);
		updateButtonState();
	});
	eventBus.on('form:submit', () => {
		userOrder.setItems(basket.items);
		userOrder.setTotal(basket.total);
		modal.setContent(formContacts.getElement());

		userOrder.prepareOrder();
	});

	eventBus.on('submit:click', () => {
		userOrder.clear();
		modal.setContent(formPayment.getElement());
	});

	eventBus.on('order:ready', async (data: IUserOrderData) => {
		try {
			await apiClient.createOrder(data);
			basket.clearList();
			page.setBasketCounter(basket.items.length);

			const modalSuccess = new ModalSuccess(
				document.querySelector('#success'),
				eventBus
			);
			modal.setContent(modalSuccess.renderSuccessModal(basket.total));

			eventBus.on('modal:close', () => {
				modal.close();
			});
		} catch (e) {
			console.error('Ошибка отправки заказа:', e);
		}
	});

	const renderBasket = () => {
		const basketCards = basket.items.map((item, index) => {
			const cardBasket = new CardView(
				document.querySelector('#card-basket')!,
				eventBus
			);

			return cardBasket.renderCard(item, index, true);
		});

		basketModal.setItems(basketCards);
		basketModal.setTotal(basket.total);
		modal.setContent(basketModal.render());
	};

	renderBasket();
})();
