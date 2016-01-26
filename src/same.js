import { debounce, filter, find, compact } from 'lodash';

const grid = [],
  width = 11,
  height = 12,
  cellSize = 48;

const canvas = document.getElementById('same');
const context = canvas.getContext('2d');

const fills = [
  [133, 199, 46],
  [255, 219, 0],
  [255, 0, 250],
  [57, 154, 250],
  [255, 0, 61]
];

let rand = (a, b) => a + ~~(Math.random() * b);
let unmatch = (cell) => cell.matched = false;
let randomCell = (x, y) => new Cell({x: x, y: y });

class Cell {
  constructor({x, y, c}) {
    this.matched = false;
    this.x = x;
    this.y = y;
    this.c = rand(0, fills.length);
  }

  flood() {
    this.matched = true;
    this.siblings().forEach((cell) => cell.flood());
  }

  siblings() {
    let cells = filter(grid, {c: this.c, matched: false});

    let n = [
      find(cells, {x: this.x, y: this.y + 1}),
      find(cells, {x: this.x, y: this.y - 1}),
      find(cells, {x: this.x + 1, y: this.y}),
      find(cells, {x: this.x - 1, y: this.y})
    ];

    return compact(n);
  }
}

for (let y = 1; y <= height; y++) {
  for (let x = 1; x <= width; x++) {
    let cell = randomCell(x, y);
    grid.push(cell);
  }
}

let fall = function(cell) {
  if (cell.y < height && !find(grid, {x: cell.x, y: cell.y + 1})) cell.y += 1;
};

let drift = function(cell) {
  if (cell.x < width && !find(grid, {x: cell.x + 1, y: cell.y})) cell.x += 1;
};

let update = function() {
  // calculate stuff
  grid.forEach(fall);
  grid.forEach(drift);
}

let render = function() {
  // draw stuff

  grid.forEach(function(cell) {
    let [r, g, b] = fills[cell.c];
    context.fillStyle = `rgb(${r}, ${g}, ${b})`;

    let j = 5;
    let x = (cell.x + .5) * cellSize + rand(-j, j);
    let y = (cell.y + .5) * cellSize + rand(-j, j);
    let scale = cell.matched ? .1 : .38;

    context.beginPath();
    context.arc(x, y, cellSize * scale, 0, 2 * Math.PI, false);
    context.closePath();
    context.fill();
  });
}

let tick = function() {
  update();
  fade();
  render();
  window.requestAnimationFrame(tick);
}

let init = function() {
  tick();
}

let fade = function() {
  let lastImage = context.getImageData(0, 0, canvas.width, canvas.height);
  let pixelData = lastImage.data;

  let len = pixelData.length;
  for (let i = 3; i < len; i += 4) {
    pixelData[i] -= 12;
  }

  context.putImageData(lastImage, 0, 0);
}

let cellOffset = function(e) {
  return {
    x: ~~(e.offsetX / cellSize),
    y: ~~(e.offsetY / cellSize)
  };
}

let click = function(e) {
  let matched = filter(grid, {matched: true});
  if (matched.length < 2) return;

  matched.forEach(function(cell) {
    let i = grid.indexOf(cell);
    grid.splice(i, 1);
  });

  update();
}

let match = function(e) {
  grid.forEach(unmatch);
  let cell = find(grid, cellOffset(e));
  cell && cell.flood();

  let matched = filter(grid, {matched: true});

  if (matched.length < 2) {
    matched.forEach(unmatch);
  }
}

canvas.onclick = click;
canvas.onmousemove = debounce(match);

window.onload = tick;
