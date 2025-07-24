// Хорошая практика даже простые типы выносить в алиасы
// Зато когда захотите поменять это достаточно сделать в одном месте
type EventName = string | RegExp;
type Subscriber = Function;
type EmitterEvent = {
    eventName: string,
    data: unknown
};

export interface IEvents {
    on<T extends object>(event: EventName, callback: (data: T) => void): void;
    emit<T extends object>(event: string, data?: T): void;
    trigger<T extends object>(event: string, context?: Partial<T>): (data: T) => void;
}

/**
 * Брокер событий, классическая реализация
 * В расширенных вариантах есть возможность подписаться на все события
 * или слушать события по шаблону например
 */

export class EventEmitter<Events extends Record<string, any> = Record<string, any>> {
	private _events = new Map<EventName, Set<Subscriber>>();

	/**
	 * Установить обработчик на событие
	 */
	on<K extends keyof Events>(eventName: K, callback: (event: Events[K]) => void) {
		if (!this._events.has(eventName as string)) {
			this._events.set(eventName as string, new Set());
		}
		this._events.get(eventName as string)!.add(callback as Subscriber);
	}

	/**
	 * Снять обработчик с события
	 */
	off<K extends keyof Events>(eventName: K, callback: (event: Events[K]) => void) {
		const subs = this._events.get(eventName as string);
		if (subs) {
			subs.delete(callback as Subscriber);
			if (subs.size === 0) {
				this._events.delete(eventName as string);
			}
		}
	}

	/**
	 * Инициировать событие с данными
	 */
	emit<K extends keyof Events>(eventName: K, data?: Events[K]) {
		for (const [name, subscribers] of this._events.entries()) {
			const match =
				name === '*' ||
				(typeof name === 'string' && name === eventName) ||
				(name instanceof RegExp && name.test(eventName as string));

			if (match) {
				subscribers.forEach((callback) => {
					callback(name === '*' ? { eventName, data } : data);
				});
			}
		}
	}

	/**
	 * Слушать все события
	 */
	onAll(callback: (event: EmitterEvent) => void) {
		this.on('*' as keyof Events, callback as unknown as (e: Events[keyof Events]) => void);
	}

	/**
	 * Сбросить все обработчики
	 */
	offAll() {
		this._events.clear();
	}

	/**
	 * Создать функцию-триггер
	 */
	trigger<K extends keyof Events>(eventName: K, context?: Partial<Events[K]>) {
		return (event: Partial<Events[K]> = {}) => {
			this.emit(eventName, {
				...event,
				...(context || {})
			} as Events[K]);
		};
	}
}


