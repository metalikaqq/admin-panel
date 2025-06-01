// Simple test script to check if the API is accessible from the browser
const testAPI = async () => {
  try {
    console.log('Testing API connection...');
    const response = await fetch('http://localhost:3000/product-types');
    console.log('Response status:', response.status);
    console.log('Response headers:', Object.fromEntries(response.headers));
    const data = await response.json();
    console.log('Response data:', data);
  } catch (error) {
    console.error('API Test Error:', error);
  }
};

testAPI();
