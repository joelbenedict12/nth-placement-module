import axios from 'axios';

const API_BASE_URL = 'http://localhost:8083/api';

async function testCompleteFlow() {
  console.log('🧪 Testing complete resume upload flow...\n');
  
  // Step 1: Test health endpoint
  try {
    console.log('1️⃣ Testing health endpoint...');
    const healthResponse = await axios.get(`${API_BASE_URL}/health`);
    console.log('✅ Health check:', healthResponse.data);
  } catch (error) {
    console.log('❌ Health check failed:', error.message);
    return;
  }
  
  // Step 2: Test auth endpoint (will fail but we want to see the error)
  try {
    console.log('\n2️⃣ Testing auth endpoint...');
    const authResponse = await axios.post(`${API_BASE_URL}/auth/login`, {
      email: 'test@example.com',
      password: 'wrongpassword'
    });
    console.log('Auth response:', authResponse.data);
  } catch (error) {
    console.log('❌ Auth failed (expected):', error.response?.status, error.response?.data?.error);
  }
  
  // Step 3: Test resume endpoint without auth (should get 401, not 404)
  try {
    console.log('\n3️⃣ Testing resume endpoint without auth...');
    const resumeResponse = await axios.get(`${API_BASE_URL}/resumes`);
    console.log('Resume response:', resumeResponse.data);
  } catch (error) {
    console.log('❌ Resume endpoint error:', error.response?.status, error.response?.data?.error);
    if (error.response?.status === 404) {
      console.log('🚨 **ISSUE FOUND**: Getting 404 instead of 401 for protected route');
    }
  }
  
  // Step 4: Test upload endpoint without auth (should get 401, not 404)
  try {
    console.log('\n4️⃣ Testing upload endpoint without auth...');
    const formData = new FormData();
    formData.append('resume', 'test content');
    
    const uploadResponse = await axios.post(`${API_BASE_URL}/resumes/upload`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      timeout: 5000
    });
    console.log('Upload response:', uploadResponse.data);
  } catch (error) {
    console.log('❌ Upload endpoint error:', error.response?.status, error.response?.data?.error);
    if (error.response?.status === 404) {
      console.log('🚨 **ISSUE FOUND**: Getting 404 instead of 401 for upload endpoint');
    }
  }
  
  console.log('\n🔍 Testing complete!');
}

testCompleteFlow().catch(console.error);