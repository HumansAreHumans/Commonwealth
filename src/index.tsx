import * as m from 'mithril';

import registerServiceWorker from './registerServiceWorker';
import './index.css';
import { renderData, network } from './vis';

registerServiceWorker();

const loop = () => {
  requestAnimationFrame(loop);
  m.redraw();
};

loop();

m.mount(document.getElementById('ui') as Element, {
  view() {
    const planets = renderData();
    console.log(planets);
    return m(
      'main',
      planets.map(planet =>
        m(
          'div.planet',
          {
            style: {
              color: 'red',
              left: planet.x + 'px',
              top: planet.y + 'px'
            }
          },
          planet.name
        )
      )
    );
  }
});
