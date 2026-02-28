
const reactions = {
  like: { emoji: '👍', label: { en: 'Like', ru: 'Лайк' } },
  love: { emoji: '❤️', label: { en: 'Love', ru: 'Нравиться' } },
  funny: { emoji: '😂', label: { en: 'Funny', ru: "хаха" } },
  poop: { emoji: '💩', label: { en: 'Poop', ru: 'Фу' } },
  clown: { emoji: '🤡', label: { en: 'Clown', ru: 'Ужас' }}
};

const pollsConfig = [
  {
    id: 'welcome-poll',
    question: {
      en: 'What feature should we add next?',
      ru: 'Что добавить в Green Social дальше?'
    },
    options: [
      {
        id: 'more-reactions',
        label: { en: 'More reactions', ru: 'Больше реакций' }
      },
      {
        id: 'better-themes',
        label: { en: 'More themes', ru: 'Больше тем оформления' }
      },
      {
        id: 'direct-messages',
        label: { en: 'Direct messages', ru: 'Личные сообщения' }
      }
    ]
  }
];

const i18n = {
  en: {
    login: 'Login', register: 'Register', logout: 'Logout', hi: 'Yo,', welcome: 'Welcome', postPlaceholder: "Bro, whats wrong or send meme :)", post: 'Publish', publishedPosts: 'Published posts', comments: 'Comments', writeComment: 'Write a comment', send: 'Send', create: 'Create', cancel: 'Cancel', loginFailed: 'Login failed', regFailed: 'Registration failed', loginTitle: 'Sign in', registerTitle: 'Create account', reactLike: 'Like', reactLove: 'Love', reactFunny: 'Funny', loginToReact: 'Login to react', loginToComment: 'Login to comment', loginToPost: 'Login to post', subscribe: 'Subscribe', unsubscribe: 'Unsubscribe', subscribers: 'Subscribers', editProfile: 'Edit Profile', notifications: 'Notifications', noNotifications: 'No notifications', markAllAsRead: 'Mark all as read', subscribedYou: 'subscribed to you', postedNew: 'posted a new post', feed: 'Feed', subscriptions: 'Subscriptions', messages: 'Messages', noMessages: 'No messages', typeMessage: 'Type a message...', sendMessage: 'Send Message',
    passwordRequirements: 'At least 8 characters, one uppercase, one lowercase, one digit, one special character',
    password_min_length: 'Password must be at least 8 characters',
    password_need_upper: 'Password must contain at least one uppercase letter',
    password_need_lower: 'Password must contain at least one lowercase letter',
    password_need_digit: 'Password must contain at least one digit',
    password_confirm_mismatch: 'Passwords do not match',
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
    DeletePost: 'Delete post',
    EditPost: 'Edit post',
    deleteConfirm: 'Delete this post?',
    deleteError: 'Failed to delete post',
    editError: 'Failed to edit post',
    saveChanges: 'Save changes',
    searchUserById: 'Search user',
    userIdPlaceholder: 'User ID',
    userNotFound: 'User not found',
    profileId: 'ID',
    createSystemNotification: 'Create system notification',
    systemNotification: 'System notification',
    youSubscribed: 'You subscribed',
    unsubscribeConfirm: 'Unsubscribe from this user?',
    forgotPassword: 'Forgot password?',
    recoveryCode: 'Recovery code',
    recoveryCodeHint: 'This code is shown only once. Save it to be able to reset your password.',
    recoveryCodeTitle: 'Save your recovery code',
    recoveryCodeLabel: 'Your recovery code:',
    resetPassword: 'Reset password',
    newPassword: 'New password',
    repeatNewPassword: 'Repeat new password',
    resetSuccess: 'Password has been reset. Use the new password to login.',
    invalidRecovery: 'Invalid username or recovery code',
    missingFields: 'Please fill in all fields',
    newRecoveryCodeInfo: 'Your new recovery code:',
    editPost: 'Edit post',
    saveChanges: 'Save changes',
    contentRequired: 'Please write something',
    addPoll: 'Add poll',
    pollQuestionPlaceholder: 'Poll question',
    pollOptionPlaceholder: 'Option',
    addPollOption: 'Add option',
    totalVotes: 'Total votes',
    loginToVote: 'Login to vote in polls',
    languageLabel: 'Language',
    themeLabel: 'Theme',
    newStory: 'New story',
    toggleTheme: 'Toggle theme',
    addImage: 'Add image',
    addAudio: 'Add audio',
    addVideo: 'Add video',
    categoryTextPlaceholder: 'Category text (optional)',
    editorBold: 'Bold',
    editorItalic: 'Italic',
    editorUnderline: 'Underline',
    editorList: 'Bullet list',
    editorQuote: 'Quote',
    editorClear: 'Clear formatting',
    editorListLabel: 'List'
  },
  ru: {
    login: 'Вход', register: 'Регистрация', logout: 'Выход', hi: 'Йоу,', welcome: 'Добро пожаловать', postPlaceholder: 'Что нового?', post: 'Опубликовать', publishedPosts: 'Опубликованные посты', comments: 'Комментарии', writeComment: 'Написать комментарий', send: 'Отправить', create: 'Создать', cancel: 'Отмена', loginFailed: 'Ошибка входа', regFailed: 'Ошибка регистрации', loginTitle: 'Вход', registerTitle: 'Создать аккаунт', reactLike: 'Нравится', reactLove: 'Люблю', reactFunny: 'Смешно', loginToReact: 'Войдите чтобы реагировать', loginToComment: 'Войдите чтобы комментировать', loginToPost: 'Войдите чтобы публиковать', subscribe: 'Подписаться', unsubscribe: 'Отписаться', subscribers: 'Подписчики', editProfile: 'Редактировать профиль', notifications: 'Уведомления', noNotifications: 'Нет уведомлений', markAllAsRead: 'Отметить все как прочитанные', subscribedYou: 'подписался на вас', postedNew: 'опубликовал новый пост', feed: 'Лента', subscriptions: 'Подписки', messages: 'Сообщения', noMessages: 'Нет сообщений', typeMessage: 'Напишите сообщение...', sendMessage: 'Написать сообщение',
    passwordRequirements: 'Минимум 8 символов, заглавная и строчная буква, цифра и спецсимвол',
    password_min_length: 'Пароль должен быть не короче 8 символов',
    password_need_upper: 'В пароле должна быть хотя бы одна заглавная буква',
    password_need_lower: 'В пароле должна быть хотя бы одна строчная буква',
    password_need_digit: 'В пароле должна быть хотя бы одна цифра',
    password_confirm_mismatch: 'Пароли не совпадают',
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
    DeletePost: 'Удалить пост',
    EditPost: 'Редактировать пост',
    deleteConfirm: 'Удалить этот пост?',
    deleteError: 'Не удалось удалить пост',
    editError: 'Не удалось отредактировать пост',
    saveChanges: 'Сохранить изменения',
    searchUserById: 'Найти пользователя',
    userIdPlaceholder: 'ID пользователя',
    userNotFound: 'Пользователь не найден',
    profileId: 'ID',
    createSystemNotification: 'Создать системное уведомление',
    systemNotification: 'Системное уведомление',
    youSubscribed: 'Вы подписаны',
    unsubscribeConfirm: 'Отписаться от пользователя?',
    forgotPassword: 'Забыли пароль?',
    recoveryCode: 'Код восстановления',
    recoveryCodeHint: 'Этот код показывается только один раз. Сохраните его, чтобы можно было восстановить доступ.',
    recoveryCodeTitle: 'Сохраните код восстановления',
    recoveryCodeLabel: 'Ваш код восстановления:',
    resetPassword: 'Сбросить пароль',
    newPassword: 'Новый пароль',
    repeatNewPassword: 'Повторите новый пароль',
    resetSuccess: 'Пароль сброшен. Используйте новый пароль для входа.',
    invalidRecovery: 'Неверный логин или код восстановления',
    missingFields: 'Заполните все поля',
    newRecoveryCodeInfo: 'Ваш новый код восстановления:',
    editPost: 'Редактировать пост',
    saveChanges: 'Сохранить',
    contentRequired: 'Нужно что-то написать',
    addPoll: 'Добавить опрос',
    pollQuestionPlaceholder: 'Вопрос опроса',
    pollOptionPlaceholder: 'Вариант',
    addPollOption: 'Добавить вариант',
    totalVotes: 'Всего голосов',
    loginToVote: 'Войдите, чтобы голосовать в опросах',
    languageLabel: 'Язык',
    themeLabel: 'Тема',
    newStory: 'Новая история',
    toggleTheme: 'Сменить тему',
    addImage: 'Добавить изображение',
    addAudio: 'Добавить аудио',
    addVideo: 'Добавить видео',
    categoryTextPlaceholder: 'Текст категории (необязательно)',
    editorBold: 'Жирный',
    editorItalic: 'Курсив',
    editorUnderline: 'Подчёркивание',
    editorList: 'Список',
    editorQuote: 'Цитата',
    editorClear: 'Очистить форматирование',
    editorListLabel: 'Список'
  }
};

function validatePassword(p) {
  if (p.length < 6) return { ok: false, error: 'password_min_length' };
  if (!/[A-Z]/.test(p)) return { ok: false, error: 'password_need_upper' };
  if (!/[a-z]/.test(p)) return { ok: false, error: 'password_need_lower' };
  if (!/[0-9]/.test(p)) return { ok: false, error: 'password_need_digit' };
  return { ok: true };
}

function generateStrongPassword(length=8) {
  const upper = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const lower = 'abcdefghijklmnopqrstuvwxyz';
  const numbers = '0123456789';
  const specials = '!@#$%^&*_-+=';
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
  currentPage: 'feed',
  currentCategoryFilter: null
};

let allFeedPosts = [];

function renderHeaderUserAvatar() {
  const avatarEl = document.getElementById('user-avatar');
  if (!avatarEl) return;

  if (!state.user) {
    avatarEl.classList.add('hidden');
    avatarEl.src = '';
    avatarEl.onclick = null;
    return;
  }

  avatarEl.classList.remove('hidden');
  avatarEl.onclick = () => showProfile(state.user.id);

  avatarEl.src = state.user.avatar || '/default-avatar.png';
}

async function ensureCurrentUserAvatar() {
  if (!state.user || !state.user.id) return;
  if (state.user.avatar) {
    renderHeaderUserAvatar();
    return;
  }
  try {
    const res = await api.get(`/users/${state.user.id}`, state.token);
    if (res && res.avatar) {
      state.user.avatar = res.avatar;
      localStorage.setItem('user', JSON.stringify(state.user));
      renderHeaderUserAvatar();
    }
  } catch (e) {
    // ignore
  }
}

