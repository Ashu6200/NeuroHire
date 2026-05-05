const logger = require('../utils/logger');

let _io = null;

const init = (io) => {
  _io = io;

  io.on('connection', (socket) => {
    logger.debug('Socket connected', { socketId: socket.id });

    socket.on('joinRoom', (roomId) => {
      socket.join(roomId);
      logger.debug('Socket joined room', { socketId: socket.id, roomId });
    });

    socket.on('authenticate', (userId) => {
      if (!userId) return;
      const room = `user:${userId}`;
      socket.join(room);
      logger.debug('Socket authenticated to personal room', {
        socketId: socket.id,
        userId,
        room,
      });
    });

    socket.on('disconnect', () => {
      logger.debug('Socket disconnected', { socketId: socket.id });
    });
  });
};

const emitToUser = (userId, event, data) => {
  if (!_io) {
    logger.warn('socketService.emitToUser called before init', { userId, event });
    return;
  }
  _io.to(`user:${userId}`).emit(event, data);
};

const emitToRoom = (room, event, data) => {
  if (!_io) {
    logger.warn('socketService.emitToRoom called before init', { room, event });
    return;
  }
  _io.to(room).emit(event, data);
};

const getIO = () => _io;

module.exports = { init, emitToUser, emitToRoom, getIO };
