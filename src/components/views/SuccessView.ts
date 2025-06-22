import { ISuccessView } from "../../types/views";
import { successTemplate } from "../../utils/templates";
import { ensureElement } from "../../utils/utils";
import { IEvents } from "../base/events";
import { AppModal } from "./Popup";

export class SuccessView extends AppModal implements ISuccessView {
  total: number; 

  constructor(container: HTMLElement, events: IEvents) {
      super(container, events);

  }

  render(data: {total: number }) {
    const content = successTemplate.content.cloneNode(
      true
    ) as DocumentFragment;
    this.content.replaceChildren(content);

    this.total = data.total
  
    const closeButton = ensureElement('.order-success__close', this.content);

    this.setText(ensureElement('.order-success__description', this.content), `Списано ${this.total} синапсов`)

    closeButton.addEventListener('click', () => {
      this.close();
      this.events.emit('order:reset');
    })
      
      return this.container;
  }
}