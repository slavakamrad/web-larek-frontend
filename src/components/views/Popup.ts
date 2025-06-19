import { IPopup } from "../../types/views";
import { ensureElement } from "../../utils/utils";
import { Component } from "../base/component";
import { IEvents } from "../base/events";

// Базовый класс для модальных окон
export abstract class Modal<T> extends Component<T> implements IPopup{
  closeButton: HTMLButtonElement;
  content: HTMLElement;

  constructor(container: HTMLElement, protected events: IEvents) {
    super(container);
    this.content = ensureElement<HTMLElement>('.modal__content', this.container);
    this.closeButton = ensureElement<HTMLButtonElement>('.modal__close', this.container);
    
    
    this.closeButton.addEventListener('click', this.close.bind(this));
    this.container.addEventListener('click', this.handleOverlayClick.bind(this));
  }

  open(): void {
    this.container.classList.add('modal_active');
    document.addEventListener('keydown', this.handleESC.bind(this));
    this.events.emit('modal:open');
  }

  close(): void {
    this.container.classList.remove('modal_active');
    document.removeEventListener('keydown', this.handleESC.bind(this));
    this.events.emit('modal:close');
  }

  handleESC(evt: KeyboardEvent) {
    if (evt.key === 'Escape') this.close();
  }

  handleOverlayClick(evt: MouseEvent) {
    if (evt.target === this.container) this.close();
  }
}
