import * as PIXI from 'pixi.js';
import Loader from './loader';
import { app } from './app';
import { renderData, network } from '../vis';
import {
  Planet,
  GeneratePlanet,
  Game,
  materialNames,
  combatUnitNames as unitNames
} from '../GameLogic';

import * as TWEEN from '@tweenjs/tween.js';

const getFrameInfo = (aseAnimation: any, frameName: string) =>
  aseAnimation.meta.data.frames.find(frame => frame.name === frameName);

const getFrames = (aseAnimation: any, frameName: string) => {
  const frame = getFrameInfo(aseAnimation, frameName);
};

Loader.load((loader: any, resources: any) => {
  const sprites: { [key: string]: PIXI.Container } = {};
  const sheet = resources.planet.textures;

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

  const makeAnimation = (textures: any, idx, count, speed = 0.05) => {
    const frames: any[] = [];
    for (let i = 0; i < count; i++) {
      frames.push(textures[idx + i]);
    }
    const anim = new PIXI.extras.AnimatedSprite(frames);
    anim.animationSpeed = speed;
    anim.play();
    return anim;
  };

  const textStyle = {
    dropShadowColor: 'black',
    fill: 'red',
    fontSize: '10px'
  };

  const createResourceCounts = (planet: Planet) => {
    const container = new PIXI.Container();
    const unitCounts: PIXI.Text[] = [];

    let offset = 20;

    materialNames.forEach((material, i) => {
      const gemSprite = makeAnimation(resources.gems.textures, 2 + i * 5, 3);
      container.addChild(gemSprite);
      gemSprite.position.set(offset, 0);

      const texSprite = new PIXI.Text('0', textStyle);
      texSprite.position.set(offset + 10, -4);
      container.addChild(texSprite);
      unitCounts.push(texSprite);
      offset += 20;
    });

    const cylonSprite = makeAnimation(resources.gems.textures, 17, 7, 0.5);
    container.addChild(cylonSprite);
    cylonSprite.position.set(offset, 0);
    const tex1Sprite = new PIXI.Text('0', textStyle);
    tex1Sprite.position.set(offset + 10, -4);
    container.addChild(tex1Sprite);
    offset += 20;

    const somSprite = makeAnimation(resources.gems.textures, 27, 1);
    container.addChild(somSprite);
    somSprite.position.set(offset, 0);
    const tex2Sprite = new PIXI.Text('0', textStyle);
    tex2Sprite.position.set(offset + 10, -4);
    container.addChild(tex2Sprite);
    unitCounts.push(tex2Sprite);
    offset += 20;

    const aSprite = makeAnimation(resources.gems.textures, 30, 1);
    container.addChild(aSprite);
    aSprite.position.set(offset, 0);
    const tex3Sprite = new PIXI.Text('0', textStyle);
    tex3Sprite.position.set(offset + 10, -4);
    container.addChild(tex3Sprite);
    unitCounts.push(tex3Sprite);
    offset += 20;

    app.ticker.add(() => {
      unitCounts.forEach((e, i) => {
        if (i < 3) {
          console.log(planet.stationedMaterials[materialNames[i]]);
          e.text = planet.stationedMaterials[materialNames[i]];
        } else {
          e.text = planet.stationedCombatUnits[unitNames[i - 3]];
        }
      });
    });

    return container;
  };

  const createFrame = (planet: Planet) => {
    const materialIdx = 7;
    const container = new PIXI.Container();
    const namePlate = new PIXI.Sprite(sheet[4]);
    const bg = new PIXI.Sprite(sheet[16]);
    const portalNew = makeButton(13, () => {
      planet.ProbePlanet();
    });

    const resourceCounts = createResourceCounts(planet);

    materialNames.forEach((material, i) => {
      const gemY = [1, 19, 9];
      if (!planet.stats.materialsGenerated[material]) return;
      const matSprite = new PIXI.Sprite(sheet[materialIdx + i]);
      const gemSprite = makeAnimation(resources.gems.textures, 2 + i * 5, 3);
      gemSprite.position.set(2, gemY[i]);
      container.addChild(matSprite);
      container.addChild(gemSprite);
    });

    container.scale.set(3);
    container.position.set(-100, -100);
    container.addChild(bg);
    container.addChild(resourceCounts);
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
      if (planet === undefined) {
        return;
      }
      if (!sprites[planet.id]) {
        sprites[planet.id] = createPlanet(planet);
        app.stage.addChild(sprites[planet.id]);
      }
      sprites[planet.id].position.set(planet.x, planet.y);
    });
  });
  Game.onEntityRemoved((entitiy: Planet) => {
    app.stage.removeChild(sprites[entitiy.id]);
  });
});
