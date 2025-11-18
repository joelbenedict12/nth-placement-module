import axios from 'axios';
import FormData from 'form-data';
import fs from 'fs';

const API_BASE_URL = 'http://localhost:8083/api';

async function testAuthenticatedUpload() {
  console.log('🧪 Testing authenticated PDF upload flow...\n');
  
  try {
    // Step 1: Login to get auth token
    console.log('1️⃣ Attempting to login...');
    const loginResponse = await axios.post(`${API_BASE_URL}/auth/login`, {
      email: 'student@example.com',
      password: 'password123'
    });
    
    const token = loginResponse.data.token;
    console.log('✅ Login successful, got token:', token.substring(0, 20) + '...');
    
    // Step 2: Test getting resumes with auth
    console.log('\n2️⃣ Testing resume endpoint with auth...');
    const resumesResponse = await axios.get(`${API_BASE_URL}/resumes`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    console.log('✅ Resume endpoint working, found', resumesResponse.data.length, 'resumes');
    
    // Step 3: Create a test PDF file (simulate PDF content)
    console.log('\n3️⃣ Creating test PDF file...');
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
>>
endobj
4 0 obj
<<
/Length 44
>>
stream
BT
/F1 12 Tf
100 700 Td
(John Doe\nSoftware Engineer\njohn.doe@email.com) Tj
ET
endstream
endobj
xref
0 5
0000000000 65535 f 
0000000009 00000 n 
0000000058 00000 n 
0000000115 00000 n 
0000000203 00000 n 
trailer
<<
/Size 5
/Root 1 0 R
>>
startxref
297
%%EOF`;
    
    fs.writeFileSync('test_resume.pdf', pdfContent);
    console.log('✅ Test PDF file created');
    
    // Step 4: Test PDF upload
    console.log('\n4️⃣ Testing PDF upload...');
    const formData = new FormData();
    formData.append('resume', fs.readFileSync('test_resume.pdf'), {
      filename: 'test_resume.pdf',
      contentType: 'application/pdf'
    });
    
    const uploadResponse = await axios.post(`${API_BASE_URL}/resumes/upload`, formData, {
      headers: {
        ...formData.getHeaders(),
        'Authorization': `Bearer ${token}`
      },
      timeout: 30000
    });
    
    console.log('✅ PDF upload successful!');
    console.log('Response:', uploadResponse.data);
    
    // Clean up test file
    fs.unlinkSync('test_resume.pdf');
    
  } catch (error) {
    console.error('❌ Test failed:', error.response?.status, error.response?.data || error.message);
    
    if (error.response?.status === 404) {
      console.log('🚨 **CRITICAL**: Upload endpoint returning 404 - route not found');
    } else if (error.response?.status === 401) {
      console.log('🚨 **AUTH ISSUE**: Token invalid or expired');
    } else if (error.response?.status === 500) {
      console.log('🚨 **SERVER ERROR**: Internal server error during upload');
    }
  }
}

testAuthenticatedUpload();