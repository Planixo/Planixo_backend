import express from 'express';
import dotenv from 'dotenv';
import morgan from 'morgan';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import cookieParser from 'cookie-parser';

import connectDB from './config/db.js';
import authRoutes from './routes/auth.routes.js';
import errorHandler from './middlewares/error.middleware.js';

// Load env vars
dotenv.config();

// App init
const app = express();

// Environment
const PORT = process.env.PORT || 3000;
const NODE_ENV = process.env.NODE_ENV || 'development';

// ==================
// Global Middleware
// ==================
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors());
app.use(helmet());
app.use(compression());

// Logger (dev only)
if (NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// ==================
// Database Connection
// ==================
connectDB();

// ==================
// Routes
// ==================
app.get('/', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'Server is running 🚀',
    env: NODE_ENV
  });
});

// Auth / Signup Routes (MVC)
app.use('/api/v1/auth', authRoutes);

// ==================
// Error Handling (ALWAYS LAST)
// ==================
app.use(errorHandler);

// ==================
// Start Server
// ==================
app.listen(PORT, () => {
  console.log(`🔥 Server running in ${NODE_ENV} mode on port ${PORT}`);
});
