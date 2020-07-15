import React from "react";

import "../styles/GameLog.css";

const GameLog = ({ logs }) => {
  return (
    <div className="gamelog-container">
      {logs.map((log, i) => {
        return (
          <p> {log} </p>
        );
      })}
    </div>
  );
};

export default GameLog;