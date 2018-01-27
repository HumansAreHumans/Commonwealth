import * as vis from 'vis';
import { forEach, map } from './obj';

interface Planet {
  id: number;
  name: string;
  portals: number[];
  resources: string[];
}
const Planets: Planet[] = [
  {
    name: 'Foo',
    id: 0,
    portals: [1, 2],
    resources: []
  },
  {
    name: 'Doop',
    id: 1,
    portals: [2],
    resources: []
  },
  {
    name: 'Loop',
    id: 2,
    portals: [3],
    resources: []
  },
  {
    name: 'Toop',
    id: 3,
    portals: [1],
    resources: []
  }
];

// create a network
const container = document.getElementById('networkgraph') as HTMLElement;

const getNodes = (planets: Planet[]) =>
  new vis.DataSet(
    planets.map(planet => ({
      id: planet.id,
      label: '',
      image: '/img/planet.png',
      shape: 'circularImage'
    }))
  );

const getEdges = (planets: Planet[]) => {
  const edges: any = [];

  planets.forEach(planet => {
    planet.portals.forEach(foreignPlanet => {
      edges.push({
        from: planet.id,
        to: foreignPlanet
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
    color: {
      color: 'black'
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
export const network = new vis.Network(container, getData(Planets), options);

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

interface PlanetRender extends Planet {
  x: number;
  y: number;
}

export const renderData = (): PlanetRender[] =>
  Planets.map(planet => {
    const pos = network.canvasToDOM(
      network.getPositions([planet.id])[planet.id]
    );
    const anyNet = network as any;

    return Object.assign(
      {
        x: pos.x,
        y: pos.y
      },
      planet
    );
  });
