const grid = [];
const score = { current: 0, bonus: 0 };

export const game = { grid, score };

const width = 11;
const height = 12;

const points = matched => matched.length * (matched.length - 1);
const rand = b => ~~(Math.random() * b);
const self = item => item;

const hasProps = props => cell => Object.keys(props).every(prop => cell[prop] === props[prop]);
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
  let c = rand(5) + 1, matched = false;
  return {x, y, c, matched};
};

const fall = cell => {
  while (cell.y < height - 1 && spaceBelow(cell)) moveDown(cell);
};

const collapseColumns = () => {
  for (let x = width - 1; x >= 1; x--) {
    if (column(x).length) continue;

    for (let x2 = x - 1; x2 >= 0; x2--) {
      column(x2).forEach(moveRight);
    }
  }
};

const applyGravity = () => {
  for (let y = height - 1; y >= 0; y--) {
    row(y).forEach(fall);
  }
};

export const click = cell => {
  let matched = matchCells(cell);

  if (matched.length >= 2) {
    score.current += points(matched);
    matched.forEach(remove);
    applyGravity();
    collapseColumns();
  }
};

export const move = cell => {
  grid.forEach(unmatch);
  let matched = matchCells(cell);

  if (matched.length >= 2) {
    matched.forEach(match);
    score.bonus = points(matched);
  }
};

export const handle = (coords, action) => {
  const cell = find(grid, coords);
  cell && action(cell);
};

const neighbours = cell => {
  let cells = filter({c: cell.c});

  let n = [
    find(cells, {x: cell.x, y: cell.y + 1}),
    find(cells, {x: cell.x, y: cell.y - 1}),
    find(cells, {x: cell.x + 1, y: cell.y}),
    find(cells, {x: cell.x - 1, y: cell.y})
  ];

  return compact(n);
};

const matchCells = (cell, list = []) => {
  list.push(cell);
  neighbours(cell).filter(c => list.indexOf(c) === -1).forEach(c => matchCells(c, list));
  return list;
};

for (let y = 0; y < height; y++) {
  for (let x = 0; x < width; x++) {
    grid.push(randomCell(x, y));
  }
}
