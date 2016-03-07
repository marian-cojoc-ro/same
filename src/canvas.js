export const canvas = document.getElementById('same');
export const context = canvas.getContext('2d');

const fillColors = ['#DDD', '#8C3', '#FD0', '#F0E', '#4AF', '#F04'];
const twoPI = 2 * Math.PI;
const cellSize = 48;

const erase = () => context.clearRect(0, 0, canvas.width, canvas.height);

const makeSprite = color => {
  circle(24, 24, 20, color);
  let sprite = context.getImageData(0, 0, cellSize, cellSize);
  erase();
  return sprite;
};

const circle = (x, y, radius, color) => {
  context.fillStyle = color;
  context.beginPath();
  context.arc(x, y, radius, 0, twoPI, false);
  context.closePath();
  context.fill();
};

const sprites = fillColors.map(makeSprite);

const drawScore = score => {
  context.fillStyle = '#432';
  context.fillText(score, 5, 610);
};

const drawCell = cell => {
  context.putImageData(sprites[cell.m ? 0 : cell.c], cell.x * cellSize, cell.y * cellSize);
};

export const cellOffset = e => {
  return {
    x: ~~(e.offsetX / cellSize),
    y: ~~(e.offsetY / cellSize)
  };
};

export const render = state => {
  erase();
  state.cells.forEach(drawCell);
  drawScore(state.score);
};

context.font = '24px sans-serif';
