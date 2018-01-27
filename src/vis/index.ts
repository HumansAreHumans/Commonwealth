import * as vis from 'vis';

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
    portals: ['Foo', 'Krypton'],
    resources: []
  },
  Krypton: {
    portals: ['Poop', 'Bar'],
    resources: []
  },
  Poop: {
    portals: ['Krypton', 'Foo'],
    resources: []
  }
};

// create a network
const container = document.getElementById('networkgraph') as HTMLElement;

type ForEachFn = (value: any, key?: string) => void;
type ReduceFn = (result: any, value: any, key?: string) => any;
type MapFn = (value: any, key?: string) => any;

const forEach = (fn: ForEachFn) => (obj: any) =>
  Object.keys(obj).forEach(key => fn(obj[key], key));
const reduce = (fn: ReduceFn) => (defaultVal: any) => (obj: any) =>
  Object.keys(obj).reduce((val, key) => fn(val, obj[key], key), defaultVal);
const map = (fn: MapFn) => (obj: any) =>
  Object.keys(obj).map(key => fn(obj[key], key));

const getNodes = (planets: PlanetDict) =>
  new vis.DataSet(
    map((value, key) => ({
      id: key,
      label: key
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
