defmodule MemoryWeb.GamesChannel do
  use MemoryWeb, :channel

  def join("games:" <> name, payload, socket) do
    if authorized?(payload) do
      game = Memory.GameBackup.load(name) || Memory.Game.new()
      socket = socket
      |> assign(:game, game)
      |> assign(:name, name)
      {:ok, %{"join" => name, "game" => Memory.Game.client_view(game)}, socket}
    else
      {:error, %{reason: "unauthorized"}}
    end
  end

  def handle_in("checkTile", %{"position" => pos}, socket) do
    {type, game} = Memory.Game.checkTile(socket.assigns[:game], pos)
    socket = assign(socket, :game, game)
    Memory.GameBackup.save(socket.assigns[:name], game)
    {:reply, {type, %{ "game" => Memory.Game.client_view(socket.assigns[:game])}}, socket}
  end

  def handle_in("reset", payload, socket) do
    game = Memory.Game.reset()
    Memory.GameBackup.save(socket.assigns[:name], game)
    socket = assign(socket, :game, game)
    {:reply, {:ok, %{ "game" => Memory.Game.client_view(game)}}, socket}
  end

  def handle_in("resetActives", payload, socket) do
    game = Memory.Game.resetActives(socket.assigns[:game])
    Memory.GameBackup.save(socket.assigns[:name], game)
    socket = assign(socket, :game, game)
    {:reply, {:ok, %{ "game" => Memory.Game.client_view(game)}}, socket}
  end

  # Add authorization logic here as required.
  defp authorized?(_payload) do
    true
  end
end
