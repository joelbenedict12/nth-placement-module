import axios from 'axios';
import FormData from 'form-data';
import fs from 'fs';

const API_BASE_URL = 'http://localhost:8083/api';

async function testUploadWithErrorDetails() {
  console.log('🧪 Testing PDF upload with detailed error capture...\n');
  
  try {
    // Login first
    console.log('🔑 Logging in...');
    const loginResponse = await axios.post(`${API_BASE_URL}/auth/login`, {
      email: 'test@example.com',
      password: 'password123'
    });
    
    const authToken = loginResponse.data.token;
    console.log('✅ Login successful');
    
    // Create a simple PDF file
    console.log('\n📄 Creating simple PDF file...');
    const pdfContent = Buffer.from(`%PDF-1.4
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
50 750 Td
(Jane Smith Resume) Tj
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
%%EOF`, 'binary');
    
    fs.writeFileSync('simple_resume.pdf', pdfContent);
    console.log('✅ Created PDF file, size:', fs.statSync('simple_resume.pdf').size, 'bytes');
    
    // Test upload with detailed error capture
    console.log('\n📤 Testing PDF upload...');
    const formData = new FormData();
    formData.append('resume', fs.readFileSync('simple_resume.pdf'), {
      filename: 'simple_resume.pdf',
      contentType: 'application/pdf'
    });
    
    try {
      const uploadResponse = await axios.post(`${API_BASE_URL}/resumes/upload`, formData, {
        headers: {
          ...formData.getHeaders(),
          'Authorization': `Bearer ${authToken}`
        },
        timeout: 30000,
        validateStatus: function (status) {
          return true; // Don't throw on any status, we want to see all responses
        }
      });
      
      console.log('\n📊 Upload Response Details:');
      console.log('Status:', uploadResponse.status);
      console.log('Status Text:', uploadResponse.statusText);
      console.log('Headers:', uploadResponse.headers);
      console.log('Data:', JSON.stringify(uploadResponse.data, null, 2));
      
      if (uploadResponse.status === 200) {
        console.log('\n🎉 SUCCESS! PDF upload completed!');
        
        if (uploadResponse.data.resume?.extracted_data) {
          console.log('\n🤖 AI Extracted Data:');
          const extracted = uploadResponse.data.resume.extracted_data;
          console.log('- Name:', extracted.personal_info?.full_name || 'Not found');
          console.log('- Email:', extracted.personal_info?.email || 'Not found');
          console.log('- Experience:', extracted.experience?.length || 0, 'entries');
        }
      } else {
        console.log('\n❌ Upload failed with status:', uploadResponse.status);
        
        if (uploadResponse.status === 500) {
          console.log('\n🔍 Server Error Details:');
          console.log('Error message:', uploadResponse.data.message || uploadResponse.data.error);
          
          // Check if there's a specific error in the response
          if (uploadResponse.data.message) {
            console.log('This suggests an internal server error occurred.');
            console.log('Possible causes:');
            console.log('- OpenAI API key issues');
            console.log('- PDF parsing library problems');
            console.log('- Database connection issues');
            console.log('- File processing errors');
          }
        }
      }
      
    } catch (networkError) {
      console.error('\n🚨 Network Error:', networkError.message);
      if (networkError.response) {
        console.log('Response status:', networkError.response.status);
        console.log('Response data:', networkError.response.data);
      }
    }
    
    // Clean up
    fs.unlinkSync('simple_resume.pdf');
    
  } catch (error) {
    console.error('❌ Test setup failed:', error.message);
  }
}

testUploadWithErrorDetails();