const api = {
  async get(path, token) {
    const headers = {};
    if (token) headers.Authorization = 'Bearer ' + token;
    const r = await fetch('/api' + path, { headers });
    return r.json().catch(() => ({}));
  },
  async post(path, body, token) {
    const headers = { 'Content-Type': 'application/json' };
    if (token) headers.Authorization = 'Bearer ' + token;
    const r = await fetch('/api' + path, { method: 'POST', headers, body: JSON.stringify(body) });
    return r.json().catch(() => ({}));
  },
  async put(path, body, token) {
    const headers = { 'Content-Type': 'application/json' };
    if (token) headers.Authorization = 'Bearer ' + token;
    const r = await fetch('/api' + path, { method: 'PUT', headers, body: JSON.stringify(body) });
    return r.json().catch(() => ({}));
  },
  async postFormData(path, formData, token) {
    const headers = {};
    if (token) headers.Authorization = 'Bearer ' + token;
    const r = await fetch('/api' + path, { method: 'POST', headers, body: formData });
    return r.json().catch(() => ({}));
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
  const profilePage = document.getElementById('profile-page');
  const messagesPage = document.getElementById('messages-page');
  const feedTab = document.getElementById('tab-feed');
  const subscriptionsTab = document.getElementById('tab-subscriptions');
  const notificationsTab = document.getElementById('tab-notifications');
  const messagesTab = document.getElementById('tab-messages');

  feedPage?.classList.remove('active');
  subscriptionsPage?.classList.remove('active');
  notificationsPage?.classList.remove('active');
  profilePage?.classList.remove('active');
  messagesPage?.classList.remove('active');
  feedTab?.classList.remove('active');
  subscriptionsTab?.classList.remove('active');
  notificationsTab?.classList.remove('active');
  messagesTab?.classList.remove('active');

  if (page === 'feed') {
    feedPage?.classList.add('active');
    feedTab?.classList.add('active');
  } else if (page === 'subscriptions') {
    subscriptionsPage?.classList.add('active');
    subscriptionsTab?.classList.add('active');
    loadSubscriptionsUsers();
    loadSubscriptionsPosts();
  } else if (page === 'notifications') {
    notificationsPage?.classList.add('active');
    notificationsTab?.classList.add('active');
    loadNotificationsPage();
  } else if (page === 'profile') {
    profilePage?.classList.add('active');
  } else if (page === 'messages') {
    messagesPage?.classList.add('active');
    messagesTab?.classList.add('active');
    loadMessagesPage();
  }
}

function setAuth(token, user){ state.token = token; state.user = user; localStorage.setItem('token', token); localStorage.setItem('user', JSON.stringify(user)); renderAuth(); loadPosts(); }
function clearAuth(){ state.token = null; state.user = null; localStorage.removeItem('token'); localStorage.removeItem('user'); switchPage('feed'); renderAuth(); loadPosts(); }

function t(k){ return i18n[state.lang][k] || k }

function applyUiText() {
  const newStoryBtn = document.getElementById('btn-new-story');
  if (newStoryBtn) newStoryBtn.title = t('newStory');

  const settingsLanguageLabel = document.getElementById('settings-language-label');
  if (settingsLanguageLabel) settingsLanguageLabel.textContent = t('languageLabel');

  const settingsThemeLabel = document.getElementById('settings-theme-label');
  if (settingsThemeLabel) settingsThemeLabel.textContent = t('themeLabel');

  const themeBtn = document.getElementById('theme-toggle');
  if (themeBtn) themeBtn.title = t('toggleTheme');

  const postEditor = document.getElementById('post-editor');
  if (postEditor && postEditor.dataset) postEditor.dataset.placeholder = t('postPlaceholder');

  const postCategoryText = document.getElementById('post-category-text');
  if (postCategoryText) postCategoryText.placeholder = t('categoryTextPlaceholder');

  const btnImage = document.getElementById('btn-image');
  if (btnImage) btnImage.title = t('addImage');
  const btnAudio = document.getElementById('btn-audio');
  if (btnAudio) btnAudio.title = t('addAudio');
  const btnVideo = document.getElementById('btn-video');
  if (btnVideo) btnVideo.title = t('addVideo');

  const pollToggleBtn = document.getElementById('poll-toggle-btn');
  const pollFields = document.getElementById('poll-fields');
  if (pollToggleBtn && pollFields) {
    const isHidden = pollFields.classList.contains('hidden');
    pollToggleBtn.textContent = (isHidden ? '+ ' : '× ') + t('addPoll');
  }

  const pollQuestionInput = document.getElementById('poll-question');
  if (pollQuestionInput) pollQuestionInput.placeholder = t('pollQuestionPlaceholder');

  const pollOptionsContainer = document.getElementById('poll-options');
  if (pollOptionsContainer) {
    const optionInputs = pollOptionsContainer.querySelectorAll('.poll-option-input');
    optionInputs.forEach((inp, idx) => {
      const n = idx + 1;
      inp.placeholder = n <= 2 ? `${t('pollOptionPlaceholder')} ${n}` : t('pollOptionPlaceholder');
    });
  }

  const addPollOptionBtn = document.getElementById('add-poll-option');
  if (addPollOptionBtn) addPollOptionBtn.textContent = '+ ' + t('addPollOption');

  // Editor toolbars (create + modals)
  document.querySelectorAll('.editor-toolbar').forEach(toolbar => {
    toolbar.querySelectorAll('.editor-btn').forEach(btn => {
      const cmd = btn.dataset.cmd;
      if (cmd === 'bold') btn.title = t('editorBold');
      else if (cmd === 'italic') btn.title = t('editorItalic');
      else if (cmd === 'underline') btn.title = t('editorUnderline');
      else if (cmd === 'insertUnorderedList') {
        btn.title = t('editorList');
        btn.textContent = '• ' + t('editorListLabel');
      }
      else if (cmd === 'formatBlock') btn.title = t('editorQuote');
      else if (cmd === 'removeFormat') btn.title = t('editorClear');
    });
  });
}

function formatUsername(name) {
  return name === 'blau3' ? name + ' 🔧' : name;
}

function renderAuth(){
  const area = document.getElementById('auth-area');
  area.innerHTML = '';
  if (!state.user) {
    const loginBtn = document.createElement('button');
    loginBtn.textContent = t('login');
    loginBtn.className = 'link';
    loginBtn.onclick = showLogin;

    const regBtn = document.createElement('button');
    regBtn.textContent = t('register');
    regBtn.className = 'link';
    regBtn.style.marginLeft = '8px';
    regBtn.onclick = showRegister;

    area.appendChild(loginBtn);
    area.appendChild(regBtn);
    const cp = document.getElementById('create-post'); if (cp) cp.classList.add('hidden');
  } else {
    const cp = document.getElementById('create-post'); if (cp) cp.classList.remove('hidden');
    ensureCurrentUserAvatar();
  }
  const logoutBtn = document.getElementById('logout-btn');
  if (logoutBtn) {
    if (state.user) {
      logoutBtn.classList.remove('hidden');
      logoutBtn.textContent = t('logout');
      logoutBtn.onclick = () => {
        clearAuth();
        closeSettingsMenu();
      };
    } else {
      logoutBtn.classList.add('hidden');
      logoutBtn.onclick = null;
    }
  }
  const welcomeEl = document.getElementById('welcome'); if (welcomeEl) welcomeEl.textContent = t('welcome');
  renderHeaderUserAvatar();
  renderSettingsMenu();
}

function renderSettingsMenu() {
  const menu = document.getElementById('settings-menu');
  if (!menu) return;

  let logoutRow = document.getElementById('settings-logout-row');

  if (state.user) {
    if (!logoutRow) {
      logoutRow = document.createElement('div');
      logoutRow.id = 'settings-logout-row';
      logoutRow.className = 'settings-row';

      const label = document.createElement('span');
      label.className = 'settings-label';
      const btn = document.createElement('button');
      btn.id = 'settings-logout-btn';
      btn.type = 'button';

      logoutRow.appendChild(label);
      logoutRow.appendChild(btn);
      menu.appendChild(logoutRow);
    }

    const labelEl = logoutRow.querySelector('.settings-label');
    const btnEl = logoutRow.querySelector('button');
    if (labelEl) {
      labelEl.textContent = state.lang === 'ru' ? 'Аккаунт' : 'Account';
    }
    if (btnEl) {
      btnEl.textContent = t('logout');
      btnEl.onclick = () => {
        clearAuth();
        closeSettingsMenu();
      };
    }
  } else if (logoutRow) {
    logoutRow.remove();
  }
}

function showBotCheck(onSuccess){
  const a = 1 + Math.floor(Math.random() * 9);
  const b = 1 + Math.floor(Math.random() * 9);
  const sum = a + b;
  const title = state.lang === 'ru' ? 'Проверка, что вы не бот' : 'Bot check';
  const question = state.lang === 'ru'
    ? `Сколько будет ${a} + ${b}?`
    : `What is ${a} + ${b}?`;
  const errorMsg = state.lang === 'ru'
    ? 'Неверный ответ, попробуйте ещё раз'
    : 'Wrong answer, please try again';

  const { root } = makeModal(`
    <h2>${title}</h2>
    <p>${question}</p>
    <input id="bot-answer" type="number" placeholder="${state.lang === 'ru' ? 'Введите сумму' : 'Enter the sum'}">
    <div class="actions">
      <button data-role="cancel">${t('cancel')}</button>
      <button data-role="ok" class="btn-primary">OK</button>
    </div>
  `);
  const answerEl = root.querySelector('#bot-answer');
  const cancelBtn = root.querySelector('button[data-role="cancel"]');
  const okBtn = root.querySelector('button[data-role="ok"]');

  function tryCheck() {
    const value = parseInt(answerEl.value, 10);
    if (value === sum) {
      root.remove();
      if (typeof onSuccess === 'function') onSuccess();
    } else {
      showAlert(errorMsg);
    }
  }

  if (cancelBtn) cancelBtn.onclick = () => root.remove();
  if (okBtn) okBtn.onclick = () => tryCheck();
  if (answerEl) {
    answerEl.onkeydown = (e) => {
      if (e.key === 'Enter') tryCheck();
    };
    answerEl.focus();
  }
}

function makeModal(innerHtml, options){
  const root = document.createElement('div'); root.className='modal-root';
  const card = document.createElement('div'); card.className='modal-card';
  card.innerHTML = innerHtml;
  root.appendChild(card);
  document.body.appendChild(root);
  const closeOnBackdrop = !options || options.closeOnBackdrop !== false;
  if (closeOnBackdrop) {
    // allow closing when clicking outside
    root.addEventListener('click', (e)=>{ if (e.target === root) root.remove(); });
  }
  return { root, card };
}

function getPollsVotes() {
  try {
    const raw = localStorage.getItem('pollsVotes') || '{}';
    return JSON.parse(raw);
  } catch (e) {
    return {};
  }
}

function savePollsVotes(votes) {
  try {
    localStorage.setItem('pollsVotes', JSON.stringify(votes));
  } catch (e) {
    // ignore
  }
}

function showPollsMenu() {
  const votes = getPollsVotes();
  const lang = state.lang || 'ru';

  const poll = pollsConfig[0];
  const questionText = poll.question[lang] || poll.question.en;

  const { root, card } = makeModal(`
    <h2>${questionText}</h2>
    <div id="poll-options" class="poll-options"></div>
    <p id="poll-message" class="muted" style="margin-top:8px;font-size:13px"></p>
    <div class="actions" style="margin-top:16px">
      <button data-role="close">${t('cancel')}</button>
    </div>
  `);

  const optionsContainer = card.querySelector('#poll-options');
  const messageEl = card.querySelector('#poll-message');
  const closeBtn = card.querySelector('button[data-role="close"]');

  if (closeBtn) {
    closeBtn.onclick = () => root.remove();
  }

  if (!optionsContainer) return;

  const currentVote = votes[poll.id] || null;

  poll.options.forEach((opt) => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'poll-option-btn';
    btn.textContent = opt.label[lang] || opt.label.en;
    btn.style.display = 'block';
    btn.style.width = '100%';
    btn.style.textAlign = 'left';
    btn.style.marginTop = '8px';

    if (currentVote === opt.id) {
      btn.classList.add('selected');
    }

    btn.onclick = () => {
      const newVotes = getPollsVotes();
      newVotes[poll.id] = opt.id;
      savePollsVotes(newVotes);

      optionsContainer.querySelectorAll('.poll-option-btn').forEach((b) => {
        b.classList.remove('selected');
      });
      btn.classList.add('selected');

      if (messageEl) {
        messageEl.textContent =
          lang === 'ru'
            ? 'Спасибо, ваш голос учтён (локально на этом устройстве).'
            : 'Thanks, your vote is saved locally on this device.';
      }
    };

    optionsContainer.appendChild(btn);
  });
}

