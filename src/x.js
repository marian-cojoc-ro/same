/**
 * transforms game state to canvas state for a simpler render
 */

const drawCell = cell => cell;

export const gameToCanvas = game => {
  let { grid, score } = game;

  return {
    cells: grid.map(drawCell),
    score: `Score: ${score.current}` + (score.bonus > 0 ? ` + ${score.bonus}` : '')
  };
};
