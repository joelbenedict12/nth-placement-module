import fs from 'fs';
import path from 'path';

// Mock OpenAI client for testing
const openai = {
  chat: {
    completions: {
      create: async ({ messages }) => {
        console.log('AI extraction called with message:', messages[0].content.substring(0, 200));
        
        // Simulate AI response based on the test resume content
        return {
          choices: [{
            message: {
              content: JSON.stringify({
                personal_info: {
                  full_name: "John Doe",
                  email: "john.doe@email.com",
                  phone: "(555) 123-4567",
                  location: "San Francisco, CA",
                  linkedin_url: "linkedin.com/in/johndoe",
                  github_url: "github.com/johndoe"
                },
                education: [{
                  institution: "Stanford University",
                  degree: "Bachelor of Science",
                  field: "Computer Science",
                  graduation_year: "2019",
                  cgpa: "3.8/4.0"
                }],
                experience: [{
                  title: "Senior Software Engineer",
                  company: "TechCorp Inc.",
                  duration: "June 2021 - Present",
                  description: "Developed and maintained React-based web applications serving 100K+ daily users. Implemented RESTful APIs using Node.js and Express, improving response time by 40%. Led migration to AWS cloud services, reducing infrastructure costs by 30%."
                }, {
                  title: "Software Engineer",
                  company: "StartupXYZ",
                  duration: "June 2019 - May 2021",
                  description: "Built full-stack features using React, Node.js, and PostgreSQL. Implemented automated testing suite, increasing code coverage from 45% to 85%."
                }],
                skills: {
                  technical: ["JavaScript", "TypeScript", "React", "Node.js", "Python", "Java", "Vue.js", "HTML5", "CSS3", "Tailwind CSS", "Express.js", "Django", "Spring Boot", "PostgreSQL", "MongoDB", "Redis", "AWS", "Docker", "Kubernetes"],
                  soft: ["Team Collaboration", "Mentoring", "Code Review", "Problem Solving"]
                },
                projects: [{
                  name: "E-commerce Platform",
                  description: "Developed a full-stack e-commerce solution with payment integration",
                  technologies: ["React", "Node.js", "Stripe API", "PostgreSQL"]
                }, {
                  name: "Task Management App",
                  description: "Created cross-platform mobile app for team collaboration",
                  technologies: ["React Native", "Firebase", "Redux"]
                }],
                achievements: [
                  "Winner of Company Hackathon 2022",
                  "Published article on Best Practices for React Performance Optimization",
                  "Speaker at local JavaScript meetup"
                ]
              }, null, 2)
            }
          }]
        };
      }
    }
  }
};

// Test the extraction function
async function testExtraction() {
  try {
    const resumeText = fs.readFileSync('test_resume.txt', 'utf8');
    console.log('Test resume loaded, length:', resumeText.length);
    
    // Simulate the extraction function from resumes.js
    async function extractResumeData(text) {
      try {
        console.log('Starting AI extraction for text length:', text.length);
        
        if (!text || text.length < 10) {
          console.log('Text too short for extraction');
          return {};
        }

        const prompt = `
        Extract structured information from this resume text:
        
        ${text.substring(0, 4000)}
        
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
    
    const result = await extractResumeData(resumeText);
    console.log('Extraction result:', JSON.stringify(result, null, 2));
    
    // Check if the extraction worked
    if (result.personal_info && result.personal_info.full_name) {
      console.log('✅ AI extraction successful! Found name:', result.personal_info.full_name);
    } else {
      console.log('❌ AI extraction failed - no personal info found');
    }
    
  } catch (error) {
    console.error('Test failed:', error);
  }
}

testExtraction();