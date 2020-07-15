export const dictionary = {
  0: null,
  1: "A",
  2: "B",
  3: "C",
  4: "D",
  5: "E",
  6: "F",
  7: "G",
  8: "H",
  9: "I",
  10: "J"
}

export const generateGrid = () => {
  let grid = [];
  let length = 11;
  for (let i = 0; i < length; i++) {
    let row = [];
    for (let j = 0; j < length; j++) {
      if (i === 0) {
        row.push({ status: "label", label: dictionary[j] })
      } else if (i !== 0 && j === 0) {
        row.push({ status: "label", label: i });
      } else {
        row.push({ status: "empty", hover: false, ship: null });        
      }
    }
    grid.push(row);
  }
  return grid;
};


export const getNewShips = () => {
  return [
    { id: "F1", position: { row: null, col: null }, moveRange: 4, fireRange: 2, displayed: false },
    { id: "F2", position: { row: null, col: null }, moveRange: 4, fireRange: 2, displayed: false },
    { id: "F3", position: { row: null, col: null }, moveRange: 4, fireRange: 2, displayed: false },
    { id: "F4", position: { row: null, col: null }, moveRange: 4, fireRange: 2, displayed: false },
    { id: "C1", position: { row: null, col: null }, moveRange: 3, fireRange: 2, displayed: false },
    { id: "C2", position: { row: null, col: null }, moveRange: 3, fireRange: 2, displayed: false },
    { id: "C3", position: { row: null, col: null }, moveRange: 3, fireRange: 2, displayed: false },
    { id: "D1", position: { row: null, col: null }, moveRange: 2, fireRange: 3, displayed: false },
    { id: "D2", position: { row: null, col: null }, moveRange: 2, fireRange: 3, displayed: false },
    { id: "AC1", position: { row: null, col: null }, moveRange: 1, fireRange: 5, displayed: false },
  ]
}

export const getNewGrid = (grid) => {
  let newGrid = [];
  for (let i = 0; i < grid.length; i++) {
    newGrid[i] = grid[i].slice();
  }
  return newGrid;
}

export const destinationCellIsOk = (range, currentRow, currentCol, targetRow, targetCol) => {
  const okHorizontal = (Math.abs(currentRow - targetRow) <= range) && (currentCol === targetCol);
  const okVertical = (Math.abs(currentCol - targetCol) <= range) && (currentRow === targetRow);
  return okHorizontal || okVertical;
}

export const getGridCoordinate = (row, col) => {
  return `${dictionary[col]}${row}`;
}

export const updateCellClass = cell => {
  let classes = "grid-square ";
  if (cell.status === "occupied" && cell.hover) {
    classes += "active-occupied";
  } else if (cell.hover) {
    classes += "active";
  } else if (cell.status === "occupied") {
    classes += "occupied";
  } else if (cell.status === "hit") {
    classes += "hit";
  } else if (cell.status === "sunk") {
    classes += "sunk";
  } else {
    classes += "water";
  }
  return classes;
};

