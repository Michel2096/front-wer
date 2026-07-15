import { io, Socket } from "socket.io-client";
import { getBaseUrl, getSessionCookie } from "@/services/api";

let socket: Socket | null = null;

export async function connectSocket(): Promise<Socket> {
  if (socket?.connected) return socket;
  const baseUrl = await getBaseUrl();
  const cookie = getSessionCookie();
  socket = io(baseUrl, {
    transports: ["websocket"],
    withCredentials: true,
    reconnection: true,
    reconnectionAttempts: Infinity,
    reconnectionDelay: 1500,
    // React Native no reenvía cookies automáticamente a un WebSocket como lo
    // haría un navegador; sin este header el backend nunca ve la sesión de
    // Flask y rechaza la conexión del socket (session.get("user_id") es None).
    extraHeaders: cookie ? { Cookie: cookie } : undefined,
  });
  return socket;
}

export function getSocket(): Socket | null {
  return socket;
}

export function disconnectSocket(): void {
  socket?.disconnect();
  socket = null;
}
