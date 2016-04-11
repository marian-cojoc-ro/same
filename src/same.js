import { canvas, render, cellOffset } from './canvas';
import { applyMove, applyClick } from './game';
import { gameToCanvas } from './x';

import _compose from 'lodash/fp/compose';
import _curry from 'lodash/fp/curry';

import * as state from './state';

// hopefully the only `let` in the game
// holds the game state
let impureState = state.random();

// the actual operation for each frame
const frameOp = _compose(render, gameToCanvas);

const frame = () => {
  //trigger the frame operation
  frameOp(impureState);
};
const tick = () => {
  frame();
  window.requestAnimationFrame(tick);
};

// XXX: debugging purposes
window.frame = frame;

// handle wrapper
const handle = _curry((op, event) => {
  // get new state based on the old onw
  impureState = op(cellOffset(event), impureState);
}, 2);

canvas.addEventListener('click', handle(applyClick));
// TODO: move the move transformer effect into the click transformer
canvas.addEventListener('click', handle(applyMove));
canvas.addEventListener('mousemove', handle(applyMove));

window.addEventListener('load', tick);
