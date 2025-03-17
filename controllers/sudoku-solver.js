class SudokuSolver {

  validate(puzzleString) {
    if (puzzleString.length !== 81) {
      return false;
    }
    return /^[1-9.]+$/.test(puzzleString);
  }

  // TODO: Remove column param if not necessary
  checkRowPlacement(puzzleString, row, _column, value) {
    // e.g. puzzleString = see ./puzzle-strings.js row = A-I column = 1-9 value = 1-9
    const rowString = this.getRow(puzzleString, row);

    // NOTE: Optionally check if column already filled

    const rowNums = rowString.match(/\d/g);
    return !rowNums.map((numString) => Number(numString)).includes(value);
  }

  getRow(puzzleString, rowLetter) {
    const rowMapper = {
      A: 1,
      B: 2,
      C: 3,
      D: 4,
      E: 5,
      F: 6,
      G: 7,
      H: 8,
      I: 9
    }
    const rowNum = rowMapper[rowLetter.toUpperCase()];
    if (!rowNum) {
      throw new Error('invalid row');
    }

    const LETTERS_PER_ROW = 9;
    const end = rowNum * LETTERS_PER_ROW;
    const start = end - LETTERS_PER_ROW;
    const row = puzzleString.slice(start, end);
    return row;
  }

  checkColPlacement(puzzleString, row, column, value) {

  }

  checkRegionPlacement(puzzleString, row, column, value) {

  }

  solve(puzzleString) {

  }
}

module.exports = SudokuSolver;
