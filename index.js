// index.js

import express from 'express';
import http from 'http';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import connectDB from './src/db/index.js';
import mainRouter from "./src/routes/index.js";
import errorHandler from './src/middlewares/errorHandler.js';
import { setupSocketServer } from './src/socket/server.js'; // ✅ your socket setup function

dotenv.config();

const app = express();
const server = http.createServer(app); // ✅ Create a raw HTTP server

// Setup socket.io on the HTTP server
setupSocketServer(server); // ✅ Correct usage

// Middlewares
app.use(cors());
app.use(express.json());
app.use(cookieParser());
app.use(morgan('dev'));

// Routes
app.use('/swastic', mainRouter);

// Error handling
app.use(errorHandler);

// Start server
const PORT = process.env.PORT || 8000;
connectDB().then(() => {
  server.listen(PORT, () => {
    console.log(`🚀 Server running at http://localhost:${PORT}`);
  });
});
