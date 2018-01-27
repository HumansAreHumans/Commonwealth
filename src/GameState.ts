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

const Game = new GameState();
const tickRate = 0.016 * 1000;
// Add initial objects here

// Start game state
Game.Start();

let lastFrame = Date.now();

const updateLoop = () => {
    const thisFrame = Date.now();
    let dt = thisFrame - lastFrame;
    // Convert dt to seconds
    dt /= 1000;

    Game.Update(dt);
    
    lastFrame = thisFrame;
};

window.setInterval(updateLoop, tickRate);

