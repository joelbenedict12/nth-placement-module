import OpenAI from 'openai';

// Test the OpenAI API directly
const openai = new OpenAI({
  apiKey: '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'
});

async function testAIExtraction() {
  console.log('🤖 Testing OpenAI API extraction directly...\n');
  
  const testResumeText = `JANE SMITH
Software Engineer
Email: jane.smith@email.com
Phone: (555) 987-6543
Location: New York, NY
LinkedIn: linkedin.com/in/janesmith

PROFESSIONAL SUMMARY
Experienced software engineer with 4+ years developing web applications.
Expertise in React, Node.js, and database design.

EXPERIENCE

Senior Software Engineer
TechCorp Inc., New York, NY
June 2021 - Present
- Developed React applications serving 50K+ users daily
- Implemented REST APIs using Node.js and Express
- Led migration to AWS cloud services

Software Engineer  
StartupXYZ, San Francisco, CA  
June 2019 - May 2021  
- Built full-stack features using React, Node.js, and PostgreSQL
- Increased code coverage from 45% to 85%
- Collaborated with product team to launch 3 major features

EDUCATION

Bachelor of Science in Computer Science
University of Technology, San Francisco, CA
Graduated: May 2019
GPA: 3.7/4.0

TECHNICAL SKILLS

Programming Languages: JavaScript, TypeScript, Python, Java
Frontend Technologies: React, Vue.js, HTML5, CSS3, Tailwind CSS
Backend Technologies: Node.js, Express.js, Django, Spring Boot
Databases: PostgreSQL, MongoDB, Redis
Cloud & DevOps: AWS, Docker, Kubernetes, Jenkins
Tools: Git, JIRA, VS Code, Postman`;
  
  try {
    const prompt = `
    Extract structured information from this resume text:
    
    ${testResumeText}
    
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

    console.log('📝 Sending request to OpenAI...');
    console.log('Prompt length:', prompt.length, 'characters');
    
    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.1,
      max_tokens: 1000
    });

    console.log('✅ OpenAI API response received!');
    console.log('Tokens used:', response.usage?.total_tokens || 'unknown');
    
    const extractedText = response.choices[0].message.content;
    console.log('\n📋 Raw AI Response:');
    console.log(extractedText);
    
    try {
      const parsedData = JSON.parse(extractedText);
      console.log('\n🎯 Parsed Data:');
      console.log(JSON.stringify(parsedData, null, 2));
      
      // Check what was extracted
      console.log('\n📊 Extraction Summary:');
      if (parsedData.personal_info?.full_name) {
        console.log('✅ Name extracted:', parsedData.personal_info.full_name);
      } else {
        console.log('❌ Name not extracted');
      }
      
      if (parsedData.personal_info?.email) {
        console.log('✅ Email extracted:', parsedData.personal_info.email);
      } else {
        console.log('❌ Email not extracted');
      }
      
      if (parsedData.experience?.length > 0) {
        console.log('✅ Experience entries:', parsedData.experience.length);
      } else {
        console.log('❌ No experience extracted');
      }
      
      if (parsedData.skills?.technical?.length > 0) {
        console.log('✅ Technical skills:', parsedData.skills.technical.length);
      } else {
        console.log('❌ No technical skills extracted');
      }
      
      if (parsedData.education?.length > 0) {
        console.log('✅ Education entries:', parsedData.education.length);
      } else {
        console.log('❌ No education extracted');
      }
      
    } catch (parseError) {
      console.log('\n❌ Failed to parse AI response as JSON');
      console.log('Raw response:', extractedText);
      
      // Try to extract JSON from the response
      const jsonMatch = extractedText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        console.log('\n🔍 Found potential JSON:', jsonMatch[0].substring(0, 200) + '...');
      }
    }
    
  } catch (error) {
    console.error('❌ OpenAI API error:', error.message);
    if (error.response) {
      console.log('Response status:', error.response.status);
      console.log('Response data:', error.response.data);
    } else if (error.code === 'ENOTFOUND') {
      console.log('🚨 Network error - cannot reach OpenAI API');
    } else if (error.message.includes('API key')) {
      console.log('🚨 API key issue - check if the key is valid');
    }
  }
}

testAIExtraction();