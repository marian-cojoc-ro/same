import { canvas, context, render } from './canvas';
import { gameToCanvas } from './x';
import { handleClick, handleMove, game } from './game';

const tick = function() {
  render(gameToCanvas(game));
  window.requestAnimationFrame(tick);
}

canvas.addEventListener('click', handleClick);
canvas.addEventListener('click', handleMove);
canvas.addEventListener('mousemove', handleMove);
window.addEventListener('load', tick);
