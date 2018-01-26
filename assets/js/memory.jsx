import React from 'react';
import ReactDOM from 'react-dom';
import { Button } from 'reactstrap';

export default function run_memory(root) {
  ReactDOM.render(<MemoryGame />, root);
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
      letters: "ABCDEFGH",
      board: [],
      completed: "",
      activeTile: "",
      clicks: 0,

    };
  }


  componentDidMount() {
    // shuffle letters and put them on the board
    function makeBoard(params) {
        let letters = params.letters;
        // duplicate each letter to complete a full board
        let fullBoard = letters.repeat(2).split("");
        let i = 0;
        while (i < fullBoard.length) {
          var r = Math.floor(Math.random() * fullBoard.length);
          let temp = fullBoard[r];
          fullBoard[r] = fullBoard[i];
          fullBoard[i] = temp;
          i++;
        }
        console.log(fullBoard);
        return fullBoard;
    }

    let board = makeBoard(this.state);
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

  checkTile(tile) {
    if (this.state.activeTile === "") {
      let state = _.extend(this.state, {
        activeTile: tile, });
      this.setState(state);

    } else {
      let completed = this.state.completed;
      if (tile === this.state.activeTile) {
        completed = completed += tile;
      }
      let state = _.extend(this.state, {
        completed: completed,
        activeTile: "", });
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
  let completed = root.completed();
  //return <div>{tiles.length}</div>

  let boxes = _.map(tiles, (tile, ii) => {
    let display = completed.includes(tile) ? tile : " ";
    return <div className="tile col-3" key={ii} onClick= {
      () => props.root.checkTile(tile)}> {display} </div>;
    });

    return (
      <div className="board">
      <div className="row">
        {boxes}
        </div>
      </div>
    );
  }
