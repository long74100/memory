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
      activeTile: -1,
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
      completed: "",
      activeTile: -1,
      clicks: 0,
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

  // reset the game
  reset() {
    this.componentDidMount();
  }

  // shuffle an array
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
    console.log(this.state.activeTile);
    if (this.state.activeTile == -1) {
      alert("hi");
      this.flipActive(ii);
        // var myVar;
        //
        // function myFunction() {
        //     myVar = setTimeout(alertFunc, 3000);
        // }
        //
        // function alertFunc() {
        //     alert("Hello!");
        // }
        // myFunction();

    } else {
      if (tile.value === this.state.board[this.state.activeTile]) {
          alert("yo");
      }

    }

  }

  // changes the status of the tile at the position to active
  flipActive(pos) {
    let board = this.state.board.slice(0);
    board[pos].status = "active";
    let state = _.extend(this.state, {
      activeTile: pos,
      board: board,
      clicks: this.state.clicks + 1 });
    this.setState(state);
  }

  flipComplete(tile, pos) {
    // let board = this.state.board.slice(0);
    // if (tile.value === activeTile) {
    //   board = _map(board, (tile, ii) => {
    //     let t = tile.value === activeTile ? { value: tile.value, status: "complete"} : tile;
    //     return t;
    //   })
    // } else {

    }

  //   // activeTile = ;
  //   // let state = _.extend(this.state, {
  //   //   board: board });
  //   //   this.setState(state);
  // }

  render() {
    return (
      <div className ="container">
        <Board root={this} />
        <div className="row gadgets">
        <Clicks clicks={this.state.clicks} />
        <Reset reset={this.reset.bind(this)} />
        </div>
      </div>
    );
  }

}

function Clicks(params) {
  return <div className="col-md-6">
  <p><b>Clicks: {params.clicks}</b></p>
  </div>;
}

function Reset(params) {
  return (
    <div className="col-md-6">
    <Button onClick={params.reset}>Reset Game</Button>
    </div>
  )

}

function Board(props) {
  let root = props.root;
  let tiles = root.tiles();

  let boxes = _.map(tiles, (tile, ii) => {
    let display =  tile.status === "active" ? tile.value : "?";
    return <div className="tile col-md-3 card" key={ii} onClick= {
        () => root.checkTile(tile, ii)}> <p>{display}</p> </div>;
      });

      return (
        <div className="board">
          <div className="row">
            {boxes}
          </div>
        </div>
      );
    }
