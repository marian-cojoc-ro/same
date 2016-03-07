const drawCell = cell => {
  let x = (cell.x - 0.5) * 48;
  let y = (cell.y - 0.5) * 48;
  let radius = cell.m ? 12 : 20;
  let fillStyle = cell.c;

  return { x, y, radius, fillStyle };
};

export const gameToCanvas = (game) => {
  let { grid, score, bonus } = game;

  return {
    cells: grid.map(drawCell),
    score: `Score: ${score}` + (bonus > 0 ? ` + ${bonus}` : '')
  };
}
