import { EventEmitter } from '../base/events';
import { IOrder, PaymentMethod } from '../../types/data';

export class OrderModel {
	protected order: Partial<IOrder> = {
		email: '',
		phone: '',
		address: '',
		payment: null,
		items: [],
		total: 0,
	};

	constructor(protected events: EventEmitter) {}

	setField(field: keyof IOrder, value: string | PaymentMethod): void {
		this.order[field] = value as never;

		if (field === 'address' || field === 'payment') {
			const validation = this.validateOrderStep();
			this.events.emit('order:validate', validation);
		} else if (field === 'email' || field === 'phone') {
			const validation = this.validateContactsStep();
			this.events.emit('contacts:validate', validation);
		}
	}

	// Валидация первого шага (адрес и оплата)
	validateOrderStep(): { valid: boolean; errors: string[] } {
		const errors: string[] = [];

		if (!this.order.address?.trim()) {
			errors.push('Укажите адрес доставки');
		}

		if (!this.order.payment) {
			errors.push('Выберите способ оплаты');
		}

		return {
			valid: errors.length === 0,
			errors,
		};
	}

	// Валидация второго шага (контакты)
	validateContactsStep(): { valid: boolean; errors: string[] } {
		const errors: string[] = [];

		if (!this.order.email?.trim()) {
			errors.push('Введите email');
		} else if (!this.validateEmail(this.order.email)) {
			errors.push('Введите корректный email');
		}

		if (!this.order.phone?.trim()) {
			errors.push('Введите телефон');
		} else if (!this.validatePhone(this.order.phone)) {
			errors.push('Введите телефон в формате 11 цифр');
		}

		return {
			valid: errors.length === 0,
			errors,
		};
	}

	private validateEmail(email: string): boolean {
		return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
	}

	private validatePhone(phone: string): boolean {
		return /^[0-9]{11}$/.test(phone.replace(/\D/g, ''));
	}

	getOrder(): IOrder {
		return this.order as IOrder;
	}

	clear(): void {
		this.order = {
			email: '',
			phone: '',
			address: '',
			payment: null,
			items: [],
			total: 0,
		};
	}
}
