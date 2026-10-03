const socketIO = require('socket.io');

let io = null;

const initSocket = (server, clientUrl) => {
  io = socketIO(server, {
    cors: {
      origin: true,
      methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
      credentials: true,
    },
  });

  io.on('connection', (socket) => {
    console.log(`🔌 New WebSockets Client Connected: ${socket.id}`);

    // Join room identified by user ID
    socket.on('join_user_room', (userId) => {
      if (userId) {
        socket.join(`user_${userId}`);
        console.log(`👤 Socket ${socket.id} joined user room: user_${userId}`);
      }
    });

    socket.on('disconnect', () => {
      console.log(`🔌 WebSockets Client Disconnected: ${socket.id}`);
    });
  });

  return io;
};

const getIO = () => {
  if (!io) {
    throw new Error('Socket.IO not initialized');
  }
  return io;
};

/**
 * Emit a real-time notification to a specific user's socket room
 */
const emitNotificationToUser = (userId, notificationData) => {
  if (io) {
    io.to(`user_${userId}`).emit('new_notification', notificationData);
  }
};

module.exports = {
  initSocket,
  getIO,
  emitNotificationToUser,
};
