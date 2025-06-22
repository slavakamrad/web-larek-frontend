import { IContactsFormView, IFormState } from "../../types/views";
import { contactsTemplate } from "../../utils/templates";
import { ensureElement } from "../../utils/utils";
import { IEvents } from "../base/events";
import { AppModal } from "./Popup";

export class ContactsFormView extends AppModal implements IContactsFormView {
    emailInput: HTMLInputElement;
    phoneInput: HTMLInputElement;
    submitButton: HTMLButtonElement;
    errors: HTMLElement;
    
    constructor(container: HTMLElement, protected events: IEvents) {
        super(container, events);

        const content = contactsTemplate.content.cloneNode(true) as DocumentFragment;
        this.content.replaceChildren(content);
        
        this.emailInput = ensureElement<HTMLInputElement>('input[name="email"]', this.content);
        this.phoneInput = ensureElement<HTMLInputElement>('input[name="phone"]', this.content);
        this.submitButton = ensureElement<HTMLButtonElement>('button[type="submit"]', this.content);
        this.errors = ensureElement<HTMLElement>('.form__errors', this.content);

        this.emailInput.addEventListener('input', () => {
            events.emit('contacts:email', { value: this.emailInput.value });
        });

        this.phoneInput.addEventListener('input', () => {
            events.emit('contacts:phone', { value: this.phoneInput.value });
        });

        this.submitButton.addEventListener('click', (e) => {
            e.preventDefault();
            events.emit('contacts:submit');
        });
    }

    render(state: IFormState): HTMLElement {

        const content = contactsTemplate.content.cloneNode(true) as DocumentFragment;
        this.content.replaceChildren(content);
         
        this.errors.innerHTML = '';
        
        if (state.errors) {
            state.errors.forEach(error => {
                const errorElement = document.createElement('p');
                errorElement.className = 'form__error';
                errorElement.textContent = error;
                this.errors.appendChild(errorElement);
            });
        }
        
        this.setDisabled(this.submitButton, !state.valid);
        return this.container;
    }

    getEmail(): string {
        return this.emailInput.value;
    }

    getPhone(): string {
        return this.phoneInput.value;
    }
}