// NOTE: Should be class members
const PUZZLE_STRING_LENGTH = 81;
const LETTERS_PER_UNIT = 9;
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

class SudokuSolver {
  // e.g. puzzleString = see ./puzzle-strings.js row = A-I column = 1-9 value = 1-9
  // WARNING: GOD CLASS
  // NOTE: Class attributes seem to be buggy because of babel

  validate(puzzleString) {
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
    if (typeof row === 'number') {
      return row;
    }
    const rowNum = rowMapper[row.toUpperCase()];
    if (!rowNum) {
      throw new Error('invalid row');
    }
    return rowNum;
  }

  // TODO: Remove column param if not necessary
  checkRowPlacement(puzzleString, row, value) {
    const rowString = this.getRow(puzzleString, row);
    return this.checkNumAvailable(rowString, value);
  }

  getRow(puzzleString, row) {
    const rowNum = this.mapRow(row);

    const end = rowNum * LETTERS_PER_UNIT;
    const start = end - LETTERS_PER_UNIT;
    const rowString = puzzleString.slice(start, end);
    return rowString;
  }

  // TODO: Remove row param if not necessary
  checkColPlacement(puzzleString, column, value) {
    const columnString = this.getCol(puzzleString, column);
    return this.checkNumAvailable(columnString, value);
  }

  getCol(puzzleString, colNum) {
    const colStart = colNum - 1;

    let column = '';
    for (let i = colStart; i < puzzleString.length; i += LETTERS_PER_UNIT) {
      column += puzzleString[i];
    }
    return column;
  }

  checkRegionPlacement(puzzleString, row, column, value) {
    const regionString = this.getRegion(puzzleString, row, column);
    return this.checkNumAvailable(regionString, value);
  }

  getRegion(puzzleString, row, col) {
    const REGION_COUNT = Math.sqrt(LETTERS_PER_UNIT);
    const rowNum = this.mapRow(row);
    const colNum = col - 1;

    const startCol = Math.floor(rowNum / REGION_COUNT) * REGION_COUNT;
    const startRow = Math.floor(colNum / REGION_COUNT) * REGION_COUNT;

    let region = '';
    for (let i = 0; i < REGION_COUNT; i++) {
      for (let j = 0; j < REGION_COUNT; j++) {
        const letterIndex = (startRow + i) * LETTERS_PER_UNIT + (startCol + j);
        region += puzzleString[letterIndex];
      }
    }
    return region;
  }

  // NOTE: My algorithm to laught at, at a later date, more readable version above
  //
  // getRegion(puzzleString, rowLetter, colNum) {
  //   const LETTERS_PER_REGION = 9;
  //   const REGIONS_PER_ROW = 3;

  //   const rowNum = this.mapRow(rowLetter);
  //   const regionRow = this.mapToRegionIndex(rowNum);
  //   const regionRowStart = (regionRow - 1) *
  //     (REGIONS_PER_ROW * LETTERS_PER_REGION);
  //   const regionRowEnd = regionRow * (REGIONS_PER_ROW * LETTERS_PER_REGION);

  //   const regionCol = this.mapToRegionIndex(colNum);
  //   const regionTopRight = regionRowStart + (regionCol * REGIONS_PER_ROW - 1);

  //   let region = '';
  //   for (let i = regionTopRight; i < regionRowEnd; i += LETTERS_PER_REGION) {
  //     region += puzzleString[i - 2];
  //     region += puzzleString[i - 1];
  //     region += puzzleString[i];
  //   }
  //   return region;
  // }

  // mapToRegionIndex(num) {
  //   if (num > 9) {
  //     throw new Error('invalid row or column num');
  //   }

  //   if (num <= 3) {
  //     return 1;
  //   }
  //   if (num <= 6) {
  //     return 2;
  //   }
  //   return 3;
  // }

  validPlacement(puzzleString, row, col, value) {
    return this.checkRowPlacement(puzzleString, row, value)
      && this.checkColPlacement(puzzleString, col, value)
      && this.checkRegionPlacement(puzzleString, row, col, value);
  }

  solve(puzzleString) {
    if (!this.validate(puzzleString)) {
      throw new Error('???');
    }

    let solution = '';
    for (let i = 0; i < LETTERS_PER_UNIT; i++) {
      for (let j = 0; i < LETTERS_PER_UNIT; j++) {

        const index = i * LETTERS_PER_UNIT + j;
        const field = puzzleString[index];
        console.log(solution);

        if (field != '.') {
          solution += field;
        } else {
          for (let value = 1; value <= LETTERS_PER_UNIT; value++) {

            if (!this.validPlacement(puzzleString, i + 1, j + 1, value)) {
              continue;
            }

            // TODO: Safe possible solutions in array instead?
            solution += value;
          }
        }
      }
    }
    return solution;
  }

}

module.exports = SudokuSolver;
