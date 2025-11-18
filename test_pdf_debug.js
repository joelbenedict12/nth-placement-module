import axios from 'axios';
import FormData from 'form-data';
import fs from 'fs';

const API_BASE_URL = 'http://localhost:8083/api';

async function testPDFParsingDebug() {
  console.log('🔍 Debugging PDF parsing and AI extraction...\n');
  
  try {
    // Login first
    console.log('🔑 Logging in...');
    const loginResponse = await axios.post(`${API_BASE_URL}/auth/login`, {
      email: 'test@example.com',
      password: 'password123'
    });
    
    const authToken = loginResponse.data.token;
    console.log('✅ Login successful');
    
    // Create a PDF with more readable content
    console.log('\n📄 Creating PDF with clear resume content...');
    
    // Create a PDF that should be easily parseable
    const resumeText = `JANE SMITH
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
Tools: Git, JIRA, VS Code, Postman

PROJECTS

E-commerce Platform (React, Node.js, PostgreSQL)
- Developed a full-stack e-commerce solution with payment integration
- Implemented real-time inventory management system
- Technologies: React, Node.js, Stripe API, PostgreSQL

Task Management App (React Native, Firebase)
- Created cross-platform mobile app for team collaboration
- Integrated real-time notifications and file sharing
- Technologies: React Native, Firebase, Redux

ACHIEVEMENTS

- Winner of Company Hackathon 2022
- Published article on "Best Practices for React Performance"
- Speaker at local JavaScript meetup on "Modern Web Development"`;
    
    // Create a simple PDF structure with the text content
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
/Length ${resumeText.length + 100}
>>
stream
BT
/F1 10 Tf
50 750 Td
(${resumeText.replace(/\n/g, ') Tj\nT*\n50 730 Td\n(')}) Tj
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
0000000${900 + resumeText.length} 00000 n 
trailer
<<
/Size 6
/Root 1 0 R
>>
startxref
${950 + resumeText.length}
%%EOF`, 'binary');
    
    fs.writeFileSync('detailed_resume.pdf', pdfContent);
    console.log('✅ Created detailed PDF resume, size:', fs.statSync('detailed_resume.pdf').size, 'bytes');
    
    // Test upload
    console.log('\n📤 Testing PDF upload with detailed content...');
    const formData = new FormData();
    formData.append('resume', fs.readFileSync('detailed_resume.pdf'), {
      filename: 'detailed_resume.pdf',
      contentType: 'application/pdf'
    });
    
    const uploadResponse = await axios.post(`${API_BASE_URL}/resumes/upload`, formData, {
      headers: {
        ...formData.getHeaders(),
        'Authorization': `Bearer ${authToken}`
      },
      timeout: 60000
    });
    
    console.log('\n📊 Upload Response:');
    console.log('Status:', uploadResponse.status);
    console.log('Message:', uploadResponse.data.message);
    console.log('Resume ID:', uploadResponse.data.resume.id);
    console.log('Extracted Data:', JSON.stringify(uploadResponse.data.resume.extracted_data, null, 2));
    
    // Check what was extracted
    const extracted = uploadResponse.data.resume.extracted_data;
    if (Object.keys(extracted).length === 0) {
      console.log('\n⚠️  No data was extracted from the PDF');
      console.log('This could mean:');
      console.log('- PDF parsing failed to extract readable text');
      console.log('- AI extraction returned empty results');
      console.log('- The PDF format is not compatible with the parser');
    } else {
      console.log('\n✅ Data was extracted from the PDF!');
      if (extracted.personal_info) {
        console.log('Personal Info:', extracted.personal_info);
      }
      if (extracted.experience) {
        console.log('Experience entries:', extracted.experience.length);
      }
      if (extracted.skills) {
        console.log('Skills found:', extracted.skills.technical?.length || 0, 'technical skills');
      }
    }
    
    // Clean up
    fs.unlinkSync('detailed_resume.pdf');
    
  } catch (error) {
    console.error('❌ Test failed:', error.response?.status, error.response?.data || error.message);
    
    // Clean up on error
    try {
      fs.unlinkSync('detailed_resume.pdf');
    } catch (e) {}
  }
}

testPDFParsingDebug();