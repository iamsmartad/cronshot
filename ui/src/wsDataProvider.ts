import ReconnectingWebSocket from "reconnecting-websocket";

export default function GetSocket(): ReconnectingWebSocket {
  const options = {
    connectionTimeout: 1000,
    maxRetries: 20,
    maxReconnectionDelay: 20000,
    minReconnectionDelay: 1000 + Math.random() * 4000,
    reconnectionDelayGrowFactor: 1.3,
  };
  var sock = new ReconnectingWebSocket(
    "wss://snap.iamstudent.dev/ws",
    [],
    options
  );
  return sock;
};
