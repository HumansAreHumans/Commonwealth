import * as m from 'mithril';
import { renderData, network } from '../vis';

const resources: any[] = [];

setInterval(() => {
  resources.push({
    start: 0,
    end: 1
  });
  resources.push({
    start: 1,
    end: 2
  });
  resources.push({
    start: 2,
    end: 3
  });
}, 1000);

const loop = () => {
  requestAnimationFrame(loop);
  m.redraw();
};

loop();

const drawResource = (resource: any, planets: any) => {
  const planet = !resource.started
    ? planets[resource.start]
    : planets[resource.end];

  if (!resource.started) {
    resource.started = true;
  }
  return m(
    '.resource',
    {
      style: {
        left: planet.x + 'px',
        top: planet.y + 'px'
      }
    },
    'R'
  );
};

m.mount(document.getElementById('ui') as Element, {
  view() {
    const planets = renderData();

    return m(
      'main',
      resources.map(resource => drawResource(resource, planets)),
      planets.map(planet =>
        m(
          'div.planet',
          {
            style: {
              left: planet.x + 'px',
              top: planet.y + 'px'
            }
          },
          m('div.planet-name', planet.name),
          m(
            '.portals',
            planet.portals.map(portal =>
              m('.portal', [
                m('img', {
                  src: '/img/ui/portal.gif'
                }),
                m('.portal-name', planets[portal].name)
              ])
            )
          )
        )
      )
    );
  }
});
