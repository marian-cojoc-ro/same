import { canvas, render, cellOffset } from './canvas';
import { handle, click, move, game } from './game';
import { gameToCanvas } from './x';

const tick = () => {
  render(gameToCanvas(game));
  window.requestAnimationFrame(tick);
};

const mouse = action => e => handle(cellOffset(e), action);

canvas.addEventListener('click', mouse(click));
canvas.addEventListener('click', mouse(move));
canvas.addEventListener('mousemove', mouse(move));
window.addEventListener('load', tick);
