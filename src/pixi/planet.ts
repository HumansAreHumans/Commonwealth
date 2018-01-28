import * as PIXI from 'pixi.js';
import Loader from './loader';
import { app } from './app';
import { renderData, network } from '../vis';
import { Planet, GeneratePlanet, Game, materialNames } from '../GameLogic';

import * as TWEEN from '@tweenjs/tween.js';

const getFrameInfo = (aseAnimation: any, frameName: string) =>
  aseAnimation.meta.data.frames.find(frame => frame.name === frameName);

const getFrames = (aseAnimation: any, frameName: string) => {
  const frame = getFrameInfo(aseAnimation, frameName);
};

Loader.load((loader: any, resources: any) => {
  console.log(resources.planet);

  const sprites: { [key: string]: PIXI.Container } = {};
  const sheet = resources.planet.spritesheet.textures;

  const makeButton = (id: number, onClick: () => void) => {
    const button = new PIXI.Sprite(sheet[id]);
    button.interactive = true;
    if (button.texture.trim) {
      button.hitArea = button.texture.trim;
    }
    button.on('mouseover', () => {
      document.body.style.cursor = 'pointer';
      button.texture = sheet[id + 1];
    });
    button.on('mouseout', () => {
      document.body.style.cursor = '';
      button.texture = sheet[id];
    });
    button.on('mousedown', () => {
      button.texture = sheet[id + 2];
      onClick();
    });
    button.on('mouseup', () => (button.texture = sheet[id]));

    return button;
  };
  const makeAnimation = (textures: any, idx, count) => {
    const frames: any[] = [];
    for (let i = 0; i < count; i++) {
      frames.push(textures[idx + i]);
    }
    const anim = new PIXI.extras.AnimatedSprite(frames);
    anim.animationSpeed = 0.05;
    anim.play();
    return anim;
  };

  const createFrame = (planet: Planet) => {
    const materialIdx = 7;
    const container = new PIXI.Container();
    const namePlate = new PIXI.Sprite(sheet[4]);
    const bg = new PIXI.Sprite(sheet[16]);
    const portalNew = makeButton(13, () => {
      const fplanet = GeneratePlanet();
      Game.Add(fplanet);
      planet.ProbePlanet(fplanet);
    });

    materialNames.forEach((material, i) => {
      const gemY = [1, 19, 9];
      if (!planet.stats.materialsGenerated[material]) return;
      const matSprite = new PIXI.Sprite(sheet[materialIdx + i]);
      const gemSprite = makeAnimation(resources.gems.textures, 2 + i * 5, 3);
      gemSprite.position.set(g, gemY[i]);
      container.addChild(matSprite);
      container.addChild(gemSprite);
    });

    container.scale.set(3);
    container.position.set(-100, -100);
    container.addChild(bg);
    container.addChild(namePlate);
    container.addChild(portalNew);
    return container;
  };

  const createPlanet = (planet: Planet) => {
    const container = new PIXI.Container();
    const text = new PIXI.Text(planet.stats.name, {
      fontFamily: 'Press Start 2P',
      fontSize: '10px'
    });

    text.position.set(-35, -65);
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
