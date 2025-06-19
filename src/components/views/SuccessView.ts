// // Успешный заказ
// export class SuccessView extends Modal<number> implements ISuccessView {
//   protected _total: HTMLElement;
//   protected _closeButton: HTMLButtonElement;
//   public total: number = 0;

//   constructor(container: HTMLElement, events: IEvents) {
//     super(container, events);
//     this._total = ensureElement<HTMLElement>('.order-success__description', this.content);
//     this._closeButton = ensureElement<HTMLButtonElement>('.order-success__close', this.content);
    
//     this._closeButton.addEventListener('click', () => this.close());
//   }

//   render(data?: Partial<number>): HTMLElement {
//     if (data !== undefined) {
//       this.total = data;
//       this.setText(this._total, `Списано ${this.total} синапсов`);
//     }
//     return this.container;
//   }

//   setTotal(total: number): void {
//     this.total = total;
//     this.render(total);
//   }
// }