const cellSize = 48;

const drawCell = (cell) => {
  let x = (cell.x - 0.5) * cellSize;
  let y = (cell.y - 0.5) * cellSize;
  let radius = cellSize * (cell.m ? 0.25 : 0.4);
  let fillStyle = cell.c;

  return { x, y, radius, fillStyle };
};

export const gameToCanvas = function(grid, score, bonus) {
  return {
    cells: grid.map(drawCell),
    score: `Score: ${score}` + (bonus > 0 ? ` + ${bonus}` : '')
  };
}

export const cellOffset = function(e) {
  return {
    x: ~~(e.offsetX / cellSize) + 1,
    y: ~~(e.offsetY / cellSize) + 1
  };
}
