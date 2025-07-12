const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
const SwapRequest = require('./models/SwapRequest');
const logger = require('./utils/logger');
require('dotenv').config();

// Sample skills for seeding
const sampleSkills = [
  'JavaScript', 'Python', 'React', 'Node.js', 'MongoDB', 'SQL',
  'Guitar', 'Piano', 'Violin', 'Drums', 'Singing',
  'Photography', 'Video Editing', 'Graphic Design', 'UI/UX Design',
  'Spanish', 'French', 'German', 'Mandarin', 'Japanese',
  'Cooking', 'Baking', 'Gardening', 'Yoga', 'Meditation',
  'Marketing', 'Writing', 'Public Speaking', 'Data Analysis',
  'Chess', 'Tennis', 'Swimming', 'Basketball', 'Running'
];

const locations = [
  'New York, NY', 'Los Angeles, CA', 'Chicago, IL', 'Houston, TX',
  'Phoenix, AZ', 'Philadelphia, PA', 'San Antonio, TX', 'San Diego, CA',
  'Dallas, TX', 'San Jose, CA', 'Austin, TX', 'Jacksonville, FL',
  'London, UK', 'Paris, France', 'Berlin, Germany', 'Tokyo, Japan',
  'Sydney, Australia', 'Toronto, Canada', 'Mumbai, India', 'São Paulo, Brazil'
];

const availabilityOptions = ['weekdays', 'weekends', 'evenings', 'mornings', 'afternoons', 'flexible'];

// Helper function to get random items from array
const getRandomItems = (array, min = 1, max = 5) => {
  const count = Math.floor(Math.random() * (max - min + 1)) + min;
  const shuffled = [...array].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
};

// Helper function to get random item from array
const getRandomItem = (array) => {
  return array[Math.floor(Math.random() * array.length)];
};

// Sample user data
const createSampleUsers = () => {
  const users = [
    // Admin user
    {
      name: 'Admin User',
      email: 'admin@skillswap.com',
      password: 'admin123',
      role: 'admin',
      location: 'San Francisco, CA',
      skillsOffered: ['System Administration', 'Project Management'],
      skillsWanted: ['Leadership', 'Strategic Planning'],
      availability: ['weekdays', 'flexible'],
      isPublic: true
    },
    // Regular users
    {
      name: 'John Smith',
      email: 'john.smith@email.com',
      password: 'password123',
      location: getRandomItem(locations),
      skillsOffered: getRandomItems(sampleSkills, 2, 4),
      skillsWanted: getRandomItems(sampleSkills, 1, 3),
      availability: getRandomItems(availabilityOptions, 1, 3),
      isPublic: true
    },
    {
      name: 'Sarah Johnson',
      email: 'sarah.johnson@email.com',
      password: 'password123',
      location: getRandomItem(locations),
      skillsOffered: getRandomItems(sampleSkills, 2, 4),
      skillsWanted: getRandomItems(sampleSkills, 1, 3),
      availability: getRandomItems(availabilityOptions, 1, 3),
      isPublic: true
    },
    {
      name: 'Mike Wilson',
      email: 'mike.wilson@email.com',
      password: 'password123',
      location: getRandomItem(locations),
      skillsOffered: getRandomItems(sampleSkills, 2, 4),
      skillsWanted: getRandomItems(sampleSkills, 1, 3),
      availability: getRandomItems(availabilityOptions, 1, 3),
      isPublic: true
    },
    {
      name: 'Emily Davis',
      email: 'emily.davis@email.com',
      password: 'password123',
      location: getRandomItem(locations),
      skillsOffered: getRandomItems(sampleSkills, 2, 4),
      skillsWanted: getRandomItems(sampleSkills, 1, 3),
      availability: getRandomItems(availabilityOptions, 1, 3),
      isPublic: true
    },
    {
      name: 'Alex Rodriguez',
      email: 'alex.rodriguez@email.com',
      password: 'password123',
      location: getRandomItem(locations),
      skillsOffered: getRandomItems(sampleSkills, 2, 4),
      skillsWanted: getRandomItems(sampleSkills, 1, 3),
      availability: getRandomItems(availabilityOptions, 1, 3),
      isPublic: true
    },
    {
      name: 'Jessica Chen',
      email: 'jessica.chen@email.com',
      password: 'password123',
      location: getRandomItem(locations),
      skillsOffered: getRandomItems(sampleSkills, 2, 4),
      skillsWanted: getRandomItems(sampleSkills, 1, 3),
      availability: getRandomItems(availabilityOptions, 1, 3),
      isPublic: true
    },
    {
      name: 'David Brown',
      email: 'david.brown@email.com',
      password: 'password123',
      location: getRandomItem(locations),
      skillsOffered: getRandomItems(sampleSkills, 2, 4),
      skillsWanted: getRandomItems(sampleSkills, 1, 3),
      availability: getRandomItems(availabilityOptions, 1, 3),
      isPublic: true
    },
    {
      name: 'Lisa Thompson',
      email: 'lisa.thompson@email.com',
      password: 'password123',
      location: getRandomItem(locations),
      skillsOffered: getRandomItems(sampleSkills, 2, 4),
      skillsWanted: getRandomItems(sampleSkills, 1, 3),
      availability: getRandomItems(availabilityOptions, 1, 3),
      isPublic: true
    },
    {
      name: 'Ryan Anderson',
      email: 'ryan.anderson@email.com',
      password: 'password123',
      location: getRandomItem(locations),
      skillsOffered: getRandomItems(sampleSkills, 2, 4),
      skillsWanted: getRandomItems(sampleSkills, 1, 3),
      availability: getRandomItems(availabilityOptions, 1, 3),
      isPublic: true
    },
    {
      name: 'Maria Garcia',
      email: 'maria.garcia@email.com',
      password: 'password123',
      location: getRandomItem(locations),
      skillsOffered: getRandomItems(sampleSkills, 2, 4),
      skillsWanted: getRandomItems(sampleSkills, 1, 3),
      availability: getRandomItems(availabilityOptions, 1, 3),
      isPublic: true
    }
  ];

  return users;
};

