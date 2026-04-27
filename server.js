const express = require('express');
const helmet = require('helmet');
const compression = require('compression');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
<<<<<<< HEAD
const initSqlJs = require('sql.js');
const path = require('path');
const multer = require('multer');
const fsSync = require('fs');
const fs = fsSync.promises;
const nodemailer = require('nodemailer');

function loadEnvFile(envPath) {
  try {
    if (!fsSync.existsSync(envPath)) return;
    const raw = fsSync.readFileSync(envPath, 'utf8');
    for (const line of raw.split(/\r?\n/)) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('#')) continue;
      const eqIndex = trimmed.indexOf('=');
      if (eqIndex <= 0) continue;
      const key = trimmed.slice(0, eqIndex).trim();
      let value = trimmed.slice(eqIndex + 1).trim();
      if (!key || process.env[key] !== undefined) continue;
      if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
        value = value.slice(1, -1);
      }
      process.env[key] = value;
    }
  } catch (err) {
    console.warn('Failed to load .env file:', err.message);
  }
}

loadEnvFile(path.join(__dirname, '.env'));

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-change-me';
const PORT = process.env.PORT || 3000;
const PRESENCE_TIMEOUT_MS = 10 * 60 * 1000;
const DATA_DIR = process.env.DATA_DIR || __dirname;
const DB_PATH = process.env.DB_PATH || path.join(DATA_DIR, 'data.db');
const uploadDir = process.env.UPLOAD_DIR || path.join(DATA_DIR, 'uploads');
const DEFAULT_AVATAR_URL = '/default-avatar.svg';
const MISTRAL_API_KEY = process.env.MISTRAL_API_KEY || '';
const MISTRAL_MODEL = process.env.MISTRAL_MODEL || 'mistral-small-latest';
const MISTRAL_CHAT_URL = 'https://api.mistral.ai/v1/chat/completions';
const ACCESS_REQUEST_STATUS_PENDING = 'pending';
const ACCESS_REQUEST_STATUS_APPROVED = 'approved';
const ACCESS_REQUEST_STATUS_REJECTED = 'rejected';
const ACCESS_REQUEST_TYPE_VIEW = 'view';
const ACCESS_REQUEST_TYPE_SUBSCRIBE = 'subscribe';
=======
const path = require('path');
const multer = require('multer');
const fs = require('fs').promises;
const crypto = require('crypto');
const { open } = require('sqlite');
const sqlite3 = require('sqlite3').verbose();

const DEFAULT_DATA_DIR = process.env.DATA_DIR || path.join(__dirname, 'data');
let dbPath = process.env.DB_PATH || path.join(DEFAULT_DATA_DIR, 'data.db');
const hasExplicitUploadDir = Boolean(process.env.UPLOAD_DIR);
let uploadDir = process.env.UPLOAD_DIR || path.join(DEFAULT_DATA_DIR, 'uploads');

let db;

const JWT_SECRET =
  process.env.JWT_SECRET ||
  (process.env.NODE_ENV === 'production' ? null : 'dev-secret-change-me');
const PORT = process.env.PORT || 3000;

if (!JWT_SECRET) {
  throw new Error('JWT_SECRET must be set in production');
}
>>>>>>> 43fc63577f740ec07265f99ac0d4769620c4ae8c

// Multer configuration for file uploads
const storage = multer.diskStorage({
  destination: async (req, file, cb) => {
<<<<<<< HEAD
    await fs.mkdir(uploadDir, { recursive: true });
    cb(null, uploadDir);
=======
    try {
      await fs.mkdir(uploadDir, { recursive: true });
      cb(null, uploadDir);
    } catch (err) {
      console.error('Error creating upload dir:', err);
      cb(err, uploadDir);
    }
>>>>>>> 43fc63577f740ec07265f99ac0d4769620c4ae8c
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'avatar-' + uniqueSuffix + path.extname(file.originalname));
  }
});
const upload = multer({ storage: storage, limits: { fileSize: 5 * 1024 * 1024 } });

<<<<<<< HEAD
const backgroundStorage = multer.diskStorage({
  destination: async (req, file, cb) => {
    await fs.mkdir(uploadDir, { recursive: true });
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'background-' + uniqueSuffix + path.extname(file.originalname));
  }
});
const uploadBackground = multer({
  storage: backgroundStorage,
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (!file.mimetype.startsWith('image/')) return cb(new Error('Only images allowed'));
    cb(null, true);
  }
});

=======
>>>>>>> 43fc63577f740ec07265f99ac0d4769620c4ae8c
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

<<<<<<< HEAD
let postMediaFileCounter = 0;
=======
>>>>>>> 43fc63577f740ec07265f99ac0d4769620c4ae8c
const postMediaStorage = multer.diskStorage({
  destination: async (req, file, cb) => {
    await fs.mkdir(uploadDir, { recursive: true });
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
<<<<<<< HEAD
    const prefix = file.fieldname === 'audio' ? 'audio-' : 'post-';
    postMediaFileCounter = (postMediaFileCounter + 1) % 1e9;
    const uniqueSuffix = Date.now() + '-' + postMediaFileCounter + '-' + Math.round(Math.random() * 1E9);
=======
    let prefix = 'post-';
    if (file.fieldname === 'audio') prefix = 'audio-';
    if (file.fieldname === 'video') prefix = 'video-';
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
>>>>>>> 43fc63577f740ec07265f99ac0d4769620c4ae8c
    cb(null, prefix + uniqueSuffix + path.extname(file.originalname));
  }
});
const uploadPostMedia = multer({
  storage: postMediaStorage,
  limits: { fileSize: 15 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (file.fieldname === 'image' && !file.mimetype.startsWith('image/')) return cb(new Error('Only images allowed for image field'));
    if (file.fieldname === 'audio' && !file.mimetype.startsWith('audio/')) return cb(new Error('Only audio files allowed'));
    if (file.fieldname === 'video' && !file.mimetype.startsWith('video/')) return cb(new Error('Only video files allowed'));
    cb(null, true);
  }
<<<<<<< HEAD
}).fields([{ name: 'image', maxCount: 20 }, { name: 'audio', maxCount: 1 }, { name: 'video', maxCount: 20 }]);

let touchUserPresence = async () => {};

function getPresencePayload(user) {
  const lastSeen = Number(user && user.last_seen ? user.last_seen : 0);
  return {
    lastSeen,
    isOnline: lastSeen > 0 && (Date.now() - lastSeen) <= PRESENCE_TIMEOUT_MS
  };
}

function parseAuthUserId(authHeader) {
  if (!authHeader) return null;
  const parts = String(authHeader || '').split(' ');
  if (parts.length !== 2 || parts[0] !== 'Bearer') return null;
  try {
    const payload = jwt.verify(parts[1], JWT_SECRET);
    return payload && payload.id ? Number(payload.id) : null;
  } catch (err) {
    return null;
  }
}

async function getUserPrivacy(db, userId) {
  if (!userId) return null;
  return db.get('SELECT id, is_private FROM users WHERE id = ?', userId);
}

async function getAccessRequestRecord(db, ownerId, requesterId, requestType) {
  if (!ownerId || !requesterId || !requestType) return null;
  return db.get(
    `SELECT id, status, request_type, owner_user_id, requester_user_id, created_at, updated_at
     FROM content_access_requests
     WHERE owner_user_id = ? AND requester_user_id = ? AND request_type = ?
     ORDER BY id DESC
     LIMIT 1`,
    ownerId,
    requesterId,
    requestType
  );
}

async function canAccessPrivateContent(db, ownerId, viewerId, cache = null) {
  const owner = Number(ownerId || 0);
  const viewer = Number(viewerId || 0);
  if (!owner) return false;
  if (owner === viewer) return true;
  const cacheKey = `${owner}:${viewer || 'anon'}`;
  if (cache && cache.has(cacheKey)) return cache.get(cacheKey);

  const privacyRow = await db.get('SELECT is_private FROM users WHERE id = ?', owner);
  const isPrivate = !!(privacyRow && Number(privacyRow.is_private) === 1);
  if (!isPrivate) {
    if (cache) cache.set(cacheKey, true);
    return true;
  }
  if (!viewer) {
    if (cache) cache.set(cacheKey, false);
    return false;
  }

  const approvedSubscription = await db.get(
    'SELECT id FROM subscriptions WHERE subscriber_id = ? AND subscribed_to_id = ?',
    viewer,
    owner
  );
  const approvedViewRequest = await db.get(
    `SELECT id FROM content_access_requests
     WHERE owner_user_id = ? AND requester_user_id = ? AND request_type = ? AND status = ?
     LIMIT 1`,
    owner,
    viewer,
    ACCESS_REQUEST_TYPE_VIEW,
    ACCESS_REQUEST_STATUS_APPROVED
  );
  const approvedSubscribeRequest = await db.get(
    `SELECT id FROM content_access_requests
     WHERE owner_user_id = ? AND requester_user_id = ? AND request_type = ? AND status = ?
     LIMIT 1`,
    owner,
    viewer,
    ACCESS_REQUEST_TYPE_SUBSCRIBE,
    ACCESS_REQUEST_STATUS_APPROVED
  );
  const allowed = !!(approvedSubscription || approvedViewRequest || approvedSubscribeRequest);
  if (cache) cache.set(cacheKey, allowed);
  return allowed;
}

async function filterVisiblePostRows(db, rows, viewerId = null) {
  const cache = new Map();
  const result = [];
  for (const row of rows) {
    const authorAllowed = await canAccessPostRow(db, row, viewerId, cache);
    if (!authorAllowed) continue;
    result.push(row);
  }
  return result;
}

async function canAccessPostRow(db, row, viewerId, cache = null) {
  if (!row) return false;
  const authorAllowed = await canAccessPrivateContent(db, row.user_id, viewerId, cache);
  if (!authorAllowed) return false;
  if (row.original_user_id) {
    const originalAllowed = await canAccessPrivateContent(db, row.original_user_id, viewerId, cache);
    if (!originalAllowed) return false;
  }
  return true;
}

async function createAccessRequestNotification(db, ownerUserId, requesterUserId, requestId, requestType, createdAt) {
  const notificationType = requestType === ACCESS_REQUEST_TYPE_SUBSCRIBE ? 'subscribe_request' : 'content_request';
  await db.run(
    'INSERT INTO notifications (user_id, type, from_user_id, request_id, created_at) VALUES (?, ?, ?, ?, ?)',
    ownerUserId,
    notificationType,
    requesterUserId,
    requestId,
    createdAt
  );
}

async function upsertAccessRequest(db, ownerUserId, requesterUserId, requestType) {
  const now = Date.now();
  const existing = await getAccessRequestRecord(db, ownerUserId, requesterUserId, requestType);
  if (existing && existing.status === ACCESS_REQUEST_STATUS_PENDING) {
    return { requestId: Number(existing.id), status: ACCESS_REQUEST_STATUS_PENDING, created: false };
  }
  if (existing) {
    await db.run(
      `UPDATE content_access_requests
       SET status = ?, created_at = ?, updated_at = ?
       WHERE id = ?`,
      ACCESS_REQUEST_STATUS_PENDING,
      now,
      now,
      existing.id
    );
    await createAccessRequestNotification(db, ownerUserId, requesterUserId, existing.id, requestType, now);
    return { requestId: Number(existing.id), status: ACCESS_REQUEST_STATUS_PENDING, created: true };
  }
  const inserted = await db.run(
    `INSERT INTO content_access_requests
     (owner_user_id, requester_user_id, request_type, status, created_at, updated_at)
     VALUES (?, ?, ?, ?, ?, ?)`,
    ownerUserId,
    requesterUserId,
    requestType,
    ACCESS_REQUEST_STATUS_PENDING,
    now,
    now
  );
  await createAccessRequestNotification(db, ownerUserId, requesterUserId, inserted.lastID, requestType, now);
  return { requestId: Number(inserted.lastID), status: ACCESS_REQUEST_STATUS_PENDING, created: true };
}

function normalizeSearchText(value) {
  return String(value || '')
    .toLowerCase()
    .replace(/\s+/g, ' ')
    .trim();
}

function tokenizeSearchQuery(query) {
  return normalizeSearchText(query)
    .split(/[^a-zа-яё0-9]+/iu)
    .map(token => token.trim())
    .filter(Boolean);
}

function extractMessageText(content) {
  if (typeof content === 'string') return content;
  if (Array.isArray(content)) {
    return content
      .map(part => {
        if (!part) return '';
        if (typeof part === 'string') return part;
        if (typeof part.text === 'string') return part.text;
        return '';
      })
      .join('\n')
      .trim();
  }
  return '';
}

function parseJsonContent(content) {
  const text = extractMessageText(content).trim();
  if (!text) return null;
  try {
    return JSON.parse(text);
  } catch (err) {
    const match = text.match(/\{[\s\S]*\}/);
    if (!match) return null;
    try {
      return JSON.parse(match[0]);
    } catch (nestedErr) {
      return null;
    }
  }
}

function scoreSearchEntry(entry, normalizedQuery, tokens) {
  const haystack = normalizeSearchText([
    entry.type,
    entry.title,
    entry.username,
    entry.snippet,
    entry.text,
    entry.meta
  ].join(' '));

  let score = 0;
  if (normalizedQuery && haystack.includes(normalizedQuery)) score += 12;
  for (const token of tokens) {
    if (!token) continue;
    if (haystack.includes(token)) score += 3;
    if (normalizeSearchText(entry.username).includes(token)) score += 2;
    if (normalizeSearchText(entry.title).includes(token)) score += 2;
  }
  if (entry.type === 'post') {
    const ageHours = Math.max(0, (Date.now() - Number(entry.createdAt || 0)) / 36e5);
    score += Math.max(0, 2 - ageHours / 72);
  }
  return score;
}

async function buildSiteSearchEntries(db, viewerId = null) {
  const postRows = await db.all(`
    SELECT p.id, p.content, p.created_at,
           u.id AS user_id, u.username, u.bio, u.badge, u.is_private
    FROM posts p
    JOIN users u ON u.id = p.user_id
    ORDER BY p.created_at DESC
    LIMIT 120
  `);
  const posts = [];
  const accessCache = new Map();
  for (const post of postRows) {
    if (await canAccessPrivateContent(db, post.user_id, viewerId, accessCache)) {
      posts.push(post);
    }
  }
  const users = await db.all(`
    SELECT id, username, bio, badge, is_private
    FROM users
    ORDER BY last_seen DESC, id DESC
    LIMIT 80
  `);

  const postEntries = posts.map(post => {
    const content = String(post.content || '').trim();
    const snippet = content.length > 240 ? `${content.slice(0, 237)}...` : content;
    return {
      type: 'post',
      id: Number(post.id),
      userId: Number(post.user_id),
      username: String(post.username || ''),
      title: content ? `Post by ${post.username}` : `Media post by ${post.username}`,
      snippet,
      text: [content, post.username, post.bio, post.badge].filter(Boolean).join(' '),
      meta: post.badge || '',
      createdAt: Number(post.created_at || 0)
    };
  });

  const userEntries = users.map(user => {
    const bio = String(user.bio || '').trim();
    return {
      type: 'user',
      id: Number(user.id),
      userId: Number(user.id),
      username: String(user.username || ''),
      title: `Profile ${user.username}`,
      snippet: bio || 'No bio provided yet.',
      text: [user.username, bio, user.badge, Number(user.is_private) ? 'private' : 'public'].filter(Boolean).join(' '),
      meta: user.badge || '',
      createdAt: 0
    };
  });

  return [...postEntries, ...userEntries];
}

function buildFallbackSearchPayload(candidates, query, lang = 'ru') {
  const isRu = lang !== 'en';
  if (!candidates.length) {
    return {
      summary: isRu
        ? `По запросу "${query}" совпадений на сайте пока не найдено.`
        : `No matches were found on the site for "${query}".`,
      results: []
    };
  }

  return {
    summary: isRu
      ? `Нашёл ${candidates.length} наиболее подходящих совпадений по запросу "${query}".`
      : `Found ${candidates.length} relevant matches for "${query}".`,
    results: candidates.slice(0, 6).map(candidate => ({
      type: candidate.type,
      id: candidate.id,
      userId: candidate.userId,
      username: candidate.username,
      title: candidate.title,
      snippet: candidate.snippet,
      reason: candidate.type === 'user'
        ? (isRu
          ? `Профиль ${candidate.username} совпадает по имени или описанию.`
          : `The profile ${candidate.username} matches by name or description.`)
        : (isRu
          ? `Публикация ${candidate.username} совпадает по тексту или автору.`
          : `A post by ${candidate.username} matches the text or author.`)
    }))
  };
}

const POST_SELECT_FIELDS = `
  p.id, p.content, p.image, p.audio, p.video, p.images, p.videos, p.created_at, p.views, p.repost_post_id, p.channel_id,
  u.id as user_id, u.username, u.avatar, u.badge,
  c.name as channel_name, c.user_id as channel_owner_id,
  op.id as original_id, op.content as original_content, op.image as original_image, op.audio as original_audio,
  op.video as original_video, op.images as original_images, op.videos as original_videos, op.channel_id as original_channel_id,
  op.created_at as original_created_at, op.views as original_views,
  oc.name as original_channel_name, oc.user_id as original_channel_owner_id,
  ou.id as original_user_id, ou.username as original_username, ou.avatar as original_avatar, ou.badge as original_badge
`;

function parsePostMediaList(listValue, fallbackValue) {
  if (Array.isArray(listValue)) return listValue;
  if (typeof listValue === 'string' && listValue.trim()) {
    try {
      const parsed = JSON.parse(listValue);
      if (Array.isArray(parsed)) return parsed;
    } catch (err) {}
  }
  return fallbackValue ? [fallbackValue] : [];
}

function mapPostRow(row) {
  const images = parsePostMediaList(row.images, row.image);
  const videos = parsePostMediaList(row.videos, row.video);
  const originalPost = row.original_id ? {
    id: Number(row.original_id),
    content: String(row.original_content || ''),
    image: row.original_image || null,
    audio: row.original_audio || null,
    video: row.original_video || null,
    images: parsePostMediaList(row.original_images, row.original_image),
    videos: parsePostMediaList(row.original_videos, row.original_video),
    created_at: Number(row.original_created_at || 0),
    views: Number(row.original_views || 0),
    user_id: Number(row.original_user_id),
    username: String(row.original_username || ''),
    avatar: row.original_avatar || '',
    badge: row.original_badge || null,
    channel: row.original_channel_id ? {
      id: Number(row.original_channel_id),
      name: String(row.original_channel_name || ''),
      owner_id: Number(row.original_channel_owner_id || 0)
    } : null
  } : null;

  return {
    id: Number(row.id),
    content: String(row.content || ''),
    image: row.image || null,
    audio: row.audio || null,
    video: row.video || null,
    images,
    videos,
    created_at: Number(row.created_at || 0),
    views: Number(row.views || 0),
    repost_post_id: row.repost_post_id ? Number(row.repost_post_id) : null,
    user_id: Number(row.user_id),
    username: String(row.username || ''),
    avatar: row.avatar || '',
    badge: row.badge || null,
    channel: row.channel_id ? {
      id: Number(row.channel_id),
      name: String(row.channel_name || ''),
      owner_id: Number(row.channel_owner_id || 0)
    } : null,
    originalPost,
    originalPostMissing: !!row.repost_post_id && !originalPost
  };
}

