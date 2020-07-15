import React from "react";

import "../styles/GameLog.css";

const GameLog = ({ logs }) => {
  const size = Object.keys(logs).length;
  let sortedLogs = [];
  for (let i=0; i < size; i++) {
    sortedLogs.push(logs[i]);
  }
  return (
    <div className="gamelog-container">
      {sortedLogs.reverse().map((log, i) => {
        return (
          <p> {log} </p>
        );
      })}
    </div>
  );
};

export default GameLog;