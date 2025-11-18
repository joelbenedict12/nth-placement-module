import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { createServer } from 'http';
import { Server } from 'socket.io';

// Load environment variables
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL || "http://localhost:8081",
    methods: ["GET", "POST"]
  }
});

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
      connectSrc: ["'self'"],
    },
  },
}));

app.use(cors({
  origin: process.env.FRONTEND_URL || "http://localhost:8081",
  credentials: true
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

// Import database
import db, { getJobs, getJobById, getApplicationsByStudentId, getResumesByStudentId } from './database.js';

// Import routes
import authRoutes from './routes/auth-simple.js';
import { authenticateToken } from './middleware/auth-simple.js';

// Routes
app.use('/api/auth', authRoutes);

// Simple student routes (no auth required for demo)
app.get('/api/students/dashboard', (req, res) => {
  try {
    // Mock dashboard data
    res.json({
      resumeCount: 3,
      profile: { profileStrength: 85 },
      jobMatchesCount: 12,
      applicationsCount: 5
    });
  } catch (error) {
    console.error('Dashboard error:', error);
    res.status(500).json({ error: 'Failed to fetch dashboard data' });
  }
});

app.get('/api/students/profile', (req, res) => {
  try {
    // Mock profile data
    res.json({
      id: '1',
      userId: '1',
      phone: '+91 98765 43210',
      address: 'Bengaluru, India',
      linkedinUrl: 'https://linkedin.com/in/student',
      githubUrl: 'https://github.com/student',
      portfolioUrl: 'https://student.dev',
      bio: 'Computer Science student passionate about AI and full-stack development',
      skills: ['React', 'Node.js', 'Python', 'Machine Learning'],
      cgpa: 8.5,
      profileStrength: 85,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });
  } catch (error) {
    console.error('Profile error:', error);
    res.status(500).json({ error: 'Failed to fetch profile data' });
  }
});

// Jobs routes
app.get('/api/jobs', (req, res) => {
  try {
    const jobs = getJobs();
    res.json(jobs);
  } catch (error) {
    console.error('Jobs error:', error);
    res.status(500).json({ error: 'Failed to fetch jobs' });
  }
});

app.get('/api/jobs/matches', (req, res) => {
  try {
    // Mock job matches with match scores
    const jobs = getJobs().map(job => ({
      ...job,
      matchScore: Math.floor(Math.random() * 30) + 70, // 70-100% match
      matchReasons: ['Skills match', 'Location preference', 'Experience level'],
      createdAt: job.created_at
    }));
    res.json(jobs);
  } catch (error) {
    console.error('Job matches error:', error);
    res.status(500).json({ error: 'Failed to fetch job matches' });
  }
});

app.get('/api/jobs/:id', (req, res) => {
  try {
    const job = getJobById(req.params.id);
    if (!job) {
      return res.status(404).json({ error: 'Job not found' });
    }
    res.json(job);
  } catch (error) {
    console.error('Job error:', error);
    res.status(500).json({ error: 'Failed to fetch job' });
  }
});

app.post('/api/jobs/apply', (req, res) => {
  try {
    const { jobId } = req.body;
    if (!jobId) {
      return res.status(400).json({ error: 'Job ID is required' });
    }
    
    // Mock application creation
    res.json({
      id: Math.floor(Math.random() * 1000),
      jobId,
      status: 'submitted',
      appliedAt: new Date().toISOString()
    });
  } catch (error) {
    console.error('Application error:', error);
    res.status(500).json({ error: 'Failed to create application' });
  }
});

app.get('/api/jobs/applications', (req, res) => {
  try {
    // Mock applications data
    const applications = [
      {
        id: '1',
        jobId: '1',
        job: {
          title: 'AI Research Intern',
          company: 'Cortex Innovations'
        },
        status: 'interview_scheduled',
        appliedAt: new Date().toISOString()
      },
      {
        id: '2',
        jobId: '2',
        job: {
          title: 'Data Science Fellow',
          company: 'LogicLeap'
        },
        status: 'assessment_completed',
        appliedAt: new Date().toISOString()
      }
    ];
    res.json(applications);
  } catch (error) {
    console.error('Applications error:', error);
    res.status(500).json({ error: 'Failed to fetch applications' });
  }
});

// Resumes routes
app.get('/api/resumes', (req, res) => {
  try {
    // Mock resumes data
    const resumes = [
      {
        id: '1',
        fileName: 'resume_2024.pdf',
        fileUrl: '/uploads/resume_2024.pdf',
        aiGenerated: false,
        status: 'completed',
        createdAt: new Date().toISOString()
      }
    ];
    res.json(resumes);
  } catch (error) {
    console.error('Resumes error:', error);
    res.status(500).json({ error: 'Failed to fetch resumes' });
  }
});

app.post('/api/resumes/upload', (req, res) => {
  try {
    // Mock resume upload
    res.json({
      id: Math.floor(Math.random() * 1000),
      fileName: 'uploaded_resume.pdf',
      fileUrl: '/uploads/uploaded_resume.pdf',
      aiGenerated: false,
      status: 'pending',
      createdAt: new Date().toISOString()
    });
  } catch (error) {
    console.error('Resume upload error:', error);
    res.status(500).json({ error: 'Failed to upload resume' });
  }
});

app.post('/api/resumes/generate', (req, res) => {
  try {
    // Mock resume generation
    res.json({
      id: Math.floor(Math.random() * 1000),
      fileName: 'generated_resume.pdf',
      fileUrl: '/uploads/generated_resume.pdf',
      aiGenerated: true,
      status: 'completed',
      createdAt: new Date().toISOString()
    });
  } catch (error) {
    console.error('Resume generation error:', error);
    res.status(500).json({ error: 'Failed to generate resume' });
  }
});

app.delete('/api/resumes/:id', (req, res) => {
  try {
    res.json({ message: 'Resume deleted successfully' });
  } catch (error) {
    console.error('Resume deletion error:', error);
    res.status(500).json({ error: 'Failed to delete resume' });
  }
});

// Interviews routes
app.get('/api/interviews', (req, res) => {
  try {
    // Mock interviews data
    const interviews = [
      {
        id: '1',
        type: 'mock',
        status: 'completed',
        questions: [
          {
            id: '1',
            question: 'Tell me about yourself',
            userAnswer: 'I am a computer science student...',
            feedback: 'Good introduction, could be more specific'
          }
        ],
        createdAt: new Date().toISOString()
      }
    ];
    res.json(interviews);
  } catch (error) {
    console.error('Interviews error:', error);
    res.status(500).json({ error: 'Failed to fetch interviews' });
  }
});

app.post('/api/interviews/mock/start', (req, res) => {
  try {
    const { jobId, type, difficulty } = req.body;
    
    // Mock interview start
    res.json({
      id: Math.floor(Math.random() * 1000),
      jobId,
      type,
      difficulty,
      status: 'active',
      currentQuestion: 'Tell me about yourself',
      questions: [
        {
          id: '1',
          question: 'Tell me about yourself',
          expectedAnswer: 'Focus on your background, skills, and career goals'
        }
      ],
      createdAt: new Date().toISOString()
    });
  } catch (error) {
    console.error('Interview start error:', error);
    res.status(500).json({ error: 'Failed to start interview' });
  }
});

app.post('/api/interviews/:id/answer', (req, res) => {
  try {
    const { questionId, answer } = req.body;
    
    // Mock answer submission
    res.json({
      message: 'Answer submitted successfully',
      feedback: 'Good answer, could include more specific examples'
    });
  } catch (error) {
    console.error('Answer submission error:', error);
    res.status(500).json({ error: 'Failed to submit answer' });
  }
});

app.post('/api/interviews/:id/complete', (req, res) => {
  try {
    res.json({
      message: 'Interview completed successfully',
      feedback: 'Overall good performance, work on technical details'
    });
  } catch (error) {
    console.error('Interview completion error:', error);
    res.status(500).json({ error: 'Failed to complete interview' });
  }
});

// Documents routes
app.get('/api/documents', (req, res) => {
  try {
    // Mock documents data
    const documents = [
      {
        id: '1',
        fileName: '10th_marksheet.pdf',
        fileUrl: '/uploads/10th_marksheet.pdf',
        documentType: 'tenth_marksheet',
        verified: true,
        createdAt: new Date().toISOString()
      }
    ];
    res.json(documents);
  } catch (error) {
    console.error('Documents error:', error);
    res.status(500).json({ error: 'Failed to fetch documents' });
  }
});

app.post('/api/documents/upload', (req, res) => {
  try {
    const { documentType } = req.body;
    
    // Mock document upload
    res.json({
      id: Math.floor(Math.random() * 1000),
      fileName: 'uploaded_document.pdf',
      fileUrl: '/uploads/uploaded_document.pdf',
      documentType,
      verified: false,
      createdAt: new Date().toISOString()
    });
  } catch (error) {
    console.error('Document upload error:', error);
    res.status(500).json({ error: 'Failed to upload document' });
  }
});

app.delete('/api/documents/:id', (req, res) => {
  try {
    res.json({ message: 'Document deleted successfully' });
  } catch (error) {
    console.error('Document deletion error:', error);
    res.status(500).json({ error: 'Failed to delete document' });
  }
});

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

const PORT = process.env.PORT || 8085;

server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📱 Frontend URL: ${process.env.FRONTEND_URL || "http://localhost:8081"}`);
  console.log(`🔧 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`💾 Using local SQLite database`);
});

export { io };