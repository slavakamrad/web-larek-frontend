import { Component } from '../base/component';
import { ensureElement } from '../../utils/utils';
import { IEvents } from '../base/events';
import { IOrder } from '../../types/data';

export class ContactsFormView extends Component<IOrder> {
    protected _emailInput: HTMLInputElement;
    protected _phoneInput: HTMLInputElement;
    protected _submitButton: HTMLButtonElement;
    protected _errors: HTMLElement;

    constructor(container: HTMLElement, protected events: IEvents) {
        super(container);
        
        this._emailInput = ensureElement<HTMLInputElement>('input[name="email"]', container);
        this._phoneInput = ensureElement<HTMLInputElement>('input[name="phone"]', container);
        this._submitButton = ensureElement<HTMLButtonElement>('button[type="submit"]', container);
        this._errors = ensureElement<HTMLElement>('.form__errors', container);

        this._emailInput.addEventListener('input', () => {
            events.emit('order:change', { 
                field: 'email', 
                value: this._emailInput.value 
            });
        });

        this._phoneInput.addEventListener('input', () => {
            events.emit('order:change', { 
                field: 'phone', 
                value: this._phoneInput.value 
            });
        });

        this._submitButton.addEventListener('click', (e) => {
            e.preventDefault();
            events.emit('order:complete');
        });
    }

    render(data?: Partial<IOrder> & { errors?: string[]; valid?: boolean }): HTMLElement {
        if (data?.errors) {
            this.setText(this._errors, data.errors.join('; '));
        } else {
            this.setText(this._errors, '');
        }
        
        this.setDisabled(this._submitButton, !data?.valid);
        return this.container;
    }
}