// import { IProduct } from "../../types/data";
// import { IBasketView } from "../../types/views";
// import { ensureElement } from "../../utils/utils";
// import { IEvents } from "../base/events";
// import { AppModal } from "./Popup";

// // Корзина
// export class BasketView extends AppModal implements IBasketView {
//   protected _list: HTMLElement;
//   protected _total: HTMLElement;
//   protected _button: HTMLButtonElement;

//   constructor(container: HTMLElement, events: IEvents) {
//     super(container, events);
//     this._list = ensureElement<HTMLElement>('.basket__list', this.content);
//     this._total = ensureElement<HTMLElement>('.basket__price', this.content);
//     this._button = ensureElement<HTMLButtonElement>('.basket__button', this.content);
//   }
//   deleteItem(handler: (id: string) => void): void {
//     throw new Error("Method not implemented.");
//   }
//   update(items: Map<string, { product: IProduct; count: number; }>): void {
//     throw new Error("Method not implemented.");
//   }
//   handleESC(evt: KeyboardEvent): void {
//     throw new Error("Method not implemented.");
//   }

//   render(data?: Partial<Map<string, { product: IProduct, count: number }>>): HTMLElement {
//     if (!data) return this.container;
    
//     this._list.innerHTML = '';
//     let total = 0;
//     let index = 1;

//     data.forEach(({ product, count }, id) => {
//       const item = document.createElement('li');
//       item.className = 'basket__item card card_compact';
//       item.innerHTML = `
//         <span class="basket__item-index">${index++}</span>
//         <span class="card__title">${product.title}</span>
//         <span class="card__price">${product.price * count} синапсов</span>
//         <button class="basket__item-delete card__button" aria-label="удалить"></button>
//       `;
//       // item.querySelector('.basket__item-delete')?.addEventListener('click', () => {
//       //   this.events.emit('basket:remove', id);
//       // });
//       this._list.appendChild(item);
//       total += product.price * count;
//     });

//     this.setText(this._total, `${total} синапсов`);
//     this.setDisabled(this._button, data.size === 0);
    
//     return this.container;
//   }

//   // deleteItem(handler: (id: string) => void): void {
//   //   this.events.on('basket:remove', handler);
//   // }

//   // bindCheckout(handler: () => void): void {
//   //   this._button.addEventListener('click', handler);
//   // }
// }