function showAlert(message, opts){
  const options = opts || {};
  const title = options.title || (state.lang === 'ru' ? 'Сообщение' : 'Message');
  const okLabel = options.okLabel || (state.lang === 'ru' ? 'ОК' : 'OK');
  const { root } = makeModal(`
    <h2>${title}</h2>
    <p>${message}</p>
    <div class="actions">
      <button data-role="ok" class="btn-primary">${okLabel}</button>
    </div>
  `);
  const okBtn = root.querySelector('button[data-role="ok"]');
  if (okBtn) okBtn.onclick = () => root.remove();
}

let toastCounter = 0;

function ensureToastContainer() {
  let container = document.getElementById('toast-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toast-container';
    container.className = 'toast-container';
    document.body.appendChild(container);
  }
  return container;
}

function showToast(message) {
  if (!message) return;
  const container = ensureToastContainer();
  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.dataset.id = String(++toastCounter);

  const text = document.createElement('div');
  text.className = 'toast-message';
  text.textContent = message;

  const closeBtn = document.createElement('button');
  closeBtn.type = 'button';
  closeBtn.className = 'toast-close';
  closeBtn.textContent = '×';
  closeBtn.onclick = () => {
    toast.classList.add('toast-hide');
    setTimeout(() => toast.remove(), 200);
  };

  toast.appendChild(text);
  toast.appendChild(closeBtn);
  container.appendChild(toast);

  setTimeout(() => {
    if (!document.body.contains(toast)) return;
    toast.classList.add('toast-hide');
    setTimeout(() => toast.remove(), 200);
  }, 5000);
}

function showConfirm(message, opts){
  const options = opts || {};
  const title = options.title || (state.lang === 'ru' ? 'Подтверждение' : 'Confirm');
  const okLabel = options.okLabel || (state.lang === 'ru' ? 'Да' : 'Yes');
  const cancelLabel = options.cancelLabel || (state.lang === 'ru' ? 'Нет' : 'No');
  return new Promise(resolve => {
    const { root } = makeModal(`
      <h2>${title}</h2>
      <p>${message}</p>
      <div class="actions">
        <button data-role="cancel">${cancelLabel}</button>
        <button data-role="ok" class="btn-primary">${okLabel}</button>
      </div>
    `, { closeOnBackdrop: false });
    const okBtn = root.querySelector('button[data-role="ok"]');
    const cancelBtn = root.querySelector('button[data-role="cancel"]');
    if (okBtn) okBtn.onclick = () => { root.remove(); resolve(true); };
    if (cancelBtn) cancelBtn.onclick = () => { root.remove(); resolve(false); };
    // fallback: resolve as "false" if modal somehow gets removed without clicking
    const observer = new MutationObserver(() => {
      if (!document.body.contains(root)) {
        resolve(false);
        observer.disconnect();
      }
    });
    observer.observe(document.body, { childList: true });
  });
}

function showLogin(){
  const { root } = makeModal(`
    <h2>${t('loginTitle')}</h2>
    <input id="li-user" placeholder="username">
    <div style="display:flex;gap:5px;margin-bottom:8px;align-items:center;">
      <input id="li-pass" type="password" placeholder="password" style="flex:1;">
      <button
        id="li-pass-toggle"
        type="button"
        style="font-size:14px;padding:4px 8px;"
        title="Show password"
      >
        👁
      </button>
    </div>
    <div class="actions">
      <button id="li-cancel">${t('cancel')}</button>
      <button id="li-submit">${t('login')}</button>
    </div>
    <button id="li-forgot" class="link" type="button" style="margin-top:8px">${t('forgotPassword')}</button>
  `);
  const userInput = document.getElementById('li-user');
  const passInput = document.getElementById('li-pass');
  const toggleBtn = document.getElementById('li-pass-toggle');

  document.getElementById('li-cancel').onclick = () => root.remove();
  document.getElementById('li-submit').onclick = async () => {
    const username = userInput.value;
    const password = passInput.value;
    const res = await api.post('/login', { username, password });
    if (res.token) {
      setAuth(res.token, { username: res.username, id: res.id });
      root.remove();
      window.location.href = '/';
    } else {
      showAlert(res.error || t('loginFailed'));
    }
  };

  if (toggleBtn && passInput) {
    toggleBtn.onclick = () => {
      const isHidden = passInput.type === 'password';
      passInput.type = isHidden ? 'text' : 'password';
      toggleBtn.textContent = isHidden ? '🙈' : '👁';
      toggleBtn.title = isHidden ? 'Hide password' : 'Show password';
    };
  }
  const forgotBtn = document.getElementById('li-forgot');
  if (forgotBtn) {
    forgotBtn.onclick = () => {
      root.remove();
      showPasswordReset();
    };
  }
}

function showRegister(){
  const { root } = makeModal(`
    <h2>${t('registerTitle')}</h2>
    <input id="rg-user" placeholder="username">
    <div style="display: flex; gap: 5px; margin-bottom: 8px; align-items: center;">
      <input id="rg-pass" type="password" placeholder="password" style="flex: 1;">
      <button
        id="rg-toggle"
        type="button"
        style="font-size: 14px; padding: 4px 8px;"
        title="Show password"
      >
        👁
      </button>
      <button
        id="rg-generate"
        type="button"
        style="font-size: 11px; padding: 4px 8px; white-space: nowrap;"
      >
        Сгенерировать пароль
      </button>
    </div>
    <input id="rg-pass2" type="password" placeholder="repeat password" style="margin-bottom: 4px;">
    <div class="password-hint">${t('passwordRequirements')}</div>
    <div class="actions">
      <button id="rg-cancel">${t('cancel')}</button>
      <button id="rg-submit">${t('create')}</button>
    </div>
  `);

  const passInput = document.getElementById('rg-pass');
  const passRepeatInput = document.getElementById('rg-pass2');
  const toggleBtn = document.getElementById('rg-toggle');
  const generateBtn = document.getElementById('rg-generate');

  if (generateBtn) {
    generateBtn.onclick = () => {
      const newPassword = generateStrongPassword(12);
      if (passInput) passInput.value = newPassword;
      if (passRepeatInput) passRepeatInput.value = newPassword;
    };
  }

  if (toggleBtn && passInput && passRepeatInput) {
    toggleBtn.onclick = () => {
      const isHidden = passInput.type === 'password';
      passInput.type = isHidden ? 'text' : 'password';
      passRepeatInput.type = isHidden ? 'text' : 'password';
      toggleBtn.textContent = isHidden ? '🙈' : '👁';
      toggleBtn.title = isHidden ? 'Hide password' : 'Show password';
    };
  }

  document.getElementById('rg-cancel').onclick = () => root.remove();
  document.getElementById('rg-submit').onclick = async () => {
    const username = document.getElementById('rg-user').value.trim();
    const password = document.getElementById('rg-pass').value;
    const password2 = document.getElementById('rg-pass2').value;
    if (!username) { showAlert(t('usernameRequired')); return; }
    if (!password || !password2 || password !== password2) {
      showAlert(t('password_confirm_mismatch'));
      return;
    }
    const pwCheck = validatePassword(password);
    if (!pwCheck.ok) {
      showAlert(t(pwCheck.error));
      return;
    }
    const res = await api.post('/register', { username, password });
    if (res.token) {
      root.remove();
      showBotCheck(() => {
        setAuth(res.token, { username: res.username, id: res.id });
        if (res.recoveryToken) {
          showAlert(`${t('recoveryCodeTitle')}\n\n${t('recoveryCodeLabel')} ${res.recoveryToken}\n\n${t('recoveryCodeHint')}`);
        }
        window.location.href = '/';
      });
    } else {
      showAlert(t(res.error) || res.error || t('regFailed'));
      root.remove();
    }
  };
}

function showPasswordReset() {
  const { root } = makeModal(`
    <h2>${t('resetPassword')}</h2>
    <input id="rp-user" placeholder="username">
    <input id="rp-code" placeholder="${t('recoveryCode')}">
    <input id="rp-pass" type="password" placeholder="${t('newPassword')}">
    <input id="rp-pass2" type="password" placeholder="${t('repeatNewPassword')}">
    <div class="actions">
      <button id="rp-cancel">${t('cancel')}</button>
      <button id="rp-submit">${t('resetPassword')}</button>
    </div>
  `);
  document.getElementById('rp-cancel').onclick = () => root.remove();
  document.getElementById('rp-submit').onclick = async () => {
    const username = document.getElementById('rp-user').value.trim();
    const code = document.getElementById('rp-code').value.trim();
    const password = document.getElementById('rp-pass').value;
    const password2 = document.getElementById('rp-pass2').value;
    if (!username || !code || !password || !password2) {
      showAlert(t('missingFields'));
      return;
    }
    if (password !== password2) {
      showAlert(t('password_confirm_mismatch'));
      return;
    }
    const pwCheck = validatePassword(password);
    if (!pwCheck.ok) {
      showAlert(t(pwCheck.error));
      return;
    }
    const res = await api.post('/password-reset', {
      username,
      recoveryToken: code,
      newPassword: password
    });
    if (res.success) {
      showAlert(`${t('resetSuccess')}${res.recoveryToken ? `\n\n${t('newRecoveryCodeInfo')} ${res.recoveryToken}` : ''}`);
      root.remove();
    } else {
      showAlert(t(res.error) || res.error || t('invalidRecovery'));
    }
  };
}

function refreshCurrentFeed() {
  if (state.currentPage === 'subscriptions') loadSubscriptionsPosts();
  else loadPosts();
}

const AUTO_REFRESH_INTERVAL_MS = 30000; // 30 seconds

