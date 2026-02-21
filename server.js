const express = require('express');
const helmet = require('helmet');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const sqlite3 = require('sqlite3').verbose();
const { open } = require('sqlite');
const path = require('path');
const multer = require('multer');
const fs = require('fs').promises;

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-change-me';
const PORT = process.env.PORT || 3000;

// Multer configuration for file uploads
const uploadDir = path.join(__dirname, 'uploads');
const storage = multer.diskStorage({
  destination: async (req, file, cb) => {
    await fs.mkdir(uploadDir, { recursive: true });
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'avatar-' + uniqueSuffix + path.extname(file.originalname));
  }
});
const upload = multer({ storage: storage, limits: { fileSize: 5 * 1024 * 1024 } });

const postImageStorage = multer.diskStorage({
  destination: async (req, file, cb) => {
    await fs.mkdir(uploadDir, { recursive: true });
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'post-' + uniqueSuffix + path.extname(file.originalname));
  }
});
const uploadPostImage = multer({ storage: postImageStorage, limits: { fileSize: 10 * 1024 * 1024 } });

const postMediaStorage = multer.diskStorage({
  destination: async (req, file, cb) => {
    await fs.mkdir(uploadDir, { recursive: true });
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const prefix = file.fieldname === 'audio' ? 'audio-' : 'post-';
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, prefix + uniqueSuffix + path.extname(file.originalname));
  }
});
const uploadPostMedia = multer({
  storage: postMediaStorage,
  limits: { fileSize: 15 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (file.fieldname === 'image' && !file.mimetype.startsWith('image/')) return cb(new Error('Only images allowed for image field'));
    if (file.fieldname === 'audio' && !file.mimetype.startsWith('audio/')) return cb(new Error('Only audio files allowed'));
    cb(null, true);
  }
}).fields([{ name: 'image', maxCount: 1 }, { name: 'audio', maxCount: 1 }]);

