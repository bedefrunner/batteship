import React from "react";
import { updateCellClass } from "../utils/gridHelpers";

const Cell = ({ cell, i, j, handleHover, handleClick, gameStarted }) => {
  if (cell.status === "label") {
    return <div className="grid-square label">{cell.label}</div>;
  }
  if (gameStarted) {
    return (
      <div
        className={updateCellClass(cell)}
        onMouseLeave={() => handleHover(i, j, "leave")}
      />
    );
  }
  return (
    <div
      className={updateCellClass(cell)}
      onMouseEnter={() => handleHover(i, j, "enter")}
      onMouseLeave={() => handleHover(i, j, "leave")}
      onClick={() => handleClick(i, j)}
    >
      <p>{cell.type}</p>
    </div>
  );
};

export default Cell;
