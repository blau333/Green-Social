
const reactions = {
  like: { emoji: '👍', label: { en: 'Like', ru: 'Лайк' } },
  love: { emoji: '❤️', label: { en: 'Love', ru: 'Нравиться' } },
  funny: { emoji: '😂', label: { en: 'Funny', ru: "хаха" } },
  poop: { emoji: '💩', label: { en: 'Poop', ru: 'Фу' } },
  clown: { emoji: '🤡', label: { en: 'Clown', ru: 'Ужас' }}
};

const i18n = {
  en: {
    login: 'Login', register: 'Register', logout: 'Logout', hi: 'Yo,', welcome: 'Welcome', postPlaceholder: "Bro, whats wrong or send meme :)", post: 'Опубликовать', comments: 'Comments', writeComment: 'Write a comment', send: 'Send', create: 'Create', cancel: 'Cancel', loginFailed: 'Login failed', regFailed: 'Registration failed', loginTitle: 'Sign in', registerTitle: 'Create account', reactLike: 'Like', reactLove: 'Love', reactFunny: 'Funny', loginToReact: 'Login to react', loginToComment: 'Login to comment', loginToPost: 'Login to post', subscribe: 'Subscribe', unsubscribe: 'Unsubscribe', subscribers: 'Subscribers', editProfile: 'Edit Profile', notifications: 'Notifications', noNotifications: 'No notifications', markAllAsRead: 'Mark all as read', subscribedYou: 'subscribed to you', postedNew: 'posted a new post', feed: 'Feed', subscriptions: 'Subscriptions', messages: 'Messages', noMessages: 'No messages', typeMessage: 'Type a message...', sendMessage: 'Send Message',
    passwordRequirements: 'At least 8 characters, one uppercase, one lowercase, one digit, one special character',
    password_min_length: 'Password must be at least 8 characters',
    password_need_upper: 'Password must contain at least one uppercase letter',
    password_need_lower: 'Password must contain at least one lowercase letter',
    password_need_digit: 'Password must contain at least one digit',
    password_need_special: 'Password must contain at least one special character (!@#$%^&* etc.)',
    usernameRequired: 'Please enter a username',
    username_taken: 'This username is already taken (or too similar to an existing one)',
    recordVoice: 'Record voice',
    stopRecord: 'Stop',
    recording: 'Recording…',
    voiceRecorded: 'Voice message recorded',
    recordVoiceTitle: 'Record voice message',
    noMic: 'Microphone access is required for recording',
    noPostsSubscriptions: 'No subscriptions yet',
    viewInSubscriptions: 'View in Subscriptions',
    DeletePost: 'Delete Post',
    deleteConfirm: 'Delete this post?',
    deleteError: 'Failed to delete post'
  },
  ru: {
    login: 'Вход', register: 'Регистрация', logout: 'Выход', hi: 'Йоу,', welcome: 'Добро пожаловать', postPlaceholder: 'Что нового?', post: 'Опубликовать', comments: 'Комментарии', writeComment: 'Написать комментарий', send: 'Отправить', create: 'Создать', cancel: 'Отмена', loginFailed: 'Ошибка входа', regFailed: 'Ошибка регистрации', loginTitle: 'Вход', registerTitle: 'Создать аккаунт', reactLike: 'Нравится', reactLove: 'Люблю', reactFunny: 'Смешно', loginToReact: 'Войдите чтобы реагировать', loginToComment: 'Войдите чтобы комментировать', loginToPost: 'Войдите чтобы публиковать', subscribe: 'Подписаться', unsubscribe: 'Отписаться', subscribers: 'Подписчики', editProfile: 'Редактировать профиль', notifications: 'Уведомления', noNotifications: 'Нет уведомлений', markAllAsRead: 'Отметить все как прочитанные', subscribedYou: 'подписался на вас', postedNew: 'опубликовал новый пост', feed: 'Лента', subscriptions: 'Подписки', messages: 'Сообщения', noMessages: 'Нет сообщений', typeMessage: 'Напишите сообщение...', sendMessage: 'Написать сообщение',
    passwordRequirements: 'Минимум 8 символов, заглавная и строчная буква, цифра и спецсимвол',
    password_min_length: 'Пароль должен быть не короче 8 символов',
    password_need_upper: 'В пароле должна быть хотя бы одна заглавная буква',
    password_need_lower: 'В пароле должна быть хотя бы одна строчная буква',
    password_need_digit: 'В пароле должна быть хотя бы одна цифра',
    password_need_special: 'В пароле должен быть хотя бы один спецсимвол (!@#$%^&* и т.д.)',
    usernameRequired: 'Введите имя пользователя',
    username_taken: 'Этот никнейм уже занят или слишком похож на существующий',
    recordVoice: 'Записать голос',
    stopRecord: 'Стоп',
    recording: 'Идёт запись…',
    voiceRecorded: 'Голосовое сообщение записано',
    recordVoiceTitle: 'Записать голосовое сообщение',
    noMic: 'Для записи нужен доступ к микрофону',
    noPostsSubscriptions: 'Подписок нету',
    viewInSubscriptions: 'Открыть в подписках',
    DeletePost: 'Удалить публикацию',
    deleteConfirm: 'Удалить этот пост?',
    deleteError: 'Не удалось удалить пост'
  }
};

function validatePassword(p) {
  if (p.length < 8) return { ok: false, error: 'password_min_length' };
  if (!/[A-Z]/.test(p)) return { ok: false, error: 'password_need_upper' };
  if (!/[a-z]/.test(p)) return { ok: false, error: 'password_need_lower' };
  if (!/[0-9]/.test(p)) return { ok: false, error: 'password_need_digit' };
  if (!/[^A-Za-z0-9]/.test(p)) return { ok: false, error: 'password_need_special' };
  return { ok: true };
}

