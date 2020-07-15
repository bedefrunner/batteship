import React, { useState, useEffect, useCallback } from 'react';
import { generateGrid, createPlayer } from '../utils/gameHelpers';
import Grid from './Grid';
import "../styles/Game.css";


export default function Game() {
  const [myTurn, setMyTurn] = useState(true);
  const [gameStarted, setGameStarted] = useState(false);
  const [moving, setMoving] = useState(false);
  const [firing, setFiring] = useState(false);
  const [player, setPlayer] = useState(createPlayer());
  const [grid, setGrid] = useState(generateGrid());

  console.log(grid);

  const updateGrid = (row, col) => {
  }

  const renderGrid = () => {
    return (
      <Grid
        grid={grid}
        myTurn={myTurn}
        gameStarted={gameStarted}
        updateGrid={updateGrid}
      />
    );
  }

  return (
    <div className="game">
      <div className="title-container">
        <h1 className="title">IIC2513 Battleship</h1>
      </div>
      <div className="shipgrid-container">
        {renderGrid()}
      </div>
    </div>
  );
}