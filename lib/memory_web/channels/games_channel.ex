defmodule MemoryWeb.GamesChannel do
  use MemoryWeb, :channel

  def join("games:" <> name, payload, socket) do
    if authorized?(payload) do
      {:ok, %{"join" => name}, socket}
    else
      {:error, %{reason: "unauthorized"}}
    end
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
