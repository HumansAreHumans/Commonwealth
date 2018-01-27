import * as PIXI from 'pixi.js';
import Loader from './loader';
import { app } from './app';
import { renderData, network } from '../vis';
import * as TWEEN from '@tweenjs/tween.js';

Loader.load((loader: any, resources: any) => {
  const createResource = (start: number, end: number) => {
    const planets = renderData();
    const startPlanet = planets[start];
    const endPlanet = planets[end];
    const resource = new PIXI.Sprite(resources.resource.texture);
    resource.position.set(startPlanet.x, startPlanet.y);
    resource.anchor.set(0.5);
    app.stage.addChild(resource);
    const tween = new TWEEN.Tween(resource.position)
      .to({ x: endPlanet.x, y: endPlanet.y }, 5000)
      .easing(TWEEN.Easing.Linear.None)
      .onComplete(() => {
        resource.destroy();
      })
      .start();
  };

  setInterval(() => {
    createResource(0, 1);
    createResource(1, 2);
    createResource(2, 3);
  }, 1000);
});
