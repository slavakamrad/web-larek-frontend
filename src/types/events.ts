//Event Emitter
export interface IEventEmitter {
	emit: (event: string, data: unknown) => void;
	on(event: string, callback: Function): void;
	off(event: string, callback: Function): void;
}
