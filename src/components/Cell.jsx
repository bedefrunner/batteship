import React from "react";
import { updateCellClass } from "../utils/gridHelpers";

const Cell = ({ cell, i, j, onClickCell, onShipDrop }) => {
  if (cell.status === "label") {
    return <div className="grid-square label">{cell.label}</div>;
  }
  const dropIt = (e) => {
    e.stopPropagation();
    e.preventDefault();
    const shipId = e.dataTransfer.getData('draggableInfo');
    onShipDrop(i, j, shipId);
  }
  const dragOver = (e) => {
    e.preventDefault();
  }
  return (
    <div
      onDrop={dropIt}
      onDragOver={dragOver}
      className={updateCellClass(cell)}
      onClick={() => onClickCell(i, j)}
    >
      <p>{cell.ship ? cell.ship.id : null}</p>
    </div>
  );
};

export default Cell;
