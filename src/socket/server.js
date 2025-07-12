import { Server } from 'socket.io';
import Message from '../models/chart/Message.js';

let ioInstance = null;

export const setupSocketServer = (server) => {
  if (ioInstance) {
    console.log('⚠️ Socket.IO already initialized.');
    return ioInstance;
  }

  const io = new Server(server, {
    cors: {
      origin: process.env.FRONTEND_URL || 'http://localhost:5173',
      methods: ['GET', 'POST'],
      credentials: true,
    },
  });

  ioInstance = io;

  io.on('connection', async (socket) => {
    console.log('✅ User connected:', socket.id, new Date().toISOString());
    socket.join('group');

    try {
      const last50Messages = await Message.find()
        .sort({ createdAt: -1 }) // Newest first
        .limit(50)
        .lean();
      console.log('Sending initial messages:', last50Messages.length);
      socket.emit('initialMessages', last50Messages);
    } catch (err) {
      console.error('Failed to fetch initial messages:', err.message, err.stack);
    }

    socket.on('sendMessage', async (messageText) => {
      console.log('Received sendMessage:', messageText, 'from:', socket.id);
      if (!messageText || typeof messageText !== 'string' || messageText.trim().length === 0) {
        console.warn('Invalid message received:', messageText);
        return;
      }

      const time = new Date().toISOString();
      try {
        const newMessage = await Message.create({
          message: messageText.trim(),
          senderId: socket.id,
          time,
        });
        console.log('Saved message:', newMessage._id);
        io.to('group').emit('receiveMessage', {
          id: socket.id,
          message: newMessage.message,
          time: newMessage.time,
          _id: newMessage._id,
        });
      } catch (err) {
        console.error('Failed to save message:', err.message, err.stack);
      }
    });

    socket.on('disconnect', () => {
      console.log('❌ User disconnected:', socket.id, new Date().toISOString());
    });
  });

  server.on('close', () => {
    ioInstance?.close();
    ioInstance = null;
    console.log('Socket.IO server closed');
  });

  return io;
};