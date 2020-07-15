import React, { Component } from "react";
import { placeShip, hoverUpdate } from "../utils/shipGridHelpers";

import ShipGridSquare from "./ShipGridSquare";
import ShipSelector from './ShipSelector';
import "../styles/Grid.css";

export default class ShipGrid extends Component {
  constructor(props) {
    super(props);

    this.state = {
      currentShip: null,
      activeSpot: null
    };

    this.handleHover = this.handleHover.bind(this);
    this.handleClick = this.handleClick.bind(this);
    this.handleShipSelect = this.handleShipSelect.bind(this);
    this.handleReset = this.handleReset.bind(this);
  }

  handleHover(row, col, type) {
    if (this.state.currentShip === null) {
      return null;
    }
    const { grid, ships, currentShip } = this.props;
    const { rotated } = this.state;
    const data = {
      grid: grid.slice(),
      rotated,
      row,
      col,
      type,
      ships,
      currentShip
    };
    const updatedGrid = hoverUpdate(data);
    this.props.updateGrids(this.props.player, updatedGrid, "shipsGrid");
  }

  handleClick(row, col) {
    if (this.state.currentShip === null) {
      return null;
    }
    const { grid, ships } = this.props;
    const data = {
      grid: grid.slice(),
      row,
      col,
      ships,
      currentShip: this.state.currentShip
    };
    const gameUpdate = placeShip(data);
    if (gameUpdate) {
      this.props.updateGrids(this.props.player, gameUpdate.grid, "shipsGrid");
      this.props.updateShips(this.props.player, gameUpdate.ships, "shipsGrid");
      this.setState({ currentShip: null });
    }
  }

  renderSquares() {
    const { activePlayer, player, grid, shipsSet, gameOver } = this.props;
    if (player === activePlayer || gameOver) {
      return grid.map((row, i) => {
        return row.map((square, j) => {
          return (
            <ShipGridSquare
              key={`${i}${j}`}
              i={i}
              j={j}
              shipsSet={shipsSet}
              square={square}
              handleHover={this.handleHover}
              handleClick={this.handleClick}
            />
          );
        });
      });
    } else {
      return null;
    }
  }

  handleShipSelect(ship) {
    this.setState({ currentShip: ship })
  }

  renderShips(reset) {
    const { ships } = this.props;
    return ships.map(ship => {
      return(
        <ShipSelector 
          ship={ship}
          reset={reset}
          handleClick={this.handleShipSelect}
        />
      )
    })
  }

  handleReset() {
    for (let row = 1; row < 11; row++) {
      for (let col = 1; col < 11; col++) {
        this.props.grid[row][col] = { status: "empty", hover: false, hit: false, type: null }
      }
    }
    this.props.ships.forEach(ship => {
      ship.positions = []; 
      ship.disabled = false
    });
    this.setState({ currentShip: null });
    this.props.updateGrids(this.props.player, this.props.grid, "shipsGrid");
    this.renderShips(true);
  }

  render() {
    return (
      <div className="grid-container">
        <p className="grid-title"> Ship Grid </p>
        <div className="grid">{this.renderSquares()}</div>
        <div className="ships-selector-container">{this.renderShips()}</div>
        <button onClick={this.handleReset}>Reset</button>
      </div>
    );
  }
}
