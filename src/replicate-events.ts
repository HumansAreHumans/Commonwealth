const events = ['mousedown', 'click', 'mouseup', 'mousemove'];
const pointerEvents = [
  'pointerdown',
  'pointermove',
  'pointerover',
  'pointerleave',
  'pointerup',
  'pointercancel'
];

export const replicate = (
  canvas1: HTMLCanvasElement,
  canvas2: HTMLCanvasElement
) => {
  events.forEach(eventName =>
    canvas1.addEventListener(eventName, e => {
      canvas2.dispatchEvent(new MouseEvent(e.type, e));
    })
  );

  pointerEvents.forEach(eventName =>
    canvas1.addEventListener(eventName, e =>
      canvas2.dispatchEvent(new PointerEvent(e.type, e))
    )
  );
};
