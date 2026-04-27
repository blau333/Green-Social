// server.js
const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');

const app = express();
const PORT = 3000;

// --- Настройка сессий ---
app.use(session({
  secret: 'mysecretkey',
  resave: false,
  saveUninitialized: true
}));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// --- "База данных" постов в памяти ---
let posts = [
  { id: 1, author: 'alice', text: 'Привет мир!' },
  { id: 2, author: 'bob', text: 'Это тестовый пост' },
  { id: 3, author: 'charlie', text: 'Еще один пост' }
];

// --- Авторизация ---
app.get('/login', (req, res) => {
  res.send(`
    <form method="POST" action="/login">
      Логин: <input name="username"/>
      <button>Войти</button>
    </form>
  `);
});

app.post('/login', (req, res) => {
  const { username } = req.body;
  req.session.user = { username };
  res.redirect('/admin');
});

// --- Middleware для проверки админа ---
function isAdmin(req, res, next) {
  if (req.session.user && req.session.user.username === 'blau3') {
    next();
  } else {
    res.status(403).send('Доступ запрещён');
  }
}

// --- Админ-панель ---
app.get('/admin', isAdmin, (req, res) => {
  let html = `
    <style>
      body { font-family: Arial, sans-serif; padding: 20px; }
      button { margin-left: 10px; }
      .toast-container {
        position: fixed;
        right: 16px;
        bottom: 16px;
        z-index: 9999;
        display: flex;
        flex-direction: column;
        align-items: flex-end;
        gap: 12px;
        width: min(340px, calc(100vw - 32px));
        pointer-events: none;
      }
      .toast-notice {
        position: relative;
        width: 100%;
        padding: 14px 44px 18px 14px;
        border-radius: 14px;
        color: #0f172a;
        background: rgba(255, 251, 235, 0.98);
        border: 1px solid rgba(245, 158, 11, 0.25);
        box-shadow: 0 18px 40px rgba(15, 23, 42, 0.18);
        opacity: 0;
        transform: translateY(10px);
        transition: transform 0.18s ease, opacity 0.18s ease;
        pointer-events: auto;
        overflow: hidden;
      }
      .toast-notice-visible {
        opacity: 1;
        transform: translateY(0);
      }
      .toast-notice-closing {
        opacity: 0;
        transform: translateY(8px);
      }
      .toast-notice-close {
        position: absolute;
        top: 8px;
        right: 8px;
        width: 28px;
        height: 28px;
        border: 0;
        border-radius: 999px;
        background: rgba(15, 23, 42, 0.08);
        cursor: pointer;
      }
      .toast-notice-progress-track {
        position: absolute;
        left: 12px;
        right: 12px;
        bottom: 10px;
        height: 4px;
        border-radius: 999px;
        background: rgba(245, 158, 11, 0.16);
        overflow: hidden;
      }
      .toast-notice-progress {
        width: 100%;
        height: 100%;
        background: linear-gradient(90deg, #f59e0b, #facc15);
        transform-origin: left center;
        transform: scaleX(1);
        transition: transform var(--toast-duration, 4200ms) linear;
      }
      .toast-notice-progress-running {
        transform: scaleX(0);
      }
    </style>
    <h1>Админ-панель</h1>
    <p>Вы вошли как: ${req.session.user.username}</p>
    <ul>
      ${posts.map(p => `
        <li>
          <strong>${p.author}:</strong> ${p.text} 
          <button onclick="deletePost(${p.id})">Удалить</button>
        </li>
      `).join('')}
    </ul>

    <script>
      function ensureToastContainer() {
        let container = document.getElementById('toast-container');
        if (container) return container;
        container = document.createElement('div');
        container.id = 'toast-container';
        container.className = 'toast-container';
        document.body.appendChild(container);
        return container;
      }

      function showToast(message) {
        const container = ensureToastContainer();
        const toast = document.createElement('div');
        const durationMs = 4200;
        toast.className = 'toast-notice';
        toast.style.setProperty('--toast-duration', durationMs + 'ms');
        toast.innerHTML = \`
          <div>\${message}</div>
          <button type="button" class="toast-notice-close" aria-label="Close">✕</button>
          <div class="toast-notice-progress-track" aria-hidden="true">
            <div class="toast-notice-progress"></div>
          </div>
        \`;

        const closeToast = () => {
          if (toast.dataset.closing === 'true') return;
          toast.dataset.closing = 'true';
          if (toast._closeTimer) {
            window.clearTimeout(toast._closeTimer);
            toast._closeTimer = null;
          }
          toast.classList.add('toast-notice-closing');
          window.setTimeout(() => toast.remove(), 180);
        };

        toast.querySelector('.toast-notice-close').onclick = closeToast;
        container.appendChild(toast);
        requestAnimationFrame(() => {
          toast.classList.add('toast-notice-visible');
          toast.querySelector('.toast-notice-progress').classList.add('toast-notice-progress-running');
        });
        toast._closeTimer = window.setTimeout(closeToast, durationMs);
      }

      async function deletePost(id) {
        if(!confirm('Удалить этот пост?')) return;
        const res = await fetch('/api/posts/' + id, { method: 'DELETE' });
        if(res.ok) location.reload();
        else showToast('Ошибка при удалении');
      }
    </script>
  `;
  res.send(html);
});

// --- API для удаления поста ---
app.delete('/api/posts/:id', isAdmin, (req, res) => {
  const id = parseInt(req.params.id);
  posts = posts.filter(p => p.id !== id);
  res.json({ success: true });
});

// --- Запуск сервера ---
app.listen(PORT, () => {
  console.log(`Сервер запущен на http://localhost:${PORT}`);
});
