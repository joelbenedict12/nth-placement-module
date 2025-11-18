import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

// Load environment variables
dotenv.config();

const app = express();

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

// Simple in-memory data storage
const users = [];
const jobs = [
  {
    id: '1',
    title: "AI Product Intern",
    company: "NeuraTech Labs",
    location: "Bengaluru · Hybrid",
    description: "Join our AI team to work on cutting-edge product development",
    requirements: "Python, TensorFlow, Product Strategy",
    skills_required: ["Python", "TensorFlow", "Product Strategy"],
    job_type: "internship",
    experience_level: "entry",
    salary_range: "₹15,000 - ₹25,000/month",
    deadline: "2024-12-31",
    status: "active",
    created_at: new Date().toISOString()
  },
  {
    id: '2',
    title: "Data Analyst - Campus Program",
    company: "Orbit Analytics",
    location: "Remote",
    description: "Data analysis and visualization for business insights",
    requirements: "SQL, Power BI, Statistics",
    skills_required: ["SQL", "Power BI", "Statistics"],
    job_type: "full_time",
    experience_level: "entry",
    salary_range: "₹4,00,000 - ₹6,00,000/year",
    deadline: "2024-12-25",
    status: "active",
    created_at: new Date().toISOString()
  },
  {
    id: '3',
    title: "Full Stack Developer Trainee",
    company: "SkyForge Systems",
    location: "Hyderabad · Onsite",
    description: "Full stack development with modern web technologies",
    requirements: "React, Node.js, TypeScript",
    skills_required: ["React", "Node.js", "TypeScript"],
    job_type: "internship",
    experience_level: "entry",
    salary_range: "₹12,000 - ₹20,000/month",
    deadline: "2024-12-20",
    status: "active",
    created_at: new Date().toISOString()
  }
];

const applications = [];
const resumes = [];
const interviews = [];

// Auth middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback-secret-key');
    req.user = { id: decoded.userId };
    next();
  } catch (error) {
    return res.status(403).json({ error: 'Invalid or expired token' });
  }
};

