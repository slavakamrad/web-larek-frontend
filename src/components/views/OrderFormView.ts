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
    method: PaymentMethod = 'card';  
    address: string = '';

    constructor(container: HTMLElement, events: IEvents) {
        super(container, events);
    }

    updatePaymentSelection() {
      this.paymentButtons.forEach(button => {
          button.classList.toggle('button_alt-active', 
              button.name === this.method);
      });
  }


    render(state?: IOrder): HTMLElement {        
        const content = orderTemplate.content.cloneNode(true) as DocumentFragment;
        this.content.replaceChildren(content);
     
        this.paymentButtons = [
            ensureElement<HTMLButtonElement>('button[name="card"]', this.content),
            ensureElement<HTMLButtonElement>('button[name="cash"]', this.content)
        ];
        this.addressInput = ensureElement<HTMLInputElement>('input[name="address"]', this.content);
        this.submitButton = ensureElement<HTMLButtonElement>('button[type="submit"]', this.content);
        this.errors = ensureElement<HTMLElement>('.form__errors', this.content);

        this.submitButton.addEventListener('click', (e) => {
            e.preventDefault();
            this.address = this.addressInput.value;
            this.events.emit('order:addContacts', {
                payment: this.method,
                address: this.address,
            });
        });

        return this.container;
    }
}