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
  const [selectedShip, setSelectedShip] = useState();

  const updateGrid = (row, col) => {
  }

  const onShipDrop = (row, col, shipId) => {
    if (grid[row][col].status === 'occupied') {
      return null;
    }
    let newGrid = [];
    for (let i = 0; i < grid.length; i++) {
      newGrid[i] = grid[i].slice();
    }
    const ship = ships.filter(s => s.id === shipId)[0];
    ship.position.row = row;
    ship.position.col = col;
    ship.displayed = true;
    newGrid[row][col] = { status: "occupied", hover: false, hit: false, ship: ship };
    setGrid(newGrid);
    updateDisplayedShips(ship);
  }

  const updateDisplayedShips = (ship) => {
    let newShips = ships.slice();
    const shipIndex = newShips.findIndex(s => s.id === ship.id);
    newShips[shipIndex] = ship;
    setShips(newShips);
  }

  const allShipsDisplayed = () => {
    return ships.every(ship => ship.displayed);
  }

  const handleReset = () => {
    setShips(getNewShips());
    setGrid(generateGrid());
  }

  const handleMove = (oldRow, oldCol, newRow, newCol) => {
    let newGrid = [];
    for (let i = 0; i < grid.length; i++) {
      newGrid[i] = grid[i].slice();
    }
    const ship = {...selectedShip};
    ship.position = { row: newRow, col: newCol };
    newGrid[oldRow][oldCol] = { status: "empty", hover: false, hit: false, ship: null }
    newGrid[newRow][newCol] = { status: "occupied", hover: false, hit: false, ship: ship };
    setGrid(newGrid);
    setSelectedShip(null);
    setAction(null);
    //setMyTurn(false);
  }

  const onClickCell = (row, col) => {
    if (!myTurn || !action || !(0 < row < 11) || !(0 < col < 11)) {
      return null;
    }
    const cell = grid[row][col];
  
    // selecting ship
    if (cell.ship && !selectedShip) {
      setSelectedShip(cell.ship);
    }
    // move selected ship
    else if (selectedShip && action === 'move' && cell.status === 'empty') {
      const { row: currentRow, col: currentCol } = selectedShip.position;
      const { moveRange } = selectedShip;
      const okHorizontal = (Math.abs(row - currentRow) <= moveRange) && (currentCol === col);
      const okVertical = (Math.abs(col - currentCol) <= moveRange) && (currentRow === row);
      if (okHorizontal || okVertical) {
        handleMove(currentRow, currentCol, row, col);
      }
    }

  }

  const renderGrid = () => {
    return (
      <Grid
        grid={grid}
        onClickCell={onClickCell}
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
        e.dataTransfer.setData("draggableInfo", ship.id);
      }
      return(
        ship.displayed ?
        <button className="normal-button" disabled>{ship.id}</button>
        :
        <button draggable onDragStart={dragStart}>{ship.id}</button>
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