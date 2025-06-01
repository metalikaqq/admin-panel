// Test script to verify frontend API connectivity
const axios = require('axios');

async function testFrontendAPI() {
  console.log('Testing frontend API connectivity...');

  try {
    console.log('1. Testing direct API call to localhost:3000...');
    const response = await axios.get('http://localhost:3000/product-types');
    console.log('✅ Direct API call successful');
    console.log('Response status:', response.status);
    console.log('Response data:', JSON.stringify(response.data, null, 2));

    // Check if the response format matches what our apiService expects
    if (
      response.data &&
      response.data.success &&
      Array.isArray(response.data.data)
    ) {
      console.log('✅ Response format is correct for apiService');
      console.log('Number of product types:', response.data.data.length);
    } else {
      console.log('❌ Response format does not match apiService expectations');
    }
  } catch (error) {
    console.error('❌ API call failed:', error.message);
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
    }
  }
}

testFrontendAPI();