function autoRefreshCurrentPage() {
  if (state.currentPage === 'feed') {
    loadPosts();
    loadStories();
  }
  else if (state.currentPage === 'subscriptions') loadSubscriptionsPosts();
  else if (state.currentPage === 'notifications') loadNotificationsPage();
  else if (state.currentPage === 'messages') loadMessagesPage();

  refreshNotificationsIndicator();
  refreshMessagesIndicator();
  checkNewEventsForToasts();
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

async function loadStories() {
  if (!state.token) {
    const bar = document.getElementById('stories-bar');
    if (bar) {
      bar.innerHTML = '';
      bar.classList.add('hidden');
    }
    return;
  }
  try {
    const stories = await api.get('/stories', state.token);
    renderStories(stories || []);
  } catch (e) {
    console.error('Failed to load stories', e);
  }
}

function renderStories(stories) {
  const bar = document.getElementById('stories-bar');
  if (!bar) return;
  bar.innerHTML = '';
  if (!stories.length) {
    bar.classList.add('hidden');
    return;
  }
  bar.classList.remove('hidden');
  for (const s of stories) {
    const item = document.createElement('button');
    item.type = 'button';
    item.className = 'story-item';
    const ring = document.createElement('div');
    ring.className = 'story-avatar-ring';
    const img = document.createElement('img');
    img.src = s.avatar || '/default-avatar.png';
    ring.appendChild(img);
    const name = document.createElement('div');
    name.className = 'story-username';
    name.textContent = s.username;
    item.appendChild(ring);
    item.appendChild(name);
    item.onclick = () => showStoryModal(s);
    bar.appendChild(item);
  }
}

function showStoryModal(story) {
  const created = new Date(story.created_at).toLocaleString();
  const mediaPart = story.media
    ? `<div style="margin-top:8px">${renderStoryMediaHtml(story.media)}</div>`
    : '';
  const contentPart = story.content
    ? `<p style="margin-top:8px; white-space:pre-wrap">${story.content}</p>`
    : '';
  const { root } = makeModal(`
    <h2>${formatUsername(story.username)}</h2>
    <small class="muted">${created}</small>
    ${contentPart}
    ${mediaPart}
    <div class="actions">
      <button data-role="close" class="btn-primary">OK</button>
    </div>
  `);
  const closeBtn = root.querySelector('button[data-role="close"]');
  if (closeBtn) closeBtn.onclick = () => root.remove();
}

function renderStoryMediaHtml(url) {
  const lower = url.toLowerCase();
  if (lower.endsWith('.mp3') || lower.endsWith('.wav') || lower.endsWith('.ogg') || lower.endsWith('.webm')) {
    return `<audio src="${url}" controls style="width:100%;margin-top:4px"></audio>`;
  }
  return `<audio src="${url}" controls style="width:100%;margin-top:4px"></audio>`;
}

function renderPollBlock(poll, postId) {
  const wrap = document.createElement('div');
  wrap.className = 'poll-block';
  wrap.dataset.pollId = poll.id;

  const question = document.createElement('div');
  question.className = 'poll-question';
  question.textContent = poll.question;
  wrap.appendChild(question);

  const totalVotes = poll.options.reduce((s, o) => s + (o.votes || 0), 0);

  function renderOptions(currentPoll) {
    wrap.querySelectorAll('.poll-option-row').forEach(el => el.remove());
    const tv = currentPoll.options.reduce((s, o) => s + (o.votes || 0), 0);

    currentPoll.options.forEach(opt => {
      const row = document.createElement('div');
      row.className = 'poll-option-row';

      const pct = tv > 0 ? Math.round((opt.votes / tv) * 100) : 0;
      const isVoted = currentPoll.userVote === opt.id;

      const bar = document.createElement('div');
      bar.className = 'poll-bar' + (isVoted ? ' poll-bar-voted' : '');
      bar.style.width = (currentPoll.userVote !== null ? pct + '%' : '0%');

      const label = document.createElement('span');
      label.className = 'poll-option-label';
      label.textContent = opt.text;

      const meta = document.createElement('span');
      meta.className = 'poll-option-meta';
      if (currentPoll.userVote !== null) {
        meta.textContent = `${pct}% (${opt.votes})`;
      }

      row.appendChild(bar);
      row.appendChild(label);
      row.appendChild(meta);

      if (isVoted) row.classList.add('poll-row-voted');

      row.onclick = async () => {
        if (!state.token) { showAlert(t('loginToReact')); return; }
        try {
          const result = await api.post(`/polls/${currentPoll.id}/vote`, { optionId: opt.id }, state.token);
          if (result && result.options) {
            currentPoll.options = result.options;
            currentPoll.userVote = result.userVote;
            renderOptions(currentPoll);
            updatePollFooter(currentPoll);
          }
        } catch (e) {
          console.error('Vote failed', e);
        }
      };

      wrap.insertBefore(row, wrap.querySelector('.poll-footer'));
    });
  }

  function updatePollFooter(currentPoll) {
    const footer = wrap.querySelector('.poll-footer');
    if (!footer) return;
    const tv = currentPoll.options.reduce((s, o) => s + (o.votes || 0), 0);
    footer.textContent = state.lang === 'ru' ? `${tv} голос(ов)` : `${tv} vote(s)`;
  }

  const footer = document.createElement('div');
  footer.className = 'poll-footer';
  wrap.appendChild(footer);

  renderOptions(poll);
  updatePollFooter(poll);

  return wrap;
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

    const leftMeta = document.createElement('div');
    leftMeta.style.display = 'flex';
    leftMeta.style.alignItems = 'center';
    leftMeta.appendChild(avatar);
    leftMeta.appendChild(userLink);

    const rightMeta = document.createElement('div');
    rightMeta.style.display = 'flex';
    rightMeta.style.flexDirection = 'column';
    rightMeta.style.alignItems = 'flex-end';
    rightMeta.appendChild(time);

    if (state.user && state.user.id !== p.user_id) {
      const subBtn = document.createElement('button');
      const updateSubBtnView = () => {
        const subscribed = !!p.isSubscribedToAuthor;
        subBtn.textContent = subscribed ? t('youSubscribed') : t('subscribe');
        subBtn.className = subscribed ? 'link subscribe-btn subscribed' : 'btn-primary subscribe-btn';
      };
      updateSubBtnView();
      subBtn.style.marginTop = '4px';
      subBtn.onclick = async (e) => {
        e.stopPropagation();
        if (!state.token) {
          showAlert(t('loginToPost'));
          return;
        }
        try {
          if (!p.isSubscribedToAuthor) {
            const result = await api.post(`/subscribe/${p.user_id}`, {}, state.token);
            if (result && result.subscribed) {
              p.isSubscribedToAuthor = true;
              updateSubBtnView();
            }
          } else {
            const confirmMsg = t('unsubscribeConfirm') || 'Unsubscribe from this user?';
            const confirmed = await showConfirm(confirmMsg);
            if (!confirmed) return;
            const result = await api.post(`/unsubscribe/${p.user_id}`, {}, state.token);
            if (result && result.subscribed === false) {
              p.isSubscribedToAuthor = false;
              updateSubBtnView();
            }
          }
        } catch (err) {
          console.error('Subscription toggle failed', err);
        }
      };
      rightMeta.appendChild(subBtn);
    }

    if (p.category) {
      const catTag = document.createElement('button');
      catTag.className = 'post-category-tag';
      catTag.textContent = '#' + p.category;
      catTag.onclick = () => {
        state.currentCategoryFilter = p.category;
        renderCategoryBar(allFeedPosts);
        renderPostsInto(getFilteredFeedPosts(), 'posts');
      };
      rightMeta.appendChild(catTag);
    }

    meta.appendChild(leftMeta);
    meta.appendChild(rightMeta);

    const content = document.createElement('div');
    content.className = 'content';
    content.innerHTML = p.content;

    if (state.user && state.user.id === p.user_id) {
      const actionsRow = document.createElement('div');
      actionsRow.className = 'post-owner-actions';
      actionsRow.style.display = 'flex';
      actionsRow.style.gap = '8px';
      actionsRow.style.marginBottom = '8px';

      const editBtn = document.createElement('button');
      editBtn.textContent = t('EditPost');
      editBtn.className = 'edit-btn';
      editBtn.title = t('EditPost');
      editBtn.onclick = (e) => {
        e.stopPropagation();
        showEditPostModal(p);
      };

      const deleteBtn = document.createElement('button');
      deleteBtn.textContent = t('DeletePost');
      deleteBtn.className = 'delete-btn';
      deleteBtn.title = t('DeletePost');
      deleteBtn.onclick = async (e) => {
        e.stopPropagation();
        const confirmed = await showConfirm(t('deleteConfirm'));
        if (!confirmed) return;
        try {
          await api.delete(`/posts/${p.id}`, state.token);
          document.getElementById(`post-${p.id}`)?.remove();
          refreshCurrentFeed();
        } catch (err) {
          showAlert(t('deleteError') + ': ' + err.message);
          console.error(err);
        }
      };

      actionsRow.appendChild(editBtn);
      actionsRow.appendChild(deleteBtn);
      card.appendChild(actionsRow);
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

    if (p.poll) {
      const pollDiv = renderPollBlock(p.poll, p.id);
      card.appendChild(imageDiv);
      card.appendChild(pollDiv);
    } else {
      card.appendChild(imageDiv);
    }

    // ── Post footer: reactions dropdown + comments ────────
    const postFooter = document.createElement('div');
    postFooter.className = 'post-footer';

    // Summary of active reactions
    const reactionSummary = document.createElement('div');
    reactionSummary.className = 'reaction-summary';

    function buildReactionSummary() {
      reactionSummary.innerHTML = '';
      const types = ['like', 'love', 'funny', 'poop', 'clown'];
      let hasAny = false;
      types.forEach(typeKey => {
        const count = p.reactions && p.reactions[typeKey] ? p.reactions[typeKey] : 0;
        if (count > 0) {
          hasAny = true;
          const chip = document.createElement('span');
          chip.className = 'reaction-chip' + (p.userReactions && p.userReactions.includes(typeKey) ? ' reaction-chip-active' : '');
          chip.textContent = `${reactions[typeKey].emoji} ${count}`;
          reactionSummary.appendChild(chip);
        }
      });
      if (!hasAny) {
        const placeholder = document.createElement('span');
        placeholder.className = 'reaction-placeholder';
        placeholder.textContent = state.lang === 'ru' ? 'Нет реакций' : 'No reactions';
        reactionSummary.appendChild(placeholder);
      }
    }
    buildReactionSummary();

    // Reaction dropdown wrapper
    const reactionWrapper = document.createElement('div');
    reactionWrapper.className = 'reaction-wrapper';

    const reactBtn = document.createElement('button');
    reactBtn.className = 'react-toggle-btn';
    reactBtn.textContent = '😊 ' + (state.lang === 'ru' ? 'Реакция' : 'React');

    const dropdown = document.createElement('div');
    dropdown.className = 'reaction-dropdown hidden';

    const types = ['like', 'love', 'funny', 'poop', 'clown'];
    types.forEach(typeKey => {
      const item = document.createElement('button');
      const count = p.reactions && p.reactions[typeKey] ? p.reactions[typeKey] : 0;
      item.className = 'reaction-dropdown-item' + (p.userReactions && p.userReactions.includes(typeKey) ? ' active' : '');
      item.innerHTML = `<span class="rd-emoji">${reactions[typeKey].emoji}</span><span class="rd-label">${reactions[typeKey].label[state.lang]}</span><span class="rd-count">${count || ''}</span>`;
      item.onclick = async (e) => {
        e.stopPropagation();
        if (!state.token) { showAlert(t('loginToReact')); dropdown.classList.add('hidden'); return; }
        await api.post(`/posts/${p.id}/reaction`, { type: typeKey }, state.token);
        dropdown.classList.add('hidden');
        refreshCurrentFeed();
      };
      dropdown.appendChild(item);
    });

    reactBtn.onclick = (e) => {
      e.stopPropagation();
      const isOpen = !dropdown.classList.contains('hidden');
      // close all other open dropdowns
      document.querySelectorAll('.reaction-dropdown').forEach(d => d.classList.add('hidden'));
      if (!isOpen) dropdown.classList.remove('hidden');
    };

    reactionWrapper.appendChild(reactBtn);
    reactionWrapper.appendChild(dropdown);

    // Comments toggle button
    const commentsToggle = document.createElement('button');
    commentsToggle.className = 'comments-toggle-btn';
    const commentCount = p.comments || 0;
    commentsToggle.textContent = `💬 ${t('comments')} (${commentCount})`;

    // Comments section (hidden by default)
    const commentsSection = document.createElement('div');
    commentsSection.className = 'comments-section hidden';

    commentsToggle.onclick = () => {
      const wasHidden = commentsSection.classList.contains('hidden');
      commentsSection.classList.toggle('hidden');
      commentsToggle.classList.toggle('active', wasHidden);
      if (wasHidden) {
        commentsSection.classList.add('comments-section-opening');
        commentsSection.addEventListener('animationend', () => {
          commentsSection.classList.remove('comments-section-opening');
        }, { once: true });
      }
      if (wasHidden && !commentsSection.dataset.loaded) {
        loadCommentsInto(commentsSection, p.id);
        commentsSection.dataset.loaded = '1';
      }
    };

    postFooter.appendChild(reactionSummary);
    postFooter.appendChild(reactionWrapper);
    postFooter.appendChild(commentsToggle);
    card.appendChild(postFooter);
    card.appendChild(commentsSection);
    el.appendChild(card);
  }
}

function computeRecommendationScore(post) {
  const now = Date.now();
  const ageHours = Math.max(1, (now - post.created_at) / (60 * 60 * 1000));
  const reactionsTotal = Object.values(post.reactions || {}).reduce((sum, v) => sum + (typeof v === 'number' ? v : 0), 0);
  const commentsCount = post.comments || 0;

  let score = 0;
  if (post.isSubscribedToAuthor) score += 20;
  score += reactionsTotal * 3;
  score += commentsCount * 2;
  score += 30 / ageHours;
  if (state.user && post.user_id === state.user.id) score -= 50;

  return score;
}

function getRecommendedPosts() {
  if (!Array.isArray(allFeedPosts) || allFeedPosts.length === 0) return [];
  const scored = allFeedPosts
    .map(p => {
      const rawScore = computeRecommendationScore(p);
      const score = Number.isFinite(rawScore) ? rawScore : -1e9;
      return { post: p, score };
    });
  if (!scored.length) return [];
  scored.sort((a, b) => b.score - a.score);
  const result = [];
  const seenIds = new Set();
  for (const item of scored) {
    if (seenIds.has(item.post.id)) continue;
    seenIds.add(item.post.id);
    result.push(item.post);
    if (result.length >= 3) break;
  }
  return result;
}

function renderRecommendedSection() {
  const wrapper = document.getElementById('recommended-wrapper');
  const container = document.getElementById('recommended-posts');
  const titleEl = document.getElementById('recommended-title');
  if (!wrapper || !container || !titleEl) return;

  const posts = getRecommendedPosts();
  if (!posts.length) {
    wrapper.classList.add('hidden');
    container.innerHTML = '';
    return;
  }

  wrapper.classList.remove('hidden');
  titleEl.textContent = state.lang === 'ru' ? 'Рекомендовано для вас' : 'Recommended for you';
  renderPostsInto(posts, 'recommended-posts');
}

async function loadPosts() {
  const headers = state.token ? { Authorization: 'Bearer ' + state.token } : {};
  const posts = await fetch('/api/posts', { headers }).then(r => r.json());
  allFeedPosts = Array.isArray(posts) ? posts : [];
  renderCategoryBar(allFeedPosts);
  renderRecommendedSection();
  renderPostsInto(getFilteredFeedPosts(), 'posts');
}

function showEditPostModal(post) {
  const editorId = `edit-post-editor-${post.id}`;
  const { root } = makeModal(`
    <h2>${t('editPost')}</h2>
    <div class="rich-editor">
      <div class="editor-toolbar">
        <button type="button" class="editor-btn" data-cmd="bold" title="Bold"><b>B</b></button>
        <button type="button" class="editor-btn" data-cmd="italic" title="Italic"><i>I</i></button>
        <button type="button" class="editor-btn" data-cmd="underline" title="Underline"><u>U</u></button>
        <button type="button" class="editor-btn" data-cmd="insertUnorderedList" title="Bullet list">• List</button>
        <button type="button" class="editor-btn" data-cmd="formatBlock" data-value="blockquote" title="Quote">❝ ❞</button>
        <button type="button" class="editor-btn" data-cmd="removeFormat" title="Clear formatting">✖</button>
      </div>
      <div id="${editorId}" class="editor-area" contenteditable="true">${post.content || ''}</div>
    </div>
    <div class="actions">
      <button data-role="cancel">${t('cancel')}</button>
      <button data-role="save" class="btn-primary">${t('saveChanges')}</button>
    </div>
  `);
  const cancelBtn = root.querySelector('button[data-role="cancel"]');
  const saveBtn = root.querySelector('button[data-role="save"]');
  const editorEl = root.querySelector('#' + editorId);
  const toolbar = root.querySelector('.editor-toolbar');

  if (toolbar && editorEl) {
    toolbar.querySelectorAll('.editor-btn').forEach(btn => {
      btn.onclick = () => {
        const cmd = btn.dataset.cmd;
        const value = btn.dataset.value || null;
        if (!cmd) return;
        editorEl.focus();
        try {
          document.execCommand(cmd, false, value);
        } catch (e) {
          console.error('execCommand failed', e);
        }
      };
    });
  }

  if (cancelBtn) cancelBtn.onclick = () => root.remove();
  if (saveBtn) {
    saveBtn.onclick = async () => {
      const newContent = (editorEl && editorEl.innerHTML ? editorEl.innerHTML.trim() : '');
      if (!newContent) {
        showAlert(t('contentRequired'));
        return;
      }
      try {
        const updated = await api.put(`/posts/${post.id}`, { content: newContent }, state.token);
        if (updated && updated.id) {
          root.remove();
          refreshCurrentFeed();
        } else {
          showAlert(updated && updated.error ? updated.error : 'Failed to update post');
        }
      } catch (err) {
        console.error('Failed to update post', err);
        showAlert('Failed to update post: ' + err.message);
      }
    };
  }
}

async function showPostModal(postId) {
  try {
    const post = await api.get(`/posts/${postId}/full`, state.token);
    if (!post || !post.id) {
      showAlert(state.lang === 'ru' ? 'Пост не найден' : 'Post not found');
      return;
    }
    const { root, card } = makeModal('<div id="single-post-modal"></div>');
    const containerId = 'single-post-modal';
    renderPostsInto([post], containerId);
  } catch (err) {
    console.error('Failed to load post', err);
    showAlert(state.lang === 'ru' ? 'Не удалось открыть пост' : 'Failed to open post');
  }
}

function showEditPostModal(post) {
  const { root } = makeModal(`
    <h2>${t('EditPost')}</h2>
    <textarea id="ep-content" style="min-height:80px"></textarea>
    <div class="actions">
      <button data-role="cancel">${t('cancel')}</button>
      <button data-role="save" class="btn-primary">${t('saveChanges')}</button>
    </div>
  `);

  const contentEl = root.querySelector('#ep-content');
  const cancelBtn = root.querySelector('button[data-role="cancel"]');
  const saveBtn = root.querySelector('button[data-role="save"]');

  if (contentEl) {
    contentEl.value = post.content || '';
  }

  if (cancelBtn) {
    cancelBtn.onclick = () => root.remove();
  }

  if (saveBtn && contentEl) {
    saveBtn.onclick = async () => {
      const newContent = contentEl.value.trim();
      if (!newContent && !post.image && !post.audio && !post.video) {
        showAlert(t('missingFields'));
        return;
      }
      try {
        const res = await api.put(`/posts/${post.id}`, { content: newContent }, state.token);
        if (res && res.id) {
          root.remove();
          refreshCurrentFeed();
        } else {
          showAlert(t('editError'));
        }
      } catch (e) {
        console.error('Failed to edit post', e);
        showAlert(t('editError'));
      }
    };
  }
}

function getFilteredFeedPosts() {
  if (!state.currentCategoryFilter) return allFeedPosts;
  const target = state.currentCategoryFilter.toLowerCase();
  return allFeedPosts.filter(p => (p.category || '').toLowerCase() === target);
}

function renderCategoryBar(posts) {
  const bar = document.getElementById('category-bar');
  if (!bar) return;
  const categories = new Set();
  posts.forEach(p => {
    if (p.category) categories.add(p.category);
  });
  bar.innerHTML = '';
  if (!categories.size) return;

  const allBtn = document.createElement('button');
  allBtn.className = 'category-chip' + (state.currentCategoryFilter ? '' : ' active');
  allBtn.textContent = state.lang === 'ru' ? 'Все категории' : 'All';
  allBtn.onclick = () => {
    state.currentCategoryFilter = null;
    renderCategoryBar(posts);
    renderPostsInto(getFilteredFeedPosts(), 'posts');
  };
  bar.appendChild(allBtn);

  categories.forEach(cat => {
    const btn = document.createElement('button');
    btn.className = 'category-chip' + (state.currentCategoryFilter === cat ? ' active' : '');
    btn.textContent = '#' + cat;
    btn.onclick = () => {
      state.currentCategoryFilter = cat;
      renderCategoryBar(posts);
      renderPostsInto(getFilteredFeedPosts(), 'posts');
    };
    bar.appendChild(btn);
  });
}

function showCategoryEmojiPicker() {
  const emojiBtn = document.getElementById('post-category-emoji');
  const textInput = document.getElementById('post-category-text');
  if (!emojiBtn) return;
  const emojis = [
    '😀','😁','😂','🤣','😊','😍','😘','😎',
    '🤔','😴','😡','🥶','🥵','🤯','🤡','👻',
    '👍','👎','🙏','👏','💪','🔥','✨','❤️',
    '💚','💙','💜','🖤','🤍','💯','⚡','⭐',
    '🌈','☀️','🌧','❄️','🌊','🌍','🌿','🌸',
    '🍔','🍕','🍣','🍿','🍺','☕','🍎','🍩',
    '⚽','🏀','🎮','🎧','🎬','📚','💻','📱'
  ];
  const { root, card } = makeModal(`
    <h2 style="margin-bottom:4px">${state.lang === 'ru' ? 'Выбери эмодзи категории' : 'Choose category emoji'}</h2>
    <div class="emoji-grid">
      ${emojis.map(e => `<button class="emoji-choice" data-emoji="${e}">${e}</button>`).join('')}
    </div>
    <div class="actions">
      <button id="emoji-cancel">${t('cancel')}</button>
    </div>
  `);
  card.querySelectorAll('.emoji-choice').forEach(btn => {
    btn.onclick = () => {
      const value = btn.getAttribute('data-emoji');
      if (value) { emojiBtn.dataset.emoji = value; emojiBtn.textContent = value; }
      root.remove();
      if (textInput) textInput.focus();
    };
  });
  const cancelBtn = document.getElementById('emoji-cancel');
  if (cancelBtn) cancelBtn.onclick = () => root.remove();
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

async function loadSubscriptionsUsers() {
  const container = document.getElementById('subscriptions-users');
  if (!container) return;

  container.innerHTML = '';

  if (!state.token) {
    container.classList.add('hidden');
    return;
  }

  try {
    const users = await api.get('/subscriptions', state.token);
    if (!Array.isArray(users) || users.length === 0) {
      container.classList.add('hidden');
      return;
    }

    container.classList.remove('hidden');
    container.innerHTML = '';

    const title = document.createElement('h3');
    title.className = 'subscriptions-users-title';
    title.textContent = state.lang === 'ru' ? 'Ваши подписки' : 'Subscriptions';
    container.appendChild(title);

    const list = document.createElement('div');
    list.className = 'subscriptions-users-list';

    users.forEach(u => {
      const row = document.createElement('button');
      row.type = 'button';
      row.className = 'subscriptions-user-row';
      row.onclick = () => showProfile(u.id);

      const avatar = document.createElement('img');
      avatar.className = 'subscriptions-user-avatar';
      avatar.src = u.avatar || '/default-avatar.png';
      avatar.alt = u.username;

      const name = document.createElement('span');
      name.className = 'subscriptions-user-name';
      name.textContent = formatUsername(u.username);

      row.appendChild(avatar);
      row.appendChild(name);
      list.appendChild(row);
    });

    container.appendChild(list);
  } catch (err) {
    console.error('Failed to load subscriptions users', err);
    container.classList.add('hidden');
  }
}

async function loadCommentsInto(section, postId) {
  section.innerHTML = '';

  const list = document.createElement('div');
  list.className = 'comment-list';

  try {
    const comments = await api.get(`/posts/${postId}/comments`, state.token);
    if (comments.length === 0) {
      const empty = document.createElement('div');
      empty.className = 'comment-empty';
      empty.textContent = state.lang === 'ru' ? 'Пока нет комментариев' : 'No comments yet';
      list.appendChild(empty);
    }
    for (const c of comments) {
      const div = document.createElement('div');
      div.className = 'comment';

      const avatar = document.createElement('img');
      avatar.src = c.avatar || '/default-avatar.png';
      avatar.className = 'avatar-tiny';
      avatar.style.cursor = 'pointer';
      avatar.onclick = () => showProfile(c.user_id);

      const nameLink = document.createElement('strong');
      nameLink.textContent = formatUsername(c.username);
      nameLink.style.cursor = 'pointer';
      nameLink.onclick = () => showProfile(c.user_id);

      const time = document.createElement('small');
      time.textContent = ' · ' + new Date(c.created_at).toLocaleString();

      const text = document.createElement('div');
      text.className = 'comment-text';
      text.textContent = c.content;

      const footer = document.createElement('div');
      footer.className = 'comment-footer';

      const likeBtn = document.createElement('button');
      likeBtn.type = 'button';
      likeBtn.className = 'comment-like-btn' + (c.likedByMe ? ' active' : '');
      const initialLikes = typeof c.likes === 'number' ? c.likes : 0;
      likeBtn.textContent = `❤️ ${initialLikes}`;
      likeBtn.onclick = async (e) => {
        e.stopPropagation();
        if (!state.token) {
          showAlert(t('loginToReact'));
          return;
        }
        try {
          const res = await api.post(`/comments/${c.id}/like`, {}, state.token);
          const likes = res && typeof res.likes === 'number' ? res.likes : 0;
          const likedByMe = !!(res && res.likedByMe);
          c.likes = likes;
          c.likedByMe = likedByMe;
          likeBtn.textContent = `❤️ ${likes}`;
          likeBtn.classList.toggle('active', likedByMe);
          likeBtn.classList.add('is-animating');
          likeBtn.addEventListener('animationend', () => {
            likeBtn.classList.remove('is-animating');
          }, { once: true });
        } catch (err) {
          console.error('Failed to like comment', err);
        }
      };

      footer.appendChild(likeBtn);

      div.appendChild(avatar);
      div.appendChild(nameLink);
      div.appendChild(time);
      div.appendChild(text);
      div.appendChild(footer);
      list.appendChild(div);
    }
  } catch (e) {
    console.error('Failed to load comments', e);
  }

  const addRow = document.createElement('div');
  addRow.className = 'comment-add-row';

  const input = document.createElement('input');
  input.type = 'text';
  input.className = 'comment-input';
  input.placeholder = t('writeComment');

  const sendBtn = document.createElement('button');
  sendBtn.className = 'comment-send-btn btn-primary';
  sendBtn.textContent = '⬆️';
  sendBtn.title = t('send');

  const doSend = async () => {
    if (!state.token) { showAlert(t('loginToComment')); return; }
    const content = input.value.trim();
    if (!content) return;
    input.value = '';
    const res = await api.post(`/posts/${postId}/comments`, { content }, state.token);
    if (res.id) {
      section.dataset.loaded = '';
      loadCommentsInto(section, postId);
      refreshCurrentFeed();
    }
  };

  sendBtn.onclick = doSend;
  input.onkeydown = (e) => { if (e.key === 'Enter') doSend(); };

  addRow.appendChild(input);
  addRow.appendChild(sendBtn);

  section.appendChild(list);
  section.appendChild(addRow);
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
      const mediaToolbar = document.querySelector('.post-media-toolbar');
      if (mediaToolbar && mediaToolbar.parentElement) {
        mediaToolbar.parentElement.insertBefore(img, mediaToolbar);
      }
    };
    reader.readAsDataURL(file);
  }
};

