import axios from 'axios';
import FormData from 'form-data';
import fs from 'fs';

const API_BASE_URL = 'http://localhost:8083/api';

async function testUploadWithoutAI() {
  console.log('🧪 Testing PDF upload without AI parsing...\n');
  
  try {
    // Login first
    console.log('🔑 Logging in...');
    const loginResponse = await axios.post(`${API_BASE_URL}/auth/login`, {
      email: 'test@example.com',
      password: 'password123'
    });
    
    const authToken = loginResponse.data.token;
    console.log('✅ Login successful');
    
    // Create a simple PDF file (minimal PDF)
    console.log('\n📄 Creating minimal PDF file...');
    const minimalPdf = `%PDF-1.4
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
(Test Resume Content) Tj
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
    
    fs.writeFileSync('minimal_resume.pdf', minimalPdf);
    console.log('✅ Created minimal PDF file');
    
    // Test upload
    console.log('\n📤 Testing upload...');
    const formData = new FormData();
    formData.append('resume', fs.readFileSync('minimal_resume.pdf'), {
      filename: 'minimal_resume.pdf',
      contentType: 'application/pdf'
    });
    
    const uploadResponse = await axios.post(`${API_BASE_URL}/resumes/upload`, formData, {
      headers: {
        ...formData.getHeaders(),
        'Authorization': `Bearer ${authToken}`
      },
      timeout: 30000
    });
    
    console.log('🎉 Upload successful!');
    console.log('Response:', JSON.stringify(uploadResponse.data, null, 2));
    
    fs.unlinkSync('minimal_resume.pdf');
    
  } catch (error) {
    console.error('❌ Upload failed:', error.response?.status, error.response?.data || error.message);
    
    // Let's try to get more details about the error
    if (error.response?.status === 500) {
      console.log('\n🔍 Checking server logs...');
      
      // Try a simple text file upload to isolate PDF parsing issues
      console.log('\n📝 Trying text file upload instead...');
      try {
        const textFormData = new FormData();
        textFormData.append('resume', 'This is a test resume content', {
          filename: 'test_resume.txt',
          contentType: 'text/plain'
        });
        
        const textResponse = await axios.post(`${API_BASE_URL}/resumes/upload`, textFormData, {
          headers: {
            ...textFormData.getHeaders(),
            'Authorization': `Bearer ${authToken}`
          },
          timeout: 30000
        });
        
        console.log('✅ Text file upload successful!');
        console.log('Response:', JSON.stringify(textResponse.data, null, 2));
        
      } catch (textError) {
        console.error('❌ Text file upload also failed:', textError.response?.status, textError.response?.data || textError.message);
      }
    }
  }
}

testUploadWithoutAI();