import { IContactsFormView, IFormState } from "../../types/views";
import { ensureElement } from "../../utils/utils";
import { IEvents } from "../base/events";
import { Component } from "../base/component";
import { IOrder, PaymentMethod } from "../../types/data";

export class ContactsFormView extends Component<IOrder> implements IContactsFormView {
    emailInput: HTMLInputElement;
    phoneInput: HTMLInputElement;
    submitButton: HTMLButtonElement;
    errors: HTMLElement;
    private orderData: Partial<IOrder> = {};

    constructor(container: HTMLElement, protected events: IEvents) {
        super(container);
        
        this.emailInput = ensureElement<HTMLInputElement>('input[name="email"]', container);
        this.phoneInput = ensureElement<HTMLInputElement>('input[name="phone"]', container);
        this.submitButton = ensureElement<HTMLButtonElement>('button[type="submit"]', container);
        this.errors = ensureElement<HTMLElement>('.form__errors', container);

        this.emailInput.addEventListener('input', () => {
            this.validateForm();
            this.events.emit('contacts:email', { value: this.emailInput.value });
        });

        this.phoneInput.addEventListener('input', () => {
            this.validateForm();
            this.events.emit('contacts:phone', { value: this.phoneInput.value });
        });

        this.submitButton.addEventListener('click', (e) => {
            e.preventDefault();
            this.submitOrder();
        });

        this.validateForm();
    }

    render(data: Partial<IOrder>): HTMLElement {
    
        if (data.address && data.payment) {
            this.orderData = {
                address: data.address,
                payment: data.payment as PaymentMethod
            };
        }
        this.validateForm();
        return this.container;
    }

    private validateForm(): void {
        const hasEmail = this.emailInput.value.trim().length > 0;
        const hasPhone = this.phoneInput.value.trim().length > 0;
        
        let errorMessage = '';
        
        if (!hasEmail && !hasPhone) {
            errorMessage = 'Введите email и телефон';
        } else if (!hasEmail) {
            errorMessage = 'Введите email';
        } else if (!hasPhone) {
            errorMessage = 'Введите телефон';
        } else {
            if (!this.validateEmail(this.emailInput.value)) {
                errorMessage = 'Некорректный email';
            } else if (!this.validatePhone(this.phoneInput.value)) {
                errorMessage = 'Некорректный телефон (11 цифр)';
            }
        }
        
        this.setText(this.errors, errorMessage);
        this.submitButton.disabled = !!errorMessage;
    }

    private validateEmail(email: string): boolean {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }

    private validatePhone(phone: string): boolean {
        const digits = phone.replace(/\D/g, '');
        return digits.length === 11;
    }

    private submitOrder(): void {
        if (!this.validateEmail(this.emailInput.value)) {
            this.setText(this.errors, 'Некорректный email');
            return;
        }

        if (!this.validatePhone(this.phoneInput.value)) {
            this.setText(this.errors, 'Некорректный телефон (11 цифр)');
            return;
        }

        const order: IOrder = {
            ...this.orderData,
            email: this.emailInput.value,
            phone: this.phoneInput.value,
            items: this.orderData.items || [],
            total: this.orderData.total || 0
        } as IOrder;

        if (!order.payment) {
            this.setText(this.errors, 'Не выбран способ оплаты');
            return;
        }

        if (!order.address) {
            this.setText(this.errors, 'Не указан адрес доставки');
            return;
        }

        this.events.emit('order:complete', order);
    }

    get email(): string {
        return this.emailInput.value;
    }

    get phone(): string {
        return this.phoneInput.value;
    }
}