import * as React from 'react';
import * as ReactDOM from 'react-dom';
import GameState from './GameState';
import App from './App';
import registerServiceWorker from './registerServiceWorker';
import './index.css';
import './vis';

ReactDOM.render(<App />, document.getElementById('root') as HTMLElement);
registerServiceWorker();

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