function generateStrongPassword(length=13) {
  const upper = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
  const lower = 'abcdefghijklmnopqrstuvwxyz'
  const numbers = '0123456789'
  const specials = '!@#$%^&*()_+[]{}<>?'
  const allChars = upper + lower + numbers + specials;

  if (length<4) length=4;

  function getRandomInt(max) {
    const randomBuffer = new Uint32Array(1);
    crypto.getRandomValues(randomBuffer);
    return Math.floor(randomBuffer[0] / (0xFFFFFFFF + 1) * max);
  }
  function shuffle(str) {
    const arr = str.split('');
    for (let i = arr.length - 1; i > 0; i--) {
      const j = getRandomInt(i + 1);
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr.join('');
  }
  let password = '';
  password += upper[getRandomInt(upper.length)];
  password += lower[getRandomInt(lower.length)];
  password += numbers[getRandomInt(numbers.length)];
  password += specials[getRandomInt(specials.length)];
  
  for (let i = 4; i < length; i++) {
    password += allChars[getRandomInt(allChars.length)];
  }

  return shuffle(password);
}

const state = {
  token: localStorage.getItem('token'),
  user: JSON.parse(localStorage.getItem('user') || 'null'),
  lang: localStorage.getItem('lang') || (navigator.language && navigator.language.startsWith('ru') ? 'ru' : 'en'),
  currentPage: 'feed'
};

const api = {
  async get(path, token) {
    const headers = {};
    if (token) headers.Authorization = 'Bearer ' + token;
    const r = await fetch('/api' + path, { headers });
    return r.json();
  },
  async post(path, body, token) {
    const headers = { 'Content-Type': 'application/json' };
    if (token) headers.Authorization = 'Bearer ' + token;
    const r = await fetch('/api' + path, { method: 'POST', headers, body: JSON.stringify(body) });
    return r.json();
  },
  async put(path, body, token) {
    const headers = { 'Content-Type': 'application/json' };
    if (token) headers.Authorization = 'Bearer ' + token;
    const r = await fetch('/api' + path, { method: 'PUT', headers, body: JSON.stringify(body) });
    return r.json();
  },
  async postFormData(path, formData, token) {
    const headers = {};
    if (token) headers.Authorization = 'Bearer ' + token;
    const r = await fetch('/api' + path, { method: 'POST', headers, body: formData });
    return r.json();
  },
  async delete(path, token) {
    const headers = {};
    if (token) headers.Authorization = 'Bearer ' + token;
    const r = await fetch('/api' + path, { method: 'DELETE', headers });
    if (!r.ok) {
      const error = await r.json().catch(() => ({ error: 'Delete failed' }));
      throw new Error(error.error || 'Delete failed');
    }
    return r.json().catch(() => ({ success: true }));
  }
};

function applyTheme(theme){
  if (theme === 'dark') document.documentElement.setAttribute('data-theme','dark'); else document.documentElement.removeAttribute('data-theme');
  localStorage.setItem('theme', theme);
}

function switchPage(page) {
  state.currentPage = page;
  const feedPage = document.getElementById('feed-page');
  const subscriptionsPage = document.getElementById('subscriptions-page');
  const notificationsPage = document.getElementById('notifications-page');
  const feedTab = document.getElementById('tab-feed');
  const subscriptionsTab = document.getElementById('tab-subscriptions');
  const notificationsTab = document.getElementById('tab-notifications');
  
  feedPage?.classList.remove('active');
  subscriptionsPage?.classList.remove('active');
  notificationsPage?.classList.remove('active');
  feedTab?.classList.remove('active');
  subscriptionsTab?.classList.remove('active');
  notificationsTab?.classList.remove('active');
  
  if (page === 'feed') {
    feedPage?.classList.add('active');
    feedTab?.classList.add('active');
  } else if (page === 'subscriptions') {
    subscriptionsPage?.classList.add('active');
    subscriptionsTab?.classList.add('active');
    loadSubscriptionsPosts();
  } else if (page === 'notifications') {
    notificationsPage?.classList.add('active');
    notificationsTab?.classList.add('active');
    loadNotificationsPage();
  }
}

function setAuth(token, user){ state.token = token; state.user = user; localStorage.setItem('token', token); localStorage.setItem('user', JSON.stringify(user)); renderAuth(); loadPosts(); }
function clearAuth(){ state.token = null; state.user = null; localStorage.removeItem('token'); localStorage.removeItem('user'); switchPage('feed'); renderAuth(); loadPosts(); }

function t(k){ return i18n[state.lang][k] || k }

function formatUsername(name) {
  return name === 'blau3' ? name + ' 🔧' : name;
}

function renderAuth(){
  const area = document.getElementById('auth-area');
  area.innerHTML = '';
  const profileBtn = document.getElementById('profile-btn');
  if (!state.user) {
    const loginBtn = document.createElement('button'); loginBtn.textContent = t('login'); loginBtn.className='link';
    loginBtn.onclick = showLogin;
    const regBtn = document.createElement('button'); regBtn.textContent=t('register'); regBtn.onclick = showRegister; regBtn.style.marginLeft='8px';
    area.appendChild(loginBtn); area.appendChild(regBtn);
    const cp = document.getElementById('create-post'); if (cp) cp.classList.add('hidden');
    if (profileBtn) profileBtn.classList.add('hidden');
  } else {
    const span = document.createElement('div'); span.textContent = `${t('hi')} ${formatUsername(state.user.username)}`;
    const out = document.createElement('button'); out.textContent=t('logout'); out.onclick = () => clearAuth();
    area.appendChild(span); area.appendChild(out);
    const cp = document.getElementById('create-post'); if (cp) cp.classList.remove('hidden');
    if (profileBtn) {
      profileBtn.classList.remove('hidden');
      profileBtn.onclick = () => showProfile(state.user.id);
    }
  }
  const welcomeEl = document.getElementById('welcome'); if (welcomeEl) welcomeEl.textContent = t('welcome');
}

function makeModal(innerHtml){
  const root = document.createElement('div'); root.className='modal-root';
  const card = document.createElement('div'); card.className='modal-card';
  card.innerHTML = innerHtml;
  root.appendChild(card);
  document.body.prepend(root);
  // allow closing when clicking outside
  root.addEventListener('click', (e)=>{ if (e.target === root) root.remove(); });
  return { root, card };
}

function showLogin(){
  const { root } = makeModal(`<h2>${t('loginTitle')}</h2><input id="li-user" placeholder="username"><input id="li-pass" type="password" placeholder="password"><div class="actions"><button id="li-cancel">${t('cancel')}</button><button id="li-submit">${t('login')}</button></div>`);
  document.getElementById('li-cancel').onclick = () => root.remove();
  document.getElementById('li-submit').onclick = async () => {
    const username = document.getElementById('li-user').value;
    const password = document.getElementById('li-pass').value;
    const res = await api.post('/login', { username, password });
    if (res.token) setAuth(res.token, { username: res.username, id: res.id }); else alert(res.error || t('loginFailed'));
    root.remove();
  };
}

function showRegister(){
  const { root } = makeModal(`
    <h2>${t('registerTitle')}</h2>
    <input id="rg-user" placeholder="username">
    <div style="display: flex; gap: 5px; margin-bottom: 8px;">
      <input id="rg-pass" type="password" placeholder="password" style="flex: 1;">
      <button
        id="rg-generate"
        type="button"
        style="font-size: 11px; padding: 4px 8px; white-space: nowrap;"
      >
        Сгенерировать пароль
      </button>
    </div>
    <div class="password-hint">${t('passwordRequirements')}</div>
    <div class="actions">
      <button id="rg-cancel">${t('cancel')}</button>
      <button id="rg-submit">${t('create')}</button>
    </div>
  `);

  document.getElementById('rg-generate').onclick = () => {
    const newPassword = generateStrongPassword(12);
    document.getElementById('rg-pass').value = newPassword;
  };

  document.getElementById('rg-cancel').onclick = () => root.remove();
  document.getElementById('rg-submit').onclick = async () => {
    const username = document.getElementById('rg-user').value.trim();
    const password = document.getElementById('rg-pass').value;
    if (!username) return alert(t('usernameRequired'));
    const pwCheck = validatePassword(password);
    if (!pwCheck.ok) {
      alert(t(pwCheck.error));
      return;
    }
    const res = await api.post('/register', { username, password });
    if (res.token) setAuth(res.token, { username: res.username, id: res.id }); else alert(t(res.error) || res.error || t('regFailed'));
    root.remove();
  };
}

function refreshCurrentFeed() {
  if (state.currentPage === 'subscriptions') loadSubscriptionsPosts();
  else loadPosts();
}

const AUTO_REFRESH_INTERVAL_MS = 30000; // 30 seconds

function autoRefreshCurrentPage() {
  if (state.currentPage === 'feed') loadPosts();
  else if (state.currentPage === 'subscriptions') loadSubscriptionsPosts();
  else if (state.currentPage === 'notifications') loadNotificationsPage();

  // Периодически обновляем индикатор количества уведомлений
  refreshNotificationsIndicator();
}

function startAutoRefresh() {
  if (window._autoRefreshTimer) clearInterval(window._autoRefreshTimer);
  window._autoRefreshTimer = setInterval(() => {
    if (document.visibilityState !== 'hidden') autoRefreshCurrentPage();
  }, AUTO_REFRESH_INTERVAL_MS);
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible') autoRefreshCurrentPage();
  });
}

