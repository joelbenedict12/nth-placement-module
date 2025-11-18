import express from 'express';
import { supabase } from '../server.js';
import upload from '../middleware/upload.js';
import pdfParse from 'pdf-parse';
import mammoth from 'mammoth';
import OpenAI from 'openai';
import PDFDocument from 'pdfkit';

const router = express.Router();

// Initialize OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || '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'
});

// Upload and parse resume
router.post('/upload', upload.single('resume'), async (req, res) => {
  try {
    const userId = req.user.id;
    const file = req.file;

    console.log('Upload request received:', {
      userId: userId,
      file: file ? {
        originalname: file.originalname,
        mimetype: file.mimetype,
        size: file.size
      } : null
    });

    if (!file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    // Get student profile
    const { data: profile, error: profileError } = await supabase
      .from('student_profiles')
      .select('id')
      .eq('user_id', userId)
      .single();

    if (profileError || !profile) {
      return res.status(404).json({ error: 'Student profile not found' });
    }

    let parsedText = '';
    
    // Parse different file types
    if (file.mimetype === 'application/pdf') {
      const data = await pdfParse(file.buffer);
      parsedText = data.text;
      console.log('PDF parsed successfully, text length:', parsedText.length);
    } else if (file.mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
      const result = await mammoth.extractRawText({ buffer: file.buffer });
      parsedText = result.value;
      console.log('DOCX parsed successfully, text length:', parsedText.length);
    } else if (file.mimetype === 'application/msword') {
      const result = await mammoth.extractRawText({ buffer: file.buffer });
      parsedText = result.value;
      console.log('DOC parsed successfully, text length:', parsedText.length);
    }

    console.log('Parsed text preview:', parsedText.substring(0, 500));

    // Use AI to extract structured data
    const extractedData = await extractResumeData(parsedText);
    console.log('AI extraction completed:', JSON.stringify(extractedData, null, 2));

    // Store resume data
    const { data: resume, error: resumeError } = await supabase
      .from('resumes')
      .insert({
        student_id: profile.id,
        original_filename: file.originalname,
        file_data: file.buffer,
        file_mimetype: file.mimetype,
        parsed_text: parsedText,
        extracted_data: extractedData,
        status: 'parsed',
        completion_percentage: 60,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .select()
      .single();

    if (resumeError) {
      throw resumeError;
    }

    // Update student profile with extracted data
    await updateProfileFromResume(profile.id, extractedData);

    res.json({
      message: 'Resume uploaded and parsed successfully',
      resume: {
        id: resume.id,
        fileName: resume.original_filename,
        fileUrl: '', // Will be generated when needed
        aiGenerated: resume.status === 'generated',
        status: resume.status,
        createdAt: resume.created_at,
        updatedAt: resume.updated_at,
        extracted_data: extractedData,
        completion_percentage: resume.completion_percentage
      }
    });
  } catch (error) {
    console.error('Resume upload error:', error);
    res.status(500).json({ error: 'Failed to upload and parse resume' });
  }
});

// Get student's resumes
router.get('/', async (req, res) => {
  try {
    const userId = req.user.id;
    console.log('Get resumes request for userId:', userId);

    const { data: profile, error: profileError } = await supabase
      .from('student_profiles')
      .select('id')
      .eq('user_id', userId)
      .single();

    console.log('Profile lookup result:', { profile, profileError });

    if (profileError || !profile) {
      return res.status(404).json({ error: 'Student profile not found' });
    }

    const { data: resumes, error } = await supabase
      .from('resumes')
      .select('id, original_filename, status, completion_percentage, created_at, updated_at')
      .eq('student_id', profile.id)
      .order('created_at', { ascending: false });

    console.log('Resumes query result:', { resumes, error });

    if (error) {
      throw error;
    }

    // Transform the data to match frontend expectations
    const transformedResumes = resumes.map(resume => ({
      id: resume.id,
      fileName: resume.original_filename,
      fileUrl: '', // Will be generated when needed
      aiGenerated: resume.status === 'generated',
      status: resume.status,
      createdAt: resume.created_at,
      updatedAt: resume.updated_at
    }));

    console.log('Returning transformed resumes:', transformedResumes);
    res.json(transformedResumes);
  } catch (error) {
    console.error('Get resumes error:', error);
    res.status(500).json({ error: 'Failed to fetch resumes' });
  }
});

// Get specific resume
router.get('/:id', async (req, res) => {
  try {
    const userId = req.user.id;
    const resumeId = req.params.id;

    const { data: profile, error: profileError } = await supabase
      .from('student_profiles')
      .select('id')
      .eq('user_id', userId)
      .single();

    if (profileError || !profile) {
      return res.status(404).json({ error: 'Student profile not found' });
    }

    const { data: resume, error } = await supabase
      .from('resumes')
      .select('*')
      .eq('id', resumeId)
      .eq('student_id', profile.id)
      .single();

    if (error || !resume) {
      return res.status(404).json({ error: 'Resume not found' });
    }

    res.json({ resume });
  } catch (error) {
    console.error('Get resume error:', error);
    res.status(500).json({ error: 'Failed to fetch resume' });
  }
});

// Generate AI-powered resume
router.post('/generate', async (req, res) => {
  try {
    const userId = req.user.id;
    const { template = 'modern', format = 'pdf' } = req.body;

    const { data: profile, error: profileError } = await supabase
      .from('student_profiles')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (profileError || !profile) {
      return res.status(404).json({ error: 'Student profile not found' });
    }

    // Generate resume content using AI
    const resumeContent = await generateResumeContent(profile);

    let generatedFile;
    
    if (format === 'pdf') {
      generatedFile = await generatePDF(resumeContent, template);
    } else if (format === 'latex') {
      generatedFile = await generateLatex(resumeContent);
    }

    // Store generated resume
    const { data: resume, error: resumeError } = await supabase
      .from('resumes')
      .insert({
        student_id: profile.id,
        original_filename: `resume_${Date.now()}.${format}`,
        generated_data: generatedFile,
        generated_content: resumeContent,
        status: 'generated',
        completion_percentage: 100,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .select()
      .single();

    if (resumeError) {
      throw resumeError;
    }

    res.json({
      message: 'Resume generated successfully',
      resume: {
        id: resume.id,
        file: generatedFile,
        content: resumeContent
      }
    });
  } catch (error) {
    console.error('Generate resume error:', error);
    res.status(500).json({ error: 'Failed to generate resume' });
  }
});

// Helper function to extract resume data using AI
async function extractResumeData(text) {
  try {
    console.log('Starting AI extraction for text length:', text.length);
    
    if (!text || text.length < 10) {
      console.log('Text too short for extraction');
      return {};
    }

    const prompt = `
    Extract structured information from this resume text:
    
    ${text.substring(0, 4000)}  // Limit text to avoid token limits
    
    Please extract the following information in JSON format:
    {
      "personal_info": {
        "full_name": "",
        "email": "",
        "phone": "",
        "location": "",
        "linkedin_url": "",
        "github_url": ""
      },
      "education": [
        {
          "institution": "",
          "degree": "",
          "field": "",
          "graduation_year": "",
          "cgpa": ""
        }
      ],
      "experience": [
        {
          "title": "",
          "company": "",
          "duration": "",
          "description": ""
        }
      ],
      "skills": {
        "technical": [],
        "soft": []
      },
      "projects": [
        {
          "name": "",
          "description": "",
          "technologies": []
        }
      ],
      "achievements": []
    }
    
    Return ONLY the JSON object, no additional text.
    `;

    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.1,
      max_tokens: 1000
    });

    const extractedText = response.choices[0].message.content;
    console.log('AI extraction response:', extractedText);
    
    try {
      const parsedData = JSON.parse(extractedText);
      console.log('Successfully parsed extraction data');
      return parsedData;
    } catch (parseError) {
      console.error('Failed to parse AI response as JSON:', extractedText);
      // Try to extract JSON from the response
      const jsonMatch = extractedText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
      return {};
    }
  } catch (error) {
    console.error('AI extraction error:', error);
    return {};
  }
}

// Helper function to generate resume content using AI
async function generateResumeContent(profile) {
  try {
    const prompt = `
    Create a professional resume for this student:
    
    Name: ${profile.full_name}
    Email: ${profile.email}
    University: ${profile.university}
    Course: ${profile.course}
    Graduation Year: ${profile.graduation_year}
    CGPA: ${profile.cgpa}
    Skills: ${profile.skills?.join(', ')}
    Projects: ${JSON.stringify(profile.projects, null, 2)}
    Work Experience: ${JSON.stringify(profile.work_experience, null, 2)}
    Achievements: ${profile.achievements}
    
    Generate a compelling resume with:
    1. Professional summary
    2. Education section
    3. Experience section with quantified achievements
    4. Skills section organized by categories
    5. Projects with impact statements
    6. Additional sections as relevant
    
    Return in JSON format with sections clearly organized.
    `;

    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.3,
      max_tokens: 2000
    });

    const generatedText = response.choices[0].message.content;
    return JSON.parse(generatedText);
  } catch (error) {
    console.error('AI generation error:', error);
    return {};
  }
}

// Helper function to generate PDF
async function generatePDF(content, template) {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument();
      const chunks = [];
      
      doc.on('data', chunk => chunks.push(chunk));
      doc.on('end', () => resolve(Buffer.concat(chunks)));
      doc.on('error', reject);
      
      // Add content to PDF based on template
      doc.fontSize(24).text(content.personal_info?.full_name || 'Resume', 50, 50);
      
      // Add more content based on the generated content
      if (content.summary) {
        doc.fontSize(12).text(content.summary, 50, 100);
      }
      
      doc.end();
    } catch (error) {
      reject(error);
    }
  });
}

