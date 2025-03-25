// NOTE: Should be class members
const PUZZLE_STRING_LENGTH = 81;
const NUMS_PER_UNIT = 9;
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
      throw new Error('Expected puzzle to be 81 characters long');
    }
    if (!/^[1-9.]+$/.test(puzzleString)) {
      throw new Error('Invalid characters in puzzle');
    }
    if (!this.checkPuzzleValidity(puzzleString)) {
      throw new Error('Puzzle cannot be solved');
    };
    return true;
  }

  checkPuzzleValidity(puzzleString) {
    for (let i = 0; i < NUMS_PER_UNIT; i++) {
      const row = this.getRow(puzzleString, i + 1);
      const col = this.getRow(puzzleString, i + 1);
      const region = this.getRegion(puzzleString, Math.floor(i / 3) * 3 + 1, (i % 3) * 3 + 1);
      if (!(this.isUnique(row) || this.isUnique(col) || this.isUnique(region))) {
        return false;
      }
    }
    return true;
  }

  isUnique(unit) {
    const nums = unit.replace(/\./g, '').split('');
    return new Set(nums).size === nums.length;
  }

  checkNumAvailable(sudokuString, value) {
    const nums = sudokuString.match(/\d/g) || [];
    return !nums.map((numString) => Number(numString)).includes(value);
  }

  mapRow(row) {
    if (typeof row === 'number') {
      return row;
    }
    const rowNum = rowMapper[row.toUpperCase()];
    if (!rowNum) {
      throw new Error('Invalid coordinate');
    }
    return rowNum;
  }

  checkRowPlacement(puzzleString, row, value) {
    if (value < 0 || value > 9) {
      throw new Error('Invalid value');
    }
    const rowString = this.getRow(puzzleString, row);
    return this.checkNumAvailable(rowString, value);
  }

  getRow(puzzleString, row) {
    const rowNum = this.mapRow(row);
    const start = (rowNum - 1) * NUMS_PER_UNIT;
    const end = start + NUMS_PER_UNIT;
    const rowString = puzzleString.slice(start, end);
    return rowString;
  }

  checkColPlacement(puzzleString, column, value) {
    if (column < 0 || column > 9) {
      throw new Error('Invalid coordinate');
    }
    if (value < 0 || value > 9) {
      throw new Error('Invalid value');
    }
    const columnString = this.getCol(puzzleString, column);
    return this.checkNumAvailable(columnString, value);
  }

  getCol(puzzleString, colNum) {
    const colStart = colNum - 1;

    let column = '';
    for (let i = colStart; i < puzzleString.length; i += NUMS_PER_UNIT) {
      column += puzzleString[i];
    }
    return column;
  }

  checkRegionPlacement(puzzleString, row, column, value) {
    if (column < 0 || column > 9) {
      throw new Error('Invalid coordinate');
    }
    if (value < 0 || value > 9) {
      throw new Error('Invalid value');
    }
    const regionString = this.getRegion(puzzleString, row, column);
    return this.checkNumAvailable(regionString, value);
  }

  getRegion(puzzleString, row, col) {
    const REGION_COUNT = Math.sqrt(NUMS_PER_UNIT);
    const rowNum = this.mapRow(row) - 1;
    const colNum = col - 1;

    const startCol = Math.floor(colNum / REGION_COUNT) * REGION_COUNT;
    const startRow = Math.floor(rowNum / REGION_COUNT) * REGION_COUNT;

    let region = '';
    for (let i = 0; i < REGION_COUNT; i++) {
      for (let j = 0; j < REGION_COUNT; j++) {
        const letterIndex = (startRow + i) * NUMS_PER_UNIT + (startCol + j);
        region += puzzleString[letterIndex];
      }
    }
    return region;
  }

  validPlacement(puzzleString, row, col, value) {
    return this.checkRowPlacement(puzzleString, row, value)
      && this.checkColPlacement(puzzleString, col, value)
      && this.checkRegionPlacement(puzzleString, row, col, value);
  }

  solve(puzzleString) {
    this.validate(puzzleString);

    const backtrackedPuzzles = [{ puzzle: puzzleString, i: 0 }];

    while (backtrackedPuzzles.length > 0) {
      const { puzzle, i } = backtrackedPuzzles.pop();

      if (i === puzzleString.length) {
        return puzzle;
      }

      const char = puzzle[i];

      const col = i % NUMS_PER_UNIT + 1;
      const row = Math.floor(i / NUMS_PER_UNIT) + 1;

      if (char !== '.') {
        backtrackedPuzzles.push({ puzzle, i: i + 1 });
        continue;
      }

      for (let value = 1; value <= NUMS_PER_UNIT; value++) {
        if (this.validPlacement(puzzle, row, col, value)) {
          const newPuzzle = this.getNextPuzzle(puzzle, i, value);
          backtrackedPuzzles.push({ puzzle: newPuzzle, i: i + 1 });
        }
      }
    }

    throw new Error('Puzzle cannot be solved');
  }

  getNextPuzzle(puzzle, index, value) {
    return puzzle.slice(0, index) + value + puzzle.slice(index + 1);
  }
}

module.exports = SudokuSolver;

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


