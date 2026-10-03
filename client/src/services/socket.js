import { io } from 'socket.io-client';

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000';

let socket = null;

export const initSocketClient = (userId) => {
  if (!socket) {
    socket = io(SOCKET_URL, {
      autoConnect: true,
      withCredentials: true,
    });

    socket.on('connect', () => {
      console.log('⚡ Connected to CareerConnect WebSockets Server:', socket.id);
      if (userId) {
        socket.emit('join_user_room', userId);
      }
    });

    socket.on('disconnect', () => {
      console.log('⚡ WebSockets disconnected');
    });
  } else if (userId) {
    socket.emit('join_user_room', userId);
  }

  return socket;
};

export const getSocket = () => socket;

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};
