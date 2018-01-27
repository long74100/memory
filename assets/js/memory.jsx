import React from 'react';
import ReactDOM from 'react-dom';
import { Button } from 'reactstrap';

export default function run_memory(letters,root) {
  ReactDOM.render(<MemoryGame letters={letters} />, root);
}

// App state for MemroyGame is:
// {
//    letters: String    // the letters used for the game
//    board:   [int]     // the current board/ location for the letters
//    completed: String  // the letters(tiles) that have been completed
//    activeTile: String // the letter of the tile that has been clicked
//    clicks: int        // the total number of clicks
// }
//

class MemoryGame extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      letters: props.letters,
      board: [],
      completed: "",
      activeTile: "",
      clicks: 0,

    };
  }


  componentDidMount() {
    // shuffle letters and put them on the board
    function makeBoard(params) {
      const board = [];
      // duplicate each letter to complete a full board
      const letters = params.letters.repeat(2);
      for (let i = 0; i < letters.length; i++) {
        board.push({ value: letters.charAt(i), status: "hidden" });
      }

      return board;
    }

    let board = this.shuffleArray(makeBoard(this.state));
    let state = _.extend(this.state, {
      board: board,
    });

    this.setState(state);
  }

  componentWillUnmount() {
    clearInterval(this.timerID);
  }

  tiles() {
    return this.state.board;
  }

  completed() {
    return this.state.completed;
  }

  active() {
    return this.state.activeTile;
  }

  shuffleArray(array) {
    let ar = array.slice(0);
    // shuffle the board
    let i = 0;
    while (i < ar.length) {
      var r = Math.floor(Math.random() * ar.length);
      let temp = ar[r];
      ar[r] = ar[i];
      ar[i] = temp;
      i++;
    }
    return ar;
  }

  checkTile(tile, ii) {
    console.log(tile, ii);
    if (this.state.activeTile === "") {
      let board = this.state.board.slice(0);
      board[ii].status = "active";
      let state = _.extend(this.state, {
        board: board });
        this.setState(state);
    } else {
      let board = this.state.board.slice(0);
      if (tile.value === activeTile) {
        board = _map(board, (tile, ii) => {
          let t = tile.value === activeTile ? { value: tile.value, status: "complete"} : tile;
          return t;
        })
      } else {

      }

      activeTile = "";
      let state = _.extend(this.state, {
        board: board });
        this.setState(state);

    }

  }

  render() {
    return (
      <div className ="container">
        <Board root={this} />
      </div>
    );
  }

}

function Board(props) {
  let root = props.root;
  let tiles = root.tiles();
  //return <div>{tiles.length}</div>

  let boxes = _.map(tiles, (tile, ii) => {
    let display =  tile.status === "active" ? tile.value : " ";
    return <div className="tile col-3 col-md-offset-5 card bg-light" key={ii} onClick= {
        () => root.checkTile(tile, ii)}> {display} </div>;
      });

      return (
        <div className="board">
          <div className="row">
            {boxes}
          </div>
        </div>
      );
    }
