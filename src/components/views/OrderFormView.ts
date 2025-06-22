import { PaymentMethod } from '../../types/data';
import { IOrderFormView, IPopupData } from '../../types/views';
import { orderTemplate } from '../../utils/templates';
import { ensureElement } from '../../utils/utils';
import { IEvents } from '../base/events';
import { AppModal } from './Popup';

export class OrderFormView extends AppModal implements IOrderFormView {
	paymentButtons: HTMLButtonElement[];
	addressInput: HTMLInputElement;
	submitButton: HTMLButtonElement;
	errors: HTMLElement;
	method: PaymentMethod = 'online'; // значение по умолчанию - онлайн оплата
	address: string = '';

	constructor(container: HTMLElement, events: IEvents) {
		super(container, events);
	}

	render(data?: IPopupData): HTMLElement {
		if (!data) return this.container;
		this.errors.innerHTML = '';

		const content = orderTemplate.content.cloneNode(true) as DocumentFragment;
		this.content.replaceChildren(content);

		this.paymentButtons = [
			ensureElement<HTMLButtonElement>('button[name="card"]', this.content),
			ensureElement<HTMLButtonElement>('button[name="cash"]', this.content),
		];
		this.addressInput = ensureElement<HTMLInputElement>(
			'input[name="address"]',
			this.content
		);
		this.submitButton = ensureElement<HTMLButtonElement>(
			'button[type="submit"]',
			this.content
		);
		this.errors = ensureElement<HTMLElement>('.form__errors', this.content);

		return this.container;
	}
}
