import axios from 'axios';
import FormData from 'form-data';
import fs from 'fs';

const API_BASE_URL = 'http://localhost:8083/api';

async function testUploadWithDebugging() {
  console.log('🧪 Testing PDF upload with detailed debugging...\n');
  
  try {
    // Login first
    console.log('🔑 Logging in...');
    const loginResponse = await axios.post(`${API_BASE_URL}/auth/login`, {
      email: 'test@example.com',
      password: 'password123'
    });
    
    const authToken = loginResponse.data.token;
    console.log('✅ Login successful');
    
    // Create a simple text-based resume (not PDF) to test the flow
    console.log('\n📄 Creating simple text resume...');
    const resumeText = `JANE SMITH
Software Engineer
Email: jane.smith@email.com | Phone: (555) 987-6543
Location: New York, NY

EXPERIENCE
Senior Software Engineer at TechCorp Inc. (2021-Present)
- Developed React applications serving 50K+ users
- Implemented REST APIs using Node.js and Express

Software Engineer at StartupXYZ (2019-2021)
- Built full-stack features using React, Node.js, and PostgreSQL
- Increased code coverage from 45% to 85%

EDUCATION
Bachelor of Science in Computer Science
University of Technology, 2019
GPA: 3.7/4.0

SKILLS
JavaScript, React, Node.js, Python, PostgreSQL, AWS

PROJECTS
E-commerce Platform - React, Node.js, PostgreSQL
Task Management App - React Native, Firebase`;
    
    fs.writeFileSync('jane_resume.txt', resumeText);
    console.log('✅ Created text resume file');
    
    // Test upload with text file first
    console.log('\n📤 Testing text file upload...');
    const formData = new FormData();
    formData.append('resume', fs.readFileSync('jane_resume.txt'), {
      filename: 'jane_resume.txt',
      contentType: 'text/plain'
    });
    
    console.log('Upload details:');
    console.log('- File size:', fs.statSync('jane_resume.txt').size, 'bytes');
    console.log('- Content type: text/plain');
    console.log('- Authorization: Bearer', authToken.substring(0, 20) + '...');
    
    const uploadResponse = await axios.post(`${API_BASE_URL}/resumes/upload`, formData, {
      headers: {
        ...formData.getHeaders(),
        'Authorization': `Bearer ${authToken}`
      },
      timeout: 30000,
      validateStatus: function (status) {
        return status < 500; // Don't throw on 4xx errors, we want to see them
      }
    });
    
    console.log('\n📊 Upload response:');
    console.log('Status:', uploadResponse.status);
    console.log('Data:', JSON.stringify(uploadResponse.data, null, 2));
    
    if (uploadResponse.status === 200) {
      console.log('🎉 Upload successful!');
      
      // Check if AI extracted data
      if (uploadResponse.data.resume?.extracted_data) {
        console.log('\n🤖 AI Extraction Results:');
        const extracted = uploadResponse.data.resume.extracted_data;
        console.log('- Name:', extracted.personal_info?.full_name || 'Not found');
        console.log('- Email:', extracted.personal_info?.email || 'Not found');
        console.log('- Experience entries:', extracted.experience?.length || 0);
        console.log('- Skills:', extracted.skills?.technical?.length || 0);
      }
    } else if (uploadResponse.status === 415) {
      console.log('❌ Unsupported file type - text/plain not allowed');
      console.log('🔄 Trying with Word document format...');
      
      // Try with DOCX format
      const docxFormData = new FormData();
      docxFormData.append('resume', resumeText, {
        filename: 'jane_resume.docx',
        contentType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
      });
      
      const docxResponse = await axios.post(`${API_BASE_URL}/resumes/upload`, docxFormData, {
        headers: {
          ...docxFormData.getHeaders(),
          'Authorization': `Bearer ${authToken}`
        },
        timeout: 30000
      });
      
      console.log('DOCX upload response:', JSON.stringify(docxResponse.data, null, 2));
      
    } else {
      console.log('❌ Upload failed with status:', uploadResponse.status);
    }
    
    // Clean up
    fs.unlinkSync('jane_resume.txt');
    
  } catch (error) {
    console.error('❌ Test failed completely:', error.message);
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
    }
  }
}

testUploadWithDebugging();