const chai = require('chai');
const assert = chai.assert;

const Solver = require('../controllers/sudoku-solver.js');
const SudokuSolver = require('../controllers/sudoku-solver.js');

let solver = new SudokuSolver();

suite('Unit Tests', () => {

  test('should handle a valid puzzle string of 81 chars', () => {
    const puzzle = '1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.';

    assert.isTrue(solver.validate(puzzle));
  });

  test('should handle an invalid puzzle string with invalid chars', () => {
    const puzzle = '1.5..2.8A..63.12.7.2..5.....t..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.';

    assert.isFalse(solver.validate(puzzle));
  });

  test('should handle an invalid puzzle string not 81 chars in length', () => {
    const puzzle = '1.5..2.84..63.12.7.2..5.....9..1....'

    assert.isFalse(solver.validate(puzzle));
  });

  test('should handle a valid row placement', () => {
    const puzzle = '..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..';
    const row = 'a';
    const column = 1;
    const value = 7;
    assert.isTrue(solver.checkRowPlacement(puzzle, row, column, value));
  });

  test('should handle an invalid row placement', () => {
    const puzzle = '..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..';
    const row = 'a';
    const column = 1;
    const value = 1;
    assert.isFalse(solver.checkRowPlacement(puzzle, row, column, value));
  });

  test('should handle a valid column placement', () => {
    const puzzle = '..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..';
    const row = 'a';
    const column = 1;
    const value = 7;
    assert.isTrue(solver.checkColPlacement(puzzle, row, column, value));
  });

  test('should handle an invalid column placement', () => {
    const puzzle = '..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..';
    const row = 'a';
    const column = 1;
    const value = 5;
    assert.isFalse(solver.checkColPlacement(puzzle, row, column, value));
  });

  test('should handle a valid region placement', () => {
    const puzzle = '..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..';
    const row = 'h';
    const column = 7;
    const value = 5;
    assert.isTrue(solver.checkRegionPlacement(puzzle, row, column, value));
  });

  test('should handle an invalid region placement', () => {
    const puzzle = '..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..';
    const row = 'e';
    const column = 5;
    const value = 1;
    assert.isFalse(solver.checkRegionPlacement(puzzle, row, column, value));
  });

});
