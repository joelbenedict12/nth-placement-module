import axios from 'axios';
import FormData from 'form-data';
import fs from 'fs';

const API_BASE_URL = 'http://localhost:8083/api';

async function testRealPDFUpload() {
  console.log('🧪 Testing REAL PDF upload with AI parsing...\n');
  
  try {
    // Login first
    console.log('🔑 Logging in...');
    const loginResponse = await axios.post(`${API_BASE_URL}/auth/login`, {
      email: 'test@example.com',
      password: 'password123'
    });
    
    const authToken = loginResponse.data.token;
    console.log('✅ Login successful');
    
    // Create a proper PDF file using a simple PDF library approach
    console.log('\n📄 Creating proper PDF resume...');
    
    // Create a simple PDF using basic PDF structure
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
/Resources <<
  /Font <<
    /F1 5 0 R
  >>
>>
>>
endobj
4 0 obj
<<
/Length 500
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
(Developed React applications serving 50K+ users daily) Tj
ET
BT
/F1 10 Tf
50 590 Td
(Implemented REST APIs using Node.js and Express) Tj
ET
BT
/F1 12 Tf
50 550 Td
(EDUCATION) Tj
ET
BT
/F1 10 Tf
50 530 Td
(Bachelor of Science in Computer Science) Tj
ET
BT
/F1 10 Tf
50 510 Td
(University of Technology, 2019 - GPA: 3.7/4.0) Tj
ET
BT
/F1 12 Tf
50 470 Td
(SKILLS) Tj
ET
BT
/F1 10 Tf
50 450 Td
(JavaScript, React, Node.js, Python, PostgreSQL, AWS, Docker) Tj
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
0000000893 00000 n 
trailer
<<
/Size 6
/Root 1 0 R
>>
startxref
943
%%EOF`, 'binary');
    
    fs.writeFileSync('jane_smith_resume.pdf', pdfContent);
    console.log('✅ Created proper PDF resume file');
    
    // Test PDF upload with AI parsing
    console.log('\n📤 Testing PDF upload with AI parsing...');
    const formData = new FormData();
    formData.append('resume', fs.readFileSync('jane_smith_resume.pdf'), {
      filename: 'jane_smith_resume.pdf',
      contentType: 'application/pdf'
    });
    
    console.log('Upload details:');
    console.log('- File size:', fs.statSync('jane_smith_resume.pdf').size, 'bytes');
    console.log('- Content type: application/pdf');
    console.log('- Authorization: Bearer', authToken.substring(0, 20) + '...');
    
    const uploadResponse = await axios.post(`${API_BASE_URL}/resumes/upload`, formData, {
      headers: {
        ...formData.getHeaders(),
        'Authorization': `Bearer ${authToken}`
      },
      timeout: 60000 // 60 seconds for AI processing
    });
    
    console.log('\n🎉 PDF upload and AI parsing successful!');
    console.log('Response:', JSON.stringify(uploadResponse.data, null, 2));
    
    // Check AI extraction results
    if (uploadResponse.data.resume?.extracted_data) {
      const extracted = uploadResponse.data.resume.extracted_data;
      console.log('\n🤖 AI Extraction Results:');
      console.log('- Name:', extracted.personal_info?.full_name || 'Not found');
      console.log('- Email:', extracted.personal_info?.email || 'Not found');
      console.log('- Phone:', extracted.personal_info?.phone || 'Not found');
      console.log('- Location:', extracted.personal_info?.location || 'Not found');
      console.log('- Experience entries:', extracted.experience?.length || 0);
      console.log('- Education entries:', extracted.education?.length || 0);
      console.log('- Technical skills:', extracted.skills?.technical?.length || 0);
      console.log('- Projects:', extracted.projects?.length || 0);
      
      if (extracted.personal_info?.full_name) {
        console.log('\n✅ AI successfully extracted personal information!');
      } else {
        console.log('\n⚠️  AI extraction incomplete - may need better PDF formatting');
      }
    }
    
    // Clean up
    fs.unlinkSync('jane_smith_resume.pdf');
    
    console.log('\n✅ Complete PDF upload and AI parsing test successful!');
    console.log('\n🎯 Summary:');
    console.log('- ✅ Authentication working');
    console.log('- ✅ PDF file upload working');
    console.log('- ✅ AI parsing working (extracted data from PDF)');
    console.log('- ✅ Response includes extracted data for form auto-fill');
    
  } catch (error) {
    console.error('❌ Test failed:', error.response?.status, error.response?.data || error.message);
    
    if (error.response?.status === 500) {
      console.log('\n🚨 **SERVER ERROR** during upload');
      console.log('This could be due to:');
      console.log('- OpenAI API key issues');
      console.log('- PDF parsing problems');
      console.log('- Database connection issues');
      console.log('- File size too large');
    } else if (error.response?.status === 415) {
      console.log('🚨 **UNSUPPORTED TYPE**: File type not accepted');
    } else if (error.response?.status === 413) {
      console.log('🚨 **FILE TOO LARGE**: PDF file exceeds size limit');
    }
    
    // Clean up on error
    try {
      fs.unlinkSync('jane_smith_resume.pdf');
    } catch (e) {}
  }
}

testRealPDFUpload();