const express = require('express');
const http = require('http');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables relative to server directory
dotenv.config({ path: path.join(__dirname, '.env') });

const connectDB = require('./config/db');
const errorHandler = require('./middleware/errorHandler');
const { initSocket } = require('./socket/socketManager');

// Route Imports
const authRoutes = require('./routes/authRoutes');
const studentRoutes = require('./routes/studentRoutes');
const recruiterRoutes = require('./routes/recruiterRoutes');
const jobRoutes = require('./routes/jobRoutes');
const applicationRoutes = require('./routes/applicationRoutes');
const notificationRoutes = require('./routes/notificationRoutes');
const adminRoutes = require('./routes/adminRoutes');

// Connect Database
connectDB();

const app = express();
const server = http.createServer(app);

// Initialize Socket.IO with dynamic CORS origin
initSocket(server, process.env.CLIENT_URL || 'http://localhost:5173');

// Middleware Configuration
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Enable CORS for any client port (5173, 5174, 3000, 127.0.0.1, etc.)
app.use(cors({
  origin: true,
  credentials: true
}));
app.use(helmet({
  crossOriginResourcePolicy: false,
}));

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// REST API Base Route Mapping
app.use('/api/auth', authRoutes);
app.use('/api/students', studentRoutes);
app.use('/api/recruiter', recruiterRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/applications', applicationRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/admin', adminRoutes);

// Health Check Endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'CareerConnect API & WebSocket Server Running',
    environment: process.env.NODE_ENV || 'development',
    timestamp: new Date().toISOString()
  });
});

// Serve static assets in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/dist')));
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../client/dist', 'index.html'));
  });
}

// 404 Route Handler
app.use((req, res, next) => {
  res.status(404).json({
    success: false,
    message: `API Endpoint Not Found - ${req.originalUrl}`
  });
});

// Global Centralized Error Middleware
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

if (process.env.NODE_ENV !== 'test') {
  server.listen(PORT, () => {
    console.log(`🚀 CareerConnect Backend Server listening on port ${PORT}`);
    console.log(`📡 REST API Base: http://localhost:${PORT}/api`);
  });
}

module.exports = { app, server };
