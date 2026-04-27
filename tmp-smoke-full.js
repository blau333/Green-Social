require('./server.js');
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
function ok(cond, msg) { if (!cond) throw new Error(msg); console.log('OK:', msg); }
(async () => {
  await new Promise(r => setTimeout(r, 2000));
  const u1 = { username: 'fullA_' + Date.now(), password: 'TestPassword123!' };
  const u2 = { username: 'fullB_' + Date.now(), password: 'TestPassword123!' };

  const health = await req('GET', '/api/health');
  ok(health.status === 200 && health.body && health.body.status === 'ok', 'health endpoint');

  const r1 = await req('POST', '/api/register', u1);
  ok(r1.status === 200 && r1.body.token && r1.body.id, 'register user 1');
  const t1 = r1.body.token; const id1 = r1.body.id;

  const r2 = await req('POST', '/api/register', u2);
  ok(r2.status === 200 && r2.body.token && r2.body.id, 'register user 2');
  const t2 = r2.body.token; const id2 = r2.body.id;

  const login = await req('POST', '/api/login', u1);
  ok(login.status === 200 && login.body.token, 'login user 1');

  const createPost = await req('POST', '/api/posts', { content: 'smoke post' }, t1);
  ok(createPost.status === 200 && createPost.body.id, 'create post');
  const postId = createPost.body.id;

  const feed = await req('GET', '/api/posts', null, t1);
  ok(feed.status === 200 && Array.isArray(feed.body), 'list posts');

  const react = await req('POST', `/api/posts/${postId}/reaction`, { type: 'like' }, t2);
  ok(react.status === 200, 'react to post');

  const comment = await req('POST', `/api/posts/${postId}/comments`, { content: 'smoke comment' }, t2);
  ok(comment.status === 200, 'comment post');

  const profile = await req('GET', `/api/users/${id1}`, null, t2);
  ok(profile.status === 200 && profile.body && profile.body.id === id1, 'open profile');

  const subscribe = await req('POST', `/api/subscribe/${id1}`, {}, t2);
  ok(subscribe.status === 200, 'subscribe user');

  const notifications = await req('GET', '/api/notifications', null, t1);
  ok(notifications.status === 200 && Array.isArray(notifications.body), 'notifications list');

  const msgSend = await req('POST', `/api/messages/${id1}`, { content: 'smoke message' }, t2);
  ok(msgSend.status === 200, 'send message');

  const dialogs = await req('GET', '/api/dialogs', null, t1);
  ok(dialogs.status === 200 && Array.isArray(dialogs.body), 'dialogs list');

  const unread = await req('GET', '/api/messages/unread-count', null, t1);
  ok(unread.status === 200 && typeof unread.body.count === 'number', 'unread count');

  const read = await req('POST', `/api/messages/${id2}/read`, {}, t1);
  ok(read.status === 200, 'mark messages as read');

  const fullPost = await req('GET', `/api/posts/${postId}/full`, null, t1);
  ok(fullPost.status === 200 && fullPost.body && fullPost.body.id === postId, 'full post endpoint');

  const stories = await req('GET', '/api/stories', null, t1);
  ok(stories.status === 200 && Array.isArray(stories.body), 'stories list');

  console.log('SMOKE_OK');
  process.exit(0);
})().catch((e) => {
  console.error('SMOKE_FAIL:', e.message);
  process.exit(1);
});
