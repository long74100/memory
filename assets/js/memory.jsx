import React from 'react';
import ReactDOM from 'react-dom';
import { Button } from 'reactstrap';

export default function run_memory(root, channel) {
  ReactDOM.render(<MemoryGame channel={channel}/>, root);
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
    this.channel = props.channel;
    this.state = { board:[] };

    this.channel.join()
        .receive("ok", this.gotView.bind(this))
        .receive("error", resp => { console.log("Unable to join", resp) });

    this.gotView = this.gotView.bind(this);
  }

  gotView(view) {
    this.setState(view.game);
  }

  reset() {
    this.channel.push("reset")
      .receive("ok", this.gotView);
  }

  // changes the status of the tile at a position to active or complete
  flipTile(pos, status) {
    this.channel.push("flip", {position: pos, status: status})
      .receive("ok", this.gotView);
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
        <Board root={this} channel={this.channel}/>
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
  let channel = props.channel;
  let root = props.root;
  let tiles = root.state.board;

  let tileBoxes = _.map(tiles, (tile, ii) => {
    function classNames() {
      let bgClass = (tile.status === "complete" ? "bg-success" : "");
      return "tile col-md-3 card " + bgClass;
    }

    function handleClick() {
        function delayAndReset(view) {
          root.gotView(view);
          root.changeClickPerm();

          setTimeout(function() {
            root.changeClickPerm();
            channel.push("resetActives")
            .receive("ok", root.gotView)
            }, 1200);
        }

        if (!root.state.disableClick) {
          channel.push("checkTile", {position: ii})
          .receive("ok", root.gotView)
          .receive("delay", delayAndReset);
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
