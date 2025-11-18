// Demo user accounts for testing
export const demoUsers = [
  {
    email: 'student@demo.com',
    password: 'demo123',
    fullName: 'Demo Student',
    university: 'Demo University',
    course: 'Computer Science',
    graduationYear: 2025,
    studentId: 'DEMO001',
    role: 'student'
  },
  {
    email: 'university@demo.com',
    password: 'demo123',
    fullName: 'Demo University Admin',
    university: 'Demo University',
    role: 'university'
  },
  {
    email: 'recruiter@demo.com',
    password: 'demo123',
    fullName: 'Demo Recruiter',
    company: 'Demo Tech Solutions',
    role: 'recruiter'
  }
];

// Demo job data
export const demoJobs = [
  {
    id: '1',
    title: "AI Product Intern",
    company: "NeuraTech Labs",
    location: "Bengaluru · Hybrid",
    description: "Join our AI team to work on cutting-edge product development",
    requirements: ["Python", "TensorFlow", "Product Strategy"],
    skills_required: ["Python", "TensorFlow", "Product Strategy"],
    job_type: "internship",
    experience_level: "entry",
    salary_range: "₹15,000 - ₹25,000/month",
    deadline: "2024-12-31",
    status: "active",
    created_at: new Date().toISOString(),
    matchScore: 94,
    matchReasons: ["Skills match", "Location preference"]
  },
  {
    id: '2',
    title: "Data Analyst - Campus Program",
    company: "Orbit Analytics",
    location: "Remote",
    description: "Data analysis and visualization for business insights",
    requirements: ["SQL", "Power BI", "Statistics"],
    skills_required: ["SQL", "Power BI", "Statistics"],
    job_type: "full_time",
    experience_level: "entry",
    salary_range: "₹4,00,000 - ₹6,00,000/year",
    deadline: "2024-12-25",
    status: "active",
    created_at: new Date().toISOString(),
    matchScore: 89,
    matchReasons: ["Skills match", "Experience level"]
  },
  {
    id: '3',
    title: "Full Stack Developer Trainee",
    company: "SkyForge Systems",
    location: "Hyderabad · Onsite",
    description: "Full stack development with modern web technologies",
    requirements: ["React", "Node.js", "TypeScript"],
    skills_required: ["React", "Node.js", "TypeScript"],
    job_type: "internship",
    experience_level: "entry",
    salary_range: "₹12,000 - ₹20,000/month",
    deadline: "2024-12-20",
    status: "active",
    created_at: new Date().toISOString(),
    matchScore: 86,
    matchReasons: ["Skills match", "Job type preference"]
  }
];

// Demo applications
export const demoApplications = [
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

// Demo resumes
export const demoResumes = [
  {
    id: '1',
    fileName: 'demo_resume_2024.pdf',
    fileUrl: '/uploads/demo_resume_2024.pdf',
    aiGenerated: false,
    status: 'completed',
    createdAt: new Date().toISOString()
  }
];

// Demo interviews
export const demoInterviews = [
  {
    id: '1',
    type: 'mock',
    status: 'completed',
    questions: [
      {
        id: '1',
        question: 'Tell me about yourself',
        userAnswer: 'I am a computer science student passionate about AI and machine learning. I have experience with Python, TensorFlow, and building web applications.',
        feedback: 'Good introduction, could be more specific about achievements'
      }
    ],
    createdAt: new Date().toISOString()
  }
];

// Demo documents
export const demoDocuments = [
  {
    id: '1',
    fileName: '10th_marksheet_demo.pdf',
    fileUrl: '/uploads/10th_marksheet_demo.pdf',
    documentType: 'tenth_marksheet',
    verified: true,
    createdAt: new Date().toISOString()
  }
];