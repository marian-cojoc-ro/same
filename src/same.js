const grid = [],
  width = 11,
  height = 12,
  cellSize = 48,
  twoPI = 2 * Math.PI;

const canvas = document.getElementById('same');
const context = canvas.getContext('2d');

const fills = [
  'rgb(133, 199, 46)',
  'rgb(255, 219, 0)',
  'rgb(255, 0, 250)',
  'rgb(57, 154, 250)',
  'rgb(255, 0, 61)'
];

const hasProps = (props) => (cell) => Object.keys(props).every((prop) => cell[prop] === props[prop]);
const self = (item) => item;
const compact = (list) => list.filter(self);
const find = (list, props) => list.find(hasProps(props));
const filter = (props) => grid.filter(hasProps(props));
const rand = (b) => ~~(Math.random() * b);
const match = (cell) => cell.matched = true;
const unmatch = (cell) => cell.matched = false;
const remove = (cell) => grid.splice(grid.indexOf(cell), 1);
const moveRight = (cell) => cell.x += 1;
const moveDown = (cell) => cell.y += 1;
const spaceRight = (cell) => cell.x < width && !find(grid, {x: cell.x + 1, y: cell.y})
const spaceBelow = (cell) => cell.y < height && !find(grid, {x: cell.x, y: cell.y + 1});
const column = (x) => filter({x});
const row = (y) => filter({y});

const randomCell = (x, y) => {
  let c = rand(fills.length), matched = false;
  return {x, y, c, matched};
};

const flood = (cell) => {
  match(cell);
  neighbours(cell).forEach(flood);
};

const neighbours = (cell) => {
  let cells = filter({c: cell.c, matched: false});

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

const drawCell = (cell) => {
  context.fillStyle = fills[cell.c];

  let x = (cell.x - 0.5) * cellSize;
  let y = (cell.y - 0.5) * cellSize;
  let scale = cell.matched ? 0.25 : 0.4;

  context.beginPath();
  context.arc(x, y, cellSize * scale, 0, twoPI, false);
  context.closePath();
  context.fill();
};

const render = () => grid.forEach(drawCell);

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

const handleClick = function(e) {
  let matched = filter({matched: true});
  if (matched.length < 2) return;

  matched.forEach(remove);
  applyGravity();
  collapseColumns();
}

const handleHover = function(e) {
  grid.forEach(unmatch);
  let cell = find(grid, cellOffset(e));
  cell && flood(cell);
}

canvas.addEventListener('click', handleClick);
canvas.addEventListener('click', handleHover);
canvas.addEventListener('mousemove', handleHover);
window.addEventListener('load', tick);
