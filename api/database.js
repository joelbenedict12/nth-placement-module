import Database from 'better-sqlite3';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

// Create in-memory database for development
const db = new Database(':memory:');

// Initialize database schema
db.exec(`
  CREATE TABLE users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    role TEXT NOT NULL CHECK (role IN ('student', 'university', 'recruiter')),
    student_id TEXT,
    full_name TEXT,
    university TEXT,
    course TEXT,
    graduation_year INTEGER,
    last_login TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE student_profiles (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    student_id TEXT UNIQUE,
    full_name TEXT,
    email TEXT,
    phone TEXT,
    location TEXT,
    bio TEXT,
    university TEXT,
    course TEXT,
    graduation_year INTEGER,
    cgpa DECIMAL(3,2),
    skills TEXT,
    github_url TEXT,
    linkedin_url TEXT,
    portfolio_url TEXT,
    projects TEXT,
    work_experience TEXT,
    achievements TEXT,
    tenth_marksheet_uploaded BOOLEAN DEFAULT FALSE,
    twelfth_marksheet_uploaded BOOLEAN DEFAULT FALSE,
    profile_completion INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE jobs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    company TEXT NOT NULL,
    location TEXT,
    description TEXT,
    requirements TEXT,
    skills_required TEXT,
    job_type TEXT CHECK (job_type IN ('full_time', 'part_time', 'internship', 'contract')),
    experience_level TEXT CHECK (experience_level IN ('entry', 'mid', 'senior')),
    salary_range TEXT,
    deadline DATE,
    status TEXT DEFAULT 'active' CHECK (status IN ('active', 'closed', 'draft')),
    recruiter_id INTEGER REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE applications (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    student_id INTEGER REFERENCES student_profiles(id) ON DELETE CASCADE,
    job_id INTEGER REFERENCES jobs(id) ON DELETE CASCADE,
    cover_letter TEXT,
    status TEXT DEFAULT 'submitted' CHECK (status IN ('submitted', 'reviewed', 'shortlisted', 'interviewed', 'offered', 'rejected')),
    next_step TEXT,
    next_step_date DATE,
    applied_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(student_id, job_id)
  );

  CREATE TABLE resumes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    student_id INTEGER REFERENCES student_profiles(id) ON DELETE CASCADE,
    original_filename TEXT,
    file_data BLOB,
    file_mimetype TEXT,
    parsed_text TEXT,
    extracted_data TEXT,
    generated_data BLOB,
    generated_content TEXT,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'parsed', 'generated', 'error')),
    completion_percentage INTEGER DEFAULT 0,
    template TEXT DEFAULT 'modern',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );
`);

// Insert sample data
const sampleJobs = [
  {
    title: "AI Product Intern",
    company: "NeuraTech Labs",
    location: "Bengaluru · Hybrid",
    description: "Join our AI team to work on cutting-edge product development",
    requirements: "Python, TensorFlow, Product Strategy",
    skills_required: "Python,TensorFlow,Product Strategy",
    job_type: "internship",
    experience_level: "entry",
    salary_range: "₹15,000 - ₹25,000/month",
    deadline: "2024-12-31",
    status: "active"
  },
  {
    title: "Data Analyst - Campus Program",
    company: "Orbit Analytics",
    location: "Remote",
    description: "Data analysis and visualization for business insights",
    requirements: "SQL, Power BI, Statistics",
    skills_required: "SQL,Power BI,Statistics",
    job_type: "full_time",
    experience_level: "entry",
    salary_range: "₹4,00,000 - ₹6,00,000/year",
    deadline: "2024-12-25",
    status: "active"
  },
  {
    title: "Full Stack Developer Trainee",
    company: "SkyForge Systems",
    location: "Hyderabad · Onsite",
    description: "Full stack development with modern web technologies",
    requirements: "React, Node.js, TypeScript",
    skills_required: "React,Node.js,TypeScript",
    job_type: "internship",
    experience_level: "entry",
    salary_range: "₹12,000 - ₹20,000/month",
    deadline: "2024-12-20",
    status: "active"
  }
];

