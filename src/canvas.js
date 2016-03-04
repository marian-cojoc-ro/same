const cellSize = 48;
const fills = ['#8C3', '#FD0', '#F0E', '#4AF', '#F04'];
const twoPI = 2 * Math.PI;

const erase = () => context.clearRect(0, 0, canvas.width, canvas.height);

const drawScore = (score, bonus) => {
  context.fillStyle = '#432';
  context.fillText(`Score: ${score}` + (bonus > 0 ? ` + ${bonus}` : ''), 5, 610);
}

const drawCell = (cell) => {
  context.fillStyle = fills[cell.c];

  let x = (cell.x - 0.5) * cellSize;
  let y = (cell.y - 0.5) * cellSize;
  let scale = cell.m ? 0.25 : 0.4;

  circle(x, y, cellSize * scale);
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

export const render = (grid, score, bonus) => {
  erase();
  grid.forEach(drawCell);
  drawScore(score, bonus);
};

export const cellOffset = function(e) {
  return {
    x: ~~(e.offsetX / cellSize) + 1,
    y: ~~(e.offsetY / cellSize) + 1
  };
}
