import express from 'express';
import { supabase, io } from '../server.js';
import OpenAI from 'openai';

const router = express.Router();

// Initialize OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || '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'
});

// Start a new mock interview
router.post('/start', async (req, res) => {
  try {
    const userId = req.user.id;
    const { job_id, interview_type = 'technical', difficulty = 'medium' } = req.body;

    // Get student profile
    const { data: profile, error: profileError } = await supabase
      .from('student_profiles')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (profileError || !profile) {
      return res.status(404).json({ error: 'Student profile not found' });
    }

    // Get job details if job_id is provided
    let job = null;
    if (job_id) {
      const { data: jobData, error: jobError } = await supabase
        .from('jobs')
        .select('*')
        .eq('id', job_id)
        .single();
      
      if (!jobError && jobData) {
        job = jobData;
      }
    }

    // Generate first question using AI
    const firstQuestion = await generateInterviewQuestion(profile, job, interview_type, difficulty);

    // Create interview session
    const { data: interview, error: interviewError } = await supabase
      .from('interviews')
      .insert({
        student_id: profile.id,
        job_id: job_id,
        interview_type: interview_type,
        difficulty: difficulty,
        status: 'active',
        current_question: firstQuestion,
        questions_asked: [firstQuestion],
        responses: [],
        started_at: new Date().toISOString(),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .select()
      .single();

    if (interviewError) {
      throw interviewError;
    }

    res.json({
      message: 'Interview started successfully',
      interview: {
        id: interview.id,
        current_question: firstQuestion,
        interview_type: interview.interview_type,
        difficulty: interview.difficulty
      }
    });
  } catch (error) {
    console.error('Start interview error:', error);
    res.status(500).json({ error: 'Failed to start interview' });
  }
});

// Submit answer and get next question
router.post('/:id/answer', async (req, res) => {
  try {
    const userId = req.user.id;
    const interviewId = req.params.id;
    const { answer } = req.body;

    // Get student profile
    const { data: profile, error: profileError } = await supabase
      .from('student_profiles')
      .select('id')
      .eq('user_id', userId)
      .single();

    if (profileError || !profile) {
      return res.status(404).json({ error: 'Student profile not found' });
    }

    // Get current interview
    const { data: interview, error: interviewError } = await supabase
      .from('interviews')
      .select('*')
      .eq('id', interviewId)
      .eq('student_id', profile.id)
      .eq('status', 'active')
      .single();

    if (interviewError || !interview) {
      return res.status(404).json({ error: 'Interview not found or not active' });
    }

    // Analyze answer using AI
    const analysis = await analyzeAnswer(interview.current_question, answer, interview.interview_type);

    // Store response
    const responses = [...interview.responses];
    responses.push({
      question: interview.current_question,
      answer: answer,
      analysis: analysis,
      timestamp: new Date().toISOString()
    });

    // Generate next question
    const nextQuestion = await generateNextQuestion(interview, answer, analysis);

    // Update interview
    const questionsAsked = [...interview.questions_asked, nextQuestion];
    
    const { data: updatedInterview, error: updateError } = await supabase
      .from('interviews')
      .update({
        current_question: nextQuestion,
        questions_asked: questionsAsked,
        responses: responses,
        updated_at: new Date().toISOString()
      })
      .eq('id', interviewId)
      .select()
      .single();

    if (updateError) {
      throw updateError;
    }

    // Emit real-time update
    io.to(`interview-${interviewId}`).emit('question-answered', {
      question: interview.current_question,
      answer: answer,
      analysis: analysis,
      next_question: nextQuestion
    });

    res.json({
      message: 'Answer submitted successfully',
      analysis: analysis,
      next_question: nextQuestion,
      questions_asked: questionsAsked.length,
      total_questions: 8 // Limit to 8 questions per interview
    });
  } catch (error) {
    console.error('Submit answer error:', error);
    res.status(500).json({ error: 'Failed to submit answer' });
  }
});

// End interview and get feedback
router.post('/:id/end', async (req, res) => {
  try {
    const userId = req.user.id;
    const interviewId = req.params.id;

    // Get student profile
    const { data: profile, error: profileError } = await supabase
      .from('student_profiles')
      .select('id')
      .eq('user_id', userId)
      .single();

    if (profileError || !profile) {
      return res.status(404).json({ error: 'Student profile not found' });
    }

    // Get current interview
    const { data: interview, error: interviewError } = await supabase
      .from('interviews')
      .select('*')
      .eq('id', interviewId)
      .eq('student_id', profile.id)
      .eq('status', 'active')
      .single();

    if (interviewError || !interview) {
      return res.status(404).json({ error: 'Interview not found or not active' });
    }

    // Generate comprehensive feedback
    const feedback = await generateInterviewFeedback(interview);

    // Update interview status
    const { data: updatedInterview, error: updateError } = await supabase
      .from('interviews')
      .update({
        status: 'completed',
        feedback: feedback,
        completed_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .eq('id', interviewId)
      .select()
      .single();

    if (updateError) {
      throw updateError;
    }

    res.json({
      message: 'Interview completed successfully',
      feedback: feedback,
      total_questions: interview.questions_asked.length,
      duration: Math.round((new Date() - new Date(interview.started_at)) / 1000 / 60)
    });
  } catch (error) {
    console.error('End interview error:', error);
    res.status(500).json({ error: 'Failed to end interview' });
  }
});

// Get interview history
router.get('/history', async (req, res) => {
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

    const { data: interviews, error } = await supabase
      .from('interviews')
      .select(`
        *,
        jobs (
          id,
          title,
          company
        )
      `)
      .eq('student_id', profile.id)
      .order('created_at', { ascending: false });

    if (error) {
      throw error;
    }

    res.json({ interviews: interviews || [] });
  } catch (error) {
    console.error('Get interview history error:', error);
    res.status(500).json({ error: 'Failed to fetch interview history' });
  }
});

// Get specific interview details
router.get('/:id', async (req, res) => {
  try {
    const userId = req.user.id;
    const interviewId = req.params.id;

    const { data: profile, error: profileError } = await supabase
      .from('student_profiles')
      .select('id')
      .eq('user_id', userId)
      .single();

    if (profileError || !profile) {
      return res.status(404).json({ error: 'Student profile not found' });
    }

    const { data: interview, error } = await supabase
      .from('interviews')
      .select(`
        *,
        jobs (
          id,
          title,
          company,
          description
        )
      `)
      .eq('id', interviewId)
      .eq('student_id', profile.id)
      .single();

    if (error || !interview) {
      return res.status(404).json({ error: 'Interview not found' });
    }

    res.json({ interview });
  } catch (error) {
    console.error('Get interview error:', error);
    res.status(500).json({ error: 'Failed to fetch interview' });
  }
});

// AI Functions
async function generateInterviewQuestion(profile, job, interviewType, difficulty) {
  try {
    const prompt = `
    Generate an interview question for this candidate:
    
    STUDENT PROFILE:
    - Name: ${profile.full_name}
    - Course: ${profile.course}
    - University: ${profile.university}
    - Skills: ${profile.skills?.join(', ') || 'N/A'}
    - Projects: ${JSON.stringify(profile.projects || [])}
    - Experience: ${JSON.stringify(profile.work_experience || [])}
    
    ${job ? `JOB DETAILS:
    - Title: ${job.title}
    - Company: ${job.company}
    - Required Skills: ${job.skills_required?.join(', ') || 'N/A'}
    - Description: ${job.description || 'N/A'}` : ''}
    
    INTERVIEW TYPE: ${interviewType}
    DIFFICULTY: ${difficulty}
    
    Generate a relevant interview question that tests the candidate's knowledge and experience.
    Make it appropriate for their skill level and the job requirements.
    `;

    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.7,
      max_tokens: 200
    });

    return response.choices[0].message.content.trim();
  } catch (error) {
    console.error('Generate question error:', error);
    return "Tell me about yourself and your experience with the technologies mentioned in your resume.";
  }
}

async function analyzeAnswer(question, answer, interviewType) {
  try {
    const prompt = `
    Analyze this interview answer:
    
    QUESTION: ${question}
    ANSWER: ${answer}
    INTERVIEW TYPE: ${interviewType}
    
    Provide feedback in this JSON format:
    {
      "score": 1-10,
      "feedback": "Brief feedback on the answer",
      "strengths": ["strength 1", "strength 2"],
      "improvements": ["improvement 1", "improvement 2"],
      "next_topic": "Suggested next topic to explore"
    }
    
    Be constructive and specific in your feedback.
    `;

    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.3,
      max_tokens: 300
    });

    const feedbackText = response.choices[0].message.content;
    return JSON.parse(feedbackText);
  } catch (error) {
    console.error('Analyze answer error:', error);
    return {
      score: 5,
      feedback: "Good attempt. Keep practicing to improve your responses.",
      strengths: ["Attempted to answer"],
      improvements: ["Provide more specific examples"],
      next_topic: "Technical skills"
    };
  }
}

async function generateNextQuestion(interview, lastAnswer, analysis) {
  try {
    const prompt = `
    Generate the next interview question based on:
    
    PREVIOUS QUESTION: ${interview.current_question}
    STUDENT ANSWER: ${lastAnswer}
    ANALYSIS: ${JSON.stringify(analysis)}
    INTERVIEW TYPE: ${interview.interview_type}
    DIFFICULTY: ${interview.difficulty}
    QUESTIONS ASKED SO FAR: ${interview.questions_asked.length}
    
    Generate a follow-up question that:
    1. Builds on the previous answer
    2. Addresses any gaps or areas for improvement
    3. Progresses the interview logically
    4. Maintains appropriate difficulty level
    
    Make it natural and conversational.
    `;

    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.6,
      max_tokens: 200
    });

    return response.choices[0].message.content.trim();
  } catch (error) {
    console.error('Generate next question error:', error);
    return "What would you do differently if you faced this situation again?";
  }
}

async function generateInterviewFeedback(interview) {
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

    const feedbackText = response.choices[0].message.content;
    return JSON.parse(feedbackText);
  } catch (error) {
    console.error('Generate feedback error:', error);
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

export default router;