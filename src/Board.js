import React, { useState } from "react";
import Cell from "./Cell";
import "./Board.css";

/** Game board of Lights out.
 *
 * Properties:
 *
 * - nrows: number of rows of board
 * - ncols: number of cols of board
 * - chanceLightStartsOn: float, chance any cell is lit at start of game
 *
 * State:
 *
 * - board: array-of-arrays of true/false
 *
 *    For this board:
 *       .  .  .
 *       O  O  .     (where . is off, and O is on)
 *       .  .  .
 *
 *    This would be: [[f, f, f], [t, t, f], [f, f, f]]
 *
 *  This should render an HTML table of individual <Cell /> components.
 *
 *  This doesn't handle any clicks --- clicks are on individual cells
 *
 **/

function Board({ nrows = 5, ncols = 7, chanceLightStartsOn = 0.5 }) {
  const [board, setBoard] = useState(createBoard());

  /** create a board nrows high/ncols wide, each cell randomly lit or unlit */
  function createBoard() {
    let initialBoard = [];
    //TODO: better to be more consistent with .from or .map dont swap
    for (let i = 0; i < nrows; i++) {
      let row = Array.from({ length: ncols });
      initialBoard.push(row.map(x =>
        Math.random() > chanceLightStartsOn
      ));
    }
    return initialBoard;
  }

  /** Player wins if for the entire board, all cells has isLit = false */
  function hasWon() {
    return board.every(row => row.every(c => c === false));
  }

  /** Given an "y-x" coord string,
   * flip cell and cell positionned above, below, left, right in the board
   * return a copy of the new board
   *
  */
  function flipCellsAround(coord) {
    setBoard(oldBoard => {
      const [y, x] = coord.split("-").map(Number);

      const flipCell = (y, x, boardCopy) => {
        // if this coord is actually on board, flip it

        //TODO: could refactor
        if (x >= 0 && x < ncols && y >= 0 && y < nrows) {
          boardCopy[y][x] = !boardCopy[y][x]; //toggles cell at "y-x" coord
        }
        if (x + 1 < ncols && y >= 0 && y < nrows) {
          boardCopy[y][x + 1] = !boardCopy[y][x + 1]; //toggles cell at "y-x+1"
        }
        if (x - 1 >= 0 && y >= 0 && y < nrows) {
          boardCopy[y][x - 1] = !boardCopy[y][x - 1]; //toggles cell at "y-x-1"
        }
        if (x >= 0 && x < ncols && y - 1 >= 0) {
          boardCopy[y - 1][x] = !boardCopy[y - 1][x]; //toggles cell at "y-1-x"
        }
        if (x >= 0 && x < ncols && y + 1 < nrows) {
          boardCopy[y + 1][x] = !boardCopy[y + 1][x]; //toggles cell at "y+1-x"
        }
      };

      // make a deep copy to assign new identity to board
      const boardCopy = oldBoard.map(row =>
        row.map(column =>
          column));
      flipCell(y, x, boardCopy);
      return boardCopy;
    });
  }

  //TODO: key for row and columns
  const tableBoard = board.map((row, y) =>
    <tr key={y}>
      {row.map((col, x) =>
        < Cell
          flipCellsAroundMe={() => flipCellsAround(`${y}-${x}`)}
          isLit={col}
          key={`${y}-${x}`}
        />)}
    </tr>);

  // if the game is won, just show a winning msg & render nothing else
  // render the board if game is ongoing
  if (hasWon()) {
    return <h1>You Won</h1>;
  }
  return (
    <table className="Game-board">
      <tbody>
        {tableBoard}
      </tbody>
    </table>
  );

}

export default Board;
