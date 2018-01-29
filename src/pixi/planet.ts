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
  const sprites: { [key: string]: PIXI.Container } = {};
  const sheet = resources.planet.textures;

  const lastClicked: ClickHistory = {
    lastButton: undefined as any,
    lastButtonOwner: undefined as any,
    currentButton: undefined as any
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

  const planetSelected = {};

  const createPlanet = (planet: Planet) => {
    let lastButton;
    let connection;
    let connectedText;
    const createResourceCounts = () => {
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

      const cylonSprite = makeAnimation(resources.gems.textures, 17, 7, 0.1);
      container.addChild(cylonSprite);
      cylonSprite.position.set(offset, 0);
      const tex1Sprite = new PIXI.Text('0', textStyle);
      tex1Sprite.position.set(offset + 10, -4);
      container.addChild(tex1Sprite);
      offset += 20;

      const somSprite = makeAnimation(resources.gems.textures, 27, 4);
      container.addChild(somSprite);
      somSprite.position.set(offset, 0);
      const tex2Sprite = new PIXI.Text('0', textStyle);
      tex2Sprite.position.set(offset + 10, -4);
      container.addChild(tex2Sprite);
      unitCounts.push(tex2Sprite);
      offset += 20;

      const aSprite = makeAnimation(resources.gems.textures, 33, 4);
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
            e.text = planet.stationedMaterials[materialNames[i]];
          } else {
            e.text = planet.stationedCombatUnits[unitNames[i - 3]];
          }
        });
      });

      return container;
    };

    const makeDrawer = () => {
      const container = new PIXI.Container();
      const bg = new PIXI.Sprite(resources.planet.textures[10]);
      const arrow = new PIXI.Sprite(resources.planet.textures[1]);
      arrow.position.set(0, -10);
      container.addChild(arrow);
      container.addChild(bg);
      return container;
    };

    const createFrame = () => {
      const materialIdx = 7;
      const container = new PIXI.Container();
      const namePlate = new PIXI.Sprite(sheet[4]);
      const bg = new PIXI.Sprite(sheet[16]);

      const resourceCounts = createResourceCounts();

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
      const drawer = makeDrawer();
      drawer.position.set(0, 10);
      container.addChild(drawer);
      container.addChild(bg);
      container.addChild(resourceCounts);
      container.addChild(namePlate);

      let portalIndex = 0;
      const makeButton = (
        id: number,
        tag: string,
        onClick: (lastClick: ClickHistory) => void
      ): any => {
        const button: any = new PIXI.Sprite(sheet[id]);
        button.interactive = true;
        button.name = tag;
        if (button.texture.trim) {
          button.hitArea = button.texture.trim;
        }
        button.on('mouseover', () => {
          if (button.noSet) return;
          document.body.style.cursor = 'pointer';
          button.texture = sheet[id + 1];
        });
        button.on('mouseout', () => {
          if (button.noSet) return;
          document.body.style.cursor = '';
          button.texture = sheet[id];
        });
        button.on('mousedown', () => {
          if (button.noSet) return;
          lastClicked.currentButton = button;
          onClick(lastClicked);
          lastClicked.lastButton = button;
          lastClicked.lastButtonOwner = planet;
          button.texture = sheet[id + 2];
        });
        button.on('mouseup', () => {
          if (button.noSet) return;
          button.texture = sheet[id];
        });
        (button as any).noSet = false;
        return button;
      };

      // Make existing portal buttons
      for (; portalIndex < planet.gateways.length; ++portalIndex) {
        const idx = portalIndex;
        const portalNew = makeButton(13, 'used', () => {
          lastButton.noSet = false;
          lastButton.texture = sheet[13];

          lastButton = portalNew;
          lastButton.noSet = true;
          lastButton.texture = sheet[14];
          connection = planet.gateways[idx].destinationPlanet.stats.name;
          connectedText.text = connection;
        });

        if (portalIndex === 0) {
          lastButton = portalNew;
          portalNew.noSet = true;
          portalNew.texture = sheet[14];
        }
        portalNew.position.set(portalIndex * 10, 0);
        container.addChild(portalNew);
      }

      // Make new portal buttons
      for (
        ;
        portalIndex < planet.stats.maxGateways - planet.gateways.length;
        ++portalIndex
      ) {
        const portalNew = makeButton(18, 'open', (lastClick: ClickHistory) => {
          if (
            lastClick.lastButton !== undefined &&
            lastClick.lastButton.name === 'open' &&
            lastClick.currentButton.name === 'open'
          ) {
            lastClick.lastButtonOwner.AddGatewayToPlanet(planet);

            lastClick.lastButton.name = 'used';
            lastClick.currentButton.name = 'used';

            return;
          }
        });
        portalNew.position.set(portalIndex * 10, 0);
        container.addChild(portalNew);
      }
      return container;
    };

    connection = planet.gateways[0].destinationPlanet.stats.name;

    const container2 = new PIXI.Container();
    const c2 = new PIXI.Container();
    c2.addChild(container2);
    const text = new PIXI.Text(planet.stats.name, {
      fontFamily: 'Press Start 2P',
      fontSize: '10px'
    });

    container2.position.set(0, 150);
    text.position.set(-35, -65);

    const text2 = new PIXI.Text(connection, {
      fontFamily: 'Press Start 2P',
      fontSize: '10px'
    });
    text2.position.set(-35, 3);
    connectedText = text2;
    container2.addChild(createFrame());
    container2.addChild(text);
    container2.addChild(text2);
    return c2;
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
