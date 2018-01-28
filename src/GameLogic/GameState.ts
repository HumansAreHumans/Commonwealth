import GameObject from './GameObject';
import { Planet } from './Planet';
import { GeneratePlanet } from './PlanetGenerator';

type AddedHandler = (entity: GameObject) => void;

export class GameState {
  private GameObjects: Planet[];
  private GameObjectById: { [key: number]: Planet };
  private hasStarted: boolean;
  private addedHandlers: AddedHandler[];

  get planets() {
    return this.GameObjects;
  }

  constructor() {
    this.GameObjectById = {};
    this.GameObjects = [];
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

  Add(go: Planet) {
    this.GameObjects.push(go);
    this.GameObjectById[go.id] = go;

    if (this.hasStarted) {
      go.Start();
    }

    this.addedHandlers.forEach(handler => {
      handler(go);
    });
  }

  GetGameObjectById(id: number): Planet {
    return this.GameObjectById[id];
  }

  onEntityAdded(handler: (entity: Planet) => void) {
    this.addedHandlers.push(handler);
  }
}

export const Game = new GameState();
