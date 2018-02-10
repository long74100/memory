defmodule Memory.Game do
  def new() do
    %{  board: generateBoard("ABCDEFGH"),
        activeTilePos: -1,
        clicks: 0,
        disableClick: false
      }
  end
  def client_view(game) do
    %{  board: game.board,
        activeTilePos: game.activeTilePos,
        clicks: game.clicks,
        disableClick: game.disableClick
      }
  end
  # A board is [{"value" => x, "status" => y}]
  def generateBoard(letters) do
    letters
    |> String.duplicate(2)
    |> String.split("")
    |> Enum.map(fn x -> %{value: x, status: "hidden"} end)
    |> Enum.shuffle
    |> Enum.filter(&(&1.value != ""))
  end

  def checkTile(game, position) do
    if game.activeTilePos == -1 do
      flipTile(game, position, "active")
      |> Map.put(:activeTilePos, position)
    else
      game
    end
  end

  def flipTile(game, position, status) do
    %{value: x} = game.board
    |> Enum.at(position)
    board = game.board
    |> List.replace_at(position, %{value: x, status: status} )
    Map.put(game, :board, board)
    |> Map.put(:clicks, game.clicks+1)

  end

  def reset() do
    new()
  end

  @docp """
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
  """
end
