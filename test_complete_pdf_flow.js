import axios from 'axios';
import FormData from 'form-data';
import fs from 'fs';

const API_BASE_URL = 'http://localhost:8083/api';

async function testCompleteFlowWithRegistration() {
  console.log('🧪 Testing complete PDF upload flow with registration...\n');
  
  try {
    // Step 1: Register a new student user
    console.log('1️⃣ Registering new student user...');
    const registerResponse = await axios.post(`${API_BASE_URL}/auth/register`, {
      email: 'teststudent@example.com',
      password: 'password123',
      studentId: 'TEST123',
      fullName: 'Test Student',
      university: 'Test University',
      course: 'Computer Science',
      graduationYear: '2024'
    });
    
    console.log('✅ Registration successful:', registerResponse.data.message);
    const token = registerResponse.data.token;
    
    // Step 2: Login to verify credentials work
    console.log('\n2️⃣ Testing login...');
    const loginResponse = await axios.post(`${API_BASE_URL}/auth/login`, {
      email: 'teststudent@example.com',
      password: 'password123'
    });
    
    console.log('✅ Login successful, got token');
    const authToken = loginResponse.data.token;
    
    // Step 3: Test getting resumes with auth
    console.log('\n3️⃣ Testing resume endpoint with auth...');
    const resumesResponse = await axios.get(`${API_BASE_URL}/resumes`, {
      headers: {
        'Authorization': `Bearer ${authToken}`
      }
    });
    
    console.log('✅ Resume endpoint working, found', resumesResponse.data.length, 'resumes');
    
    // Step 4: Create a proper test PDF file with resume content
    console.log('\n4️⃣ Creating test PDF resume file...');
    
    // Create a simple PDF file with resume content
    const pdfContent = `%PDF-1.4
1 0 obj
<<
/Type /Catalog
/Pages 2 0 R
>>
endobj
2 0 obj
<<
/Type /Pages
/Kids [3 0 R]
/Count 1
>>
endobj
3 0 obj
<<
/Type /Page
/Parent 2 0 R
/MediaBox [0 0 612 792]
/Contents 4 0 R
/Resources <<
  /Font <<
    /F1 5 0 R
  >>
>>
>>
endobj
4 0 obj
<<
/Length 200
>>
stream
BT
/F1 12 Tf
50 750 Td
(JANE SMITH) Tj
ET
BT
/F1 10 Tf
50 730 Td
(Software Engineer) Tj
ET
BT
/F1 10 Tf
50 710 Td
(Email: jane.smith@email.com | Phone: (555) 987-6543) Tj
ET
BT
/F1 10 Tf
50 690 Td
(Location: New York, NY | LinkedIn: linkedin.com/in/janesmith) Tj
ET
BT
/F1 12 Tf
50 650 Td
(PROFESSIONAL SUMMARY) Tj
ET
BT
/F1 10 Tf
50 630 Td
(Experienced software engineer with 4+ years developing web applications.) Tj
ET
BT
/F1 10 Tf
50 610 Td
(Expertise in React, Node.js, and database design.) Tj
ET
endstream
endobj
5 0 obj
<<
/Type /Font
/Subtype /Type1
/BaseFont /Helvetica
>>
endobj
xref
0 6
0000000000 65535 f 
0000000009 00000 n 
0000000058 00000 n 
0000000115 00000 n 
0000000203 00000 n 
0000000503 00000 n 
trailer
<<
/Size 6
/Root 1 0 R
>>
startxref
573
%%EOF`;
    
    fs.writeFileSync('jane_smith_resume.pdf', pdfContent);
    console.log('✅ Test PDF resume file created');
    
    // Step 5: Test PDF upload with AI parsing
    console.log('\n5️⃣ Testing PDF upload with AI parsing...');
    const formData = new FormData();
    formData.append('resume', fs.readFileSync('jane_smith_resume.pdf'), {
      filename: 'jane_smith_resume.pdf',
      contentType: 'application/pdf'
    });
    
    const uploadResponse = await axios.post(`${API_BASE_URL}/resumes/upload`, formData, {
      headers: {
        ...formData.getHeaders(),
        'Authorization': `Bearer ${authToken}`
      },
      timeout: 60000 // 60 seconds for AI processing
    });
    
    console.log('🎉 PDF upload and AI parsing successful!');
    console.log('Response data:', JSON.stringify(uploadResponse.data, null, 2));
    
    // Check if AI extracted the data correctly
    if (uploadResponse.data.resume && uploadResponse.data.resume.extracted_data) {
      const extracted = uploadResponse.data.resume.extracted_data;
      console.log('\n📊 AI Extraction Results:');
      console.log('- Personal Info:', extracted.personal_info || 'Not found');
      console.log('- Education:', extracted.education?.length || 0, 'entries');
      console.log('- Experience:', extracted.experience?.length || 0, 'entries');
      console.log('- Skills:', extracted.skills?.technical?.length || 0, 'technical skills');
    }
    
    // Clean up test file
    fs.unlinkSync('jane_smith_resume.pdf');
    
    console.log('\n✅ Complete PDF upload flow test successful!');
    
  } catch (error) {
    console.error('❌ Test failed:', error.response?.status, error.response?.data || error.message);
    
    if (error.response?.status === 409) {
      console.log('ℹ️  User already exists, trying login instead...');
      await testWithExistingUser();
    } else if (error.response?.status === 404) {
      console.log('🚨 **CRITICAL**: Upload endpoint returning 404 - route not found');
    } else if (error.response?.status === 401) {
      console.log('🚨 **AUTH ISSUE**: Token invalid or expired');
    } else if (error.response?.status === 500) {
      console.log('🚨 **SERVER ERROR**: Internal server error during upload');
      console.log('Error details:', error.response?.data);
    }
  }
}

