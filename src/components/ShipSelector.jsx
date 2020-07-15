import React, { Component } from "react";

export default class ShipSelector extends Component {
    constructor(props) {
      super(props);
    
      this.handleClick = this.handleClick.bind(this);
    }


    handleClick() {
        this.props.handleClick(this.props.ship);
        this.props.ship.disabled = true;
    }

    render() { 
        const { ship } = this.props;
        return (
          ship.disabled ?
          <button type="button" className="ships-selector-button" disabled>{ship.type}</button>
          :
          <button type="button" className="ships-selector-button" onClick={this.handleClick}>{ship.type}</button>
        );
      }
}