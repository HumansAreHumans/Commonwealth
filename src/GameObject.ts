
type HandlerFunction = (data: any) => void;

let nextId = 123;

export default abstract class GameObject {
    readonly id: number;
    private eventHandlers: {[key: string]: Array<HandlerFunction>};

    constructor() {
        this.id = nextId;
        nextId += 1; 
        this.eventHandlers = {};
    }

    abstract Start(): void;
    abstract Update(dt: number): void;
    abstract Stop(): void;
    
    // Subscribe to events
    On(eventName: string, handler: HandlerFunction): void {
        if (this.eventHandlers[eventName] === undefined) {
            this.eventHandlers[eventName] = new Array<HandlerFunction>();
        }

        this.eventHandlers[eventName].push(handler);
    }

    // Send events
    Send(eventName: string, data: any) {
        const handlers = this.eventHandlers[eventName];
        if (handlers !== undefined) {
            handlers.forEach(handler => handler(data));
        }
    }
}