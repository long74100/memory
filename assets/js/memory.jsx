import React from 'react';
import ReactDOM from 'react-dom';
import { Button } from 'reactstrap';

export default function run_memory(root) {
  ReactDOM.render(<MemoryGame />, root);
}


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

    function initializeBoard(params) {
        let letters = params.letters;
        let fullBoard = letters.repeat(2).split("");
        let i = 0;
        while (i < fullBoard.length) {
          var r = Math.floor(Math.random() * Math.floor(fullBoard.length));
          let temp = fullBoard[r];
          fullBoard[r] = fullBoard[i];
          fullBoard[i] = temp;
          i++;
        }
        console.log(fullBoard);
        return fullBoard;

    }

    let fullBoard = initializeBoard(this.state);
    let state = _.extend(this.state, {
      board: fullBoard,
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
    return <div className="tile" key={ii}> {display} </div>;
    });

    return (
      <div className="board">
        {boxes}
      </div>
    );
  }
