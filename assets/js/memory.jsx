import React from 'react';
import ReactDOM from 'react-dom';
import { Button } from 'reactstrap';

export default function run_memory(letters,root) {
  ReactDOM.render(<MemoryGame letters={letters} />, root);
}

// App state for MemroyGame is:
// {
//    letters: String    // the letters used for the game
//    board: [{ value:x ,status:x }]          // the current board
//    completed: String  // the letters(tiles) that have been completed
//    activeTilePos: int // the position of the current active tile
//    clicks: int        // the number of clicks so far
// }

class MemoryGame extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      letters: props.letters,
      board: [],
      activeTilePos: -1,
      clicks: 0,
      disableClick: false,
    };

    this.resetActiveTiles = this.resetActiveTiles.bind(this);
    this.changeClickPerm = this.changeClickPerm.bind(this);
  }


  componentDidMount() {

    function makeBoard(params) {
      // duplicate each letter to complete a full board
      const board = [];
      const letters = params.letters.repeat(2);
      for (let i = 0; i < letters.length; i++) {
        board.push({ value: letters.charAt(i), status: "hidden" });
      }
      return board;
    }

    // shuffle the board
    let board = this.shuffleArray(makeBoard(this.state));
    // reset the state every restart
    let state = _.extend(this.state, {
      board: board,
      activeTilePos: -1,
      clicks: 0,
      disableClick:false,
    });

    this.setState(state);
  }

  componentWillUnmount() {
    clearInterval(this.timerID);
  }

  // reset the game
  reset() {
    this.componentDidMount();
  }

  // shuffle an array
  shuffleArray(array) {
    let ar = array.slice(0);
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

  checkTile(tile, pos) {

    let board = this.state.board;
    let activeTilePos = this.state.activeTilePos;

    if (activeTilePos === -1) {
      this.flipTile(pos, "active");
    } else {
      if (pos != activeTilePos) {
        if (tile.value === board[activeTilePos].value) {
          this.flipTile(pos, "complete");
          //this.resetActiveTiles();
        } else {
          this.flipTile(pos, "active");
          // reset the active tiles (Flip them back to hidden)
        }

        let reset = this.resetActiveTiles;
        let changeClickPerm = this.changeClickPerm;
        changeClickPerm();
        setTimeout(function() {
          reset();
          changeClickPerm();
        }, 1500);
      }
    }

  }

  // changes the status of the tile at a position to active or complete
  flipTile(pos, status) {
    let board = this.state.board.slice(0);
    let activeTilePos = pos;
    board[pos].status = status;

    if (status === "complete") {
      board[this.state.activeTilePos].status = status;
      activeTilePos = -1;
    }

    let state = _.extend(this.state, {
      activeTilePos: activeTilePos,
      board: board,
      clicks: this.state.clicks + 1 });
    this.setState(state);

  }


  resetActiveTiles() {
    let board = this.state.board.slice(0);
    _.map(board, (tile, pos) => {
      let newTile =  tile.status === "active" ? _.extend(tile, {status:"hidden"}) : tile;
      return newTile;
    });

    let state = _.extend(this.state, {
      board: board,
      activeTilePos: -1, });
    this.setState(state);
  }

  changeClickPerm() {
    let state = _.extend(this.state, {
      disableClick: !this.state.disableClick,
    });
    this.setState(state);
  }


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
  return (
    <div className="col-md-6">
        <p><b>Clicks: {params.clicks}</b></p></div>
      );
}

function Reset(params) {
  return (
    <div className="col-md-6">
    <Button onClick={params.reset}>Reset Game</Button>
    </div>
  );

}

function Board(props) {
  let root = props.root;
  let tiles = root.state.board;

  let tileBoxes = _.map(tiles, (tile, ii) => {
    function classNames() {
      let bgClass = (tile.status === "complete" ? "bg-success" : "");
      return "tile col-md-3 card " + bgClass;
    }

    function handleClick() {
      if (!root.state.disableClick) {
        root.checkTile(tile, ii);
      }
    }

    let tileDisplay =  tile.status === "active" ? tile.value : tile.status === "complete" ? "✓": "";
    let tileBox = <div className={classNames(tile.status)} key={ii} onClick= {handleClick}>
      <p>{tileDisplay}</p> </div>;

      return tileBox;
    });

  return (
    <div className="board">
      <div className="row">
        {tileBoxes}
      </div>
    </div>
  );
}