async function initDb() {
  const db = await open({ filename: path.join(__dirname, 'data.db'), driver: sqlite3.Database });
  await db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE,
      password_hash TEXT,
      avatar TEXT DEFAULT 'https://ui-avatars.com/api/?name=USER&background=10b981&color=fff',
      bio TEXT DEFAULT ''
    );
    CREATE TABLE IF NOT EXISTS posts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER,
      content TEXT,
      image TEXT DEFAULT NULL,
      created_at INTEGER,
      FOREIGN KEY(user_id) REFERENCES users(id)
    );
    CREATE TABLE IF NOT EXISTS reactions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      post_id INTEGER,
      user_id INTEGER,
      type TEXT,
      UNIQUE(post_id, user_id, type),
      FOREIGN KEY(post_id) REFERENCES posts(id),
      FOREIGN KEY(user_id) REFERENCES users(id)
    );
    CREATE TABLE IF NOT EXISTS comments (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      post_id INTEGER,
      user_id INTEGER,
      content TEXT,
      created_at INTEGER,
      FOREIGN KEY(post_id) REFERENCES posts(id),
      FOREIGN KEY(user_id) REFERENCES users(id)
    );
    CREATE TABLE IF NOT EXISTS subscriptions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      subscriber_id INTEGER,
      subscribed_to_id INTEGER,
      created_at INTEGER,
      UNIQUE(subscriber_id, subscribed_to_id),
      FOREIGN KEY(subscriber_id) REFERENCES users(id),
      FOREIGN KEY(subscribed_to_id) REFERENCES users(id)
    );
    CREATE TABLE IF NOT EXISTS notifications (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER,
      type TEXT,
      from_user_id INTEGER,
      post_id INTEGER DEFAULT NULL,
      is_read INTEGER DEFAULT 0,
      created_at INTEGER,
      FOREIGN KEY(user_id) REFERENCES users(id),
      FOREIGN KEY(from_user_id) REFERENCES users(id),
      FOREIGN KEY(post_id) REFERENCES posts(id)
    );
    CREATE TABLE IF NOT EXISTS messages (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      from_user_id INTEGER,
      to_user_id INTEGER,
      content TEXT,
      is_read INTEGER DEFAULT 0,
      created_at INTEGER,
      FOREIGN KEY(from_user_id) REFERENCES users(id),
      FOREIGN KEY(to_user_id) REFERENCES users(id)
    );
  `);
  try {
    await db.run('ALTER TABLE posts ADD COLUMN audio TEXT DEFAULT NULL');
  } catch (e) { /* column may already exist */ }
  return db;
}

function authMiddleware(req, res, next) {
  const auth = req.headers.authorization;
  if (!auth) return res.status(401).json({ error: 'Missing auth' });
  const parts = auth.split(' ');
  if (parts.length !== 2 || parts[0] !== 'Bearer') return res.status(401).json({ error: 'Invalid auth header' });
  try {
    const payload = jwt.verify(parts[1], JWT_SECRET);
    req.user = payload;
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Invalid token' });
  }
}

(async () => {
  const db = await initDb();
  const app = express();
  app.use(helmet());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(express.static(path.join(__dirname, 'public')));
  app.use('/uploads', express.static(uploadDir));

  function validatePassword(p) {
    if (p.length < 8) return { ok: false, error: 'password_min_length' };
    if (!/[A-Z]/.test(p)) return { ok: false, error: 'password_need_upper' };
    if (!/[a-z]/.test(p)) return { ok: false, error: 'password_need_lower' };
    if (!/[0-9]/.test(p)) return { ok: false, error: 'password_need_digit' };
    if (!/[^A-Za-z0-9]/.test(p)) return { ok: false, error: 'password_need_special' };
    return { ok: true };
  }

  app.post('/api/register', async (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) return res.status(400).json({ error: 'username and password required' });
    const pwCheck = validatePassword(password);
    if (!pwCheck.ok) return res.status(400).json({ error: pwCheck.error });
    const existing = await db.get('SELECT id FROM users WHERE LOWER(username) = LOWER(?)', username.trim());
    if (existing) return res.status(400).json({ error: 'username_taken' });
    const hash = await bcrypt.hash(password, 10);
    const name = username.trim();
    try {
      const result = await db.run('INSERT INTO users (username, password_hash) VALUES (?, ?)', name, hash);
      const id = result.lastID;
      const token = jwt.sign({ id, username: name }, JWT_SECRET);
      res.json({ token, username: name, id });
    } catch (err) {
      res.status(400).json({ error: 'username_taken' });
    }
  });

  app.post('/api/login', async (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) return res.status(400).json({ error: 'username and password required' });
    const user = await db.get('SELECT * FROM users WHERE LOWER(username) = LOWER(?)', username.trim());
    if (!user) return res.status(400).json({ error: 'invalid credentials' });
    const ok = await bcrypt.compare(password, user.password_hash);
    if (!ok) return res.status(400).json({ error: 'invalid credentials' });
    const token = jwt.sign({ id: user.id, username: user.username }, JWT_SECRET);
    res.json({ token, username: user.username, id: user.id, avatar: user.avatar, bio: user.bio });
  });

  app.get('/api/posts', async (req, res) => {
    const auth = req.headers.authorization;
    let userId = null;
    if (auth) {
      const parts = auth.split(' ');
      if (parts.length === 2 && parts[0] === 'Bearer') {
        try {
          const payload = jwt.verify(parts[1], JWT_SECRET);
          userId = payload.id;
        } catch (err) {}
      }
    }
    const posts = await db.all(`
      SELECT p.id, p.content, p.image, p.audio, p.created_at, u.id as user_id, u.username, u.avatar
      FROM posts p
      JOIN users u ON u.id = p.user_id
      ORDER BY p.created_at DESC
    `);
    const results = [];
    for (const p of posts) {
      const reactions = await db.all('SELECT type, COUNT(*) as count FROM reactions WHERE post_id = ? GROUP BY type', p.id);
      const comments = await db.get('SELECT COUNT(*) as count FROM comments WHERE post_id = ?', p.id);
      let userReactions = [];
      if (userId) {
        userReactions = await db.all('SELECT type FROM reactions WHERE post_id = ? AND user_id = ?', p.id, userId);
      }
      results.push({ ...p, reactions: reactions.reduce((acc, r) => ({ ...acc, [r.type]: r.count }), {}), userReactions: userReactions.map(r => r.type), comments: comments.count });
    }
    res.json(results);
  });

  app.get('/api/posts/subscriptions', authMiddleware, async (req, res) => {
    const userId = req.user.id;
    const posts = await db.all(`
      SELECT p.id, p.content, p.image, p.audio, p.created_at, u.id as user_id, u.username, u.avatar
      FROM posts p
      JOIN users u ON u.id = p.user_id
      WHERE p.user_id IN (SELECT subscribed_to_id FROM subscriptions WHERE subscriber_id = ?)
      ORDER BY p.created_at DESC
    `, userId);
    const results = [];
    for (const p of posts) {
      const reactions = await db.all('SELECT type, COUNT(*) as count FROM reactions WHERE post_id = ? GROUP BY type', p.id);
      const comments = await db.get('SELECT COUNT(*) as count FROM comments WHERE post_id = ?', p.id);
      const userReactions = await db.all('SELECT type FROM reactions WHERE post_id = ? AND user_id = ?', p.id, userId);
      results.push({ ...p, reactions: reactions.reduce((acc, r) => ({ ...acc, [r.type]: r.count }), {}), userReactions: userReactions.map(r => r.type), comments: comments.count });
    }
    res.json(results);
  });

  app.post('/api/posts', authMiddleware, async (req, res) => {
    try {
      const { content } = req.body;
      if (!content || content.trim() === '') {
        return res.status(400).json({ error: 'content required' });
      }
      const created_at = Date.now();
      const result = await db.run('INSERT INTO posts (user_id, content, image, audio, created_at) VALUES (?, ?, ?, ?, ?)', req.user.id, content, null, null, created_at);
      const post = await db.get('SELECT p.id, p.content, p.image, p.audio, p.created_at, u.id as user_id, u.username, u.avatar FROM posts p JOIN users u ON u.id = p.user_id WHERE p.id = ?', result.lastID);
      
      // Notify all subscribers
      const subscribers = await db.all('SELECT subscriber_id FROM subscriptions WHERE subscribed_to_id = ?', req.user.id);
      for (const sub of subscribers) {
        await db.run('INSERT INTO notifications (user_id, type, from_user_id, post_id, created_at) VALUES (?, ?, ?, ?, ?)', sub.subscriber_id, 'new_post', req.user.id, result.lastID, created_at);
      }
      
      res.json(post);
    } catch (err) {
      console.error('Error in POST /api/posts:', err);
      res.status(500).json({ error: err.message });
    }
  });

  app.post('/api/posts/with-image', authMiddleware, uploadPostImage.single('image'), async (req, res) => {
    try {
      const { content } = req.body;
      if (!content && !req.file) {
        return res.status(400).json({ error: 'content or image required' });
      }
      const created_at = Date.now();
      const imageUrl = req.file ? '/uploads/' + req.file.filename : null;
      const result = await db.run('INSERT INTO posts (user_id, content, image, audio, created_at) VALUES (?, ?, ?, ?, ?)', req.user.id, content || '', imageUrl, null, created_at);
      const post = await db.get('SELECT p.id, p.content, p.image, p.audio, p.created_at, u.id as user_id, u.username, u.avatar FROM posts p JOIN users u ON u.id = p.user_id WHERE p.id = ?', result.lastID);
      
      const subscribers = await db.all('SELECT subscriber_id FROM subscriptions WHERE subscribed_to_id = ?', req.user.id);
      for (const sub of subscribers) {
        await db.run('INSERT INTO notifications (user_id, type, from_user_id, post_id, created_at) VALUES (?, ?, ?, ?, ?)', sub.subscriber_id, 'new_post', req.user.id, result.lastID, created_at);
      }
      
      res.json(post);
    } catch (err) {
      console.error('Error in POST /api/posts/with-image:', err);
      res.status(500).json({ error: err.message });
    }
  });

  app.post('/api/posts/with-media', authMiddleware, uploadPostMedia, async (req, res) => {
    try {
      const { content } = req.body || {};
      const imageFile = req.files && req.files.image && req.files.image[0];
      const audioFile = req.files && req.files.audio && req.files.audio[0];
      if (!content && !imageFile && !audioFile) {
        return res.status(400).json({ error: 'content, image or audio required' });
      }
      const created_at = Date.now();
      const imageUrl = imageFile ? '/uploads/' + imageFile.filename : null;
      const audioUrl = audioFile ? '/uploads/' + audioFile.filename : null;
      const result = await db.run('INSERT INTO posts (user_id, content, image, audio, created_at) VALUES (?, ?, ?, ?, ?)', req.user.id, content || '', imageUrl, audioUrl, created_at);
      const post = await db.get('SELECT p.id, p.content, p.image, p.audio, p.created_at, u.id as user_id, u.username, u.avatar FROM posts p JOIN users u ON u.id = p.user_id WHERE p.id = ?', result.lastID);
      
      const subscribers = await db.all('SELECT subscriber_id FROM subscriptions WHERE subscribed_to_id = ?', req.user.id);
      for (const sub of subscribers) {
        await db.run('INSERT INTO notifications (user_id, type, from_user_id, post_id, created_at) VALUES (?, ?, ?, ?, ?)', sub.subscriber_id, 'new_post', req.user.id, result.lastID, created_at);
      }
      
      res.json(post);
    } catch (err) {
      console.error('Error in POST /api/posts/with-media:', err);
      res.status(500).json({ error: err.message });
    }
  });

  app.post('/api/posts/:id/reaction', authMiddleware, async (req, res) => {
    const postId = req.params.id;
    const { type } = req.body;
    if (!type) return res.status(400).json({ error: 'type required' });
    try {
      await db.run('INSERT INTO reactions (post_id, user_id, type) VALUES (?, ?, ?)', postId, req.user.id, type);
    } catch (err) {
      // If unique constraint conflict (already reacted with same type), remove it (toggle)
      await db.run('DELETE FROM reactions WHERE post_id = ? AND user_id = ? AND type = ?', postId, req.user.id, type);
    }
    const reactions = await db.all('SELECT type, COUNT(*) as count FROM reactions WHERE post_id = ? GROUP BY type', postId);
    res.json({ reactions: reactions.reduce((acc, r) => ({ ...acc, [r.type]: r.count }), {}) });
  });

  app.get('/api/posts/:id/comments', async (req, res) => {
    const postId = req.params.id;
    const comments = await db.all(`
      SELECT c.id, c.content, c.created_at, u.id as user_id, u.username, u.avatar
      FROM comments c
      JOIN users u ON u.id = c.user_id
      WHERE c.post_id = ?
      ORDER BY c.created_at ASC
    `, postId);
    res.json(comments);
  });

  app.post('/api/posts/:id/comments', authMiddleware, async (req, res) => {
    const postId = req.params.id;
    const { content } = req.body;
    if (!content) return res.status(400).json({ error: 'content required' });
    const created_at = Date.now();
    const result = await db.run('INSERT INTO comments (post_id, user_id, content, created_at) VALUES (?, ?, ?, ?)', postId, req.user.id, content, created_at);
    const comment = await db.get('SELECT c.id, c.content, c.created_at, u.id as user_id, u.username, u.avatar FROM comments c JOIN users u ON u.id = c.user_id WHERE c.id = ?', result.lastID);
    res.json(comment);
  });

  app.get('/api/users/:id', async (req, res) => {
    const userId = req.params.id;
    let currentUserId = null;
    const auth = req.headers.authorization;
    if (auth) {
      const parts = auth.split(' ');
      if (parts.length === 2 && parts[0] === 'Bearer') {
        try {
          const payload = jwt.verify(parts[1], JWT_SECRET);
          currentUserId = payload.id;
        } catch (err) {}
      }
    }
    const user = await db.get('SELECT id, username, avatar, bio FROM users WHERE id = ?', userId);
    if (!user) return res.status(404).json({ error: 'user not found' });
    const posts = await db.all('SELECT id, content, created_at FROM posts WHERE user_id = ? ORDER BY created_at DESC', userId);
    const subscribers = await db.get('SELECT COUNT(*) as count FROM subscriptions WHERE subscribed_to_id = ?', userId);
    let isSubscribed = false;
    if (currentUserId) {
      const sub = await db.get('SELECT id FROM subscriptions WHERE subscriber_id = ? AND subscribed_to_id = ?', currentUserId, userId);
      isSubscribed = !!sub;
    }
    res.json({ ...user, posts, subscribers: subscribers.count, isSubscribed });
  });

  app.put('/api/users/profile', authMiddleware, async (req, res) => {
    const { avatar, bio } = req.body;
    if (!avatar && !bio) return res.status(400).json({ error: 'avatar or bio required' });
    const updates = [];
    const values = [];
    if (avatar) { updates.push('avatar = ?'); values.push(avatar); }
    if (bio) { updates.push('bio = ?'); values.push(bio); }
    values.push(req.user.id);
    await db.run(`UPDATE users SET ${updates.join(', ')} WHERE id = ?`, values);
    const user = await db.get('SELECT id, username, avatar, bio FROM users WHERE id = ?', req.user.id);
    res.json(user);
  });

  app.post('/api/users/avatar', authMiddleware, upload.single('avatar'), async (req, res) => {
    if (!req.file) return res.status(400).json({ error: 'no file uploaded' });
    const avatarUrl = '/uploads/' + req.file.filename;
    await db.run('UPDATE users SET avatar = ? WHERE id = ?', avatarUrl, req.user.id);
    const user = await db.get('SELECT id, username, avatar, bio FROM users WHERE id = ?', req.user.id);
    res.json(user);
  });

  app.post('/api/subscribe/:userId', authMiddleware, async (req, res) => {
    const targetUserId = parseInt(req.params.userId);
    if (targetUserId === req.user.id) {
      return res.status(400).json({ error: 'cannot subscribe to yourself' });
    }
    try {
      const created_at = Date.now();
      await db.run('INSERT INTO subscriptions (subscriber_id, subscribed_to_id, created_at) VALUES (?, ?, ?)', req.user.id, targetUserId, created_at);
      // Create notification for the user being subscribed to
      await db.run('INSERT INTO notifications (user_id, type, from_user_id, created_at) VALUES (?, ?, ?, ?)', targetUserId, 'subscribe', req.user.id, created_at);
      res.json({ subscribed: true });
    } catch (err) {
      res.status(400).json({ error: 'already subscribed' });
    }
  });

  app.post('/api/unsubscribe/:userId', authMiddleware, async (req, res) => {
    const targetUserId = parseInt(req.params.userId);
    await db.run('DELETE FROM subscriptions WHERE subscriber_id = ? AND subscribed_to_id = ?', req.user.id, targetUserId);
    res.json({ subscribed: false });
  });

  app.get('/api/subscriptions', authMiddleware, async (req, res) => {
    const subscriptions = await db.all(`
      SELECT u.id, u.username, u.avatar
      FROM subscriptions s
      JOIN users u ON u.id = s.subscribed_to_id
      WHERE s.subscriber_id = ?
      ORDER BY s.created_at DESC
    `, req.user.id);
    res.json(subscriptions);
  });

  app.get('/api/notifications', authMiddleware, async (req, res) => {
    const notifications = await db.all(`
      SELECT n.id, n.type, n.is_read, n.created_at, u.id as from_user_id, u.username, u.avatar, p.id as post_id, p.content as post_content
      FROM notifications n
      JOIN users u ON u.id = n.from_user_id
      LEFT JOIN posts p ON p.id = n.post_id
      WHERE n.user_id = ?
      ORDER BY n.created_at DESC
    `, req.user.id);
    res.json(notifications);
  });

  app.post('/api/notifications/:id/read', authMiddleware, async (req, res) => {
    await db.run('UPDATE notifications SET is_read = 1 WHERE id = ? AND user_id = ?', req.params.id, req.user.id);
    res.json({ success: true });
  });

  app.post('/api/notifications/mark-all-read', authMiddleware, async (req, res) => {
    await db.run('UPDATE notifications SET is_read = 1 WHERE user_id = ?', req.user.id);
    res.json({ success: true });
  });

  app.post('/api/messages/:userId', authMiddleware, async (req, res) => {
    const toUserId = parseInt(req.params.userId);
    const { content } = req.body;
    if (!content || content.trim() === '') {
      return res.status(400).json({ error: 'content required' });
    }
    try {
      const created_at = Date.now();
      await db.run('INSERT INTO messages (from_user_id, to_user_id, content, created_at) VALUES (?, ?, ?, ?)', req.user.id, toUserId, content, created_at);
      res.json({ success: true });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  app.get('/api/messages/:userId', authMiddleware, async (req, res) => {
    const otherUserId = parseInt(req.params.userId);
    const messages = await db.all(`
      SELECT m.id, m.from_user_id, m.to_user_id, m.content, m.is_read, m.created_at, 
             u.username, u.avatar
      FROM messages m
      JOIN users u ON u.id = m.from_user_id
      WHERE (m.from_user_id = ? AND m.to_user_id = ?) OR (m.from_user_id = ? AND m.to_user_id = ?)
      ORDER BY m.created_at ASC
    `, req.user.id, otherUserId, otherUserId, req.user.id);
    res.json(messages);
  });

  app.get('/api/dialogs', authMiddleware, async (req, res) => {
    const dialogs = await db.all(`
      SELECT DISTINCT 
        CASE WHEN m.from_user_id = ? THEN m.to_user_id ELSE m.from_user_id END as user_id,
        u.username, u.avatar,
        MAX(m.created_at) as last_message_at,
        (SELECT content FROM messages WHERE 
          (from_user_id = ? AND to_user_id = u.id) OR (from_user_id = u.id AND to_user_id = ?)
          ORDER BY created_at DESC LIMIT 1) as last_message_content
      FROM messages m
      JOIN users u ON u.id = CASE WHEN m.from_user_id = ? THEN m.to_user_id ELSE m.from_user_id END
      WHERE m.from_user_id = ? OR m.to_user_id = ?
      GROUP BY user_id
      ORDER BY last_message_at DESC
    `, req.user.id, req.user.id, req.user.id, req.user.id, req.user.id, req.user.id);
    res.json(dialogs);
  });

  app.post('/api/messages/:userId/read', authMiddleware, async (req, res) => {
    const fromUserId = parseInt(req.params.userId);
    await db.run('UPDATE messages SET is_read = 1 WHERE from_user_id = ? AND to_user_id = ?', fromUserId, req.user.id);
    res.json({ success: true });
  });

  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok' });
  });

  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
})();
