import GameObject from './GameObject';
import { GeneratePlanet } from './PlanetGenerator';

export default class GameState {
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

const Game = new GameState();
const tickRate = 0.016 * 1000;

// Add initial objects here
const planet1 = GeneratePlanet();
const planet2 = GeneratePlanet();
const planet3 = GeneratePlanet();
Game.Add(planet1);
Game.Add(planet2);
Game.Add(planet3);

planet1.AddGatewayToPlanet(planet2);

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
