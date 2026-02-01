const google = window.google;
const api = {
  req: (path, opts = {}) => fetch('/api' + path, opts).then(r => r.json()),
  get: (path, token) => api.req(path, token ? { headers: { Authorization: 'Bearer ' + token } } : {}),
  post: (path, body, token) => api.req(path, { method: 'POST', headers: Object.assign({ 'Content-Type': 'application/json' }, token ? { Authorization: 'Bearer ' + token } : {}), body: JSON.stringify(body) }),
  postFormData: (path, formData, token) => api.req(path, { method: 'POST', headers: Object.assign({}, token ? { Authorization: 'Bearer ' + token } : {}), body: formData })
};

const reactions = {
  like: { emoji: '👍', label: { en: 'Like', ru: 'Нравится' } },
  love: { emoji: '❤️', label: { en: 'Love', ru: 'Люблю' } },
  funny: { emoji: '😂', label: { en: 'Funny', ru: 'Смешно' } },
  poop: { emoji: '💩', label: { en: 'Poop', ru: 'Фу' } }
};

const i18n = {
  en: {
    login: 'Login', register: 'Register', logout: 'Logout', hi: 'Hi,', welcome: 'Welcome', postPlaceholder: "What's happening?", post: 'Post', comments: 'Comments', writeComment: 'Write a comment', send: 'Send', create: 'Create', cancel: 'Cancel', loginFailed: 'Login failed', regFailed: 'Registration failed', loginTitle: 'Sign in', registerTitle: 'Create account', reactLike: 'Like', reactLove: 'Love', reactFunny: 'Funny', loginToReact: 'Login to react', loginToComment: 'Login to comment', loginToPost: 'Login to post', subscribe: 'Subscribe', unsubscribe: 'Unsubscribe', subscribers: 'Subscribers', editProfile: 'Edit Profile', notifications: 'Notifications', noNotifications: 'No notifications', markAllAsRead: 'Mark all as read', subscribedYou: 'subscribed to you', postedNew: 'posted a new post', feed: 'Feed', messages: 'Messages', noMessages: 'No messages', typeMessage: 'Type a message...', sendMessage: 'Send Message'
  },
  ru: {
    login: 'Вход', register: 'Регистрация', logout: 'Выход', hi: 'Привет,', welcome: 'Добро пожаловать', postPlaceholder: 'Что нового?', post: 'Опубликовать', comments: 'Комментарии', writeComment: 'Написать комментарий', send: 'Отправить', create: 'Создать', cancel: 'Отмена', loginFailed: 'Ошибка входа', regFailed: 'Ошибка регистрации', loginTitle: 'Вход', registerTitle: 'Создать аккаунт', reactLike: 'Нравится', reactLove: 'Люблю', reactFunny: 'Смешно', loginToReact: 'Войдите чтобы реагировать', loginToComment: 'Войдите чтобы комментировать', loginToPost: 'Войдите чтобы публиковать', subscribe: 'Подписаться', unsubscribe: 'Отписаться', subscribers: 'Подписчики', editProfile: 'Редактировать профиль', notifications: 'Уведомления', noNotifications: 'Нет уведомлений', markAllAsRead: 'Отметить все как прочитанные', subscribedYou: 'подписался на вас', postedNew: 'опубликовал новый пост', feed: 'Лента', messages: 'Сообщения', noMessages: 'Нет сообщений', typeMessage: 'Напишите сообщение...', sendMessage: 'Написать сообщение'
  }
};

const state = {
  token: localStorage.getItem('token'),
  user: JSON.parse(localStorage.getItem('user') || 'null'),
  lang: localStorage.getItem('lang') || (navigator.language && navigator.language.startsWith('ru') ? 'ru' : 'en'),
  currentPage: 'feed'
};

function applyTheme(theme){
  if (theme === 'dark') document.documentElement.setAttribute('data-theme','dark'); else document.documentElement.removeAttribute('data-theme');
  localStorage.setItem('theme', theme);
}

