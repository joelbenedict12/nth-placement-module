import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { startBackgroundJobProcessor } from './backgroundJobs.js';

// Load environment variables
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL || "http://localhost:8080",
    methods: ["GET", "POST"]
  }
});

// Supabase client
const supabase = createClient(
  process.env.SUPABASE_URL || '',
  process.env.SUPABASE_SERVICE_ROLE_KEY || ''
);

// Middleware
app.use(helmet({
  crossOriginEmbedderPolicy: false,
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      imgSrc: ["'self'", "data:", "https:"],
      scriptSrc: ["'self'"],
      connectSrc: ["'self'", "https://*.supabase.co"],
    },
  },
}));

app.use(cors({
  origin: [process.env.FRONTEND_URL || "http://localhost:8080", "http://localhost:8081", "http://localhost:8082", "http://localhost:8083"],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

app.use(compression());
app.use(morgan('combined'));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.'
});
app.use('/api/', limiter);



// Import routes and middleware
import authRoutes from './routes/auth.js';
import studentRoutes from './routes/students.js';
import resumeRoutes from './routes/resumes.js';
import jobRoutes from './routes/jobs.js';
import interviewRoutes from './routes/interviews.js';
import documentRoutes from './routes/documents.js';
import { authenticateToken } from './middleware/auth.js';
import upload from './middleware/upload.js';

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/students', authenticateToken, studentRoutes);
app.use('/api/resumes', authenticateToken, resumeRoutes);
app.use('/api/jobs', authenticateToken, jobRoutes);
app.use('/api/interviews', authenticateToken, interviewRoutes);
app.use('/api/documents', authenticateToken, documentRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// Socket.io for real-time features
io.on('connection', (socket) => {
  console.log('User connected:', socket.id);
  
  socket.on('join-interview', (interviewId) => {
    socket.join(`interview-${interviewId}`);
    console.log(`User ${socket.id} joined interview ${interviewId}`);
  });
  
  socket.on('interview-answer', (data) => {
    socket.to(`interview-${data.interviewId}`).emit('new-answer', data);
  });
  
  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    error: 'Something went wrong!',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
  const address = server.address();
  console.log(`🚀 Server running on port ${address.port}`);
  console.log(`📱 Frontend URL: ${process.env.FRONTEND_URL || "http://localhost:8080"}`);
  console.log(`🔧 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🔗 Server URL: http://localhost:${address.port}`);
  
  // Start background job processor (optional)
  try {
    startBackgroundJobProcessor();
  } catch (error) {
    console.warn('Background job processor failed to start:', error.message);
    console.log('Server continuing without background job processing');
  }
});

export { supabase, io, upload };