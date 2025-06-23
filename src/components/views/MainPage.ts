import { Component } from '../base/component';
import { IEvents } from '../base/events';
import { ensureElement } from '../../utils/utils';

export class MainPage extends Component<{}> {
	protected _basketCounter: HTMLElement;
	protected _basketIcon: HTMLElement;

	constructor(container: HTMLElement, protected events: IEvents) {
		super(container);

		this._basketIcon = ensureElement<HTMLElement>('.header__basket', container);
		this._basketCounter = ensureElement<HTMLElement>('.header__basket-counter', this._basketIcon);

		this._basketIcon.addEventListener('click', () => {
			events.emit('basket:open');
		});
	}

	set counter(value: number) {
		this.setText(this._basketCounter, String(value));
	}
}