class SudokuSolver {
  // e.g. puzzleString = see ./puzzle-strings.js row = A-I column = 1-9 value = 1-9
  // WARNING: GOD CLASS
  // NOTE: Class attributes seem to be bug because of babel

  validate(puzzleString) {
    const PUZZLE_STRING_LENGTH = 81;
    if (puzzleString.length !== PUZZLE_STRING_LENGTH) {
      return false;
    }
    return /^[1-9.]+$/.test(puzzleString);
  }

  checkNumAvailable(sudokuString, value) {
    const nums = sudokuString.match(/\d/g);
    return !nums.map((numString) => Number(numString)).includes(value);
  }

  mapRow(row) {
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
    const rowNum = rowMapper[row.toUpperCase()];
    if (!rowNum) {
      throw new Error('invalid row');
    }
    return rowNum;
  }

  // TODO: Remove column param if not necessary
  checkRowPlacement(puzzleString, row, _column, value) {
    const rowString = this.getRow(puzzleString, row);
    return this.checkNumAvailable(rowString, value);
  }

  getRow(puzzleString, rowLetter) {
    const rowNum = this.mapRow(rowLetter);

    const LETTERS_PER_ROW = 9;
    const end = rowNum * LETTERS_PER_ROW;
    const start = end - LETTERS_PER_ROW;
    const row = puzzleString.slice(start, end);
    return row;
  }

  // TODO: Remove row param if not necessary
  checkColPlacement(puzzleString, _row, column, value) {
    const columnString = this.getCol(puzzleString, column);
    return this.checkNumAvailable(columnString, value);
  }

  getCol(puzzleString, colNum) {
    const LETTERS_PER_COLUMN = 9;
    const colStart = colNum - 1;

    let column = '';
    for (let i = colStart; i < puzzleString.length; i += LETTERS_PER_COLUMN) {
      column += puzzleString[i];
    }
    return column;
  }

  checkRegionPlacement(puzzleString, row, column, value) {
    const regionString = this.getRegion(puzzleString, row, column);
    return this.checkNumAvailable(regionString, value);
  }

  getRegion(puzzleString, rowLetter, colNum) {
    const LETTERS_PER_REGION = 9;
    const REGIONS_PER_ROW = 3;

    const rowNum = this.mapRow(rowLetter);
    const regionRow = this.mapToRegionIndex(rowNum);
    const regionRowStart = (regionRow - 1) *
      (REGIONS_PER_ROW * LETTERS_PER_REGION);
    const regionRowEnd = regionRow * (REGIONS_PER_ROW * LETTERS_PER_REGION);

    const regionCol = this.mapToRegionIndex(colNum);
    const regionTopRight = regionRowStart + (regionCol * REGIONS_PER_ROW - 1);

    let region = '';
    for (let i = regionTopRight; i < regionRowEnd; i += LETTERS_PER_REGION) {
      region += puzzleString[i - 2];
      region += puzzleString[i - 1];
      region += puzzleString[i];
    }
    return region;
  }

  mapToRegionIndex(num) {
    if (num > 9) {
      throw new Error('invalid row or column num');
    }

    if (num <= 3) {
      return 1;
    }
    if (num <= 6) {
      return 2;
    }
    return 3;
  }

  solve(puzzleString) {

  }
}

module.exports = SudokuSolver;
