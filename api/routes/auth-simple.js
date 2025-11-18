import express from 'express';
import jwt from 'jsonwebtoken';
import { createUser, getUserByEmail, getUserById, createStudentProfile, hashPassword, comparePassword, generateToken } from '../database.js';

const router = express.Router();

// Student registration
router.post('/register', async (req, res) => {
  try {
    const { email, password, studentId, fullName, university, course, graduationYear } = req.body;

    // Validate input
    if (!email || !password || !studentId || !fullName || !university || !course || !graduationYear) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    // Check if user already exists
    const existingUser = getUserByEmail(email);
    if (existingUser) {
      return res.status(409).json({ error: 'User already exists with this email' });
    }

    // Hash password
    const hashedPassword = await hashPassword(password);

    // Create user
    const userId = createUser({
      email,
      password: hashedPassword,
      role: 'student',
      studentId,
      fullName,
      university,
      course,
      graduationYear: parseInt(graduationYear)
    });

    // Create student profile
    createStudentProfile({
      userId,
      studentId,
      fullName,
      email,
      university,
      course,
      graduationYear: parseInt(graduationYear)
    });

    // Generate JWT token
    const token = generateToken(userId);

    res.status(201).json({
      message: 'Student registered successfully',
      token,
      user: {
        id: userId,
        email,
        role: 'student',
        student_id: studentId,
        full_name: fullName,
        university,
        course
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Registration failed' });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password, role } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    // Find user
    const user = getUserByEmail(email);
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Check role if specified
    if (role && user.role !== role) {
      return res.status(401).json({ error: 'Invalid role' });
    }

    // Verify password
    const isPasswordValid = await comparePassword(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Generate JWT token
    const token = generateToken(user.id);

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

// Get current user
router.get('/me', async (req, res) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({ error: 'No token provided' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback-secret-key');
    
    const user = getUserById(decoded.userId);
    if (!user) {
      return res.status(401).json({ error: 'User not found' });
    }

    res.json({ user });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(401).json({ error: 'Invalid token' });
  }
});

// Logout (client-side only, but we can track it)
router.post('/logout', (req, res) => {
  res.json({ message: 'Logged out successfully' });
});

export default router;