function renderPostsInto(posts, containerId) {
  const el = document.getElementById(containerId);
  if (!el) return;
  el.innerHTML = '';

  for (const p of posts) {
    const card = document.createElement('div');
    card.className = 'card post';
    card.id = `post-${p.id}`;

    const meta = document.createElement('div');
    meta.className = 'meta';

    const avatar = document.createElement('img');
    avatar.src = p.avatar;
    avatar.className = 'avatar-small';
    avatar.style.cursor = 'pointer';
    avatar.onclick = () => showProfile(p.user_id);

    const userLink = document.createElement('strong');
    userLink.textContent = formatUsername(p.username);
    userLink.style.cursor = 'pointer';
    userLink.onclick = () => showProfile(p.user_id);

    const time = document.createElement('div');
    time.textContent = new Date(p.created_at).toLocaleString();

    meta.appendChild(avatar);
    meta.appendChild(userLink);
    meta.appendChild(time);

    const content = document.createElement('div');
    content.className = 'content';
    content.textContent = p.content;

    if (state.user && state.user.id === p.user_id) {
      const deleteBtn = document.createElement('button');
      deleteBtn.textContent = '🚮';
      deleteBtn.className = 'delete-btn';
      deleteBtn.title = t('DeletePost');
      deleteBtn.onclick = async () => {
        if (!confirm(t('deleteConfirm'))) return;
        try {
          await api.delete(`/posts/${p.id}`, state.token);
          document.getElementById(`post-${p.id}`)?.remove();
          refreshCurrentFeed();
        } catch (err) {
          alert(t('deleteError') + ': ' + err.message);
          console.error(err);
        }
      };
      card.appendChild(deleteBtn);
    }

    card.appendChild(meta);
    card.appendChild(content);
    const imageDiv = document.createElement('div');
    imageDiv.className = 'post-media';
    if (p.image) {
      const img = document.createElement('img');
      img.src = p.image;
      img.style.maxWidth = '100%';
      img.style.borderRadius = '12px';
      img.style.marginTop = '8px';
      imageDiv.appendChild(img);
    }
    if (p.audio) {
      const audio = document.createElement('audio');
      audio.controls = true;
      audio.src = p.audio;
      audio.style.width = '100%';
      audio.style.marginTop = '8px';
      imageDiv.appendChild(audio);
    }
    if (p.video) {
      const video = document.createElement('video');
      video.controls = true;
      video.src = p.video;
      video.style.width = '100%';
      video.style.marginTop = '8px';
      video.style.borderRadius = '12px';
      imageDiv.appendChild(video);
    }
    const reactionsDiv = document.createElement('div'); reactionsDiv.className = 'reactions';
    const types = ['like', 'love', 'funny', 'poop', 'clown'];
    types.forEach(typeKey => {
      const btn = document.createElement('button');
      const emoji = reactions[typeKey].emoji;
      const count = p.reactions && p.reactions[typeKey] ? p.reactions[typeKey] : 0;
      btn.textContent = `${emoji} ${count}`;
      btn.title = reactions[typeKey].label[state.lang];
      btn.className = 'reaction-btn';
      if (p.userReactions && p.userReactions.includes(typeKey)) btn.classList.add('active');
      btn.onclick = async () => {
        if (!state.token) return alert(t('loginToReact'));
        await api.post(`/posts/${p.id}/reaction`, { type: typeKey }, state.token);
        refreshCurrentFeed();
      };
      reactionsDiv.appendChild(btn);
    });
    const commentsBtn = document.createElement('button'); commentsBtn.textContent = `💬 ${p.comments || 0}`; commentsBtn.className = 'reaction-btn'; commentsBtn.title = t('comments');
    commentsBtn.onclick = () => toggleComments(card, p.id);
    reactionsDiv.appendChild(commentsBtn);
    card.appendChild(imageDiv);
    card.appendChild(reactionsDiv);
    el.appendChild(card);
  }
}

