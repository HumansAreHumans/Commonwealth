import GameObject from './GameObject';
import { Planet } from './Planet';
import { GeneratePlanet } from './PlanetGenerator';

type LifetimeEventHandler = (entity: GameObject) => void;

export class GameState {
  private GameObjects: Planet[];
  private GameObjectById: { [key: number]: Planet };
  private hasStarted: boolean;
  private addedHandlers: LifetimeEventHandler[];
  private removedHandlers: LifetimeEventHandler[];

  get planets() {
    return this.GameObjects;
  }

  constructor() {
    this.GameObjectById = {};
    this.GameObjects = [];
    this.hasStarted = false;
    this.addedHandlers = [];
    this.removedHandlers = [];
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

  Remove(go: Planet) {
      const ind = this.GameObjects.findIndex((value: Planet, index: number, obj: Planet[]) => {
        return value.id === go.id;
      });

      console.log(ind);
      if (ind !== -1) {
        console.log('splicing game object array');
        this.GameObjects.splice(ind, 1);
        delete this.GameObjectById[go.id];

        console.log('sending removed handler functions');
        this.removedHandlers.forEach(handler => {
            handler(go);
            console.log('called a removed handler');
        });
      }
  }

  GetGameObjectById(id: number): Planet {
    return this.GameObjectById[id];
  }

  onEntityAdded(handler: (entity: Planet) => void) {
    this.addedHandlers.push(handler);
  }

  onEntityRemoved(handler: (entity: Planet) => void) {
      console.log('added a removed handler');
      this.removedHandlers.push(handler);
  }
}

export const Game = new GameState();
