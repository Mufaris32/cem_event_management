import dns from 'dns';

console.log('🔍 Testing DNS Resolution\n');

const hostname = '_mongodb._tcp.cemcluster.qe0encn.mongodb.net';

dns.resolveSrv(hostname, (err, addresses) => {
  if (err) {
    console.error('❌ DNS Resolution Failed:', err.message);
    console.log('\n💡 This means:');
    console.log('   - The cluster URL is incorrect, OR');
    console.log('   - The cluster is still being created, OR');
    console.log('   - Your DNS server cannot resolve MongoDB Atlas domains');
    console.log('\n🔧 Solutions:');
    console.log('   1. Wait 2-3 minutes if cluster was just created');
    console.log('   2. Verify cluster exists in Atlas dashboard');
    console.log('   3. Try using Google DNS (8.8.8.8)');
    console.log('   4. Check if you can access cloud.mongodb.com in browser');
  } else {
    console.log('✅ DNS Resolution Successful!');
    console.log('Addresses:', addresses);
  }
});
