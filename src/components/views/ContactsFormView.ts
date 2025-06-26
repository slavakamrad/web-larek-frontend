import { Component } from '../base/component';
import { ensureElement } from '../../utils/utils';
import { IEvents } from '../base/events';
import { IOrder } from '../../types/data';

export class ContactsFormView extends Component<IOrder> {
	emailInput: HTMLInputElement;
	phoneInput: HTMLInputElement;
	submitButton: HTMLButtonElement;
	errors: HTMLElement;

	constructor(container: HTMLElement, protected events: IEvents) {
		super(container);

		this.emailInput = ensureElement<HTMLInputElement>(
			'input[name="email"]',
			container
		);
		this.phoneInput = ensureElement<HTMLInputElement>(
			'input[name="phone"]',
			container
		);
		this.submitButton = ensureElement<HTMLButtonElement>(
			'button[type="submit"]',
			container
		);
		this.errors = ensureElement<HTMLElement>('.form__errors', container);

		this.emailInput.addEventListener('input', () => {
			events.emit('order:change', {
				field: 'email',
				value: this.emailInput.value,
			});
		});

		this.phoneInput.addEventListener('input', () => {
			events.emit('order:change', {
				field: 'phone',
				value: this.phoneInput.value,
			});
		});

		this.submitButton.addEventListener('click', (e) => {
			e.preventDefault();
			events.emit('order:complete');
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
