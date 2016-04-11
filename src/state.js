/**
 * initial state generator and helper
 */

import _curry from 'lodash/fp/curry';
import _compose from 'lodash/fp/compose';
import _spread from 'lodash/fp/spread';
import _map from 'lodash/fp/map';

import cartProd from './utils/cartesian-product';
// accepts array of arguments instead of argument list
// ..so if dont have to map again the coord
const _cartProd = _spread(cartProd);


const width = 11;
const height = 12;

// returns a random integer
const rand = b => ~~(Math.random() * b);

// returns a cell structure with a random color
const randomCell = (x, y) => {
  let c = rand(5) + 1, matched = false;
  return {x, y, c, matched};
};

// i want to pass coordinates as an array to random
const _randomCell = _spread(randomCell);

// function to use in iteration, returning the second parameter
const index = (v, i) => {
  return i;
};


// creates a random grid
export const random = () => {

  const coords = _map((dim) => {
    return Array.apply(null, { length: dim }).map(index);
  })([width, height]);

  // TODO: maybe we can loose the inner call to map somehow
  const grid = _compose(_map(_randomCell), _cartProd)(coords);

  return {
    grid,
    score: { current: 0, bonus: 0 }
  };
};


