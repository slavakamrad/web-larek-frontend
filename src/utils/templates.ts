import { ensureElement } from './utils';

export const cardCatalogTemplate =
	ensureElement<HTMLTemplateElement>('#card-catalog');

export const cardPreviewTemplate =
	ensureElement<HTMLTemplateElement>('#card-preview');

export const cardBasketTemplate =
	ensureElement<HTMLTemplateElement>('#card-basket');

export const basketTemplate = ensureElement<HTMLTemplateElement>('#basket');

export const contactsTemplate = ensureElement<HTMLTemplateElement>('#contacts');

export const modalElement = ensureElement<HTMLElement>('#modal-container');

export const successTemplate = ensureElement<HTMLTemplateElement>('#success');

export const orderTemplate = ensureElement<HTMLTemplateElement>('#order');

export const basketItemsTemplate =
	ensureElement<HTMLTemplateElement>('#card-basket');
