import { IOrder } from '../../types/data';
import { ISuccessView } from '../../types/views';
import { ensureElement } from '../../utils/utils';
import { Component } from '../base/component';
import { IEvents } from '../base/events';

export class SuccessView extends Component<IOrder> implements ISuccessView {
	description: HTMLElement;
	closeButton: HTMLButtonElement;
	total: number;

	constructor(container: HTMLElement, protected events: IEvents) {
		super(container);
		this.description = ensureElement<HTMLElement>(
			'.order-success__description',
			container
		);
		this.closeButton = ensureElement<HTMLButtonElement>(
			'.order-success__close',
			container
		);
		this.closeButton.addEventListener('click', () => {
			this.events.emit('success:close');
		});
	}
	render(data: { total: number }): HTMLElement {
		this.setText(this.description, `Списано ${data.total} синапсов`);
		return this.container;
	}
}
