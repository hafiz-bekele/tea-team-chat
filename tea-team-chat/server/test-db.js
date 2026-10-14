require('dotenv').config();
const mongoose = require('mongoose');

const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/tea-team-chat';
const isAtlas = uri.includes('mongodb.net') || uri.startsWith('mongodb+srv://');

// Hide password in logged URI for security
const maskedUri = uri.replace(/:([^@/]+)@/, ':****@');

console.log('--------------------------------------------------');
console.log('🔍 Testing MongoDB Connection...');
console.log(`📦 Database Type: ${isAtlas ? 'MongoDB Atlas (Cloud)' : 'Local MongoDB'}`);
console.log(`🔗 Target URI:    ${maskedUri}`);
console.log('--------------------------------------------------');

mongoose.connect(uri, {
  serverSelectionTimeoutMS: 8000
})
.then(async () => {
  console.log('✅ Connection Successful!');
  console.log(`📊 Connected to Database: "${mongoose.connection.name}"`);
  console.log(`🚀 Host: ${mongoose.connection.host}`);
  console.log('--------------------------------------------------');
  console.log('🎉 Your database configuration is ready to go!');
  await mongoose.disconnect();
  process.exit(0);
})
.catch((err) => {
  console.error('\n❌ Connection Failed!');
  console.error(`Error Name:    ${err.name}`);
  console.error(`Error Message: ${err.message}\n`);

  if (isAtlas) {
    console.log('📋 Common MongoDB Atlas issues & how to fix them:');
    console.log('1. IP Whitelist:');
    console.log('   - Go to MongoDB Atlas -> Network Access.');
    console.log('   - Make sure your IP is added, or add 0.0.0.0/0 (allow access from anywhere).');
    console.log('2. Credentials:');
    console.log('   - Check your database username and password in server/.env.');
    console.log('   - Database users are managed in Atlas -> Database Access (NOT your Atlas login email).');
    console.log('3. Password with Special Characters:');
    console.log('   - If your password has characters like @, #, $, %, &, :, encode them:');
    console.log('     e.g., @ becomes %40, # becomes %23');
    console.log('4. Database Name:');
    console.log('   - Ensure your URI has a database name before the "?", e.g.:');
    console.log('     ...mongodb.net/tea-team-chat?retryWrites=true&w=majority\n');
  } else {
    console.log('📋 Local MongoDB troubleshooting:');
    console.log('   - Ensure MongoDB service is running on your machine (mongodb://localhost:27017).\n');
  }

  process.exit(1);
});
