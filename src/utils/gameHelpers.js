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

const makeShips = () => {
  return [
    { type: "F1", positions: [], moveRange: 4, fireRange: 2, disabled: false },
    { type: "F2", positions: [], moveRange: 4, fireRange: 2, disabled: false },
    { type: "F3", positions: [], moveRange: 4, fireRange: 2, disabled: false },
    { type: "F4", positions: [], moveRange: 4, fireRange: 2, disabled: false },
    { type: "C1", positions: [], moveRange: 3, fireRange: 2, disabled: false },
    { type: "C2", positions: [], moveRange: 3, fireRange: 2, disabled: false },
    { type: "C3", positions: [], moveRange: 3, fireRange: 2, disabled: false },
    { type: "D1", positions: [], moveRange: 2, fireRange: 3, disabled: false },
    { type: "D2", positions: [], moveRange: 2, fireRange: 3, disabled: false },
    { type: "P1", positions: [], moveRange: 1, fireRange: 5, disabled: false },
  ];
}

const gridGenerator = () => {
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
        row.push({ status: "empty", hover: false, hit: false, type: null });        
      }
    }
    grid.push(row);
  }
  return grid;
};

const createPlayer = () => {
  return {
    shipsGrid: gridGenerator(),
    movesGrid: gridGenerator(),
    ships: makeShips(),
    shipsSet: false,
    sunkenShips: 0
  }
}

const welcomeMessage = { 
  turn: "Welcome to battleship!",
  messages: ["Players first choose the positions that they would like their battleships to be on the Ship grids below. Once the second player has chosen ship positions, players have a few seconds to head up to the battle grids to fight.", "The Battle Grid identifies a miss with gray, a hit with light green, and a sunken ship with dark green. You can not hit the same spot twice.", "Once a player sinks all of the opponent's ships, the game is over!"]
}


module.exports = {
  createPlayer,
  welcomeMessage
}