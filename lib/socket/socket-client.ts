import { io, Socket } from "socket.io-client";

let socketInstance: Socket | null = null;

export function getSocket(): Socket | null {
  if (typeof window === "undefined") {
    return null;
  }

  if (!socketInstance) {
    const socketUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
    socketInstance = io(socketUrl, {
      transports: ["websocket", "polling"],
      reconnection: true,
      reconnectionAttempts: 10,
      reconnectionDelay: 1000,
      autoConnect: true
    });
  }

  return socketInstance;
}
