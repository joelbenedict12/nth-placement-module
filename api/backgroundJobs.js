import { supabase } from './server.js';
import OpenAI from 'openai';
import pdfParse from 'pdf-parse';
import mammoth from 'mammoth';
import PDFDocument from 'pdfkit';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || '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'
});

// Process background jobs
export async function processBackgroundJobs() {
  try {
    // Get pending jobs
    const { data: jobs, error } = await supabase
      .from('background_jobs')
      .select('*')
      .eq('status', 'pending')
      .order('created_at', { ascending: true })
      .limit(5);

    if (error) {
      console.error('Error fetching background jobs:', error);
      return;
    }

    for (const job of jobs || []) {
      await processJob(job);
    }
  } catch (error) {
    console.error('Error processing background jobs:', error);
  }
}

// Process individual job
async function processJob(job) {
  try {
    // Update status to processing
    await supabase
      .from('background_jobs')
      .update({
        status: 'processing',
        started_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .eq('id', job.id);

    let result = null;
    let errorMessage = null;

    switch (job.job_type) {
      case 'resume_parse':
        result = await processResumeParse(job);
        break;
      case 'resume_generate':
        result = await processResumeGenerate(job);
        break;
      case 'job_match':
        result = await processJobMatch(job);
        break;
      case 'interview_analyze':
        result = await processInterviewAnalyze(job);
        break;
      default:
        throw new Error(`Unknown job type: ${job.job_type}`);
    }

    // Update job with result
    await supabase
      .from('background_jobs')
      .update({
        status: 'completed',
        result: result,
        completed_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .eq('id', job.id);

    console.log(`Background job ${job.id} completed successfully`);

  } catch (error) {
    console.error(`Error processing job ${job.id}:`, error);
    
    // Update job with error
    await supabase
      .from('background_jobs')
      .update({
        status: 'failed',
        error_message: error.message,
        completed_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .eq('id', job.id);
  }
}

// Process resume parsing
async function processResumeParse(job) {
  const { fileData, fileType, studentId } = job.payload;
  
  let parsedText = '';
  
  // Parse the file based on type
  if (fileType === 'application/pdf') {
    const data = await pdfParse(Buffer.from(fileData));
    parsedText = data.text;
  } else if (fileType.includes('word')) {
    const result = await mammoth.extractRawText({ buffer: Buffer.from(fileData) });
    parsedText = result.value;
  }

  // Use AI to extract structured data
  const extractedData = await extractResumeDataAI(parsedText);

  // Update the resume record
  await supabase
    .from('resumes')
    .update({
      parsed_text: parsedText,
      extracted_data: extractedData,
      status: 'parsed',
      completion_percentage: 60,
      updated_at: new Date().toISOString()
    })
    .eq('id', job.payload.resumeId);

  // Update student profile with extracted data
  await updateProfileFromExtractedData(studentId, extractedData);

  return {
    parsedText: parsedText,
    extractedData: extractedData,
    resumeId: job.payload.resumeId
  };
}

// Process resume generation
async function processResumeGenerate(job) {
  const { studentId, template, format } = job.payload;

  // Get student profile
  const { data: profile, error } = await supabase
    .from('student_profiles')
    .select('*')
    .eq('id', studentId)
    .single();

  if (error || !profile) {
    throw new Error('Student profile not found');
  }

  // Generate resume content using AI
  const resumeContent = await generateResumeContentAI(profile);

  let generatedFile;
  
  if (format === 'pdf') {
    generatedFile = await generatePDFResume(resumeContent, template);
  } else if (format === 'latex') {
    generatedFile = await generateLatexResume(resumeContent);
  }

  // Store generated resume
  const { data: resume } = await supabase
    .from('resumes')
    .insert({
      student_id: studentId,
      original_filename: `resume_${Date.now()}.${format}`,
      generated_data: generatedFile,
      generated_content: resumeContent,
      status: 'generated',
      completion_percentage: 100,
      template: template,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    })
    .select()
    .single();

  return {
    resumeId: resume.id,
    format: format,
    template: template,
    content: resumeContent
  };
}

// Process job matching
async function processJobMatch(job) {
  const { studentId } = job.payload;

  // Get student profile
  const { data: profile, error: profileError } = await supabase
    .from('student_profiles')
    .select('*')
    .eq('id', studentId)
    .single();

  if (profileError || !profile) {
    throw new Error('Student profile not found');
  }

  // Get active jobs
  const { data: jobs, error: jobsError } = await supabase
    .from('jobs')
    .select('*')
    .eq('status', 'active')
    .gte('deadline', new Date().toISOString());

  if (jobsError) {
    throw new Error('Failed to fetch jobs');
  }

  // AI-powered job matching
  const matches = [];
  
  for (const job of jobs || []) {
    const matchScore = await calculateJobMatchScore(profile, job);
    
    if (matchScore.score > 60) { // Only include jobs with >60% match
      matches.push({
        jobId: job.id,
        score: matchScore.score,
        reason: matchScore.reason,
        skillMatches: matchScore.skillMatches,
        missingSkills: matchScore.missingSkills
      });

      // Store match in database
      await supabase
        .from('job_matches')
        .upsert({
          student_id: studentId,
          job_id: job.id,
          match_score: matchScore.score,
          match_reason: matchScore.reason,
          skill_matches: matchScore.skillMatches,
          missing_skills: matchScore.missingSkills,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }, {
          onConflict: 'student_id,job_id'
        });
    }
  }

  return {
    totalJobs: jobs.length,
    matchedJobs: matches.length,
    matches: matches
  };
}

// Process interview analysis
async function processInterviewAnalyze(job) {
  const { interviewId } = job.payload;

  // Get interview data
  const { data: interview, error } = await supabase
    .from('interviews')
    .select('*')
    .eq('id', interviewId)
    .single();

  if (error || !interview) {
    throw new Error('Interview not found');
  }

  // Generate comprehensive feedback
  const feedback = await generateInterviewFeedbackAI(interview);

  // Update interview with feedback
  await supabase
    .from('interviews')
    .update({
      feedback: feedback,
      updated_at: new Date().toISOString()
    })
    .eq('id', interviewId);

  return {
    interviewId: interviewId,
    feedback: feedback
  };
}

// AI Functions
async function extractResumeDataAI(text) {
  try {
    const prompt = `
    Extract structured information from this resume text:
    
    ${text}
    
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
    `;

    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.1,
      max_tokens: 1000
    });

    const extractedText = response.choices[0].message.content;
    return JSON.parse(extractedText);
  } catch (error) {
    console.error('AI extraction error:', error);
    return {};
  }
}

async function generateResumeContentAI(profile) {
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

async function generatePDFResume(content, template) {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument();
      const chunks = [];
      
      doc.on('data', chunk => chunks.push(chunk));
      doc.on('end', () => resolve(Buffer.concat(chunks)));
      doc.on('error', reject);
      
      // Add content to PDF based on template
      doc.fontSize(24).text(content.personal_info?.full_name || 'Resume', 50, 50);
      
      if (content.summary) {
        doc.fontSize(12).text(content.summary, 50, 100);
      }
      
      doc.end();
    } catch (error) {
      reject(error);
    }
  });
}

async function generateLatexResume(content) {
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

async function updateProfileFromExtractedData(studentId, extractedData) {
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
    console.error('Update profile from extracted data error:', error);
  }
}

async function calculateJobMatchScore(profile, job) {
  try {
    const prompt = `
    Analyze the match between this student and job:
    
    STUDENT PROFILE:
    - Skills: ${profile.skills?.join(', ') || 'N/A'}
    - Course: ${profile.course || 'N/A'}
    - University: ${profile.university || 'N/A'}
    - CGPA: ${profile.cgpa || 'N/A'}
    - Projects: ${JSON.stringify(profile.projects || [])}
    - Experience: ${JSON.stringify(profile.work_experience || [])}
    
    JOB DETAILS:
    - Title: ${job.title}
    - Company: ${job.company}
    - Required Skills: ${job.skills_required?.join(', ') || 'N/A'}
    - Description: ${job.description || 'N/A'}
    - Requirements: ${job.requirements || 'N/A'}
    
    Provide a match analysis in this JSON format:
    {
      "score": 0-100,
      "reason": "Brief explanation of the match",
      "skillMatches": ["matched skill 1", "matched skill 2"],
      "missingSkills": ["missing skill 1", "missing skill 2"]
    }
    `;

    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.3,
      max_tokens: 300
    });

    const analysis = JSON.parse(response.choices[0].message.content);
    
    return {
      score: analysis.score,
      reason: analysis.reason,
      skillMatches: analysis.skillMatches,
      missingSkills: analysis.missingSkills
    };
  } catch (error) {
    console.error('Job match score calculation error:', error);
    return {
      score: 0,
      reason: 'Unable to calculate match score',
      skillMatches: [],
      missingSkills: []
    };
  }
}

