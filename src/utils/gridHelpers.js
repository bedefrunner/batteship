const updateCellClass = cell => {
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

module.exports = {
  updateCellClass
};