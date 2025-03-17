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

});
