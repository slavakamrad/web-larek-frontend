import { Component } from '../base/component';
import { IEvents } from '../base/events';
import { ensureElement } from '../../utils/utils';

export class MainPage extends Component<{}> {
	basketCounter: HTMLElement;
	basketIcon: HTMLElement;
	wrapper: HTMLElement;

	constructor(container: HTMLElement, protected events: IEvents) {
		super(container);

		this.basketIcon = ensureElement<HTMLElement>('.header__basket', container);
		this.basketCounter = ensureElement<HTMLElement>('.header__basket-counter', this.basketIcon);
		this.wrapper = ensureElement<HTMLElement>('.page__wrapper');

		this.basketIcon.addEventListener('click', () => {
			events.emit('basket:open');
		});
	}

	set counter(value: number) {
		this.setText(this.basketCounter, String(value));
	}

	set locked(value: boolean) {
		if (value) {
				this.wrapper.classList.add('page__wrapper_locked');
		} else {
				this.wrapper.classList.remove('page__wrapper_locked');
		}
}
}