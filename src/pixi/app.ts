import * as PIXI from 'pixi.js';
import { renderData, network } from '../vis';
import * as TWEEN from '@tweenjs/tween.js';

export const app = new PIXI.Application({
  transparent: true,
  width: window.innerWidth,
  height: window.innerHeight
});

app.view.classList.add('pixi');
document.body.appendChild(app.view);

app.ticker.add(dt => {
  TWEEN.update(performance.now());
});
