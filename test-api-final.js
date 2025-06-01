// Test frontend API call simulation
const axios = require('axios');

async function testFrontendAPI() {
  console.log('🧪 Testing Frontend API Call...');

  try {
    // Simulate the exact frontend axios call
    const axiosClient = axios.create({
      baseURL: 'http://localhost:3000',
      timeout: 5000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Test the corrected API call (without sortBy/sortOrder)
    console.log('📡 Testing: GET /products?page=1&limit=10');
    const response = await axiosClient.get('/products?page=1&limit=10');

    console.log('✅ Status:', response.status);
    console.log('✅ Success:', response.data.success);
    console.log('✅ Data structure:', {
      hasData: !!response.data.data,
      dataType: typeof response.data.data,
      hasDataData: !!response.data.data?.data,
      productsCount: response.data.data?.data?.length || 0,
      hasPagination: !!response.data.data?.pagination,
    });

    if (response.data.data?.data?.length > 0) {
      console.log('✅ First product:', {
        id: response.data.data.data[0].id,
        name: response.data.data.data[0].name,
      });
    }
  } catch (error) {
    console.error('❌ Error:', error.message);
    if (error.response) {
      console.error('  Status:', error.response.status);
      console.error('  Data:', error.response.data);
    }
  }
}

testFrontendAPI();