async function testWithExistingUser() {
  console.log('\n🔄 Testing with existing user...');
  
  try {
    const loginResponse = await axios.post(`${API_BASE_URL}/auth/login`, {
      email: 'teststudent@example.com',
      password: 'password123'
    });
    
    console.log('✅ Login successful, got token');
    const authToken = loginResponse.data.token;
    
    // Create a proper test PDF file
    console.log('\nCreating test PDF resume file...');
    const pdfContent = `%PDF-1.4
1 0 obj
<<
/Type /Catalog
/Pages 2 0 R
>>
endobj
2 0 obj
<<
/Type /Pages
/Kids [3 0 R]
/Count 1
>>
endobj
3 0 obj
<<
/Type /Page
/Parent 2 0 R
/MediaBox [0 0 612 792]
/Contents 4 0 R
/Resources <<
  /Font <<
    /F1 5 0 R
  >>
>>
>>
endobj
4 0 obj
<<
/Length 200
>>
stream
BT
/F1 12 Tf
50 750 Td
(JANE SMITH) Tj
ET
BT
/F1 10 Tf
50 730 Td
(Software Engineer) Tj
ET
BT
/F1 10 Tf
50 710 Td
(Email: jane.smith@email.com | Phone: (555) 987-6543) Tj
ET
BT
/F1 10 Tf
50 690 Td
(Location: New York, NY | LinkedIn: linkedin.com/in/janesmith) Tj
ET
BT
/F1 12 Tf
50 650 Td
(PROFESSIONAL SUMMARY) Tj
ET
BT
/F1 10 Tf
50 630 Td
(Experienced software engineer with 4+ years developing web applications.) Tj
ET
BT
/F1 10 Tf
50 610 Td
(Expertise in React, Node.js, and database design.) Tj
ET
endstream
endobj
5 0 obj
<<
/Type /Font
/Subtype /Type1
/BaseFont /Helvetica
>>
endobj
xref
0 6
0000000000 65535 f 
0000000009 00000 n 
0000000058 00000 n 
0000000115 00000 n 
0000000203 00000 n 
0000000503 00000 n 
trailer
<<
/Size 6
/Root 1 0 R
>>
startxref
573
%%EOF`;
    
    fs.writeFileSync('jane_smith_resume.pdf', pdfContent);
    console.log('✅ Test PDF resume file created');
    
    // Test PDF upload
    console.log('\nTesting PDF upload with AI parsing...');
    const formData = new FormData();
    formData.append('resume', fs.readFileSync('jane_smith_resume.pdf'), {
      filename: 'jane_smith_resume.pdf',
      contentType: 'application/pdf'
    });
    
    const uploadResponse = await axios.post(`${API_BASE_URL}/resumes/upload`, formData, {
      headers: {
        ...formData.getHeaders(),
        'Authorization': `Bearer ${authToken}`
      },
      timeout: 60000
    });
    
    console.log('🎉 PDF upload and AI parsing successful!');
    console.log('Response data:', JSON.stringify(uploadResponse.data, null, 2));
    
    fs.unlinkSync('jane_smith_resume.pdf');
    
  } catch (error) {
    console.error('❌ Test with existing user failed:', error.response?.status, error.response?.data || error.message);
  }
}

testCompleteFlowWithRegistration();