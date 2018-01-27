import { GeneratePlanet } from './PlanetGenerator';
import { Game } from './GameState';

const tickRate = 0.016 * 1000;

// Add initial objects here
const planet1 = GeneratePlanet('player');
const planet2 = GeneratePlanet('player');
const planet3 = GeneratePlanet('player');
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
