import GameObject from './GameObject';
import { GeneratePlanet } from './PlanetGenerator';

export class GameState {
    private GameObjects: Array<GameObject>;
    private GameObjectById: {[key: number]: GameObject};
    private hasStarted: boolean;

    constructor() {
        this.GameObjectById = {};
        this.GameObjects = new Array<GameObject>();
        this.hasStarted = false;
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
    }

    GetGameObjectById(id: number): GameObject {
        return this.GameObjectById[id];
    }
}

export const Game = new GameState();
