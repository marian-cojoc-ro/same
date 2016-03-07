export const grid = [];

const cellSize = 48;
const width = 11;
const height = 12;

let score = 0;
let bonus = 0;

const points = (matched) => matched.length * (matched.length - 1);
const rand = b => ~~(Math.random() * b);
const self = item => item;

const hasProps = props => cell => Object.keys(props).every((prop) => cell[prop] === props[prop]);
const find = (list, props) => list.find(hasProps(props));
const filter = props => grid.filter(hasProps(props));
const compact = list => list.filter(self);

const moveRight = cell => cell.x += 1;
const moveDown = cell => cell.y += 1;
const spaceBelow = cell => !find(grid, {x: cell.x, y: cell.y + 1});
const match = cell => cell.m = true;
const unmatch = cell => cell.m = false;
const remove = cell => grid.splice(grid.indexOf(cell), 1);

const column = x => filter({x});
const row = y => filter({y});

const randomCell = (x, y) => {
  let c = rand(5), matched = false;
  return {x, y, c, matched};
};

const fall = cell => {
  while (cell.y < height && spaceBelow(cell)) moveDown(cell);
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

const click = cell => {
  let matched = matchCells(cell);

  if (matched.length >= 2) {
    score += points(matched);
    matched.forEach(remove);
    applyGravity();
    collapseColumns();
  }
}

const move = cell => {
  grid.forEach(unmatch);
  let matched = matchCells(cell);

  if (matched.length >= 2) {
    matched.forEach(match);
    bonus = points(matched);
  }
}

const neighbours = cell => {
  let cells = filter({c: cell.c});

  let n = [
    find(cells, {x: cell.x, y: cell.y + 1}),
    find(cells, {x: cell.x, y: cell.y - 1}),
    find(cells, {x: cell.x + 1, y: cell.y}),
    find(cells, {x: cell.x - 1, y: cell.y})
  ];

  return compact(n);
}

const matchCells = (cell, list = []) => {
  list.push(cell);

  neighbours(cell).forEach(function(c) {
    if (list.indexOf(c) === -1) matchCells(c, list);
  });

  return list;
};

const cellOffset = e => {
  return {
    x: ~~(e.offsetX / cellSize) + 1,
    y: ~~(e.offsetY / cellSize) + 1
  };
}

const handle = action => {
  return e => {
    let cell = find(grid, cellOffset(e));
    cell && action(cell, e);
  }
}

for (let y = 1; y <= height; y++) {
  for (let x = 1; x <= width; x++) {
    grid.push(randomCell(x, y));
  }
}

export const handleMove = handle(move);
export const handleClick = handle(click);
export const game = { grid, score, bonus };
