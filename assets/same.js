/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "/";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports) {

	'use strict';

	var grid = [],
	    width = 11,
	    height = 12,
	    cellSize = 48,
	    twoPI = 2 * Math.PI;

	var canvas = document.getElementById('same');
	var context = canvas.getContext('2d');

	var fills = ['rgb(133, 199, 46)', 'rgb(255, 219, 0)', 'rgb(255, 0, 250)', 'rgb(57, 154, 250)', 'rgb(255, 0, 61)'];

	var hasProps = function hasProps(props) {
	  return function (cell) {
	    return Object.keys(props).every(function (prop) {
	      return cell[prop] === props[prop];
	    });
	  };
	};
	var self = function self(item) {
	  return item;
	};
	var compact = function compact(list) {
	  return list.filter(self);
	};
	var find = function find(list, props) {
	  return list.find(hasProps(props));
	};
	var filter = function filter(props) {
	  return grid.filter(hasProps(props));
	};
	var rand = function rand(b) {
	  return ~ ~(Math.random() * b);
	};
	var match = function match(cell) {
	  return cell.matched = true;
	};
	var unmatch = function unmatch(cell) {
	  return cell.matched = false;
	};
	var remove = function remove(cell) {
	  return grid.splice(grid.indexOf(cell), 1);
	};
	var moveRight = function moveRight(cell) {
	  return cell.x += 1;
	};
	var moveDown = function moveDown(cell) {
	  return cell.y += 1;
	};
	var spaceRight = function spaceRight(cell) {
	  return cell.x < width && !find(grid, { x: cell.x + 1, y: cell.y });
	};
	var spaceBelow = function spaceBelow(cell) {
	  return cell.y < height && !find(grid, { x: cell.x, y: cell.y + 1 });
	};
	var column = function column(x) {
	  return filter({ x: x });
	};
	var row = function row(y) {
	  return filter({ y: y });
	};

	var randomCell = function randomCell(x, y) {
	  var c = rand(fills.length),
	      matched = false;
	  return { x: x, y: y, c: c, matched: matched };
	};

	var flood = function flood(cell) {
	  match(cell);
	  neighbours(cell).forEach(flood);
	};

	var neighbours = function neighbours(cell) {
	  var cells = filter({ c: cell.c, matched: false });

	  var n = [find(cells, { x: cell.x, y: cell.y + 1 }), find(cells, { x: cell.x, y: cell.y - 1 }), find(cells, { x: cell.x + 1, y: cell.y }), find(cells, { x: cell.x - 1, y: cell.y })];

	  return compact(n);
	};

	for (var y = 1; y <= height; y++) {
	  for (var x = 1; x <= width; x++) {
	    grid.push(randomCell(x, y));
	  }
	}

	var fall = function fall(cell) {
	  while (spaceBelow(cell)) {
	    moveDown(cell);
	  }
	};

	var collapseColumns = function collapseColumns() {
	  for (var x = width; x >= 2; x--) {
	    if (column(x).length) continue;

	    for (var x2 = x - 1; x2 >= 1; x2--) {
	      column(x2).forEach(moveRight);
	    }
	  }
	};

	var applyGravity = function applyGravity() {
	  for (var y = height; y >= 1; y--) {
	    row(y).forEach(fall);
	  }
	};

	var drawCell = function drawCell(cell) {
	  context.fillStyle = fills[cell.c];

	  var x = (cell.x - 0.5) * cellSize;
	  var y = (cell.y - 0.5) * cellSize;
	  var scale = cell.matched ? 0.25 : 0.4;

	  context.beginPath();
	  context.arc(x, y, cellSize * scale, 0, twoPI, false);
	  context.closePath();
	  context.fill();
	};

	var render = function render() {
	  return grid.forEach(drawCell);
	};

	var tick = function tick() {
	  erase();
	  render();
	  window.requestAnimationFrame(tick);
	};

	var erase = function erase() {
	  context.clearRect(0, 0, canvas.width, canvas.height);
	};

	var cellOffset = function cellOffset(e) {
	  return {
	    x: ~ ~(e.offsetX / cellSize) + 1,
	    y: ~ ~(e.offsetY / cellSize) + 1
	  };
	};

	var handleClick = function handleClick(e) {
	  var matched = filter({ matched: true });
	  if (matched.length < 2) return;

	  matched.forEach(remove);
	  applyGravity();
	  collapseColumns();
	};

	var handleHover = function handleHover(e) {
	  grid.forEach(unmatch);
	  var cell = find(grid, cellOffset(e));
	  cell && flood(cell);
	};

	canvas.addEventListener('click', handleClick);
	canvas.addEventListener('click', handleHover);
	canvas.addEventListener('mousemove', handleHover);
	window.addEventListener('load', tick);

/***/ }
/******/ ]);