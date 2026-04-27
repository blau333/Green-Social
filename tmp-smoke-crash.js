const http = require('http');
const BASE = 'http://localhost:3000';
function req(method, path, body, token) {
  return new Promise((resolve, reject) => {
    const u = new URL(path, BASE);
    const headers = { 'Content-Type': 'application/json' };
    if (token) headers.Authorization = `Bearer ${token}`;
    const r = http.request({ hostname: u.hostname, port: u.port, path: u.pathname + u.search, method, headers }, (res) => {
      let data = '';
      res.on('data', c => data += c);
      res.on('end', () => {
        let parsed = data;
        try { parsed = JSON.parse(data || '{}'); } catch {}
        resolve({ status: res.statusCode, body: parsed });
      });
    });
    r.on('error', reject);
    if (body) r.write(JSON.stringify(body));
    r.end();
  });
}
(async () => {
  const u1 = { username: 'crashA_' + Date.now(), password: 'TestPassword123!' };
  const u2 = { username: 'crashB_' + Date.now(), password: 'TestPassword123!' };
  const r1 = await req('POST', '/api/register', u1);
  const r2 = await req('POST', '/api/register', u2);
  const t1 = r1.body.token;
  const t2 = r2.body.token;
  const p = await req('POST', '/api/posts', { content: 'x' }, t1);
  console.log('post', p.status, p.body && p.body.id);
  const feed = await req('GET', '/api/posts', null, t1);
  console.log('feed', feed.status);
  const react = await req('POST', `/api/posts/${p.body.id}/reaction`, { type: 'like' }, t2);
  console.log('react', react.status);
  process.exit(0);
})().catch((e) => { console.error('SMOKE_ERR', e.message); process.exit(1); });
