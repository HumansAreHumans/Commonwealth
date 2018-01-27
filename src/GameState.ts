import GameObject from './GameObject';

export default class GameState {
    private GameObjects: Array<GameObject>;
    private GameObjectById: {[key: number]: GameObject};

    constructor() {
        this.GameObjectById = {};
        this.GameObjects = new Array<GameObject>();
    }

    Start() {
        this.GameObjects.forEach(go => {
            go.Start();
        });
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
    }

    GetGameObjectById(id: number): GameObject {
        return this.GameObjectById[id];
    }
}
