type EventCallBack = (...arg: any[]) => void;

class EventEmitter {
    private events: Map<string, EventCallBack[]> = new Map();

    on(event: string, callback: EventCallBack) {
        if (!this.events.has(event)) {
            this.events.set(event, [])
        }
        this.events.get(event)!.push(callback);
    }

    off(event: string, callback: EventCallBack) {
        if (!this.events.has(event)) return;
        const callbacks = this.events.get(event)!;
        this.events.set(event, callbacks.filter(cb => cb !== callback))
    }

    emit(event: string, ...args: any[]) {
        if (!this.events.get(event)) return;
        this.events.get(event)!.forEach(callback => callback(...args))
    }
}

export const workoutEvents = new EventEmitter();
export const WORKOUT_EVENTS = {
    WORKOUT_CREATED: 'workout:created',
    WORKOUT_DELETED: 'workout:deleted',
    WORKOUT_UPDATED: 'workout:updated',
} as const;