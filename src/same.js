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

const filterGrid = (c) => filter(grid, c);
const rand = (a, b) => a + ~~(Math.random() * b);
const match = (cell) => cell.matched = true;
const unmatch = (cell) => cell.matched = false;
const remove = (cell) => grid.splice(grid.indexOf(cell), 1);

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

const fall = function(cell) {
  if (cell.y < height && !find(grid, {x: cell.x, y: cell.y + 1})) cell.y += 1;
};

const drift = function(cell) {
  if (cell.x < width && !find(grid, {x: cell.x + 1, y: cell.y})) cell.x += 1;
};

const column = (x) => filterGrid({x});

const collapseColumns = () => {
  for (let x = width; x >= 2; x--) {
    if (column(x).length) continue;

    for (let x2 = 1; x2 < x; x2++) {
      column(x2).forEach(drift);
    }
  }
};

const update = function() {
  // apply gravity
  grid.forEach(fall);

  // clear empty columns
  collapseColumns();
}

const render = function() {
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

const tick = function() {
  update();
  fade();
  render();
  window.requestAnimationFrame(tick);
}

const fade = function() {
  let lastImage = context.getImageData(0, 0, canvas.width, canvas.height);
  let pixelData = lastImage.data;

  let len = pixelData.length;
  for (let i = 3; i < len; i += 4) {
    pixelData[i] -= 12;
  }

  context.putImageData(lastImage, 0, 0);
}

const cellOffset = function(e) {
  return {
    x: ~~(e.offsetX / cellSize),
    y: ~~(e.offsetY / cellSize)
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
canvas.onmousemove = debounce(hover);

window.onload = tick;
