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
        row.push({ status: "empty", hover: false, hit: false, type: null });        
      }
    }
    grid.push(row);
  }
  return grid;
};


export const getNewShips = () => {
  return [
    { type: "F1", positions: [], moveRange: 4, fireRange: 2, displayed: false },
    { type: "F2", positions: [], moveRange: 4, fireRange: 2, displayed: false },
    { type: "F3", positions: [], moveRange: 4, fireRange: 2, displayed: false },
    { type: "F1", positions: [], moveRange: 4, fireRange: 2, displayed: false },
    { type: "C1", positions: [], moveRange: 3, fireRange: 2, displayed: false },
    { type: "C2", positions: [], moveRange: 3, fireRange: 2, displayed: false },
    { type: "C3", positions: [], moveRange: 3, fireRange: 2, displayed: false },
    { type: "D1", positions: [], moveRange: 2, fireRange: 3, displayed: false },
    { type: "D2", positions: [], moveRange: 2, fireRange: 3, displayed: false },
    { type: "P1", positions: [], moveRange: 1, fireRange: 5, displayed: false },
  ]
}

