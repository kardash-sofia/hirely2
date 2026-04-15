import { io, Socket } from 'socket.io-client';

let socket: Socket | null = null;

export const connectSocket = (token: string) => {
  socket = io(import.meta.env.VITE_API_URL, {
    auth: {
      token,
    },
  });

  return socket;
};

export const getSocket = () => socket;