async function loadPosts() {
  const headers = state.token ? { Authorization: 'Bearer ' + state.token } : {};
  const posts = await fetch('/api/posts', { headers }).then(r => r.json());
  renderPostsInto(posts, 'posts');
}

async function loadSubscriptionsPosts() {
  const container = document.getElementById('subscriptions-posts');
  if (!container) return;
  if (!state.token) {
    container.innerHTML = '';
    return;
  }
  try {
    const posts = await api.get('/posts/subscriptions', state.token);
    if (!Array.isArray(posts)) {
      container.innerHTML = '<p class="muted">' + (t('noPostsSubscriptions') || 'No posts from subscriptions yet') + '</p>';
      return;
    }
    if (posts.length === 0) {
      container.innerHTML = '<p class="muted" style="padding:24px;text-align:center">' + (t('noPostsSubscriptions') || 'Subscribe to users to see their posts here') + '</p>';
      return;
    }
    renderPostsInto(posts, 'subscriptions-posts');
  } catch (err) {
    container.innerHTML = '<p class="muted" style="padding:24px">' + (t('noPostsSubscriptions') || 'Could not load subscriptions feed') + '</p>';
  }
}

async function toggleComments(card, postId){
  let list = card.querySelector('.comment-list');
  if (!list){
    list = document.createElement('div'); list.className='comment-list';
    const comments = await api.get(`/posts/${postId}/comments`, state.token);
    for (const c of comments){
      const div = document.createElement('div'); div.className='comment'; 
      const avatar = document.createElement('img'); avatar.src = c.avatar; avatar.className='avatar-tiny'; avatar.style.cursor='pointer';
      avatar.onclick = () => showProfile(c.user_id);
      const nameLink = document.createElement('strong'); nameLink.textContent = formatUsername(c.username); nameLink.style.cursor='pointer';
      nameLink.onclick = () => showProfile(c.user_id);
      const time = document.createElement('small'); time.textContent = new Date(c.created_at).toLocaleString();
      div.appendChild(avatar); div.appendChild(nameLink); div.appendChild(time); div.appendChild(document.createElement('div')).textContent = c.content;
      list.appendChild(div);
    }
    const add = document.createElement('div'); add.style.marginTop='8px';
    const textarea = document.createElement('input'); textarea.placeholder=t('writeComment'); textarea.style.width='70%';
    const btn = document.createElement('button'); btn.textContent='⬆️'; btn.title=t('send'); btn.onclick = async () => {
      if (!state.token) return alert(t('loginToComment'));
      const res = await api.post(`/posts/${postId}/comments`, { content: textarea.value }, state.token);
      if (res.id) { refreshCurrentFeed(); }
    };
    add.appendChild(textarea); add.appendChild(btn);
    list.appendChild(add);
    card.appendChild(list);
  } else {
    list.remove();
  }
}

document.getElementById('btn-image').onclick = () => {
  document.getElementById('post-image').click();
};

document.getElementById('post-image').onchange = (e) => {
  const file = e.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = (event) => {
      const preview = document.getElementById('image-preview');
      if (preview) preview.remove();
      const img = document.createElement('img');
      img.id = 'image-preview';
      img.src = event.target.result;
      img.style.maxWidth = '100%';
      img.style.borderRadius = '12px';
      img.style.marginBottom = '8px';
      document.getElementById('post-content').parentElement.insertBefore(img, document.getElementById('post-content').nextElementSibling);
    };
    reader.readAsDataURL(file);
  }
};

let recordedVoiceBlob = null;
let mediaRecorder = null;
let recordStream = null;

