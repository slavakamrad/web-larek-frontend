// // Форма заказа
// export class OrderFormView extends Modal<IFormState> implements IOrderFormView {
//   protected _paymentButtons: HTMLButtonElement[];
//   protected _addressInput: HTMLInputElement;
//   protected _submitButton: HTMLButtonElement;
//   protected _errors: HTMLElement;
//   public method: PaymentMethod = 'card';
//   public address: string = '';

//   constructor(container: HTMLElement, events: IEvents) {
//     super(container, events);
//     this._paymentButtons = Array.from(this.content.querySelectorAll('.order__buttons button'));
//     this._addressInput = ensureElement<HTMLInputElement>('input[name="address"]', this.content);
//     this._submitButton = ensureElement<HTMLButtonElement>('.order__button', this.content);
//     this._errors = ensureElement<HTMLElement>('.form__errors', this.content);

//     this._paymentButtons.forEach(button => {
//       button.addEventListener('click', () => {
//         this.method = button.name as PaymentMethod;
//         this._paymentButtons.forEach(btn => 
//           btn.classList.toggle('button_alt-active', btn === button)
//         );
//         this.events.emit('order.payment:change', this.method);
//       });
//     });

//     this._addressInput.addEventListener('input', () => {
//       this.address = this._addressInput.value;
//       this.events.emit('order.address:change', this.address);
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
