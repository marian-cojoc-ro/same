import compact from 'lodash/array/compact';
import find from 'lodash/collection/find';
import filter from 'lodash/collection/filter';

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

const filterGrid = (c) => filter(grid, c);
const rand = (a, b) => a + ~~(Math.random() * b);
const match = (cell) => cell.matched = true;
const unmatch = (cell) => cell.matched = false;
const remove = (cell) => grid.splice(grid.indexOf(cell), 1);
const moveRight = (cell) => cell.x += 1;
const moveDown = (cell) => cell.y += 1;
const spaceRight = (cell) => cell.x < width && !find(grid, {x: cell.x + 1, y: cell.y})
const spaceBelow = (cell) => cell.y < height && !find(grid, {x: cell.x, y: cell.y + 1});
const column = (x) => filterGrid({x});
const row = (y) => filterGrid({y});

const randomCell = (x, y) => {
  return {
    x,
    y,
    c: rand(0, fills.length),
    matched: false
  };
};

const flood = (cell) => {
  match(cell);
  siblings(cell).forEach(flood);
};

const siblings = (cell) => {
  let cells = filterGrid({c: cell.c, matched: false});

  let n = [
    find(cells, {x: cell.x, y: cell.y + 1}),
    find(cells, {x: cell.x, y: cell.y - 1}),
    find(cells, {x: cell.x + 1, y: cell.y}),
    find(cells, {x: cell.x - 1, y: cell.y})
  ];

  return compact(n);
}

for (let y = 1; y <= height; y++) {
  for (let x = 1; x <= width; x++) {
    grid.push(randomCell(x, y));
  }
}

const fall = (cell) => {
  while (spaceBelow(cell)) moveDown(cell);
};

/*
// Not used in standard game mode
const drift = (cell) => {
  while (spaceRight(cell)) moveRight(cell);
};
*/

const collapseColumns = () => {
  for (let x = width; x >= 2; x--) {
    if (column(x).length) continue;

    for (let x2 = x - 1; x2 >= 1; x2--) {
      column(x2).forEach(moveRight);
    }
  }
};

const applyGravity = () => {
  for (let y = height; y >= 1; y--) {
    row(y).forEach(fall);
  }
}

const update = function() {
  applyGravity();
  collapseColumns();
}

const twoPI = 2 * Math.PI;

const drawCell = (cell) => {
  let [r, g, b] = fills[cell.c];
  context.fillStyle = `rgb(${r}, ${g}, ${b})`;

  let j = 5;
  let x = (cell.x - 0.5) * cellSize;
  let y = (cell.y - 0.5) * cellSize;
  let scale = cell.matched ? 0.2 : 0.4;

  context.beginPath();
  context.arc(x, y, cellSize * scale, 0, twoPI, false);
  context.closePath();
  context.fill();
};

const render = function() {
  grid.forEach(drawCell);
}

const tick = function() {
  erase();
  render();
  window.requestAnimationFrame(tick);
}

const erase = function() {
  context.clearRect(0, 0, canvas.width, canvas.height);
}

const cellOffset = function(e) {
  return {
    x: ~~(e.offsetX / cellSize) + 1,
    y: ~~(e.offsetY / cellSize) + 1
  };
}

const click = function(e) {
  let matched = filterGrid({matched: true});
  if (matched.length < 2) return;

  matched.forEach(remove);
  update();
}

const hover = function(e) {
  grid.forEach(unmatch);
  let cell = find(grid, cellOffset(e));
  cell && flood(cell);
}

canvas.onclick = click;
canvas.onmousemove = hover;
window.onload = tick;
