
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
        console.log('added ' + eventName + ' to ' + JSON.stringify(this.eventHandlers));
    }

    // Send events
    Send(eventName: string, data: any) {
        console.log('send event ' + eventName + ' at ' + JSON.stringify(this.eventHandlers));
        const handlers = this.eventHandlers[eventName];
        console.log('handle event ' + eventName + ' found ' + handlers );
        if (handlers !== undefined) {
            console.log('found event handlers for event ' + eventName);
            handlers.forEach(handler => handler(data));
        }
    }
}