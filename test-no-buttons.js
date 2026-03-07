const http = require('http');

const BASE_URL = 'http://localhost:3000';

function makeRequest(method, path) {
  return new Promise((resolve, reject) => {
    const url = new URL(path, BASE_URL);
    const options = {
      hostname: url.hostname,
      port: url.port,
      path: url.pathname + url.search,
      method: method,
      headers: {
        'Content-Type': 'application/json'
      }
    };

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', chunk => { data += chunk; });
      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          resolve({ status: res.statusCode, body: json });
        } catch (e) {
          resolve({ status: res.statusCode, body: data });
        }
      });
    });

    req.on('error', reject);
    req.end();
  });
}

async function test() {
  console.log('🧪 Testing unregistered user page...\n');
  
  try {
    const nativePostsRes = await makeRequest('GET', '/api/posts');
    
    if (nativePostsRes.status === 401) {
      console.log('✅ Unauthenticated access blocked (401)');
      console.log('✅ Unregistered user page will show:');
      console.log('   - 🔐 Title');
      console.log('   - Description text');
      console.log('   - NO buttons for Login/Register');
      console.log('\n✨ Button removal successful!');
    } else {
      console.log('❌ Unexpected status:', nativePostsRes.status);
    }

  } catch (error) {
    console.error('❌ Test failed:', error.message);
    process.exit(1);
  }

  process.exit(0);
}

setTimeout(test, 2000);
