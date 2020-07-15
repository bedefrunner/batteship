import React, { useState, useEffect, useCallback } from 'react';
import { generateGrid, getNewShips, dictionary, getNewGrid, destinationCellIsOk, getGridCoordinate } from '../utils/gameHelpers';
import Grid from './Grid';
import "../styles/Game.css";
import GameLog from './GameLog';
import { startNewGame, newAction } from '../services/services';


export default function Game() {
  const [myTurn, setMyTurn] = useState(true);
  const [gameStarted, setGameStarted] = useState(false);
  const [action, setAction] = useState(null);
  const [grid, setGrid] = useState(generateGrid());
  const [ships, setShips] = useState(getNewShips());
  const [selectedShip, setSelectedShip] = useState();
  const [logs, setLogs] = useState({});
  const [gameId, setGameId] = useState();
  const [loadingNewGame, setLoadingNewGame] = useState(false);

  const fetchNewGame = useCallback( async () => {
    setLoadingNewGame(true);
    const response = await startNewGame();
    if (response && response.gameId) {
      setGameId(response.gameId);
    }
    setLoadingNewGame(false);
  });

  const fetchNewMoveAction = async (shipId, direction, quantity) => {
    setMyTurn(false);
    const body = {
      action: {
        type: 'MOVE',
        ship: shipId,
        direction,
        quantity
      }
    }
    const response = await newAction(gameId, body);
    handleOponentAction(response);
    setMyTurn(true);
  }

  const fetchNewFireAction = async (shipId, targetRow, targetColumn) => {
    setMyTurn(false);
    const body = {
      action: {
        type: 'FIRE',
        ship: shipId,
        row: targetRow,
        column: targetColumn,
      }
    }
    const response = await newAction(gameId, body);
    handleOponentAction(response);
    setMyTurn(true);
  }

  useEffect(() => {
    if (!gameId) {
      fetchNewGame();
    }
  });

  const handleOponentAction = (response) => {
    console.log('OPONENTs RESPONSE', response);
    const { type, ship, quantity, direction, row, column, events } = response.action;
    // handle computer events
    events.forEach(e => {
      if (e.type === 'ALL_SHIPS_DESTROYED') {
        const newLog = `[COMPUTER]: ALL_SHIPS_DESTROYED`;  // FINISH GAME!!!!
        handleLog(newLog);
      } else if (e.type === 'HIT_SHIP') {
        const newLog = `[COMPUTER]: [HIT] Ship ${e.ship}`;
        handleLog(newLog);
      } else if (e.type === 'SHIP_DESTROYED') {
        const newLog = `[COMPUTER]: [DESTROYED] Ship ${e.ship}`;
        handleLog(newLog);
      }
    })
    // computer moves
    if (type === 'MOVE') {
      const newLog = `[COMPUTER]: MOVE - ${ship} - ${direction} - ${quantity} `;
      handleLog(newLog);      
    } // computer fires 
    else if (type === 'FIRE') {
      const coordinate = getGridCoordinate(row, column);
      const newLog = `[COMPUTER]: FIRE - ${ship} - ${coordinate}`;
      handleLog(newLog);
      // computer hits one of my ships
      if (grid[row][column].ship) {
        const ship = grid[row][column].ship;
        let newLog = `[USER]: [HIT] Ship ${ship.id}`;
        handleLog(newLog);
        newLog = `[USER]: [DESTROYED] Ship ${ship.id}`;
        handleLog(newLog);
        handleHitShip(row, column);
      }
    }
  }

  const handleHitShip = (row, col) => {
    const newGrid = getNewGrid(grid);
    newGrid[row][col].status = 'sinked';
    setGrid(newGrid);
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

  const handleLog = (message) => {
    let newLogs = {...logs}
    const size = Object.keys(newLogs).length;
    newLogs[size] = message;
    console.log(newLogs);
    setLogs(newLogs);
  }


  const handleMove = async (oldRow, oldCol, newRow, newCol) => {
    let newGrid = getNewGrid(grid);
    const ship = {...selectedShip};
    ship.position = { row: newRow, col: newCol };
    newGrid[oldRow][oldCol] = { status: "empty", hover: false, hit: false, ship: null }
    newGrid[newRow][newCol] = { status: "occupied", hover: false, hit: false, ship: ship };
    setGrid(newGrid);
    setSelectedShip(null);
    handleAction(null);
    
    let direction = 'NORTH';
    const quantity = Math.abs(newRow + newCol - oldRow - oldCol);
    if (newRow > oldRow) { direction = 'SOUTH' }
    else if (oldCol < newCol) { direction = 'WEST' }
    else if (newCol < oldCol) { direction = 'EAST' }
    handleLog(`[USER]: MOVE - ${ship.id} - ${direction}`);

    await fetchNewMoveAction(ship.id, direction, quantity);
  }

  const handleFire = async (targetRow, targetCol) => {
    const coordinate = getGridCoordinate(targetRow, targetCol);
    handleLog(coordinate);
    await fetchNewFireAction(selectedShip.id, targetRow, targetCol);
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
      if (destinationCellIsOk(moveRange, currentRow, currentCol, row, col)) {
        handleMove(currentRow, currentCol, row, col);
      }
    }
    // selected ship fires
    else if (selectedShip && action === 'fire') {
      const { row: currentRow, col: currentCol } = selectedShip.position;
      const { fireRange } = selectedShip;
      if (destinationCellIsOk(fireRange, currentRow, currentCol, row, col)) {
        handleFire(row, col);
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

  const handleCancel = () => {
    setAction(null);
    setSelectedShip(null);
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
        <button className="normal-button" draggable onDragStart={dragStart}>{ship.id}</button>
      )
    })
  }

  if (loadingNewGame) {
    return (
      <div className="game">
        <div className="title-container">
          <h1 className="title">IIC2513 Battleship</h1>
          <p>Loading new game...</p>
        </div>
      </div>
    )
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
            <p>Drag and drop your ships to the board</p>
            {renderShips()}
            <button className="reset-button" onClick={() => handleReset()}>Reset</button>
            {allShipsDisplayed() && 
              <button className="play-button" onClick={() => handlePlay()}>Play</button>
            }
          </div>
        }
        {gameStarted &&
          <div className="select-option-container">
            {myTurn && <p>Your turn!</p>}
            {!myTurn && <p>Waiting for you opponent to move...</p>}
            {action === 'move' && 
              <> 
              <button className="button-active">Move</button>
              <button onClick={() => handleAction('fire')}>Fire</button>
              </>
            }
            { action === 'fire' &&
              <>
              <button onClick={() => handleAction('move')}>Move</button>
              <button  className="button-active">Fire</button>
              </>
            }
            { action === null &&
              <>
              <button onClick={() => handleAction('move')}>Move</button>
              <button onClick={() => handleAction('fire')}>Fire</button>
              </>
            }
            <button onClick={() => handleCancel()}>Cancel</button>
            <GameLog logs={logs} />
          </div>
        }
      </div>
    </div>
  );
}