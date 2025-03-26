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

    assert.throw(() => solver.validate(puzzle), 'Invalid characters in puzzle');
  });

  test('should handle an invalid puzzle string not 81 chars in length', () => {
    const puzzle = '1.5..2.84..63.12.7.2..5.....9..1....'

    assert.throw(() => solver.validate(puzzle), 'Expected puzzle to be 81 characters long');
  });

  test('should handle a valid row placement', () => {
    const puzzle = '..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..';
    const row = 0;
    const value = 7;
    assert.isTrue(solver.checkRowPlacement(puzzle, row, value));
  });

  test('should handle an invalid row placement', () => {
    const puzzle = '..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..';
    const row = 0;
    const value = 1;
    assert.isFalse(solver.checkRowPlacement(puzzle, row, value));
  });

  test('should handle a valid column placement', () => {
    const puzzle = '..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..';
    const column = 0;
    const value = 7;
    assert.isTrue(solver.checkColPlacement(puzzle, column, value));
  });

  test('should handle an invalid column placement', () => {
    const puzzle = '..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..';
    const column = 0;
    const value = 5;
    assert.isFalse(solver.checkColPlacement(puzzle, column, value));
  });

  test('should handle a valid region placement', () => {
    const puzzle = '..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..';
    const row = 7;
    const column = 6;
    const value = 5;
    assert.isTrue(solver.checkRegionPlacement(puzzle, row, column, value));
  });

  test('should handle an invalid region placement', () => {
    const puzzle = '..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..';
    const row = 4;
    const column = 4;
    const value = 1;
    assert.isFalse(solver.checkRegionPlacement(puzzle, row, column, value));
  });

  test('should solve valid puzzle strings', () => {
    const puzzle = '1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.';
    assert.equal(solver.solve(puzzle), '135762984946381257728459613694517832812936745357824196473298561581673429269145378')
  });

  test('should fail on invalid puzzle string', () => {
    const puzzle = '2.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.';
    assert.throw(() => solver.solve(puzzle), 'Puzzle cannot be solved');
  });

  test('should return the expected solution for an incomplete puzzle', () => {
    const puzzle = '1...........................9..1...............7.2............1..16..............';
    assert.equal(solver.solve(puzzle), '189765432765432918432981765896517324524396187317824659678243591951678243243159876');
  });

});