function switchPage(page) {
  state.currentPage = page;
  const feedPage = document.getElementById('feed-page');
  const messagesPage = document.getElementById('messages-page');
  const notificationsPage = document.getElementById('notifications-page');
  const feedTab = document.getElementById('tab-feed');
  const messagesTab = document.getElementById('tab-messages');
  const notificationsTab = document.getElementById('tab-notifications');
  
  // Remove active from all
  feedPage?.classList.remove('active');
  messagesPage?.classList.remove('active');
  notificationsPage?.classList.remove('active');
  feedTab?.classList.remove('active');
  messagesTab?.classList.remove('active');
  notificationsTab?.classList.remove('active');
  
  if (page === 'feed') {
    feedPage?.classList.add('active');
    feedTab?.classList.add('active');
  } else if (page === 'messages') {
    messagesPage?.classList.add('active');
    messagesTab?.classList.add('active');
    loadDialogsPage();
  } else if (page === 'notifications') {
    notificationsPage?.classList.add('active');
    notificationsTab?.classList.add('active');
    loadNotificationsPage();
  }
}

function setAuth(token, user){ state.token = token; state.user = user; localStorage.setItem('token', token); localStorage.setItem('user', JSON.stringify(user)); renderAuth(); loadPosts(); }
function clearAuth(){ state.token = null; state.user = null; localStorage.removeItem('token'); localStorage.removeItem('user'); switchPage('feed'); renderAuth(); loadPosts(); }

function t(k){ return i18n[state.lang][k] || k }

