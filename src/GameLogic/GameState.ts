import GameObject from './GameObject';
import { Planet } from './Planet';
import { GeneratePlanet } from './PlanetGenerator';

export class GameState {
  private GameObjects: Planet[];
  private GameObjectById: { [key: number]: Planet };
  private hasStarted: boolean;

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
  }

  GetGameObjectById(id: number): Planet {
    return this.GameObjectById[id];
  }
}

export const Game = new GameState();
