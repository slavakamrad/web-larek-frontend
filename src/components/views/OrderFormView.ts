import { IOrder, PaymentMethod } from '../../types/data';
import { IOrderFormView } from '../../types/views';
import { orderTemplate } from '../../utils/templates';
import { ensureElement } from '../../utils/utils';
import { IEvents } from '../base/events';
import { AppModal } from './Popup';

export class OrderFormView extends AppModal implements IOrderFormView {
    paymentButtons: HTMLButtonElement[];
    addressInput: HTMLInputElement;
    submitButton: HTMLButtonElement;
    errors: HTMLElement;
    method: PaymentMethod = "card";
    address: string = '';
    static savedData: { payment: PaymentMethod, address: string } | null = null;

    constructor(container: HTMLElement, events: IEvents) {
        super(container, events);
    }

    updatePaymentSelection() {
        this.paymentButtons.forEach((button) => {
            button.classList.toggle('button_alt-active', button.name === this.method);
        });
        this.validateForm();
    }
    

    render(state?: Partial<IOrder>): HTMLElement {
        const content = orderTemplate.content.cloneNode(true) as DocumentFragment;
        this.content.replaceChildren(content);

        this.paymentButtons = [
            ensureElement<HTMLButtonElement>('button[name="card"]', this.content),
            ensureElement<HTMLButtonElement>('button[name="cash"]', this.content),
        ];
        this.addressInput = ensureElement<HTMLInputElement>('input[name="address"]', this.content);
        this.submitButton = ensureElement<HTMLButtonElement>('button[type="submit"]', this.content);
        this.errors = ensureElement<HTMLElement>('.form__errors', this.content);

        if (OrderFormView.savedData) {
            this.method = OrderFormView.savedData.payment;
            this.address = OrderFormView.savedData.address;
            this.addressInput.value = OrderFormView.savedData.address;
        } else if (state) {
            this.method = state.payment || "card";
            this.address = state.address || '';
            this.addressInput.value = state.address || '';
        }

        this.updatePaymentSelection();
        this.validateForm();

        this.paymentButtons.forEach((button) => {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                this.method = button.name as PaymentMethod;
                this.updatePaymentSelection();
                this.saveData();
            });
        });

        this.addressInput.addEventListener('input', () => {
            this.address = this.addressInput.value.trim();
            this.validateForm();
            this.saveData();
        });

        this.submitButton.addEventListener('click', (e) => {
            e.preventDefault();
            if (this.validateForm()) {
                this.events.emit('order:submit', {
                    payment: this.method,
                    address: this.address
                });
                OrderFormView.savedData = null;
            }
        });

        return this.container;
    }

    private validateForm(): boolean {
        this.errors.innerHTML = '';
        const errors: string[] = [];
        
        if (!this.address) {
            errors.push('Необходимо указать адрес доставки');
        }

        if (errors.length) {
            this.showErrors(errors);
            this.submitButton.disabled = true;
            return false;
        }

        this.submitButton.disabled = false;
        return true;
    }

    private showErrors(errors: string[]): void {
        this.errors.innerHTML = '';
        errors.forEach(error => {
            const errorElement = document.createElement('p');
            errorElement.className = 'form__error';
            errorElement.textContent = error;
            this.errors.appendChild(errorElement);
        });
    }

    saveData(): void {
        OrderFormView.savedData = {
            payment: this.method,
            address: this.address
        };
    }

    close(): void {
        this.saveData(); 
        super.close();
    }

    
}