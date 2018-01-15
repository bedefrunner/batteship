const dictionary = {
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

const hoverUpdate = ({ grid, row, col, rotated, type }) => {
  const bool = type === "enter" ? true : false;
  const position = grid[row][col];
  position.hover = bool; 
  return grid;
};

const isSunk = (ship, row, col) => {
  let sunk = true;
  if (!ship) return false;
  ship.positions.forEach(position => {
    if (!(position.hit)) {
      sunk = false;
    }
  });
  return sunk;
}

const placeMove = ({ grid, row, col, rotated, player, opponent }) => {
  if (grid[row][col].status !== "empty") {
    return {
      isUpdated: false
    }
  }
  grid[row][col].hover = false;  
  let turnLog = [];
  turnLog.push(`${player} targeted ${dictionary[col]}${row}`)
  const opponentShipIdx = () => {
    let idx = 0;
    for (let i = 0; i < opponent.ships.length; i++) {
      if (opponent.ships[i].type === opponent.shipsGrid[row][col].type) {
        idx = i;
      }
    }
    return idx; 
  }
  const opponentShip = opponent.ships[opponentShipIdx()]; 
  if (opponent.shipsGrid[row][col].status === "occupied") {
    opponent.shipsGrid[row][col].status = "hit";
    grid[row][col].status = "hit";
    turnLog.push("It's a hit!")
    opponentShip.positions.forEach(position => {
      if (position.row === row && position.col === col) {
        position.hit = true;
      }
    })
    if (isSunk(opponentShip, row, col)) {
      opponent.sunkenShips++; 
      opponentShip.positions.forEach(position => {
        const { row, col } = position;
        opponent.shipsGrid[row][col].status = "sunk"; 
        grid[row][col].status = "sunk";
      }); 
      turnLog.push(`${player} sank a ${opponentShip.type}!`)
      if (opponent.sunkenShips === 4) {
        turnLog.push(`${player} wins!`); 
      }
    }
  } else {
    turnLog.push("It's a miss");
    grid[row][col].status = "miss";
  }
  return {
    grid,
    opponent,
    log: turnLog,
    isUpdated: true
  } 
};

const classUpdate = square => {
  let classes = "grid-square ";
  if (square.status !== "empty" && square.hover) {
    classes += "active-occupied";
  } else if (square.hover) {
    classes += "active";
  } else if (square.status === "hit") {
    classes += "enemy-hit";
  } else if (square.status === "miss") {
    classes += "enemy-miss";
  } else if (square.status === "sunk") {
    classes += "enemy-sunk";
  }
  return classes;
};

module.exports = {
  placeMove,
  hoverUpdate,
  classUpdate 
}