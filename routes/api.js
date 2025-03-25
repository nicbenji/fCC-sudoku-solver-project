'use strict';

const SudokuSolver = require('../controllers/sudoku-solver.js');

module.exports = function(app) {

  let solver = new SudokuSolver();

  // NOTE: Some of this logic should probs be in the controller
  app.route('/api/check')
    .post((req, res) => {
      const puzzleString = req.body.puzzle;
      const coordinate = req.body.coordinate;
      if (!puzzleString || !coordinate) {
        res.json({ error: 'Required field(s) missing' });
      }
      const value = req.body.value;

      try {
        solver.validate(puzzleString);

        const [row, col] = coordinate.toString().split('');
        if (solver.validPlacement(puzzleString, row, col, value)) {
          return res.json({ valid: true });
        }

        const conflict = [];
        if (!solver.checkRowPlacement(puzzleString, row, value)) {
          conflict.push('row');
        }
        if (!solver.checkColPlacement(puzzleString, row, value)) {
          conflict.push('column');
        }
        if (!solver.checkRegionPlacement(puzzleString, row, col, value)) {
          conflict.push('region');
        }

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
