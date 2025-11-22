import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const testConnection = async () => {
  console.log('🔍 Testing MongoDB Atlas Connection\n');
  console.log('Connection String:', process.env.MONGODB_URI?.replace(/:[^:@]+@/, ':****@'));
  console.log('');

  try {
    console.log('⏳ Attempting to connect...\n');
    
    await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 10000,
    });
    
    console.log('✅ Successfully connected to MongoDB Atlas!');
    console.log('📊 Database:', mongoose.connection.name);
    console.log('🌐 Host:', mongoose.connection.host);
    console.log('');
    
    // List collections
    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log('📚 Collections:', collections.map(c => c.name).join(', '));
    
    await mongoose.disconnect();
    console.log('\n✅ Test completed successfully!');
    
  } catch (error) {
    console.error('❌ Connection Failed!\n');
    console.error('Error:', error.message);
    console.log('\n💡 Troubleshooting Tips:');
    
    if (error.message.includes('ENOTFOUND') || error.message.includes('querySrv')) {
      console.log('   ❌ DNS Resolution Failed');
      console.log('   → Check your cluster URL is correct');
      console.log('   → Verify the cluster exists in Atlas dashboard');
      console.log('   → Try using Standard connection string instead of SRV');
    }
    
    if (error.message.includes('Authentication failed')) {
      console.log('   ❌ Authentication Failed');
      console.log('   → Check your username and password');
      console.log('   → Verify user has read/write permissions');
    }
    
    if (error.message.includes('timeout')) {
      console.log('   ❌ Connection Timeout');
      console.log('   → Check Network Access in Atlas (IP whitelist)');
      console.log('   → Add 0.0.0.0/0 to allow all IPs');
      console.log('   → Check your firewall/antivirus');
    }
    
    console.log('\n🔧 Steps to Fix:');
    console.log('   1. Go to https://cloud.mongodb.com');
    console.log('   2. Click "Database" → Find your cluster');
    console.log('   3. Click "Connect" → "Connect your application"');
    console.log('   4. Copy the EXACT connection string');
    console.log('   5. Update your .env file');
  }
  
  process.exit(0);
};

testConnection();