// Helper function to generate LaTeX
async function generateLatex(content) {
  // Simple LaTeX generation - can be enhanced
  const latex = `
\\documentclass{article}
\\begin{document}
\\title{${content.personal_info?.full_name || 'Resume'}}
\\maketitle
${content.summary || ''}
\\end{document}
  `;
  
  return Buffer.from(latex, 'utf-8');
}

// Helper function to update profile from resume
async function updateProfileFromResume(studentId, extractedData) {
  try {
    const updateData = {
      updated_at: new Date().toISOString()
    };

    if (extractedData.personal_info?.full_name) {
      updateData.full_name = extractedData.personal_info.full_name;
    }
    if (extractedData.personal_info?.phone) {
      updateData.phone = extractedData.personal_info.phone;
    }
    if (extractedData.personal_info?.location) {
      updateData.location = extractedData.personal_info.location;
    }
    if (extractedData.personal_info?.linkedin_url) {
      updateData.linkedin_url = extractedData.personal_info.linkedin_url;
    }
    if (extractedData.personal_info?.github_url) {
      updateData.github_url = extractedData.personal_info.github_url;
    }
    if (extractedData.skills?.technical) {
      updateData.skills = extractedData.skills.technical;
    }
    if (extractedData.projects) {
      updateData.projects = extractedData.projects;
    }
    if (extractedData.work_experience) {
      updateData.work_experience = extractedData.work_experience;
    }

    const { error } = await supabase
      .from('student_profiles')
      .update(updateData)
      .eq('id', studentId);

    if (error) {
      throw error;
    }
  } catch (error) {
    console.error('Update profile from resume error:', error);
  }
}

export default router;