function updateVoiceHint() {
  const hint = document.getElementById('audio-file-hint');
  const statusEl = document.getElementById('voice-record-status');
  if (recordedVoiceBlob) {
    if (hint) hint.textContent = '🎤 ' + t('voiceRecorded');
    if (statusEl) { statusEl.textContent = ''; statusEl.classList.add('hidden'); statusEl.classList.remove('recording', 'recorded'); }
  } else {
    const audioInput = document.getElementById('post-audio');
    if (audioInput.files.length) {
      if (hint) hint.textContent = '🎵 ' + audioInput.files[0].name;
    } else {
      if (hint) hint.remove();
    }
    if (statusEl) statusEl.classList.add('hidden');
  }
}

document.getElementById('btn-audio').onclick = () => document.getElementById('post-audio').click();
document.getElementById('post-audio').onchange = (e) => {
  const file = e.target.files[0];
  recordedVoiceBlob = null;
  let hint = document.getElementById('audio-file-hint');
  if (hint) hint.remove();
  if (file) {
    hint = document.createElement('div');
    hint.id = 'audio-file-hint';
    hint.style.fontSize = '12px';
    hint.style.color = 'var(--muted)';
    hint.style.marginTop = '4px';
    hint.textContent = '🎵 ' + file.name;
    document.getElementById('post-content').parentElement.insertBefore(hint, document.getElementById('post-content').nextElementSibling);
  }
  updateVoiceHint();
};

document.getElementById('btn-video').onclick = () => document.getElementById('post-video').click();
document.getElementById('post-video').onchange = (e) => {
  const file = e.target.files[0];
  let hint = document.getElementById('video-file-hint');
  if (hint) hint.remove();
  if (file) {
    hint = document.createElement('div');
    hint.id = 'video-file-hint';
    hint.style.fontSize = '12px';
    hint.style.color = 'var(--muted)';
    hint.style.marginTop = '4px';
    hint.textContent = '🎬 ' + file.name;
    document.getElementById('post-content').parentElement.insertBefore(hint, document.getElementById('post-content').nextElementSibling);
  }
};

document.getElementById('btn-voice-record').onclick = async () => {
  const btn = document.getElementById('btn-voice-record');
  const statusEl = document.getElementById('voice-record-status');
  if (mediaRecorder && mediaRecorder.state === 'recording') {
    mediaRecorder.stop();
    return;
  }
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    recordStream = stream;
    const chunks = [];
    const mime = MediaRecorder.isTypeSupported('audio/webm;codecs=opus') ? 'audio/webm;codecs=opus' : 'audio/webm';
    mediaRecorder = new MediaRecorder(stream);
    mediaRecorder.ondataavailable = (e) => e.data.size && chunks.push(e.data);
    mediaRecorder.onstop = () => {
      recordStream.getTracks().forEach(t => t.stop());
      recordStream = null;
      mediaRecorder = null;
      if (chunks.length) {
        recordedVoiceBlob = new Blob(chunks, { type: mime });
        let hint = document.getElementById('audio-file-hint');
        if (!hint) {
          hint = document.createElement('div');
          hint.id = 'audio-file-hint';
          hint.style.fontSize = '12px';
          hint.style.color = 'var(--muted)';
          hint.style.marginTop = '4px';
          document.getElementById('post-content').parentElement.insertBefore(hint, document.getElementById('post-content').nextElementSibling);
        }
        hint.textContent = '🎤 ' + t('voiceRecorded');
        document.getElementById('post-audio').value = '';
      }
      if (statusEl) { statusEl.classList.add('hidden'); statusEl.textContent = ''; statusEl.classList.remove('recording', 'recorded'); }
      btn.title = t('recordVoiceTitle');
      btn.textContent = '🎤';
    };
    mediaRecorder.start(200);
    btn.textContent = '⏹';
    btn.title = t('stopRecord');
    if (statusEl) {
      statusEl.textContent = t('recording');
      statusEl.classList.remove('hidden');
      statusEl.classList.add('recording');
    }
  } catch (err) {
    console.error(err);
    alert(t('noMic'));
  }
};

document.getElementById('btn-post').onclick = async () => {
  if (!state.token) return alert(t('loginToPost'));
  const content = document.getElementById('post-content').value;
  const imageInput = document.getElementById('post-image');
  const audioInput = document.getElementById('post-audio');
  const videoInput = document.getElementById('post-video');
  const hasImage = imageInput.files.length > 0;
  const hasAudio = !!recordedVoiceBlob || audioInput.files.length > 0;
  const hasVideo = videoInput.files.length > 0;
  if (!content && !hasImage && !hasAudio && !hasVideo) return alert('Please write something or add media');
  
  try {
    let res;
    if (hasImage || hasAudio || hasVideo) {
      const formData = new FormData();
      formData.append('content', content);
      if (hasImage) formData.append('image', imageInput.files[0]);
      if (recordedVoiceBlob) {
        const ext = (recordedVoiceBlob.type || '').includes('ogg') ? 'ogg' : 'webm';
        formData.append('audio', recordedVoiceBlob, 'voice.' + ext);
      } else if (audioInput.files.length) formData.append('audio', audioInput.files[0]);
      if (hasVideo) formData.append('video', videoInput.files[0]);
      res = await api.postFormData('/posts/with-media', formData, state.token);
    } else {
      res = await api.post('/posts', { content }, state.token);
    }
    
    if (res.id) {
      document.getElementById('post-content').value = '';
      imageInput.value = '';
      audioInput.value = '';
      videoInput.value = '';
      recordedVoiceBlob = null;
      const preview = document.getElementById('image-preview');
      if (preview) preview.remove();
      const audioHint = document.getElementById('audio-file-hint');
      if (audioHint) audioHint.remove();
      const videoHint = document.getElementById('video-file-hint');
      if (videoHint) videoHint.remove();
      updateVoiceHint();
      loadPosts();
    } else {
      alert(res.error || 'Error publishing post');
    }
  } catch (err) {
    console.error('Error:', err);
    alert('Error publishing post: ' + err.message);
  }
};

