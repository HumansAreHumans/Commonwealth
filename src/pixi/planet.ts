import * as PIXI from 'pixi.js';
import Loader from './loader';
import { app } from './app';
import { renderData, network } from '../vis';
import { Planet, GeneratePlanet, Game, materialNames } from '../GameLogic';

import * as TWEEN from '@tweenjs/tween.js';

interface ClickHistory {
  lastButton: PIXI.Sprite;
  lastButtonOwner: Planet;
  currentButton: PIXI.Sprite;
}

const getFrameInfo = (aseAnimation: any, frameName: string) =>
  aseAnimation.meta.data.frames.find(frame => frame.name === frameName);

const getFrames = (aseAnimation: any, frameName: string) => {
  const frame = getFrameInfo(aseAnimation, frameName);
};

Loader.load((loader: any, resources: any) => {
  console.log(resources.planet);

  const sprites: { [key: string]: PIXI.Container } = {};
  const sheet = resources.planet.textures;

  const lastClicked: ClickHistory = {
    lastButton: undefined as any,
    lastButtonOwner: undefined as any,
    currentButton: undefined as any
  };

  const makeButton = (
    id: number,
    owner: Planet,
    tag: string,
    onClick: (lastClick: ClickHistory) => void
  ) => {
    const button = new PIXI.Sprite(sheet[id]);
    button.interactive = true;
    button.name = tag;
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
      lastClicked.currentButton = button;
      onClick(lastClicked);
      lastClicked.lastButton = button;
      lastClicked.lastButtonOwner = owner;
      button.texture = sheet[id + 2];
    });
    button.on('mouseup', () => {
      button.texture = sheet[id];
    });

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

  const createResourceCounts = (planet: Planet) => {
    const container = new PIXI.Container();

    return container;
  };

  const createFrame = (planet: Planet) => {
    const materialIdx = 7;
    const container = new PIXI.Container();
    const namePlate = new PIXI.Sprite(sheet[4]);
    const bg = new PIXI.Sprite(sheet[16]);

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

    let portalIndex = 0;

    // Make existing portal buttons
    for (; portalIndex < planet.gateways.length; ++portalIndex) {
      const portalNew = makeButton(13, planet, 'used', () => {
        // planet.ProbePlanet();
      });
      portalNew.interactive = false;
      portalNew.position.set(portalIndex * 10, 0);
      container.addChild(portalNew);
    }

    // Make new portal buttons
    for (
      ;
      portalIndex < planet.stats.maxGateways - planet.gateways.length;
      ++portalIndex
    ) {
      const portalNew = makeButton(13, planet, 'open', (lastClick: ClickHistory) => {
        if (lastClick.lastButton !== undefined
        && lastClick.lastButton.name === 'open'
        && lastClick.currentButton.name === 'open') {
          lastClick.lastButtonOwner.AddGatewayToPlanet(planet);

          lastClick.lastButton.interactive = false;
          lastClick.lastButton.name = 'used';
          lastClick.currentButton.interactive = false;
          lastClick.currentButton.name = 'used';

          return;
        }
      });
      portalNew.position.set(portalIndex * 10, 0);
      container.addChild(portalNew);
    }

    const probeButton = makeButton(13, planet, 'probe', (lastClick: ClickHistory) => {
      planet.ProbePlanet();
    });
    probeButton.position.set(portalIndex * 10, 0);
    container.addChild(probeButton);
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
