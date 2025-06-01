// Debug script to test frontend API calls
const axios = require('axios');

async function testFrontendAPI() {
  try {
    console.log('Testing API call from frontend perspective...');

    // Test the exact call the frontend makes
    const response = await axios.get(
      'http://localhost:3000/products?page=1&limit=10',
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    console.log('✅ API Response Status:', response.status);
    console.log('✅ API Response Success:', response.data.success);
    console.log('✅ API Response Structure:');
    console.log('  - data exists:', !!response.data.data);
    console.log(
      '  - data.data is array:',
      Array.isArray(response.data.data?.data)
    );
    console.log('  - products count:', response.data.data?.data?.length || 0);
    console.log('  - pagination exists:', !!response.data.data?.pagination);
    console.log(
      '  - total products:',
      response.data.data?.pagination?.total || 0
    );

    // Show first product structure
    if (response.data.data?.data?.length > 0) {
      console.log('✅ First product structure:');
      const firstProduct = response.data.data.data[0];
      console.log('  - id:', firstProduct.id);
      console.log('  - name:', firstProduct.name);
      console.log('  - images count:', firstProduct.images?.length || 0);
      console.log('  - productType:', firstProduct.productType?.name);
    }
  } catch (error) {
    console.error('❌ API Error:', error.message);
    if (error.response) {
      console.error('  Response Status:', error.response.status);
      console.error('  Response Data:', error.response.data);
    }
  }
}

testFrontendAPI();