// Auth routes
app.post('/api/auth/register', async (req, res) => {
  try {
    const { email, password, studentId, fullName, university, course, graduationYear } = req.body;

    if (!email || !password || !studentId || !fullName || !university || !course || !graduationYear) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    const existingUser = users.find(u => u.email === email);
    if (existingUser) {
      return res.status(409).json({ error: 'User already exists with this email' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    
    const user = {
      id: users.length + 1,
      email,
      password: hashedPassword,
      role: 'student',
      student_id: studentId,
      full_name: fullName,
      university,
      course,
      graduation_year: graduationYear,
      created_at: new Date().toISOString()
    };
    
    users.push(user);

    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET || 'fallback-secret-key', { expiresIn: '7d' });

    res.status(201).json({
      message: 'Student registered successfully',
      token,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        student_id: user.student_id,
        full_name: user.full_name,
        university: user.university,
        course: user.course
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Registration failed' });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const user = users.find(u => u.email === email);
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET || 'fallback-secret-key', { expiresIn: '7d' });

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        student_id: user.student_id,
        full_name: user.full_name,
        university: user.university,
        course: user.course,
        graduation_year: user.graduation_year
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Login failed' });
  }
});

// Student routes
app.get('/api/students/dashboard', (req, res) => {
  res.json({
    resumeCount: 3,
    profile: { profileStrength: 85 },
    jobMatchesCount: 12,
    applicationsCount: 5
  });
});

app.get('/api/students/profile', (req, res) => {
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
});

// Jobs routes
app.get('/api/jobs', (req, res) => {
  res.json(jobs);
});

app.get('/api/jobs/matches', (req, res) => {
  const jobMatches = jobs.map(job => ({
    ...job,
    matchScore: Math.floor(Math.random() * 30) + 70, // 70-100% match
    matchReasons: ['Skills match', 'Location preference', 'Experience level'],
    createdAt: job.created_at
  }));
  res.json(jobMatches);
});

app.get('/api/jobs/:id', (req, res) => {
  const job = jobs.find(j => j.id === req.params.id);
  if (!job) {
    return res.status(404).json({ error: 'Job not found' });
  }
  res.json(job);
});

app.post('/api/jobs/apply', (req, res) => {
  const { jobId } = req.body;
  if (!jobId) {
    return res.status(400).json({ error: 'Job ID is required' });
  }
  
  const application = {
    id: applications.length + 1,
    jobId,
    status: 'submitted',
    appliedAt: new Date().toISOString()
  };
  
  applications.push(application);
  
  res.json(application);
});

app.get('/api/jobs/applications', (req, res) => {
  const userApplications = [
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
  res.json(userApplications);
});

// Resumes routes
app.get('/api/resumes', (req, res) => {
  const userResumes = [
    {
      id: '1',
      fileName: 'resume_2024.pdf',
      fileUrl: '/uploads/resume_2024.pdf',
      aiGenerated: false,
      status: 'completed',
      createdAt: new Date().toISOString()
    }
  ];
  res.json(userResumes);
});

app.post('/api/resumes/upload', (req, res) => {
  const resume = {
    id: resumes.length + 1,
    fileName: 'uploaded_resume.pdf',
    fileUrl: '/uploads/uploaded_resume.pdf',
    aiGenerated: false,
    status: 'pending',
    createdAt: new Date().toISOString()
  };
  
  resumes.push(resume);
  res.json(resume);
});

app.post('/api/resumes/generate', (req, res) => {
  const resume = {
    id: resumes.length + 1,
    fileName: 'generated_resume.pdf',
    fileUrl: '/uploads/generated_resume.pdf',
    aiGenerated: true,
    status: 'completed',
    createdAt: new Date().toISOString()
  };
  
  resumes.push(resume);
  res.json(resume);
});

app.delete('/api/resumes/:id', (req, res) => {
  res.json({ message: 'Resume deleted successfully' });
});

// Interviews routes
app.get('/api/interviews', (req, res) => {
  const userInterviews = [
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
  res.json(userInterviews);
});

app.post('/api/interviews/mock/start', (req, res) => {
  const { jobId, type, difficulty } = req.body;
  
  const interview = {
    id: interviews.length + 1,
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
  };
  
  interviews.push(interview);
  res.json(interview);
});

app.post('/api/interviews/:id/answer', (req, res) => {
  res.json({
    message: 'Answer submitted successfully',
    feedback: 'Good answer, could include more specific examples'
  });
});

app.post('/api/interviews/:id/complete', (req, res) => {
  res.json({
    message: 'Interview completed successfully',
    feedback: 'Overall good performance, work on technical details'
  });
});

// Documents routes
app.get('/api/documents', (req, res) => {
  const userDocuments = [
    {
      id: '1',
      fileName: '10th_marksheet.pdf',
      fileUrl: '/uploads/10th_marksheet.pdf',
      documentType: 'tenth_marksheet',
      verified: true,
      createdAt: new Date().toISOString()
    }
  ];
  res.json(userDocuments);
});

app.post('/api/documents/upload', (req, res) => {
  const { documentType } = req.body;
  
  const document = {
    id: Math.floor(Math.random() * 1000),
    fileName: 'uploaded_document.pdf',
    fileUrl: '/uploads/uploaded_document.pdf',
    documentType,
    verified: false,
    createdAt: new Date().toISOString()
  };
  
  res.json(document);
});

app.delete('/api/documents/:id', (req, res) => {
  res.json({ message: 'Document deleted successfully' });
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    users: users.length,
    jobs: jobs.length,
    applications: applications.length
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

const PORT = process.env.PORT || 9090;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📱 Frontend URL: ${process.env.FRONTEND_URL || "http://localhost:8081"}`);
  console.log(`🔧 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`💾 Using in-memory database`);
});