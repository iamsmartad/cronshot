import ReconnectingWebSocket from "reconnecting-websocket";

export default function GetSocket(): ReconnectingWebSocket {
  const options = {
    connectionTimeout: 1000,
    maxRetries: 20,
    maxReconnectionDelay: 20000,
    minReconnectionDelay: 1000 + Math.random() * 4000,
    reconnectionDelayGrowFactor: 1.3,
  };

  var loc = window.location;

  // default
  var new_uri = "ws://localhost:8080/ws"

  // if .env var is set
  if (process.env.REACT_APP_WS_URL) {
    new_uri = process.env.REACT_APP_WS_URL
  }

  // if in production
  if (process.env.NODE_ENV === "production") {
      new_uri = "wss://" + loc.host + "/ws";
  }

  var sock = new ReconnectingWebSocket(
    new_uri,
    [],
    options
  );
  return sock;
};
