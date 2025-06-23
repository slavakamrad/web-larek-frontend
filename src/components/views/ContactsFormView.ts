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
    private static savedData: { email: string, phone: string } | null = null;

    constructor(container: HTMLElement, protected events: IEvents) {
        super(container, events);
    }

    render(state?: Partial<IFormState>): HTMLElement {
        const content = contactsTemplate.content.cloneNode(true) as DocumentFragment;
        this.content.replaceChildren(content);

        this.emailInput = ensureElement<HTMLInputElement>('input[name="email"]', this.content);
        this.phoneInput = ensureElement<HTMLInputElement>('input[name="phone"]', this.content);
        this.submitButton = ensureElement<HTMLButtonElement>('button[type="submit"]', this.content);
        this.errors = ensureElement<HTMLElement>('.form__errors', this.content);

        if (ContactsFormView.savedData) {
            this.emailInput.value = ContactsFormView.savedData.email;
            this.phoneInput.value = ContactsFormView.savedData.phone;
        }

        this.validateForm();

        this.emailInput.addEventListener('input', () => {
            this.validateForm();
            this.saveData();
            this.events.emit('contacts:email', { value: this.emailInput.value });
        });

        this.phoneInput.addEventListener('input', () => {
            this.validateForm();
            this.saveData();
            this.events.emit('contacts:phone', { value: this.phoneInput.value });
        });

        this.submitButton.addEventListener('click', (e) => {
            e.preventDefault();
            if (this.validateForm()) {
                this.events.emit('contacts:submit', {

                    email: this.emailInput.value,
                    phone: this.phoneInput.value

                });
                ContactsFormView.savedData = null;
            }
        });

        if (state?.errors) {
            this.showErrors(state.errors);
        }

        return this.container;
    }

    private validateForm(): boolean {
        this.errors.innerHTML = '';
        const errors: string[] = [];

        // Валидация email
        if (!this.emailInput.value) {
            errors.push('Необходимо указать email');
        } else if (!this.validateEmail(this.emailInput.value)) {
            errors.push('Некорректный email');
        }

        // Валидация телефона
        if (!this.phoneInput.value) {
            errors.push('Необходимо указать телефон');
        } else if (!this.validatePhone(this.phoneInput.value)) {
            errors.push('Некорректный формат номера телефона');
        }

        if (errors.length) {
            this.showErrors(errors);
            this.submitButton.disabled = true;
            return false;
        }

        this.submitButton.disabled = false;
        return true;
    }

    private validateEmail(email: string): boolean {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }

    private validatePhone(phone: string): boolean {
        const digits = phone.replace(/\D/g, '');
        return digits.length === 11 || digits.length === 10;
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

    private saveData(): void {
        if (this.emailInput && this.phoneInput) {
            ContactsFormView.savedData = {
                email: this.emailInput.value,
                phone: this.phoneInput.value
            };

        }

    }

    close(): void {
        this.saveData();
        super.close();
    }

    getEmail(): string {
        return this.emailInput.value;
    }

    getPhone(): string {
        return this.phoneInput.value;
    }
}