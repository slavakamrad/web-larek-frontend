import { Component } from '../base/component';
import { IEvents } from '../base/events';
import { ensureElement } from '../../utils/utils';

export class MainPage extends Component<{}> {
	protected _basketCounter: HTMLElement;
	protected _basketIcon: HTMLElement;
	protected _wrapper: HTMLElement;

	constructor(container: HTMLElement, protected events: IEvents) {
		super(container);

		this._basketIcon = ensureElement<HTMLElement>('.header__basket', container);
		this._basketCounter = ensureElement<HTMLElement>('.header__basket-counter', this._basketIcon);
		this._wrapper = ensureElement<HTMLElement>('.page__wrapper');

		this._basketIcon.addEventListener('click', () => {
			events.emit('basket:open');
		});
	}

	set counter(value: number) {
		this.setText(this._basketCounter, String(value));
	}

	set locked(value: boolean) {
		if (value) {
				this._wrapper.classList.add('page__wrapper_locked');
		} else {
				this._wrapper.classList.remove('page__wrapper_locked');
		}
}
}