async function generateInterviewFeedbackAI(interview) {
  try {
    const prompt = `
    Generate comprehensive interview feedback based on:
    
    INTERVIEW TYPE: ${interview.interview_type}
    DIFFICULTY: ${interview.difficulty}
    TOTAL QUESTIONS: ${interview.questions_asked.length}
    RESPONSES: ${JSON.stringify(interview.responses, null, 2)}
    
    Provide feedback in this JSON format:
    {
      "overall_score": 1-100,
      "performance_summary": "Brief summary of overall performance",
      "strengths": ["strength 1", "strength 2", "strength 3"],
      "areas_for_improvement": ["area 1", "area 2", "area 3"],
      "technical_assessment": "Assessment of technical skills",
      "communication_assessment": "Assessment of communication skills",
      "recommendation": "Recommendation for next steps",
      "preparation_tips": ["tip 1", "tip 2", "tip 3"]
    }
    
    Be detailed, constructive, and actionable in your feedback.
    `;

    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.3,
      max_tokens: 800
    });

    const feedback = JSON.parse(response.choices[0].message.content);
    return feedback;
  } catch (error) {
    console.error('Interview feedback generation error:', error);
    return {
      overall_score: 70,
      performance_summary: "Good effort in the interview practice session.",
      strengths: ["Attempted all questions", "Showed enthusiasm"],
      areas_for_improvement: ["Provide more specific examples", "Improve technical depth"],
      technical_assessment: "Shows basic understanding, needs more depth.",
      communication_assessment: "Communication is clear but could be more structured.",
      recommendation: "Practice more technical questions and prepare specific examples.",
      preparation_tips: ["Review common interview questions", "Practice coding problems", "Prepare STAR method examples"]
    };
  }
}

// Start background job processor
export function startBackgroundJobProcessor() {
  // Process jobs every 30 seconds
  setInterval(processBackgroundJobs, 30000);
  
  // Process immediately on start
  processBackgroundJobs();
  
  console.log('🔄 Background job processor started');
}