// Function to create sample swap requests
const createSampleSwapRequests = (users) => {
  const requests = [];
  const statuses = ['pending', 'accepted', 'rejected', 'completed'];
  
  // Create some sample requests between users
  for (let i = 1; i < users.length - 1; i++) {
    const fromUser = users[i];
    const toUser = users[i + 1];
    
    // Find common skills
    const offeredSkill = fromUser.skillsOffered[0];
    const requestedSkill = toUser.skillsOffered[0];
    
    if (offeredSkill && requestedSkill) {
      requests.push({
        fromUser: fromUser._id,
        toUser: toUser._id,
        offeredSkill,
        requestedSkill,
        message: `Hi! I'd love to learn ${requestedSkill} in exchange for ${offeredSkill}. Let me know if you're interested!`,
        status: getRandomItem(statuses),
        meetingType: getRandomItem(['online', 'in-person', 'hybrid'])
      });
    }
  }
  
  return requests;
};

// Main seeding function
const seedDatabase = async () => {
  try {
    console.log('🌱 Starting database seeding...');

    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Clear existing data
    console.log('🧹 Clearing existing data...');
    await User.deleteMany({});
    await SwapRequest.deleteMany({});
    console.log('✅ Existing data cleared');

    // Create sample users
    console.log('👥 Creating sample users...');
    const usersData = createSampleUsers();
    const createdUsers = await User.insertMany(usersData);
    console.log(`✅ Created ${createdUsers.length} users`);

    // Create sample swap requests
    console.log('🔄 Creating sample swap requests...');
    const requestsData = createSampleSwapRequests(createdUsers);
    if (requestsData.length > 0) {
      await SwapRequest.insertMany(requestsData);
      console.log(`✅ Created ${requestsData.length} swap requests`);
    }

    // Create some feedback
    console.log('⭐ Adding sample feedback...');
    for (let i = 1; i < Math.min(6, createdUsers.length); i++) {
      const user = await User.findById(createdUsers[i]._id);
      user.feedbacks.push({
        from: createdUsers[0]._id,
        rating: Math.floor(Math.random() * 5) + 1,
        comment: 'Great learning experience! Highly recommended.'
      });
      user.updateRating();
      await user.save();
    }
    console.log('✅ Added sample feedback');

    console.log('\n🎉 Database seeding completed successfully!');
    console.log('\n📋 Sample accounts created:');
    console.log('Admin: admin@skillswap.com / admin123');
    console.log('Users: john.smith@email.com / password123 (and others)');
    console.log('\n🚀 You can now start the server and test the API endpoints!');

  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
    console.log('✅ Disconnected from MongoDB');
    process.exit(0);
  }
};

// Run the seeding if this file is executed directly
if (require.main === module) {
  seedDatabase();
}

module.exports = { seedDatabase };
