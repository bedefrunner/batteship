import React, { useState, useEffect, useCallback } from 'react';

export default function ShipSelector({ ship, handleShipSelect }) {

  const handleClick = () => {
    
  }

  return (
    ship.displayed ?
    <button type="button" className="ships-selector-button" disabled>{ship.type}</button>
    :
    <button type="button" className="ships-selector-button" onClick={() => handleShipSelect(ship)}>{ship.type}</button>
  );

}