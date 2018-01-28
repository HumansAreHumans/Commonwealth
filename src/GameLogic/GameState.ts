import GameObject from './GameObject';
import { GeneratePlanet } from './PlanetGenerator';

type AddedHandler = (entity: GameObject) => void;

export class GameState {
    private GameObjects: Array<GameObject>;
    private GameObjectById: {[key: number]: GameObject};
    private hasStarted: boolean;
    private addedHandlers: AddedHandler[];

    constructor() {
        this.GameObjectById = {};
        this.GameObjects = new Array<GameObject>();
        this.hasStarted = false;
        this.addedHandlers = [];
    }

    Start() {
        this.GameObjects.forEach(go => {
            go.Start();
        });
        this.hasStarted = true;
    }

    Update(dt: number) {
        this.GameObjects.forEach(go => {
            go.Update(dt);
        });
    }

    Stop() {
        this.GameObjects.forEach(go => {
            go.Stop();
        });
    }

    Add(go: GameObject) {
        this.GameObjects.push(go);
        this.GameObjectById[go.id] = go;

        if (this.hasStarted) {
            go.Start();
        }

        this.addedHandlers.forEach(handler => {
            handler(go);
        });
    }

    GetGameObjectById(id: number): GameObject {
        return this.GameObjectById[id];
    }

    onEntityAdded(handler: (entity: GameObject) => void) {
        this.addedHandlers.push(handler);
    }
}

export const Game = new GameState();
