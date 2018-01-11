const gridGenerator = () => {
  let grid = [];
  let length = 10;
  for (let i = 0; i < length; i++) {
    let row = [];
    for (let j = 0; j < length; j++) {
      row.push([{ status: "empty", hover: false }]);
    }
    grid.push(row);
  }
  return grid;
};

const isOccupied = (grid, row, col, rotated) => {
  let isTaken = false;
  if (!rotated) {
    if (row + 3 <= 10) {
      for (let i = 0; i < 3; i++) {
        if (grid[row + i][col].status === "occupied") {
          isTaken = true;
        }
      }
    }
  } else {
    if (col + 3 <= 10) {
      for (let i = 0; i < 3; i++) {
        if (grid[row][col + i].status === "occupied") {
          isTaken = true; 
        }
      }
    }
  }
  return isTaken; 
};

const placeShip = ({ grid, row, col, rotated }) => {
  // place the ship
  if (isOccupied(grid, row, col, rotated)) {
    return grid;
  } else {
    if (!rotated) {
      if (row + 3 <= 10) {
        for (let i = 0; i < 3; i++) {
          grid[row + i][col].status = "occupied";
        }
      }
    } else {
      if (col + 3 <= 10) {
        for (let i = 0; i < 3; i++) {
          grid[row][col + i].status = "occupied";
        }
      }
    }
    return grid;
  }
};

const hoverUpdate = ({ grid, row, col, rotated, type }) => {
  const bool = type === "enter" ? true : false;
  const position = grid[row][col];
  if (!rotated) {
    if (row + 3 <= 10) {
      for (let i = 0; i < 3; i++) {
        grid[row + i][col].hover = bool;
      }
    }
  } else {
    if (col + 3 <= 10) {
      for (let i = 0; i < 3; i++) {
        grid[row][col + i].hover = bool;
      }
    }
  }
  return grid;
};

const classUpdate = square => {
  let classes = "grid-square ";
  if (square.status === "occupied" && square.hover) {
    classes += "active-occupied";
  } else if (square.hover) {
    classes += "active";
  } else if (square.status === "occupied") {
    classes += "occupied";
  } else if (square.hit) {
    classes += "hit";
  }
  return classes;
};

module.exports = {
  gridGenerator,
  isOccupied,
  placeShip,
  hoverUpdate,
  classUpdate
};
