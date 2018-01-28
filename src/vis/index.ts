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
      color: 'gray',
      hover: 'white',
      highlight: 'white'
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
let networkData = getData(Game.planets);
export const network = new vis.Network(
  container,
  networkData,
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
    Game.GetGameObjectById(127).AddGatewayToPlanet(Game.GetGameObjectById(123));
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

// Bind to planet creation event
const BindEntityEvents = (entity: Planet) => {
    
    entity.On('gatewayCreated', (data: any) => {
        networkData.edges.add([{
            from: data.sourcePlanet.id,
            to: data.destinationPlanet.id
        }]);
    });

    console.log('added probe create event');
    entity.On('probeCreated', (data: any) => {
        console.log('got probe created event');
        networkData.edges.add([{
            from: data.sourcePlanet.id,
            to: data.destinationPlanet.id
        }]);
    });

    entity.On('probeDestroyed', (data: any) => {
        let probeId: vis.IdType = -1;
        networkData.edges.forEach((item: any, id) => {
            if (item.from === data.sourcePlanet.id
            && item.to === data.destinationPlanet.id) {
                probeId = id;
            }
        });
        
        if (probeId !== -1) {
            networkData.edges.remove({id: probeId} as any);
        }
    });
};

Game.onEntityAdded((entity: Planet) => {
    networkData.nodes.add([{
        id: entity.id,
        label: '',
        image: '/img/planet.png',
        shape: 'circularImage'
    }]);

    BindEntityEvents(entity);
});

Game.onEntityRemoved((entity: Planet) => {
    networkData.nodes.remove({id: entity.id} as any);
});

Game.planets.forEach(planet => BindEntityEvents(planet));