function mapMessageRow(row) {
  return {
    id: Number(row.id),
    from_user_id: Number(row.from_user_id),
    to_user_id: Number(row.to_user_id),
    content: String(row.content || ''),
    image: row.image || null,
    audio: row.audio || null,
    video: row.video || null,
    images: parsePostMediaList(row.images, row.image),
    videos: parsePostMediaList(row.videos, row.video),
    is_read: !!Number(row.is_read || 0),
    created_at: Number(row.created_at || 0),
    username: String(row.username || ''),
    avatar: row.avatar || ''
  };
}

function collectMediaUrls(entry, target) {
  if (!entry || !target) return target;
  if (entry.image) target.push(String(entry.image));
  if (entry.audio) target.push(String(entry.audio));
  if (entry.video) target.push(String(entry.video));
  try {
    if (entry.images) {
      const images = Array.isArray(entry.images) ? entry.images : JSON.parse(entry.images);
      if (Array.isArray(images)) images.forEach(url => target.push(String(url)));
    }
    if (entry.videos) {
      const videos = Array.isArray(entry.videos) ? entry.videos : JSON.parse(entry.videos);
      if (Array.isArray(videos)) videos.forEach(url => target.push(String(url)));
    }
  } catch (err) {}
  return target;
}

async function getPostRowById(db, postId) {
  return db.get(`
    SELECT ${POST_SELECT_FIELDS}
    FROM posts p
    JOIN users u ON u.id = p.user_id
    LEFT JOIN channels c ON c.id = p.channel_id
    LEFT JOIN posts op ON op.id = p.repost_post_id
    LEFT JOIN channels oc ON oc.id = op.channel_id
    LEFT JOIN users ou ON ou.id = op.user_id
    WHERE p.id = ?
  `, postId);
}

async function hydratePostRows(db, rows, currentUserId = null) {
  const results = [];
  for (const row of rows) {
    const post = mapPostRow(row);
    const reactions = await db.all('SELECT type, COUNT(*) as count FROM reactions WHERE post_id = ? GROUP BY type', post.id);
    const comments = await db.get('SELECT COUNT(*) as count FROM comments WHERE post_id = ?', post.id);
    let userReactions = [];
    if (currentUserId) {
      userReactions = await db.all('SELECT type FROM reactions WHERE post_id = ? AND user_id = ?', post.id, currentUserId);
    }
    results.push({
      ...post,
      reactions: reactions.reduce((acc, reaction) => ({ ...acc, [reaction.type]: reaction.count }), {}),
      userReactions: userReactions.map(reaction => reaction.type),
      comments: Number(comments && comments.count ? comments.count : 0)
    });
  }
  return results;
}

function getTotalReactionsCount(reactions) {
  if (!reactions || typeof reactions !== 'object') return 0;
  return Object.values(reactions).reduce((sum, value) => sum + Number(value || 0), 0);
}

function calculatePostRecommendationScore(post) {
  const views = Number(post && post.views ? post.views : 0);
  const comments = Number(post && post.comments ? post.comments : 0);
  const reposts = Number(post && post.reposts ? post.reposts : 0);
  const reactions = getTotalReactionsCount(post && post.reactions);
  const ageHours = Math.max(0, (Date.now() - Number(post && post.created_at ? post.created_at : 0)) / 36e5);
  const freshnessBoost = Math.max(0.05, 0.8 - ageHours / 168);
  const decay = 1 / (1 + ageHours / 240);
  const mediaBoost = (post && (post.image || post.audio || post.video || (post.images && post.images.length) || (post.videos && post.videos.length))) ? 1.08 : 1;
  const discussionBoost = comments >= 3 ? 1.12 : 1;
  const repostBoost = reposts > 0 ? 1 + Math.min(reposts, 6) * 0.04 : 1;
  const rawScore = (
    views * 1.2 +
    reactions * 5 +
    comments * 7 +
    reposts * 10 +
    freshnessBoost * 2
  ) * decay * mediaBoost * discussionBoost * repostBoost;

  return Number(rawScore.toFixed(3));
}

async function enrichPostsForRecommendations(db, posts) {
  if (!posts.length) return [];
  const postIds = posts.map(post => Number(post.id)).filter(Number.isFinite);
  const placeholders = postIds.map(() => '?').join(', ');
  const reactionRows = await db.all(
    `SELECT post_id, COUNT(*) AS count FROM reactions WHERE post_id IN (${placeholders}) GROUP BY post_id`,
    ...postIds
  );
  const commentRows = await db.all(
    `SELECT post_id, COUNT(*) AS count FROM comments WHERE post_id IN (${placeholders}) GROUP BY post_id`,
    ...postIds
  );
  const repostRows = await db.all(
    `SELECT repost_post_id AS post_id, COUNT(*) AS count
     FROM posts
     WHERE repost_post_id IN (${placeholders})
     GROUP BY repost_post_id`,
    ...postIds
  );

  const reactionMap = new Map(reactionRows.map(row => [Number(row.post_id), Number(row.count || 0)]));
  const commentMap = new Map(commentRows.map(row => [Number(row.post_id), Number(row.count || 0)]));
  const repostMap = new Map(repostRows.map(row => [Number(row.post_id), Number(row.count || 0)]));

  return posts.map(post => {
    const recommendationScore = calculatePostRecommendationScore({
      ...post,
      comments: commentMap.get(post.id) || 0,
      reposts: repostMap.get(post.id) || 0
    });
    return {
      ...post,
      reactionCount: reactionMap.get(post.id) || getTotalReactionsCount(post.reactions),
      comments: commentMap.get(post.id) || Number(post.comments || 0),
      reposts: repostMap.get(post.id) || 0,
      recommendationScore
    };
  });
}

function compareRecommendedPosts(a, b) {
  if (Number(b.recommendationScore || 0) !== Number(a.recommendationScore || 0)) {
    return Number(b.recommendationScore || 0) - Number(a.recommendationScore || 0);
  }
  if (Number(b.reposts || 0) !== Number(a.reposts || 0)) {
    return Number(b.reposts || 0) - Number(a.reposts || 0);
  }
  if (Number(b.comments || 0) !== Number(a.comments || 0)) {
    return Number(b.comments || 0) - Number(a.comments || 0);
  }
  if (Number(b.reactionCount || 0) !== Number(a.reactionCount || 0)) {
    return Number(b.reactionCount || 0) - Number(a.reactionCount || 0);
  }
  if (Number(b.views || 0) !== Number(a.views || 0)) {
    return Number(b.views || 0) - Number(a.views || 0);
  }
  if (!!a.repost_post_id !== !!b.repost_post_id) {
    return a.repost_post_id ? 1 : -1;
  }
  return Number(b.id || 0) - Number(a.id || 0);
}

function dedupeRecommendedPosts(posts) {
  const bestByKey = new Map();
  for (const post of posts) {
    const normalizedContent = normalizeSearchText(post && post.content ? post.content : '');
    const imageKey = Array.isArray(post && post.images) && post.images.length
      ? post.images.join('|')
      : String((post && post.image) || '');
    const videoKey = Array.isArray(post && post.videos) && post.videos.length
      ? post.videos.join('|')
      : String((post && post.video) || '');
    const mediaKey = [
      imageKey,
      String((post && post.audio) || ''),
      videoKey
    ].join('::');
    const dedupeKey = post && post.repost_post_id
      ? `root:${Number(post.repost_post_id)}`
      : `author:${Number(post && post.user_id ? post.user_id : 0)}|content:${normalizedContent}|media:${mediaKey}`;
    const existing = bestByKey.get(dedupeKey);
    if (!existing || compareRecommendedPosts(post, existing) < 0) {
      bestByKey.set(dedupeKey, post);
    }
  }
  return [...bestByKey.values()].sort(compareRecommendedPosts);
}

async function rerankPostsWithAI(posts) {
  if (!MISTRAL_API_KEY || posts.length < 2) return posts;

  const locallyRanked = [...posts].sort(compareRecommendedPosts);
  const candidatePool = locallyRanked.slice(0, 24);

  try {
    const mistralResponse = await fetch(MISTRAL_CHAT_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${MISTRAL_API_KEY}`
      },
      body: JSON.stringify({
        model: MISTRAL_MODEL,
        temperature: 0.15,
        response_format: { type: 'json_object' },
        messages: [
          {
            role: 'system',
            content: [
              'You rank a social feed for discovery.',
              'Use only the provided posts.',
              'Prioritize engagement using views, reactions, comments, and reposts.',
              'Freshness is a very weak signal and must not dominate ranking.',
              'Do not rank primarily by publish time.',
              'Do not invent or omit ids.',
              'Return valid JSON with shape {"orderedIds":[1,2,3]}.'
            ].join(' ')
          },
          {
            role: 'user',
            content: JSON.stringify({
              posts: candidatePool.map(post => ({
                id: post.id,
                author: post.username,
                content: String(post.content || '').trim().slice(0, 240),
                views: Number(post.views || 0),
                reactions: Number(post.reactionCount || 0),
                comments: Number(post.comments || 0),
                reposts: Number(post.reposts || 0),
                recommendationScore: Number(post.recommendationScore || 0),
                ageHours: Number(Math.max(0, (Date.now() - Number(post.created_at || 0)) / 36e5).toFixed(2))
              }))
            })
          }
        ]
      })
    });

    if (!mistralResponse.ok) {
      const errorText = await mistralResponse.text();
      console.error('Mistral recommendations failed:', mistralResponse.status, errorText);
      return locallyRanked;
    }

    const payload = await mistralResponse.json();
    const parsed = parseJsonContent(payload && payload.choices && payload.choices[0] && payload.choices[0].message && payload.choices[0].message.content);
    const orderedIds = Array.isArray(parsed && parsed.orderedIds)
      ? parsed.orderedIds.map(value => Number(value)).filter(Number.isFinite)
      : [];

    if (!orderedIds.length) {
      return locallyRanked;
    }

    const candidateMap = new Map(candidatePool.map(post => [post.id, post]));
    const aiRanked = [];
    const usedIds = new Set();
    for (const postId of orderedIds) {
      const post = candidateMap.get(postId);
      if (!post || usedIds.has(postId)) continue;
      aiRanked.push(post);
      usedIds.add(postId);
    }
    for (const post of candidatePool) {
      if (!usedIds.has(post.id)) aiRanked.push(post);
    }

    const remainder = locallyRanked.filter(post => !candidateMap.has(post.id));
    return [...aiRanked, ...remainder];
  } catch (err) {
    console.error('Error while reranking recommendations with Mistral:', err);
    return locallyRanked;
  }
}

async function buildRecommendedFeed(db, rows, currentUserId = null) {
  const hydratedPosts = await hydratePostRows(db, rows, currentUserId);
  const enrichedPosts = await enrichPostsForRecommendations(db, hydratedPosts);
  const uniquePosts = dedupeRecommendedPosts(enrichedPosts);
  return rerankPostsWithAI(uniquePosts);
}

async function notifySubscribersAboutPost(db, authorId, postId, createdAt) {
  const subscribers = await db.all('SELECT subscriber_id FROM subscriptions WHERE subscribed_to_id = ?', authorId);
  for (const sub of subscribers) {
    await db.run(
      'INSERT INTO notifications (user_id, type, from_user_id, post_id, created_at) VALUES (?, ?, ?, ?, ?)',
      sub.subscriber_id,
      'new_post',
      authorId,
      postId,
      createdAt
    );
  }
}

async function initDb() {
  await fs.mkdir(DATA_DIR, { recursive: true });
  const dbPath = DB_PATH;
  const SQL = await initSqlJs({
    locateFile: file => path.join(__dirname, 'node_modules', 'sql.js', 'dist', file)
  });

  let rawDb;
  try {
    const file = await fs.readFile(dbPath);
    rawDb = new SQL.Database(file);
  } catch (err) {
    if (err.code !== 'ENOENT') throw err;
    rawDb = new SQL.Database();
  }

  const persist = async () => {
    const data = rawDb.export();
    await fs.writeFile(dbPath, Buffer.from(data));
  };

  const normalizeParams = (args) => {
    if (args.length === 0) return [];
    if (args.length === 1 && Array.isArray(args[0])) return args[0];
    return args;
  };

  const db = {
    async exec(sql) {
      rawDb.exec(sql);
      await persist();
    },
    async run(sql, ...args) {
      const params = normalizeParams(args);
      const stmt = rawDb.prepare(sql);
      try {
        stmt.bind(params);
        stmt.step();
      } finally {
        stmt.free();
      }
      const metaStmt = rawDb.prepare('SELECT changes() AS changes, last_insert_rowid() AS lastID');
      try {
        metaStmt.step();
        const meta = metaStmt.getAsObject();
        await persist();
        return { changes: Number(meta.changes || 0), lastID: Number(meta.lastID || 0) };
      } finally {
        metaStmt.free();
      }
    },
    async get(sql, ...args) {
      const params = normalizeParams(args);
      const stmt = rawDb.prepare(sql);
      try {
        stmt.bind(params);
        if (!stmt.step()) return undefined;
        return stmt.getAsObject();
      } finally {
        stmt.free();
      }
    },
    async all(sql, ...args) {
      const params = normalizeParams(args);
      const stmt = rawDb.prepare(sql);
      try {
        stmt.bind(params);
        const rows = [];
        while (stmt.step()) {
          rows.push(stmt.getAsObject());
        }
        return rows;
      } finally {
        stmt.free();
      }
    }
  };

  await db.exec(`
=======
}).fields([
  { name: 'image', maxCount: 1 },
  { name: 'audio', maxCount: 1 },
  { name: 'video', maxCount: 1 }
]);

const logoStorage = multer.diskStorage({
  destination: async (req, file, cb) => {
    await fs.mkdir(uploadDir, { recursive: true });
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname) || '.png';
    cb(null, 'site-logo' + ext);
  }
});
const uploadLogo = multer({
  storage: logoStorage,
  limits: { fileSize: 2 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (!file.mimetype.startsWith('image/')) return cb(new Error('Only images allowed'));
    cb(null, true);
  }
}).single('logo');

