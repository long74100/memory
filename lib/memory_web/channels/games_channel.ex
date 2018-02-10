defmodule MemoryWeb.GamesChannel do
  use MemoryWeb, :channel

  def join("games:" <> name, payload, socket) do
    if authorized?(payload) do
      game = Memory.Game.new()
      socket = socket
      |> assign(:game, game)
      |> assign(:name, name)
      {:ok, %{"join" => name, "game" => Memory.Game.client_view(game)}, socket}
    else
      {:error, %{reason: "unauthorized"}}
    end
  end

  def handle_in("checkTile", %{"position" => pos}, socket) do
    game = Memory.Game.checkTile(socket.assigns[:game], pos)
    socket = assign(socket, :game, game)
    {:reply, {:ok, %{ "game" => Memory.Game.client_view(socket.assigns[:game])}}, socket}

  end

  def handle_in("reset", payload, socket) do
    game = Memory.Game.reset()
    socket = assign(socket, :game, game)
    {:reply, {:ok, %{ "game" => Memory.Game.client_view(game)}}, socket}
  end



  # It is also common to receive messages from the client and
  # broadcast to everyone in the current topic (games:lobby).
  def handle_in("shout", payload, socket) do
    broadcast socket, "shout", payload
    {:noreply, socket}
  end

  # Add authorization logic here as required.
  defp authorized?(_payload) do
    true
  end
end
