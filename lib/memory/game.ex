defmodule Memory.Game do
  def new() do
    %{:letters => "ABCDEFGH"}
  end
  def client_view(game) do
    letters = game.letters
    %{  board: generateBoard(letters),
        activeTilePos: -1,
        clicks: 0,
        disableClick: false, }
  end
  def generateBoard(letters) do
    letters
    |> String.duplicate(2)
    |> String.split("")
    |> Enum.shuffle
    |> Enum.filter(&(&1 != ""))

  end
  def reset() do
    new() |> generateBoard
  end

  @docp """

  """
end