const storyMediaStorage = multer.diskStorage({
  destination: async (req, file, cb) => {
    await fs.mkdir(uploadDir, { recursive: true });
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'story-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const uploadStoryMedia = multer({
  storage: storyMediaStorage,
  limits: { fileSize: 20 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (!file.mimetype.startsWith('audio/')) {
      return cb(new Error('Only audio allowed for stories'));
    }
    cb(null, true);
  }
}).single('media');

async function initDb() {
  const fallbackDataDir = path.join('/tmp', 'green-social');
  const fallbackDbPath = path.join(fallbackDataDir, 'data.db');
  let db;

  try {
    await fs.mkdir(path.dirname(dbPath), { recursive: true });
    db = await open({ filename: dbPath, driver: sqlite3.Database });
  } catch (err) {
    const msg = String(err && (err.message || err));
    const canFallback =
      dbPath !== fallbackDbPath &&
      (err.code === 'SQLITE_CANTOPEN' ||
        err.code === 'EACCES' ||
        err.code === 'EPERM' ||
        msg.includes('SQLITE_CANTOPEN'));

    if (!canFallback) throw err;

    console.warn(`Primary DB path failed (${dbPath}). Falling back to ${fallbackDbPath}.`);
    dbPath = fallbackDbPath;
    if (!hasExplicitUploadDir) {
      uploadDir = path.join(fallbackDataDir, 'uploads');
    }
    await fs.mkdir(path.dirname(dbPath), { recursive: true });
    db = await open({ filename: dbPath, driver: sqlite3.Database });
  }

  console.log(`Using SQLite database at ${dbPath}`);
  await db.exec(`
    CREATE TABLE IF NOT EXISTS settings (key TEXT PRIMARY KEY, value TEXT);
>>>>>>> 43fc63577f740ec07265f99ac0d4769620c4ae8c
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE,
      password_hash TEXT,
<<<<<<< HEAD
      avatar TEXT DEFAULT '${DEFAULT_AVATAR_URL}',
      bio TEXT DEFAULT '',
      background TEXT DEFAULT NULL,
      badge TEXT DEFAULT NULL,
      recovery_code TEXT DEFAULT NULL,
      last_seen INTEGER DEFAULT 0,
      is_private INTEGER DEFAULT 0
=======
      recovery_token TEXT,
      avatar TEXT DEFAULT '/default-avatar.png',
      bio TEXT DEFAULT ''
>>>>>>> 43fc63577f740ec07265f99ac0d4769620c4ae8c
    );
    CREATE TABLE IF NOT EXISTS posts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER,
      content TEXT,
      image TEXT DEFAULT NULL,
      audio TEXT DEFAULT NULL,
<<<<<<< HEAD
      video TEXT DEFAULT NULL,
      channel_id INTEGER DEFAULT NULL,
      repost_post_id INTEGER DEFAULT NULL,
      created_at INTEGER,
      views INTEGER DEFAULT 0,
      FOREIGN KEY(user_id) REFERENCES users(id),
      FOREIGN KEY(channel_id) REFERENCES channels(id),
      FOREIGN KEY(repost_post_id) REFERENCES posts(id)
    );
    CREATE TABLE IF NOT EXISTS channels (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      name TEXT NOT NULL,
      created_at INTEGER NOT NULL,
=======
      category TEXT DEFAULT NULL,
      created_at INTEGER,
>>>>>>> 43fc63577f740ec07265f99ac0d4769620c4ae8c
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
<<<<<<< HEAD
=======
    CREATE TABLE IF NOT EXISTS comment_likes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      comment_id INTEGER,
      user_id INTEGER,
      created_at INTEGER,
      UNIQUE(comment_id, user_id),
      FOREIGN KEY(comment_id) REFERENCES comments(id),
      FOREIGN KEY(user_id) REFERENCES users(id)
    );
>>>>>>> 43fc63577f740ec07265f99ac0d4769620c4ae8c
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
<<<<<<< HEAD
      request_id INTEGER DEFAULT NULL,
=======
      message TEXT DEFAULT NULL,
>>>>>>> 43fc63577f740ec07265f99ac0d4769620c4ae8c
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
<<<<<<< HEAD
    CREATE TABLE IF NOT EXISTS message_reactions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      message_id INTEGER NOT NULL,
      user_id INTEGER NOT NULL,
      reaction TEXT NOT NULL,
      created_at INTEGER NOT NULL,
      FOREIGN KEY(message_id) REFERENCES messages(id),
      FOREIGN KEY(user_id) REFERENCES users(id),
      UNIQUE(message_id, user_id, reaction)
    );
    CREATE TABLE IF NOT EXISTS user_public_keys (
      user_id INTEGER PRIMARY KEY,
      public_key TEXT NOT NULL,
      key_type TEXT DEFAULT 'x25519',
      updated_at INTEGER NOT NULL,
      FOREIGN KEY(user_id) REFERENCES users(id)
    );
    CREATE TABLE IF NOT EXISTS support_requests (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      type INTEGER NOT NULL,
      scammer_link TEXT,
      user_id INTEGER,
      created_at INTEGER,
      FOREIGN KEY(user_id) REFERENCES users(id)
    );
    CREATE TABLE IF NOT EXISTS site_news (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      content TEXT NOT NULL,
      created_at INTEGER NOT NULL,
      FOREIGN KEY(user_id) REFERENCES users(id)
    );
    CREATE TABLE IF NOT EXISTS content_access_requests (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      owner_user_id INTEGER NOT NULL,
      requester_user_id INTEGER NOT NULL,
      request_type TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT '${ACCESS_REQUEST_STATUS_PENDING}',
      created_at INTEGER NOT NULL,
      updated_at INTEGER NOT NULL,
      UNIQUE(owner_user_id, requester_user_id, request_type),
      FOREIGN KEY(owner_user_id) REFERENCES users(id),
      FOREIGN KEY(requester_user_id) REFERENCES users(id)
    );
    CREATE TABLE IF NOT EXISTS stories (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      media_type TEXT NOT NULL,
      media_url TEXT NOT NULL,
      created_at INTEGER NOT NULL,
      expires_at INTEGER NOT NULL,
      FOREIGN KEY(user_id) REFERENCES users(id)
    );
    CREATE TABLE IF NOT EXISTS story_comments (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      story_id INTEGER NOT NULL,
      user_id INTEGER NOT NULL,
      parent_id INTEGER DEFAULT NULL,
      content TEXT NOT NULL,
      created_at INTEGER NOT NULL,
      FOREIGN KEY(story_id) REFERENCES stories(id),
      FOREIGN KEY(user_id) REFERENCES users(id),
      FOREIGN KEY(parent_id) REFERENCES story_comments(id)
    );
    CREATE TABLE IF NOT EXISTS story_likes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      story_id INTEGER NOT NULL,
      user_id INTEGER NOT NULL,
      created_at INTEGER NOT NULL,
      FOREIGN KEY(story_id) REFERENCES stories(id),
      FOREIGN KEY(user_id) REFERENCES users(id),
      UNIQUE(story_id, user_id)
    );
    CREATE TABLE IF NOT EXISTS story_comment_likes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      comment_id INTEGER NOT NULL,
      user_id INTEGER NOT NULL,
      created_at INTEGER NOT NULL,
      FOREIGN KEY(comment_id) REFERENCES story_comments(id),
      FOREIGN KEY(user_id) REFERENCES users(id),
      UNIQUE(comment_id, user_id)
    );
  `);
  try {
    await db.run('ALTER TABLE posts ADD COLUMN audio TEXT DEFAULT NULL');
  } catch (e) { /* column may already exist */ }
  try {
    await db.run('ALTER TABLE posts ADD COLUMN video TEXT DEFAULT NULL');
  } catch (e) { /* column may already exist */ }
  try {
    await db.run('ALTER TABLE posts ADD COLUMN views INTEGER DEFAULT 0');
  } catch (e) { /* column may already exist */ }
  try {
    await db.run('ALTER TABLE users ADD COLUMN background TEXT DEFAULT NULL');
  } catch (e) { /* column may already exist */ }
  try {
    await db.run('ALTER TABLE users ADD COLUMN badge TEXT DEFAULT NULL');
  } catch (e) { /* column may already exist */ }
  try {
    await db.run('ALTER TABLE users ADD COLUMN recovery_code TEXT DEFAULT NULL');
  } catch (e) { /* column may already exist */ }
  try {
    await db.run('ALTER TABLE users ADD COLUMN last_seen INTEGER DEFAULT 0');
  } catch (e) { /* column may already exist */ }
  try {
    await db.run('ALTER TABLE users ADD COLUMN is_private INTEGER DEFAULT 0');
  } catch (e) { /* column may already exist */ }
  try {
    await db.run('ALTER TABLE notifications ADD COLUMN request_id INTEGER DEFAULT NULL');
  } catch (e) { /* column may already exist */ }
  try {
    await db.run('ALTER TABLE notifications ADD COLUMN content TEXT DEFAULT NULL');
  } catch (e) { /* column may already exist */ }
  await db.run(
    "UPDATE users SET avatar = ? WHERE avatar IS NULL OR TRIM(avatar) = '' OR avatar LIKE 'https://ui-avatars.com/api/%' OR avatar = '/default-avatar.jpg'",
    DEFAULT_AVATAR_URL
  );
  try {
    await db.run('ALTER TABLE posts ADD COLUMN images TEXT DEFAULT NULL');
  } catch (e) { /* column may already exist */ }

  // Insert test stories
  const testUser = await db.get('SELECT id FROM users LIMIT 1');
  if (testUser) {
    const now = Date.now();
    const expires = now + 24 * 60 * 60 * 1000;
    await db.run(`
      INSERT OR IGNORE INTO stories (user_id, media_type, media_url, created_at, expires_at)
      VALUES (?, 'image', '/tap-logo.png', ?, ?)
    `, testUser.id, now, expires);
  }
  try {
    await db.run('ALTER TABLE posts ADD COLUMN videos TEXT DEFAULT NULL');
  } catch (e) { /* column may already exist */ }
  try {
    await db.run('ALTER TABLE posts ADD COLUMN repost_post_id INTEGER DEFAULT NULL');
  } catch (e) { /* column may already exist */ }
  try {
    await db.run('ALTER TABLE posts ADD COLUMN channel_id INTEGER DEFAULT NULL');
  } catch (e) { /* column may already exist */ }
  try {
    await db.run('ALTER TABLE messages ADD COLUMN image TEXT DEFAULT NULL');
  } catch (e) { /* column may already exist */ }
  try {
    await db.run('ALTER TABLE messages ADD COLUMN audio TEXT DEFAULT NULL');
  } catch (e) { /* column may already exist */ }
  try {
    await db.run('ALTER TABLE messages ADD COLUMN video TEXT DEFAULT NULL');
  } catch (e) { /* column may already exist */ }
  try {
    await db.run('ALTER TABLE messages ADD COLUMN images TEXT DEFAULT NULL');
  } catch (e) { /* column may already exist */ }
  try {
    await db.run('ALTER TABLE messages ADD COLUMN videos TEXT DEFAULT NULL');
  } catch (e) { /* column may already exist */ }
  return db;
}

async function authMiddleware(req, res, next) {
=======
    CREATE TABLE IF NOT EXISTS stories (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER,
      content TEXT,
      media TEXT,
      created_at INTEGER,
      expires_at INTEGER,
      FOREIGN KEY(user_id) REFERENCES users(id)
    );
    CREATE TABLE IF NOT EXISTS polls (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      post_id INTEGER UNIQUE,
      question TEXT NOT NULL,
      created_at INTEGER,
      FOREIGN KEY(post_id) REFERENCES posts(id)
    );
    CREATE TABLE IF NOT EXISTS poll_options (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      poll_id INTEGER,
      text TEXT NOT NULL,
      sort_order INTEGER DEFAULT 0,
      FOREIGN KEY(poll_id) REFERENCES polls(id)
    );
    CREATE TABLE IF NOT EXISTS poll_votes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      poll_id INTEGER,
      option_id INTEGER,
      user_id INTEGER,
      UNIQUE(poll_id, user_id),
      FOREIGN KEY(poll_id) REFERENCES polls(id),
      FOREIGN KEY(option_id) REFERENCES poll_options(id),
      FOREIGN KEY(user_id) REFERENCES users(id)
    );
  `);
  async function ensureColumn(table, column, definition) {
    const columns = await db.all(`PRAGMA table_info(${table})`);
    const exists = Array.isArray(columns) && columns.some((c) => c && c.name === column);
    if (exists) return;
    await db.run(`ALTER TABLE ${table} ADD COLUMN ${definition}`);
  }

  try { await ensureColumn('users', 'avatar', "avatar TEXT DEFAULT '/default-avatar.png'"); } catch (e) {}
  try { await ensureColumn('users', 'bio', "bio TEXT DEFAULT ''"); } catch (e) {}
  try { await ensureColumn('users', 'recovery_token', 'recovery_token TEXT'); } catch (e) {}

  try { await ensureColumn('posts', 'image', 'image TEXT DEFAULT NULL'); } catch (e) {}
  try { await ensureColumn('posts', 'audio', 'audio TEXT DEFAULT NULL'); } catch (e) {}
  try { await ensureColumn('posts', 'video', 'video TEXT DEFAULT NULL'); } catch (e) {}
  try { await ensureColumn('posts', 'category', 'category TEXT DEFAULT NULL'); } catch (e) {}

  try { await ensureColumn('notifications', 'post_id', 'post_id INTEGER DEFAULT NULL'); } catch (e) {}
  try { await ensureColumn('notifications', 'message', 'message TEXT DEFAULT NULL'); } catch (e) {}

  try { await ensureColumn('messages', 'is_read', 'is_read INTEGER DEFAULT 0'); } catch (e) {}
  try { await ensureColumn('poll_options', 'sort_order', 'sort_order INTEGER DEFAULT 0'); } catch (e) {}

  try {
    await db.run("UPDATE users SET avatar = '/default-avatar.png' WHERE avatar IS NULL OR avatar LIKE 'https://ui-avatars.com/%'");
  } catch (e) { /* ignore */ }
  return db;
}

function uploadPathFromUrl(urlPath) {
  if (!urlPath) return null;
  return path.join(uploadDir, path.basename(urlPath));
}

function authMiddleware(req, res, next) {
>>>>>>> 43fc63577f740ec07265f99ac0d4769620c4ae8c
  const auth = req.headers.authorization;
  if (!auth) return res.status(401).json({ error: 'Missing auth' });
  const parts = auth.split(' ');
  if (parts.length !== 2 || parts[0] !== 'Bearer') return res.status(401).json({ error: 'Invalid auth header' });
  try {
    const payload = jwt.verify(parts[1], JWT_SECRET);
    req.user = payload;
<<<<<<< HEAD
    await touchUserPresence(payload.id);
=======
>>>>>>> 43fc63577f740ec07265f99ac0d4769620c4ae8c
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Invalid token' });
  }
}

<<<<<<< HEAD
function adminMiddleware(req, res, next) {
  if (req.user && req.user.username === 'blau3') return next();
  return res.status(403).json({ error: 'admin_only' });
}

(async () => {
  const db = await initDb();
  touchUserPresence = async (userId) => {
    if (!userId) return;
    await db.run('UPDATE users SET last_seen = ? WHERE id = ?', Date.now(), userId);
  };
  const app = express();
  app.use(helmet({
    imgSrc: ["'self'", 'data:', 'blob:']
  }));
  app.use(compression());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  const isProduction = process.env.NODE_ENV === 'production';
  app.use(express.static(path.join(__dirname, 'public'), {
    maxAge: isProduction ? '1d' : 0,
    etag: true,
    setHeaders(res, filePath) {
      const ext = path.extname(filePath).toLowerCase();
      if (ext === '.html') {
        res.setHeader('Cache-Control', 'no-cache, must-revalidate');
        return;
      }
      if (!isProduction && ['.css', '.js'].includes(ext)) {
        res.setHeader('Cache-Control', 'no-cache, must-revalidate');
      }
    }
  }));
  app.use('/uploads', express.static(uploadDir, { maxAge: '7d' }));

  // Ensure a "support" user exists for support inbox messages
  async function ensureSupportUser() {
    const existing = await db.get('SELECT id FROM users WHERE username = ?', 'support');
    if (existing && existing.id) return Number(existing.id);
    const hash = await bcrypt.hash('support-' + JWT_SECRET, 10);
    const avatar = DEFAULT_AVATAR_URL;
    const result = await db.run(
      'INSERT INTO users (username, password_hash, avatar, bio) VALUES (?, ?, ?, ?)',
      'support',
      hash,
      avatar,
      'Support'
    );
    return Number(result.lastID);
  }

  async function getUserIdByUsername(username) {
    const row = await db.get('SELECT id FROM users WHERE LOWER(username) = LOWER(?)', String(username || '').trim());
    return row && row.id ? Number(row.id) : null;
  }
=======
(async () => {
  const app = express();
  app.set('trust proxy', 1);
  app.use(helmet());
  app.use(compression());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(express.static(path.join(__dirname, 'public'), {
    maxAge: '1d',
    setHeaders: (res, path) => {
      if (path.endsWith('.html')) {
        res.setHeader('Cache-Control', 'no-cache');
        return;
      }
      if (path.endsWith('.js') || path.endsWith('.css')) {
        res.setHeader('Cache-Control', 'no-cache');
      }
    }
  }));
  app.use('/uploads', express.static(uploadDir, {
    maxAge: '7d'
  }));
>>>>>>> 43fc63577f740ec07265f99ac0d4769620c4ae8c

  function validatePassword(p) {
    if (p.length < 8) return { ok: false, error: 'password_min_length' };
    if (!/[A-Z]/.test(p)) return { ok: false, error: 'password_need_upper' };
    if (!/[a-z]/.test(p)) return { ok: false, error: 'password_need_lower' };
    if (!/[0-9]/.test(p)) return { ok: false, error: 'password_need_digit' };
    if (!/[^A-Za-z0-9]/.test(p)) return { ok: false, error: 'password_need_special' };
    return { ok: true };
  }

<<<<<<< HEAD
  function generateRecoveryCode() {
    const alphabet = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let code = '';
    for (let i = 0; i < 16; i++) {
      const idx = Math.floor(Math.random() * alphabet.length);
      code += alphabet[idx];
      if ((i + 1) % 4 === 0 && i !== 15) code += '-';
    }
    return code;
=======
  function generateRecoveryToken() {
    return crypto.randomBytes(16).toString('hex');
>>>>>>> 43fc63577f740ec07265f99ac0d4769620c4ae8c
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
<<<<<<< HEAD
    const recoveryCode = generateRecoveryCode();
    try {
      const now = Date.now();
      const result = await db.run(
        'INSERT INTO users (username, password_hash, avatar, recovery_code, last_seen) VALUES (?, ?, ?, ?, ?)',
        name,
        hash,
        DEFAULT_AVATAR_URL,
        recoveryCode,
        now
      );
      const id = result.lastID;
      const token = jwt.sign({ id, username: name }, JWT_SECRET);
      const user = await db.get('SELECT id, username, avatar, bio, background, badge, is_private FROM users WHERE id = ?', id);
      res.json({ token, recoveryCode, ...user });
=======
    const recoveryToken = generateRecoveryToken();
    try {
      const result = await db.run(
        'INSERT INTO users (username, password_hash, recovery_token) VALUES (?, ?, ?)',
        name,
        hash,
        recoveryToken
      );
      const id = result.lastID;
      const token = jwt.sign({ id, username: name }, JWT_SECRET);
      res.json({ token, username: name, id, recoveryToken });
>>>>>>> 43fc63577f740ec07265f99ac0d4769620c4ae8c
    } catch (err) {
      res.status(400).json({ error: 'username_taken' });
    }
  });

<<<<<<< HEAD
  app.post('/api/recover', async (req, res) => {
    const { username, code, password } = req.body || {};
    if (!username || !code || !password) {
      return res.status(400).json({ error: 'recovery_required' });
    }
    const pwCheck = validatePassword(password);
    if (!pwCheck.ok) return res.status(400).json({ error: pwCheck.error });
    const user = await db.get('SELECT * FROM users WHERE LOWER(username) = LOWER(?)', String(username).trim());
    if (!user || !user.recovery_code || String(user.recovery_code).trim() !== String(code).trim()) {
      return res.status(400).json({ error: 'recovery_invalid' });
    }
    const hash = await bcrypt.hash(password, 10);
    const newRecovery = generateRecoveryCode();
    await db.run('UPDATE users SET password_hash = ?, recovery_code = ?, last_seen = ? WHERE id = ?', hash, newRecovery, Date.now(), user.id);
    const fresh = await db.get('SELECT id, username, avatar, bio, background, badge, is_private FROM users WHERE id = ?', user.id);
    const token = jwt.sign({ id: fresh.id, username: fresh.username }, JWT_SECRET);
    res.json({ token, ...fresh });
=======
  app.post('/api/password-reset', async (req, res) => {
    try {
      const { username, recoveryToken, newPassword } = req.body || {};
      if (!username || !recoveryToken || !newPassword) {
        return res.status(400).json({ error: 'missing_fields' });
      }
      const user = await db.get('SELECT id, recovery_token FROM users WHERE LOWER(username) = LOWER(?)', username.trim());
      if (!user || !user.recovery_token || user.recovery_token !== recoveryToken) {
        return res.status(400).json({ error: 'invalid_recovery' });
      }
      const pwCheck = validatePassword(newPassword);
      if (!pwCheck.ok) return res.status(400).json({ error: pwCheck.error });
      const hash = await bcrypt.hash(newPassword, 10);
      const newToken = generateRecoveryToken();
      await db.run('UPDATE users SET password_hash = ?, recovery_token = $2 WHERE id = $3', hash, newToken, user.id);
      res.json({ success: true, recoveryToken: newToken });
    } catch (err) {
      console.error('Error in POST /api/password-reset:', err);
      res.status(500).json({ error: err.message });
    }
>>>>>>> 43fc63577f740ec07265f99ac0d4769620c4ae8c
  });

  app.post('/api/login', async (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) return res.status(400).json({ error: 'username and password required' });
    const user = await db.get('SELECT * FROM users WHERE LOWER(username) = LOWER(?)', username.trim());
    if (!user) return res.status(400).json({ error: 'invalid credentials' });
    const ok = await bcrypt.compare(password, user.password_hash);
    if (!ok) return res.status(400).json({ error: 'invalid credentials' });
<<<<<<< HEAD
    await touchUserPresence(user.id);
    const token = jwt.sign({ id: user.id, username: user.username }, JWT_SECRET);
    res.json({ token, username: user.username, id: user.id, avatar: user.avatar, bio: user.bio, background: user.background, badge: user.badge, is_private: user.is_private });
  });

  app.get('/api/posts', async (req, res) => {
    const userId = parseAuthUserId(req.headers.authorization);
    const rows = await db.all(`
      SELECT ${POST_SELECT_FIELDS}
      FROM posts p
      JOIN users u ON u.id = p.user_id
      LEFT JOIN channels c ON c.id = p.channel_id
      LEFT JOIN posts op ON op.id = p.repost_post_id
      LEFT JOIN channels oc ON oc.id = op.channel_id
      LEFT JOIN users ou ON ou.id = op.user_id
      WHERE p.channel_id IS NULL
      ORDER BY p.id DESC
    `);
    const posts = await filterVisiblePostRows(db, rows, userId);
    res.json(await buildRecommendedFeed(db, posts, userId));
=======
    const token = jwt.sign({ id: user.id, username: user.username }, JWT_SECRET);
    res.json({ token, username: user.username, id: user.id, avatar: user.avatar, bio: user.bio });
  });

  app.get('/api/posts', authMiddleware, async (req, res) => {
    const userId = req.user.id;
    let subscribedIds = [];
    if (userId) {
      const rows = await db.all('SELECT subscribed_to_id FROM subscriptions WHERE subscriber_id = ?', userId);
      subscribedIds = rows.map(r => r.subscribed_to_id);
    }
    const posts = await db.all(`
      SELECT p.id, p.content, p.image, p.audio, p.category, p.created_at, u.id as user_id, u.username, u.avatar
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
        userReactions = await db.all('SELECT type FROM reactions WHERE post_id = ? AND user_id = $2', p.id, userId);
      }

      const isSubscribedToAuthor = userId ? subscribedIds.includes(p.user_id) : false;
      const poll = await getPollForPost(p.id, userId);
      results.push({
        ...p,
        reactions: reactions.reduce((acc, r) => ({ ...acc, [r.type]: r.count }), {}),
        userReactions: userReactions.map(r => r.type),
        comments: comments.count,
        isSubscribedToAuthor,
        poll
      });
    }
    res.json(results);
