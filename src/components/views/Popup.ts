import { IProduct } from '../../types/data';
import { IBasketView, IPopup } from '../../types/views';
import { ensureElement } from '../../utils/utils';
import { Component } from '../base/component';
import { IEvents } from '../base/events';

interface IPopupData extends IProduct, IBasketView {
	content: HTMLElement;
}

export class AppModal extends Component<IPopupData> implements IPopup {
	_closeButton: HTMLButtonElement;
	content: HTMLElement;

	constructor(container: HTMLElement, protected events: IEvents) {
		super(container);

		this._closeButton = document.querySelector('.modal__close');

		this.content = document.querySelector('.modal__content');

		this._closeButton.addEventListener('click', this.close.bind(this));
		this.container.addEventListener('click', this.close.bind(this));
		this.content.addEventListener('click', (evt) => evt.stopPropagation());
	}

	get closeButton(): HTMLButtonElement {
		return this._closeButton;
	}

	// set content(content: HTMLElement) {
	// 	this._content.replaceChildren(content);
	// }

	open(): void {
		this.container.classList.add('modal_active');
		this.events.emit('modal:open');
	}

	close(): void {
		this.container.classList.remove('modal_active');
		this.content.innerHTML = '';
		this.events.emit('modal:close');
	}

	handleESC(evt: KeyboardEvent): void {
		if (evt.key === 'Escape') {
			this.close();
		}
	}

	render(data: IPopupData): HTMLElement {
		super.render(data);
		this.open();
		return this.container;
	}
}