async function showProfile(userId) {
  const res = await api.get(`/users/${userId}`, state.token);
  if (!res.id) return alert('User not found');
  const modal = document.createElement('div'); modal.className='modal-root profile-fullpage';
  const card = document.createElement('div'); card.className='modal-card'; card.style.overflowY='auto';
  const close = document.createElement('button'); close.textContent = '✕'; close.style.position = 'absolute'; close.style.top='8px'; close.style.right='8px'; close.style.background='transparent'; close.style.border='none'; close.style.cursor='pointer'; close.style.fontSize='20px';
  close.onclick = () => modal.remove();
  const avatar = document.createElement('img'); avatar.src = res.avatar; avatar.className='avatar-large'; avatar.style.cursor = state.token && state.user.id === userId ? 'pointer' : 'default';
  if (state.token && state.user.id === userId) avatar.onclick = showAvatarUpload;
  const username = document.createElement('h2'); username.textContent = formatUsername(res.username);
  const bio = document.createElement('p'); bio.textContent = res.bio || '(no bio)'; bio.style.color = 'var(--muted)';
  
  // Add subscribers count
  const subscribersDiv = document.createElement('div'); subscribersDiv.style.marginBottom = '12px';
  const subscribersBtn = document.createElement('button'); subscribersBtn.textContent = `👥 ${res.subscribers || 0} ${t('subscribers')}`; subscribersBtn.className = 'link'; subscribersBtn.style.marginRight = '12px';
  subscribersDiv.appendChild(subscribersBtn);
  
  // Add subscribe/unsubscribe button if not own profile
  let subscribeBtn = null;
  if (state.token && state.user.id !== userId) {
    subscribeBtn = document.createElement('button');
    subscribeBtn.textContent = res.isSubscribed ? t('unsubscribe') : t('subscribe');
    subscribeBtn.className = res.isSubscribed ? 'link' : 'btn-primary';
    subscribeBtn.onclick = async () => {
      const endpoint = res.isSubscribed ? `/unsubscribe/${userId}` : `/subscribe/${userId}`;
      const result = await api.post(endpoint, {}, state.token);
      if (result.subscribed !== undefined) {
        res.isSubscribed = result.subscribed;
        subscribeBtn.textContent = res.isSubscribed ? t('unsubscribe') : t('subscribe');
        subscribeBtn.className = res.isSubscribed ? 'link' : 'btn-primary';
      }
    };
    subscribersDiv.appendChild(subscribeBtn);
  }
  
  const editBtn = state.token && state.user.id === userId ? document.createElement('button') : null;
  if (editBtn) { editBtn.textContent = t('editProfile'); editBtn.onclick = showEditProfile; }
  const postsTitle = document.createElement('h3'); postsTitle.textContent = `${t('post')}s (${res.posts.length})`;
  const postsList = document.createElement('div');
  for (const p of res.posts) {
    const postDiv = document.createElement('div'); postDiv.className='card'; postDiv.style.marginTop='8px';
    postDiv.innerHTML = `<strong>${p.content}</strong><br><small>${new Date(p.created_at).toLocaleString()}</small>`;
    postsList.appendChild(postDiv);
  }
  card.appendChild(close); card.appendChild(avatar); card.appendChild(username); card.appendChild(bio); card.appendChild(subscribersDiv);
  if (editBtn) card.appendChild(editBtn);
  card.appendChild(postsTitle); card.appendChild(postsList);
  modal.appendChild(card);
  modal.addEventListener('click', (e)=>{ if (e.target === modal) modal.remove(); });
  document.body.prepend(modal);
}

function showAvatarUpload() {
  const { root } = makeModal(`<h2>Change Avatar</h2><input id="avatar-file" type="file" accept="image/*"><button id="avatar-submit">Upload</button><button id="avatar-cancel">Cancel</button>`);
  document.getElementById('avatar-cancel').onclick = () => root.remove();
  document.getElementById('avatar-submit').onclick = async () => {
    const fileInput = document.getElementById('avatar-file');
    if (!fileInput.files || fileInput.files.length === 0) return alert('Please select a file');
    const formData = new FormData();
    formData.append('avatar', fileInput.files[0]);
    const res = await api.postFormData('/users/avatar', formData, state.token);
    if (res.id) {
      state.user.avatar = res.avatar;
      localStorage.setItem('user', JSON.stringify(state.user));
      root.remove();
      loadPosts();
      alert('Avatar updated');
    } else {
      alert(res.error || 'Failed to upload avatar');
    }
  };
}

function showEditProfile() {
  const { root } = makeModal(`<h2>Edit Profile</h2><textarea id="bio-text" placeholder="Bio" style="width:100%;height:80px">${state.user.bio || ''}</textarea><button id="bio-submit">Save</button><button id="bio-cancel">Cancel</button>`);
  // Делает модалку редактирования поверх модалки профиля
  root.style.zIndex = '10000';

  document.getElementById('bio-cancel').onclick = () => root.remove();
  document.getElementById('bio-submit').onclick = async () => {
    const bio = document.getElementById('bio-text').value;
    const trimmed = bio.trim();
    if (!trimmed) return alert('Bio required');
    const res = await api.put('/users/profile', { bio: trimmed }, state.token);
    if (res.id) {
      state.user.bio = res.bio;
      localStorage.setItem('user', JSON.stringify(state.user));
      root.remove();
      loadPosts();
      alert('Bio updated');
    }
  };
}

