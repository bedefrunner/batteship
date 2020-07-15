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
  const [winner, setWinner] = useState();
  const [sunkShips, setSunkShips] = useState(0);

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
    handleCancel();
  }

  const fetchNewFireAction = async (shipId, targetRow, targetColumn) => {
    setMyTurn(false);
    const body = {
      action: {
        type: 'FIRE',
        ship: shipId,
        row: targetRow - 1,
        column: targetColumn - 1,
      }
    }
    const response = await newAction(gameId, body);
    handleOponentAction(response);
    setMyTurn(true);
    handleCancel();
  }

  useEffect(() => {
    console.log('GAME ID:', gameId);
    if (!gameId) {
      fetchNewGame();
    }
  });

  const handleWinner = (winner) => {
    setWinner(winner);
  }
  
  const handleNewGame = () => {
    setMyTurn(true);
    setGameStarted(false);
    setAction(null);
    setGrid(generateGrid());
    setShips(getNewShips());
    setSelectedShip(null);
    setLogs({});
    setGameId(null);
    setLoadingNewGame(false);
    setWinner(null);
    setSunkShips(0);
    fetchNewGame();
  }

  const handleOponentAction = (response) => {
    console.log('Response:', response);
    const { type, ship } = response.action;
    const { events } = response;
    let newLogs = [];
    // handle computer events
    events && events.forEach(e => {
      if (e.type === 'ALL_SHIPS_DESTROYED') {
        newLogs.push(`[COMPUTER]: ALL_SHIPS_DESTROYED`);
        handleWinner('player');
      } else if (e.type === 'HIT_SHIP') {
        newLogs.push(`[COMPUTER]: [HIT] Ship ${e.ship}`);
      } else if (e.type === 'SHIP_DESTROYED') {
        newLogs.push(`[COMPUTER]: [DESTROYED] Ship ${e.ship}`);
      }
    });
    // computer moves
    if (type === 'MOVE') {
      const { direction, quantity } = response.action;
      newLogs.push(`[COMPUTER]: MOVE - ${ship} - ${direction} - ${quantity}`);    
    } // computer fires 
    else if (type === 'FIRE') {
      const { row, column } = response.action;
      const coordinate = getGridCoordinate(row + 1, column + 1);
      newLogs.push(`[COMPUTER]: FIRE - ${ship} - ${coordinate}`);
      // computer hits one of my ships
      if (grid[row + 1][column + 1].ship) {
        const ship = grid[row + 1][column + 1].ship;
        newLogs.push(`[USER]: [HIT] Ship ${ship.id}`);
        newLogs.push(`[USER]: [DESTROYED] Ship ${ship.id}`);
        handleHitShip(row + 1, column + 1, newLogs);
      }
    }
    handleLog(newLogs);
  }

  const handleHitShip = (row, col, newLogs) => {
    const newGrid = getNewGrid(grid);
    newGrid[row][col].status = 'sunk';
    setGrid(newGrid);
    sunkShips += 1;
    setSunkShips(sunkShips + 1);
    if (sunkShips === 10) {
      newLogs.push('[USER]: ALL_SHIPS_DESTROYED');
      handleLog(newLogs);
      handleWinner('computer');
    }
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

  const handleLog = (messages) => {
    let size = Object.keys(logs).length;
    messages.forEach(message => {
      logs[size] = message;
      size += 1;
    });
    setLogs(logs);
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
    handleLog([`[USER]: MOVE - ${ship.id} - ${direction} - ${quantity}`]);

    await fetchNewMoveAction(ship.id, direction, quantity);
  }

  const handleFire = async (targetRow, targetCol) => {
    const coordinate = getGridCoordinate(targetRow, targetCol);
    handleLog([`[USER]: FIRE - ${selectedShip.id} - ${coordinate}`]);
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
    );
  }

  if (winner) {
    return (
      <div className="game">
        <div className="title-container">
          <h1 className="title">IIC2513 Battleship</h1>
          {winner === 'player' && <h2>You win!</h2>}
          {winner === 'computer' && <h2>Game over :(</h2>}
          <button class="new-game-button" onClick={() => handleNewGame()}>New game</button>
        </div>
      </div>
    );
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
            <p>Before start, drag and drop your ships to the board</p>
            {renderShips()}
            <button className="reset-button" onClick={() => handleReset()}>Reset</button>
            {!allShipsDisplayed() && 
              <button className="play-button" disabled>Play</button>
            }
            {allShipsDisplayed() && 
              <button className="play-button" onClick={() => handlePlay()}>Play</button>
            }
          </div>
        }
        {gameStarted &&
          <>
          <div className="select-option-container">
            {myTurn && <p>Your turn! Select an action:</p>}
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
          <button className="button-surrender" onClick={() => handleWinner('computer')}>Surrender</button>
          </>
        }
      </div>
    </div>
  );
}