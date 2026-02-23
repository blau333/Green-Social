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
      async function deletePost(id) {
        if(!confirm('Удалить этот пост?')) return;
        const res = await fetch('/api/posts/' + id, { method: 'DELETE' });
        if(res.ok) location.reload();
        else alert('Ошибка при удалении');
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