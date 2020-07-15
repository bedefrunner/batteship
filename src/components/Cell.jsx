import React from "react";
import { updateCellClass } from "../utils/gridHelpers";

const Cell = ({ cell, i, j, handleHover, handleClick, gameStarted, onShipDrop }) => {
  if (cell.status === "label") {
    return <div className="grid-square label">{cell.label}</div>;
  }
  if (gameStarted) {
    return (
      <div
        className={updateCellClass(cell)}
      />
    );
  }
  const dropIt = (e) => {
    e.stopPropagation();
    e.preventDefault();
    const shipType = e.dataTransfer.getData('draggableInfo');
    onShipDrop(i, j, shipType);
  }
  const dragOver = (e) => {
    e.preventDefault();
  }
  return (
    <div
      onDrop={dropIt}
      onDragOver={dragOver}
      className={updateCellClass(cell)}
      onClick={() => handleClick(i, j)}
    >
      <p>{cell.type}</p>
    </div>
  );
};

export default Cell;