>>>>>>> 43fc63577f740ec07265f99ac0d4769620c4ae8c
  });

  app.get('/api/posts/subscriptions', authMiddleware, async (req, res) => {
    const userId = req.user.id;
<<<<<<< HEAD
    const rows = await db.all(`
      SELECT ${POST_SELECT_FIELDS}
      FROM posts p
      JOIN users u ON u.id = p.user_id
      LEFT JOIN channels c ON c.id = p.channel_id
      LEFT JOIN posts op ON op.id = p.repost_post_id
      LEFT JOIN channels oc ON oc.id = op.channel_id
      LEFT JOIN users ou ON ou.id = op.user_id
      WHERE p.user_id IN (SELECT subscribed_to_id FROM subscriptions WHERE subscriber_id = ?)
        AND p.channel_id IS NULL
      ORDER BY p.id DESC
    `, userId);
    const posts = await filterVisiblePostRows(db, rows, userId);
    res.json(await buildRecommendedFeed(db, posts, userId));
  });

  app.get('/api/stories', async (req, res) => {
    const userId = parseAuthUserId(req.headers.authorization);
    const now = Date.now();
    const rows = await db.all(`
      SELECT s.id, s.user_id, s.media_type, s.media_url, s.created_at, s.expires_at,
             u.username, u.avatar, u.badge
      FROM stories s
      JOIN users u ON u.id = s.user_id
      WHERE s.expires_at > ?
      ORDER BY s.created_at DESC
    `, now);
    // For simplicity, return all active stories. In a real app, filter by friends/followers.
    res.json(rows);
  });

  app.post('/api/stories', authMiddleware, uploadPostImage.single('media'), async (req, res) => {
    const { media_type } = req.body;
    if (!req.file || !media_type) {
      return res.status(400).json({ error: 'Media file and type required' });
    }
    const media_url = '/uploads/' + req.file.filename;
    const created_at = Date.now();
    const expires_at = created_at + 24 * 60 * 60 * 1000; // 24 hours
    await db.run(`
      INSERT INTO stories (user_id, media_type, media_url, created_at, expires_at)
      VALUES (?, ?, ?, ?, ?)
    `, req.user.id, media_type, media_url, created_at, expires_at);
    res.json({ success: true });
  });

  // Get story comments
  app.get('/api/stories/:id/comments', authMiddleware, async (req, res) => {
    const storyId = req.params.id;
    const comments = await db.all(`
      SELECT sc.id, sc.story_id, sc.user_id, sc.parent_id, sc.content, sc.created_at,
             u.username, u.avatar,
             (SELECT COUNT(*) FROM story_comment_likes WHERE comment_id = sc.id) as likes_count,
             EXISTS(SELECT 1 FROM story_comment_likes WHERE comment_id = sc.id AND user_id = ?) as liked,
             pu.username as parent_username
      FROM story_comments sc
      JOIN users u ON u.id = sc.user_id
      LEFT JOIN users pu ON pu.id = (SELECT user_id FROM story_comments WHERE id = sc.parent_id)
      WHERE sc.story_id = ?
      ORDER BY sc.created_at ASC
    `, req.user.id, storyId);
    res.json(comments);
  });

  // Story comments
  app.post('/api/stories/:id/comments', authMiddleware, async (req, res) => {
    const storyId = req.params.id;
    const { content, parent_id } = req.body;
    if (!content?.trim()) {
      return res.status(400).json({ error: 'Content required' });
    }
    const story = await db.get('SELECT id, user_id FROM stories WHERE id = ?', storyId);
    if (!story) {
      return res.status(404).json({ error: 'Story not found' });
    }
    
    let parentComment = null;
    if (parent_id) {
      parentComment = await db.get('SELECT id, user_id FROM story_comments WHERE id = ?', parent_id);
    }
    
    const commentId = await db.run('INSERT INTO story_comments (story_id, user_id, parent_id, content, created_at) VALUES (?, ?, ?, ?, ?)', 
      storyId, req.user.id, parent_id || null, content.trim(), Date.now());
    
    const lastId = await db.get('SELECT last_insert_rowid() as id');
    
    // Create notification for story owner
    if (story.user_id !== req.user.id) {
      await db.run('INSERT INTO notifications (user_id, from_user_id, type, content) VALUES (?, ?, ?, ?)',
        story.user_id, req.user.id, 'story_comment', ` replied: "${content.trim()}"`);
    }
    
    // Create notification for parent comment owner (reply notification)
    if (parentComment && parentComment.user_id !== req.user.id && parentComment.user_id !== story.user_id) {
      await db.run('INSERT INTO notifications (user_id, from_user_id, type, content) VALUES (?, ?, ?, ?)',
        parentComment.user_id, req.user.id, 'comment_reply', ` replied to your comment: "${content.trim()}"`);
    }
    
    res.json({ success: true, comment_id: lastId.id });
  });

  // Like story
  app.post('/api/stories/:storyId/like', authMiddleware, async (req, res) => {
    const { storyId } = req.params;
    const story = await db.get('SELECT id, user_id FROM stories WHERE id = ?', storyId);
    if (!story) {
      return res.status(404).json({ error: 'Story not found' });
    }
    const existing = await db.get('SELECT id FROM story_likes WHERE story_id = ? AND user_id = ?', storyId, req.user.id);
    if (existing) {
      await db.run('DELETE FROM story_likes WHERE story_id = ? AND user_id = ?', storyId, req.user.id);
    } else {
      await db.run('INSERT INTO story_likes (story_id, user_id, created_at) VALUES (?, ?, ?)', storyId, req.user.id, Date.now());
      if (story.user_id !== req.user.id) {
        await db.run('INSERT INTO notifications (user_id, from_user_id, type, content) VALUES (?, ?, ?, ?)',
          story.user_id, req.user.id, 'story_like', `${req.user.username} лайкнул твою историю`);
      }
    }
    res.json({ success: true });
  });

  // Like story comment
  app.post('/api/stories/:storyId/comments/:commentId/like', authMiddleware, async (req, res) => {
    const { commentId } = req.params;
    const existing = await db.get('SELECT id FROM story_comment_likes WHERE comment_id = ? AND user_id = ?', commentId, req.user.id);
    if (existing) {
      await db.run('DELETE FROM story_comment_likes WHERE comment_id = ? AND user_id = ?', commentId, req.user.id);
    } else {
      await db.run('INSERT INTO story_comment_likes (comment_id, user_id) VALUES (?, ?)', commentId, req.user.id);
      const comment = await db.get('SELECT sc.id, sc.user_id, sc.content, s.user_id as story_owner FROM story_comments sc JOIN stories s ON s.id = sc.story_id WHERE sc.id = ?', commentId);
      if (comment && comment.user_id !== req.user.id) {
        await db.run('INSERT INTO notifications (user_id, from_user_id, type, content) VALUES (?, ?, ?, ?)',
          comment.user_id, req.user.id, 'comment_like', `${req.user.username} лайкнул твой комментарий`);
      }
    }
    res.json({ success: true });
  });

  app.get('/api/channels', async (req, res) => {
    const channels = await db.all(`
      SELECT c.id, c.name, c.user_id, c.created_at,
             u.username, u.avatar, u.badge,
             COUNT(p.id) AS posts_count
      FROM channels c
      JOIN users u ON u.id = c.user_id
      LEFT JOIN posts p ON p.channel_id = c.id
      GROUP BY c.id
      ORDER BY c.created_at DESC, c.id DESC
    `);
    res.json(channels.map(row => ({
      id: Number(row.id),
      name: String(row.name || ''),
      user_id: Number(row.user_id),
      username: String(row.username || ''),
      avatar: row.avatar || '',
      badge: row.badge || null,
      created_at: Number(row.created_at || 0),
      posts_count: Number(row.posts_count || 0)
    })));
  });

  app.post('/api/channels', authMiddleware, async (req, res) => {
    try {
      const name = String((req.body && req.body.name) || '').trim();
      if (!name) {
        return res.status(400).json({ error: 'channel_name_required' });
      }
      const createdAt = Date.now();
      const result = await db.run(
        'INSERT INTO channels (user_id, name, created_at) VALUES (?, ?, ?)',
        req.user.id,
        name,
        createdAt
      );
      const channel = await db.get(`
        SELECT c.id, c.name, c.user_id, c.created_at, u.username, u.avatar, u.badge
        FROM channels c
        JOIN users u ON u.id = c.user_id
        WHERE c.id = ?
      `, result.lastID);
      res.json({
        id: Number(channel.id),
        name: String(channel.name || ''),
        user_id: Number(channel.user_id),
        username: String(channel.username || ''),
        avatar: channel.avatar || '',
        badge: channel.badge || null,
        created_at: Number(channel.created_at || 0),
        posts_count: 0
      });
    } catch (err) {
      console.error('Error in POST /api/channels:', err);
      res.status(500).json({ error: err.message });
    }
  });

  app.post('/api/channels/search', async (req, res) => {
    try {
      const query = String((req.body && req.body.query) || '').trim();
      const lang = req.body && req.body.lang === 'en' ? 'en' : 'ru';
      if (!query) {
        return res.status(400).json({ error: 'query required' });
      }
      const normalizedQuery = normalizeSearchText(query);
      const tokens = tokenizeSearchQuery(query);
      const channels = await db.all(`
        SELECT c.id, c.name, c.user_id, c.created_at,
               u.username, u.avatar, u.badge,
               COUNT(p.id) AS posts_count
        FROM channels c
        JOIN users u ON u.id = c.user_id
        LEFT JOIN posts p ON p.channel_id = c.id
        GROUP BY c.id
        ORDER BY c.created_at DESC, c.id DESC
      `);
      const results = channels
        .map(channel => {
          const normalizedName = normalizeSearchText(channel.name);
          let score = 0;
          if (normalizedName.includes(normalizedQuery)) score += 5;
          tokens.forEach(token => {
            if (normalizedName.includes(token)) score += 2;
          });
          if (!score) return null;
          return {
            id: Number(channel.id),
            name: String(channel.name || ''),
            user_id: Number(channel.user_id),
            username: String(channel.username || ''),
            avatar: channel.avatar || '',
            badge: channel.badge || null,
            posts_count: Number(channel.posts_count || 0),
            created_at: Number(channel.created_at || 0),
            score
          };
        })
        .filter(Boolean)
        .sort((a, b) => b.score - a.score || b.posts_count - a.posts_count || b.created_at - a.created_at)
        .slice(0, 8);

      const summary = results.length
        ? (lang === 'en'
          ? `Found ${results.length} channel${results.length === 1 ? '' : 's'} matching "${query}".`
          : `Найдено каналов по запросу "${query}": ${results.length}.`)
        : (lang === 'en'
          ? `No channels were found for "${query}".`
          : `По запросу "${query}" каналы не найдены.`);

      res.json({
        summary,
        results: results.map(channel => ({
          id: channel.id,
          name: channel.name,
          userId: channel.user_id,
          username: channel.username,
          postsCount: channel.posts_count,
          snippet: lang === 'en'
            ? `Owner: ${channel.username}. Posts: ${channel.posts_count}.`
            : `Автор: ${channel.username}. Постов: ${channel.posts_count}.`,
          reason: lang === 'en'
            ? 'Matched by channel title.'
            : 'Совпадение по названию канала.'
        }))
      });
    } catch (err) {
      console.error('Error in POST /api/channels/search:', err);
      res.status(500).json({ error: 'channel_search_failed' });
    }
  });

  app.get('/api/channels/:id/posts', async (req, res) => {
    try {
      const channelId = Number(req.params.id);
      if (!Number.isFinite(channelId)) {
        return res.status(400).json({ error: 'invalid_channel_id' });
      }
      const channel = await db.get(`
        SELECT c.id, c.name, c.user_id, c.created_at, u.username, u.avatar, u.badge
        FROM channels c
        JOIN users u ON u.id = c.user_id
        WHERE c.id = ?
      `, channelId);
      if (!channel) {
        return res.status(404).json({ error: 'channel_not_found' });
      }
      const userId = parseAuthUserId(req.headers.authorization);
      const rows = await db.all(`
        SELECT ${POST_SELECT_FIELDS}
        FROM posts p
        JOIN users u ON u.id = p.user_id
        LEFT JOIN channels c ON c.id = p.channel_id
        LEFT JOIN posts op ON op.id = p.repost_post_id
        LEFT JOIN channels oc ON oc.id = op.channel_id
        LEFT JOIN users ou ON ou.id = op.user_id
        WHERE p.channel_id = ?
        ORDER BY p.id DESC
      `, channelId);
      const posts = await filterVisiblePostRows(db, rows, userId);
      res.json({
        channel: {
          id: Number(channel.id),
          name: String(channel.name || ''),
          user_id: Number(channel.user_id),
          username: String(channel.username || ''),
          avatar: channel.avatar || '',
          badge: channel.badge || null,
          created_at: Number(channel.created_at || 0)
        },
        posts: await hydratePostRows(db, posts, userId)
      });
    } catch (err) {
      console.error('Error in GET /api/channels/:id/posts:', err);
      res.status(500).json({ error: err.message });
    }
  });

  app.get('/api/site-news', async (req, res) => {
    const news = await db.all(`
      SELECT n.id, n.content, n.created_at,
             u.id AS user_id, u.username, u.avatar, u.badge
      FROM site_news n
      JOIN users u ON u.id = n.user_id
      ORDER BY n.created_at DESC, n.id DESC
    `);
    res.json(news.map(item => ({
      id: Number(item.id),
      content: String(item.content || ''),
      created_at: Number(item.created_at || 0),
      user_id: Number(item.user_id),
      username: String(item.username || ''),
      avatar: item.avatar || '',
      badge: item.badge || null
    })));
  });

  app.post('/api/site-news', authMiddleware, adminMiddleware, async (req, res) => {
    try {
      const content = String((req.body && req.body.content) || '').trim();
      if (!content) {
        return res.status(400).json({ error: 'content required' });
      }
      const createdAt = Date.now();
      const result = await db.run(
        'INSERT INTO site_news (user_id, content, created_at) VALUES (?, ?, ?)',
        req.user.id,
        content,
        createdAt
      );
      const created = await db.get(`
        SELECT n.id, n.content, n.created_at,
               u.id AS user_id, u.username, u.avatar, u.badge
        FROM site_news n
        JOIN users u ON u.id = n.user_id
        WHERE n.id = ?
      `, result.lastID);
      res.json({
        id: Number(created.id),
        content: String(created.content || ''),
        created_at: Number(created.created_at || 0),
        user_id: Number(created.user_id),
        username: String(created.username || ''),
        avatar: created.avatar || '',
        badge: created.badge || null
      });
    } catch (err) {
      console.error('Error in POST /api/site-news:', err);
      res.status(500).json({ error: err.message });
    }
  });

  app.post('/api/site-search', async (req, res) => {
    const query = String((req.body && req.body.query) || '').trim();
    const lang = req.body && req.body.lang === 'en' ? 'en' : 'ru';
    const viewerId = parseAuthUserId(req.headers.authorization);
    if (!query) {
      return res.status(400).json({ error: 'query required' });
    }
    if (!MISTRAL_API_KEY) {
      return res.status(503).json({ error: 'MISTRAL_API_KEY is not configured on the server' });
    }

    try {
      const entries = await buildSiteSearchEntries(db, viewerId);
      const normalizedQuery = normalizeSearchText(query);
      const tokens = tokenizeSearchQuery(query);
      const ranked = entries
        .map(entry => ({ ...entry, score: scoreSearchEntry(entry, normalizedQuery, tokens) }))
        .filter(entry => entry.score > 0)
        .sort((a, b) => b.score - a.score)
        .slice(0, 8);

      if (!ranked.length) {
        return res.json({
          summary: lang === 'en'
            ? `No matches were found on the site for "${query}".`
            : `По запросу "${query}" совпадений на сайте пока не найдено.`,
          results: []
        });
      }

      const context = ranked.map((entry, index) => ({
        rank: index + 1,
        type: entry.type,
        id: entry.id,
        userId: entry.userId,
        username: entry.username,
        title: entry.title,
        snippet: entry.snippet
      }));

      const mistralResponse = await fetch(MISTRAL_CHAT_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${MISTRAL_API_KEY}`
        },
        body: JSON.stringify({
          model: MISTRAL_MODEL,
          temperature: 0.2,
          response_format: { type: 'json_object' },
          messages: [
            {
              role: 'system',
              content: [
                'You are an on-site search assistant for a small social website.',
                'Use only the provided website data.',
                'Return valid JSON with shape:',
                '{"summary":"short answer","results":[{"type":"post|user","id":1,"userId":1,"username":"name","title":"...", "snippet":"...", "reason":"why this matches"}]}',
                'Keep summary under 220 characters.',
                'Return at most 6 results.',
                `Answer in ${lang === 'en' ? 'English' : 'Russian'}.`
              ].join(' ')
            },
            {
              role: 'user',
              content: JSON.stringify({
                query,
                website_results: context
              })
            }
          ]
        })
      });

      if (!mistralResponse.ok) {
        const errorText = await mistralResponse.text();
        console.error('Mistral site search failed:', mistralResponse.status, errorText);
        return res.json(buildFallbackSearchPayload(ranked, query, lang));
      }

      const payload = await mistralResponse.json();
      const parsed = parseJsonContent(payload && payload.choices && payload.choices[0] && payload.choices[0].message && payload.choices[0].message.content);
      const fallback = buildFallbackSearchPayload(ranked, query, lang);
      if (!parsed || typeof parsed !== 'object') {
        return res.json(fallback);
      }

      const safeResults = Array.isArray(parsed.results) ? parsed.results : [];
      const rankedByKey = new Map(ranked.map(entry => [`${entry.type}:${entry.id}`, entry]));
      const hydratedResults = safeResults
        .map(result => {
          const type = result && result.type === 'user' ? 'user' : 'post';
          const id = Number(result && result.id);
          const candidate = rankedByKey.get(`${type}:${id}`);
          if (!candidate) return null;
          return {
            type,
            id: candidate.id,
            userId: candidate.userId,
            username: candidate.username,
            title: String(result.title || candidate.title),
            snippet: String(result.snippet || candidate.snippet),
            reason: String(result.reason || '')
          };
        })
        .filter(Boolean)
        .slice(0, 6);

      res.json({
        summary: String(parsed.summary || fallback.summary),
        results: hydratedResults.length ? hydratedResults : fallback.results
      });
    } catch (err) {
      console.error('Error in POST /api/site-search:', err);
      res.status(500).json({ error: 'site_search_failed' });
    }
  });

  app.post('/api/ai/generate', authMiddleware, async (req, res) => {
    const { prompt, style } = req.body || {};
    const text = String(prompt || '').trim();
    if (!text) {
      return res.status(400).json({ error: 'prompt required' });
    }
    if (!MISTRAL_API_KEY) {
      return res.status(503).json({ error: 'MISTRAL_API_KEY is not configured' });
    }

    const styles = {
      angry: {
        ru: 'перепиши текст: ' + text + ' в агрессивном стиле',
        en: 'rewrite the text: ' + text + ' in an aggressive style'
      },
      polite: {
        ru: 'перепиши текст: ' + text + ' в культурном вежливом стиле',
        en: 'rewrite the text: ' + text + ' in a polite and cultured style'
      },
      unusual: {
        ru: 'перепиши текст: ' + text + ' в необычном креативном стиле',
        en: 'rewrite the text: ' + text + ' in an unusual creative style'
      }
    };

    const lang = req.body && req.body.lang === 'en' ? 'en' : 'ru';
    const styleKey = style && styles[style] ? style : 'unusual';
    const finalPrompt = styles[styleKey][lang];

    try {
      const mistralResponse = await fetch(MISTRAL_CHAT_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${MISTRAL_API_KEY}`
        },
        body: JSON.stringify({
          model: MISTRAL_MODEL,
          temperature: 0.8,
          messages: [
            {
              role: 'system',
              content: lang === 'en'
                ? 'You are a creative text rewriting assistant. Rewrite the user text in the requested style. Return only the rewritten text, nothing else.'
                : 'Ты креативный ассистент по переписыванию текста. Перепиши текст пользователя в запрошенном стиле. Верни только переписанный текст, ничего больше.'
            },
            {
              role: 'user',
              content: finalPrompt
            }
          ]
        })
      });

      if (!mistralResponse.ok) {
        const errorText = await mistralResponse.text();
        console.error('Mistral generate failed:', mistralResponse.status, errorText);
        return res.status(500).json({ error: 'generation_failed' });
      }

      const payload = await mistralResponse.json();
      const content = payload && payload.choices && payload.choices[0] && payload.choices[0].message && payload.choices[0].message.content;
      res.json({ result: content || '' });
    } catch (err) {
      console.error('Error in POST /api/ai/generate:', err);
      res.status(500).json({ error: 'generation_failed' });
    }
  });

  app.post('/api/posts', authMiddleware, async (req, res) => {
    try {
      const { content, channelId } = req.body;
      if (!content || content.trim() === '') {
        return res.status(400).json({ error: 'content required' });
      }
      let safeChannelId = null;
      if (channelId !== undefined && channelId !== null && channelId !== '') {
        safeChannelId = Number(channelId);
        if (!Number.isFinite(safeChannelId)) {
          return res.status(400).json({ error: 'invalid_channel_id' });
        }
        const channel = await db.get('SELECT id, user_id FROM channels WHERE id = ?', safeChannelId);
        if (!channel) return res.status(404).json({ error: 'channel_not_found' });
        if (Number(channel.user_id) !== Number(req.user.id)) {
          return res.status(403).json({ error: 'channel_owner_only' });
        }
      }
      const created_at = Date.now();
      const result = await db.run('INSERT INTO posts (user_id, content, image, audio, video, channel_id, repost_post_id, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)', req.user.id, content, null, null, null, safeChannelId, null, created_at);
      await notifySubscribersAboutPost(db, req.user.id, result.lastID, created_at);
      const post = await getPostRowById(db, result.lastID);
      res.json(mapPostRow(post));
=======
    const posts = await db.all(`
      SELECT p.id, p.content, p.image, p.audio, p.category, p.created_at, u.id as user_id, u.username, u.avatar
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
      const poll = null;
      results.push({
        ...p,
        reactions: reactions.reduce((acc, r) => ({ ...acc, [r.type]: r.count }), {}),
        userReactions: userReactions.map(r => r.type),
        comments: comments.count,
        isSubscribedToAuthor: true,
        poll
      });
    }
    res.json(results);
  });

  app.get('/api/posts/:id/full', async (req, res) => {
    const postId = parseInt(req.params.id, 10);
    if (!postId) return res.status(400).json({ error: 'invalid id' });

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

    const p = await db.get(`
      SELECT p.id, p.content, p.image, p.audio, p.category, p.created_at,
             u.id as user_id, u.username, u.avatar
      FROM posts p
      JOIN users u ON u.id = p.user_id
      WHERE p.id = ?
    `, postId);
    if (!p) return res.status(404).json({ error: 'post not found' });

    const reactions = await db.all('SELECT type, COUNT(*) as count FROM reactions WHERE post_id = ? GROUP BY type', p.id);
    const comments = await db.get('SELECT COUNT(*) as count FROM comments WHERE post_id = ?', p.id);
    let userReactions = [];
    let isSubscribedToAuthor = false;
    if (userId) {
      userReactions = await db.all('SELECT type FROM reactions WHERE post_id = ? AND user_id = $2', p.id, userId);
      const sub = await db.get(
        'SELECT 1 FROM subscriptions WHERE subscriber_id = ? AND subscribed_to_id = $2',
        userId,
        p.user_id
      );
      isSubscribedToAuthor = !!sub;
    }
    const poll = await getPollForPost(p.id, userId);

    res.json({
      ...p,
      reactions: reactions.reduce((acc, r) => ({ ...acc, [r.type]: r.count }), {}),
      userReactions: userReactions.map(r => r.type),
      comments: comments.count,
      isSubscribedToAuthor,
      poll
    });
  });

  async function savePollForPost(postId, pollData, created_at) {
    if (!pollData || !pollData.question || !Array.isArray(pollData.options) || pollData.options.length < 2) return;
    const pollResult = await db.run(
      'INSERT INTO polls (post_id, question, created_at) VALUES (?, ?, ?)',
      postId, pollData.question.trim(), created_at
    );
    const pollId = pollResult.lastID;
    for (let i = 0; i < pollData.options.length; i++) {
      const opt = pollData.options[i];
      if (opt && opt.trim()) {
        await db.run('INSERT INTO poll_options (poll_id, text, sort_order) VALUES (?, ?, ?)', pollId, opt.trim(), i);
      }
    }
  }

  async function getPollForPost(postId, userId) {
    const poll = await db.get('SELECT id, question FROM polls WHERE post_id = ?', postId);
    if (!poll) return null;
    const options = await db.all(
      'SELECT po.id, po.text, COUNT(pv.id) as votes FROM poll_options po LEFT JOIN poll_votes pv ON pv.option_id = po.id WHERE po.poll_id = ? GROUP BY po.id ORDER BY po.sort_order',
      poll.id
    );
    let userVote = null;
    if (userId) {
      const vote = await db.get('SELECT option_id FROM poll_votes WHERE poll_id = ? AND user_id = ?', poll.id, userId);
      if (vote) userVote = vote.option_id;
    }
    return { id: poll.id, question: poll.question, options, userVote };
  }

  app.post('/api/posts', authMiddleware, async (req, res) => {
    try {
      const { content, category, poll } = req.body;
      if (!content || content.trim() === '') {
        return res.status(400).json({ error: 'content required' });
      }
      const created_at = Date.now();
      const result = await db.run('INSERT INTO posts (user_id, content, image, audio, category, created_at) VALUES (?, ?, ?, ?, ?, ?)', req.user.id, content, null, null, category || null, created_at);
      const postId = result.lastID;

      if (poll) {
        const pollData = typeof poll === 'string' ? JSON.parse(poll) : poll;
        await savePollForPost(postId, pollData, created_at);
      }

      const post = await db.get('SELECT p.id, p.content, p.image, p.audio, p.category, p.created_at, u.id as user_id, u.username, u.avatar FROM posts p JOIN users u ON u.id = p.user_id WHERE p.id = ?', postId);
      
      // Notify all subscribers
      const subscribers = await db.all('SELECT subscriber_id FROM subscriptions WHERE subscribed_to_id = ?', req.user.id);
      for (const sub of subscribers) {
        await db.run('INSERT INTO notifications (user_id, type, from_user_id, post_id, created_at) VALUES (?, ?, ?, ?, ?)', sub.subscriber_id, 'new_post', req.user.id, postId, created_at);
      }
      
      console.log('Post created successfully');
      res.json(post);
>>>>>>> 43fc63577f740ec07265f99ac0d4769620c4ae8c
    } catch (err) {
      console.error('Error in POST /api/posts:', err);
      res.status(500).json({ error: err.message });
    }
  });

  app.post('/api/posts/with-image', authMiddleware, uploadPostImage.single('image'), async (req, res) => {
    try {
<<<<<<< HEAD
      const { content, channelId } = req.body;
      if (!content && !req.file) {
        return res.status(400).json({ error: 'content or image required' });
      }
      let safeChannelId = null;
      if (channelId !== undefined && channelId !== null && channelId !== '') {
        safeChannelId = Number(channelId);
        if (!Number.isFinite(safeChannelId)) {
          return res.status(400).json({ error: 'invalid_channel_id' });
        }
        const channel = await db.get('SELECT id, user_id FROM channels WHERE id = ?', safeChannelId);
        if (!channel) return res.status(404).json({ error: 'channel_not_found' });
        if (Number(channel.user_id) !== Number(req.user.id)) {
          return res.status(403).json({ error: 'channel_owner_only' });
        }
      }
      const created_at = Date.now();
      const imageUrl = req.file ? '/uploads/' + req.file.filename : null;
      const result = await db.run('INSERT INTO posts (user_id, content, image, audio, video, channel_id, repost_post_id, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)', req.user.id, content || '', imageUrl, null, null, safeChannelId, null, created_at);
      await notifySubscribersAboutPost(db, req.user.id, result.lastID, created_at);
      const post = await getPostRowById(db, result.lastID);
      res.json(mapPostRow(post));
=======
      const { content, category, poll } = req.body;
      if (!content && !req.file) {
        return res.status(400).json({ error: 'content or image required' });
      }
      const created_at = Date.now();
      const imageUrl = req.file ? '/uploads/' + req.file.filename : null;
      const result = await db.run('INSERT INTO posts (user_id, content, image, audio, category, created_at) VALUES (?, ?, ?, ?, ?, ?)', req.user.id, content || '', imageUrl, null, category || null, created_at);
      const postId = result.lastID;

      if (poll) {
        const pollData = typeof poll === 'string' ? JSON.parse(poll) : poll;
        await savePollForPost(postId, pollData, created_at);
      }

      const post = await db.get('SELECT p.id, p.content, p.image, p.audio, p.category, p.created_at, u.id as user_id, u.username, u.avatar FROM posts p JOIN users u ON u.id = p.user_id WHERE p.id = ?', postId);
      
      const subscribers = await db.all('SELECT subscriber_id FROM subscriptions WHERE subscribed_to_id = ?', req.user.id);
      for (const sub of subscribers) {
        await db.run('INSERT INTO notifications (user_id, type, from_user_id, post_id, created_at) VALUES (?, ?, ?, ?, ?)', sub.subscriber_id, 'new_post', req.user.id, postId, created_at);
      }
      
      res.json(post);
>>>>>>> 43fc63577f740ec07265f99ac0d4769620c4ae8c
    } catch (err) {
      console.error('Error in POST /api/posts/with-image:', err);
      res.status(500).json({ error: err.message });
    }
  });

  app.post('/api/posts/with-media', authMiddleware, uploadPostMedia, async (req, res) => {
    try {
<<<<<<< HEAD
      const { content, channelId } = req.body || {};
      const imageFiles = (req.files && req.files.image) ? (Array.isArray(req.files.image) ? req.files.image : [req.files.image]) : [];
      const audioFile = req.files && req.files.audio && req.files.audio[0];
      const videoFiles = (req.files && req.files.video) ? (Array.isArray(req.files.video) ? req.files.video : [req.files.video]) : [];
      if (!content && imageFiles.length === 0 && !audioFile && videoFiles.length === 0) {
        return res.status(400).json({ error: 'content, image, audio or video required' });
      }
      let safeChannelId = null;
      if (channelId !== undefined && channelId !== null && channelId !== '') {
        safeChannelId = Number(channelId);
        if (!Number.isFinite(safeChannelId)) {
          return res.status(400).json({ error: 'invalid_channel_id' });
        }
        const channel = await db.get('SELECT id, user_id FROM channels WHERE id = ?', safeChannelId);
        if (!channel) return res.status(404).json({ error: 'channel_not_found' });
        if (Number(channel.user_id) !== Number(req.user.id)) {
          return res.status(403).json({ error: 'channel_owner_only' });
        }
      }
      const created_at = Date.now();
      const imageUrls = imageFiles.map(f => '/uploads/' + f.filename);
      const videoUrls = videoFiles.map(f => '/uploads/' + f.filename);
      const singleImage = imageUrls.length ? imageUrls[0] : null;
      const singleVideo = videoUrls.length ? videoUrls[0] : null;
      const audioUrl = audioFile ? '/uploads/' + audioFile.filename : null;
      const imagesJson = imageUrls.length ? JSON.stringify(imageUrls) : null;
      const videosJson = videoUrls.length ? JSON.stringify(videoUrls) : null;
      const result = await db.run('INSERT INTO posts (user_id, content, image, audio, video, images, videos, channel_id, repost_post_id, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', req.user.id, content || '', singleImage, audioUrl, singleVideo, imagesJson, videosJson, safeChannelId, null, created_at);
      await notifySubscribersAboutPost(db, req.user.id, result.lastID, created_at);
      const row = await getPostRowById(db, result.lastID);
      const post = mapPostRow(row);
      post.images = imageUrls;
      post.videos = videoUrls;
=======
      const { content, category, poll } = req.body || {};
      const imageFile = req.files && req.files.image && req.files.image[0];
      const audioFile = req.files && req.files.audio && req.files.audio[0];
      const videoFile = req.files && req.files.video && req.files.video[0];
      if (!content && !imageFile && !audioFile && !videoFile) {
        return res.status(400).json({ error: 'content, image, audio or video required' });
      }
      const created_at = Date.now();
      const imageUrl = imageFile ? '/uploads/' + imageFile.filename : null;
      const audioUrl = audioFile ? '/uploads/' + audioFile.filename : null;
      const result = await db.run('INSERT INTO posts (user_id, content, image, audio, category, created_at) VALUES (?, ?, ?, ?, ?, ?)', req.user.id, content || '', imageUrl, audioUrl, category || null, created_at);
      const postId = result.lastID;

      if (poll) {
        const pollData = typeof poll === 'string' ? JSON.parse(poll) : poll;
        await savePollForPost(postId, pollData, created_at);
      }

      const post = await db.get('SELECT p.id, p.content, p.image, p.audio, p.category, p.created_at, u.id as user_id, u.username, u.avatar FROM posts p JOIN users u ON u.id = p.user_id WHERE p.id = ?', postId);
      
      const subscribers = await db.all('SELECT subscriber_id FROM subscriptions WHERE subscribed_to_id = ?', req.user.id);
      for (const sub of subscribers) {
        await db.run('INSERT INTO notifications (user_id, type, from_user_id, post_id, created_at) VALUES (?, ?, ?, ?, ?)', sub.subscriber_id, 'new_post', req.user.id, postId, created_at);
      }
      
>>>>>>> 43fc63577f740ec07265f99ac0d4769620c4ae8c
      res.json(post);
    } catch (err) {
      console.error('Error in POST /api/posts/with-media:', err);
      res.status(500).json({ error: err.message });
    }
  });

<<<<<<< HEAD
  // Update post content (owner only, without changing media)
  app.put('/api/posts/:id', authMiddleware, async (req, res) => {
    const postId = req.params.id;
    const { content } = req.body || {};
    if (!content || String(content).trim() === '') {
      return res.status(400).json({ error: 'content required' });
    }
    try {
      const post = await db.get('SELECT id, user_id FROM posts WHERE id = ?', postId);
      if (!post) {
        return res.status(404).json({ error: 'Post not found' });
      }
      if (Number(post.user_id) !== Number(req.user.id)) {
        return res.status(403).json({ error: 'You can only edit your own posts' });
      }
      await db.run('UPDATE posts SET content = ? WHERE id = ?', String(content), postId);
      const updated = await getPostRowById(db, postId);
      res.json(mapPostRow(updated));
    } catch (err) {
      console.error('Error in PUT /api/posts/:id:', err);
      res.status(500).json({ error: err.message });
    }
  });

  app.post('/api/posts/:id/repost', authMiddleware, async (req, res) => {
    const postId = req.params.id;
    try {
      const source = await db.get('SELECT id, user_id, repost_post_id FROM posts WHERE id = ?', postId);
      if (!source) {
        return res.status(404).json({ error: 'Post not found' });
      }
      const sourceRow = await getPostRowById(db, postId);
      if (!(await canAccessPostRow(db, sourceRow, req.user.id, new Map()))) {
        return res.status(403).json({ error: 'profile_private' });
      }
      const originalPostId = source.repost_post_id ? Number(source.repost_post_id) : Number(source.id);
      const existing = await db.get('SELECT id FROM posts WHERE user_id = ? AND repost_post_id = ?', req.user.id, originalPostId);
      if (existing) {
        return res.status(400).json({ error: 'already_reposted' });
      }
      const createdAt = Date.now();
      const result = await db.run(
        'INSERT INTO posts (user_id, content, image, audio, video, images, videos, repost_post_id, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
        req.user.id,
        '',
        null,
        null,
        null,
        null,
        null,
        originalPostId,
        createdAt
      );
      await notifySubscribersAboutPost(db, req.user.id, result.lastID, createdAt);
      const created = await getPostRowById(db, result.lastID);
      res.json(mapPostRow(created));
    } catch (err) {
      console.error('Error in POST /api/posts/:id/repost:', err);
      res.status(500).json({ error: err.message });
    }
  });

=======
>>>>>>> 43fc63577f740ec07265f99ac0d4769620c4ae8c
  app.post('/api/posts/:id/reaction', authMiddleware, async (req, res) => {
    const postId = req.params.id;
    const { type } = req.body;
    if (!type) return res.status(400).json({ error: 'type required' });
    try {
<<<<<<< HEAD
      const sourceRow = await getPostRowById(db, postId);
      if (!sourceRow) return res.status(404).json({ error: 'Post not found' });
      if (!(await canAccessPostRow(db, sourceRow, req.user.id, new Map()))) {
        return res.status(403).json({ error: 'profile_private' });
      }
      await db.run('INSERT INTO reactions (post_id, user_id, type) VALUES (?, ?, ?)', postId, req.user.id, type);
    } catch (err) {
      // If unique constraint conflict (already reacted with same type), remove it (toggle)
      await db.run('DELETE FROM reactions WHERE post_id = ? AND user_id = ? AND type = ?', postId, req.user.id, type);
=======
      await db.run('INSERT INTO reactions (post_id, user_id, type) VALUES (?, $2, $3)', postId, req.user.id, type);
    } catch (err) {
      // If unique constraint conflict (already reacted with same type), remove it (toggle)
      await db.run('DELETE FROM reactions WHERE post_id = ? AND user_id = $2 AND type = $3', postId, req.user.id, type);
>>>>>>> 43fc63577f740ec07265f99ac0d4769620c4ae8c
    }
    const reactions = await db.all('SELECT type, COUNT(*) as count FROM reactions WHERE post_id = ? GROUP BY type', postId);
    res.json({ reactions: reactions.reduce((acc, r) => ({ ...acc, [r.type]: r.count }), {}) });
  });

<<<<<<< HEAD
  app.get('/api/posts/:id/comments', async (req, res) => {
    const postId = req.params.id;
    const viewerId = parseAuthUserId(req.headers.authorization);
    const sourceRow = await getPostRowById(db, postId);
    if (!sourceRow) return res.status(404).json({ error: 'Post not found' });
    if (!(await canAccessPostRow(db, sourceRow, viewerId, new Map()))) {
      return res.status(403).json({ error: 'profile_private' });
    }
    const comments = await db.all(`
      SELECT c.id, c.content, c.created_at, u.id as user_id, u.username, u.avatar
=======
  app.post('/api/polls/:pollId/vote', authMiddleware, async (req, res) => {
    const pollId = parseInt(req.params.pollId, 10);
    const { optionId } = req.body;
    if (!optionId) return res.status(400).json({ error: 'optionId required' });
    try {
      const poll = await db.get('SELECT id FROM polls WHERE id = ?', pollId);
      if (!poll) return res.status(404).json({ error: 'poll not found' });
      const option = await db.get('SELECT id FROM poll_options WHERE id = ? AND poll_id = ?', optionId, pollId);
      if (!option) return res.status(400).json({ error: 'invalid option' });

      const existing = await db.get('SELECT option_id FROM poll_votes WHERE poll_id = ? AND user_id = ?', pollId, req.user.id);
      if (existing) {
        if (existing.option_id === optionId) {
          await db.run('DELETE FROM poll_votes WHERE poll_id = ? AND user_id = ?', pollId, req.user.id);
        } else {
          await db.run('UPDATE poll_votes SET option_id = ? WHERE poll_id = ? AND user_id = ?', optionId, pollId, req.user.id);
        }
      } else {
        await db.run('INSERT INTO poll_votes (poll_id, option_id, user_id) VALUES (?, ?, ?)', pollId, optionId, req.user.id);
      }

      const options = await db.all(
        'SELECT po.id, po.text, COUNT(pv.id) as votes FROM poll_options po LEFT JOIN poll_votes pv ON pv.option_id = po.id WHERE po.poll_id = ? GROUP BY po.id ORDER BY po.sort_order',
        pollId
      );
      const vote = await db.get('SELECT option_id FROM poll_votes WHERE poll_id = ? AND user_id = ?', pollId, req.user.id);
      res.json({ options, userVote: vote ? vote.option_id : null });
    } catch (err) {
      console.error('Error in POST /api/polls/:pollId/vote:', err);
      res.status(500).json({ error: err.message });
    }
  });

  app.get('/api/posts/:id/comments', async (req, res) => {
    const postId = req.params.id;
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

    const comments = await db.all(
      `
      SELECT c.id, c.content, c.created_at,
             u.id as user_id, u.username, u.avatar,
             (SELECT COUNT(*) FROM comment_likes cl WHERE cl.comment_id = c.id) as likes,
             (SELECT 1 FROM comment_likes cl WHERE cl.comment_id = c.id AND cl.user_id = ? LIMIT 1) as liked_by_me
>>>>>>> 43fc63577f740ec07265f99ac0d4769620c4ae8c
      FROM comments c
      JOIN users u ON u.id = c.user_id
      WHERE c.post_id = ?
      ORDER BY c.created_at ASC
<<<<<<< HEAD
    `, postId);
    res.json(comments);
=======
      `,
      userId || -1,
      postId
    );
    res.json(
      comments.map(({ liked_by_me, ...c }) => ({
        ...c,
        likes: typeof c.likes === 'number' ? c.likes : 0,
        likedByMe: !!liked_by_me
      }))
    );
>>>>>>> 43fc63577f740ec07265f99ac0d4769620c4ae8c
  });

  app.post('/api/posts/:id/comments', authMiddleware, async (req, res) => {
    const postId = req.params.id;
    const { content } = req.body;
    if (!content) return res.status(400).json({ error: 'content required' });
<<<<<<< HEAD
    const sourceRow = await getPostRowById(db, postId);
    if (!sourceRow) return res.status(404).json({ error: 'Post not found' });
    if (!(await canAccessPostRow(db, sourceRow, req.user.id, new Map()))) {
      return res.status(403).json({ error: 'profile_private' });
    }
    const created_at = Date.now();
    const result = await db.run('INSERT INTO comments (post_id, user_id, content, created_at) VALUES (?, ?, ?, ?)', postId, req.user.id, content, created_at);
    const comment = await db.get('SELECT c.id, c.content, c.created_at, u.id as user_id, u.username, u.avatar FROM comments c JOIN users u ON u.id = c.user_id WHERE c.id = ?', result.lastID);
    res.json(comment);
  });

  app.post('/api/posts/:id/view', async (req, res) => {
    const postId = req.params.id;
    try {
      const existing = await getPostRowById(db, postId);
      if (!existing) {
        return res.status(404).json({ error: 'Post not found' });
      }
      const viewerId = parseAuthUserId(req.headers.authorization);
      if (!(await canAccessPostRow(db, existing, viewerId, new Map()))) {
        return res.status(403).json({ error: 'profile_private' });
      }
      await db.run('UPDATE posts SET views = views + 1 WHERE id = ?', postId);
      const updated = await db.get('SELECT views FROM posts WHERE id = ?', postId);
      res.json({ views: updated.views });
    } catch (err) {
      console.error('Error in POST /api/posts/:id/view:', err);
=======
    const created_at = Date.now();
    const result = await db.run('INSERT INTO comments (post_id, user_id, content, created_at) VALUES (?, ?, ?, ?)', postId, req.user.id, content, created_at);
    const comment = await db.get(
      `
      SELECT c.id, c.content, c.created_at, u.id as user_id, u.username, u.avatar
      FROM comments c
      JOIN users u ON u.id = c.user_id
      WHERE c.id = ?
      `,
      result.lastID
    );
    res.json({ ...comment, likes: 0, likedByMe: false });
  });

  app.post('/api/comments/:id/like', authMiddleware, async (req, res) => {
    const commentId = parseInt(req.params.id, 10);
    if (!commentId) return res.status(400).json({ error: 'invalid id' });
    try {
      const created_at = Date.now();
      try {
        await db.run(
          'INSERT INTO comment_likes (comment_id, user_id, created_at) VALUES (?, ?, ?)',
          commentId,
          req.user.id,
          created_at
        );
      } catch (err) {
        // toggle off if already liked
        await db.run('DELETE FROM comment_likes WHERE comment_id = ? AND user_id = ?', commentId, req.user.id);
      }
      const row = await db.get(
        `
        SELECT
          (SELECT COUNT(*) FROM comment_likes WHERE comment_id = ?) as likes,
          (SELECT 1 FROM comment_likes WHERE comment_id = ? AND user_id = ? LIMIT 1) as liked_by_me
        `,
        commentId,
        commentId,
        req.user.id
      );
      res.json({ likes: row && typeof row.likes === 'number' ? row.likes : 0, likedByMe: !!(row && row.liked_by_me) });
    } catch (err) {
      console.error('Error in POST /api/comments/:id/like:', err);
      res.status(500).json({ error: err.message });
    }
  });

  app.post('/api/polls/:id/vote', authMiddleware, async (req, res) => {
    const pollId = parseInt(req.params.id, 10);
    const { optionId } = req.body || {};
    if (!pollId || !optionId) {
      return res.status(400).json({ error: 'invalid poll or option' });
    }
    try {
      const poll = await db.get('SELECT id FROM polls WHERE id = ?', pollId);
      if (!poll) {
        return res.status(404).json({ error: 'Poll not found' });
      }
      const option = await db.get('SELECT id FROM poll_options WHERE id = ? AND poll_id = $2', optionId, pollId);
      if (!option) {
        return res.status(400).json({ error: 'Invalid option for this poll' });
      }
      const existing = await db.get(
        'SELECT id FROM poll_votes WHERE poll_id = ? AND user_id = $2',
        pollId,
        req.user.id
      );
      const now = Date.now();
      if (existing) {
        await db.run(
          'UPDATE poll_votes SET option_id = ?, created_at = $2 WHERE id = $3',
          optionId,
          now,
          existing.id
        );
      } else {
        await db.run(
          'INSERT INTO poll_votes (poll_id, option_id, user_id, created_at) VALUES (?, $2, $3, $4)',
          pollId,
          optionId,
          req.user.id,
          now
        );
      }

      const options = await db.all(
        'SELECT o.id, o.text, (SELECT COUNT(*) FROM poll_votes v WHERE v.option_id = o.id) as votes FROM poll_options o WHERE o.poll_id = ?',
        pollId
      );
      let totalVotes = 0;
      options.forEach(o => { totalVotes += o.votes; });
      const userVote = await db.get(
        'SELECT option_id FROM poll_votes WHERE poll_id = ? AND user_id = $2',
        pollId,
        req.user.id
      );
      res.json({
        pollId,
        options,
        totalVotes,
        userVoteOptionId: userVote ? userVote.option_id : null
      });
    } catch (err) {
      console.error('Error in POST /api/polls/:id/vote:', err);
      res.status(500).json({ error: err.message });
    }
  });

  app.put('/api/posts/:id', authMiddleware, async (req, res) => {
    const postId = parseInt(req.params.id, 10);
    const { content } = req.body || {};
    if (!postId) return res.status(400).json({ error: 'invalid id' });
    if (!content || !content.trim()) {
      return res.status(400).json({ error: 'content required' });
    }
    try {
      const existing = await db.get('SELECT * FROM posts WHERE id = ?', postId);
      if (!existing) {
        return res.status(404).json({ error: 'Post not found' });
      }
      if (existing.user_id !== req.user.id) {
        return res.status(403).json({ error: 'You can only edit your own posts' });
      }
      await db.run('UPDATE posts SET content = ? WHERE id = $2', content.trim(), postId);

      const p = await db.get(`
        SELECT p.id, p.content, p.image, p.audio, p.category, p.created_at,
               u.id as user_id, u.username, u.avatar
        FROM posts p
        JOIN users u ON u.id = p.user_id
        WHERE p.id = ?
      `, postId);

      const reactions = await db.all('SELECT type, COUNT(*) as count FROM reactions WHERE post_id = ? GROUP BY type', p.id);
      const comments = await db.get('SELECT COUNT(*) as count FROM comments WHERE post_id = ?', p.id);

      let userReactions = [];
      let isSubscribedToAuthor = false;
      const userId = req.user.id;
      userReactions = await db.all('SELECT type FROM reactions WHERE post_id = ? AND user_id = $2', p.id, userId);
      const sub = await db.get(
        'SELECT 1 FROM subscriptions WHERE subscriber_id = ? AND subscribed_to_id = $2',
        userId,
        p.user_id
      );
      isSubscribedToAuthor = !!sub;

      res.json({
        ...p,
        reactions: reactions.reduce((acc, r) => ({ ...acc, [r.type]: r.count }), {}),
        userReactions: userReactions.map(r => r.type),
        comments: comments.count,
        isSubscribedToAuthor
      });
    } catch (err) {
      console.error('Error in PUT /api/posts/:id:', err);
>>>>>>> 43fc63577f740ec07265f99ac0d4769620c4ae8c
      res.status(500).json({ error: err.message });
    }
  });

  app.delete('/api/posts/:id', authMiddleware, async (req, res) => {
    const postId = req.params.id;
    try {
<<<<<<< HEAD
      const post = await db.get('SELECT user_id, image, audio, video, images, videos FROM posts WHERE id = ?', postId);
=======
      const post = await db.get('SELECT user_id, image, audio FROM posts WHERE id = ?', postId);
>>>>>>> 43fc63577f740ec07265f99ac0d4769620c4ae8c
      if (!post) {
        return res.status(404).json({ error: 'Post not found' });
      }
      if (post.user_id !== req.user.id) {
        return res.status(403).json({ error: 'You can only delete your own posts' });
      }
      
      // Delete related data
      await db.run('DELETE FROM reactions WHERE post_id = ?', postId);
<<<<<<< HEAD
      await db.run('DELETE FROM comments WHERE post_id = ?', postId);
      await db.run('DELETE FROM notifications WHERE post_id = ?', postId);
=======
      await db.run('DELETE FROM comment_likes WHERE comment_id IN (SELECT id FROM comments WHERE post_id = ?)', postId);
      await db.run('DELETE FROM comments WHERE post_id = ?', postId);
      await db.run('DELETE FROM notifications WHERE post_id = ?', postId);
      const pollRow = await db.get('SELECT id FROM polls WHERE post_id = ?', postId);
      if (pollRow) {
        await db.run('DELETE FROM poll_votes WHERE poll_id = ?', pollRow.id);
        await db.run('DELETE FROM poll_options WHERE poll_id = ?', pollRow.id);
        await db.run('DELETE FROM polls WHERE id = ?', pollRow.id);
      }
>>>>>>> 43fc63577f740ec07265f99ac0d4769620c4ae8c
      
      // Delete post
      await db.run('DELETE FROM posts WHERE id = ?', postId);
      
<<<<<<< HEAD
      const filesToDelete = new Set();
      if (post.image) filesToDelete.add(post.image);
      if (post.audio) filesToDelete.add(post.audio);
      if (post.video) filesToDelete.add(post.video);
      try {
        if (post.images) {
          const arr = JSON.parse(post.images);
          if (Array.isArray(arr)) arr.forEach(u => filesToDelete.add(u));
        }
        if (post.videos) {
          const arr = JSON.parse(post.videos);
          if (Array.isArray(arr)) arr.forEach(u => filesToDelete.add(u));
        }
      } catch (e) {}
      for (const urlPath of filesToDelete) {
        if (!urlPath || !String(urlPath).startsWith('/uploads/')) continue;
        const diskPath = path.join(__dirname, urlPath);
        try {
          await fs.unlink(diskPath);
        } catch (err) {
          console.error('Error deleting file:', err);
=======
      // Delete files if they exist
      if (post.image) {
        const imagePath = uploadPathFromUrl(post.image);
        try {
          if (imagePath) await fs.unlink(imagePath);
        } catch (err) {
          console.error('Error deleting image file:', err);
        }
      }
      if (post.audio) {
        const audioPath = uploadPathFromUrl(post.audio);
        try {
          if (audioPath) await fs.unlink(audioPath);
        } catch (err) {
          console.error('Error deleting audio file:', err);
>>>>>>> 43fc63577f740ec07265f99ac0d4769620c4ae8c
        }
      }
      
      res.json({ success: true });
    } catch (err) {
      console.error('Error in DELETE /api/posts/:id:', err);
      res.status(500).json({ error: err.message });
    }
  });

<<<<<<< HEAD
  app.put('/api/users/profile', authMiddleware, async (req, res) => {
    const body = req.body || {};
    const allowedFields = ['avatar', 'bio', 'background', 'is_private'];
    const hasPayload = allowedFields.some((field) => Object.prototype.hasOwnProperty.call(body, field));
    if (!hasPayload) return res.status(400).json({ error: 'avatar, bio, background or is_private required' });
    const updates = [];
    const values = [];
    if (Object.prototype.hasOwnProperty.call(body, 'avatar')) { updates.push('avatar = ?'); values.push(body.avatar || DEFAULT_AVATAR_URL); }
    if (Object.prototype.hasOwnProperty.call(body, 'bio')) { updates.push('bio = ?'); values.push(body.bio || ''); }
    if (Object.prototype.hasOwnProperty.call(body, 'background')) { updates.push('background = ?'); values.push(body.background || null); }
    if (Object.prototype.hasOwnProperty.call(body, 'is_private')) { updates.push('is_private = ?'); values.push(body.is_private ? 1 : 0); }
    values.push(req.user.id);
    await db.run(`UPDATE users SET ${updates.join(', ')} WHERE id = ?`, values);
    const user = await db.get('SELECT id, username, avatar, bio, background, badge, is_private FROM users WHERE id = ?', req.user.id);
    res.json(user);
  });

  app.post('/api/users/avatar', authMiddleware, upload.single('avatar'), async (req, res) => {
    if (!req.file) return res.status(400).json({ error: 'no file uploaded' });
    const avatarUrl = '/uploads/' + req.file.filename;
    await db.run('UPDATE users SET avatar = ? WHERE id = ?', avatarUrl, req.user.id);
    const user = await db.get('SELECT id, username, avatar, bio, background, badge, is_private FROM users WHERE id = ?', req.user.id);
    res.json(user);
  });

  app.post('/api/users/background', authMiddleware, uploadBackground.single('background'), async (req, res) => {
    if (!req.file) return res.status(400).json({ error: 'no file uploaded' });
    const bgUrl = '/uploads/' + req.file.filename;
    await db.run('UPDATE users SET background = ? WHERE id = ?', bgUrl, req.user.id);
    const user = await db.get('SELECT id, username, avatar, bio, background, badge, is_private FROM users WHERE id = ?', req.user.id);
    res.json(user);
  });

  app.post('/api/presence/heartbeat', authMiddleware, async (req, res) => {
    const user = await db.get('SELECT last_seen FROM users WHERE id = ?', req.user.id);
    res.json(getPresencePayload(user || {}));
  });

  app.get('/api/users/check-username', async (req, res) => {
    const q = String(req.query.username || '').trim();
    if (!q) return res.status(400).json({ error: 'username required' });
=======
  app.put('/api/posts/:id', authMiddleware, async (req, res) => {
    const postId = parseInt(req.params.id, 10);
    try {
      const existing = await db.get('SELECT id, user_id, content, category FROM posts WHERE id = ?', postId);
      if (!existing) {
        return res.status(404).json({ error: 'Post not found' });
      }
      if (existing.user_id !== req.user.id) {
        return res.status(403).json({ error: 'You can only edit your own posts' });
      }

      const { content, category } = req.body || {};
      const newContent = typeof content === 'string' ? content : existing.content;
      const newCategory = typeof category === 'string'
        ? (category && category.trim() ? category.trim() : null)
        : existing.category;

      await db.run(
        'UPDATE posts SET content = ?, category = ? WHERE id = ?',
        newContent,
        newCategory,
        postId
      );

      const updated = await db.get(
        'SELECT p.id, p.content, p.image, p.audio, p.category, p.created_at, u.id as user_id, u.username, u.avatar FROM posts p JOIN users u ON u.id = p.user_id WHERE p.id = ?',
        postId
      );

      res.json(updated);
    } catch (err) {
      console.error('Error in PUT /api/posts/:id:', err);
      res.status(500).json({ error: err.message });
    }
  });

  app.get('/api/users/:id', async (req, res) => {
    const userId = req.params.id;
>>>>>>> 43fc63577f740ec07265f99ac0d4769620c4ae8c
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
<<<<<<< HEAD
    const existing = await db.get('SELECT id FROM users WHERE LOWER(username) = LOWER(?)', q);
    const available = !existing || (currentUserId && Number(existing.id) === Number(currentUserId));
    res.json({ available });
  });

  app.delete('/api/users/me', authMiddleware, async (req, res) => {
    const me = await db.get('SELECT id, avatar, background FROM users WHERE id = ?', req.user.id);
    if (!me) return res.status(404).json({ error: 'user not found' });

    // Collect media paths to delete from disk (best-effort)
    const postsMedia = await db.all('SELECT image, audio, video, images, videos FROM posts WHERE user_id = ?', req.user.id);
    const messagesMedia = await db.all('SELECT image, audio, video, images, videos FROM messages WHERE from_user_id = ? OR to_user_id = ?', req.user.id, req.user.id);
    const filesToDelete = [];
    if (me.avatar && String(me.avatar).startsWith('/uploads/')) filesToDelete.push(String(me.avatar));
    if (me.background && String(me.background).startsWith('/uploads/')) filesToDelete.push(String(me.background));
    for (const m of postsMedia) collectMediaUrls(m, filesToDelete);
    for (const m of messagesMedia) collectMediaUrls(m, filesToDelete);

    // Remove all related rows
    await db.run('DELETE FROM reactions WHERE user_id = ?', req.user.id);
    await db.run('DELETE FROM reactions WHERE post_id IN (SELECT id FROM posts WHERE user_id = ?)', req.user.id);
    await db.run('DELETE FROM comments WHERE user_id = ?', req.user.id);
    await db.run('DELETE FROM comments WHERE post_id IN (SELECT id FROM posts WHERE user_id = ?)', req.user.id);
    await db.run('DELETE FROM notifications WHERE user_id = ? OR from_user_id = ?', req.user.id, req.user.id);
    await db.run('DELETE FROM content_access_requests WHERE owner_user_id = ? OR requester_user_id = ?', req.user.id, req.user.id);
    await db.run('DELETE FROM subscriptions WHERE subscriber_id = ? OR subscribed_to_id = ?', req.user.id, req.user.id);
    await db.run('DELETE FROM messages WHERE from_user_id = ? OR to_user_id = ?', req.user.id, req.user.id);
    await db.run('DELETE FROM posts WHERE user_id = ?', req.user.id);
    await db.run('DELETE FROM channels WHERE user_id = ?', req.user.id);
    await db.run('DELETE FROM users WHERE id = ?', req.user.id);

    // Best-effort delete files
    for (const urlPath of filesToDelete) {
      if (!urlPath || !String(urlPath).startsWith('/uploads/')) continue;
      const diskPath = path.join(__dirname, urlPath);
      try {
        await fs.unlink(diskPath);
      } catch (err) {
        // ignore missing / already deleted
      }
    }

    res.json({ success: true });
  });

  app.get('/api/users/:id', async (req, res) => {
    const userId = req.params.id;
    const currentUserId = parseAuthUserId(req.headers.authorization);
    const user = await db.get('SELECT id, username, avatar, bio, background, badge, last_seen, is_private FROM users WHERE id = ?', userId);
    if (!user) return res.status(404).json({ error: 'user not found' });
    const canViewContent = await canAccessPrivateContent(db, userId, currentUserId);
    const rows = canViewContent ? await db.all(`
      SELECT ${POST_SELECT_FIELDS}
      FROM posts p
      JOIN users u ON u.id = p.user_id
      LEFT JOIN channels c ON c.id = p.channel_id
      LEFT JOIN posts op ON op.id = p.repost_post_id
      LEFT JOIN users ou ON ou.id = op.user_id
      LEFT JOIN channels oc ON oc.id = op.channel_id
      WHERE p.user_id = ?
      ORDER BY p.created_at DESC
    `, userId) : [];
    const subscribers = await db.get('SELECT COUNT(*) as count FROM subscriptions WHERE subscribed_to_id = ?', userId);
    const following = await db.get('SELECT COUNT(*) as count FROM subscriptions WHERE subscriber_id = ?', userId);
    const totalViews = await db.get('SELECT COALESCE(SUM(views), 0) as count FROM posts WHERE user_id = ?', userId);
    let isSubscribed = false;
    let viewRequestStatus = null;
    let subscribeRequestStatus = null;
    if (currentUserId) {
      const sub = await db.get('SELECT id FROM subscriptions WHERE subscriber_id = ? AND subscribed_to_id = ?', currentUserId, userId);
      isSubscribed = !!sub;
      const viewRequest = await getAccessRequestRecord(db, userId, currentUserId, ACCESS_REQUEST_TYPE_VIEW);
      const subscribeRequest = await getAccessRequestRecord(db, userId, currentUserId, ACCESS_REQUEST_TYPE_SUBSCRIBE);
      viewRequestStatus = viewRequest ? viewRequest.status : null;
      subscribeRequestStatus = subscribeRequest ? subscribeRequest.status : null;
    }
    res.json({
      ...user,
      ...getPresencePayload(user),
      posts: rows.map(mapPostRow),
      subscribers: subscribers.count,
      followingCount: following.count,
      totalViews: totalViews.count,
      isSubscribed,
      isPrivate: !!Number(user.is_private || 0),
      canViewContent,
      viewRequestStatus,
      subscribeRequestStatus
    });
  });

  app.put('/api/users/username', authMiddleware, async (req, res) => {
    const name = String(req.body.username || '').trim();
    if (!name) return res.status(400).json({ error: 'username required' });
    const existing = await db.get('SELECT id FROM users WHERE LOWER(username) = LOWER(?)', name);
    if (existing && Number(existing.id) !== Number(req.user.id)) return res.status(400).json({ error: 'username_taken' });
    await db.run('UPDATE users SET username = ? WHERE id = ?', name, req.user.id);
    const user = await db.get('SELECT id, username, avatar, bio, background, badge, is_private FROM users WHERE id = ?', req.user.id);
    const token = jwt.sign({ id: user.id, username: user.username }, JWT_SECRET);
    res.json({ token, ...user });
=======
    const user = await db.get('SELECT id, username, avatar, bio FROM users WHERE id = ?', userId);
    if (!user) return res.status(404).json({ error: 'user not found' });
    const posts = await db.all('SELECT id, content, category, created_at FROM posts WHERE user_id = ? ORDER BY created_at DESC', userId);
    const subscribers = await db.get('SELECT COUNT(*) as count FROM subscriptions WHERE subscribed_to_id = ?', userId);
    let isSubscribed = false;
    if (currentUserId) {
      const sub = await db.get('SELECT id FROM subscriptions WHERE subscriber_id = ? AND subscribed_to_id = $2', currentUserId, userId);
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
    if (bio) { updates.push('bio = $2'); values.push(bio); }
    values.push(req.user.id);
    await db.run(`UPDATE users SET ${updates.join(', ')} WHERE id = $3`, values);
    const user = await db.get('SELECT id, username, avatar, bio FROM users WHERE id = ?', req.user.id);
    res.json(user);
  });

  app.post('/api/users/avatar', authMiddleware, upload.single('avatar'), async (req, res) => {
    if (!req.file) return res.status(400).json({ error: 'no file uploaded' });
    const avatarUrl = '/uploads/' + req.file.filename;
    await db.run('UPDATE users SET avatar = ? WHERE id = $2', avatarUrl, req.user.id);
    const user = await db.get('SELECT id, username, avatar, bio FROM users WHERE id = ?', req.user.id);
    res.json(user);
>>>>>>> 43fc63577f740ec07265f99ac0d4769620c4ae8c
  });

  app.post('/api/subscribe/:userId', authMiddleware, async (req, res) => {
    const targetUserId = parseInt(req.params.userId);
    if (targetUserId === req.user.id) {
      return res.status(400).json({ error: 'cannot subscribe to yourself' });
    }
<<<<<<< HEAD
    const targetUser = await getUserPrivacy(db, targetUserId);
    if (!targetUser) {
      return res.status(404).json({ error: 'user not found' });
    }
    if (Number(targetUser.is_private) === 1) {
      const existingSub = await db.get(
        'SELECT id FROM subscriptions WHERE subscriber_id = ? AND subscribed_to_id = ?',
        req.user.id,
        targetUserId
      );
      if (existingSub) {
        return res.json({ subscribed: true, requestStatus: ACCESS_REQUEST_STATUS_APPROVED });
      }
      const request = await upsertAccessRequest(db, targetUserId, req.user.id, ACCESS_REQUEST_TYPE_SUBSCRIBE);
      return res.json({ subscribed: false, requested: true, requestStatus: request.status, requestId: request.requestId });
    }
    try {
      const created_at = Date.now();
      await db.run('INSERT INTO subscriptions (subscriber_id, subscribed_to_id, created_at) VALUES (?, ?, ?)', req.user.id, targetUserId, created_at);
      // Create notification for the user being subscribed to
      await db.run('INSERT INTO notifications (user_id, type, from_user_id, created_at) VALUES (?, ?, ?, ?)', targetUserId, 'subscribe', req.user.id, created_at);
=======
    try {
      const created_at = Date.now();
      await db.run('INSERT INTO subscriptions (subscriber_id, subscribed_to_id, created_at) VALUES (?, $2, $3)', req.user.id, targetUserId, created_at);
      // Create notification for the user being subscribed to
      await db.run('INSERT INTO notifications (user_id, type, from_user_id, created_at) VALUES (?, $2, $3, $4)', targetUserId, 'subscribe', req.user.id, created_at);
>>>>>>> 43fc63577f740ec07265f99ac0d4769620c4ae8c
      res.json({ subscribed: true });
    } catch (err) {
      res.status(400).json({ error: 'already subscribed' });
    }
  });

  app.post('/api/unsubscribe/:userId', authMiddleware, async (req, res) => {
    const targetUserId = parseInt(req.params.userId);
<<<<<<< HEAD
    await db.run('DELETE FROM subscriptions WHERE subscriber_id = ? AND subscribed_to_id = ?', req.user.id, targetUserId);
=======
    await db.run('DELETE FROM subscriptions WHERE subscriber_id = ? AND subscribed_to_id = $2', req.user.id, targetUserId);
>>>>>>> 43fc63577f740ec07265f99ac0d4769620c4ae8c
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

<<<<<<< HEAD
  app.get('/api/users/:id/subscriptions', async (req, res) => {
    const userId = Number(req.params.id);
    if (!Number.isFinite(userId)) {
      return res.status(400).json({ error: 'invalid user id' });
    }
    const owner = await db.get('SELECT id FROM users WHERE id = ?', userId);
    if (!owner) {
      return res.status(404).json({ error: 'user not found' });
    }
    const subscriptions = await db.all(`
      SELECT u.id, u.username, u.avatar, u.badge, u.bio
      FROM subscriptions s
      JOIN users u ON u.id = s.subscribed_to_id
      WHERE s.subscriber_id = ?
      ORDER BY s.created_at DESC
    `, userId);
    res.json(subscriptions);
  });

  app.get('/api/users/:id/subscribers', async (req, res) => {
    const userId = Number(req.params.id);
    if (!Number.isFinite(userId)) {
      return res.status(400).json({ error: 'invalid user id' });
    }
    const owner = await db.get('SELECT id FROM users WHERE id = ?', userId);
    if (!owner) {
      return res.status(404).json({ error: 'user not found' });
    }
    const subscribers = await db.all(`
      SELECT u.id, u.username, u.avatar, u.badge, u.bio
      FROM subscriptions s
      JOIN users u ON u.id = s.subscriber_id
      WHERE s.subscribed_to_id = ?
      ORDER BY s.created_at DESC
    `, userId);
    res.json(subscribers);
  });

  app.get('/api/notifications', authMiddleware, async (req, res) => {
    const notifications = await db.all(`
      SELECT n.id, n.type, n.is_read, n.created_at, n.request_id,
             u.id as from_user_id, u.username, u.avatar,
             p.id as post_id, p.content as post_content,
             car.request_type, car.status as request_status
      FROM notifications n
      JOIN users u ON u.id = n.from_user_id
      LEFT JOIN posts p ON p.id = n.post_id
      LEFT JOIN content_access_requests car ON car.id = n.request_id
=======
  app.get('/api/notifications', authMiddleware, async (req, res) => {
    const notifications = await db.all(`
      SELECT n.id, n.type, n.is_read, n.created_at, n.message as message,
             u.id as from_user_id, u.username, u.avatar,
             p.id as post_id, p.content as post_content
      FROM notifications n
      JOIN users u ON u.id = n.from_user_id
      LEFT JOIN posts p ON p.id = n.post_id
>>>>>>> 43fc63577f740ec07265f99ac0d4769620c4ae8c
      WHERE n.user_id = ?
      ORDER BY n.created_at DESC
    `, req.user.id);
    res.json(notifications);
  });

<<<<<<< HEAD
  app.post('/api/users/:id/request-view', authMiddleware, async (req, res) => {
    const ownerUserId = Number(req.params.id);
    if (!ownerUserId || ownerUserId === Number(req.user.id)) {
      return res.status(400).json({ error: 'invalid target user' });
    }
    const owner = await getUserPrivacy(db, ownerUserId);
    if (!owner) return res.status(404).json({ error: 'user not found' });
    if (!Number(owner.is_private)) {
      return res.json({ canViewContent: true, requestStatus: ACCESS_REQUEST_STATUS_APPROVED });
    }
    if (await canAccessPrivateContent(db, ownerUserId, req.user.id)) {
      return res.json({ canViewContent: true, requestStatus: ACCESS_REQUEST_STATUS_APPROVED });
    }
    const request = await upsertAccessRequest(db, ownerUserId, req.user.id, ACCESS_REQUEST_TYPE_VIEW);
    res.json({ canViewContent: false, requested: true, requestStatus: request.status, requestId: request.requestId });
  });

  app.post('/api/access-requests/:id/respond', authMiddleware, async (req, res) => {
    const requestId = Number(req.params.id);
    const approve = !!(req.body && req.body.approve);
    const request = await db.get(
      `SELECT id, owner_user_id, requester_user_id, request_type, status
       FROM content_access_requests
       WHERE id = ?`,
      requestId
    );
    if (!request) return res.status(404).json({ error: 'request not found' });
    if (Number(request.owner_user_id) !== Number(req.user.id)) {
      return res.status(403).json({ error: 'forbidden' });
    }
    const nextStatus = approve ? ACCESS_REQUEST_STATUS_APPROVED : ACCESS_REQUEST_STATUS_REJECTED;
    await db.run(
      'UPDATE content_access_requests SET status = ?, updated_at = ? WHERE id = ?',
      nextStatus,
      Date.now(),
      requestId
    );
    if (approve && request.request_type === ACCESS_REQUEST_TYPE_SUBSCRIBE) {
      await db.run(
        'INSERT OR IGNORE INTO subscriptions (subscriber_id, subscribed_to_id, created_at) VALUES (?, ?, ?)',
        request.requester_user_id,
        request.owner_user_id,
        Date.now()
      );
    }
    await db.run(
      'INSERT INTO notifications (user_id, type, from_user_id, request_id, created_at) VALUES (?, ?, ?, ?, ?)',
      request.requester_user_id,
      approve ? 'request_approved' : 'request_rejected',
      req.user.id,
      requestId,
      Date.now()
    );
    res.json({ success: true, status: nextStatus, requestType: request.request_type });
  });

  app.post('/api/notifications/:id/read', authMiddleware, async (req, res) => {
    await db.run('UPDATE notifications SET is_read = 1 WHERE id = ? AND user_id = ?', req.params.id, req.user.id);
=======
  app.post('/api/notifications/:id/read', authMiddleware, async (req, res) => {
    await db.run('UPDATE notifications SET is_read = 1 WHERE id = ? AND user_id = $2', req.params.id, req.user.id);
>>>>>>> 43fc63577f740ec07265f99ac0d4769620c4ae8c
    res.json({ success: true });
  });

  app.post('/api/notifications/mark-all-read', authMiddleware, async (req, res) => {
    await db.run('UPDATE notifications SET is_read = 1 WHERE user_id = ?', req.user.id);
    res.json({ success: true });
  });

<<<<<<< HEAD
  app.post('/api/messages/:userId', authMiddleware, async (req, res) => {
=======
  app.post('/api/system-notifications', authMiddleware, async (req, res) => {
    try {
      const { content } = req.body || {};
      if (!content || !content.trim()) {
        return res.status(400).json({ error: 'content required' });
      }
      if (!req.user || req.user.username !== 'blau3') {
        return res.status(403).json({ error: 'forbidden' });
      }
      const adminId = req.user.id;
      const created_at = Date.now();
      const users = await db.all('SELECT id FROM users WHERE id != ?', adminId);
      for (const u of users) {
        await db.run(
          'INSERT INTO notifications (user_id, type, from_user_id, post_id, message, created_at) VALUES (?, $2, $3, NULL, $4, $5)',
          u.id,
          'system',
          adminId,
          content.trim(),
          created_at
        );
      }
      res.json({ success: true, delivered: users.length });
    } catch (err) {
      console.error('Error in POST /api/system-notifications:', err);
      res.status(500).json({ error: err.message });
    }
  });

  app.post('/api/messages/:userId(\\d+)', authMiddleware, async (req, res) => {
>>>>>>> 43fc63577f740ec07265f99ac0d4769620c4ae8c
    const toUserId = parseInt(req.params.userId);
    const { content } = req.body;
    if (!content || content.trim() === '') {
      return res.status(400).json({ error: 'content required' });
    }
    try {
      const created_at = Date.now();
<<<<<<< HEAD
      await db.run('INSERT INTO messages (from_user_id, to_user_id, content, created_at) VALUES (?, ?, ?, ?)', req.user.id, toUserId, content, created_at);
=======
      await db.run('INSERT INTO messages (from_user_id, to_user_id, content, created_at) VALUES (?, $2, $3, $4)', req.user.id, toUserId, content, created_at);
>>>>>>> 43fc63577f740ec07265f99ac0d4769620c4ae8c
      res.json({ success: true });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

<<<<<<< HEAD
  app.post('/api/messages/:userId/with-media', authMiddleware, uploadPostMedia, async (req, res) => {
    const toUserId = parseInt(req.params.userId);
    try {
      const { content } = req.body || {};
      const imageFiles = (req.files && req.files.image) ? (Array.isArray(req.files.image) ? req.files.image : [req.files.image]) : [];
      const audioFile = req.files && req.files.audio && req.files.audio[0];
      const videoFiles = (req.files && req.files.video) ? (Array.isArray(req.files.video) ? req.files.video : [req.files.video]) : [];
      if (!content && imageFiles.length === 0 && !audioFile && videoFiles.length === 0) {
        return res.status(400).json({ error: 'content, image, audio or video required' });
      }
      const created_at = Date.now();
      const imageUrls = imageFiles.map(f => '/uploads/' + f.filename);
      const videoUrls = videoFiles.map(f => '/uploads/' + f.filename);
      const singleImage = imageUrls.length ? imageUrls[0] : null;
      const singleVideo = videoUrls.length ? videoUrls[0] : null;
      const audioUrl = audioFile ? '/uploads/' + audioFile.filename : null;
      const imagesJson = imageUrls.length ? JSON.stringify(imageUrls) : null;
      const videosJson = videoUrls.length ? JSON.stringify(videoUrls) : null;
      const result = await db.run(
        'INSERT INTO messages (from_user_id, to_user_id, content, image, audio, video, images, videos, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
        req.user.id, toUserId, content || '', singleImage, audioUrl, singleVideo, imagesJson, videosJson, created_at
      );
      const row = await db.get(`
        SELECT m.id, m.from_user_id, m.to_user_id, m.content, m.image, m.audio, m.video, m.images, m.videos, m.is_read, m.created_at,
               u.username, u.avatar
        FROM messages m
        JOIN users u ON u.id = m.from_user_id
        WHERE m.id = ?
      `, result.lastID);
      res.json(mapMessageRow(row));
    } catch (err) {
      console.error('Error in POST /api/messages/:userId/with-media:', err);
      res.status(500).json({ error: err.message });
    }
  });

  app.get('/api/messages/:userId', authMiddleware, async (req, res) => {
    const otherUserId = parseInt(req.params.userId);
    const rows = await db.all(`
      SELECT m.id, m.from_user_id, m.to_user_id, m.content, m.image, m.audio, m.video, m.images, m.videos, m.is_read, m.created_at, 
             u.username, u.avatar
      FROM messages m
      JOIN users u ON u.id = m.from_user_id
      WHERE (m.from_user_id = ? AND m.to_user_id = ?) OR (m.from_user_id = ? AND m.to_user_id = ?)
      ORDER BY m.created_at ASC
    `, req.user.id, otherUserId, otherUserId, req.user.id);
    const messages = rows.map(mapMessageRow);
    for (const msg of messages) {
      const reactions = await db.all(
        'SELECT mr.reaction, mr.user_id, u.username FROM message_reactions mr JOIN users u ON u.id = mr.user_id WHERE mr.message_id = ?',
        msg.id
      );
      msg.reactions = reactions;
    }
=======
  app.get('/api/messages/:userId(\\d+)', authMiddleware, async (req, res) => {
    const otherUserId = parseInt(req.params.userId);
    const messages = await db.all(`
      SELECT m.id, m.from_user_id, m.to_user_id, m.content, m.is_read, m.created_at, 
             u.username, u.avatar
      FROM messages m
      JOIN users u ON u.id = m.from_user_id
      WHERE (m.from_user_id = ? AND m.to_user_id = $2) OR (m.from_user_id = $3 AND m.to_user_id = $4)
      ORDER BY m.created_at ASC
    `, req.user.id, otherUserId, otherUserId, req.user.id);
>>>>>>> 43fc63577f740ec07265f99ac0d4769620c4ae8c
    res.json(messages);
  });

  app.get('/api/dialogs', authMiddleware, async (req, res) => {
    const dialogs = await db.all(`
      SELECT DISTINCT 
        CASE WHEN m.from_user_id = ? THEN m.to_user_id ELSE m.from_user_id END as user_id,
<<<<<<< HEAD
        u.username, u.avatar, u.last_seen,
        MAX(m.created_at) as last_message_at,
        (SELECT content FROM messages WHERE 
          (from_user_id = ? AND to_user_id = u.id) OR (from_user_id = u.id AND to_user_id = ?)
          ORDER BY created_at DESC LIMIT 1) as last_message_content,
        (SELECT image FROM messages WHERE 
          (from_user_id = ? AND to_user_id = u.id) OR (from_user_id = u.id AND to_user_id = ?)
          ORDER BY created_at DESC LIMIT 1) as last_message_image,
        (SELECT audio FROM messages WHERE 
          (from_user_id = ? AND to_user_id = u.id) OR (from_user_id = u.id AND to_user_id = ?)
          ORDER BY created_at DESC LIMIT 1) as last_message_audio,
        (SELECT video FROM messages WHERE 
          (from_user_id = ? AND to_user_id = u.id) OR (from_user_id = u.id AND to_user_id = ?)
          ORDER BY created_at DESC LIMIT 1) as last_message_video,
        (SELECT images FROM messages WHERE 
          (from_user_id = ? AND to_user_id = u.id) OR (from_user_id = u.id AND to_user_id = ?)
          ORDER BY created_at DESC LIMIT 1) as last_message_images,
        (SELECT videos FROM messages WHERE 
          (from_user_id = ? AND to_user_id = u.id) OR (from_user_id = u.id AND to_user_id = ?)
          ORDER BY created_at DESC LIMIT 1) as last_message_videos
      FROM messages m
      JOIN users u ON u.id = CASE WHEN m.from_user_id = ? THEN m.to_user_id ELSE m.from_user_id END
      WHERE m.from_user_id = ? OR m.to_user_id = ?
      GROUP BY user_id
      ORDER BY last_message_at DESC
    `, req.user.id, req.user.id, req.user.id, req.user.id, req.user.id, req.user.id, req.user.id, req.user.id, req.user.id, req.user.id, req.user.id, req.user.id, req.user.id, req.user.id, req.user.id, req.user.id);
    res.json(dialogs.map(dialog => ({
      ...dialog,
      ...getPresencePayload(dialog)
    })));
  });

  app.post('/api/messages/:userId/read', authMiddleware, async (req, res) => {
    const fromUserId = parseInt(req.params.userId);
    await db.run('UPDATE messages SET is_read = 1 WHERE from_user_id = ? AND to_user_id = ?', fromUserId, req.user.id);
    res.json({ success: true });
  });

  app.post('/api/messages/:messageId/react', authMiddleware, async (req, res) => {
    const messageId = parseInt(req.params.messageId);
    const { reaction } = req.body || {};
    if (!reaction || typeof reaction !== 'string') {
      return res.status(400).json({ error: 'reaction required' });
    }
    const created_at = Date.now();
    try {
      await db.run(
        'INSERT INTO message_reactions (message_id, user_id, reaction, created_at) VALUES (?, ?, ?, ?)',
        messageId, req.user.id, reaction, created_at
      );
      const reactions = await db.all(
        'SELECT mr.reaction, mr.user_id, u.username FROM message_reactions mr JOIN users u ON u.id = mr.user_id WHERE mr.message_id = ?',
        messageId
      );
      res.json({ success: true, reactions });
    } catch (err) {
      if (err.message && err.message.includes('UNIQUE constraint')) {
        await db.run(
          'DELETE FROM message_reactions WHERE message_id = ? AND user_id = ? AND reaction = ?',
          messageId, req.user.id, reaction
        );
        const reactions = await db.all(
          'SELECT mr.reaction, mr.user_id, u.username FROM message_reactions mr JOIN users u ON u.id = mr.user_id WHERE mr.message_id = ?',
          messageId
        );
        res.json({ success: true, reactions, removed: true });
      } else {
        res.status(500).json({ error: err.message });
      }
    }
  });

  app.get('/api/messages/:messageId/reactions', authMiddleware, async (req, res) => {
    const messageId = parseInt(req.params.messageId);
    const reactions = await db.all(
      'SELECT mr.reaction, mr.user_id, u.username FROM message_reactions mr JOIN users u ON u.id = mr.user_id WHERE mr.message_id = ?',
      messageId
    );
    res.json(reactions);
  });

  app.get('/api/keys/:userId', authMiddleware, async (req, res) => {
    const targetUserId = parseInt(req.params.userId);
    const key = await db.get('SELECT public_key, key_type, updated_at FROM user_public_keys WHERE user_id = ?', targetUserId);
    if (!key) {
      return res.json({ publicKey: null });
    }
    res.json({
      publicKey: key.public_key,
      keyType: key.key_type,
      updatedAt: key.updated_at
    });
  });

  app.post('/api/keys/me', authMiddleware, async (req, res) => {
    const { publicKey, keyType } = req.body || {};
    if (!publicKey || typeof publicKey !== 'string') {
      return res.status(400).json({ error: 'publicKey required' });
    }
    const keyTypeSafe = keyType === 'x25519' ? 'x25519' : 'x25519';
    const updated_at = Date.now();
    await db.run(
      'INSERT INTO user_public_keys (user_id, public_key, key_type, updated_at) VALUES (?, ?, ?, ?) ON CONFLICT(user_id) DO UPDATE SET public_key = excluded.public_key, key_type = excluded.key_type, updated_at = excluded.updated_at',
      req.user.id, publicKey, keyTypeSafe, updated_at
    );
    res.json({ success: true, updatedAt: updated_at });
  });

  app.get('/api/keys/me', authMiddleware, async (req, res) => {
    const key = await db.get('SELECT public_key, key_type, updated_at FROM user_public_keys WHERE user_id = ?', req.user.id);
    if (!key) {
      return res.json({ publicKey: null });
    }
    res.json({
      publicKey: key.public_key,
      keyType: key.key_type,
      updatedAt: key.updated_at
    });
  });

  // --- Admin API: users management ---
  app.get('/api/admin/users', authMiddleware, adminMiddleware, async (req, res) => {
    const users = await db.all(`
      SELECT
        u.id,
        u.username,
        u.avatar,
        u.bio,
        u.background,
        u.badge,
        u.last_seen,
        COALESCE(pc.posts_count, 0) AS posts_count
      FROM users u
      LEFT JOIN (
        SELECT user_id, COUNT(*) AS posts_count
        FROM posts
        GROUP BY user_id
      ) pc ON pc.user_id = u.id
      ORDER BY u.id ASC
    `);
    const posts = await db.all(`
      SELECT id, user_id, content, image, audio, video, images, videos, created_at, views, repost_post_id
      FROM posts
      ORDER BY created_at DESC, id DESC
    `);
    const postsByUserId = new Map();
    for (const post of posts) {
      const key = Number(post.user_id);
      if (!postsByUserId.has(key)) postsByUserId.set(key, []);
      postsByUserId.get(key).push({
        id: Number(post.id),
        user_id: Number(post.user_id),
        content: String(post.content || ''),
        image: post.image || null,
        audio: post.audio || null,
        video: post.video || null,
        images: parsePostMediaList(post.images, post.image),
        videos: parsePostMediaList(post.videos, post.video),
        created_at: Number(post.created_at || 0),
        views: Number(post.views || 0),
        repost_post_id: post.repost_post_id ? Number(post.repost_post_id) : null
      });
    }
    res.json(users.map(user => ({
      ...user,
      id: Number(user.id),
      last_seen: Number(user.last_seen || 0),
      posts_count: Number(user.posts_count || 0),
      posts: postsByUserId.get(Number(user.id)) || []
    })));
  });

  app.put('/api/admin/users/:id/badge', authMiddleware, adminMiddleware, async (req, res) => {
    const userId = parseInt(req.params.id);
    const badge = (req.body && typeof req.body.badge === 'string') ? req.body.badge.trim() : null;
    await db.run('UPDATE users SET badge = ? WHERE id = ?', badge || null, userId);
    const user = await db.get('SELECT id, username, avatar, bio, background, badge FROM users WHERE id = ?', userId);
    if (!user) return res.status(404).json({ error: 'user not found' });
    res.json(user);
  });

  app.delete('/api/admin/users/:id', authMiddleware, adminMiddleware, async (req, res) => {
    const targetId = parseInt(req.params.id);
    const user = await db.get('SELECT id, avatar, background FROM users WHERE id = ?', targetId);
    if (!user) return res.status(404).json({ error: 'user not found' });

    const postsMedia = await db.all('SELECT image, audio, video, images, videos FROM posts WHERE user_id = ?', targetId);
    const messagesMedia = await db.all('SELECT image, audio, video, images, videos FROM messages WHERE from_user_id = ? OR to_user_id = ?', targetId, targetId);
    const filesToDelete = [];
    if (user.avatar && String(user.avatar).startsWith('/uploads/')) filesToDelete.push(String(user.avatar));
    if (user.background && String(user.background).startsWith('/uploads/')) filesToDelete.push(String(user.background));
    for (const m of postsMedia) collectMediaUrls(m, filesToDelete);
    for (const m of messagesMedia) collectMediaUrls(m, filesToDelete);

    await db.run('DELETE FROM reactions WHERE user_id = ?', targetId);
    await db.run('DELETE FROM reactions WHERE post_id IN (SELECT id FROM posts WHERE user_id = ?)', targetId);
    await db.run('DELETE FROM comments WHERE user_id = ?', targetId);
    await db.run('DELETE FROM comments WHERE post_id IN (SELECT id FROM posts WHERE user_id = ?)', targetId);
    await db.run('DELETE FROM notifications WHERE user_id = ? OR from_user_id = ?', targetId, targetId);
    await db.run('DELETE FROM subscriptions WHERE subscriber_id = ? OR subscribed_to_id = ?', targetId, targetId);
    await db.run('DELETE FROM messages WHERE from_user_id = ? OR to_user_id = ?', targetId, targetId);
    await db.run('DELETE FROM posts WHERE user_id = ?', targetId);
    await db.run('DELETE FROM channels WHERE user_id = ?', targetId);
    await db.run('DELETE FROM users WHERE id = ?', targetId);

    for (const urlPath of filesToDelete) {
      if (!urlPath || !String(urlPath).startsWith('/uploads/')) continue;
      const diskPath = path.join(__dirname, urlPath);
      try {
        await fs.unlink(diskPath);
      } catch (err) {
        // ignore missing
      }
    }

    res.json({ success: true });
  });

  app.post('/api/support', async (req, res) => {
    const { type, scammerLink } = req.body || {};
    const t = parseInt(type, 10);
    if (![1, 2, 3, 4].includes(t)) {
      return res.status(400).json({ error: 'Invalid type' });
    }
    let userId = null;
    const auth = req.headers.authorization;
    if (auth) {
      const parts = auth.split(' ');
      if (parts.length === 2 && parts[0] === 'Bearer') {
        try {
          const payload = jwt.verify(parts[1], JWT_SECRET);
          userId = payload.id;
        } catch (err) {}
      }
    }
    const created_at = Date.now();
    await db.run('INSERT INTO support_requests (type, scammer_link, user_id, created_at) VALUES (?, ?, ?, ?)', t, scammerLink || null, userId, created_at);

    // Send a support message to blau3 (if exists)
    try {
      const blau3Id = await getUserIdByUsername('blau3');
      if (blau3Id) {
        const supportUserId = await ensureSupportUser();
        const requester = userId ? await db.get('SELECT username FROM users WHERE id = ?', userId) : null;
        const requesterName = (requester && requester.username) ? String(requester.username) : 'anonymous';
        const labelsRu = {
          1: 'Мой аккаунт взломали',
          2: 'Не могу войти в свой аккаунт',
          3: 'Запросить верификацию',
          4: 'Мошенник'
        };
        const opt = labelsRu[t] || String(t);
        const extra = t === 4 && scammerLink ? ` (ссылка: ${String(scammerLink)})` : '';
        const content = `${requesterName} запросил "${opt}"${extra}`;
        await db.run(
          'INSERT INTO messages (from_user_id, to_user_id, content, created_at) VALUES (?, ?, ?, ?)',
          supportUserId,
          blau3Id,
          content,
          created_at
        );
      }
    } catch (err) {
      console.error('Failed to create support system message:', err.message);
    }

    const labels = { 1: 'My account was hacked', 2: "Can't log into account", 3: 'Request verification', 4: 'Scammer' };
    const subject = `[tap] Support: ${labels[t]}`;
    const linkText = scammerLink ? `\nScammer link: ${scammerLink}` : '';
    const body = `Type: ${labels[t]}${linkText}\nUser ID: ${userId || 'anonymous'}\nTime: ${new Date(created_at).toISOString()}`;
    const supportEmail = 'borisgambo1626@gmail.com';
    try {
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.SMTP_USER || process.env.GMAIL_USER,
          pass: process.env.SMTP_PASS || process.env.GMAIL_APP_PASSWORD
        }
      });
      if (transporter.options.auth.user && transporter.options.auth.pass) {
        await transporter.sendMail({
          from: transporter.options.auth.user,
          to: supportEmail,
          subject,
          text: body
        });
      }
    } catch (err) {
      console.error('Support email send failed:', err.message);
    }
    res.json({ success: true });
=======
        u.username, u.avatar,
        MAX(m.created_at) as last_message_at,
        (SELECT content FROM messages WHERE 
          (from_user_id = $2 AND to_user_id = u.id) OR (from_user_id = u.id AND to_user_id = $3)
          ORDER BY created_at DESC LIMIT 1) as last_message_content
      FROM messages m
      JOIN users u ON u.id = CASE WHEN m.from_user_id = $4 THEN m.to_user_id ELSE m.from_user_id END
      WHERE m.from_user_id = $5 OR m.to_user_id = $6
      GROUP BY user_id
      ORDER BY last_message_at DESC
    `, req.user.id, req.user.id, req.user.id, req.user.id, req.user.id, req.user.id);
    res.json(dialogs);
  });

  app.post('/api/messages/:userId(\\d+)/read', authMiddleware, async (req, res) => {
    const fromUserId = parseInt(req.params.userId);
    await db.run('UPDATE messages SET is_read = 1 WHERE from_user_id = ? AND to_user_id = $2', fromUserId, req.user.id);
    res.json({ success: true });
  });

  app.get('/api/messages/unread-count', authMiddleware, async (req, res) => {
    const row = await db.get(
      'SELECT COUNT(*) as count FROM messages WHERE to_user_id = ? AND is_read = 0',
      req.user.id
    );
    res.json({ count: row ? row.count : 0 });
  });

  // Stories: create and list
  app.post('/api/stories', authMiddleware, (req, res) => {
    uploadStoryMedia(req, res, async (err) => {
      if (err) {
        return res.status(400).json({ error: err.message });
      }
      try {
        const { content } = req.body || {};
        const file = req.file;
        if ((!content || !content.trim()) && !file) {
          return res.status(400).json({ error: 'content or media required' });
        }
        const created_at = Date.now();
        const expires_at = created_at + 24 * 60 * 60 * 1000; // 24h
        const mediaUrl = file ? '/uploads/' + file.filename : null;
        await db.run(
          'INSERT INTO stories (user_id, content, media, created_at, expires_at) VALUES (?, $2, $3, $4, $5)',
          req.user.id,
          content ? content.trim() : '',
          mediaUrl,
          created_at,
          expires_at
        );
        res.json({ success: true });
      } catch (e) {
        console.error('Error in POST /api/stories:', e);
        res.status(500).json({ error: e.message });
      }
    });
  });

  app.get('/api/stories', authMiddleware, async (req, res) => {
    try {
      const now = Date.now();
      const userId = req.user.id;
      const rows = await db.all(
        `
        SELECT s.id, s.content, s.media, s.created_at,
               u.id as user_id, u.username, u.avatar
        FROM stories s
        JOIN users u ON u.id = s.user_id
        WHERE s.expires_at > ?
          AND (s.user_id = $2
               OR s.user_id IN (SELECT subscribed_to_id FROM subscriptions WHERE subscriber_id = $3))
        ORDER BY s.created_at DESC
        `,
        now,
        userId,
        userId
      );
      res.json(rows);
    } catch (e) {
      console.error('Error in GET /api/stories:', e);
      res.status(500).json({ error: e.message });
    }
  });

  app.get('/api/settings/logo', async (req, res) => {
    try {
      const row = await db.get("SELECT value FROM settings WHERE key = 'logo_url'");
      res.json({ logoUrl: row ? row.value : null });
    } catch (e) {
      res.json({ logoUrl: null });
    }
  });

  app.post('/api/settings/logo', authMiddleware, (req, res) => {
    uploadLogo(req, res, async (err) => {
      if (err) return res.status(400).json({ error: err.message });
      if (!req.file) return res.status(400).json({ error: 'no file uploaded' });
      const logoUrl = '/uploads/' + req.file.filename;
      await db.run("INSERT INTO settings (key, value) VALUES ('logo_url', ?) ON CONFLICT(key) DO UPDATE SET value = ?", logoUrl);
      res.json({ logoUrl });
    });
>>>>>>> 43fc63577f740ec07265f99ac0d4769620c4ae8c
  });

  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok' });
  });

<<<<<<< HEAD
  // Cleanup expired stories every minute
  setInterval(async () => {
    try {
      const now = Date.now();
      await db.run('DELETE FROM story_likes WHERE story_id IN (SELECT id FROM stories WHERE expires_at < ?)', now);
      await db.run('DELETE FROM story_comment_likes WHERE comment_id IN (SELECT id FROM story_comments WHERE story_id IN (SELECT id FROM stories WHERE expires_at < ?))', now);
      await db.run('DELETE FROM story_comments WHERE story_id IN (SELECT id FROM stories WHERE expires_at < ?)', now);
      const result = await db.run('DELETE FROM stories WHERE expires_at < ?', now);
      if (result.changes > 0) {
        console.log(`Deleted ${result.changes} expired stories`);
      }
    } catch (err) {
      console.error('Story cleanup error:', err);
    }
  }, 60 * 1000); // Run every minute

=======
  // Initialize database
  db = await initDb();
  
>>>>>>> 43fc63577f740ec07265f99ac0d4769620c4ae8c
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
})();
