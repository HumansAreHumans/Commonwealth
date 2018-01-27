import * as React from 'react';
import * as ReactDOM from 'react-dom';
import * as vis from 'vis';
import GameState from './GameState';
import App from './App';
import registerServiceWorker from './registerServiceWorker';
import './index.css';

ReactDOM.render(<App />, document.getElementById('root') as HTMLElement);

// create an array with nodes
var nodes = new vis.DataSet([
  { id: 1, label: 'Node 1' },
  { id: 2, label: 'Node 2' },
  { id: 3, label: 'Node 3' },
  { id: 4, label: 'Node 4' },
  { id: 5, label: 'Node 5' }
]);

// create an array with edges
var edges = new vis.DataSet([
  { from: 1, to: 3 },
  { from: 1, to: 2 },
  { from: 2, to: 4 },
  { from: 2, to: 5 }
]);

// create a network
var container = document.getElementById('networkgraph') as HTMLElement;

// provide the data in the vis format
var data = {
  nodes: nodes,
  edges: edges
};
var options = {};

// initialize your network!
var network = new vis.Network(container, data, options);
document.addEventListener('keypress', (ev: KeyboardEvent) => {
  // console.log(`[${ev.key}]`);
  if (ev.key === 'c') {
    network.clusterOutliers();
  }
});
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
