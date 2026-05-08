const mongoose = require('mongoose');

// Test different connection string formats
const connectionStrings = [
  // Original
  'mongodb+srv://rujalladhe21_db_user:NxTOq3toUmUWbMdR@cluster0.3g5cddv.mongodb.net/?appName=Cluster0',
  
  // With database name
  'mongodb+srv://rujalladhe21_db_user:NxTOq3toUmUWbMdR@cluster0.3g5cddv.mongodb.net/meditrack?retryWrites=true&w=majority',
  
  // Alternative format
  'mongodb+srv://rujalladhe21_db_user:NxTOq3toUmUWbMdR@cluster0.mongodb.net/?retryWrites=true&w=majority',
];

async function testConnection(uri, index) {
  console.log(`\n--- Testing Connection ${index + 1} ---`);
  console.log(`URI: ${uri.substring(0, 30)}...`);
  
  try {
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 5000,
    });
    console.log('✅ SUCCESS! This connection string works!');
    console.log('Use this connection string in your .env.local file');
    await mongoose.connection.close();
    return true;
  } catch (error) {
    console.log('❌ Failed:', error.message);
    if (mongoose.connection.readyState !== 0) {
      await mongoose.connection.close();
    }
    return false;
  }
}

async function testAll() {
  console.log('Testing MongoDB Connection Strings...\n');
  
  for (let i = 0; i < connectionStrings.length; i++) {
    const success = await testConnection(connectionStrings[i], i);
    if (success) {
      console.log('\n🎉 Found working connection!');
      process.exit(0);
    }
  }
  
  console.log('\n❌ None of the connection strings worked.');
  console.log('\n📋 Next Steps:');
  console.log('1. Go to MongoDB Atlas: https://cloud.mongodb.com/');
  console.log('2. Click on your cluster');
  console.log('3. Click "Connect"');
  console.log('4. Choose "Connect your application"');
  console.log('5. Copy the connection string');
  console.log('6. Replace the connection string in .env.local');
  process.exit(1);
}

testAll();