function renderAuth(){
  const area = document.getElementById('auth-area');
  area.innerHTML = '';
  const profileBtn = document.getElementById('profile-btn');
  const messagesTab = document.getElementById('tab-messages');
  const notificationsTab = document.getElementById('tab-notifications');
  if (!state.user) {
    const loginBtn = document.createElement('button'); loginBtn.textContent = t('login'); loginBtn.className='link';
    loginBtn.onclick = showLogin;
    const regBtn = document.createElement('button'); regBtn.textContent=t('register'); regBtn.onclick = showRegister; regBtn.style.marginLeft='8px';
    area.appendChild(loginBtn); area.appendChild(regBtn);
    const cp = document.getElementById('create-post'); if (cp) cp.classList.add('hidden');
    if (profileBtn) profileBtn.classList.add('hidden');
    if (messagesTab) messagesTab.classList.add('hidden');
    if (notificationsTab) notificationsTab.classList.add('hidden');
  } else {
    const span = document.createElement('div'); span.textContent = `${t('hi')} ${state.user.username}`;
    const out = document.createElement('button'); out.textContent=t('logout'); out.onclick = () => clearAuth();
    area.appendChild(span); area.appendChild(out);
    const cp = document.getElementById('create-post'); if (cp) cp.classList.remove('hidden');
    if (profileBtn) {
      profileBtn.classList.remove('hidden');
      profileBtn.onclick = () => showProfile(state.user.id);
    }
    if (messagesTab) {
      messagesTab.classList.remove('hidden');
    }
    if (notificationsTab) {
      notificationsTab.classList.remove('hidden');
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
  const { root } = makeModal(`<h2>${t('registerTitle')}</h2><input id="rg-user" placeholder="username"><input id="rg-pass" type="password" placeholder="password"><div class="actions"><button id="rg-cancel">${t('cancel')}</button><button id="rg-submit">${t('create')}</button></div>`);
  document.getElementById('rg-cancel').onclick = () => root.remove();
  document.getElementById('rg-submit').onclick = async () => {
    const username = document.getElementById('rg-user').value;
    const password = document.getElementById('rg-pass').value;
    const res = await api.post('/register', { username, password });
    if (res.token) setAuth(res.token, { username: res.username, id: res.id }); else alert(res.error || t('regFailed'));
    root.remove();
  };
}

async function loadPosts(){
  const headers = state.token ? { Authorization: 'Bearer ' + state.token } : {};
  const posts = await fetch('/api/posts', { headers }).then(r => r.json());
  const el = document.getElementById('posts'); el.innerHTML = '';
  for (const p of posts){
    const card = document.createElement('div'); card.className='card post';
    const meta = document.createElement('div'); meta.className='meta'; 
    const avatar = document.createElement('img'); avatar.src = p.avatar; avatar.className='avatar-small'; avatar.style.cursor='pointer';
    avatar.onclick = () => showProfile(p.user_id);
    const userLink = document.createElement('strong'); userLink.textContent = p.username; userLink.style.cursor='pointer';
    userLink.onclick = () => showProfile(p.user_id);
    const time = document.createElement('div'); time.textContent = new Date(p.created_at).toLocaleString();
    meta.appendChild(avatar); meta.appendChild(userLink); meta.appendChild(time);
    const content = document.createElement('div'); content.className='content'; content.textContent = p.content;
    const imageDiv = document.createElement('div');
    if (p.image) {
      const img = document.createElement('img');
      img.src = p.image;
      img.style.maxWidth = '100%';
      img.style.borderRadius = '12px';
      img.style.marginTop = '8px';
      imageDiv.appendChild(img);
    }
    const reactionsDiv = document.createElement('div'); reactionsDiv.className='reactions';
    const types = ['like','love','funny','poop'];
    types.forEach(typeKey => {
      const btn = document.createElement('button');
      const emoji = reactions[typeKey].emoji;
      const count = p.reactions && p.reactions[typeKey] ? p.reactions[typeKey] : 0;
      btn.textContent = `${emoji} ${count}`;
      btn.title = reactions[typeKey].label[state.lang];
      btn.className = 'reaction-btn';
      if (p.userReactions && p.userReactions.includes(typeKey)) {
        btn.classList.add('active');
      }
      btn.onclick = async () => {
        if (!state.token) return alert(t('loginToReact'));
        await api.post(`/posts/${p.id}/reaction`, { type: typeKey }, state.token);
        loadPosts();
      };
      reactionsDiv.appendChild(btn);
    });
    const commentsBtn = document.createElement('button'); commentsBtn.textContent = `💬 ${p.comments||0}`; commentsBtn.className = 'reaction-btn'; commentsBtn.title = t('comments');
    commentsBtn.onclick = () => toggleComments(card, p.id);
    reactionsDiv.appendChild(commentsBtn);

    card.appendChild(meta); card.appendChild(content); card.appendChild(imageDiv); card.appendChild(reactionsDiv);
    el.appendChild(card);
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
      const nameLink = document.createElement('strong'); nameLink.textContent = c.username; nameLink.style.cursor='pointer';
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
      if (res.id) { loadPosts(); }
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

document.getElementById('btn-post').onclick = async () => {
  if (!state.token) return alert(t('loginToPost'));
  const content = document.getElementById('post-content').value;
  const fileInput = document.getElementById('post-image');
  if (!content && !fileInput.files.length) return alert('Please write something or add an image');
  
  try {
    let res;
    if (fileInput.files.length > 0) {
      // Upload with image
      const formData = new FormData();
      formData.append('content', content);
      formData.append('image', fileInput.files[0]);
      res = await api.postFormData('/posts/with-image', formData, state.token);
    } else {
      // Upload without image
      res = await api.post('/posts', { content }, state.token);
    }
    
    if (res.id) {
      document.getElementById('post-content').value = '';
      fileInput.value = '';
      const preview = document.getElementById('image-preview');
      if (preview) preview.remove();
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
  const modal = document.createElement('div'); modal.className='modal-root';
  const card = document.createElement('div'); card.className='modal-card'; card.style.width='500px'; card.style.maxHeight='80vh'; card.style.overflowY='auto';
  const close = document.createElement('button'); close.textContent = '✕'; close.style.position = 'absolute'; close.style.top='8px'; close.style.right='8px'; close.style.background='transparent'; close.style.border='none'; close.style.cursor='pointer'; close.style.fontSize='20px';
  close.onclick = () => modal.remove();
  const avatar = document.createElement('img'); avatar.src = res.avatar; avatar.className='avatar-large'; avatar.style.cursor = state.token && state.user.id === userId ? 'pointer' : 'default';
  if (state.token && state.user.id === userId) avatar.onclick = showAvatarUpload;
  const username = document.createElement('h2'); username.textContent = res.username;
  const bio = document.createElement('p'); bio.textContent = res.bio || '(no bio)'; bio.style.color = 'var(--muted)';
  
  // Add subscribers count
  const subscribersDiv = document.createElement('div'); subscribersDiv.style.marginBottom = '12px';
  const subscribersBtn = document.createElement('button'); subscribersBtn.textContent = `👥 ${res.subscribers || 0} ${t('subscribers')}`; subscribersBtn.className = 'link'; subscribersBtn.style.marginRight = '12px';
  subscribersDiv.appendChild(subscribersBtn);
  
  // Add subscribe/unsubscribe button if not own profile
  let subscribeBtn = null;
  let messageBtn = null;
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
    
    messageBtn = document.createElement('button');
    messageBtn.textContent = t('sendMessage');
    messageBtn.className = 'btn-primary';
    messageBtn.style.marginLeft = '8px';
    messageBtn.onclick = () => {
      modal.remove();
      currentChatUserId = userId;
      switchPage('messages');
      setTimeout(() => openDialog(userId, res.username, res.avatar), 100);
    };
    subscribersDiv.appendChild(messageBtn);
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
  document.getElementById('bio-cancel').onclick = () => root.remove();
  document.getElementById('bio-submit').onclick = async () => {
    const bio = document.getElementById('bio-text').value;
    if (!bio) return alert('Bio required');
    const res = await api.post('/users/profile', { bio }, state.token);
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
  const response = await api.get('/api/notifications', state.token);
  const notifications = Array.isArray(response) ? response : [];
  const modal = document.createElement('div'); modal.className='modal-root';
  const card = document.createElement('div'); card.className='modal-card'; card.style.width='500px'; card.style.maxHeight='80vh'; card.style.overflowY='auto';
  const close = document.createElement('button'); close.textContent = '✕'; close.style.position = 'absolute'; close.style.top='8px'; close.style.right='8px'; close.style.background='transparent'; close.style.border='none'; close.style.cursor='pointer'; close.style.fontSize='20px';
  close.onclick = () => modal.remove();
  const title = document.createElement('h2'); title.textContent = t('notifications');
  const markAllBtn = document.createElement('button'); markAllBtn.textContent = t('markAllAsRead'); markAllBtn.style.marginBottom='12px';
  markAllBtn.onclick = async () => {
    await api.post('/api/notifications/mark-all-read', {}, state.token);
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
      userName.textContent = n.username;
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
          await api.post(`/api/notifications/${n.id}/read`, {}, state.token);
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
}

async function loadNotificationsPage() {
  const response = await api.get('/api/notifications', state.token);
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
  
  if (notifications.some(n => !n.is_read)) {
    const markAllBtn = document.createElement('button');
    markAllBtn.textContent = t('markAllAsRead');
    markAllBtn.className = 'btn-primary';
    markAllBtn.style.marginBottom = '16px';
    markAllBtn.onclick = async () => {
      await api.post('/api/notifications/mark-all-read', {}, state.token);
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
    avatar.onclick = () => showProfile(n.from_user_id);
    
    const textDiv = document.createElement('div');
    textDiv.style.flex = '1';
    
    const userName = document.createElement('strong');
    userName.textContent = n.username;
    userName.style.cursor = 'pointer';
    userName.onclick = () => showProfile(n.from_user_id);
    
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
        await api.post(`/api/notifications/${n.id}/read`, {}, state.token);
        loadNotificationsPage();
      };
      notifDiv.appendChild(markBtn);
    }
    
    notifDiv.appendChild(avatar);
    notifDiv.appendChild(textDiv);
    container.appendChild(notifDiv);
  }
}

let currentChatUserId = null;

async function loadDialogsPage() {
  const dialogs = await api.get('/api/dialogs', state.token);
  const dialogsList = document.getElementById('dialogs-list');
  dialogsList.innerHTML = '';
  
  if (!Array.isArray(dialogs) || dialogs.length === 0) {
    const emptyMsg = document.createElement('div');
    emptyMsg.style.textAlign = 'center';
    emptyMsg.style.padding = '20px 10px';
    emptyMsg.style.color = 'var(--muted)';
    emptyMsg.textContent = t('noMessages');
    dialogsList.appendChild(emptyMsg);
    return;
  }
  
  for (const dialog of dialogs) {
    const dialogDiv = document.createElement('div');
    dialogDiv.style.padding = '12px';
    dialogDiv.style.borderBottom = '1px solid #e6f4ef';
    dialogDiv.style.cursor = 'pointer';
    dialogDiv.style.display = 'flex';
    dialogDiv.style.gap = '8px';
    dialogDiv.style.alignItems = 'center';
    
    const avatar = document.createElement('img');
    avatar.src = dialog.avatar;
    avatar.className = 'avatar-small';
    
    const info = document.createElement('div');
    info.style.flex = '1';
    
    const name = document.createElement('div');
    name.style.fontWeight = 'bold';
    name.style.fontSize = '14px';
    name.textContent = dialog.username;
    
    const lastMsg = document.createElement('small');
    lastMsg.style.color = 'var(--muted)';
    lastMsg.style.display = 'block';
    lastMsg.textContent = dialog.last_message_content ? dialog.last_message_content.substring(0, 30) + '...' : '(no messages)';
    
    info.appendChild(name);
    info.appendChild(lastMsg);
    
    dialogDiv.appendChild(avatar);
    dialogDiv.appendChild(info);
    
    dialogDiv.onclick = () => openDialog(dialog.user_id, dialog.username, dialog.avatar);
    dialogsList.appendChild(dialogDiv);
  }
}

async function openDialog(userId, username, avatar) {
  currentChatUserId = userId;
  const header = document.getElementById('chat-header');
  header.innerHTML = `<div style="display:flex;gap:8px;align-items:center"><img src="${avatar}" class="avatar-small"><div>${username}</div></div>`;
  
  await loadMessages(userId);
}

async function loadMessages(userId) {
  const response = await api.get(`/api/messages/${userId}`, state.token);
  const messages = Array.isArray(response) ? response : [];
  const messagesList = document.getElementById('messages-list');
  messagesList.innerHTML = '';
  
  for (const msg of messages) {
    const msgDiv = document.createElement('div');
    msgDiv.style.marginBottom = '12px';
    msgDiv.style.display = 'flex';
    msgDiv.style.justifyContent = msg.from_user_id === state.user.id ? 'flex-end' : 'flex-start';
    
    const msgBubble = document.createElement('div');
    msgBubble.style.maxWidth = '70%';
    msgBubble.style.padding = '8px 12px';
    msgBubble.style.borderRadius = '12px';
    msgBubble.style.backgroundColor = msg.from_user_id === state.user.id ? 'var(--green-500)' : '#e6f4ef';
    msgBubble.style.color = msg.from_user_id === state.user.id ? 'white' : 'inherit';
    msgBubble.textContent = msg.content;
    
    const timeDiv = document.createElement('small');
    timeDiv.style.display = 'block';
    timeDiv.style.marginTop = '4px';
    timeDiv.style.color = 'var(--muted)';
    timeDiv.style.fontSize = '12px';
    timeDiv.textContent = new Date(msg.created_at).toLocaleTimeString();
    
    msgDiv.appendChild(msgBubble);
    msgDiv.appendChild(timeDiv);
    messagesList.appendChild(msgDiv);
  }
  
  messagesList.scrollTop = messagesList.scrollHeight;
  await api.post(`/api/messages/${userId}/read`, {}, state.token);
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

const messagesTab = document.getElementById('tab-messages');
if (messagesTab) {
  messagesTab.textContent = `💬 ${t('messages')}`;
  messagesTab.onclick = () => switchPage('messages');
}

const notificationsTab = document.getElementById('tab-notifications');
if (notificationsTab) {
  notificationsTab.textContent = `🔔 ${t('notifications')}`;
  notificationsTab.onclick = () => switchPage('notifications');
}

// Set up message sending
const sendBtn = document.getElementById('send-message-btn');
if (sendBtn) {
  sendBtn.textContent = t('send');
  sendBtn.onclick = async () => {
    if (!currentChatUserId) return alert(t('noMessages'));
    const input = document.getElementById('message-input');
    const content = input.value.trim();
    if (!content) return;
    
    try {
      const result = await api.post(`/api/messages/${currentChatUserId}`, { content }, state.token);
      if (result && result.success) {
        input.value = '';
        await loadMessages(currentChatUserId);
      } else {
        console.error('Failed to send message:', result);
        alert('Failed to send message');
      }
    } catch (err) {
      console.error('Error sending message:', err);
      alert('Error sending message: ' + (err.message || 'Unknown error'));
    }
  };
}

const msgInput = document.getElementById('message-input');
if (msgInput) {
  msgInput.placeholder = t('typeMessage');
}

renderAuth();
loadPosts();
