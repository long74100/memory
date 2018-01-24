import React from 'react';
import ReactDOM from 'react-dom';
import { Button } from 'reactstrap';

export default function run_memory(root) {
  ReactDOM.render(<MemoryGame />, root);
}

// App state for MemoryGame is:
// {
//    letters: String    // letters used in the game
//    board: Tile[]      // the current board of the game
//    completed:Strin    // tiles completed so far
//    clicks: int        // clicks so far
// }
//

class Tile {
  constructor(value, complete) {
    this.val = value;
    this.complete = complete;
  }

  get value() {
    return this.val;
  }

  get complete() {
    return this.complete;
  }

  set value(val) {
    this.val = val;
  }

}


class MemoryGame extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      letters: "ABCDEFGH",
      board: this.add(),
      completed: "",
      clicks: 0,

    };

  }

  add() {
    let t = new Tile('A', 2);
    return [t];
  }




  tileLetters() {
    return this.state.board;
  }

  render() {

    return (
      <div className ="container">
      <div>
        <Tiles root={this} />
        </div>
      </div>
    );
  }

}

function Tiles(params) {
  let root = params.root;
  let letters = _.map(root.tileLetters(), (xx, ii) => {
    return <span key={ii}>{xx.value()}</span>;
  })

  return (
    <div>
      {letters}
    </div>
  )

}
