const isOccupied = (grid, row, col, ships, currentShip) => {
  let isTaken = false;
  if (row < 11) {
      if (grid[row][col].status === "occupied") {
        isTaken = true;
    }
  }
  return isTaken;
};

const placeShip = ({ grid, row, col, ships, currentShip }) => {
  if (isOccupied(grid, row, col, ships, currentShip)) {
    return null;
  } else {
    if (row < 11) {
      grid[row][col].status = "occupied";
      grid[row][col].type = currentShip.type;
      grid[row][col].hover = false;
      currentShip.positions.push({ row: row, col, hit: false });
      return {
        grid,
        ships
      };
    }

  }
  return null;
};

const hoverUpdate = ({ grid, row, col, rotated, type, ships, currentShip }) => {
  const bool = type === "enter" ? true : false;
    if (row < 11) {
      grid[row][col].hover = bool;
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
  } else if (square.status === "hit") {
    classes += "hit";
  } else if (square.status === "sunk") {
    classes += "sunk";
  }
  return classes;
};

module.exports = {
  placeShip,
  hoverUpdate,
  classUpdate
};
