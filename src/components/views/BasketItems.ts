import { Component } from '../base/component';
import { IProduct } from '../../types/data';
import { IEvents } from '../base/events';
import { ensureElement } from '../../utils/utils';

interface IBasketItem {
    product: IProduct;
    index: number;
}

export class BasketItem extends Component<IBasketItem> {
    protected indexElement: HTMLElement;
    protected titleElement: HTMLElement;
    protected priceElement: HTMLElement;
    protected deleteButton: HTMLButtonElement;

    constructor(
        container: HTMLElement, 
        protected events: IEvents, 
        protected id: string
    ) {
        super(container);
        
        this.indexElement = ensureElement('.basket__item-index', container);
        this.titleElement = ensureElement('.card__title', container);
        this.priceElement = ensureElement('.card__price', container);
        this.deleteButton = ensureElement<HTMLButtonElement>('.basket__item-delete', container);

        this.deleteButton.addEventListener('click', () => {
            events.emit('basket:remove', { id: this.id });
        });
    }

    render(data: IBasketItem): HTMLElement {
        super.render(data);
        this.setText(this.indexElement, data.index);
        this.setText(this.titleElement, data.product.title);
        this.setText(this.priceElement, `${data.product.price} синапсов`);
        return this.container;
    }
}