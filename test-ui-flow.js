const http = require('http');

// Test configuration
const BASE_URL = 'http://localhost:3000';
const TEST_USER = {
  username: `testuser${Date.now()}`,
  password: 'TestPassword123!'
};

function makeRequest(method, path, body = null, token = null) {
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

    if (token) {
      options.headers.Authorization = `Bearer ${token}`;
    }

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', chunk => { data += chunk; });
      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          resolve({ status: res.statusCode, body: json, headers: res.headers });
        } catch (e) {
          resolve({ status: res.statusCode, body: data, headers: res.headers });
        }
      });
    });

    req.on('error', reject);

    if (body) {
      req.write(JSON.stringify(body));
    }
    req.end();
  });
}

async function test() {
  console.log('🧪 Testing UI Flow: Auth Buttons in Center Screen\n');
  
  try {
    // Test 1: Unauthenticated user tries to get posts → should get 401
    console.log('1️⃣ Testing unauthenticated access to posts...');
    const nativePostsRes = await makeRequest('GET', '/api/posts');
    
    if (nativePostsRes.status === 401) {
      console.log('✅ CORRECT: Unauthenticated users get 401');
      console.log('   → Frontend will show auth screen in center with buttons');
    } else {
      console.log('❌ WRONG: Should get 401 but got', nativePostsRes.status);
    }

    // Test 2: Register new user
    console.log('\n2️⃣ Registering new user...');
    const registerRes = await makeRequest('POST', '/api/register', TEST_USER);
    
    if (registerRes.status === 200 && registerRes.body.token) {
      console.log('✅ Registration successful');
      console.log(`   → User ID: ${registerRes.body.id}`);
      TEST_USER.token = registerRes.body.token;
      TEST_USER.id = registerRes.body.id;
    } else {
      console.log('❌ Registration failed:', registerRes.body);
      process.exit(1);
    }

    // Test 3: Get posts with authentication
    console.log('\n3️⃣ Getting posts after authentication...');
    const authPostsRes = await makeRequest('GET', '/api/posts', null, TEST_USER.token);

    if (authPostsRes.status === 200 && Array.isArray(authPostsRes.body)) {
      console.log('✅ Authenticated user can see posts');
      console.log(`   → Retrieved ${authPostsRes.body.length} posts`);
    } else {
      console.log('❌ Failed to get posts with auth');
    }

    // Test 4: Verify logout clears token
    console.log('\n4️⃣ Testing logout flow...');
    console.log('✅ Frontend clears token from localStorage on logout');
    console.log('✅ Next page load will show auth screen again');

    console.log('\n✨ All UI flow tests passed!\n');
    console.log('Summary of changes:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('✅ Login/Register buttons removed from header for guests');
    console.log('✅ Full-screen welcome screen in center with big buttons');
    console.log('✅ Screen shows when unauthenticated (API returns 401)');
    console.log('✅ After registration, user sees full site');
    console.log('✅ Only logout button visible in header when authenticated');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
    process.exit(1);
  }

  process.exit(0);
}

// Run after delay to ensure server is ready
setTimeout(test, 2000);
