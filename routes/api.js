'use strict';

const SudokuSolver = require('../controllers/sudoku-solver.js');

module.exports = function(app) {

  let solver = new SudokuSolver();

  // NOTE: Some of this logic should probs be in the controller
  app.route('/api/check')
    .post((req, res) => {
      const { puzzle, coordinate, value } = req.body;
      if (!puzzle || !coordinate || (!value && value !== 0)) {
        return res.json({ error: 'Required field(s) missing' });
      }

      try {
        solver.validate(puzzle);
        const { row, col } = solver.validateCoordinate(coordinate);
        const checkedValue = solver.validateValue(value);
        const coordinateIndex = puzzle[solver.getCellIndex(row, col)];

        if (coordinateIndex === value) {
          return res.json({ valid: true });
        }
        if (solver.validPlacement(puzzle, row, col, checkedValue)) {
          return res.json({ valid: true });
        }

        const clearedPuzzle = puzzle.slice(0, coordinateIndex)
          + '.' + puzzle.slice(coordinateIndex + 1);

        const conflicts = solver
          .getConflicts(puzzle, row, col, checkedValue);

        return res.json({
          valid: false,
          conflict: conflicts
        });
      } catch (error) {
        return res.json({ error: error.message });
      }
    });

  app.route('/api/solve')
    .post((req, res) => {
      const puzzleString = req.body.puzzle;
      if (!puzzleString) {
        res.json({ error: 'Required field missing' });
      }

      try {
        const solution = solver.solve(puzzleString);
        return res.json({ solution });
      } catch (error) {
        return res.json({ error: error.message });
      }
    });
};
