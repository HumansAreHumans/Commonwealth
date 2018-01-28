import { GeneratePlanet } from './PlanetGenerator';
import { Game } from './GameState';
export { Planet } from './Planet';
export { GeneratePlanet } from './PlanetGenerator';
export { Game } from './GameState';
// Add initial objects here
const planets = [
  GeneratePlanet('player'),
  GeneratePlanet('player'),
  GeneratePlanet('player'),
  GeneratePlanet('player')
];
planets.forEach(planet => Game.Add(planet));

planets.forEach((planet, i) => {
  const target = planets[i === planets.length - 1 ? 0 : ++i];
  planet.AddGatewayToPlanet(target);
});

Game.Start();

let lastFrame = performance.now();

const updateLoop = () => {
  requestAnimationFrame(updateLoop);
  const thisFrame = performance.now();
  let dt = thisFrame - lastFrame;
  // Convert dt to seconds
  dt /= 1000;

  Game.Update(dt);
  lastFrame = thisFrame;
};

updateLoop();
