import { GeneratePlanet } from './PlanetGenerator';
import { Game } from './GameState';
export { Planet, materialNames, combatUnitNames } from './Planet';
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

// Initial planet generation
for (let i = 0; i < 20; ++i) {
    let owner = '';

    // Select an owner
    const ownerChance = Math.random();
    if (ownerChance < 0.1) owner = 'factionOne';
    else if (ownerChance < 0.2) owner = 'factionTwo';

    const newPlanet = GeneratePlanet(owner);
    Game.Add(newPlanet);
}

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
