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
    case _checkTile(game.board, game.activeTilePos, position) do
      {:flipActive} ->
        game = flipTile(game, position, "active")
        |> Map.put(:activeTilePos, position)
        |> Map.put(:clicks, game.clicks+1)

        {:ok, game}
      {:complete} ->
        game = flipTile(game, position, "complete")
        |> flipTile(game.activeTilePos, "complete")
        |> Map.put(:activeTilePos, -1)
        |> Map.put(:clicks, game.clicks+1)

        {:ok, game}
      {:flipAndReset} ->
        game = flipTile(game, position, "active")
        |> Map.put(:activeTilePos, -1)
        |> Map.put(:clicks, game.clicks+1)
        {:delay, game}
      {:stay} ->
        {:ok, game}
    end
  end
  def _checkTile(board, active, current) when active == -1  do
    current = Enum.at(board, current)
    if current.status != "complete" do
      {:flipActive}
    else
      {:stay}
    end
  end
  def _checkTile(board, active, current) when active != current do
    activeValue = getTileValue(board, active)
    currentValue = getTileValue(board, current)

    if activeValue == currentValue do
      {:complete}
    else
      {:flipAndReset}
    end
  end

  def flipTile(game, position, status) do
    %{value: x} = game.board
    |> Enum.at(position)

    board = game.board
    |> List.replace_at(position, %{value: x, status: status})

    Map.put(game, :board, board)
  end

  def resetActives(game) do
    board = game.board
    |> Enum.map(fn x -> if x.status == "active" do %{value: x.value, status: "hidden"} else x end end)
    Map.put(game, :board, board)
  end

  def reset() do
    new()
  end

  def getTileValue(board, pos) do
    board
    |> Enum.at(pos)
    |> (fn x -> x.value end).()
  end

end
