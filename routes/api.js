'use strict';

const SudokuSolver = require('../controllers/sudoku-solver.js');

module.exports = function(app) {

  let solver = new SudokuSolver();

  // NOTE: Some of this logic should probs be in the controller
  app.route('/api/check')
    .post((req, res) => {
      const puzzleString = req.body.puzzle;
      const coordinate = req.body.coordinate;
      const value = req.body.value;
      if (!puzzleString || !coordinate || (!value && value !== 0)) {
        res.json({ error: 'Required field(s) missing' });
      }

      try {
        solver.validate(puzzleString);
        const { row, col } = solver.validateCoordinate(coordinate);
        const checkedValue = solver.validateValue(value);

        if (solver.validPlacement(puzzleString, row, col, checkedValue)) {
          return res.json({ valid: true });
        }

        const conflict = solver
          .getConflicts(puzzleString, row, col, checkedValue);

        return res.json({
          valid: false,
          conflict
        });
      } catch (error) {
        return res.json({ error: error.message });
      }
    });

  app.route('/api/solve')
    .post((req, res) => {
      const puzzleString = req.body;
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
