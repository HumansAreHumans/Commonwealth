import * as PIXI from 'pixi.js';
import Loader from './loader';
import { app } from './app';
import { renderData, network } from '../vis';
import { Planet, GeneratePlanet, Game } from '../GameLogic';

import * as TWEEN from '@tweenjs/tween.js';

const getLayer = (layerName: string, frames: any) =>
  frames.textures[
    frames.data.meta.layers.findIndex((layer: any) => layer.name === layerName)
  ];

Loader.load((loader: any, resources: any) => {
  console.log(resources.planet);

  const sprites: { [key: string]: PIXI.Container } = {};

  const createFrame = (planet: Planet) => {
    const container = new PIXI.Container();
    const sprite = new PIXI.Sprite(resources.planet.textures[4]);
    const portalNew = new PIXI.Sprite(resources.planet.textures[13]);
    portalNew.interactive = true;

    portalNew.on('mouseover', () => {
      portalNew.texture = resources.planet.textures[14];
    });
    portalNew.on('mouseout', () => {
      portalNew.texture = resources.planet.textures[13];
    });

    portalNew.on('click', () => {
      const fplanet = GeneratePlanet();
      Game.Add(fplanet);
      planet.ProbePlanet(fplanet);
    });

    container.scale.set(3);
    container.position.set(-250, -30);
    container.addChild(sprite);
    container.addChild(portalNew);
    return container;
  };

  const createPlanet = (planet: Planet) => {
    const container = new PIXI.Container();
    const text = new PIXI.Text(planet.stats.name, {
      fontFamily: 'Press Start 2P',
      fontSize: '10px'
    });

    text.position.set(10, 60);
    container.addChild(createFrame(planet));
    container.addChild(text);
    return container;
  };

  app.ticker.add(dt => {
    const planets = renderData();
    planets.forEach(planet => {
      if (!sprites[planet.id]) {
        sprites[planet.id] = createPlanet(planet);
        app.stage.addChild(sprites[planet.id]);
      }
      sprites[planet.id].position.set(planet.x, planet.y);
    });
  });
});
