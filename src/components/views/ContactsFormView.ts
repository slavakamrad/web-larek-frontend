// // Форма контактов
// export class ContactsFormView extends Modal<IFormState> implements IContactsFormView {
//   protected _emailInput: HTMLInputElement;
//   protected _phoneInput: HTMLInputElement;
//   protected _submitButton: HTMLButtonElement;
//   protected _errors: HTMLElement;
//   public email: string = '';
//   public phone: string = '';

//   constructor(container: HTMLElement, events: IEvents) {
//     super(container, events);
//     this._emailInput = ensureElement<HTMLInputElement>('input[name="email"]', this.content);
//     this._phoneInput = ensureElement<HTMLInputElement>('input[name="phone"]', this.content);
//     this._submitButton = ensureElement<HTMLButtonElement>('.button', this.content);
//     this._errors = ensureElement<HTMLElement>('.form__errors', this.content);

//     this._emailInput.addEventListener('input', () => {
//       this.email = this._emailInput.value;
//       this.events.emit('contacts.email:change', this.email);
//     });

//     this._phoneInput.addEventListener('input', () => {
//       this.phone = this._phoneInput.value;
//       this.events.emit('contacts.phone:change', this.phone);
//     });
//   }

//   render(data?: Partial<IFormState>): HTMLElement {
//     if (!data) return this.container;
    
//     this._errors.innerHTML = '';
//     if (!data.valid && data.errors) {
//       data.errors.forEach(error => {
//         const errorElement = document.createElement('p');
//         errorElement.className = 'form__error';
//         errorElement.textContent = error;
//         this._errors.appendChild(errorElement);
//       });
//     }
    
//     this.setDisabled(this._submitButton, !data.valid);
//     return this.container;
//   }

//   onSubmit(callback: () => void): void {
//     this._submitButton.addEventListener('click', (evt) => {
//       evt.preventDefault();
//       callback();
//     });
//   }
// }