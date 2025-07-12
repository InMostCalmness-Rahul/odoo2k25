const mongoose = require('mongoose');
const User = require('./models/User');
require('dotenv').config();

const promoteUserToAdmin = async (email) => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/skillswap');
    console.log('✅ Connected to MongoDB');

    // Find and update the user
    const user = await User.findOneAndUpdate(
      { email: email },
      { role: 'admin' },
      { new: true }
    );

    if (user) {
      console.log(`✅ User ${email} has been promoted to admin`);
      console.log(`User details:`, {
        name: user.name,
        email: user.email,
        role: user.role
      });
    } else {
      console.log(`❌ User with email ${email} not found`);
    }

  } catch (error) {
    console.error('Error promoting user:', error);
  } finally {
    // Disconnect from MongoDB
    await mongoose.disconnect();
    console.log('✅ Disconnected from MongoDB');
  }
};

// Get email from command line argument
const email = process.argv[2];
if (!email) {
  console.log('Usage: node promote-admin.js <email>');
  console.log('Example: node promote-admin.js oaak78692@gmail.com');
  process.exit(1);
}

promoteUserToAdmin(email);
