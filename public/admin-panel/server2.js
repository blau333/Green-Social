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
      function showAdminConfirm(message) {
        return new Promise(resolve => {
          const root = document.createElement('div');
          root.style.position = 'fixed';
          root.style.inset = '0';
          root.style.background = 'rgba(0,0,0,0.4)';
          root.style.display = 'flex';
          root.style.alignItems = 'center';
          root.style.justifyContent = 'center';
          root.style.zIndex = '9999';
          const card = document.createElement('div');
          card.style.background = '#fff';
          card.style.borderRadius = '18px';
          card.style.padding = '16px';
          card.style.minWidth = '260px';
          card.style.boxShadow = '0 10px 30px rgba(0,0,0,0.2)';
          card.innerHTML = '<h3 style="margin-top:0">Подтверждение</h3><p>' + message + '</p>';
          const actions = document.createElement('div');
          actions.style.display = 'flex';
          actions.style.justifyContent = 'flex-end';
          actions.style.gap = '8px';
          const cancelBtn = document.createElement('button');
          cancelBtn.textContent = 'Отмена';
          const okBtn = document.createElement('button');
          okBtn.textContent = 'Удалить';
          okBtn.style.background = '#c0392b';
          okBtn.style.color = '#fff';
          okBtn.style.border = 'none';
          okBtn.style.padding = '6px 12px';
          okBtn.style.borderRadius = '4px';
          actions.appendChild(cancelBtn);
          actions.appendChild(okBtn);
          card.appendChild(actions);
          root.appendChild(card);
          document.body.appendChild(root);
          cancelBtn.onclick = () => { document.body.removeChild(root); resolve(false); };
          okBtn.onclick = () => { document.body.removeChild(root); resolve(true); };
        });
      }
      function showAdminAlert(message) {
        const root = document.createElement('div');
        root.style.position = 'fixed';
        root.style.inset = '0';
        root.style.background = 'rgba(0,0,0,0.4)';
        root.style.display = 'flex';
        root.style.alignItems = 'center';
        root.style.justifyContent = 'center';
        root.style.zIndex = '9999';
        const card = document.createElement('div');
        card.style.background = '#fff';
        card.style.borderRadius = '18px';
        card.style.padding = '16px';
        card.style.minWidth = '260px';
        card.style.boxShadow = '0 10px 30px rgba(0,0,0,0.2)';
        card.innerHTML = '<p style="margin-top:0">' + message + '</p>';
        const btn = document.createElement('button');
        btn.textContent = 'OK';
        btn.style.marginTop = '12px';
        btn.onclick = () => document.body.removeChild(root);
        card.appendChild(btn);
        root.appendChild(card);
        document.body.appendChild(root);
      }
      async function deletePost(id) {
        const confirmed = await showAdminConfirm('Удалить этот пост?');
        if(!confirmed) return;
        const res = await fetch('/api/posts/' + id, { method: 'DELETE' });
        if(res.ok) location.reload();
        else showAdminAlert('Ошибка при удалении');
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