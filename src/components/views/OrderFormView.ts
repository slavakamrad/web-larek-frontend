import { Component } from '../base/component';
import { ensureElement } from '../../utils/utils';
import { IEvents } from '../base/events';
import { IOrder, PaymentMethod } from '../../types/data';

export class OrderFormView extends Component<IOrder> {
	submitButton: HTMLButtonElement;
	addressInput: HTMLInputElement;
	errors: HTMLElement;
	paymentButtons: HTMLButtonElement[];

	constructor(container: HTMLElement, protected events: IEvents) {
		super(container);

		this.submitButton = ensureElement<HTMLButtonElement>(
			'button[type="submit"]',
			container
		);
		this.addressInput = ensureElement<HTMLInputElement>(
			'input[name="address"]',
			container
		);
		this.errors = ensureElement<HTMLElement>('.form__errors', container);
		this.paymentButtons = Array.from(container.querySelectorAll('.button_alt'));

		this.addressInput.addEventListener('input', () => {
			events.emit('order:change', {
				field: 'address',
				value: this.addressInput.value,
			});
		});

		this.paymentButtons.forEach((button) => {
			button.addEventListener('click', () => {
				events.emit('order:change', {
					field: 'payment',
					value: button.name as PaymentMethod,
				});
				this.togglePayment(button.name);
			});
		});

		this.submitButton.addEventListener('click', (e) => {
			e.preventDefault();
			events.emit('order:submit');
		});
	}

	protected togglePayment(method: string): void {
		this.paymentButtons.forEach((button) => {
			this.toggleClass(button, 'button_alt-active', button.name === method);
		});
	}

	render(
		data?: Partial<IOrder> & { errors?: string[]; valid?: boolean }
	): HTMLElement {
		if (data?.errors) {
			this.setText(this.errors, data.errors.join('; '));
		} else {
			this.setText(this.errors, '');
		}

		this.setDisabled(this.submitButton, !data?.valid);
		return this.container;
	}
}
