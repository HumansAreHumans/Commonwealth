import * as vis from 'vis';
import { forEach, map } from './obj';

interface Planet {
  portals: string[];
  resources: string[];
}

type PlanetDict = { [key: string]: Planet };
const Planets: PlanetDict = {
  Foo: {
    portals: ['Bar', 'Poop'],
    resources: []
  },
  Bar: {
    portals: ['Krypton'],
    resources: []
  },
  Krypton: {
    portals: ['Poop', 'Foo'],
    resources: []
  },
  Poop: {
    portals: [],
    resources: []
  }
};

// create a network
const container = document.getElementById('networkgraph') as HTMLElement;

const getNodes = (planets: PlanetDict) =>
  new vis.DataSet(
    map((value, key) => ({
      id: key,
      label: key,
      image: '/img/planet.png',
      shape: 'circularImage'
    }))(planets)
  );

const getEdges = (planets: PlanetDict) => {
  const edges: any = [];
  forEach((planet: Planet, name: string) => {
    planet.portals.forEach(foreignPlanet => {
      edges.push({
        from: name,
        to: foreignPlanet
      });
    });
  })(planets);
  return new vis.DataSet(edges);
};

const getData = (data: PlanetDict) => ({
  nodes: getNodes(data),
  edges: getEdges(data)
});

const options = {};
// initialize your network!
const network = new vis.Network(container, getData(Planets), options);

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
