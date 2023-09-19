import { io } from "socket.io-client";
import { baseURL } from "../api";
const registerWebSocket = () => {
  const socket = io(baseURL, {
    autoConnect: false,
    transports: ["websocket", "polling"],
    path: "/ws",
  });
  return socket;
};

export const socket = registerWebSocket();

export const initializeSocket = (
  token: string,
  sessionId: string | null | undefined
) => {
  socket.auth = { token, sessionId };
  socket.connect();
  return socket;
};

export default registerWebSocket;
