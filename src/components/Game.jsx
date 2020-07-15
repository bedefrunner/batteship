import React, { useState, useEffect, useCallback } from 'react';
import { generateGrid, generateGrid2, createPlayer } from '../utils/gameHelpers';
import Grid from './Grid';
import "../styles/Game.css";
import ShipSelector from './shipSelector';


export default function Game() {
  const [myTurn, setMyTurn] = useState(true);
  const [gameStarted, setGameStarted] = useState(false);
  const [moving, setMoving] = useState(false);
  const [firing, setFiring] = useState(false);
  const [player, setPlayer] = useState(createPlayer());
  const [grid, setGrid] = useState(generateGrid());


  const updateGrid = (row, col) => {
  }

  const onShipDrop = (cell, i, j) => {
    console.log('onShipDrop!!!!!!!!!!!');
    console.log(cell, i, j);
    let newGrid = [];
    for (let i = 0; i < grid.length; i++) {
      newGrid[i] = grid[i].slice();
    }
    newGrid[i][j] = cell;
    setGrid(newGrid);
  }

  const renderGrid = () => {
    return (
      <Grid
        grid={grid}
        myTurn={myTurn}
        gameStarted={gameStarted}
        updateGrid={updateGrid}
        onShipDrop={onShipDrop}
      />
    );
  }

  const handleShipSelect = (selectedShip) => {
    const newPlayer = {...player};
    newPlayer.ships.forEach(ship => {
      if (ship.type === selectedShip.type) {
        ship.displayed = true;
      }
    })
    setPlayer(newPlayer);

  }

  const renderShips = () => {
    return player.ships.map(ship => {
      const dragStart = (e) => {
        e.dataTransfer.setData("draggableInfo", ship.type);
      }
      return(
        ship.displayed ?
        <button type="button" className="ships-selector-button" disabled>{ship.type}</button>
        :
        <button draggable onDragStart={dragStart} type="button" className="ships-selector-button" onClick={() => handleShipSelect(ship)}>{ship.type}</button>
      )
    })
  }

  return (
    <div className="game">
      <div className="title-container">
        <h1 className="title">IIC2513 Battleship</h1>
      </div>
      <div className="shipgrid-container">
        <div>{renderGrid()}</div>
        <div className="select-ships-container">
          {renderShips()}
        </div>
      </div>
    </div>
  );
}