// Insert sample jobs
const insertJob = db.prepare(`
  INSERT INTO jobs (title, company, location, description, requirements, skills_required, job_type, experience_level, salary_range, deadline, status)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
`);

sampleJobs.forEach(job => {
  insertJob.run(
    job.title,
    job.company,
    job.location,
    job.description,
    job.requirements,
    job.skills_required,
    job.job_type,
    job.experience_level,
    job.salary_range,
    job.deadline,
    job.status
  );
});

// Authentication functions
export const hashPassword = async (password) => {
  return await bcrypt.hash(password, 10);
};

export const comparePassword = async (password, hashedPassword) => {
  return await bcrypt.compare(password, hashedPassword);
};

export const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET || 'fallback-secret-key', { expiresIn: '7d' });
};

// Database functions
export const createUser = (userData) => {
  const stmt = db.prepare(`
    INSERT INTO users (email, password, role, student_id, full_name, university, course, graduation_year)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `);
  
  const result = stmt.run(
    userData.email,
    userData.password,
    userData.role || 'student',
    userData.studentId,
    userData.fullName,
    userData.university,
    userData.course,
    userData.graduationYear
  );
  
  return result.lastInsertRowid;
};

export const getUserByEmail = (email) => {
  const stmt = db.prepare('SELECT * FROM users WHERE email = ?');
  return stmt.get(email);
};

export const getUserById = (id) => {
  const stmt = db.prepare('SELECT * FROM users WHERE id = ?');
  return stmt.get(id);
};

export const createStudentProfile = (profileData) => {
  const stmt = db.prepare(`
    INSERT INTO student_profiles (user_id, student_id, full_name, email, university, course, graduation_year)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `);
  
  const result = stmt.run(
    profileData.userId,
    profileData.studentId,
    profileData.fullName,
    profileData.email,
    profileData.university,
    profileData.course,
    profileData.graduationYear
  );
  
  return result.lastInsertRowid;
};

export const getStudentProfileByUserId = (userId) => {
  const stmt = db.prepare('SELECT * FROM student_profiles WHERE user_id = ?');
  return stmt.get(userId);
};

export const getJobs = (limit = 10, offset = 0) => {
  const stmt = db.prepare('SELECT * FROM jobs WHERE status = "active" ORDER BY created_at DESC LIMIT ? OFFSET ?');
  return stmt.all(limit, offset);
};

export const getJobById = (id) => {
  const stmt = db.prepare('SELECT * FROM jobs WHERE id = ? AND status = "active"');
  return stmt.get(id);
};

export const createApplication = (applicationData) => {
  const stmt = db.prepare(`
    INSERT INTO applications (student_id, job_id, cover_letter, status)
    VALUES (?, ?, ?, ?)
  `);
  
  const result = stmt.run(
    applicationData.studentId,
    applicationData.jobId,
    applicationData.coverLetter || '',
    applicationData.status || 'submitted'
  );
  
  return result.lastInsertRowid;
};

export const getApplicationsByStudentId = (studentId) => {
  const stmt = db.prepare(`
    SELECT a.*, j.title, j.company, j.location 
    FROM applications a
    JOIN jobs j ON a.job_id = j.id
    WHERE a.student_id = ?
    ORDER BY a.applied_at DESC
  `);
  return stmt.all(studentId);
};

export const getResumesByStudentId = (studentId) => {
  const stmt = db.prepare('SELECT * FROM resumes WHERE student_id = ? ORDER BY created_at DESC');
  return stmt.all(studentId);
};

export const createResume = (resumeData) => {
  const stmt = db.prepare(`
    INSERT INTO resumes (student_id, original_filename, file_data, file_mimetype, status)
    VALUES (?, ?, ?, ?, ?)
  `);
  
  const result = stmt.run(
    resumeData.studentId,
    resumeData.originalFilename,
    resumeData.fileData,
    resumeData.fileMimetype,
    resumeData.status || 'pending'
  );
  
  return result.lastInsertRowid;
};

export default db;