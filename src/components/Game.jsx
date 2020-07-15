import React, { useState, useEffect, useCallback } from 'react';
import { generateGrid, getNewShips, createPlayer } from '../utils/gameHelpers';
import Grid from './Grid';
import "../styles/Game.css";
import ShipSelector from './shipSelector';


export default function Game() {
  const [myTurn, setMyTurn] = useState(true);
  const [gameStarted, setGameStarted] = useState(false);
  const [action, setAction] = useState();
  const [grid, setGrid] = useState(generateGrid());
  const [ships, setShips] = useState(getNewShips());

  const updateGrid = (row, col) => {
  }

  const onShipDrop = (row, col, shipType) => {
    if (grid[row][col].status === 'occupied') {
      return null;
    }
    let newGrid = [];
    for (let i = 0; i < grid.length; i++) {
      newGrid[i] = grid[i].slice();
    }
    newGrid[row][col] = { status: "occupied", hover: false, hit: false, type: shipType };
    setGrid(newGrid);

    updateDisplayedShips(shipType);
  }

  const updateDisplayedShips = (shipType) => {
    let newShips = ships.slice();
    const shipIndex = newShips.findIndex(s => s.type === shipType);
    newShips[shipIndex].displayed = true;
    setShips(newShips);
  }

  const allShipsDisplayed = () => {
    return ships.every(ship => ship.displayed);
  }

  const handleReset = () => {
    setShips(getNewShips());
    setGrid(generateGrid());
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

  const handlePlay = () => {
    setGameStarted(true);
  }

  const handleAction = (action) => {
    setAction(action);
  }

  const renderShips = () => {
    return ships.map(ship => {
      const dragStart = (e) => {
        e.dataTransfer.setData("draggableInfo", ship.type);
      }
      return(
        ship.displayed ?
        <button className="normal-button" disabled>{ship.type}</button>
        :
        <button draggable onDragStart={dragStart}>{ship.type}</button>
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
        {!gameStarted && 
          <div className="select-option-container">
            {renderShips()}
            <button className="reset-button" onClick={() => handleReset()}>Reset</button>
            {allShipsDisplayed() && 
              <button className="play-button" onClick={() => handlePlay()}>Play</button>
            }
          </div>
        }
        {gameStarted &&
          <div className="select-option-container">
            <button onClick={() => handleAction('move')}>Move</button>
            <button onClick={() => handleAction('fire')}>Fire</button>
          </div>
        }
      </div>
    </div>
  );
}