async function showNotifications() {
  const response = await api.get('/notifications', state.token);
  const notifications = Array.isArray(response) ? response : [];
  const modal = document.createElement('div'); modal.className='modal-root';
  const card = document.createElement('div'); card.className='modal-card'; card.style.width='500px'; card.style.maxHeight='80vh'; card.style.overflowY='auto';
  const close = document.createElement('button'); close.textContent = '✕'; close.style.position = 'absolute'; close.style.top='8px'; close.style.right='8px'; close.style.background='transparent'; close.style.border='none'; close.style.cursor='pointer'; close.style.fontSize='20px';
  close.onclick = () => modal.remove();
  const title = document.createElement('h2'); title.textContent = t('notifications');
  const markAllBtn = document.createElement('button'); markAllBtn.textContent = t('markAllAsRead'); markAllBtn.style.marginBottom='12px';
  markAllBtn.onclick = async () => {
    await api.post('/notifications/mark-all-read', {}, state.token);
    modal.remove();
    showNotifications();
  };
  
  card.appendChild(close);
  card.appendChild(title);
  if (notifications.length > 0) {
    card.appendChild(markAllBtn);
  }
  
  if (notifications.length === 0) {
    const emptyMsg = document.createElement('p'); emptyMsg.textContent = t('noNotifications'); emptyMsg.style.color = 'var(--muted)'; emptyMsg.style.textAlign = 'center';
    card.appendChild(emptyMsg);
  } else {
    const notifList = document.createElement('div');
    for (const n of notifications) {
      const notifDiv = document.createElement('div');
      notifDiv.className = 'card';
      notifDiv.style.marginBottom = '8px';
      notifDiv.style.padding = '12px';
      if (n.is_read) notifDiv.style.opacity = '0.6';
      
      const avatar = document.createElement('img');
      avatar.src = n.avatar;
      avatar.className = 'avatar-tiny';
      avatar.style.cursor = 'pointer';
      avatar.style.marginRight = '8px';
      avatar.onclick = () => { modal.remove(); showProfile(n.from_user_id); };
      
      const content = document.createElement('div');
      content.style.flex = '1';
      
      const userName = document.createElement('strong');
      userName.textContent = formatUsername(n.username);
      userName.style.cursor = 'pointer';
      userName.onclick = () => { modal.remove(); showProfile(n.from_user_id); };
      
      let message = '';
      if (n.type === 'subscribe') {
        message = ` ${t('subscribedYou')}`;
      } else if (n.type === 'new_post') {
        message = ` ${t('postedNew')}`;
        if (n.post_content) {
          message += `: "${n.post_content.substring(0, 50)}${n.post_content.length > 50 ? '...' : ''}"`;
        }
      }
      
      const msgSpan = document.createElement('span');
      msgSpan.textContent = message;
      
      const time = document.createElement('small');
      time.textContent = new Date(n.created_at).toLocaleString();
      time.style.display = 'block';
      time.style.marginTop = '4px';
      time.style.color = 'var(--muted)';
      
      const wrapper = document.createElement('div');
      wrapper.style.display = 'flex';
      wrapper.style.alignItems = 'flex-start';
      wrapper.appendChild(avatar);
      const textDiv = document.createElement('div');
      textDiv.style.flex = '1';
      textDiv.appendChild(userName);
      textDiv.appendChild(msgSpan);
      textDiv.appendChild(time);
      wrapper.appendChild(textDiv);
      
      if (!n.is_read) {
        const markBtn = document.createElement('button');
        markBtn.textContent = '✓';
        markBtn.style.background = 'transparent';
        markBtn.style.border = 'none';
        markBtn.style.cursor = 'pointer';
        markBtn.style.fontSize = '16px';
        markBtn.onclick = async (e) => {
          e.stopPropagation();
          await api.post(`/notifications/${n.id}/read`, {}, state.token);
          modal.remove();
          showNotifications();
        };
        wrapper.appendChild(markBtn);
      }
      
      notifDiv.appendChild(wrapper);
      notifList.appendChild(notifDiv);
    }
    card.appendChild(notifList);
  }
  
  modal.appendChild(card);
  modal.addEventListener('click', (e)=>{ if (e.target === modal) modal.remove(); });
  document.body.prepend(modal);

  // Обновляем индикатор на вкладке уведомлений
  const unreadCount = notifications.filter(n => !n.is_read).length;
  updateNotificationsTab(unreadCount);
}

