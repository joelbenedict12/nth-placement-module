import express from 'express';
import { supabase } from '../server.js';

const router = express.Router();

// Get student profile
router.get('/profile', async (req, res) => {
  try {
    const userId = req.user.id;

    const { data: profile, error } = await supabase
      .from('student_profiles')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (error) {
      throw error;
    }

    if (!profile) {
      return res.status(404).json({ error: 'Profile not found' });
    }

    res.json({ profile });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ error: 'Failed to fetch profile' });
  }
});

// Update student profile
router.put('/profile', async (req, res) => {
  try {
    const userId = req.user.id;
    const {
      full_name,
      phone,
      location,
      bio,
      skills,
      cgpa,
      github_url,
      linkedin_url,
      portfolio_url,
      achievements,
      projects,
      work_experience
    } = req.body;

    const updateData = {
      updated_at: new Date().toISOString()
    };

    // Add only provided fields
    if (full_name !== undefined) updateData.full_name = full_name;
    if (phone !== undefined) updateData.phone = phone;
    if (location !== undefined) updateData.location = location;
    if (bio !== undefined) updateData.bio = bio;
    if (skills !== undefined) updateData.skills = skills;
    if (cgpa !== undefined) updateData.cgpa = cgpa;
    if (github_url !== undefined) updateData.github_url = github_url;
    if (linkedin_url !== undefined) updateData.linkedin_url = linkedin_url;
    if (portfolio_url !== undefined) updateData.portfolio_url = portfolio_url;
    if (achievements !== undefined) updateData.achievements = achievements;
    if (projects !== undefined) updateData.projects = projects;
    if (work_experience !== undefined) updateData.work_experience = work_experience;

    const { data: profile, error } = await supabase
      .from('student_profiles')
      .update(updateData)
      .eq('user_id', userId)
      .select()
      .single();

    if (error) {
      throw error;
    }

    res.json({ 
      message: 'Profile updated successfully',
      profile 
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ error: 'Failed to update profile' });
  }
});

// Get student dashboard data
router.get('/dashboard', async (req, res) => {
  try {
    const userId = req.user.id;

    // Get student profile
    const { data: profile, error: profileError } = await supabase
      .from('student_profiles')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (profileError) {
      throw profileError;
    }

    // Get resume status
    const { data: resumes, error: resumeError } = await supabase
      .from('resumes')
      .select('id, status, completion_percentage, created_at')
      .eq('student_id', profile.id)
      .order('created_at', { ascending: false })
      .limit(1);

    if (resumeError) {
      throw resumeError;
    }

    // Get job matches
    const { data: jobMatches, error: jobError } = await supabase
      .from('job_matches')
      .select(`
        id,
        match_score,
        match_reason,
        jobs (
          id,
          title,
          company,
          location,
          skills_required,
          deadline,
          created_at
        )
      `)
      .eq('student_id', profile.id)
      .order('match_score', { ascending: false })
      .limit(5);

    if (jobError) {
      throw jobError;
    }

    // Get applications
    const { data: applications, error: appError } = await supabase
      .from('applications')
      .select(`
        id,
        status,
        applied_at,
        next_step,
        next_step_date,
        jobs (
          id,
          title,
          company
        )
      `)
      .eq('student_id', profile.id)
      .order('applied_at', { ascending: false })
      .limit(3);

    if (appError) {
      throw appError;
    }

    // Calculate profile strength
    const profileStrength = calculateProfileStrength(profile);

    res.json({
      profile,
      resume: resumes?.[0] || null,
      jobMatches: jobMatches || [],
      applications: applications || [],
      profileStrength
    });
  } catch (error) {
    console.error('Dashboard error:', error);
    res.status(500).json({ error: 'Failed to fetch dashboard data' });
  }
});

// Helper function to calculate profile strength
function calculateProfileStrength(profile) {
  let strength = 0;
  const totalFields = 10;
  
  if (profile.full_name) strength++;
  if (profile.email) strength++;
  if (profile.phone) strength++;
  if (profile.location) strength++;
  if (profile.bio) strength++;
  if (profile.skills && profile.skills.length > 0) strength++;
  if (profile.cgpa) strength++;
  if (profile.github_url || profile.linkedin_url || profile.portfolio_url) strength++;
  if (profile.projects && profile.projects.length > 0) strength++;
  if (profile.work_experience && profile.work_experience.length > 0) strength++;
  
  return Math.round((strength / totalFields) * 100);
}

export default router;