const fills = ['#8C3', '#FD0', '#F0E', '#4AF', '#F04'];
const twoPI = 2 * Math.PI;

const erase = () => context.clearRect(0, 0, canvas.width, canvas.height);

const drawScore = (score) => {
  context.fillStyle = '#432';
  context.fillText(score, 5, 610);
}

const drawCell = (cell) => {
  context.fillStyle = fills[cell.fillStyle];
  circle(cell.x, cell.y, cell.radius);
};

const circle = (x, y, radius) => {
  context.beginPath();
  context.arc(x, y, radius, 0, twoPI, false);
  context.closePath();
  context.fill();
}

export const canvas = document.getElementById('same');
export const context = canvas.getContext('2d');
context.font = '24px sans-serif';

export const render = state => {
  erase();
  state.cells.forEach(drawCell);
  drawScore(state.score);
};
