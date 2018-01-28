import * as PIXI from 'pixi.js';
import { renderData, network } from '../vis';
import * as TWEEN from '@tweenjs/tween.js';
import { replicate } from '../replicate-events';

(PIXI.SCALE_MODES as any).DEFAULT = PIXI.SCALE_MODES.NEAREST;
export const app = new PIXI.Application({
  transparent: true,
  width: window.innerWidth,
  height: window.innerHeight
});

app.view.classList.add('pixi');
document.body.appendChild(app.view);
app.view.addEventListener('mousemove', () => {
  console.log('whatever');
});

replicate(
  document.getElementById('networkgraph') as HTMLCanvasElement,
  app.view
);

app.ticker.add(dt => {
  TWEEN.update(performance.now());
});