document.getElementById('btn-audio').onclick = () => document.getElementById('post-audio').click();
document.getElementById('post-audio').onchange = (e) => {
  const file = e.target.files[0];
  let hint = document.getElementById('audio-file-hint');
  if (hint) hint.remove();
  if (file) {
    hint = document.createElement('div');
    hint.id = 'audio-file-hint';
    hint.style.fontSize = '12px';
    hint.style.color = 'var(--muted)';
    hint.style.marginTop = '4px';
    hint.textContent = '🎵 ' + file.name;
    const mediaToolbar = document.querySelector('.post-media-toolbar');
    if (mediaToolbar && mediaToolbar.parentElement) {
      mediaToolbar.parentElement.insertBefore(hint, mediaToolbar);
    }
  }
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
    const mediaToolbar = document.querySelector('.post-media-toolbar');
    if (mediaToolbar && mediaToolbar.parentElement) {
      mediaToolbar.parentElement.insertBefore(hint, mediaToolbar);
    }
  }
};

document.getElementById('btn-post').onclick = async () => {
  if (!state.token) { showAlert(t('loginToPost')); return; }
  const editor = document.getElementById('post-editor');
  const content = editor ? editor.innerHTML.trim() : '';
  const categoryTextInput = document.getElementById('post-category-text');
  const emojiBtn = document.getElementById('post-category-emoji');
  const categoryEmoji = (emojiBtn && emojiBtn.dataset && emojiBtn.dataset.emoji) ? emojiBtn.dataset.emoji.trim() : '';
  const categoryText = categoryTextInput ? categoryTextInput.value.trim() : '';
  const category = [categoryEmoji, categoryText].filter(Boolean).join(' ').trim();
  
  const pollQuestionInput = document.getElementById('poll-question');
  const pollOptionsContainer = document.getElementById('poll-options');
  let poll = null;
  if (pollQuestionInput && pollOptionsContainer) {
    const question = pollQuestionInput.value.trim();
    const optionInputs = Array.from(pollOptionsContainer.querySelectorAll('.poll-option-input'));
    const options = optionInputs.map(inp => inp.value.trim()).filter(v => v.length > 0);
    if (question && options.length >= 2) {
      poll = { question, options };
    }
  }
  
  const imageInput = document.getElementById('post-image');
  const audioInput = document.getElementById('post-audio');
  const videoInput = document.getElementById('post-video');
  const hasImage = imageInput.files.length > 0;
  const hasAudio = audioInput.files.length > 0;
  const hasVideo = videoInput.files.length > 0;
  if (!content && !hasImage && !hasAudio && !hasVideo && !poll) { showAlert('Напишите что-нибудь или добавьте медиа'); return; }

  const postBtn = document.getElementById('btn-post');
  if (postBtn) postBtn.classList.add('btn-loading');
  
  try {
    let res;
    if (hasImage || hasAudio || hasVideo) {
      const formData = new FormData();
      formData.append('content', content);
      if (category) formData.append('category', category);
      if (poll) formData.append('poll', JSON.stringify(poll));
      if (hasImage) formData.append('image', imageInput.files[0]);
      if (audioInput.files.length) formData.append('audio', audioInput.files[0]);
      if (hasVideo) formData.append('video', videoInput.files[0]);
      res = await api.postFormData('/posts/with-media', formData, state.token);
    } else {
      const body = { content };
      if (category) body.category = category;
      if (poll) body.poll = poll;
      res = await api.post('/posts', body, state.token);
    }
    
    if (res.id) {
      if (editor) editor.innerHTML = '';
      if (categoryTextInput) categoryTextInput.value = '';
      if (emojiBtn) { delete emojiBtn.dataset.emoji; emojiBtn.textContent = '😊'; }
      if (pollQuestionInput) pollQuestionInput.value = '';
      if (pollOptionsContainer) {
        const optionInputs = pollOptionsContainer.querySelectorAll('.poll-option-input');
        optionInputs.forEach(inp => inp.value = '');
      }
      const pollFields = document.getElementById('poll-fields');
      if (pollFields) {
        pollFields.style.display = 'none';
        if (pollsBtn) pollsBtn.style.background = 'transparent';
      }
      imageInput.value = '';
      audioInput.value = '';
      videoInput.value = '';
      const preview = document.getElementById('image-preview');
      if (preview) preview.remove();
      const audioHint = document.getElementById('audio-file-hint');
      if (audioHint) audioHint.remove();
      const videoHint = document.getElementById('video-file-hint');
      if (videoHint) videoHint.remove();
      loadPosts();
    } else {
      showAlert(res.error || 'Error publishing post');
    }
  } catch (err) {
    console.error('Error:', err);
    showAlert('Error publishing post: ' + err.message);
  } finally {
    if (postBtn) postBtn.classList.remove('btn-loading');
  }
};

