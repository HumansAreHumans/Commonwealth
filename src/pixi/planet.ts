import * as PIXI from 'pixi.js';
import Loader from './loader';
import { app } from './app';
import { renderData, network } from '../vis';
import * as TWEEN from '@tweenjs/tween.js';

Loader.load((loader: any, resources: any) => {
  const cat = new PIXI.Sprite(resources.frame.texture);
  const sprites: { [key: string]: PIXI.Sprite } = {};

  app.ticker.add(dt => {
    const planets = renderData();
    planets.forEach(planet => {
      if (!sprites[planet.name]) {
        sprites[planet.name] = new PIXI.Sprite(resources.frame.texture);
        app.stage.addChild(sprites[planet.name]);
      }
      sprites[planet.name].position.set(planet.x, planet.y);
    });
  });
});
