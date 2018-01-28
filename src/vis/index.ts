import * as vis from 'vis';
import { forEach, map } from './obj';
import { Game, Planet } from '../GameLogic';

// create a network
const container = document.getElementById('networkgraph') as HTMLElement;
const planetTexs = ['medium', 'small', 'large'];
const getRandomPlanet = () =>
  planetTexs[Math.round(Math.random() * (planetTexs.length - 1))];
const getPlanetTex = () => `/img/planets/${getRandomPlanet()}.png`;

const getNodes = (planets: Planet[]) =>
  new vis.DataSet(
    planets.map(planet => ({
      id: planet.id,
      label: '',
      image: getPlanetTex(),
      size: 15 + Math.random() * 20,
      shape: 'circularImage'
    }))
  );

const getEdges = (planets: Planet[]) => {
  const edges: any = [];

  planets.forEach(planet => {
    planet.gateways.forEach(gateway => {
      edges.push({
        from: planet.id,
        to: gateway.destinationPlanet.id
      });
    });
  });
  return new vis.DataSet(edges);
};

const getData = (data: Planet[]) => ({
  nodes: getNodes(data),
  edges: getEdges(data)
});

const options: vis.Options = {
  nodes: {
    color: {
      border: 'black',
      highlight: 'white'
    },
    font: {
      face: 'Press Start 2P',
      color: 'white',
      strokeColor: 'black',
      strokeWidth: 2
    }
  },
  edges: {
    smooth: false,
    length: 500,
    shadow: true,
    width: 5,
    color: {
      color: 'white'
    }
  },
  physics: {
    barnesHut: {
      avoidOverlap: 0.5,
      centralGravity: 0
    }
  }
};
// initialize your network!
export const network = new vis.Network(
  container,
  getData(Game.planets),
  options
);

// Shiz
const doResize = () =>
  network.setSize(window.innerWidth + 'px', window.innerHeight + 'px');
doResize();

// TODO: Figure out why resizing causes you to have to click to see graph
window.addEventListener('resize', () => doResize());
window.addEventListener('keypress', (ev: KeyboardEvent) => {
  // console.log(`[${ev.key}]`);
  if (ev.key === 'c') {
    network.clusterOutliers();
  }
});

export const renderData = (): Planet[] =>
  Game.planets.map(planet => {
    const pos = network.canvasToDOM(
      network.getPositions([planet.id])[planet.id]
    );
    const anyNet = network as any;

    planet.x = pos.x;
    planet.y = pos.y;

    return planet;
  });