async function loadNotificationsPage() {
  const response = await api.get('/notifications', state.token);
  const notifications = Array.isArray(response) ? response : [];
  const container = document.getElementById('notifications-container');
  
  if (!container) {
    console.error('notifications-container not found');
    return;
  }
  
  container.innerHTML = '';
  
  if (notifications.length === 0) {
    const emptyMsg = document.createElement('div');
    emptyMsg.style.textAlign = 'center';
    emptyMsg.style.padding = '40px 20px';
    emptyMsg.style.color = 'var(--muted)';
    emptyMsg.innerHTML = `<div style="font-size:48px;margin-bottom:16px">📭</div><p>${t('noNotifications')}</p>`;
    container.appendChild(emptyMsg);
    return;
  }

  // Обновляем индикатор на вкладке уведомлений
  const unreadCount = notifications.some ? notifications.filter(n => !n.is_read).length : 0;
  updateNotificationsTab(unreadCount);
  
  if (notifications.some(n => !n.is_read)) {
    const markAllBtn = document.createElement('button');
    markAllBtn.textContent = t('markAllAsRead');
    markAllBtn.className = 'btn-primary';
    markAllBtn.style.marginBottom = '16px';
    markAllBtn.onclick = async () => {
      await api.post('/notifications/mark-all-read', {}, state.token);
      loadNotificationsPage();
    };
    container.appendChild(markAllBtn);
  }
  
  for (const n of notifications) {
    const notifDiv = document.createElement('div');
    notifDiv.className = 'card';
    notifDiv.style.display = 'flex';
    notifDiv.style.alignItems = 'flex-start';
    notifDiv.style.gap = '12px';
    if (n.is_read) notifDiv.style.opacity = '0.6';
    
    const avatar = document.createElement('img');
    avatar.src = n.avatar;
    avatar.className = 'avatar-small';
    avatar.style.cursor = 'pointer';
    avatar.style.flexShrink = '0';
    avatar.onclick = (e) => { e.stopPropagation(); showProfile(n.from_user_id); };
    
    const textDiv = document.createElement('div');
    textDiv.style.flex = '1';
    
    const userName = document.createElement('strong');
    userName.textContent = formatUsername(n.username);
    userName.style.cursor = 'pointer';
    userName.onclick = (e) => { e.stopPropagation(); showProfile(n.from_user_id); };
    
    let message = '';
    if (n.type === 'subscribe') {
      message = ` ${t('subscribedYou')}`;
    } else if (n.type === 'new_post') {
      message = ` ${t('postedNew')}`;
      if (n.post_content) {
        message += `: "${n.post_content.substring(0, 60)}${n.post_content.length > 60 ? '...' : ''}"`;
      }
    }
    
    const msgSpan = document.createElement('span');
    msgSpan.textContent = message;
    if (n.type === 'new_post') {
      msgSpan.style.cursor = 'pointer';
      msgSpan.style.textDecoration = 'underline';
      msgSpan.title = t('viewInSubscriptions') || 'View in Subscriptions';
      msgSpan.onclick = (e) => { e.stopPropagation(); switchPage('subscriptions'); };
    }
    
    const time = document.createElement('small');
    time.textContent = new Date(n.created_at).toLocaleString();
    time.style.display = 'block';
    time.style.marginTop = '4px';
    time.style.color = 'var(--muted)';
    
    textDiv.appendChild(userName);
    textDiv.appendChild(msgSpan);
    textDiv.appendChild(time);
    
    if (!n.is_read) {
      const markBtn = document.createElement('button');
      markBtn.textContent = '✓';
      markBtn.style.background = 'transparent';
      markBtn.style.border = 'none';
      markBtn.style.cursor = 'pointer';
      markBtn.style.fontSize = '16px';
      markBtn.style.flexShrink = '0';
      markBtn.onclick = async (e) => {
        e.stopPropagation();
        await api.post(`/notifications/${n.id}/read`, {}, state.token);
        loadNotificationsPage();
      };
      notifDiv.appendChild(markBtn);
    }
    
    notifDiv.appendChild(avatar);
    notifDiv.appendChild(textDiv);
    container.appendChild(notifDiv);
  }
}

function updateNotificationsTab(count) {
  const notificationsTab = document.getElementById('tab-notifications');
  if (!notificationsTab) return;
  const label = t('notifications');
  if (count && count > 0) {
    notificationsTab.textContent = `🔔 ${label} (${count})`;
    notificationsTab.classList.add('has-unread');
  } else {
    notificationsTab.textContent = `🪧 ${label}`;
    notificationsTab.classList.remove('has-unread');
  }
}

async function refreshNotificationsIndicator() {
  if (!state.token) {
    updateNotificationsTab(0);
    return;
  }
  try {
    const response = await api.get('/notifications', state.token);
    const notifications = Array.isArray(response) ? response : [];
    const unreadCount = notifications.filter(n => !n.is_read).length;
    updateNotificationsTab(unreadCount);
  } catch (err) {
    console.error('Failed to refresh notifications indicator', err);
  }
}

// language and theme wiring
const langSelect = document.getElementById('lang-select');
if (langSelect) {
  langSelect.value = state.lang;
  langSelect.onchange = () => { state.lang = langSelect.value; localStorage.setItem('lang', state.lang); renderAuth(); loadPosts(); };
}

const themeBtn = document.getElementById('theme-toggle');
const savedTheme = localStorage.getItem('theme') || 'light';
applyTheme(savedTheme);
if (themeBtn) {
  themeBtn.textContent = savedTheme === 'dark' ? '☀️' : '🌙';
  themeBtn.onclick = () => {
    const next = (localStorage.getItem('theme') === 'dark') ? 'light' : 'dark';
    applyTheme(next);
    themeBtn.textContent = next === 'dark' ? '☀️' : '🌙';
  };
}

// Set up tab switching
const feedTab = document.getElementById('tab-feed');
if (feedTab) {
  feedTab.textContent = `📰 ${t('feed')}`;
  feedTab.onclick = () => switchPage('feed');
}

const subscriptionsTab = document.getElementById('tab-subscriptions');
if (subscriptionsTab) {
  subscriptionsTab.textContent = `🧑‍🤝‍🧑 ${t('subscriptions')}`;
  subscriptionsTab.onclick = () => switchPage('subscriptions');
}

const notificationsTab = document.getElementById('tab-notifications');
if (notificationsTab) {
  notificationsTab.textContent = `🪧 ${t('notifications')}`;
  notificationsTab.onclick = () => switchPage('notifications');
}

const voiceRecordBtn = document.getElementById('btn-voice-record');
if (voiceRecordBtn) {
  voiceRecordBtn.title = t('recordVoiceTitle');
  if (typeof MediaRecorder === 'undefined') voiceRecordBtn.style.display = 'none';
}

switchPage('feed');
renderAuth();
loadPosts();
startAutoRefresh();
refreshNotificationsIndicator();
