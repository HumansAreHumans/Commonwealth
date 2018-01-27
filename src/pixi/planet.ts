import * as PIXI from 'pixi.js';
import Loader from './loader';
import { app } from './app';
import { renderData, network, Planet } from '../vis';
import * as TWEEN from '@tweenjs/tween.js';

Loader.load((loader: any, resources: any) => {
  console.log(resources.planet);
  const sprites: { [key: string]: PIXI.Container } = {};

  const createFrame = (planet: Planet) => {
    const container = new PIXI.Container();
  };

  const createPlanet = (planet: Planet) => {
    const container = new PIXI.Container();
    const sprite = new PIXI.Sprite(resources.planet.textures[0]);
    sprite.anchor.set(0.5);
    sprite.position.set(30, 220);
    sprite.scale.set(3);

    const text = new PIXI.Text(planet.name, {
      fontFamily: 'Press Start 2P',
      fontSize: '15px'
    });

    text.position.set(-95, -75);
    container.addChild(sprite);
    container.addChild(text);

    return container;
  };

  app.ticker.add(dt => {
    const planets = renderData();
    planets.forEach(planet => {
      if (!sprites[planet.name]) {
        sprites[planet.name] = createPlanet(planet);
        app.stage.addChild(sprites[planet.name]);
      }
      sprites[planet.name].position.set(planet.x, planet.y);
    });
  });
});
