import React, { useState, useCallback } from 'react';
import Cell from './Cell';
import PropTypes from 'prop-types';
import "../styles/Grid.css";


export default function Grid({ grid, myTurn, gameStarted, onShipDrop }) {

  const handleClick = (row, col) => {
    // const data = {
    //   grid: grid.slice(),
    //   row,
    //   col,
    // };
    // const gameUpdate = placeShip(data);
    // if (gameUpdate) {
    //   this.props.updateGrids(this.props.player, gameUpdate.grid, "shipsGrid");
    //   this.props.updateShips(this.props.player, gameUpdate.ships, "shipsGrid");
    //   this.setState({ currentShip: null });
    // }
  };

  const renderSquares = () => {
    return grid.map((row, i) => {
      return row.map((cell, j) => {
        return (
          <Cell
            key={`${i}${j}`}
            i={i}
            j={j}
            gameStarted={gameStarted}
            cell={cell}
            handleClick={handleClick}
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