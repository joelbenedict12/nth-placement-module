import express from 'express';
import { supabase } from '../server.js';
import OpenAI from 'openai';

const router = express.Router();

// Initialize OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || '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'
});

// Get job recommendations for student
router.get('/recommendations', async (req, res) => {
  try {
    const userId = req.user.id;

    // Get student profile
    const { data: profile, error: profileError } = await supabase
      .from('student_profiles')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (profileError || !profile) {
      return res.status(404).json({ error: 'Student profile not found' });
    }

    // Get active jobs
    const { data: jobs, error: jobsError } = await supabase
      .from('jobs')
      .select('*')
      .eq('status', 'active')
      .gte('deadline', new Date().toISOString())
      .order('created_at', { ascending: false });

    if (jobsError) {
      throw jobsError;
    }

    // AI-powered job matching
    const jobMatches = await matchJobsWithStudent(profile, jobs);

    // Store matches in database
    for (const match of jobMatches) {
      await supabase
        .from('job_matches')
        .upsert({
          student_id: profile.id,
          job_id: match.job.id,
          match_score: match.score,
          match_reason: match.reason,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }, {
          onConflict: 'student_id,job_id'
        });
    }

    res.json({
      matches: jobMatches,
      totalJobs: jobs.length,
      matchedJobs: jobMatches.length
    });
  } catch (error) {
    console.error('Job recommendations error:', error);
    res.status(500).json({ error: 'Failed to get job recommendations' });
  }
});

// Get all jobs with filters
router.get('/', async (req, res) => {
  try {
    const { 
      location, 
      skills, 
      company, 
      job_type, 
      experience_level,
      page = 1, 
      limit = 20 
    } = req.query;

    let query = supabase
      .from('jobs')
      .select('*', { count: 'exact' })
      .eq('status', 'active')
      .gte('deadline', new Date().toISOString());

    // Apply filters
    if (location) {
      query = query.ilike('location', `%${location}%`);
    }
    if (company) {
      query = query.ilike('company', `%${company}%`);
    }
    if (job_type) {
      query = query.eq('job_type', job_type);
    }
    if (experience_level) {
      query = query.eq('experience_level', experience_level);
    }
    if (skills) {
      const skillsArray = skills.split(',');
      query = query.contains('skills_required', skillsArray);
    }

    // Pagination
    const start = (page - 1) * limit;
    const end = start + limit - 1;
    query = query.range(start, end);

    const { data: jobs, error, count } = await query;

    if (error) {
      throw error;
    }

    res.json({
      jobs: jobs || [],
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: count || 0,
        totalPages: Math.ceil((count || 0) / limit)
      }
    });
  } catch (error) {
    console.error('Get jobs error:', error);
    res.status(500).json({ error: 'Failed to fetch jobs' });
  }
});

// Get specific job details
router.get('/:id', async (req, res) => {
  try {
    const jobId = req.params.id;

    const { data: job, error } = await supabase
      .from('jobs')
      .select('*')
      .eq('id', jobId)
      .single();

    if (error || !job) {
      return res.status(404).json({ error: 'Job not found' });
    }

    res.json({ job });
  } catch (error) {
    console.error('Get job error:', error);
    res.status(500).json({ error: 'Failed to fetch job' });
  }
});

// Apply to job
router.post('/:id/apply', async (req, res) => {
  try {
    const userId = req.user.id;
    const jobId = req.params.id;
    const { cover_letter } = req.body;

    // Get student profile
    const { data: profile, error: profileError } = await supabase
      .from('student_profiles')
      .select('id')
      .eq('user_id', userId)
      .single();

    if (profileError || !profile) {
      return res.status(404).json({ error: 'Student profile not found' });
    }

    // Check if already applied
    const { data: existingApplication } = await supabase
      .from('applications')
      .select('id')
      .eq('student_id', profile.id)
      .eq('job_id', jobId)
      .single();

    if (existingApplication) {
      return res.status(409).json({ error: 'Already applied to this job' });
    }

    // Create application
    const { data: application, error } = await supabase
      .from('applications')
      .insert({
        student_id: profile.id,
        job_id: jobId,
        cover_letter: cover_letter || '',
        status: 'submitted',
        applied_at: new Date().toISOString(),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .select()
      .single();

    if (error) {
      throw error;
    }

    res.json({
      message: 'Application submitted successfully',
      application
    });
  } catch (error) {
    console.error('Apply to job error:', error);
    res.status(500).json({ error: 'Failed to apply to job' });
  }
});

// Get student's applications
router.get('/my/applications', async (req, res) => {
  try {
    const userId = req.user.id;

    const { data: profile, error: profileError } = await supabase
      .from('student_profiles')
      .select('id')
      .eq('user_id', userId)
      .single();

    if (profileError || !profile) {
      return res.status(404).json({ error: 'Student profile not found' });
    }

    const { data: applications, error } = await supabase
      .from('applications')
      .select(`
        *,
        jobs (
          id,
          title,
          company,
          location,
          job_type,
          salary_range
        )
      `)
      .eq('student_id', profile.id)
      .order('applied_at', { ascending: false });

    if (error) {
      throw error;
    }

    res.json({ applications: applications || [] });
  } catch (error) {
    console.error('Get applications error:', error);
    res.status(500).json({ error: 'Failed to fetch applications' });
  }
});

// AI-powered job matching function
async function matchJobsWithStudent(profile, jobs) {
  const matches = [];

  for (const job of jobs) {
    const match = await analyzeJobMatch(profile, job);
    if (match.score > 60) { // Only include jobs with >60% match
      matches.push(match);
    }
  }

  // Sort by match score (highest first)
  return matches.sort((a, b) => b.score - a.score);
}

// Analyze individual job match
async function analyzeJobMatch(profile, job) {
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
      "skill_matches": ["matched skill 1", "matched skill 2"],
      "missing_skills": ["missing skill 1", "missing skill 2"],
      "recommendation": "Recommendation for the student"
    }
    `;

    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.3,
      max_tokens: 500
    });

    const analysis = JSON.parse(response.choices[0].message.content);

    return {
      job,
      score: analysis.score,
      reason: analysis.reason,
      skill_matches: analysis.skill_matches,
      missing_skills: analysis.missing_skills,
      recommendation: analysis.recommendation
    };
  } catch (error) {
    console.error('Job match analysis error:', error);
    return {
      job,
      score: 0,
      reason: 'Unable to analyze match',
      skill_matches: [],
      missing_skills: [],
      recommendation: 'Unable to provide recommendation'
    };
  }
}

export default router;