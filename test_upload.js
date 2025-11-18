import axios from 'axios';
import FormData from 'form-data';
import fs from 'fs';

async function testUpload() {
  try {
    // Read the test resume file
    const fileContent = fs.readFileSync('test_resume.txt');
    
    // Create form data
    const formData = new FormData();
    formData.append('resume', fileContent, {
      filename: 'test_resume.txt',
      contentType: 'text/plain'
    });
    
    // Test the upload endpoint
    console.log('Testing upload endpoint: http://localhost:8083/api/resumes/upload');
    
    const response = await axios.post('http://localhost:8083/api/resumes/upload', formData, {
      headers: {
        ...formData.getHeaders(),
        'Authorization': 'Bearer YOUR_TEST_TOKEN' // This will fail but we want to see the error
      }
    });
    
    console.log('Upload successful:', response.data);
  } catch (error) {
    console.error('Upload failed:', error.response?.status, error.response?.data || error.message);
  }
}

testUpload();