import { Component } from '../base/component';
import { ensureElement } from '../../utils/utils';
import { IEvents } from '../base/events';
import { IOrder } from '../../types/data';
import { IOrderFormView } from '../../types/views';

export class OrderFormView extends Component<IOrder> implements IOrderFormView {
    submitButton: HTMLButtonElement;
    addressInput: HTMLInputElement;
    errors: HTMLElement;
    paymentButtons: HTMLButtonElement[]; 
    selectedPayment: string | null = null;

    constructor(container: HTMLElement, protected events: IEvents) {
        super(container);


        this.submitButton = ensureElement<HTMLButtonElement>('button[type="submit"]', container);
        this.addressInput = ensureElement<HTMLInputElement>('input[name="address"]', container);
        this.errors = ensureElement<HTMLElement>('.form__errors', container);
        this.paymentButtons = Array.from(container.querySelectorAll('.button_alt')); 
        this.addressInput.addEventListener('input', () => this.validateForm());
        this.paymentButtons.forEach(button => {
            button.addEventListener('click', () => {
                this.selectPayment(button.name);  
                this.validateForm();
            });
        });

        this.submitButton.addEventListener('click', (e) => {
            e.preventDefault();
            this.submitForm();
        });
    }

    selectPayment(method: string) {
        this.selectedPayment = method;
        this.paymentButtons.forEach(button => {
            button.classList.toggle('button_alt-active', button.name === method);
        });
    }

    validateForm() {
        const hasAddress = this.addressInput.value.trim().length > 0;
        const hasPayment = this.selectedPayment !== null;
        
        let errorMessage = '';
        
        if (!hasPayment && !hasAddress) {
            errorMessage = 'Выберите способ оплаты и введите адрес доставки';
        } else if (!hasPayment) {
            errorMessage = 'Выберите способ оплаты';
        } else if (!hasAddress) {
            errorMessage = 'Введите адрес доставки';
        }
        
        this.setText(this.errors, errorMessage);
        this.submitButton.disabled = !hasPayment || !hasAddress;
    }

    submitForm() {
        if (!this.selectedPayment) {
            this.setText(this.errors, 'Выберите способ оплаты');
            return;
        }

        if (!this.addressInput.value.trim()) {
            this.setText(this.errors, 'Укажите адрес доставки');
            return;
        }

        this.events.emit('order:submit', {
            address: this.addressInput.value,
            payment: this.selectedPayment
        });
    }
}