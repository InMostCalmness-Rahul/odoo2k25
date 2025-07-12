const { cloudinary } = require('./config/cloudinary');

// Simple test to verify Cloudinary connection
async function testCloudinaryConnection() {
  try {
    console.log('Testing Cloudinary connection...');
    
    // Test API connection
    const result = await cloudinary.api.ping();
    console.log('✅ Cloudinary connection successful:', result);
    
    // Test configuration
    console.log('📋 Cloudinary configuration:');
    console.log('  Cloud Name:', process.env.CLOUDINARY_CLOUD_NAME);
    console.log('  API Key:', process.env.CLOUDINARY_API_KEY ? 'Set' : 'Not Set');
    console.log('  API Secret:', process.env.CLOUDINARY_API_SECRET ? 'Set' : 'Not Set');
    
    return true;
  } catch (error) {
    console.error('❌ Cloudinary connection failed:', error.message);
    return false;
  }
}

// Run test if this file is executed directly
if (require.main === module) {
  require('dotenv').config();
  testCloudinaryConnection()
    .then((success) => {
      process.exit(success ? 0 : 1);
    })
    .catch((error) => {
      console.error('Test failed:', error);
      process.exit(1);
    });
}

module.exports = { testCloudinaryConnection };
