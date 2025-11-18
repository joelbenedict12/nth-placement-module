import axios from 'axios';
import FormData from 'form-data';
import fs from 'fs';

const API_BASE_URL = 'http://localhost:8083/api';

async function testSimpleLoginAndUpload() {
  console.log('🧪 Testing simple login and PDF upload...\n');
  
  // Try some common test credentials
  const testCredentials = [
    { email: 'student@example.com', password: 'password123' },
    { email: 'test@example.com', password: 'password123' },
    { email: 'admin@example.com', password: 'password123' },
    { email: 'user@example.com', password: 'password123' }
  ];
  
  let authToken = null;
  
  // Try each credential set
  for (const creds of testCredentials) {
    try {
      console.log(`🔑 Trying login with ${creds.email}...`);
      const loginResponse = await axios.post(`${API_BASE_URL}/auth/login`, {
        email: creds.email,
        password: creds.password
      });
      
      console.log('✅ Login successful!');
      authToken = loginResponse.data.token;
      break;
      
    } catch (error) {
      if (error.response?.status === 401) {
        console.log('❌ Invalid credentials, trying next...');
      } else {
        console.log('❌ Other error:', error.response?.status, error.response?.data?.error);
      }
    }
  }
  
  if (!authToken) {
    console.log('\n🚨 No valid credentials found. Let\'s create a test user manually...');
    
    // Try to register with minimal data
    try {
      console.log('📝 Attempting minimal registration...');
      const registerResponse = await axios.post(`${API_BASE_URL}/auth/register`, {
        email: 'teststudent@nthplace.com',
        password: 'testpass123',
        studentId: 'TEST001',
        fullName: 'Test Student',
        university: 'Test University',
        course: 'Computer Science',
        graduationYear: '2024'
      });
      
      console.log('✅ Registration successful!');
      authToken = registerResponse.data.token;
      
    } catch (regError) {
      console.log('❌ Registration failed:', regError.response?.status, regError.response?.data);
      
      // Let's try to understand what's in the database
      console.log('\n🔍 Let\'s check what we can access without auth...');
      
      try {
        const healthResponse = await axios.get(`${API_BASE_URL}/health`);
        console.log('✅ Health endpoint:', healthResponse.data);
      } catch (e) {
        console.log('❌ Health endpoint failed');
      }
      
      return; // Can't proceed without auth
    }
  }
  
  // Now test PDF upload with the token
  console.log('\n📄 Testing PDF upload with valid token...');
  
  try {
    // Create a simple PDF resume
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
/Length 300
>>
stream
BT
/F1 16 Tf
50 750 Td
(JANE SMITH) Tj
ET
BT
/F1 12 Tf
50 730 Td
(Software Engineer) Tj
ET
BT
/F1 10 Tf
50 710 Td
(Email: jane.smith@email.com) Tj
ET
BT
/F1 10 Tf
50 690 Td
(Phone: (555) 987-6543 | Location: New York, NY) Tj
ET
BT
/F1 12 Tf
50 650 Td
(EXPERIENCE) Tj
ET
BT
/F1 10 Tf
50 630 Td
(Senior Software Engineer at TechCorp Inc. (2021-Present)) Tj
ET
BT
/F1 10 Tf
50 610 Td
(Developed React applications serving 50K+ users) Tj
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
0000000613 00000 n 
trailer
<<
/Size 6
/Root 1 0 R
>>
startxref
662
%%EOF`;
    
    fs.writeFileSync('jane_resume.pdf', pdfContent);
    console.log('✅ Created test PDF file');
    
    const formData = new FormData();
    formData.append('resume', fs.readFileSync('jane_resume.pdf'), {
      filename: 'jane_resume.pdf',
      contentType: 'application/pdf'
    });
    
    console.log('📤 Uploading PDF...');
    const uploadResponse = await axios.post(`${API_BASE_URL}/resumes/upload`, formData, {
      headers: {
        ...formData.getHeaders(),
        'Authorization': `Bearer ${authToken}`
      },
      timeout: 60000 // 60 seconds for AI processing
    });
    
    console.log('🎉 PDF upload successful!');
    console.log('Response:', JSON.stringify(uploadResponse.data, null, 2));
    
    // Clean up
    fs.unlinkSync('jane_resume.pdf');
    
  } catch (uploadError) {
    console.error('❌ Upload failed:', uploadError.response?.status, uploadError.response?.data || uploadError.message);
    
    if (uploadError.response?.status === 404) {
      console.log('🚨 **CRITICAL**: Upload endpoint returning 404');
    } else if (uploadError.response?.status === 413) {
      console.log('🚨 **FILE TOO LARGE**: PDF file is too large');
    } else if (uploadError.response?.status === 415) {
      console.log('🚨 **UNSUPPORTED TYPE**: File type not supported');
    }
  }
}

testSimpleLoginAndUpload();