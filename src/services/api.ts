import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || (import.meta.env.PROD ? 'https://nthplace-skyrocket-api.vercel.app/api' : 'http://localhost:3000/api');

// Debug logging
console.log('Environment:', import.meta.env.MODE);
console.log('API Base URL:', API_BASE_URL);
console.log('VITE_API_URL:', import.meta.env.VITE_API_URL);

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export interface Student {
  id: string;
  email: string;
  studentId: string;
  fullName: string;
  university: string;
  course: string;
  graduationYear: number;
  createdAt: string;
  updatedAt: string;
}

export interface StudentProfile {
  id: string;
  userId: string;
  phone?: string;
  address?: string;
  linkedinUrl?: string;
  githubUrl?: string;
  portfolioUrl?: string;
  bio?: string;
  skills?: string[];
  cgpa?: number;
  tenthPercentage?: number;
  twelfthPercentage?: number;
  profileStrength: number;
  createdAt: string;
  updatedAt: string;
}

export interface Resume {
  id: string;
  userId: string;
  fileName: string;
  fileUrl: string;
  parsedData?: any;
  aiGenerated: boolean;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  createdAt: string;
  updatedAt: string;
}

export interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  description: string;
  requirements: string[];
  salary?: string;
  jobType: 'internship' | 'full_time' | 'part_time';
  experienceLevel: 'entry' | 'mid' | 'senior';
  deadline?: string;
  createdAt: string;
  updatedAt: string;
}

export interface JobMatch extends Job {
  matchScore: number;
  matchReasons: string[];
}

export interface Application {
  id: string;
  userId: string;
  jobId: string;
  status: 'pending' | 'reviewing' | 'shortlisted' | 'rejected' | 'accepted';
  appliedAt: string;
  updatedAt: string;
}

export interface Interview {
  id: string;
  userId: string;
  jobId?: string;
  type: 'mock' | 'actual';
  status: 'scheduled' | 'in_progress' | 'completed';
  questions: InterviewQuestion[];
  scheduledAt?: string;
  completedAt?: string;
  createdAt: string;
}

export interface InterviewQuestion {
  id: string;
  question: string;
  expectedAnswer?: string;
  userAnswer?: string;
  feedback?: string;
  rating?: number;
}

export interface Document {
  id: string;
  userId: string;
  fileName: string;
  fileUrl: string;
  documentType: 'tenth_marksheet' | 'twelfth_marksheet' | 'resume' | 'other';
  verified: boolean;
  createdAt: string;
  updatedAt: string;
}

// Auth API
export const authAPI = {
  register: async (data: {
    email: string;
    password: string;
    studentId: string;
    fullName: string;
    university: string;
    course: string;
    graduationYear: number;
  }) => {
    const response = await api.post('/auth/register', data);
    return response.data;
  },

  login: async (email: string, password: string) => {
    const response = await api.post('/auth/login', { email, password });
    return response.data;
  },

  getProfile: async () => {
    const response = await api.get('/auth/me');
    return response.data;
  },
};

// Student API
export const studentAPI = {
  getDashboard: async () => {
    const response = await api.get('/students/dashboard');
    return response.data;
  },

  getProfile: async () => {
    const response = await api.get('/students/profile');
    return response.data;
  },

  updateProfile: async (data: Partial<StudentProfile>) => {
    const response = await api.put('/students/profile', data);
    return response.data;
  },
};

// Resume API
export const resumeAPI = {
  getResumes: async () => {
    try {
      console.log('Fetching resumes from API...');
      const response = await api.get('/resumes');
      console.log('Get resumes response:', response.data);
      
      // Check if we got actual data or an error
      if (response.data && Array.isArray(response.data)) {
        console.log(`Found ${response.data.length} resumes`);
        return response.data;
      } else {
        console.log('No resumes found or invalid response format:', response.data);
        return [];
      }
    } catch (error: any) {
      console.error('Get resumes error details:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status
      });
      
      // Return empty array instead of demo data to show real state
      return [];
    }
  },

  uploadResume: async (file: File) => {
    try {
      const formData = new FormData();
      formData.append('resume', file);
      console.log('Uploading file:', file.name, 'size:', file.size, 'type:', file.type);
      
      const response = await api.post('/resumes/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        timeout: 60000, // 60 second timeout for file processing
      });
      
      console.log('Upload resume response:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('Resume upload error details:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
        headers: error.response?.headers
      });
      
      // Show the actual error to the user
      const errorMessage = error.response?.data?.error || error.message || 'Failed to upload resume';
      throw new Error(errorMessage);
    }
  },

  generateResume: async (data: any) => {
    try {
      const response = await api.post('/resumes/generate', data);
      return response.data;
    } catch (error: any) {
      const errorMessage = error.response?.data?.error || error.message || 'Failed to generate resume';
      throw new Error(errorMessage);
    }
  },

  deleteResume: async (id: string) => {
    try {
      const response = await api.delete(`/resumes/${id}`);
      return response.data;
    } catch (error: any) {
      const errorMessage = error.response?.data?.error || error.message || 'Failed to delete resume';
      throw new Error(errorMessage);
    }
  },
};

// Job API
export const jobAPI = {
  getJobs: async (params?: { search?: string; location?: string; type?: string }) => {
    try {
      const response = await api.get('/jobs', { params });
      return response.data;
    } catch (error: any) {
      const errorMessage = error.response?.data?.error || error.message || 'Failed to fetch jobs';
      throw new Error(errorMessage);
    }
  },

  getJobMatches: async () => {
    try {
      const response = await api.get('/jobs/matches');
      return response.data;
    } catch (error: any) {
      const errorMessage = error.response?.data?.error || error.message || 'Failed to fetch job matches';
      throw new Error(errorMessage);
    }
  },

  getJob: async (id: string) => {
    try {
      const response = await api.get(`/jobs/${id}`);
      return response.data;
    } catch (error: any) {
      const errorMessage = error.response?.data?.error || error.message || 'Failed to fetch job';
      throw new Error(errorMessage);
    }
  },

  applyJob: async (jobId: string) => {
    try {
      const response = await api.post('/jobs/apply', { jobId });
      return response.data;
    } catch (error: any) {
      const errorMessage = error.response?.data?.error || error.message || 'Failed to apply for job';
      throw new Error(errorMessage);
    }
  },

  getApplications: async () => {
    try {
      const response = await api.get('/jobs/applications');
      return response.data;
    } catch (error: any) {
      const errorMessage = error.response?.data?.error || error.message || 'Failed to fetch applications';
      throw new Error(errorMessage);
    }
  },
};

// Interview API
export const interviewAPI = {
  getInterviews: async () => {
    const response = await api.get('/interviews');
    return response.data;
  },

  startMockInterview: async (data: { jobId?: string; type: string; difficulty: string }) => {
    const response = await api.post('/interviews/mock/start', data);
    return response.data;
  },

  submitAnswer: async (interviewId: string, questionId: string, answer: string) => {
    const response = await api.post(`/interviews/${interviewId}/answer`, {
      questionId,
      answer,
    });
    return response.data;
  },

  completeInterview: async (interviewId: string) => {
    const response = await api.post(`/interviews/${interviewId}/complete`);
    return response.data;
  },
};

// Document API
export const documentAPI = {
  getDocuments: async () => {
    const response = await api.get('/documents');
    return response.data;
  },

  uploadDocument: async (file: File, documentType: string) => {
    const formData = new FormData();
    formData.append('document', file);
    formData.append('documentType', documentType);
    const response = await api.post('/documents/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  deleteDocument: async (id: string) => {
    const response = await api.delete(`/documents/${id}`);
    return response.data;
  },
};

export default api;