async function showProfile(userId) {
  const res = await api.get(`/users/${userId}`, state.token);
  if (!res.id) { showAlert(t('userNotFound')); return; }

  const page = document.getElementById('profile-page');
  if (!page) return;

  page.innerHTML = '';

  const headerCard = document.createElement('div');
  headerCard.className = 'card profile-header-card';

  const topRow = document.createElement('div');
  topRow.style.display = 'flex';
  topRow.style.alignItems = 'center';
  topRow.style.gap = '12px';

  const avatar = document.createElement('img');
  avatar.src = res.avatar || '/default-avatar.png';
  avatar.className = 'avatar-large';
  if (state.token && state.user && state.user.id === userId) {
    avatar.style.cursor = 'pointer';
    avatar.onclick = showAvatarUpload;
  }

  const nameCol = document.createElement('div');
  const usernameEl = document.createElement('h2');
  usernameEl.textContent = formatUsername(res.username);
  usernameEl.style.margin = '0';

  const idLine = document.createElement('p');
  idLine.className = 'profile-id-line';
  idLine.textContent = `${t('profileId')}: ${res.id}`;
  idLine.style.color = 'var(--muted)';
  idLine.style.fontSize = '13px';
  idLine.style.margin = '2px 0 0 0';

  nameCol.appendChild(usernameEl);
  nameCol.appendChild(idLine);

  topRow.appendChild(avatar);
  topRow.appendChild(nameCol);

  const bio = document.createElement('p');
  bio.textContent = res.bio || '(no bio)';
  bio.style.color = 'var(--muted)';
  bio.style.marginTop = '12px';

  const actionsRow = document.createElement('div');
  actionsRow.style.display = 'flex';
  actionsRow.style.flexWrap = 'wrap';
  actionsRow.style.gap = '8px';
  actionsRow.style.marginTop = '12px';

  const subscribersBtn = document.createElement('button');
  subscribersBtn.textContent = `👥 ${res.subscribers || 0} ${t('subscribers')}`;
  subscribersBtn.className = 'link';
  actionsRow.appendChild(subscribersBtn);

  if (state.token && state.user && state.user.id !== userId) {
    const subscribeBtn = document.createElement('button');
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
    actionsRow.appendChild(subscribeBtn);
  }

  if (state.token && state.user && state.user.id === userId) {
    const editBtn = document.createElement('button');
    editBtn.textContent = t('editProfile');
    editBtn.onclick = showEditProfile;
    actionsRow.appendChild(editBtn);
  }

  if (state.token && state.user && state.user.id !== userId) {
    const dmBtn = document.createElement('button');
    dmBtn.textContent = `💬 ${t('sendMessage')}`;
    dmBtn.className = 'btn-primary';
    dmBtn.onclick = () => openChat(userId, res.username, res.avatar);
    actionsRow.appendChild(dmBtn);
  }

  headerCard.appendChild(topRow);
  headerCard.appendChild(bio);
  headerCard.appendChild(actionsRow);

  page.appendChild(headerCard);

  const postsWrapper = document.createElement('div');
  postsWrapper.className = 'profile-posts-wrapper';

  const postsTitle = document.createElement('h3');
  postsTitle.textContent = `${t('publishedPosts')} (${res.posts.length})`;
  postsTitle.style.marginTop = '16px';
  postsWrapper.appendChild(postsTitle);

  const postsContainer = document.createElement('div');
  postsContainer.id = 'profile-posts';
  postsWrapper.appendChild(postsContainer);

  page.appendChild(postsWrapper);

  if (res.posts && res.posts.length) {
    const fullPosts = [];
    for (const p of res.posts) {
      try {
        const full = await api.get(`/posts/${p.id}/full`, state.token);
        if (full && full.id) fullPosts.push(full);
      } catch (e) {
        console.error('Failed to load full post for profile', e);
      }
    }
    if (fullPosts.length) {
      renderPostsInto(fullPosts, 'profile-posts');
    }
  }

  switchPage('profile');
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function showAvatarUpload() {
  const { root } = makeModal(`<h2>Change Avatar</h2><input id="avatar-file" type="file" accept="image/*"><button id="avatar-submit">Upload</button><button id="avatar-cancel">Cancel</button>`);
  document.getElementById('avatar-cancel').onclick = () => root.remove();
  document.getElementById('avatar-submit').onclick = async () => {
    const fileInput = document.getElementById('avatar-file');
    if (!fileInput.files || fileInput.files.length === 0) { showAlert('Please select a file'); return; }
    const formData = new FormData();
    formData.append('avatar', fileInput.files[0]);
    const res = await api.postFormData('/users/avatar', formData, state.token);
    if (res.id) {
      state.user.avatar = res.avatar;
      localStorage.setItem('user', JSON.stringify(state.user));
      renderHeaderUserAvatar();
      root.remove();
      loadPosts();
      showAlert('Avatar updated');
    } else {
      showAlert(res.error || 'Failed to upload avatar');
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
    if (!trimmed) { showAlert('Bio required'); return; }
    const res = await api.put('/users/profile', { bio: trimmed }, state.token);
    if (res.id) {
      state.user.bio = res.bio;
      localStorage.setItem('user', JSON.stringify(state.user));
      root.remove();
      loadPosts();
      showAlert('Bio updated');
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
      } else if (n.type === 'system') {
        const text = n.message || '';
        const snippet = text.length > 50 ? text.substring(0, 50) + '...' : text;
        message = ` ${t('systemNotification')}${snippet ? `: "${snippet}"` : ''}`;
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
  document.body.appendChild(modal);

  // Обновляем индикатор на вкладке уведомлений
  const unreadCount = notifications.filter(n => !n.is_read).length;
  updateNotificationsTab(unreadCount);
}

function showCreateSystemNotificationModal() {
  if (!state.token || !state.user || state.user.username !== 'blau3') {
    showAlert('Only blau3 can send system notifications');
    return;
  }
  const placeholder = state.lang === 'ru' ? 'Текст системного уведомления' : 'System notification text';
  const { root } = makeModal(`
    <h2>${t('createSystemNotification')}</h2>
    <textarea id="system-notification-text" style="width:100%;height:100px" placeholder="${placeholder}"></textarea>
    <div class="actions">
      <button id="system-notification-cancel">${t('cancel')}</button>
      <button id="system-notification-submit" class="btn-primary">${t('create')}</button>
    </div>
  `);
  document.getElementById('system-notification-cancel').onclick = () => root.remove();
  document.getElementById('system-notification-submit').onclick = async () => {
    const el = document.getElementById('system-notification-text');
    const content = el.value.trim();
    if (!content) {
      showAlert(state.lang === 'ru' ? 'Введите текст уведомления' : 'Enter notification text');
      return;
    }
    try {
      const res = await api.post('/system-notifications', { content }, state.token);
      if (res && res.success) {
        root.remove();
        loadNotificationsPage();
      } else {
        showAlert(res.error || (state.lang === 'ru' ? 'Не удалось отправить уведомление' : 'Failed to send notification'));
      }
    } catch (e) {
      showAlert(e.message || (state.lang === 'ru' ? 'Не удалось отправить уведомление' : 'Failed to send notification'));
    }
  };
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

  if (state.user && state.user.username === 'blau3') {
    const adminBar = document.createElement('div');
    adminBar.style.display = 'flex';
    adminBar.style.justifyContent = 'flex-start';
    adminBar.style.gap = '8px';
    adminBar.style.marginBottom = '16px';

    const createBtn = document.createElement('button');
    createBtn.textContent = t('createSystemNotification');
    createBtn.className = 'btn-primary';
    createBtn.onclick = () => showCreateSystemNotificationModal();

    adminBar.appendChild(createBtn);
    container.appendChild(adminBar);
  }
  
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
    } else if (n.type === 'system') {
      const text = n.message || '';
      const snippet = text.length > 60 ? text.substring(0, 60) + '...' : text;
      message = ` ${t('systemNotification')}${snippet ? `: "${snippet}"` : ''}`;
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

let eventsTrackingInitialized = false;
let lastNotificationIds = new Set();
let lastUnreadMessagesCount = 0;

async function primeEventsTracking() {
  if (!state.token) return;
  try {
    const response = await api.get('/notifications', state.token);
    const notifications = Array.isArray(response) ? response : [];
    lastNotificationIds = new Set(notifications.map(n => n.id));
  } catch (e) {
    // ignore
  }
  try {
    const res = await api.get('/messages/unread-count', state.token);
    lastUnreadMessagesCount = res && typeof res.count === 'number' ? res.count : 0;
  } catch (e) {
    // ignore
  }
}

function buildNotificationToastText(n) {
  if (!n) return '';
  const userName = n.username ? formatUsername(n.username) : '';
  if (n.type === 'subscribe') {
    return `${userName} ${t('subscribedYou')}`;
  }
  if (n.type === 'new_post') {
    return `${userName} ${t('postedNew')}`;
  }
  if (n.type === 'system') {
    const text = n.message || '';
    const snippet = text.length > 80 ? text.substring(0, 80) + '…' : text;
    return `${t('systemNotification')}${snippet ? `: "${snippet}"` : ''}`;
  }
  return '';
}

async function checkNewEventsForToasts() {
  if (!state.token) return;
  if (!eventsTrackingInitialized) {
    await primeEventsTracking();
    eventsTrackingInitialized = true;
    return;
  }
  try {
    const response = await api.get('/notifications', state.token);
    const notifications = Array.isArray(response) ? response : [];
    for (const n of notifications) {
      if (!lastNotificationIds.has(n.id)) {
        lastNotificationIds.add(n.id);
        const text = buildNotificationToastText(n);
        if (text) showToast(text);
      }
    }
  } catch (e) {
    console.error('Failed to check notifications for toasts', e);
  }

  try {
    const res = await api.get('/messages/unread-count', state.token);
    const count = res && typeof res.count === 'number' ? res.count : 0;
    if (count > lastUnreadMessagesCount) {
      const diff = count - lastUnreadMessagesCount;
      const text = state.lang === 'ru'
        ? `Новых сообщений: ${diff}`
        : `New messages: ${diff}`;
      showToast(text);
    }
    lastUnreadMessagesCount = count;
  } catch (e) {
    console.error('Failed to check messages for toasts', e);
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

// ── Direct Messages ─────────────────────────────────────────────────────────

async function loadMessagesPage() {
  const container = document.getElementById('messages-container');
  if (!container) return;
  container.innerHTML = '';

  if (!state.token) {
    container.innerHTML = `<div class="dm-empty"><div style="font-size:48px;margin-bottom:16px">💬</div><p>${t('login')}</p></div>`;
    return;
  }

  let dialogs = [];
  try {
    dialogs = await api.get('/dialogs', state.token);
    if (!Array.isArray(dialogs)) dialogs = [];
  } catch (e) {
    console.error('Failed to load dialogs', e);
  }

  const header = document.createElement('h2');
  header.className = 'dm-page-title';
  header.textContent = t('messages');
  container.appendChild(header);

  if (dialogs.length === 0) {
    const empty = document.createElement('div');
    empty.className = 'dm-empty';
    empty.innerHTML = `<div style="font-size:48px;margin-bottom:16px">💬</div><p>${t('noMessages')}</p>`;
    container.appendChild(empty);
    return;
  }

  const list = document.createElement('div');
  list.className = 'dm-list';

  for (const d of dialogs) {
    const row = document.createElement('div');
    row.className = 'dm-dialog-row';
    row.onclick = () => openChat(d.user_id, d.username, d.avatar);

    const avatar = document.createElement('img');
    avatar.src = d.avatar || '/default-avatar.png';
    avatar.className = 'dm-dialog-avatar';

    const info = document.createElement('div');
    info.className = 'dm-dialog-info';

    const name = document.createElement('div');
    name.className = 'dm-dialog-name';
    name.textContent = formatUsername(d.username);

    const preview = document.createElement('div');
    preview.className = 'dm-dialog-preview';
    preview.textContent = d.last_message_content || '…';

    info.appendChild(name);
    info.appendChild(preview);
    row.appendChild(avatar);
    row.appendChild(info);
    list.appendChild(row);
  }

  container.appendChild(list);
  refreshMessagesIndicator();
}

async function openChat(userId, username, avatarUrl) {
  let messages = [];
  try {
    messages = await api.get(`/messages/${userId}`, state.token);
    if (!Array.isArray(messages)) messages = [];
    await api.post(`/messages/${userId}/read`, {}, state.token);
    refreshMessagesIndicator();
  } catch (e) {
    console.error('Failed to load chat', e);
  }

  const { root } = makeModal('');
  root.querySelector('.modal-card').remove();

  const card = document.createElement('div');
  card.className = 'dm-chat-card';

  const chatHeader = document.createElement('div');
  chatHeader.className = 'dm-chat-header';

  const backBtn = document.createElement('button');
  backBtn.textContent = '←';
  backBtn.className = 'dm-back-btn';
  backBtn.onclick = () => { root.remove(); };

  const chatAvatar = document.createElement('img');
  chatAvatar.src = avatarUrl || '/default-avatar.png';
  chatAvatar.className = 'dm-chat-avatar';

  const chatName = document.createElement('span');
  chatName.className = 'dm-chat-name';
  chatName.textContent = formatUsername(username);

  chatHeader.appendChild(backBtn);
  chatHeader.appendChild(chatAvatar);
  chatHeader.appendChild(chatName);

  const msgList = document.createElement('div');
  msgList.className = 'dm-msg-list';

  function renderMessages(msgs) {
    msgList.innerHTML = '';
    if (msgs.length === 0) {
      const empty = document.createElement('div');
      empty.className = 'dm-msg-empty';
      empty.textContent = state.lang === 'ru' ? 'Начните диалог!' : 'Say hello!';
      msgList.appendChild(empty);
      return;
    }
    for (const m of msgs) {
      const isOwn = m.from_user_id === state.user.id;
      const bubble = document.createElement('div');
      bubble.className = 'dm-bubble ' + (isOwn ? 'dm-bubble-own' : 'dm-bubble-other');

      const text = document.createElement('div');
      text.className = 'dm-bubble-text';
      text.textContent = m.content;

      const time = document.createElement('div');
      time.className = 'dm-bubble-time';
      time.textContent = new Date(m.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

      bubble.appendChild(text);
      bubble.appendChild(time);
      msgList.appendChild(bubble);
    }
    msgList.scrollTop = msgList.scrollHeight;
  }

  renderMessages(messages);

  let chatPollTimer = null;

  async function refreshChatMessages() {
    try {
      const updated = await api.get(`/messages/${userId}`, state.token);
      if (Array.isArray(updated)) {
        // simple diff: if length changed or last id changed, re-render
        const prevLast = messages.length ? messages[messages.length - 1].id : null;
        const nextLast = updated.length ? updated[updated.length - 1].id : null;
        if (updated.length !== messages.length || prevLast !== nextLast) {
          messages = updated;
          renderMessages(messages);
        }
      }
    } catch (e) {
      console.error('Failed to refresh chat messages', e);
    }
  }

  const inputRow = document.createElement('div');
  inputRow.className = 'dm-input-row';

  const input = document.createElement('input');
  input.type = 'text';
  input.className = 'dm-input';
  input.placeholder = t('typeMessage');
  input.maxLength = 1000;

  const sendBtn = document.createElement('button');
  sendBtn.className = 'dm-send-btn btn-primary';
  sendBtn.textContent = '➤';

  async function sendMessage() {
    const content = input.value.trim();
    if (!content) return;
    input.value = '';
    try {
      await api.post(`/messages/${userId}`, { content }, state.token);
      await refreshChatMessages();
    } catch (e) {
      console.error('Failed to send message', e);
    }
  }

  sendBtn.onclick = sendMessage;
  input.onkeydown = (e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); } };

  inputRow.appendChild(input);
  inputRow.appendChild(sendBtn);

  card.appendChild(chatHeader);
  card.appendChild(msgList);
  card.appendChild(inputRow);
  root.appendChild(card);

  function closeChat() {
    if (chatPollTimer) {
      clearInterval(chatPollTimer);
      chatPollTimer = null;
    }
    root.remove();
  }

  backBtn.onclick = closeChat;
  root.addEventListener('click', (e) => { if (e.target === root) closeChat(); });

  chatPollTimer = setInterval(() => {
    if (document.visibilityState === 'hidden') return;
    refreshChatMessages();
  }, 4000);

  input.focus();
}

async function refreshMessagesIndicator() {
  const tab = document.getElementById('tab-messages');
  if (!tab) return;
  const label = t('messages');
  if (!state.token) {
    tab.textContent = `💬 ${label}`;
    tab.classList.remove('has-unread');
    return;
  }
  try {
    const res = await api.get('/messages/unread-count', state.token);
    const count = res && res.count ? res.count : 0;
    if (count > 0) {
      tab.textContent = `💬 ${label} (${count})`;
      tab.classList.add('has-unread');
    } else {
      tab.textContent = `💬 ${label}`;
      tab.classList.remove('has-unread');
    }
  } catch (e) {
    tab.textContent = `💬 ${label}`;
  }
}

// language and theme wiring
const langSelect = document.getElementById('lang-select');
if (langSelect) {
  langSelect.value = state.lang;
  langSelect.onchange = () => {
    state.lang = langSelect.value;
    localStorage.setItem('lang', state.lang);
    renderAuth();
    loadPosts();
    applyUiText();
  };
}

const userIdSearch = document.getElementById('user-id-search');
const btnSearchUser = document.getElementById('btn-search-user');
if (userIdSearch) userIdSearch.placeholder = t('userIdPlaceholder');
if (btnSearchUser) {
  btnSearchUser.title = t('searchUserById');
  btnSearchUser.onclick = () => {
    const raw = userIdSearch.value.trim();
    const id = parseInt(raw, 10);
    if (!raw || !Number.isInteger(id) || id < 1) { showAlert(t('userNotFound')); return; }
    userIdSearch.value = '';
    showProfile(id);
  };
}
if (userIdSearch) {
  userIdSearch.onkeydown = (e) => {
    if (e.key === 'Enter') btnSearchUser.click();
  };
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

const pollsBtn = document.getElementById('btn-polls');
if (pollsBtn) {
  pollsBtn.onclick = () => {
    const pollFields = document.getElementById('poll-fields');
    if (pollFields) {
      const isHidden = pollFields.style.display === 'none';
      pollFields.style.display = isHidden ? 'block' : 'none';
      pollsBtn.style.background = isHidden ? '#bbf7d0' : 'transparent';
    }
  };
}

const addPollOptionBtn = document.getElementById('add-poll-option');
if (addPollOptionBtn) {
  addPollOptionBtn.onclick = () => {
    const container = document.getElementById('poll-options');
    if (container) {
      const inputs = container.querySelectorAll('.poll-option-input');
      if (inputs.length >= 6) return;
      const input = document.createElement('input');
      input.type = 'text';
      input.className = 'poll-option-input poll-create-input';
      input.placeholder = 'Вариант ' + (inputs.length + 1);
      container.appendChild(input);
      input.focus();
    }
  };
}

const newStoryBtn = document.getElementById('btn-new-story');
if (newStoryBtn) {
  newStoryBtn.onclick = () => {
    if (!state.token) {
      showAlert(t('loginToPost'));
      return;
    }
    showCreateStoryModal();
  };
}

function showCreateStoryModal() {
  let storyRecorder = null;
  let storyStream = null;
  let storyChunks = [];
  let storyBlob = null;

  const { root } = makeModal(`
    <h2>${state.lang === 'ru' ? 'Голосовая история' : 'Voice story'}</h2>
    <p class="muted" style="font-size:13px;margin-top:4px">
      ${state.lang === 'ru' ? 'Запиши короткое голосовое сообщение' : 'Record a short voice message'}
    </p>
    <div style="display:flex;flex-direction:column;align-items:center;margin:12px 0;">
      <button id="story-record-btn" type="button" class="btn-primary" style="width:64px;height:64px;border-radius:999px;display:flex;align-items:center;justify-content:center;font-size:28px;padding:0">
        🎤
      </button>
      <span id="story-record-status" class="voice-status hidden" style="margin-top:8px"></span>
    </div>
    <textarea id="story-text" placeholder="${state.lang === 'ru' ? 'Текст (по желанию)' : 'Text (optional)'}" style="min-height:60px"></textarea>
    <div class="actions">
      <button data-role="cancel">${t('cancel')}</button>
      <button data-role="create" class="btn-primary">${state.lang === 'ru' ? 'Поделиться' : 'Share'}</button>
    </div>
  `);
  const cancelBtn = root.querySelector('button[data-role="cancel"]');
  const createBtn = root.querySelector('button[data-role="create"]');
  if (cancelBtn) cancelBtn.onclick = () => root.remove();
  const recordBtn = document.getElementById('story-record-btn');
  const statusEl = document.getElementById('story-record-status');

  async function stopRecording() {
    if (storyRecorder && storyRecorder.state === 'recording') {
      storyRecorder.stop();
    }
  }

  if (recordBtn) {
    recordBtn.onclick = async () => {
      if (storyRecorder && storyRecorder.state === 'recording') {
        await stopRecording();
        return;
      }
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        storyStream = stream;
        storyChunks = [];
        const mime = MediaRecorder.isTypeSupported('audio/webm;codecs=opus') ? 'audio/webm;codecs=opus' : 'audio/webm';
        storyRecorder = new MediaRecorder(stream);
        storyRecorder.ondataavailable = (e) => e.data.size && storyChunks.push(e.data);
        storyRecorder.onstop = () => {
          if (storyStream) {
            storyStream.getTracks().forEach(t => t.stop());
            storyStream = null;
          }
          if (storyChunks.length) {
            storyBlob = new Blob(storyChunks, { type: mime });
            if (statusEl) {
              statusEl.textContent = t('voiceRecorded');
              statusEl.classList.remove('hidden');
              statusEl.classList.remove('recording');
              statusEl.classList.add('recorded');
            }
          } else {
            storyBlob = null;
            if (statusEl) {
              statusEl.textContent = '';
              statusEl.classList.add('hidden');
              statusEl.classList.remove('recording', 'recorded');
            }
          }
          if (recordBtn) {
            recordBtn.textContent = '🎤';
            recordBtn.title = t('recordVoiceTitle');
          }
        };
        storyRecorder.start(200);
        if (recordBtn) {
          recordBtn.textContent = '⏹';
          recordBtn.title = t('stopRecord');
        }
        if (statusEl) {
          statusEl.textContent = t('recording');
          statusEl.classList.remove('hidden');
          statusEl.classList.add('recording');
        }
      } catch (err) {
        console.error(err);
        showAlert(t('noMic'));
      }
    };
  }

  if (createBtn) {
    createBtn.onclick = async () => {
      await stopRecording();
      const textEl = document.getElementById('story-text');
      const content = textEl ? textEl.value.trim() : '';
      if (!storyBlob) {
        showAlert(state.lang === 'ru' ? 'Сначала запиши голос' : 'Record your voice first');
        return;
      }
      try {
        const fd = new FormData();
        if (content) fd.append('content', content);
        if (storyBlob) {
          const ext = (storyBlob.type || '').includes('ogg') ? 'ogg' : 'webm';
          fd.append('media', storyBlob, 'story.' + ext);
        }
        await api.postFormData('/stories', fd, state.token);
        root.remove();
        loadStories();
      } catch (e) {
        console.error('Failed to create story', e);
        showAlert(e.message || 'Failed to create story');
      }
    };
  }
}

// Settings pop-up menu (gear)
const settingsBtn = document.getElementById('settings-btn');
const settingsMenu = document.getElementById('settings-menu');
const settingsWrapper = settingsBtn ? settingsBtn.closest('.settings-wrapper') : null;

function closeSettingsMenu() {
  if (!settingsBtn || !settingsMenu) return;
  settingsMenu.classList.add('hidden');
  settingsBtn.setAttribute('aria-expanded', 'false');
}

function toggleSettingsMenu() {
  if (!settingsBtn || !settingsMenu) return;
  const isOpen = !settingsMenu.classList.contains('hidden');
  if (isOpen) closeSettingsMenu();
  else {
    settingsMenu.classList.remove('hidden');
    settingsBtn.setAttribute('aria-expanded', 'true');
  }
}

if (settingsBtn && settingsMenu) {
  settingsBtn.onclick = (e) => {
    e.stopPropagation();
    toggleSettingsMenu();
  };
  document.addEventListener('click', (e) => {
    if (!settingsWrapper) return closeSettingsMenu();
    if (!settingsWrapper.contains(e.target)) closeSettingsMenu();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeSettingsMenu();
  });
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

const messagesTab = document.getElementById('tab-messages');
if (messagesTab) {
  messagesTab.textContent = `💬 ${t('messages')}`;
  messagesTab.onclick = () => switchPage('messages');
}

const voiceRecordBtn = document.getElementById('btn-voice-record');
if (voiceRecordBtn) {
  voiceRecordBtn.title = t('recordVoiceTitle');
  if (typeof MediaRecorder === 'undefined') voiceRecordBtn.style.display = 'none';
}

const categoryEmojiBtn = document.getElementById('post-category-emoji');
if (categoryEmojiBtn) {
  categoryEmojiBtn.textContent = categoryEmojiBtn.dataset.emoji ? categoryEmojiBtn.dataset.emoji : '😊';
  categoryEmojiBtn.onclick = () => showCategoryEmojiPicker();
}

// Click on header title opens feed and scrolls to top
const headerTitleRow = document.querySelector('.header-title-row');
if (headerTitleRow) {
  headerTitleRow.style.cursor = 'pointer';
  headerTitleRow.onclick = () => {
    switchPage('feed');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
}

// Floating scroll-to-top arrow
const scrollTopBtn = document.getElementById('scroll-top-btn');
if (scrollTopBtn) {
  scrollTopBtn.onclick = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  window.addEventListener('scroll', () => {
    if (window.scrollY > 200) scrollTopBtn.classList.remove('hidden');
    else scrollTopBtn.classList.add('hidden');
  });
}

// Close reaction dropdowns when clicking outside
document.addEventListener('click', () => {
  document.querySelectorAll('.reaction-dropdown').forEach(d => d.classList.add('hidden'));
});

switchPage('feed');
renderAuth();
renderHeaderUserAvatar();
applyUiText();
loadPosts();
loadStories();
startAutoRefresh();
refreshNotificationsIndicator();
refreshMessagesIndicator();
