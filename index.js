// Load environment variables
import dotenv from 'dotenv';
dotenv.config({ path: './.env' });

import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import connectDB from './src/db/index.js';
import mainRouter from "./src/routes/index.js";
import errorHandler from './src/middlewares/errorHandler.js';

const app = express();

// Middleware setup
app.use(morgan('combined'));
app.use(cors({ origin: process.env.CORS_ORIGIN || '*', credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Debug middleware for request body
app.use((req, res, next) => {
  console.log('Request Body:', req.body);
  next();
});

// Routes
app.use('/swastic', mainRouter);

// Test route
app.get('/test', (req, res) => {
  res.json({ message: 'Test endpoint is working!' });
});

// Error handler middleware
app.use(errorHandler);

// Connect to the database and start the server
connectDB()
  .then(() => {
    app.listen(process.env.PORT || 4000, () => {
      console.log(`Server is running at port: ${process.env.PORT ?? 8000}`);
    });
  })
  .catch((err) => {
    console.log('MONGO DB connection failed !!!', err);
  });
