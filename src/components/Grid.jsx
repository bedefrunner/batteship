import React, { useState, useCallback } from 'react';
import Cell from './Cell';
import PropTypes from 'prop-types';
import "../styles/Grid.css";


export default function Grid({ grid, onShipDrop, onClickCell }) {

  const renderSquares = () => {
    return grid.map((row, i) => {
      return row.map((cell, j) => {
        return (
          <Cell
            i={i}
            j={j}
            cell={cell}
            onClickCell={onClickCell}
            onShipDrop={onShipDrop}
          />
        );
      });
    });
  }
    
  return (
    <div className="grid-container">
      <div className="grid">{renderSquares()}</div>
    </div>
  );
}