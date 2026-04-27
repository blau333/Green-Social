
<<<<<<< HEAD
const E2EEncryption = (function() {
  let keyPair = null;
  const KEYS_STORAGE = 'e2e_keys';

  async function generateKeyPair() {
    keyPair = await crypto.subtle.generateKey(
      {
        name: 'ECDH',
        namedCurve: 'P-256'
      },
      true,
      ['deriveBits']
    );
    const publicKeyJwk = await crypto.subtle.exportKey('jwk', keyPair.publicKey);
    const privateKeyJwk = await crypto.subtle.exportKey('jwk', keyPair.privateKey);
    const keys = { publicKey: publicKeyJwk, privateKey: privateKeyJwk };
    localStorage.setItem(KEYS_STORAGE, JSON.stringify(keys));
    return keys;
  }

  async function loadKeys() {
    const stored = localStorage.getItem(KEYS_STORAGE);
    if (stored) {
      try {
        const keys = JSON.parse(stored);
        keyPair = {
          publicKey: await crypto.subtle.importKey(
            'jwk', keys.publicKey,
            { name: 'ECDH', namedCurve: 'P-256' },
            true, []
          ),
          privateKey: await crypto.subtle.importKey(
            'jwk', keys.privateKey,
            { name: 'ECDH', namedCurve: 'P-256' },
            true, ['deriveBits']
          )
        };
        return true;
      } catch (e) {
        console.warn('Failed to load E2E keys, generating new ones');
      }
    }
    await generateKeyPair();
    return true;
  }

  async function getPublicKeyJwk() {
    if (!keyPair) await loadKeys();
    return crypto.subtle.exportKey('jwk', keyPair.publicKey);
  }

  async function deriveSharedSecret(peerPublicKeyJwk) {
    if (!keyPair) await loadKeys();
    const peerPublicKey = await crypto.subtle.importKey(
      'jwk', peerPublicKeyJwk,
      { name: 'ECDH', namedCurve: 'P-256' },
      false, []
    );
    const sharedBits = await crypto.subtle.deriveBits(
      { name: 'ECDH', public: peerPublicKey },
      keyPair.privateKey,
      256
    );
    return new Uint8Array(sharedBits);
  }

  async function deriveAesKey(sharedSecret) {
    const hash = await crypto.subtle.digest('SHA-256', sharedSecret);
    return await crypto.subtle.importKey(
      'raw', hash,
      { name: 'AES-GCM' },
      false, ['encrypt', 'decrypt']
    );
  }

  function arrayBufferToBase64(buffer) {
    const bytes = new Uint8Array(buffer);
    let binary = '';
    for (let i = 0; i < bytes.byteLength; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary);
  }

  function base64ToArrayBuffer(base64) {
    const binary = atob(base64);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
      bytes[i] = binary.charCodeAt(i);
    }
    return bytes.buffer;
  }

  async function encrypt(plaintext, peerPublicKeyJwk) {
    if (!peerPublicKeyJwk) {
      return { encrypted: null, error: 'no_peer_key' };
    }
    try {
      const sharedSecret = await deriveSharedSecret(peerPublicKeyJwk);
      const aesKey = await deriveAesKey(sharedSecret);
      const iv = crypto.getRandomValues(new Uint8Array(12));
      const encoder = new TextEncoder();
      const data = encoder.encode(plaintext);
      const ciphertext = await crypto.subtle.encrypt(
        { name: 'AES-GCM', iv },
        aesKey,
        data
      );
      const combined = new Uint8Array(iv.byteLength + ciphertext.byteLength);
      combined.set(new Uint8Array(iv), 0);
      combined.set(new Uint8Array(ciphertext), iv.byteLength);
      return {
        encrypted: arrayBufferToBase64(combined.buffer),
        error: null
      };
    } catch (e) {
      return { encrypted: null, error: e.message };
    }
  }

  async function decrypt(encryptedBase64, peerPublicKeyJwk) {
    if (!encryptedBase64 || !peerPublicKeyJwk) {
      return { decrypted: null, error: 'missing_data' };
    }
    try {
      const combined = new Uint8Array(base64ToArrayBuffer(encryptedBase64));
      const iv = combined.slice(0, 12);
      const ciphertext = combined.slice(12);
      const sharedSecret = await deriveSharedSecret(peerPublicKeyJwk);
      const aesKey = await deriveAesKey(sharedSecret);
      const plaintext = await crypto.subtle.decrypt(
        { name: 'AES-GCM', iv },
        aesKey,
        ciphertext
      );
      const decoder = new TextDecoder();
      return { decrypted: decoder.decode(plaintext), error: null };
    } catch (e) {
      return { decrypted: null, error: e.message };
    }
  }

  function isEncryptedContent(content) {
    return content && typeof content === 'string' && content.startsWith('e2e:');
  }

  return {
    loadKeys,
    generateKeyPair,
    getPublicKeyJwk,
    encrypt,
    decrypt,
    isEncryptedContent,
    hasKeyPair: () => !!keyPair
  };
})();

=======
>>>>>>> 43fc63577f740ec07265f99ac0d4769620c4ae8c
const reactions = {
  like: { emoji: '👍', label: { en: 'Like', ru: 'Лайк' } },
  love: { emoji: '❤️', label: { en: 'Love', ru: 'Нравиться' } },
  funny: { emoji: '😂', label: { en: 'Funny', ru: "хаха" } },
  poop: { emoji: '💩', label: { en: 'Poop', ru: 'Фу' } },
  clown: { emoji: '🤡', label: { en: 'Clown', ru: 'Ужас' }}
};
<<<<<<< HEAD
const DEFAULT_AVATAR_URL = '/default-avatar.svg';
const LEGACY_DEFAULT_AVATAR_PREFIX = 'https://ui-avatars.com/api/';

function getAvatarUrl(avatar) {
  const value = typeof avatar === 'string' ? avatar.trim() : '';
  if (!value || value.startsWith(LEGACY_DEFAULT_AVATAR_PREFIX)) return DEFAULT_AVATAR_URL;
  return value;
}

function updateViewportMetrics() {
  const root = document.documentElement;
  const viewport = window.visualViewport;
  const height = viewport && viewport.height ? viewport.height : window.innerHeight;
  const scale = viewport && viewport.scale ? viewport.scale : 1;
  const bottomNav = document.querySelector('.bottom-nav');
  const bottomNavSpace = bottomNav ? Math.ceil(bottomNav.getBoundingClientRect().height) + 28 : 120;
  const pageChromeOffset = Math.max(bottomNavSpace + 92, 220);

  root.style.setProperty('--app-height', `${Math.max(Math.round(height), 320)}px`);
  root.style.setProperty('--bottom-nav-space', `${bottomNavSpace}px`);
  root.style.setProperty('--page-chrome-offset', `${pageChromeOffset}px`);
  root.dataset.viewportScale = String(scale);
}

function bindViewportMetrics() {
  updateViewportMetrics();
  window.addEventListener('resize', updateViewportMetrics, { passive: true });
  window.addEventListener('orientationchange', updateViewportMetrics, { passive: true });
  if (window.visualViewport) {
    window.visualViewport.addEventListener('resize', updateViewportMetrics, { passive: true });
    window.visualViewport.addEventListener('scroll', updateViewportMetrics, { passive: true });
  }
}

function normalizeSessionUser(user) {
  if (!user) return user;
  return {
    ...user,
    avatar: getAvatarUrl(user.avatar),
    is_private: !!Number(user.is_private || user.isPrivate || 0)
  };
}

function iconSprite(name, extraClass = '') {
  const cls = `ui-icon${extraClass ? ' ' + extraClass : ''}`;
  const icons = {
    media: `<span class="${cls}" aria-hidden="true">＋</span>`,
    image: `<span class="${cls}" aria-hidden="true">📷</span>`,
    audio: `<span class="${cls}" aria-hidden="true">🎵</span>`,
    video: `<span class="${cls}" aria-hidden="true">🎬</span>`,
    mic: `<span class="${cls}" aria-hidden="true">🎤</span>`,
    stop: `<span class="${cls}" aria-hidden="true">⏹️</span>`,
    send: `<span class="${cls}" aria-hidden="true">⬆️</span>`,
    settings: `<span class="${cls}" aria-hidden="true">⚙️</span>`,
    moon: `<span class="${cls}" aria-hidden="true">🌙</span>`,
    sun: `<span class="${cls}" aria-hidden="true">☀️</span>`,
    home: `<span class="${cls}" aria-hidden="true">🏠</span>`,
    chat: `<span class="${cls}" aria-hidden="true">💬</span>`,
    bell: `<span class="${cls}" aria-hidden="true">🔔</span>`,
    copy: `<span class="${cls}" aria-hidden="true">📋</span>`,
    eye: `<span class="${cls}" aria-hidden="true">👁️</span>`,
    views: `<span class="${cls}" aria-hidden="true">👁️</span>`,
    edit: `<span class="${cls}" aria-hidden="true">✏️</span>`,
    trash: `<span class="${cls}" aria-hidden="true">🗑️</span>`,
    reactions: `<span class="${cls}" aria-hidden="true">😊</span>`,
    thumb: `<span class="${cls}" aria-hidden="true">👍</span>`,
    heart: `<span class="${cls}" aria-hidden="true">❤️</span>`,
    spark: `<span class="${cls}" aria-hidden="true">✨</span>`,
    ghost: `<span class="${cls}" aria-hidden="true">👻</span>`,
    alert: `<span class="${cls}" aria-hidden="true">⚠️</span>`,
    leaf: `<span class="${cls}" aria-hidden="true">🍃</span>`,
    tree: `<span class="${cls}" aria-hidden="true">🪾</span>`,
    inbox: `<span class="${cls}" aria-hidden="true">📥</span>`,
    plus: `<span class="${cls}" aria-hidden="true">➕</span>`,
    check: `<span class="${cls}" aria-hidden="true">✓</span>`,
    repost: `<span class="${cls}" aria-hidden="true">🔁</span>`,
    lock: `<span class="${cls}" aria-hidden="true">🔒</span>`
  };
  return icons[name] || '';
}

function iconWithText(name, text) {
  return `${iconSprite(name)}<span>${escapeHtml(String(text))}</span>`;
}

function iconWithCount(name, count) {
  return `${iconSprite(name)}<span>${Number(count) || 0}</span>`;
}

function reactionWithCount(emoji, count) {
  return `<span>${escapeHtml(String(emoji))}</span><span>${Number(count) || 0}</span>`;
}

function appendPostMedia(container, post, options = {}) {
  if (!container || !post) return;
  const compact = !!options.compact;
  const imagesList = Array.isArray(post.images) ? post.images : (post.image ? [post.image] : []);
  const videosList = Array.isArray(post.videos) ? post.videos : (post.video ? [post.video] : []);
  const mediaSlides = [];
  imagesList.forEach(url => mediaSlides.push({ type: 'image', url }));
  videosList.forEach(url => mediaSlides.push({ type: 'video', url }));
  if (mediaSlides.length > 0) {
    const carousel = document.createElement('div');
    carousel.className = compact ? 'post-carousel post-carousel-compact' : 'post-carousel';
    const inner = document.createElement('div');
    inner.className = 'post-carousel-inner';
    mediaSlides.forEach(slide => {
      const item = document.createElement('div');
      item.className = 'post-carousel-item';
      if (slide.type === 'image') {
        const img = document.createElement('img');
        img.src = slide.url;
        img.alt = '';
        item.appendChild(img);
      } else {
        const video = document.createElement('video');
        video.controls = true;
        video.src = slide.url;
        item.appendChild(video);
      }
      inner.appendChild(item);
    });
    carousel.appendChild(inner);
    if (mediaSlides.length > 1) {
      const prevBtn = document.createElement('button');
      prevBtn.type = 'button';
      prevBtn.className = 'post-carousel-arrow post-carousel-prev';
      prevBtn.innerHTML = '‹';
      prevBtn.setAttribute('aria-label', 'Previous');
      const nextBtn = document.createElement('button');
      nextBtn.type = 'button';
      nextBtn.className = 'post-carousel-arrow post-carousel-next';
      nextBtn.innerHTML = '›';
      nextBtn.setAttribute('aria-label', 'Next');
      const pagination = document.createElement('div');
      pagination.className = 'post-carousel-pagination';
      const dots = mediaSlides.map((_, slideIndex) => {
        const dot = document.createElement('button');
        dot.type = 'button';
        dot.className = 'post-carousel-dot';
        dot.setAttribute('aria-label', `Go to slide ${slideIndex + 1}`);
        dot.onclick = (event) => {
          event.stopPropagation();
          idx = slideIndex;
          updateCarousel();
        };
        pagination.appendChild(dot);
        return dot;
      });
      let idx = 0;
      const multi = mediaSlides.length > 1;
      function updateCarousel() {
        inner.style.transform = 'translateX(-' + (idx * 100) + '%)';
        prevBtn.classList.toggle('hidden', !multi || idx === 0);
        nextBtn.classList.toggle('hidden', !multi || idx >= mediaSlides.length - 1);
        dots.forEach((dot, dotIndex) => {
          dot.classList.toggle('active', dotIndex === idx);
          dot.setAttribute('aria-current', dotIndex === idx ? 'true' : 'false');
        });
      }
      if (multi) {
        prevBtn.classList.add('hidden');
      } else {
        prevBtn.classList.add('hidden');
        nextBtn.classList.add('hidden');
      }
      prevBtn.onclick = (event) => {
        event.stopPropagation();
        if (idx > 0) {
          idx--;
          updateCarousel();
        }
      };
      nextBtn.onclick = (event) => {
        event.stopPropagation();
        if (idx < mediaSlides.length - 1) {
          idx++;
          updateCarousel();
        }
      };
      carousel.appendChild(pagination);
      carousel.appendChild(prevBtn);
      carousel.appendChild(nextBtn);
      updateCarousel();
    }
    container.appendChild(carousel);
  }
  if (post.audio) {
    const audio = document.createElement('audio');
    audio.controls = true;
    audio.src = post.audio;
    audio.style.width = '100%';
    audio.style.marginTop = '8px';
    container.appendChild(audio);
  }
}

function renderMediaMarkup(entry, options = {}) {
  if (!entry) return '';
  const shell = document.createElement('div');
  appendPostMedia(shell, entry, options);
  return shell.innerHTML;
}

function buildRepostPreview(post) {
  if (!post || !post.repost_post_id) return null;
  const wrapper = document.createElement('div');
  wrapper.className = 'post-repost-preview';

  const label = document.createElement('div');
  label.className = 'post-repost-label';
  label.innerHTML = iconSprite('repost');
  wrapper.appendChild(label);

  if (post.originalPost) {
    const meta = document.createElement('div');
    meta.className = 'post-repost-meta';

    const avatar = document.createElement('img');
    avatar.className = 'avatar-tiny';
    avatar.src = getAvatarUrl(post.originalPost.avatar);
    avatar.style.cursor = 'pointer';
    avatar.onclick = () => showProfile(post.originalPost.user_id);

    const userLink = document.createElement('strong');
    userLink.className = 'clickable-username';
    userLink.textContent = formatUsername(post.originalPost.username, post.originalPost.badge);
    userLink.onclick = () => showProfile(post.originalPost.user_id);

    const time = document.createElement('span');
    time.className = 'post-repost-time';
    time.textContent = new Date(post.originalPost.created_at).toLocaleString();

    meta.appendChild(avatar);
    meta.appendChild(userLink);
    meta.appendChild(time);
    wrapper.appendChild(meta);

    if (post.originalPost.content) {
      const content = document.createElement('div');
      content.className = 'post-repost-content';
      content.textContent = post.originalPost.content;
      wrapper.appendChild(content);
    }

    const media = document.createElement('div');
    media.className = 'post-repost-media';
    appendPostMedia(media, post.originalPost, { compact: true });
    if (media.childNodes.length > 0) wrapper.appendChild(media);
  } else {
    const missing = document.createElement('div');
    missing.className = 'post-repost-missing';
    missing.textContent = t('repostSourceMissing');
    wrapper.appendChild(missing);
  }

  return wrapper;
}

function applyButtonIcon(button, name, text = '') {
  if (!button) return;
  button.innerHTML = text ? iconWithText(name, text) : iconSprite(name);
}

function getChannelById(channelId) {
  return state.channels.find(channel => Number(channel.id) === Number(channelId)) || null;
}

function getTreeChannel() {
  return state.currentChannelId ? getChannelById(state.currentChannelId) : null;
}

function getOwnedChannels() {
  if (!state.user || !state.user.id) return [];
  return state.channels.filter(channel => Number(channel.user_id) === Number(state.user.id));
}

function userOwnsChannel(channel) {
  return !!(channel && state.user && Number(channel.user_id) === Number(state.user.id));
}

async function loadChannels() {
  const channels = await api.get('/channels', state.token);
  state.channels = Array.isArray(channels) ? channels : [];
  if (state.currentChannelId && !getChannelById(state.currentChannelId)) {
    state.currentChannelId = null;
  }
  return state.channels;
}

function renderChannelsList() {
  const container = document.getElementById('tree-forest');
  if (!container) return;
  if (!state.channels.length) {
    container.innerHTML = `
      <section class="tree-card tree-channel card">
        <div class="tree-channel-head">
          <div class="tree-channel-badge">${iconSprite('tree')}</div>
          <div>
            <div class="tree-channel-title">${escapeHtml(t('treeTitle'))}</div>
            <div class="tree-channel-subtitle">${escapeHtml(t('channelEmptySubtitle'))}</div>
          </div>
        </div>
        <div class="tree-empty">${escapeHtml(t('channelEmptyText'))}</div>
      </section>
    `;
    return;
  }
  container.innerHTML = `
    <section class="tree-card tree-channel card">
      <div class="tree-channel-head">
        <div class="tree-channel-badge">${iconSprite('tree')}</div>
        <div>
          <div class="tree-channel-title">${escapeHtml(t('channelsDirectoryTitle'))}</div>
          <div class="tree-channel-subtitle">${escapeHtml(t('channelsDirectorySubtitle').replace('{count}', String(state.channels.length)))}</div>
        </div>
      </div>
      <div class="site-search-results">
        ${state.channels.map(channel => `
          <article class="site-search-result tree-channel-result" data-channel-id="${Number(channel.id)}">
            <div class="site-search-result-top">
              <span class="site-search-badge">${escapeHtml(state.lang === 'ru' ? 'Канал' : 'Channel')}</span>
              <span class="site-search-user">@${escapeHtml(channel.username || '')}</span>
            </div>
            <h3>${escapeHtml(channel.name || '')}</h3>
            <p class="site-search-snippet">${escapeHtml((state.lang === 'ru' ? 'Автор: ' : 'Owner: ') + String(channel.username || ''))}</p>
            <p class="site-search-reason">${escapeHtml((state.lang === 'ru' ? 'Постов: ' : 'Posts: ') + String(channel.posts_count || 0))}</p>
            <button type="button" class="site-search-action">${escapeHtml(t('channelSearchOpen'))}</button>
          </article>
        `).join('')}
      </div>
    </section>
  `;
  container.querySelectorAll('[data-channel-id]').forEach(card => {
    card.onclick = () => {
      const channelId = Number(card.getAttribute('data-channel-id'));
      openChannel(channelId);
    };
  });
}

function renderTreeForest(channel, posts) {
  const container = document.getElementById('tree-forest');
  if (!container) return;
  if (!channel) {
    renderChannelsList();
    return;
  }
  container.innerHTML = `
    <section class="tree-card tree-channel card">
      <div class="tree-channel-head">
        <div class="tree-channel-badge">${iconSprite('tree')}</div>
        <div>
          <div class="tree-channel-title">${escapeHtml(channel.name || t('treeTitle'))}</div>
          <div class="tree-channel-subtitle">${escapeHtml((state.lang === 'ru' ? 'Автор: ' : 'Owner: ') + String(channel.username || ''))}</div>
        </div>
      </div>
      <div class="create-post-actions" style="margin-bottom:14px">
        <button id="tree-back-to-channels" type="button" class="site-search-clear">${escapeHtml(t('channelsBack'))}</button>
        ${userOwnsChannel(channel) ? `<button id="tree-open-channel-composer" type="button" class="btn-primary">${escapeHtml(t('createChannelPost'))}</button>` : ''}
      </div>
      ${Array.isArray(posts) && posts.length ? '<section id="tree-channel-posts"></section>' : `<div class="tree-empty">${escapeHtml(t('channelNoPosts'))}</div>`}
    </section>
  `;
  document.getElementById('tree-back-to-channels')?.addEventListener('click', () => {
    state.currentChannelId = null;
    loadTreePage();
  });
  document.getElementById('tree-open-channel-composer')?.addEventListener('click', () => {
    openChannelPostComposer();
  });
  if (Array.isArray(posts) && posts.length) renderPostsInto(posts, 'tree-channel-posts');
}

async function loadTreePage() {
  const container = document.getElementById('tree-forest');
  if (!container) return;
  showPageLoaderIfEmpty('tree-forest', getLoaderMessage('tree'));
  container.innerHTML = `<div class="card tree-empty">${escapeHtml(state.lang === 'ru' ? 'Собираем ветки...' : 'Growing branches...')}</div>`;
  try {
    await loadChannels();
    if (!state.currentChannelId) {
      state.treePosts = [];
      renderChannelsList();
      return;
    }
    const result = await api.get(`/channels/${state.currentChannelId}/posts`, state.token);
    if (result && result.error) throw new Error(result.error);
    state.treePosts = Array.isArray(result && result.posts) ? result.posts : [];
    renderTreeForest(result && result.channel ? result.channel : getTreeChannel(), state.treePosts);
  } catch (err) {
    container.innerHTML = `<div class="card tree-empty">${escapeHtml(state.lang === 'ru' ? 'Не удалось загрузить каналы.' : 'Failed to load channels.')}</div>`;
  } finally {
    settlePageLoader('tree-forest');
  }
}

function toggleTreeComposer() {
  const composer = document.getElementById('tree-create-post');
  const textarea = document.getElementById('tree-post-content');
  if (!composer || !textarea) return;
  composer.classList.toggle('hidden');
  if (!composer.classList.contains('hidden')) {
    textarea.focus();
    textarea.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }
}

async function openChannel(channelId) {
  state.currentChannelId = Number(channelId) || null;
  switchPage('tree');
}

async function createTreeCommunity() {
  if (!state.token) {
    showAlert(t('loginToPost'));
    return;
  }
  const name = window.prompt(t('createChannelPrompt'));
  const trimmed = String(name || '').trim();
  if (!trimmed) return;
  try {
    const result = await api.post('/channels', { name: trimmed }, state.token);
    if (!result || !result.id) {
      showAlert((result && result.error) || t('channelCreateError'));
      return;
    }
    await loadChannels();
    state.currentChannelId = Number(result.id);
    switchPage('tree');
  } catch (err) {
    showAlert(err.message || t('channelCreateError'));
  }
}

function pickOwnedChannel() {
  const ownedChannels = getOwnedChannels();
  if (!ownedChannels.length) return null;
  if (ownedChannels.length === 1) return ownedChannels[0];
  const options = ownedChannels.map((channel, index) => `${index + 1}. ${channel.name}`).join('\n');
  const selected = Number(window.prompt(`${t('chooseChannelPrompt')}\n${options}`)) - 1;
  return ownedChannels[selected] || null;
}

async function ensureChannelForPosting() {
  await loadChannels();
  const currentChannel = getTreeChannel();
  if (userOwnsChannel(currentChannel)) return currentChannel;
  const ownedChannel = pickOwnedChannel();
  if (ownedChannel) {
    state.currentChannelId = Number(ownedChannel.id);
    return ownedChannel;
  }
  if (!window.confirm(t('channelCreateConfirm'))) return null;
  await createTreeCommunity();
  return getTreeChannel();
}

function openPersonalPostComposer() {
  state.currentChannelId = null;
  switchPage('feed');
  const cp = document.getElementById('create-post');
  if (cp && !cp.classList.contains('hidden')) closeCreatePostComposer();
  else openCreatePostComposer();
}

async function openChannelPostComposer() {
  const channel = await ensureChannelForPosting();
  if (!channel) return;
  switchPage('tree');
  requestAnimationFrame(() => {
    const composer = document.getElementById('tree-create-post');
    const textarea = document.getElementById('tree-post-content');
    if (!composer || !textarea) return;
    composer.classList.remove('hidden');
    textarea.focus();
    textarea.scrollIntoView({ behavior: 'smooth', block: 'center' });
  });
}

async function submitTreePost() {
  if (!state.token) {
    showAlert(t('loginToPost'));
    return;
  }
  const textarea = document.getElementById('tree-post-content');
  if (!textarea) return;
  const content = String(textarea.value || '').trim();
  if (!content) {
    showAlert(t('writeOrAddMedia'));
    return;
  }
  const channel = getTreeChannel();
  if (!channel) {
    showAlert(t('selectChannelFirst'));
    return;
  }
  try {
    const result = await api.post('/posts', { content, channelId: channel.id }, state.token);
    if (result && result.id) {
      textarea.value = '';
      document.getElementById('tree-create-post')?.classList.add('hidden');
      await loadTreePage();
    } else {
      showAlert((result && result.error) || t('publishingError'));
    }
  } catch (err) {
    showAlert(err.message || t('publishingError'));
  }
}

const i18n = {
  en: {
    login: 'Login', register: 'Register', logout: 'Logout', hi: 'Yo,', welcome: 'Welcome', postPlaceholder: "Bro, whats wrong or send meme :)", post: 'Опубликовать', comments: 'Comments', writeComment: 'Write a comment', send: 'Send', create: 'Create', cancel: 'Cancel', loginFailed: 'Login failed', regFailed: 'Registration failed', loginTitle: 'Sign in', registerTitle: 'Create account', authSwitchToRegisterText: 'New here?', authSwitchToLoginText: 'Already have an account?', reactLike: 'Like', reactLove: 'Love', reactFunny: 'Funny', loginToReact: 'Login to react', loginToComment: 'Login to comment', loginToPost: 'Login to post', subscribe: 'Subscribe', unsubscribe: 'Unsubscribe', subscribers: 'Subscribers', following: 'Following', profileViews: 'Views', openSubscriptions: 'Open list', editProfile: 'Edit Profile', notifications: 'Notifications', noNotifications: 'No notifications', markAllAsRead: 'Mark all as read', subscribedYou: 'subscribed to you', postedNew: 'posted a new post', feed: 'Feed', subscriptions: 'Subscriptions', messages: 'Messages', noMessages: 'No messages', typeMessage: 'Type a message...', sendMessage: 'Send Message', online: 'Online', offline: 'Offline', e2eEnabled: 'End-to-end encryption', e2eStatus: 'Status', e2eActive: 'Active', e2eNoPeer: 'No peer key', e2eKeyCopied: 'Key copied', e2eCopyKey: 'Copy key', e2eRegenerate: 'Regenerate keys', e2eRegenerateConfirm: 'Regenerate encryption keys? Old messages will not be decryptable.', postPublished: 'Post published!', switchedToAccount: 'Switched to account {username}',
=======

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
>>>>>>> 43fc63577f740ec07265f99ac0d4769620c4ae8c
    passwordRequirements: 'At least 8 characters, one uppercase, one lowercase, one digit, one special character',
    password_min_length: 'Password must be at least 8 characters',
    password_need_upper: 'Password must contain at least one uppercase letter',
    password_need_lower: 'Password must contain at least one lowercase letter',
    password_need_digit: 'Password must contain at least one digit',
<<<<<<< HEAD
=======
    password_confirm_mismatch: 'Passwords do not match',
>>>>>>> 43fc63577f740ec07265f99ac0d4769620c4ae8c
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
<<<<<<< HEAD
    noProfileSubscriptions: 'This user is not following anyone yet.',
    noProfileSubscribers: 'This user has no subscribers yet.',
    errorLoadingSubscriptions: 'Failed to load subscriptions',
    errorLoadingSubscribers: 'Failed to load subscribers',
    viewInSubscriptions: 'View in Subscriptions',
    DeletePost: 'Delete Post',
    deleteConfirm: 'Delete this post?',
    deleteError: 'Failed to delete post',
    publishedPosts: 'Published posts',
    repost: 'Repost',
    repostedPost: 'Reposted post',
    repostOf: 'Repost of',
    loginToRepost: 'Login to repost',
    repostSuccess: 'Post reposted to your profile',
    repostError: 'Failed to repost post',
    repostedAlready: 'You already reposted this post',
    repostSourceMissing: 'The original post is no longer available',
    usernamePlaceholder: 'Username',
    passwordPlaceholder: 'Password',
    showReactions: 'Show reactions',
    addMedia: 'Add media',
    addImage: 'Add image',
    addAudio: 'Add audio',
    addVideo: 'Add video',
    writeOrAddMedia: 'Please write something or add media',
    publishingError: 'Error publishing post',
    userNotFound: 'User not found',
    changeAvatar: 'Change avatar',
    upload: 'Upload',
    selectFile: 'Please select a file',
    avatarUpdated: 'Avatar updated',
    uploadAvatarFailed: 'Failed to upload avatar',
    backgroundUpdated: 'Background updated',
    uploadBackgroundFailed: 'Failed to upload background',
    bio: 'Bio',
    addDescription: 'Add description',
    editDescription: 'Edit description',
    noDescription: 'No description yet',
    save: 'Save',
    bioRequired: 'Bio required',
    bioUpdated: 'Bio updated',
    username: 'Username',
    usernameAvailable: 'Username is available',
    usernameTaken: 'Username is taken',
    changeUsername: 'Change username',
    changeBackground: 'Change background',
    createNewPost: 'Create new post',
    privateProfile: 'Private profile',
    privateProfileOn: 'Private profile enabled',
    privateProfileOff: 'Private profile disabled',
    privateProfileHint: 'Only approved viewers and subscribers can see your content.',
    requestViewAccess: 'Request access',
    requestViewPending: 'Access requested',
    subscribeRequestPending: 'Subscription requested',
    requestSubscription: 'Request subscription',
    profileContentLocked: 'This profile is private',
    profileContentLockedText: 'Send a request to view posts or subscribe, and wait for approval.',
    settingsMenuOpen: 'Open settings',
    requestedViewAccess: 'requested access to your private profile',
    requestedSubscription: 'requested a subscription to your profile',
    requestApprovedView: 'approved your request to view the profile',
    requestApprovedSubscribe: 'approved your subscription request',
    requestRejectedView: 'declined your request to view the profile',
    requestRejectedSubscribe: 'declined your subscription request',
    approve: 'Approve',
    reject: 'Decline',
    requestAlreadyPending: 'Request already sent',
    profile_private: 'This profile is private',
    privateProfilePostBlocked: 'This profile is private.',
    deleteProfile: 'Delete profile',
    deleteProfileConfirm: 'Delete your profile? This cannot be undone.',
    home: 'Home',
    createdBy: 'Created by',
    languageRussian: 'Russian',
    languageEnglish: 'English',
    settings: 'Settings',
    language: 'Language',
    theme: 'Theme',
    viewProfile: 'View profile',
    toggleTheme: 'Toggle theme',
    post: 'Post',
    profile: 'Profile',
    status: 'Status',
    goHome: 'Go to home',
    confirmPasswordPlaceholder: 'Confirm password',
    passwordMismatch: 'Passwords do not match',
    recoveryCodeTitle: 'Your recovery code',
    recoveryCodeDescription: 'Save this code in a secure place. It will be needed to restore access to your account.',
    copyCode: 'Copy',
    copied: 'Copied',
    recoverAccess: 'Recover account access',
    recoveryPrompt: 'Enter your username, recovery code and a new password.',
    recoveryCodePlaceholder: 'Recovery code',
    newPasswordPlaceholder: 'New password',
    confirmNewPasswordPlaceholder: 'Confirm new password',
    recoveryFailed: 'Failed to recover account',
    recoverySuccess: 'Password has been changed. You are logged in.',
    support: 'Support',
    supportTitle: 'What happened to you?',
    supportOption1: 'My account was hacked',
    supportOption2: "I can't log into my account",
    supportOption3: 'Request verification',
    supportOption4: 'Scammer',
    supportNotified: 'We have notified the site owner.',
    supportScammerPlaceholder: 'Link to scammer profile',
    supportSubmit: 'Send report',
    addAccount: 'Add account',
    switchAccount: 'Switch account',
    siteNews: 'Site news',
    siteNewsCaption: 'News and updates about tap itself',
    siteNewsPlaceholder: 'Write a site update for everyone',
    noSiteNews: 'No site updates yet.',
    publishSiteNews: 'Publish update',
    siteNewsPublished: 'Site update published',
    siteNewsLoadError: 'Could not load site news right now.',
    editPost: 'Edit post',
    searchTitle: 'AI site search',
    searchCaption: 'Find people and posts on the site',
    searchPlaceholder: 'Ask what you want to find on the site',
    searchSubmit: '🔍',
    searchClear: 'Clear',
    searchLoading: 'Searching through the site...',
    searchEmpty: 'No matching results were found.',
    searchOpenPost: 'Open post',
    searchOpenProfile: 'Open profile',
    searchError: 'Search failed. Please try again.',
    searchSummaryFallback: 'Here is what I found on the site.',
    newChat: 'New chat',
    back: 'Back',
    chatSearchTitle: 'Start a conversation',
    chatSearchCaption: 'AI will help find the right user by name',
    chatSearchPlaceholder: 'Type a username',
    chatSearchHint: 'Enter a username or part of it, then choose a person to open chat.',
    chatSearchNoUsers: 'No users were found for this query.',
    chatSearchOpen: 'Open chat',
    chatSearchError: 'Could not find users right now.'
  },
  ru: {
    login: 'Вход', register: 'Регистрация', logout: 'Выход', hi: 'Йоу,', welcome: 'Добро пожаловать', postPlaceholder: 'Что нового?', post: 'Опубликовать', comments: 'Комментарии', writeComment: 'Написать комментарий', send: 'Отправить', create: 'Создать', cancel: 'Отмена', loginFailed: 'Ошибка входа', regFailed: 'Ошибка регистрации', loginTitle: 'Вход', registerTitle: 'Создать аккаунт', authSwitchToRegisterText: 'Новый здесь?', authSwitchToLoginText: 'Уже есть аккаунт?', reactLike: 'Нравится', reactLove: 'Люблю', reactFunny: 'Смешно', loginToReact: 'Войдите чтобы реагировать', loginToComment: 'Войдите чтобы комментировать', loginToPost: 'Войдите чтобы публиковать', subscribe: 'Подписаться', unsubscribe: 'Отписаться', subscribers: 'Подписчики', following: 'Подписки', profileViews: 'Просмотры', openSubscriptions: 'Открыть список', editProfile: 'Редактировать профиль', notifications: 'Уведомления', noNotifications: 'Нет уведомлений', markAllAsRead: 'Отметить все как прочитанные', subscribedYou: 'подписался на вас', postedNew: 'опубликовал новый пост', feed: 'Лента', subscriptions: 'Подписки', messages: 'Сообщения', noMessages: 'Нет сообщений', typeMessage: 'Напишите сообщение...', sendMessage: 'Написать сообщение', online: 'В сети', offline: 'Не в сети', e2eEnabled: 'End-to-end шифрование', e2eStatus: 'Статус', e2eActive: 'Активено', e2eNoPeer: 'Нет ключа собеседника', e2eKeyCopied: 'Ключ скопирован', e2eCopyKey: 'Копировать ключ', e2eRegenerate: 'Пересоздать ключи', e2eRegenerateConfirm: 'Пересоздать ключи шифрования? Старые сообщения нельзя будет расшифровать.', postPublished: 'Пост опубликован!', switchedToAccount: 'Вы перешли на аккаунт {username}',
=======
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
    editorListLabel: 'List',
    settingsLabel: 'Settings',
    scrollTopTitle: 'Back to top',
    footerCredit: 'Created by blau3 and Komi',
    pollCreateTitle: '📊 Create poll',
    messageTitle: 'Message',
    confirmTitle: 'Confirm',
    yes: 'Yes',
    no: 'No',
    botCheckTitle: 'Bot check',
    botCheckQuestionPrefix: 'What is',
    botCheckWrong: 'Wrong answer, please try again',
    botCheckPlaceholder: 'Enter the sum',
    ok: 'OK',
    voteSavedLocal: 'Thanks, your vote is saved locally on this device.',
    noReactions: 'No reactions',
    reactAction: 'React',
    recommendedForYou: 'Recommended for you',
    authWelcomeTitle: 'Welcome to Green Social',
    authWelcomeDesc: 'Join the community to view posts, comment, and chat with other users.',
    allCategories: 'All categories',
    chooseCategoryEmoji: 'Choose category emoji',
    yourSubscriptions: 'Your subscriptions',
    noCommentsYet: 'No comments yet',
    createPostRequired: 'Write something or add media',
    startChat: 'Say hello!',
    storyTitle: 'Voice story',
    storySubtitle: 'Record a short voice message',
    storyTextPlaceholder: 'Text (optional)',
    share: 'Share',
    recordVoiceFirst: 'Record your voice first',
    storyCreateFailed: 'Failed to create story',
    usernamePlaceholder: 'username',
    passwordPlaceholder: 'password',
    repeatPasswordPlaceholder: 'repeat password',
    showPassword: 'Show password',
    hidePassword: 'Hide password',
    generatePassword: 'Generate password',
    lampToggleHint: 'Click lamp to toggle lights'
  },
  ru: {
    login: 'Вход', register: 'Регистрация', logout: 'Выход', hi: 'Йоу,', welcome: 'Добро пожаловать', postPlaceholder: 'Что нового?', post: 'Опубликовать', publishedPosts: 'Опубликованные посты', comments: 'Комментарии', writeComment: 'Написать комментарий', send: 'Отправить', create: 'Создать', cancel: 'Отмена', loginFailed: 'Ошибка входа', regFailed: 'Ошибка регистрации', loginTitle: 'Вход', registerTitle: 'Создать аккаунт', reactLike: 'Нравится', reactLove: 'Люблю', reactFunny: 'Смешно', loginToReact: 'Войдите чтобы реагировать', loginToComment: 'Войдите чтобы комментировать', loginToPost: 'Войдите чтобы публиковать', subscribe: 'Подписаться', unsubscribe: 'Отписаться', subscribers: 'Подписчики', editProfile: 'Редактировать профиль', notifications: 'Уведомления', noNotifications: 'Нет уведомлений', markAllAsRead: 'Отметить все как прочитанные', subscribedYou: 'подписался на вас', postedNew: 'опубликовал новый пост', feed: 'Лента', subscriptions: 'Подписки', messages: 'Сообщения', noMessages: 'Нет сообщений', typeMessage: 'Напишите сообщение...', sendMessage: 'Написать сообщение',
>>>>>>> 43fc63577f740ec07265f99ac0d4769620c4ae8c
    passwordRequirements: 'Минимум 8 символов, заглавная и строчная буква, цифра и спецсимвол',
    password_min_length: 'Пароль должен быть не короче 8 символов',
    password_need_upper: 'В пароле должна быть хотя бы одна заглавная буква',
    password_need_lower: 'В пароле должна быть хотя бы одна строчная буква',
    password_need_digit: 'В пароле должна быть хотя бы одна цифра',
<<<<<<< HEAD
=======
    password_confirm_mismatch: 'Пароли не совпадают',
>>>>>>> 43fc63577f740ec07265f99ac0d4769620c4ae8c
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
<<<<<<< HEAD
    noProfileSubscriptions: 'Этот пользователь пока ни на кого не подписан.',
    noProfileSubscribers: 'У этого пользователя пока нет подписчиков.',
    errorLoadingSubscriptions: 'Не удалось загрузить подписки',
    errorLoadingSubscribers: 'Не удалось загрузить подписчиков',
    viewInSubscriptions: 'Открыть в подписках',
    DeletePost: 'Удалить публикацию',
    deleteConfirm: 'Удалить этот пост?',
    deleteError: 'Не удалось удалить пост',
    publishedPosts: 'Опубликованные посты',
    repost: 'Репост',
    repostedPost: 'Репост',
    repostOf: 'Репост публикации',
    loginToRepost: 'Войдите чтобы сделать репост',
    repostSuccess: 'Пост добавлен в ваш аккаунт как репост',
    repostError: 'Не удалось сделать репост',
    repostedAlready: 'Вы уже репостнули этот пост',
    repostSourceMissing: 'Оригинальный пост больше недоступен',
    usernamePlaceholder: 'Имя пользователя',
    passwordPlaceholder: 'Пароль',
    showReactions: 'Показать реакции',
    addMedia: 'Добавить медиа',
    addImage: 'Добавить фото',
    addAudio: 'Добавить аудио',
    addVideo: 'Добавить видео',
    writeOrAddMedia: 'Напишите текст или добавьте медиа',
    publishingError: 'Ошибка публикации поста',
    userNotFound: 'Пользователь не найден',
    changeAvatar: 'Сменить аватар',
    upload: 'Загрузить',
    selectFile: 'Выберите файл',
    avatarUpdated: 'Аватар обновлён',
    uploadAvatarFailed: 'Не удалось загрузить аватар',
    backgroundUpdated: 'Фон обновлён',
    uploadBackgroundFailed: 'Не удалось загрузить фон',
    bio: 'О себе',
    addDescription: 'Добавить описание',
    editDescription: 'Изменить описание',
    noDescription: 'Описание пока не добавлено',
    save: 'Сохранить',
    bioRequired: 'Поле обязательно',
    bioUpdated: 'Профиль обновлён',
    username: 'Имя пользователя',
    usernameAvailable: 'Имя свободно',
    usernameTaken: 'Имя занято',
    changeUsername: 'Сменить имя',
    changeBackground: 'Сменить фон',
    createNewPost: 'Создать новый пост',
    privateProfile: 'Закрытый профиль',
    privateProfileOn: 'Закрытый профиль включён',
    privateProfileOff: 'Закрытый профиль выключен',
    privateProfileHint: 'Контент увидят только одобренные зрители и подписчики.',
    requestViewAccess: 'Запросить доступ',
    requestViewPending: 'Доступ запрошен',
    subscribeRequestPending: 'Заявка на подписку отправлена',
    requestSubscription: 'Подать заявку на подписку',
    profileContentLocked: 'Профиль закрыт',
    profileContentLockedText: 'Отправьте заявку на просмотр контента или на подписку и дождитесь одобрения.',
    settingsMenuOpen: 'Открыть настройки',
    requestedViewAccess: 'запросил доступ к вашему закрытому профилю',
    requestedSubscription: 'подал заявку на подписку на ваш профиль',
    requestApprovedView: 'одобрил вам доступ к профилю',
    requestApprovedSubscribe: 'одобрил вашу заявку на подписку',
    requestRejectedView: 'отклонил ваш запрос на просмотр профиля',
    requestRejectedSubscribe: 'отклонил вашу заявку на подписку',
    approve: 'Одобрить',
    reject: 'Отклонить',
    requestAlreadyPending: 'Заявка уже отправлена',
    profile_private: 'Этот профиль закрыт',
    privateProfilePostBlocked: 'Этот профиль закрыт.',
    deleteProfile: 'Удалить профиль',
    deleteProfileConfirm: 'Удалить профиль? Это действие нельзя отменить.',
    home: 'Главная страница',
    createdBy: 'Создано',
    languageRussian: 'Русский',
    languageEnglish: 'Английский',
    settings: 'Настройки',
    language: 'Язык',
    theme: 'Тема',
    viewProfile: 'Профиль',
    toggleTheme: 'Переключить тему',
    post: 'Пост',
    profile: 'Профиль',
    status: 'Статус',
    goHome: 'На главную',
    confirmPasswordPlaceholder: 'Подтвердите пароль',
    passwordMismatch: 'Пароли не совпадают',
    recoveryCodeTitle: 'Ваш код восстановления',
    recoveryCodeDescription: 'Сохраните этот код в надежном месте. Он понадобится, чтобы восстановить доступ к аккаунту.',
    copyCode: 'Скопировать',
    copied: 'Скопировано',
    recoverAccess: 'Восстановить доступ к аккаунту',
    recoveryPrompt: 'Введите имя пользователя, код восстановления и новый пароль.',
    recoveryCodePlaceholder: 'Код восстановления',
    newPasswordPlaceholder: 'Новый пароль',
    confirmNewPasswordPlaceholder: 'Подтвердите новый пароль',
    recoveryFailed: 'Не удалось восстановить доступ',
    recoverySuccess: 'Пароль изменён. Вы вошли в аккаунт.',
    support: 'Поддержка',
    supportTitle: 'Что у вас случилось?',
    supportOption1: 'Мой аккаунт взломали',
    supportOption2: 'Не могу войти в свой аккаунт',
    supportOption3: 'Запросить верификацию',
    supportOption4: 'Мошенник',
    supportNotified: 'Мы сообщили владельцу сайта.',
    supportScammerPlaceholder: 'Ссылка на профиль мошенника',
    supportSubmit: 'Отправить жалобу',
    addAccount: 'Добавить аккаунт',
    switchAccount: 'Сменить аккаунт',
    siteNews: 'Новости сайта',
    siteNewsCaption: 'Новости и обновления самого tap',
    siteNewsPlaceholder: 'Напишите обновление сайта для всех',
    noSiteNews: 'Обновлений сайта пока нет.',
    publishSiteNews: 'Опубликовать обновление',
    siteNewsPublished: 'Обновление сайта опубликовано',
    siteNewsLoadError: 'Сейчас не удалось загрузить новости сайта.',
    editPost: 'Редактировать пост',
    searchTitle: 'AI-поиск по сайту',
    searchCaption: 'Находит людей и посты на сайте',
    searchPlaceholder: 'Напишите, что хотите найти на сайте',
    searchSubmit: '🔍',
    searchClear: 'Очистить',
    searchLoading: 'Ищем по содержимому сайта...',
    searchEmpty: 'Подходящих результатов не найдено.',
    searchOpenPost: 'Открыть пост',
    searchOpenProfile: 'Открыть профиль',
    searchError: 'Не удалось выполнить поиск. Попробуйте ещё раз.',
    searchSummaryFallback: 'Вот что нашлось на сайте.',
    newChat: 'Новый чат',
    back: 'Назад',
    chatSearchTitle: 'Начать диалог',
    chatSearchCaption: 'Нейросеть поможет найти нужного пользователя по имени',
    chatSearchPlaceholder: 'Введите имя пользователя',
    chatSearchHint: 'Введите ник или его часть, затем выберите пользователя для открытия чата.',
    chatSearchNoUsers: 'По этому запросу пользователи не найдены.',
    chatSearchOpen: 'Открыть чат',
    chatSearchError: 'Сейчас не удалось найти пользователей.'
  }
};

// Recommended profile background minimal size
const PROFILE_BG_MIN_WIDTH = 1200;
const PROFILE_BG_MIN_HEIGHT = 400;

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
=======
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
    editorListLabel: 'Список',
    settingsLabel: 'Настройки',
    scrollTopTitle: 'Наверх',
    footerCredit: 'Created by blau3 and Komi',
    pollCreateTitle: '📊 Создать опрос',
    messageTitle: 'Сообщение',
    confirmTitle: 'Подтверждение',
    yes: 'Да',
    no: 'Нет',
    botCheckTitle: 'Проверка, что вы не бот',
    botCheckQuestionPrefix: 'Сколько будет',
    botCheckWrong: 'Неверный ответ, попробуйте ещё раз',
    botCheckPlaceholder: 'Введите сумму',
    ok: 'ОК',
    voteSavedLocal: 'Спасибо, ваш голос учтен (локально на этом устройстве).',
    noReactions: 'Нет реакций',
    reactAction: 'Реакция',
    recommendedForYou: 'Рекомендовано для вас',
    authWelcomeTitle: 'Добро пожаловать в Green Social',
    authWelcomeDesc: 'Присоединяйтесь к сообществу, чтобы видеть посты, комментировать и общаться с другими пользователями.',
    allCategories: 'Все категории',
    chooseCategoryEmoji: 'Выбери эмодзи категории',
    yourSubscriptions: 'Ваши подписки',
    noCommentsYet: 'Пока нет комментариев',
    createPostRequired: 'Напишите что-нибудь или добавьте медиа',
    startChat: 'Начните диалог!',
    storyTitle: 'Голосовая история',
    storySubtitle: 'Запиши короткое голосовое сообщение',
    storyTextPlaceholder: 'Текст (по желанию)',
    share: 'Поделиться',
    recordVoiceFirst: 'Сначала запиши голос',
    storyCreateFailed: 'Не удалось создать историю',
    usernamePlaceholder: 'имя пользователя',
    passwordPlaceholder: 'пароль',
    repeatPasswordPlaceholder: 'повторите пароль',
    showPassword: 'Показать пароль',
    hidePassword: 'Скрыть пароль',
    generatePassword: 'Сгенерировать пароль',
    lampToggleHint: 'Нажми на лампу, чтобы переключить свет'
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
>>>>>>> 43fc63577f740ec07265f99ac0d4769620c4ae8c
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

<<<<<<< HEAD
function createNotificationRuntimeState() {
  return {
    userId: null,
    knownIds: [],
    unreadCount: 0,
    initialized: false
  };
}

let chatThread = null;
let state = {
=======
const state = {
>>>>>>> 43fc63577f740ec07265f99ac0d4769620c4ae8c
  token: localStorage.getItem('token'),
  user: JSON.parse(localStorage.getItem('user') || 'null'),
  lang: localStorage.getItem('lang') || (navigator.language && navigator.language.startsWith('ru') ? 'ru' : 'en'),
  currentPage: 'feed',
<<<<<<< HEAD
  siteSearch: {
    query: '',
    loading: false,
    results: [],
    summary: ''
  },
  channelSearch: {
    query: '',
    loading: false,
    results: [],
    summary: ''
  },
  channels: [],
  currentChannelId: null,
  treePosts: [],
  nav: {
    profileUserId: null,
    postId: null
  },
  notifications: createNotificationRuntimeState()
};

let openPostEditMenu = null;
let openPostEditTrigger = null;
let isCreateMenuOpen = false;

const NAV_STORAGE_KEY = 'tap-nav';
const ACCOUNTS_STORAGE_KEY = 'tap-accounts';
const NOTIFICATIONS_POLL_INTERVAL_MS = 12000;
const MAX_TRACKED_NOTIFICATION_IDS = 120;
const pageLoaderEl = document.getElementById('page-loader');
const pageLoaderTextEl = document.getElementById('page-loader-text');

if (pageLoaderEl) {
  document.body.classList.add('app-loading');
}

function getLoaderMessage(page = state.currentPage) {
  if (page === 'news') return state.lang === 'ru' ? 'Собираем новости сайта…' : 'Loading site news...';
  if (page === 'tree') return state.lang === 'ru' ? 'Выращиваем дерево публикаций…' : 'Growing the content tree...';
  if (page === 'chats') return state.lang === 'ru' ? 'Подключаем чаты…' : 'Connecting chats...';
  if (page === 'notifications') return state.lang === 'ru' ? 'Проверяем уведомления…' : 'Loading notifications...';
  if (page === 'subscriptions') return state.lang === 'ru' ? 'Загружаем посты подписок…' : 'Loading subscriptions feed...';
  return state.lang === 'ru' ? 'Загружаем контент…' : 'Loading content...';
}

function containerHasContent(containerId) {
  const container = document.getElementById(containerId);
  if (!container) return false;
  if (container.children.length > 0) return true;
  return !!String(container.textContent || '').trim();
}

function showPageLoader(message = getLoaderMessage()) {
  if (!pageLoaderEl) return;
  if (pageLoaderTextEl) pageLoaderTextEl.textContent = message;
  pageLoaderEl.classList.remove('is-hidden');
  document.body.classList.add('app-loading');
}

function hidePageLoader() {
  if (!pageLoaderEl) return;
  pageLoaderEl.classList.add('is-hidden');
  document.body.classList.remove('app-loading');
}

function showPageLoaderIfEmpty(containerId, message = getLoaderMessage()) {
  if (!containerHasContent(containerId)) showPageLoader(message);
}

function settlePageLoader(containerId = null) {
  setTimeout(() => {
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        hidePageLoader();
      });
    });
  }, 50);
}

function resetNotificationTracking(options = {}) {
  state.notifications = createNotificationRuntimeState();
  if (options.updateTab !== false) updateNotificationsTab(0);
}

function getNotificationToastMessage(notification) {
  if (!notification) return t('notifications');
  const actor = notification.username ? formatUsername(notification.username) : t('notifications');
  const detail = getNotificationMessage(notification).trim();
  return detail ? `${actor} ${detail}` : actor;
}

function syncNotificationsState(notifications, options = {}) {
  const list = Array.isArray(notifications) ? notifications : [];
  const currentUserId = state.user && state.user.id ? String(state.user.id) : null;
  if (!state.token || !currentUserId) {
    resetNotificationTracking();
    return { unreadCount: 0, freshNotifications: [], changed: false };
  }

  const previousState = state.notifications || createNotificationRuntimeState();
  const isSameUser = previousState.userId === currentUserId;
  const knownIds = isSameUser ? new Set(previousState.knownIds || []) : new Set();
  const unreadCount = list.filter(notification => !notification.is_read).length;
  const allowToasts = !!options.allowToasts && isSameUser && previousState.initialized;
  const freshNotifications = allowToasts
    ? list.filter(notification => notification && notification.id != null && !knownIds.has(String(notification.id)))
    : [];

  state.notifications = {
    userId: currentUserId,
    knownIds: list
      .filter(notification => notification && notification.id != null)
      .map(notification => String(notification.id))
      .slice(0, MAX_TRACKED_NOTIFICATION_IDS),
    unreadCount,
    initialized: true
  };

  return {
    unreadCount,
    freshNotifications: freshNotifications.reverse(),
    changed: !isSameUser
      || previousState.unreadCount !== unreadCount
      || freshNotifications.length > 0
  };
}

function readSavedAccounts() {
  try {
    const raw = localStorage.getItem(ACCOUNTS_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed
      .filter(acc => acc && acc.token && acc.user && acc.user.id)
      .map(acc => ({ ...acc, user: normalizeSessionUser(acc.user) }));
  } catch (err) {
    console.warn('Failed to read saved accounts', err);
    return [];
  }
}

function writeSavedAccounts(accounts) {
  localStorage.setItem(ACCOUNTS_STORAGE_KEY, JSON.stringify(accounts));
}

function saveAccountSession(token, user) {
  if (!token || !user || !user.id) return;
  const accounts = readSavedAccounts();
  const normalized = { token, user: normalizeSessionUser(user) };
  const next = [normalized, ...accounts.filter(acc => String(acc.user.id) !== String(user.id))];
  writeSavedAccounts(next);
}

function updateCurrentUser(nextUser) {
  if (!state.user || !nextUser) return;
  state.user = normalizeSessionUser({ ...state.user, ...nextUser });
  localStorage.setItem('user', JSON.stringify(state.user));
  if (state.token) saveAccountSession(state.token, state.user);
  renderAuth();
}

function removeSavedAccount(userId) {
  const accounts = readSavedAccounts().filter(acc => String(acc.user.id) !== String(userId));
  writeSavedAccounts(accounts);
  return accounts;
}

function refreshCurrentPageData() {
  if (state.currentPage === 'chats') loadChatsPage();
  else if (state.currentPage === 'notifications') loadNotificationsPage();
  else if (state.currentPage === 'news') loadSiteNews();
  else if (state.currentPage === 'tree') loadTreePage();
  else if (state.currentPage === 'subscriptions') loadSubscriptionsPosts();
  else loadPosts();
  refreshNotificationsIndicator();
}

async function applySession(token, user, options = {}) {
  const { saveAccount = true } = options;
  const normalizedUser = normalizeSessionUser(user);
  state.token = token;
  state.user = normalizedUser;
  resetNotificationTracking({ updateTab: false });
  localStorage.setItem('token', token);
  localStorage.setItem('user', JSON.stringify(normalizedUser));
  if (saveAccount) saveAccountSession(token, normalizedUser);
  startPresenceHeartbeat();
  startNotificationsPolling();
  renderAuth();
  refreshCurrentPageData();
  await initE2EKeys();
}

async function initE2EKeys() {
  try {
    await E2EEncryption.loadKeys();
    const publicKeyJwk = await E2EEncryption.getPublicKeyJwk();
    await api.post('/keys/me', { publicKey: JSON.stringify(publicKeyJwk), keyType: 'x25519' }, state.token);
  } catch (e) {
    console.warn('E2E key initialization failed:', e);
  }
}

function switchSavedAccount(userId) {
  const next = readSavedAccounts().find(acc => String(acc.user.id) === String(userId));
  if (!next) return;
  applySession(next.token, next.user, { saveAccount: false });
  showAlert(t('switchedToAccount').replace('{username}', next.user.username || 'Unknown'));
}

function bootstrapSavedAccounts() {
  const accounts = readSavedAccounts();
  if (state.token && state.user && state.user.id) {
    saveAccountSession(state.token, state.user);
    return;
  }
  if (accounts.length) {
    state.token = accounts[0].token;
    state.user = accounts[0].user;
    localStorage.setItem('token', accounts[0].token);
    localStorage.setItem('user', JSON.stringify(accounts[0].user));
  }
}

function persistNavigationState() {
  localStorage.setItem(NAV_STORAGE_KEY, JSON.stringify({
    currentPage: state.currentPage,
    profileUserId: state.nav.profileUserId,
    postId: state.nav.postId
  }));
}

function restoreNavigationState() {
  try {
    const raw = localStorage.getItem(NAV_STORAGE_KEY);
    if (!raw) return;
    const saved = JSON.parse(raw);
    const allowedPages = new Set(['feed', 'news', 'tree', 'chats', 'notifications']);
    if (allowedPages.has(saved.currentPage)) state.currentPage = saved.currentPage;
    state.nav.profileUserId = saved.profileUserId ? String(saved.profileUserId) : null;
    state.nav.postId = saved.postId ? String(saved.postId) : null;
  } catch (err) {
    console.warn('Failed to restore navigation state', err);
  }
}

bootstrapSavedAccounts();

=======
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

>>>>>>> 43fc63577f740ec07265f99ac0d4769620c4ae8c
const api = {
  async get(path, token) {
    const headers = {};
    if (token) headers.Authorization = 'Bearer ' + token;
    const r = await fetch('/api' + path, { headers });
<<<<<<< HEAD
    return r.json();
=======
    return r.json().catch(() => ({}));
>>>>>>> 43fc63577f740ec07265f99ac0d4769620c4ae8c
  },
  async post(path, body, token) {
    const headers = { 'Content-Type': 'application/json' };
    if (token) headers.Authorization = 'Bearer ' + token;
    const r = await fetch('/api' + path, { method: 'POST', headers, body: JSON.stringify(body) });
<<<<<<< HEAD
    return r.json();
=======
    return r.json().catch(() => ({}));
>>>>>>> 43fc63577f740ec07265f99ac0d4769620c4ae8c
  },
  async put(path, body, token) {
    const headers = { 'Content-Type': 'application/json' };
    if (token) headers.Authorization = 'Bearer ' + token;
    const r = await fetch('/api' + path, { method: 'PUT', headers, body: JSON.stringify(body) });
<<<<<<< HEAD
    return r.json();
=======
    return r.json().catch(() => ({}));
>>>>>>> 43fc63577f740ec07265f99ac0d4769620c4ae8c
  },
  async postFormData(path, formData, token) {
    const headers = {};
    if (token) headers.Authorization = 'Bearer ' + token;
    const r = await fetch('/api' + path, { method: 'POST', headers, body: formData });
<<<<<<< HEAD
    return r.json();
=======
    return r.json().catch(() => ({}));
>>>>>>> 43fc63577f740ec07265f99ac0d4769620c4ae8c
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
<<<<<<< HEAD
  setCreateMenuOpen(false);
  const feedPage = document.getElementById('feed-page');
  const newsPage = document.getElementById('news-page');
  const treePage = document.getElementById('tree-page');
  const chatsPage = document.getElementById('chats-page');
  const notificationsPage = document.getElementById('notifications-page');
  const feedTab = document.getElementById('tab-feed');
  const treeTab = document.getElementById('tab-tree');
  const chatsTab = document.getElementById('tab-chats');
  const notificationsTab = document.getElementById('tab-notifications');
  const headerNewsBtn = document.getElementById('header-news-btn');

  const currentActivePage = document.querySelector('.page.active');
  
  feedPage?.classList.remove('active');
  newsPage?.classList.remove('active');
  treePage?.classList.remove('active');
  chatsPage?.classList.remove('active');
  notificationsPage?.classList.remove('active');
  feedTab?.classList.remove('active');
  treeTab?.classList.remove('active');
  chatsTab?.classList.remove('active');
  notificationsTab?.classList.remove('active');
  feedTab?.setAttribute('aria-selected', 'false');
  treeTab?.setAttribute('aria-selected', 'false');
  chatsTab?.setAttribute('aria-selected', 'false');
  notificationsTab?.setAttribute('aria-selected', 'false');
  
  headerNewsBtn?.classList.remove('active');

  if (page === 'feed') {
    feedPage?.classList.add('active');
    feedPage?.classList.add('entering');
    feedTab?.classList.add('active');
    feedTab?.setAttribute('aria-selected', 'true');
  } else if (page === 'tree') {
    treePage?.classList.add('active');
    treePage?.classList.add('entering');
    treeTab?.classList.add('active');
    treeTab?.setAttribute('aria-selected', 'true');
    loadTreePage();
  } else if (page === 'news') {
    newsPage?.classList.add('active');
    newsPage?.classList.add('entering');
    headerNewsBtn?.classList.add('active');
    loadSiteNews();
  } else if (page === 'chats') {
    chatsPage?.classList.add('active');
    chatsPage?.classList.add('entering');
    chatsTab?.classList.add('active');
    chatsTab?.setAttribute('aria-selected', 'true');
    loadChatsPage();
  } else if (page === 'notifications') {
    notificationsPage?.classList.add('active');
    notificationsPage?.classList.add('entering');
    notificationsTab?.classList.add('active');
    notificationsTab?.setAttribute('aria-selected', 'true');
    loadNotificationsPage();
  }

  // Animate page transition (fade + slide)
  if (currentActivePage && currentActivePage.classList && !currentActivePage.classList.contains('active')) {
    currentActivePage.classList.remove('entering');
    currentActivePage.classList.add('leaving');
    const onEnd = () => {
      currentActivePage.classList.remove('leaving');
      currentActivePage.removeEventListener('transitionend', onEnd);
    };
    currentActivePage.addEventListener('transitionend', onEnd);
    // safety cleanup
    setTimeout(() => {
      currentActivePage.classList.remove('leaving');
      currentActivePage.removeEventListener('transitionend', onEnd);
    }, 400);
  }

  requestAnimationFrame(() => {
    document.querySelectorAll('.page.entering').forEach(el => el.classList.remove('entering'));
  });

  updateBottomNavLabels();
  state.nav.postId = null;
  persistNavigationState();
  updateBreadcrumb();
  updateGlobalHomeButton();
}

function setBottomNavIcon(btn, iconType, options = {}) {
  if (!btn) return;
  const { showUnreadDot, label } = options;
  if (label !== undefined) btn.dataset.label = String(label || '');
  btn.classList.remove('bottom-nav-btn--label');
  btn.innerHTML = iconSprite(iconType, 'bottom-nav-icon') + (showUnreadDot ? `<span class="bottom-nav-unread-dot" aria-hidden="true"></span>` : '');
}

function updateBottomNavLabels() {
  const tabs = [
    document.getElementById('tab-feed'),
    document.getElementById('tab-tree'),
    document.getElementById('tab-chats'),
    document.getElementById('tab-notifications')
  ].filter(Boolean);

  for (const tab of tabs) {
    const labelEl = tab.querySelector('.bottom-nav-label');
    if (labelEl) labelEl.remove();
    tab.classList.remove('bottom-nav-btn--label');
  }

  const activeTab = tabs.find(t => t.classList.contains('active'));
  const label = activeTab && activeTab.dataset ? (activeTab.dataset.label || '') : '';
  if (activeTab && label) {
    activeTab.classList.add('bottom-nav-btn--label');
    activeTab.insertAdjacentHTML('beforeend', `<span class="bottom-nav-label">${escapeHtml(label)}</span>`);
  }
}

function loadChatsPage() {
  const container = document.getElementById('chats-container');
  if (!container) return;
  showPageLoaderIfEmpty('chats-container', getLoaderMessage('chats'));
  if (!state.token) {
    container.innerHTML = `<div class="card" style="padding:18px;text-align:center"><div class="empty-state-icon">${iconSprite('chat')}</div><div class="muted">${escapeHtml(t('loginToPost'))}</div></div>`;
    settlePageLoader('chats-container');
    return;
  }
  let dialogsCache = [];
  let selectedDialogUserId = null;
  container.innerHTML = `
    <section class="chats-shell">
      <div id="chats-list-view" class="card chats-list-view">
        <div class="chats-view-header">
          <div class="chats-view-title">${escapeHtml(t('messages'))}</div>
          <button id="chat-new-btn" type="button" class="support-btn chats-new-btn" title="${escapeHtml(t('newChat'))}" aria-label="${escapeHtml(t('newChat'))}">${iconSprite('plus')}</button>
        </div>
        <div id="dialogs-list" class="dialogs-list"></div>
      </div>
      <div id="chat-thread" class="chat-thread-screen hidden"></div>
    </section>
  `;

  const dialogsList = document.getElementById('dialogs-list');
  const chatsListView = document.getElementById('chats-list-view');
  chatThread = document.getElementById('chat-thread');
  const newChatBtn = document.getElementById('chat-new-btn');
  settlePageLoader('chats-container');

  function isDialogOnline(dialog) {
    if (!dialog) return false;
    if (typeof dialog.isOnline === 'boolean') return dialog.isOnline;
    const lastSeen = Number(dialog.lastSeen || dialog.last_seen || 0);
    return lastSeen > 0 && (Date.now() - lastSeen) <= 70000;
  }

  function getDialogPreview(dialog) {
    const content = dialog && dialog.last_message_content ? String(dialog.last_message_content) : '';
    if (content) {
      if (E2EEncryption.isEncryptedContent(content)) {
        return state.lang === 'ru' ? '🔒 Зашифрованное сообщение' : '🔒 Encrypted message';
      }
      return content;
    }
    if (dialog && (dialog.last_message_image || dialog.last_message_audio || dialog.last_message_video || dialog.last_message_images || dialog.last_message_videos)) {
      return state.lang === 'ru' ? 'Вложение' : 'Attachment';
    }
    return '';
  }

  function setChatView(open) {
    if (chatsListView) chatsListView.classList.toggle('hidden', !!open);
    if (chatThread) chatThread.classList.toggle('hidden', !open);
  }

  function updateDialogSelection() {
    if (!dialogsList) return;
    dialogsList.querySelectorAll('[data-dialog-user]').forEach(btn => {
      const userId = Number(btn.getAttribute('data-dialog-user'));
      btn.classList.toggle('active', userId === selectedDialogUserId);
    });
  }

  function renderDialogs(dialogs) {
    dialogsCache = Array.isArray(dialogs) ? dialogs : [];
    if (!dialogsList) return;
    if (!dialogsCache.length) {
      dialogsList.innerHTML = `<div class="muted chats-empty-state">${escapeHtml(t('noMessages'))}</div>`;
      return;
    }
    dialogsList.innerHTML = dialogsCache.map(d => {
      const name = d.username || '';
      const last = getDialogPreview(d);
      const online = isDialogOnline(d);
      return `
        <button type="button" class="dialogs-list-item" data-dialog-user="${d.user_id}">
          <div class="dialogs-avatar-wrap">
            <img src="${escapeHtml(getAvatarUrl(d.avatar))}" alt="" class="dialogs-avatar">
            <span class="dialogs-presence-dot ${online ? 'online' : 'offline'}" aria-hidden="true"></span>
          </div>
          <div class="dialogs-list-copy">
            <div class="dialogs-list-topline">
              <div class="dialogs-name">${escapeHtml(name)}</div>
              <div class="dialogs-status ${online ? 'online' : 'offline'}">${escapeHtml(online ? t('online') : t('offline'))}</div>
            </div>
            <div class="dialogs-preview">${escapeHtml(last)}</div>
          </div>
        </button>
      `;
    }).join('');
    updateDialogSelection();

    dialogsList.querySelectorAll('button[data-dialog-user]').forEach(btn => {
      btn.onclick = () => {
        const userId = Number(btn.getAttribute('data-dialog-user'));
        const d = dialogsCache.find(x => Number(x.user_id) === userId);
        openDialog(userId, d && d.username);
      };
    });
  }

  async function refreshDialogs({ autoOpenFirst = false } = {}) {
    const dialogs = await api.get('/dialogs', state.token);
    renderDialogs(dialogs);
    if (selectedDialogUserId && !dialogs.some(d => Number(d.user_id) === Number(selectedDialogUserId))) {
      selectedDialogUserId = null;
      setChatView(false);
      if (chatThread) chatThread.innerHTML = '';
    }
    if (autoOpenFirst) {
      const first = Array.isArray(dialogs) ? dialogs[0] : null;
      if (first && first.user_id) {
        openDialog(Number(first.user_id), first.username);
      }
    }
    return dialogs;
  }

  function renderThreadHeader(username) {
    return `<div style="display:flex;align-items:center;justify-content:space-between;gap:10px;margin-top:12px;margin-bottom:10px">
      <div style="font-weight:800">${escapeHtml(username || '')}</div>
      <button id="chat-close" type="button" class="support-btn" style="border-color:var(--border);color:var(--muted)">✕</button>
    </div>`;
  }

  function renderMessageBubble(m) {
    const mine = state.user && Number(m.from_user_id) === Number(state.user.id);
    const sender = String(m.username || '').toLowerCase();
    const isService = sender === 'system' || sender === 'support';
    const bg = isService ? 'rgba(15,23,42,0.06)' : (mine ? 'rgba(16,185,129,0.16)' : 'rgba(59,130,246,0.12)');
    const align = mine ? 'flex-end' : 'flex-start';
    return `
      <div style="display:flex;justify-content:${align}">
        <div style="max-width:85%;padding:10px 12px;border-radius:14px;background:${bg};border:1px solid var(--border);white-space:pre-wrap;word-break:break-word">
          <div style="font-size:13px">${escapeHtml(m.content || '')}</div>
          <div style="margin-top:6px;font-size:11px;color:var(--muted);text-align:right">${new Date(m.created_at).toLocaleString()}</div>
        </div>
      </div>
    `;
  }

  let currentChatPeerKeys = {};

  async function decryptMessageContent(content, userId) {
    if (!E2EEncryption.isEncryptedContent(content)) {
      return content;
    }
    const encryptedData = content.slice(4);
    let peerPublicKey = currentChatPeerKeys[userId];
    if (!peerPublicKey) {
      try {
        const keyData = await api.get(`/keys/${userId}`, state.token);
        if (keyData && keyData.publicKey) {
          peerPublicKey = keyData.publicKey;
          currentChatPeerKeys[userId] = peerPublicKey;
        }
      } catch (e) {}
    }
    if (!peerPublicKey) {
      return '[🔒 Зашифровано - ключ недоступен]';
    }
    const result = await E2EEncryption.decrypt(encryptedData, peerPublicKey);
    if (result.error) {
      return '[🔒 Не удалось расшифровать]';
    }
    return result.decrypted;
  }

  const MESSAGE_REACTIONS = ['😇', '👽', '😡', '👾', '🤡', '💩', '👍', '👎', '🤢', '👻', '💀', '🦾', '✏️'];

  function renderMessageReactions(reactions, messageId) {
    console.log('renderMessageReactions called with:', reactions);
    if (!reactions || !Array.isArray(reactions) || reactions.length === 0) return '';
    return reactions.map(r => 
      `<span class="msg-reaction-badge" style="display:inline-flex;width:28px;height:28px;border-radius:50%;background:#f0f0f0;border:1px solid #ddd;font-size:16px;align-items:center;justify-content:center;">${r.reaction}</span>`
    ).join('');
  }

  async function renderMessages(messages, currentUserId) {
    if (!Array.isArray(messages)) return '';
    const decryptedMessages = await Promise.all(
      messages.map(async (msg) => {
        const decrypted = await decryptMessageContent(msg.content, msg.from_user_id === currentUserId ? msg.to_user_id : msg.from_user_id);
        return { ...msg, decryptedContent: decrypted };
      })
    );
    return decryptedMessages.map(msg => {
      const isMe = msg.from_user_id === currentUserId;
      const content = msg.decryptedContent;
      const isEncrypted = E2EEncryption.isEncryptedContent(msg.content);
      const isRead = msg.is_read;
      const reactionsHtml = renderMessageReactions(msg.reactions, msg.id);
      const mediaHtml = renderMediaMarkup(msg, { compact: true });
      const contentHtml = content ? `<div class="chat-message-content">${escapeHtml(content)}</div>` : '';
      const readStatus = isMe ? (isRead ? '<span class="msg-read-status">✔✔</span>' : '<span class="msg-read-status">✔</span>') : '';
      return `
        <div class="chat-message${isMe ? ' chat-message-me' : ''}" data-message-id="${msg.id}" data-is-read="${isRead}">
          <div class="chat-message-bubble">
            <div class="chat-message-reactions-row">${reactionsHtml}</div>
            ${contentHtml}
            ${mediaHtml ? `<div class="chat-message-media">${mediaHtml}</div>` : ''}
            ${isEncrypted ? '<div class="chat-message-encrypted">🔒</div>' : ''}
            <div class="chat-message-footer">
              ${readStatus}
              <button class="chat-message-react-btn" data-msg-id="${msg.id}" title="Add reaction">⚡</button>
            </div>
          </div>
        </div>
      `;
    }).join('');
  }

  let activeReactionMenu = null;

  function initReactionHandlers() {
    document.querySelectorAll('.chat-message-react-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const messageId = parseInt(btn.dataset.msgId);
        const existingMenu = document.getElementById('msg-reaction-menu');
        if (existingMenu) {
          existingMenu.remove();
          activeReactionMenu = null;
          return;
        }
        const menu = document.createElement('div');
        menu.id = 'msg-reaction-menu';
        menu.className = 'msg-reaction-menu';
        menu.innerHTML = MESSAGE_REACTIONS.map(r => 
          `<button class="msg-reaction-option" data-reaction="${r}">${r}</button>`
        ).join('');
        document.body.appendChild(menu);
        const rect = btn.getBoundingClientRect();
        menu.style.position = 'fixed';
        menu.style.left = '50%';
        menu.style.top = '50%';
        menu.style.transform = 'translate(-50%, -50%)';
        menu.style.zIndex = '10000';
        activeReactionMenu = messageId;

        menu.querySelectorAll('.msg-reaction-option').forEach(opt => {
          opt.addEventListener('click', async () => {
            const reaction = opt.dataset.reaction;
            const m = document.getElementById('msg-reaction-menu');
            if (m) m.remove();
            activeReactionMenu = null;
            try {
              const result = await api.post(`/messages/${messageId}/react`, { reaction }, state.token);
              console.log('Reaction result:', result);
              if (result && result.reactions) {
                const msgDiv = document.querySelector(`[data-message-id="${messageId}"]`);
                console.log('msgDiv:', msgDiv);
                if (msgDiv) {
                  const bubble = msgDiv.querySelector('.chat-message-bubble');
                  let reactionsRow = msgDiv.querySelector('.chat-message-reactions-row');
                  if (!reactionsRow && bubble) {
                    reactionsRow = document.createElement('div');
                    reactionsRow.className = 'chat-message-reactions-row';
                    bubble.insertBefore(reactionsRow, bubble.firstChild);
                  }
                  if (reactionsRow) {
                    const html = result.reactions.map(r => 
                      `<span style="display:inline-flex;width:28px;height:28px;border-radius:50%;background:#f0f0f0;border:1px solid #ddd;font-size:16px;align-items:center;justify-content:center;">${r.reaction}</span>`
                    ).join('');
                    reactionsRow.innerHTML = html;
                    reactionsRow.style.display = 'flex';
                    reactionsRow.style.gap = '4px';
                    reactionsRow.style.marginBottom = '4px';
                    console.log('Updated reactionsRow:', html);
                  }
                }
              }
            } catch (err) {
              console.error('Failed to add reaction:', err);
            }
          });
        });
      });
    });
  }

  window.toggleMessageReactions = async function(messageId, event) {
    event.stopPropagation();
    const existingMenu = document.getElementById('msg-reaction-menu');
    if (existingMenu) {
      existingMenu.remove();
      activeReactionMenu = null;
      return;
    }
    const btn = event.target.closest('.chat-message-react-btn');
    const menu = document.createElement('div');
    menu.id = 'msg-reaction-menu';
    menu.className = 'msg-reaction-menu';
    menu.innerHTML = MESSAGE_REACTIONS.map(r => 
      `<button class="msg-reaction-option" onclick="addMessageReaction(${messageId}, '${r}')">${r}</button>`
    ).join('');
    document.body.appendChild(menu);
    const rect = btn.getBoundingClientRect();
    const menuWidth = 560;
    let left = rect.left + rect.width / 2 - menuWidth / 2;
    left = Math.max(10, Math.min(left, window.innerWidth - menuWidth - 10));
    menu.style.position = 'fixed';
    menu.style.left = left + 'px';
    menu.style.top = (rect.bottom + 8) + 'px';
    activeReactionMenu = messageId;
  };

  window.addMessageReaction = async function(messageId, reaction) {
    const menu = document.getElementById('msg-reaction-menu');
    if (menu) menu.remove();
    activeReactionMenu = null;
    try {
      const result = await api.post(`/messages/${messageId}/react`, { reaction }, state.token);
      if (result && result.reactions) {
        const msgDiv = document.querySelector(`[data-message-id="${messageId}"]`);
        if (msgDiv) {
          const actions = msgDiv.querySelector('.chat-message-reactions');
          if (actions) {
            const reactBtn = actions.querySelector('.chat-message-react-btn');
            actions.innerHTML = renderMessageReactions(result.reactions, messageId);
            if (reactBtn) actions.appendChild(reactBtn);
          }
        }
      }
    } catch (e) {
      console.error('Failed to add reaction:', e);
    }
  };

  let chatReadPollInterval = null;

  async function openDialog(userId, username) {
    if (!chatThread) return;
    selectedDialogUserId = Number(userId);
    updateDialogSelection();
    setChatView(true);

    if (chatReadPollInterval) {
      clearInterval(chatReadPollInterval);
      chatReadPollInterval = null;
    }

    const messages = await api.get(`/messages/${userId}`, state.token);
    const currentUserId = state.user && state.user.id;
    const rows = await renderMessages(messages, currentUserId);
    const dialog = dialogsCache.find(item => Number(item.user_id) === Number(userId));
    const online = isDialogOnline(dialog);
    const displayName = username || (dialog && dialog.username) || '';
    const displayAvatar = dialog ? getAvatarUrl(dialog.avatar) : DEFAULT_AVATAR_URL;

    chatThread.innerHTML = `
      <div class="chat-thread-header">
        <button id="chat-close" type="button" class="support-btn chat-thread-back" aria-label="${escapeHtml(t('back'))}">←</button>
        <div class="chat-thread-person">
          <img src="${escapeHtml(displayAvatar)}" alt="" class="chat-thread-avatar">
          <div class="chat-thread-person-copy">
            <div class="chat-thread-name">${escapeHtml(displayName)}</div>
            <div class="chat-thread-status ${online ? 'online' : 'offline'}">${escapeHtml(online ? t('online') : t('offline'))}</div>
          </div>
        </div>
      </div>
      <div id="chat-messages" class="chat-thread-messages">${rows || `<div class="muted chats-empty-state">${escapeHtml(t('noMessages'))}</div>`}</div>
      <div class="chat-composer chat-thread-composer">
        <div id="chat-image-previews" class="image-previews hidden"></div>
        <div id="chat-audio-file-hint" class="muted hidden chat-file-hint"></div>
        <div id="chat-video-file-hint" class="muted hidden chat-file-hint"></div>
        <div class="create-post-actions chat-thread-tools">
          <button id="chat-media-toggle" type="button" class="media-toggle-btn" title="${escapeHtml(t('addMedia'))}">＋</button>
          <div id="chat-media-tools" class="post-media-tools hidden">
            <input id="chat-image" type="file" accept="image/*" multiple style="display:none">
            <input id="chat-audio" type="file" accept="audio/*" style="display:none">
            <input id="chat-video" type="file" accept="video/*" multiple style="display:none">
            <button id="chat-btn-image" title="${escapeHtml(t('addImage'))}" type="button" class="media-btn">${iconSprite('image')}</button>
            <button id="chat-btn-audio" title="${escapeHtml(t('addAudio'))}" type="button" class="media-btn">${iconSprite('audio')}</button>
            <button id="chat-btn-video" title="${escapeHtml(t('addVideo'))}" type="button" class="media-btn">${iconSprite('video')}</button>
            <button id="chat-btn-voice-record" title="${escapeHtml(t('recordVoiceTitle'))}" type="button" class="media-btn">${iconSprite('mic')}</button>
            <span id="chat-voice-record-status" class="voice-status hidden"></span>
          </div>
        </div>
        <div class="chat-thread-input-row">
          <input id="chat-input" class="chat-thread-input" placeholder="${escapeHtml(t('typeMessage'))}">
          <button id="chat-send" type="button" class="btn-primary chat-thread-send">${escapeHtml(t('send'))}</button>
        </div>
      </div>
    `;
    initReactionHandlers();

    const closeBtn = document.getElementById('chat-close');
    if (closeBtn) closeBtn.onclick = () => {
      selectedDialogUserId = null;
      updateDialogSelection();
      setChatView(false);
      chatThread.innerHTML = '';
      if (chatReadPollInterval) {
        clearInterval(chatReadPollInterval);
        chatReadPollInterval = null;
      }
    };

    try { await api.post(`/messages/${userId}/read`, {}, state.token); } catch (e) {}

    chatReadPollInterval = setInterval(async () => {
      try {
        const msgs = await api.get(`/messages/${userId}`, state.token);
        const chatMessages = document.getElementById('chat-messages');
        if (chatMessages) {
          msgs.forEach(msg => {
            if (msg.from_user_id === userId) {
              const msgDiv = chatMessages.querySelector(`[data-message-id="${msg.id}"]`);
              if (msgDiv && msgDiv.dataset.isRead !== 'true' && msg.is_read) {
                msgDiv.dataset.isRead = 'true';
                const readStatus = msgDiv.querySelector('.msg-read-status');
                if (readStatus) readStatus.textContent = '✔✔';
              }
            }
          });
        }
        refreshDialogs();
      } catch (e) {}
    }, 3000);

    function scrollChatToBottom() {
      const msgBox = document.getElementById('chat-messages');
      if (msgBox) msgBox.scrollTop = msgBox.scrollHeight;
    }

    scrollChatToBottom();

    let chatRecordedVoiceBlob = null;
    let chatMediaRecorder = null;
    let chatRecordStream = null;
    const sendBtn = document.getElementById('chat-send');
    const input = document.getElementById('chat-input');
    const chatImageInput = document.getElementById('chat-image');
    const chatAudioInput = document.getElementById('chat-audio');
    const chatVideoInput = document.getElementById('chat-video');
    const chatImagePreviews = document.getElementById('chat-image-previews');
    const chatAudioHint = document.getElementById('chat-audio-file-hint');
    const chatVideoHint = document.getElementById('chat-video-file-hint');
    const chatMediaToggle = document.getElementById('chat-media-toggle');
    const chatMediaTools = document.getElementById('chat-media-tools');
    const chatVoiceBtn = document.getElementById('chat-btn-voice-record');
    const chatVoiceStatus = document.getElementById('chat-voice-record-status');
    const chatImageBtn = document.getElementById('chat-btn-image');
    const chatAudioBtn = document.getElementById('chat-btn-audio');
    const chatVideoBtn = document.getElementById('chat-btn-video');
    const sender = String(username || '').toLowerCase();
    const isService = sender === 'system' || sender === 'support';

    function clearChatAttachmentPreview() {
      if (chatImageInput) chatImageInput.value = '';
      if (chatAudioInput) chatAudioInput.value = '';
      if (chatVideoInput) chatVideoInput.value = '';
      chatRecordedVoiceBlob = null;
      if (chatImagePreviews) {
        chatImagePreviews.innerHTML = '';
        chatImagePreviews.classList.add('hidden');
      }
      if (chatAudioHint) {
        chatAudioHint.textContent = '';
        chatAudioHint.classList.add('hidden');
      }
      if (chatVideoHint) {
        chatVideoHint.textContent = '';
        chatVideoHint.classList.add('hidden');
      }
      if (chatVoiceStatus) {
        chatVoiceStatus.textContent = '';
        chatVoiceStatus.classList.add('hidden');
        chatVoiceStatus.classList.remove('recording', 'recorded');
      }
      if (chatVoiceBtn) {
        chatVoiceBtn.title = t('recordVoiceTitle');
        chatVoiceBtn.innerHTML = iconSprite('mic');
        delete chatVoiceBtn.dataset.recording;
      }
    }

    function renderChatImagePreviews(files) {
      if (!chatImagePreviews) return;
      chatImagePreviews.innerHTML = '';
      if (!files || !files.length) {
        chatImagePreviews.classList.add('hidden');
        return;
      }
      chatImagePreviews.classList.remove('hidden');
      Array.from(files).forEach((file) => {
        const reader = new FileReader();
        reader.onload = (event) => {
          const img = document.createElement('img');
          img.src = event.target.result;
          img.style.maxWidth = '80px';
          img.style.maxHeight = '80px';
          img.style.objectFit = 'cover';
          img.style.borderRadius = '8px';
          img.style.border = '1px solid rgba(148,163,184,0.4)';
          chatImagePreviews.appendChild(img);
        };
        reader.readAsDataURL(file);
      });
    }

    if (chatMediaToggle && chatMediaTools) {
      chatMediaToggle.onclick = () => chatMediaTools.classList.toggle('hidden');
    }
    if (chatImageBtn && chatImageInput) chatImageBtn.onclick = () => chatImageInput.click();
    if (chatAudioBtn && chatAudioInput) chatAudioBtn.onclick = () => chatAudioInput.click();
    if (chatVideoBtn && chatVideoInput) chatVideoBtn.onclick = () => chatVideoInput.click();
    if (chatImageInput) {
      chatImageInput.onchange = (event) => {
        renderChatImagePreviews(event.target.files);
      };
    }
    if (chatAudioInput) {
      chatAudioInput.onchange = (event) => {
        chatRecordedVoiceBlob = null;
        const file = event.target.files && event.target.files[0];
        if (chatAudioHint) {
          chatAudioHint.textContent = file ? file.name : '';
          chatAudioHint.classList.toggle('hidden', !file);
        }
      };
    }
    if (chatVideoInput) {
      chatVideoInput.onchange = (event) => {
        const files = event.target.files;
        if (chatVideoHint) {
          chatVideoHint.textContent = files && files.length ? (files.length === 1 ? files[0].name : `${files.length} video`) : '';
          chatVideoHint.classList.toggle('hidden', !(files && files.length));
        }
      };
    }
    if (chatVoiceBtn) {
      if (typeof MediaRecorder === 'undefined') {
        chatVoiceBtn.style.display = 'none';
      } else {
        chatVoiceBtn.onclick = async () => {
          if (chatMediaRecorder && chatMediaRecorder.state === 'recording') {
            chatMediaRecorder.stop();
            return;
          }
          try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            chatRecordStream = stream;
            const chunks = [];
            const mime = MediaRecorder.isTypeSupported('audio/webm;codecs=opus') ? 'audio/webm;codecs=opus' : 'audio/webm';
            chatMediaRecorder = new MediaRecorder(stream);
            chatMediaRecorder.ondataavailable = (event) => event.data.size && chunks.push(event.data);
            chatMediaRecorder.onstop = () => {
              chatRecordStream.getTracks().forEach(track => track.stop());
              chatRecordStream = null;
              chatMediaRecorder = null;
              if (chunks.length) {
                chatRecordedVoiceBlob = new Blob(chunks, { type: mime });
                if (chatAudioInput) chatAudioInput.value = '';
                if (chatAudioHint) {
                  chatAudioHint.textContent = t('voiceRecorded');
                  chatAudioHint.classList.remove('hidden');
                }
              }
              if (chatVoiceStatus) {
                chatVoiceStatus.textContent = '';
                chatVoiceStatus.classList.add('hidden');
                chatVoiceStatus.classList.remove('recording', 'recorded');
              }
              chatVoiceBtn.title = t('recordVoiceTitle');
              chatVoiceBtn.innerHTML = iconSprite('mic');
              delete chatVoiceBtn.dataset.recording;
            };
            chatMediaRecorder.start(200);
            chatVoiceBtn.dataset.recording = 'true';
            chatVoiceBtn.innerHTML = iconSprite('stop');
            chatVoiceBtn.title = t('stopRecord');
            if (chatVoiceStatus) {
              chatVoiceStatus.textContent = t('recording');
              chatVoiceStatus.classList.remove('hidden');
              chatVoiceStatus.classList.add('recording');
            }
          } catch (err) {
            showAlert(t('recordingError'));
          }
        };
      }
    }

    if (isService) {
      if (input) input.disabled = true;
      if (sendBtn) sendBtn.disabled = true;
      if (chatMediaToggle) chatMediaToggle.disabled = true;
      if (chatImageBtn) chatImageBtn.disabled = true;
      if (chatAudioBtn) chatAudioBtn.disabled = true;
      if (chatVideoBtn) chatVideoBtn.disabled = true;
      if (chatVoiceBtn) chatVoiceBtn.disabled = true;
    }
    if (sendBtn) {
      sendBtn.onclick = async () => {
        const text = input ? String(input.value || '').trim() : '';
        const hasImage = !!(chatImageInput && chatImageInput.files && chatImageInput.files.length);
        const hasAudio = !!chatRecordedVoiceBlob || !!(chatAudioInput && chatAudioInput.files && chatAudioInput.files.length);
        const hasVideo = !!(chatVideoInput && chatVideoInput.files && chatVideoInput.files.length);
        if (!text && !hasImage && !hasAudio && !hasVideo) return;
        let contentToSend = text;
        let peerPublicKey = currentChatPeerKeys[userId];
        if (text && !peerPublicKey) {
          try {
            const keyData = await api.get(`/keys/${userId}`, state.token);
            if (keyData && keyData.publicKey) {
              peerPublicKey = keyData.publicKey;
              currentChatPeerKeys[userId] = peerPublicKey;
            }
          } catch (e) {}
        }
        if (text && peerPublicKey) {
          const result = await E2EEncryption.encrypt(text, peerPublicKey);
          if (!result.error && result.encrypted) {
            contentToSend = 'e2e:' + result.encrypted;
          }
        }
        if (hasImage || hasAudio || hasVideo) {
          const formData = new FormData();
          formData.append('content', contentToSend);
          if (chatImageInput && chatImageInput.files) {
            const resizedImages = await Promise.all(Array.from(chatImageInput.files).map(file => resizeImageFile(file)));
            resizedImages.forEach(file => formData.append('image', file));
          }
          if (chatRecordedVoiceBlob) {
            const ext = (chatRecordedVoiceBlob.type || '').includes('ogg') ? 'ogg' : 'webm';
            formData.append('audio', chatRecordedVoiceBlob, 'voice.' + ext);
          } else if (chatAudioInput && chatAudioInput.files && chatAudioInput.files.length) {
            formData.append('audio', chatAudioInput.files[0]);
          }
          if (chatVideoInput && chatVideoInput.files) {
            Array.from(chatVideoInput.files).forEach(file => formData.append('video', file));
          }
          await api.postFormData(`/messages/${userId}/with-media`, formData, state.token);
        } else {
          await api.post(`/messages/${userId}`, { content: contentToSend }, state.token);
        }
        if (input) input.value = '';
        clearChatAttachmentPreview();
        await refreshDialogs();
        await openDialog(userId, displayName);
      };
    }
    if (input && sendBtn) {
      input.addEventListener('keydown', (event) => {
        if (event.key !== 'Enter' || event.shiftKey) return;
        event.preventDefault();
        if (!sendBtn.disabled) sendBtn.click();
      });
    }
    scrollChatToBottom();
  }

  function openNewChatSearch() {
    const { root, card } = makeModal(`
      <h2 style="margin-bottom:8px">${escapeHtml(t('chatSearchTitle'))}</h2>
      <p style="margin-bottom:12px;font-size:13px;color:var(--muted)">${escapeHtml(t('chatSearchCaption'))}</p>
      <form id="chat-search-form" style="display:grid;grid-template-columns:minmax(0,1fr) auto;gap:10px;align-items:center">
        <input id="chat-search-input" type="search" autocomplete="off" placeholder="${escapeHtml(t('chatSearchPlaceholder'))}">
        <button id="chat-search-submit" type="submit">${escapeHtml(t('searchSubmit'))}</button>
      </form>
      <div id="chat-search-status" class="muted" style="margin:10px 0 0 0;font-size:13px">${escapeHtml(t('chatSearchHint'))}</div>
      <div id="chat-search-results" style="display:flex;flex-direction:column;gap:8px;margin-top:12px"></div>
      <div class="actions">
        <button id="chat-search-cancel">${escapeHtml(t('cancel'))}</button>
      </div>
    `);
    card.style.width = '460px';

    const cancelBtn = document.getElementById('chat-search-cancel');
    const form = document.getElementById('chat-search-form');
    const input = document.getElementById('chat-search-input');
    const status = document.getElementById('chat-search-status');
    const results = document.getElementById('chat-search-results');

    if (cancelBtn) cancelBtn.onclick = () => root.remove();
    if (input) setTimeout(() => input.focus(), 0);

    function renderUserResults(users) {
      if (!results) return;
      if (!Array.isArray(users) || !users.length) {
        results.innerHTML = `<div class="muted" style="text-align:center;padding:14px;border:1px dashed rgba(148,163,184,0.34);border-radius:14px">${escapeHtml(t('chatSearchNoUsers'))}</div>`;
        return;
      }
      results.innerHTML = users.map(user => `
        <button type="button" class="support-option-btn" data-user-id="${user.userId}" data-username="${escapeHtml(user.username || '')}" style="display:flex;align-items:center;gap:10px;text-align:left">
          <div style="width:38px;height:38px;border-radius:50%;display:flex;align-items:center;justify-content:center;background:rgba(34,197,94,0.14);color:var(--green-900);flex:none">${iconSprite('chat')}</div>
          <div style="flex:1;min-width:0">
            <div style="font-weight:800;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${escapeHtml(user.title || user.username || '')}</div>
            <div class="muted" style="font-size:12px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">@${escapeHtml(user.username || '')}</div>
            <div class="muted" style="font-size:12px;line-height:1.4;margin-top:4px">${escapeHtml(user.reason || '')}</div>
          </div>
          <span style="font-size:12px;font-weight:800;color:var(--green-900)">${escapeHtml(t('chatSearchOpen'))}</span>
        </button>
      `).join('');

      results.querySelectorAll('button[data-user-id]').forEach(btn => {
        btn.onclick = async () => {
          const userId = Number(btn.getAttribute('data-user-id'));
          const username = btn.getAttribute('data-username') || '';
          root.remove();
          await openDialog(userId, username);
        };
      });
    }

    if (form) {
      form.onsubmit = async (event) => {
        event.preventDefault();
        const query = input ? String(input.value || '').trim() : '';
        if (!query) {
          if (status) status.textContent = t('chatSearchHint');
          if (results) results.innerHTML = '';
          return;
        }
        if (status) status.textContent = t('searchLoading');
        if (results) results.innerHTML = '';
        try {
          const payload = await api.post('/site-search', { query, lang: state.lang }, state.token);
          const users = (Array.isArray(payload && payload.results) ? payload.results : [])
            .filter(item => item && item.type === 'user' && Number(item.userId) && Number(item.userId) !== Number(state.user && state.user.id))
            .reduce((acc, item) => {
              if (!acc.some(existing => Number(existing.userId) === Number(item.userId))) acc.push(item);
              return acc;
            }, []);
          if (status) status.textContent = payload && payload.summary ? String(payload.summary) : t('chatSearchHint');
          renderUserResults(users);
        } catch (err) {
          if (status) status.textContent = t('chatSearchError');
          if (results) results.innerHTML = '';
        }
      };
    }
  }

  if (newChatBtn) {
    newChatBtn.onclick = openNewChatSearch;
  }

  (async () => {
    try {
      await refreshDialogs({ autoOpenFirst: true });
    } catch (e) {
      if (dialogsList) dialogsList.innerHTML = `<div class="muted" style="text-align:center;padding:10px">Ошибка загрузки чатов</div>`;
    }
  })();
}

function setAuth(token, user){
  applySession(token, user);
}
function clearAuth(){
  stopPresenceHeartbeat();
  stopNotificationsPolling();
  const currentUserId = state.user && state.user.id;
  const remainingAccounts = currentUserId ? removeSavedAccount(currentUserId) : readSavedAccounts();

  if (remainingAccounts.length) {
    applySession(remainingAccounts[0].token, remainingAccounts[0].user, { saveAccount: false });
    return;
  }

  state.token = null;
  state.user = null;
  resetNotificationTracking();
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  localStorage.removeItem(NAV_STORAGE_KEY);
  switchPage('feed');
  renderAuth();
  loadPosts();
}

function openCreatePostComposer() {
  const cp = document.getElementById('create-post');
  if (cp) cp.classList.remove('hidden');
  const ta = document.getElementById('post-content');
  if (ta) {
    ta.focus();
    ta.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }
}

function closeCreatePostComposer() {
  const cp = document.getElementById('create-post');
  if (cp) cp.classList.add('hidden');
}

Object.assign(i18n.en, {
  tree: 'Channel',
  treeTitle: 'Channels',
  treeCaption: 'Open channels, create your own channel, and publish posts there.',
  treeAddCommunity: 'Create channel',
  createChannel: 'Create channel',
  createPersonalPost: 'Personal post',
  createChannelPost: 'Post in channel',
  channelSearchTitle: 'Channel search',
  channelSearchCaption: 'Search channels by title',
  channelSearchPlaceholder: 'Enter channel title',
  channelSearchLoading: 'Searching channels...',
  channelSearchEmpty: 'No channels were found.',
  channelSearchOpen: 'Open channel',
  channelSearchError: 'Failed to search channels.',
  channelSearchSummaryFallback: 'Channels found by title.',
  channelsDirectoryTitle: 'All channels',
  channelsDirectorySubtitle: 'Available channels: {count}',
  channelsBack: 'All channels',
  channelNoPosts: 'There are no posts in this channel yet.',
  channelEmptySubtitle: 'No channels yet',
  channelEmptyText: 'Press plus and create the first channel.',
  createChannelPrompt: 'Enter the channel name',
  chooseChannelPrompt: 'Choose a channel by number',
  channelCreateError: 'Could not create the channel.',
  channelCreateConfirm: 'You do not have a channel yet. Create one now?',
  selectChannelFirst: 'Open or create a channel first.'
});

Object.assign(i18n.ru, {
  tree: 'Канал',
  treeTitle: 'Каналы',
  treeCaption: 'Открывайте каналы, создавайте свои и публикуйте посты внутри них.',
  treeAddCommunity: 'Создать канал',
  createChannel: 'Создать канал',
  createPersonalPost: 'Личный пост',
  createChannelPost: 'Пост в канал',
  channelSearchTitle: 'Поиск каналов',
  channelSearchCaption: 'Ищет каналы по названию',
  channelSearchPlaceholder: 'Введите название канала',
  channelSearchLoading: 'Ищем каналы...',
  channelSearchEmpty: 'Каналы не найдены.',
  channelSearchOpen: 'Открыть канал',
  channelSearchError: 'Не удалось выполнить поиск каналов.',
  channelSearchSummaryFallback: 'Вот каналы, найденные по названию.',
  channelsDirectoryTitle: 'Все каналы',
  channelsDirectorySubtitle: 'Доступно каналов: {count}',
  channelsBack: 'Все каналы',
  channelNoPosts: 'В этом канале пока нет постов.',
  channelEmptySubtitle: 'Каналов пока нет',
  channelEmptyText: 'Нажмите плюс и создайте первый канал.',
  createChannelPrompt: 'Введите название канала',
  chooseChannelPrompt: 'Выберите канал по номеру',
  channelCreateError: 'Не удалось создать канал.',
  channelCreateConfirm: 'У вас ещё нет канала. Создать его сейчас?',
  selectChannelFirst: 'Сначала откройте или создайте канал.'
});

function t(k){ return i18n[state.lang][k] || k }

function formatUsername(name, badge) {
  if (badge && String(badge).trim()) return `${name} ${badge}`;
  return name === 'blau3' ? name + ' 🔧' : name;
}

let authMenuBtnEl = null;
let authMenuEl = null;

function setAuthMenuOpen(open) {
  if (!authMenuBtnEl || !authMenuEl) return;
  if (open) {
    authMenuEl.classList.remove('hidden');
    authMenuBtnEl.setAttribute('aria-expanded', 'true');
  } else {
    authMenuEl.classList.add('hidden');
    authMenuBtnEl.setAttribute('aria-expanded', 'false');
  }
}

function renderAccountMenu(area, savedAccounts) {
  const closeMenu = () => setAuthMenuOpen(false);
  const wrapper = document.createElement('div');
  wrapper.className = 'account-menu-shell';

  const trigger = document.createElement('button');
  trigger.type = 'button';
  trigger.className = 'account-menu-btn bottom-nav-utility-btn';
  trigger.title = t('profile');
  trigger.setAttribute('aria-label', t('profile'));
  trigger.setAttribute('aria-haspopup', 'menu');
  trigger.setAttribute('aria-expanded', 'false');
  if (state.user) {
    trigger.innerHTML = `<img src="${escapeHtml(getAvatarUrl(state.user.avatar))}" alt="${escapeHtml(state.user.username || t('profile'))}" class="account-menu-avatar">`;
  } else {
    trigger.textContent = '👤';
  }

  const menu = document.createElement('div');
  menu.className = 'account-menu hidden';
  menu.setAttribute('role', 'menu');
  menu.setAttribute('aria-label', t('profile'));

  const header = document.createElement('div');
  header.className = 'account-menu-header';
  header.innerHTML = formatUsername(state.user.username, state.user.badge);
  menu.appendChild(header);

  const addAccountMenuItem = (label, onClick, options = {}) => {
    const item = document.createElement('button');
    item.type = 'button';
    item.className = `account-menu-item${options.danger ? ' account-menu-item-danger' : ''}${options.active ? ' active' : ''}`;
    if (options.iconName || options.meta) {
      item.innerHTML = `
        <span class="account-menu-item-main">${options.iconName ? iconWithText(options.iconName, label) : escapeHtml(label)}</span>
        ${options.meta ? `<span class="account-menu-item-meta">${escapeHtml(options.meta)}</span>` : ''}
      `;
    } else if (options.html) {
      item.innerHTML = options.html;
    } else {
      item.textContent = label;
    }
    if (options.disabled) {
      item.disabled = true;
    }
    item.onclick = async () => {
      closeMenu();
      await onClick();
    };
    menu.appendChild(item);
    return item;
  };

  addAccountMenuItem(t('viewProfile'), () => {
    showProfile(state.user.id);
  }, { iconName: 'eye' });

  addAccountMenuItem(t('changeAvatar'), () => {
    showAvatarUpload();
  }, { iconName: 'image' });

  addAccountMenuItem(t('editProfile'), () => {
    showEditProfile(state.user);
  }, { iconName: 'edit' });

  addAccountMenuItem(
    state.user.bio ? t('editDescription') : t('addDescription'),
    () => {
      showEditBio(state.user, (nextBio) => {
        updateCurrentUser({ bio: nextBio });
      });
    },
    { iconName: 'message-circle' }
  );

  addAccountMenuItem(t('createNewPost'), () => {
    state.nav.profileUserId = null;
    state.nav.postId = null;
    switchPage('feed');
  }, { iconName: 'plus' });

  addAccountMenuItem(
    t('privateProfile'),
    async () => {
      const nextPrivate = !Boolean(state.user && state.user.is_private);
      const update = await api.put('/users/profile', { is_private: nextPrivate }, state.token);
      if (update && update.id) {
        updateCurrentUser(update);
        showAlert(t(nextPrivate ? 'privateProfileOn' : 'privateProfileOff'));
      }
    },
    {
      iconName: 'lock',
      meta: state.user && state.user.is_private ? t('privateProfileOn') : t('privateProfileOff')
    }
  );

  const profileHint = document.createElement('div');
  profileHint.className = 'account-menu-hint';
  profileHint.textContent = t('privateProfileHint');
  menu.appendChild(profileHint);

  if (state.user.username === 'blau3') {
    addAccountMenuItem('Admin', () => {
      window.location.href = '/admin.html';
    }, { iconName: 'settings' });
  }

  if (savedAccounts.length > 1) {
    const switchDivider = document.createElement('div');
    switchDivider.className = 'account-menu-divider';
    menu.appendChild(switchDivider);

    const switchLabel = document.createElement('div');
    switchLabel.className = 'account-menu-section-label';
    switchLabel.textContent = t('switchAccount');
    menu.appendChild(switchLabel);

    savedAccounts.forEach((account) => {
      const isCurrent = String(account.user.id) === String(state.user.id);
      addAccountMenuItem('', () => {
        switchSavedAccount(account.user.id);
      }, {
        active: isCurrent,
        disabled: isCurrent,
        html: `<span class="account-menu-item-main">${formatUsername(account.user.username, account.user.badge)}</span>`
      });
    });
  }

  const accountDivider = document.createElement('div');
  accountDivider.className = 'account-menu-divider';
  menu.appendChild(accountDivider);

  addAccountMenuItem(t('addAccount'), () => {
    showLogin();
  }, { iconName: 'plus' });

  addAccountMenuItem(t('deleteProfile'), async () => {
    await deleteMyProfile();
  }, { iconName: 'trash', danger: true });

  addAccountMenuItem(t('logout'), () => {
    clearAuth();
  }, { iconName: 'alert', danger: true });

  trigger.onclick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const isOpen = !menu.classList.contains('hidden');
    setAuthMenuOpen(!isOpen);
  };
  menu.onclick = (e) => e.stopPropagation();

  wrapper.appendChild(trigger);
  wrapper.appendChild(menu);
  area.appendChild(wrapper);
  authMenuBtnEl = trigger;
  authMenuEl = menu;
=======
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

  const settingsBtn = document.getElementById('settings-btn');
  if (settingsBtn) {
    settingsBtn.title = t('settingsLabel');
    settingsBtn.setAttribute('aria-label', t('settingsLabel'));
  }

  const settingsLanguageLabel = document.getElementById('settings-language-label');
  if (settingsLanguageLabel) settingsLanguageLabel.textContent = t('languageLabel');

  const settingsThemeLabel = document.getElementById('settings-theme-label');
  if (settingsThemeLabel) settingsThemeLabel.textContent = t('themeLabel');

  const themeBtn = document.getElementById('theme-toggle');
  if (themeBtn) themeBtn.title = t('toggleTheme');

  const postContent = document.getElementById('post-content');
  if (postContent) postContent.placeholder = t('postPlaceholder');

  const postCategoryText = document.getElementById('post-category-text');
  if (postCategoryText) postCategoryText.placeholder = t('categoryTextPlaceholder');

  const btnImage = document.getElementById('btn-image');
  if (btnImage) btnImage.title = t('addImage');
  const btnAudio = document.getElementById('btn-audio');
  if (btnAudio) btnAudio.title = t('addAudio');
  const btnVideo = document.getElementById('btn-video');
  if (btnVideo) btnVideo.title = t('addVideo');
  const btnPolls = document.getElementById('btn-polls');
  if (btnPolls) btnPolls.title = t('addPoll');

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

  const pollCreateTitle = document.getElementById('create-poll-title');
  if (pollCreateTitle) pollCreateTitle.textContent = t('pollCreateTitle');

  const searchInput = document.getElementById('user-id-search');
  if (searchInput) {
    searchInput.placeholder = t('userIdPlaceholder');
    searchInput.setAttribute('aria-label', t('searchUserById'));
  }
  const searchBtn = document.getElementById('btn-search-user');
  if (searchBtn) searchBtn.title = t('searchUserById');

  const scrollTopBtn = document.getElementById('scroll-top-btn');
  if (scrollTopBtn) scrollTopBtn.title = t('scrollTopTitle');

  const footerCredit = document.getElementById('footer-credit');
  if (footerCredit) footerCredit.textContent = t('footerCredit');

  renderTabLabels();

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

function renderTabLabels() {
  const feedTab = document.getElementById('tab-feed');
  if (feedTab) feedTab.textContent = `📰 ${t('feed')}`;

  const subscriptionsTab = document.getElementById('tab-subscriptions');
  if (subscriptionsTab) subscriptionsTab.textContent = `🧑‍🤝‍🧑 ${t('subscriptions')}`;

  const notificationsTab = document.getElementById('tab-notifications');
  if (notificationsTab) notificationsTab.textContent = `🪧 ${t('notifications')}`;

  const messagesTab = document.getElementById('tab-messages');
  if (messagesTab) messagesTab.textContent = `💬 ${t('messages')}`;
}

function formatUsername(name) {
  return name === 'blau3' ? name + ' 🔧' : name;
>>>>>>> 43fc63577f740ec07265f99ac0d4769620c4ae8c
}

function renderAuth(){
  const area = document.getElementById('auth-area');
  area.innerHTML = '';
<<<<<<< HEAD
  authMenuBtnEl = null;
  authMenuEl = null;
  if (!state.user) {
    const loginBtn = document.createElement('button'); loginBtn.textContent = t('login'); loginBtn.className='link bottom-nav-auth-btn bottom-nav-auth-btn-secondary';
    loginBtn.onclick = showLogin;
    const regBtn = document.createElement('button'); regBtn.textContent=t('register'); regBtn.className='bottom-nav-auth-btn bottom-nav-auth-btn-primary'; regBtn.onclick = showRegister;
    area.appendChild(loginBtn); area.appendChild(regBtn);
    const cp = document.getElementById('create-post'); if (cp) cp.classList.add('hidden');
  } else {
    const savedAccounts = readSavedAccounts();
    renderAccountMenu(area, savedAccounts);
    closeCreatePostComposer();
  }
  const welcomeEl = document.getElementById('welcome'); if (welcomeEl) welcomeEl.textContent = t('welcome');
}

function makeModal(innerHtml){
=======
  if (!state.user) {
    // Hide auth buttons in header for unauthenticated users
    // They will see the full-screen auth modal instead
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

  // Removed second logout button as per user request
  // let logoutRow = document.getElementById('settings-logout-row');

  // if (state.user) {
  //   if (!logoutRow) {
  //     logoutRow = document.createElement('div');
  //     logoutRow.id = 'settings-logout-row';
  //     logoutRow.className = 'settings-row';

  //     const label = document.createElement('span');
  //     label.className = 'settings-label';
  //     const btn = document.createElement('button');
  //     btn.id = 'settings-logout-btn';
  //     btn.type = 'button';

  //     logoutRow.appendChild(label);
  //     logoutRow.appendChild(btn);
  //     menu.appendChild(logoutRow);
  //   }

  //   const labelEl = logoutRow.querySelector('.settings-label');
  //   const btnEl = logoutRow.querySelector('button');
  //   if (labelEl) {
  //     labelEl.textContent = state.lang === 'ru' ? 'Аккаунт' : 'Account';
  //   }
  //   if (btnEl) {
  //     btnEl.textContent = t('logout');
  //     btnEl.onclick = () => {
  //       clearAuth();
  //       closeSettingsMenu();
  //     };
  //   }
  // } else if (logoutRow) {
  //   logoutRow.remove();
  // }
}

function showBotCheck(onSuccess){
  const a = 1 + Math.floor(Math.random() * 9);
  const b = 1 + Math.floor(Math.random() * 9);
  const sum = a + b;
  const title = t('botCheckTitle');
  const question = `${t('botCheckQuestionPrefix')} ${a} + ${b}?`;
  const errorMsg = t('botCheckWrong');

  const { root } = makeModal(`
    <h2>${title}</h2>
    <p>${question}</p>
    <input id="bot-answer" type="number" placeholder="${t('botCheckPlaceholder')}">
    <div class="actions">
      <button data-role="cancel">${t('cancel')}</button>
      <button data-role="ok" class="btn-primary">${t('ok')}</button>
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
>>>>>>> 43fc63577f740ec07265f99ac0d4769620c4ae8c
  const root = document.createElement('div'); root.className='modal-root';
  const card = document.createElement('div'); card.className='modal-card';
  card.innerHTML = innerHtml;
  root.appendChild(card);
<<<<<<< HEAD
  document.body.prepend(root);
  // allow closing when clicking outside
  root.addEventListener('click', (e)=>{ if (e.target === root) root.remove(); });
  return { root, card };
}

function closePostEditMenu() {
  if (openPostEditMenu) {
    openPostEditMenu.remove();
    openPostEditMenu = null;
  }
  if (openPostEditTrigger) {
    openPostEditTrigger.setAttribute('aria-expanded', 'false');
    openPostEditTrigger = null;
  }
}

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function ensureToastContainer() {
  let container = document.getElementById('toast-container');
  if (container) return container;
  container = document.createElement('div');
  container.id = 'toast-container';
  container.className = 'toast-container';
  document.body.appendChild(container);
  return container;
}

function showAlert(message) {
  const container = ensureToastContainer();
  const toast = document.createElement('div');
  toast.className = 'toast-notice';
  toast.setAttribute('role', 'status');
  const durationMs = 4200;
  toast.style.setProperty('--toast-duration', `${durationMs}ms`);
  toast.innerHTML = `
    <div class="toast-notice-body">${escapeHtml(message)}</div>
    <button type="button" class="toast-notice-close" aria-label="Close">✕</button>
    <div class="toast-notice-progress-track" aria-hidden="true">
      <div class="toast-notice-progress"></div>
    </div>
  `;

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

  const closeBtn = toast.querySelector('.toast-notice-close');
  if (closeBtn) closeBtn.onclick = closeToast;

  container.appendChild(toast);
  requestAnimationFrame(() => {
    toast.classList.add('toast-notice-visible');
    const progress = toast.querySelector('.toast-notice-progress');
    if (progress) progress.classList.add('toast-notice-progress-running');
  });
  toast._closeTimer = window.setTimeout(closeToast, durationMs);
}

function showNotificationToasts(notifications) {
  if (!Array.isArray(notifications) || !notifications.length) return;
  notifications.forEach(notification => {
    showAlert(getNotificationToastMessage(notification));
  });
}

async function submitProfileViewRequest(userId) {
  if (!state.token) {
    showAlert(t('loginToPost'));
    return null;
  }
  const result = await api.post(`/users/${userId}/request-view`, {}, state.token);
  if (result && result.requestStatus === 'pending') {
    showAlert(t('requestViewPending'));
  }
  return result;
}

async function submitSubscriptionRequest(userId) {
  if (!state.token) {
    showAlert(t('loginToPost'));
    return null;
  }
  const result = await api.post(`/subscribe/${userId}`, {}, state.token);
  if (result && result.requested) {
    showAlert(t('subscribeRequestPending'));
  }
  return result;
}

async function respondToAccessRequest(requestId, approve) {
  if (!state.token) return null;
  const result = await api.post(`/access-requests/${requestId}/respond`, { approve }, state.token);
  return result;
}

async function deleteMyProfile() {
  if (!state.token) return;
  if (!confirm(t('deleteProfileConfirm'))) return;
  try {
    await api.delete('/users/me', state.token);
    showAlert(t('deleteProfile'));
    clearAuth();
  } catch (err) {
    showAlert(err.message || t('deleteError'));
  }
}

function renderSiteSearchResults() {
  const status = document.getElementById('site-search-status');
  const container = document.getElementById('site-search-results');
  const clearBtn = document.getElementById('site-search-clear');
  if (!status || !container || !clearBtn) return;

  clearBtn.textContent = t('searchClear');
  if (state.siteSearch.query) clearBtn.classList.remove('hidden');
  else clearBtn.classList.add('hidden');

  if (state.siteSearch.loading) {
    status.textContent = t('searchLoading');
    status.classList.remove('hidden');
    container.classList.add('hidden');
    container.innerHTML = '';
    return;
  }

  if (!state.siteSearch.query) {
    status.classList.add('hidden');
    status.textContent = '';
    container.classList.add('hidden');
    container.innerHTML = '';
    return;
  }

  const summary = state.siteSearch.summary || t('searchSummaryFallback');
  status.textContent = summary;
  status.classList.remove('hidden');

  if (!Array.isArray(state.siteSearch.results) || !state.siteSearch.results.length) {
    container.innerHTML = `<div class="site-search-empty">${escapeHtml(t('searchEmpty'))}</div>`;
    container.classList.remove('hidden');
    return;
  }

  container.innerHTML = state.siteSearch.results.map(result => {
    const actionLabel = result.type === 'user' ? t('searchOpenProfile') : t('searchOpenPost');
    const badge = result.type === 'user'
      ? (state.lang === 'ru' ? 'Профиль' : 'Profile')
      : (state.lang === 'ru' ? 'Пост' : 'Post');
    return `
      <article class="site-search-result" data-type="${escapeHtml(result.type)}" data-id="${Number(result.id)}" data-user-id="${Number(result.userId || result.id)}">
        <div class="site-search-result-top">
          <span class="site-search-badge">${escapeHtml(badge)}</span>
          <span class="site-search-user">@${escapeHtml(result.username || '')}</span>
        </div>
        <h3>${escapeHtml(result.title || '')}</h3>
        <p class="site-search-snippet">${escapeHtml(result.snippet || '')}</p>
        <p class="site-search-reason">${escapeHtml(result.reason || '')}</p>
        <button type="button" class="site-search-action">${escapeHtml(actionLabel)}</button>
      </article>
    `;
  }).join('');
  container.classList.remove('hidden');

  container.querySelectorAll('.site-search-result').forEach(card => {
    card.onclick = async (event) => {
      const action = event.target.closest('.site-search-action') || event.currentTarget;
      if (!action) return;
      const type = card.dataset.type;
      const id = Number(card.dataset.id);
      const userId = Number(card.dataset.userId);
      if (type === 'user') {
        showProfile(userId);
        return;
      }
      state.nav.postId = String(id);
      persistNavigationState();
      switchPage('feed');
      await loadPosts();
      requestAnimationFrame(() => {
        const post = document.getElementById(`post-${id}`);
        if (post) post.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
      updateBreadcrumb();
    };
  });
}

async function submitSiteSearch() {
  const input = document.getElementById('site-search-input');
  if (!input) return;
  const query = input.value.trim();
  if (!query) {
    state.siteSearch.query = '';
    state.siteSearch.loading = false;
    state.siteSearch.results = [];
    state.siteSearch.summary = '';
    renderSiteSearchResults();
    return;
  }

  state.siteSearch.query = query;
  state.siteSearch.loading = true;
  renderSiteSearchResults();

  try {
    const result = await api.post('/site-search', { query, lang: state.lang }, state.token);
    if (result && result.error) {
      throw new Error(result.error);
    }
    state.siteSearch.loading = false;
    state.siteSearch.summary = String((result && result.summary) || t('searchSummaryFallback'));
    state.siteSearch.results = Array.isArray(result && result.results) ? result.results : [];
    renderSiteSearchResults();
  } catch (err) {
    state.siteSearch.loading = false;
    state.siteSearch.results = [];
    state.siteSearch.summary = t('searchError');
    renderSiteSearchResults();
  }
}

function clearSiteSearch() {
  state.siteSearch.query = '';
  state.siteSearch.loading = false;
  state.siteSearch.results = [];
  state.siteSearch.summary = '';
  const input = document.getElementById('site-search-input');
  if (input) input.value = '';
  renderSiteSearchResults();
}

function renderChannelSearchResults() {
  const status = document.getElementById('channel-search-status');
  const container = document.getElementById('channel-search-results');
  const clearBtn = document.getElementById('channel-search-clear');
  if (!status || !container || !clearBtn) return;

  clearBtn.textContent = t('searchClear');
  clearBtn.classList.toggle('hidden', !state.channelSearch.query);

  if (state.channelSearch.loading) {
    status.textContent = t('channelSearchLoading');
    status.classList.remove('hidden');
    container.classList.add('hidden');
    container.innerHTML = '';
    return;
  }

  if (!state.channelSearch.query) {
    status.classList.add('hidden');
    status.textContent = '';
    container.classList.add('hidden');
    container.innerHTML = '';
    return;
  }

  status.textContent = state.channelSearch.summary || t('channelSearchSummaryFallback');
  status.classList.remove('hidden');

  if (!Array.isArray(state.channelSearch.results) || !state.channelSearch.results.length) {
    container.innerHTML = `<div class="site-search-empty">${escapeHtml(t('channelSearchEmpty'))}</div>`;
    container.classList.remove('hidden');
    return;
  }

  container.innerHTML = state.channelSearch.results.map(result => `
    <article class="site-search-result" data-channel-id="${Number(result.id)}">
      <div class="site-search-result-top">
        <span class="site-search-badge">${escapeHtml(state.lang === 'ru' ? 'Канал' : 'Channel')}</span>
        <span class="site-search-user">@${escapeHtml(result.username || '')}</span>
      </div>
      <h3>${escapeHtml(result.name || '')}</h3>
      <p class="site-search-snippet">${escapeHtml(result.snippet || '')}</p>
      <p class="site-search-reason">${escapeHtml(result.reason || '')}</p>
      <button type="button" class="site-search-action">${escapeHtml(t('channelSearchOpen'))}</button>
    </article>
  `).join('');
  container.classList.remove('hidden');

  container.querySelectorAll('[data-channel-id]').forEach(card => {
    card.onclick = () => {
      const channelId = Number(card.getAttribute('data-channel-id'));
      openChannel(channelId);
    };
  });
}

async function submitChannelSearch() {
  const input = document.getElementById('channel-search-input');
  if (!input) return;
  const query = input.value.trim();
  if (!query) {
    state.channelSearch.query = '';
    state.channelSearch.loading = false;
    state.channelSearch.results = [];
    state.channelSearch.summary = '';
    renderChannelSearchResults();
    return;
  }

  state.channelSearch.query = query;
  state.channelSearch.loading = true;
  renderChannelSearchResults();

  try {
    const result = await api.post('/channels/search', { query, lang: state.lang }, state.token);
    if (result && result.error) throw new Error(result.error);
    state.channelSearch.loading = false;
    state.channelSearch.summary = String((result && result.summary) || t('channelSearchSummaryFallback'));
    state.channelSearch.results = Array.isArray(result && result.results) ? result.results : [];
    renderChannelSearchResults();
  } catch (err) {
    state.channelSearch.loading = false;
    state.channelSearch.results = [];
    state.channelSearch.summary = t('channelSearchError');
    renderChannelSearchResults();
  }
}

function clearChannelSearch() {
  state.channelSearch.query = '';
  state.channelSearch.loading = false;
  state.channelSearch.results = [];
  state.channelSearch.summary = '';
  const input = document.getElementById('channel-search-input');
  if (input) input.value = '';
  renderChannelSearchResults();
}

function showRecoverAccess() {
  const { root } = makeModal(`
    <h2 style="margin-bottom:8px">${t('recoverAccess')}</h2>
    <p style="margin-bottom:12px;font-size:13px;color:var(--muted)">${t('recoveryPrompt')}</p>
    <input id="rc-username" placeholder="${t('usernamePlaceholder')}" style="margin-bottom:8px;">
    <input id="rc-code" placeholder="${t('recoveryCodePlaceholder')}" style="margin-bottom:8px;">
    <div style="display:flex;gap:5px;margin-bottom:8px;">
      <input id="rc-pass" type="password" placeholder="${t('newPasswordPlaceholder')}" style="flex:1;">
      <button
        id="rc-pass-toggle"
        type="button"
        style="font-size:16px;padding:4px 8px;border-radius:8px;border:1px solid rgba(148,163,184,0.6);background:transparent;cursor:pointer;"
      >
        ${iconSprite('eye')}
      </button>
    </div>
    <div style="display:flex;gap:5px;margin-bottom:8px;">
      <input id="rc-pass2" type="password" placeholder="${t('confirmNewPasswordPlaceholder')}" style="flex:1;">
      <button
        id="rc-pass2-toggle"
        type="button"
        style="font-size:16px;padding:4px 8px;border-radius:8px;border:1px solid rgba(148,163,184,0.6);background:transparent;cursor:pointer;"
      >
        ${iconSprite('eye')}
      </button>
    </div>
    <div class="password-hint">${t('passwordRequirements')}</div>
    <div class="actions">
      <button id="rc-cancel">${t('cancel')}</button>
      <button id="rc-submit">${t('create')}</button>
    </div>
  `);

  const pass = document.getElementById('rc-pass');
  const pass2 = document.getElementById('rc-pass2');
  const toggle1 = document.getElementById('rc-pass-toggle');
  const toggle2 = document.getElementById('rc-pass2-toggle');

  if (toggle1 && pass) {
    toggle1.onclick = () => {
      pass.type = pass.type === 'password' ? 'text' : 'password';
    };
  }
  if (toggle2 && pass2) {
    toggle2.onclick = () => {
      pass2.type = pass2.type === 'password' ? 'text' : 'password';
    };
  }

  document.getElementById('rc-cancel').onclick = () => root.remove();
  document.getElementById('rc-submit').onclick = async () => {
    const username = document.getElementById('rc-username').value.trim();
    const code = document.getElementById('rc-code').value.trim();
    const p1 = pass ? pass.value : '';
    const p2 = pass2 ? pass2.value : '';
    if (!username) { showAlert(t('usernameRequired')); return; }
    if (!code) { showAlert(t('recoveryCodePlaceholder')); return; }
    if (p1 !== p2) { showAlert(t('passwordMismatch')); return; }
    const pwCheck = validatePassword(p1);
    if (!pwCheck.ok) { showAlert(t(pwCheck.error)); return; }
    try {
      const res = await api.post('/recover', { username, code, password: p1 });
      if (res && res.token) {
        setAuth(res.token, { username: res.username, id: res.id, avatar: res.avatar, bio: res.bio, background: res.background });
        root.remove();
        showAlert(t('recoverySuccess'));
      } else {
        showAlert((res && (t(res.error) || res.error)) || t('recoveryFailed'));
      }
    } catch (e) {
      showAlert(t('recoveryFailed'));
    }
  };
}

function showRecoveryCodeModal(code) {
  if (!code) return;
  const { root } = makeModal(`
    <h2 style="margin-bottom:8px">${t('recoveryCodeTitle')}</h2>
    <p style="margin-bottom:12px;font-size:13px;color:var(--muted)">${t('recoveryCodeDescription')}</p>
    <div style="display:flex;align-items:center;gap:8px;margin-bottom:16px;padding:10px 12px;border-radius:10px;background:rgba(15,23,42,0.04);border:1px dashed rgba(148,163,184,0.6);">
      <code id="recovery-code-value" style="flex:1;font-family:monospace;font-size:14px;word-break:break-all;">${escapeHtml(code)}</code>
      <button id="recovery-code-copy" type="button" style="border:none;background:var(--accent);color:white;border-radius:999px;padding:6px 10px;font-size:12px;cursor:pointer;display:flex;align-items:center;gap:4px;">
        ${iconSprite('copy')} <span>${t('copyCode')}</span>
      </button>
    </div>
    <div class="actions">
      <button id="recovery-code-ok">OK</button>
    </div>
  `);
  const copyBtn = document.getElementById('recovery-code-copy');
  const codeEl = document.getElementById('recovery-code-value');
  const okBtn = document.getElementById('recovery-code-ok');
  if (copyBtn && codeEl) {
    copyBtn.onclick = async () => {
      const text = codeEl.textContent || '';
      try {
        if (navigator.clipboard && navigator.clipboard.writeText) {
          await navigator.clipboard.writeText(text);
        } else {
          const ta = document.createElement('textarea');
          ta.value = text;
          document.body.appendChild(ta);
          ta.select();
          document.execCommand('copy');
          document.body.removeChild(ta);
        }
        const span = copyBtn.querySelector('span');
        if (span) span.textContent = t('copied');
        setTimeout(() => { if (span) span.textContent = t('copyCode'); }, 1500);
      } catch (e) {
        console.error('Copy failed', e);
      }
    };
  }
  if (okBtn) okBtn.onclick = () => root.remove();
}

function showSupportModal() {
  const { root } = makeModal(`
    <h2 style="margin-bottom:12px">${t('supportTitle')}</h2>
    <div style="display:flex;flex-direction:column;gap:8px;margin-bottom:16px;">
      <button id="support-opt-1" type="button" class="support-option-btn">1. ${t('supportOption1')}</button>
      <button id="support-opt-2" type="button" class="support-option-btn">2. ${t('supportOption2')}</button>
      <button id="support-opt-3" type="button" class="support-option-btn">3. ${t('supportOption3')}</button>
      <button id="support-opt-4" type="button" class="support-option-btn">4. ${t('supportOption4')}</button>
    </div>
    <div class="actions">
      <button id="support-cancel">${t('cancel')}</button>
    </div>
  `);
  document.getElementById('support-cancel').onclick = () => root.remove();

  async function sendReport(type, scammerLink) {
    try {
      await api.post('/support', { type, scammerLink: scammerLink || undefined });
    } catch (e) {
      console.error('Support report failed', e);
    }
  }

  function showResultAndClose() {
    const options = root.querySelector('div[style*="flex-direction:column"]');
    if (options) options.innerHTML = '';
    const p = document.createElement('p');
    p.style.marginBottom = '16px';
    p.style.color = 'var(--green-700)';
    p.textContent = t('supportNotified');
    root.querySelector('h2').after(p);
    const actionsRow = root.querySelector('.actions');
    actionsRow.innerHTML = '';
    const closeBtn = document.createElement('button');
    closeBtn.textContent = 'OK';
    closeBtn.onclick = () => root.remove();
    actionsRow.appendChild(closeBtn);
  }

  function askScammerLink() {
    root.querySelector('h2').textContent = t('supportOption4');
    const options = root.querySelector('div[style*="flex-direction:column"]');
    const actionsRow = root.querySelector('.actions');
    options.innerHTML = `<input id="support-scammer-link" placeholder="${t('supportScammerPlaceholder')}" style="width:100%;padding:8px;margin-bottom:8px;">`;
    actionsRow.innerHTML = `<button id="support-send">${t('supportSubmit')}</button>`;
    document.getElementById('support-send').onclick = async () => {
      const link = document.getElementById('support-scammer-link').value.trim();
      await sendReport(4, link || null);
      root.querySelector('h2').textContent = '';
      options.innerHTML = '';
      const p = document.createElement('p');
      p.style.marginBottom = '16px';
      p.style.color = 'var(--green-700)';
      p.textContent = t('supportNotified');
      root.insertBefore(p, actionsRow);
      actionsRow.innerHTML = '<button id="support-ok">OK</button>';
      document.getElementById('support-ok').onclick = () => root.remove();
    };
  }

  document.getElementById('support-opt-1').onclick = async () => { await sendReport(1); showResultAndClose(); };
  document.getElementById('support-opt-2').onclick = async () => { await sendReport(2); showResultAndClose(); };
  document.getElementById('support-opt-3').onclick = async () => { await sendReport(3); showResultAndClose(); };
  document.getElementById('support-opt-4').onclick = () => askScammerLink();
}

function showConfirm(message, onConfirm) {
  const { root } = makeModal(`
    <h2 style="margin-bottom:12px">Confirm</h2>
    <p style="margin-bottom:16px">${escapeHtml(message)}</p>
    <div class="actions">
      <button id="confirm-cancel">${t('cancel')}</button>
      <button id="confirm-ok">OK</button>
    </div>
  `);
  const cancelBtn = document.getElementById('confirm-cancel');
  const okBtn = document.getElementById('confirm-ok');
  if (cancelBtn) cancelBtn.onclick = () => root.remove();
  if (okBtn) okBtn.onclick = () => {
    root.remove();
    if (typeof onConfirm === 'function') onConfirm();
  };
=======
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
        messageEl.textContent = t('voteSavedLocal');
      }
    };

    optionsContainer.appendChild(btn);
  });
}

function showAlert(message, opts){
  const options = opts || {};
  const title = options.title || t('messageTitle');
  const okLabel = options.okLabel || t('ok');
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
  const title = options.title || t('confirmTitle');
  const okLabel = options.okLabel || t('yes');
  const cancelLabel = options.cancelLabel || t('no');
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
>>>>>>> 43fc63577f740ec07265f99ac0d4769620c4ae8c
}

function showLogin(){
  const { root } = makeModal(`
    <h2>${t('loginTitle')}</h2>
    <input id="li-user" placeholder="${t('usernamePlaceholder')}">
<<<<<<< HEAD
    <input id="li-pass" type="password" placeholder="${t('passwordPlaceholder')}">
    <div style="margin-top:6px;margin-bottom:12px;">
      <button id="li-recover" type="button" class="link" style="font-size:12px;padding:0;border:none;background:none;cursor:pointer;">
        ${t('recoverAccess')}
      </button>
    </div>
    <div class="auth-switch">
      <span class="auth-switch-text">${t('authSwitchToRegisterText')}</span>
      <button id="li-open-register" type="button" class="auth-switch-btn">${t('register')}</button>
    </div>
=======
    <div style="display:flex;gap:5px;margin-bottom:8px;align-items:center;">
      <input id="li-pass" type="password" placeholder="${t('passwordPlaceholder')}" style="flex:1;">
      <button
        id="li-pass-toggle"
        type="button"
        style="font-size:14px;padding:4px 8px;"
        title="${t('showPassword')}"
      >
        👁
      </button>
    </div>
>>>>>>> 43fc63577f740ec07265f99ac0d4769620c4ae8c
    <div class="actions">
      <button id="li-cancel">${t('cancel')}</button>
      <button id="li-submit">${t('login')}</button>
    </div>
<<<<<<< HEAD
  `);
  document.getElementById('li-cancel').onclick = () => root.remove();
  document.getElementById('li-recover').onclick = () => {
    root.remove();
    showRecoverAccess();
  };
  document.getElementById('li-open-register').onclick = () => {
    root.remove();
    showRegister();
  };
  document.getElementById('li-submit').onclick = async () => {
    const username = document.getElementById('li-user').value;
    const password = document.getElementById('li-pass').value;
    const res = await api.post('/login', { username, password });
    if (res.token) setAuth(res.token, { username: res.username, id: res.id, avatar: res.avatar, bio: res.bio, background: res.background });
    else showAlert(res.error || t('loginFailed'));
    root.remove();
  };
=======
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
      toggleBtn.title = isHidden ? t('hidePassword') : t('showPassword');
    };
  }
  const forgotBtn = document.getElementById('li-forgot');
  if (forgotBtn) {
    forgotBtn.onclick = () => {
      root.remove();
      showPasswordReset();
    };
  }
>>>>>>> 43fc63577f740ec07265f99ac0d4769620c4ae8c
}

function showRegister(){
  const { root } = makeModal(`
    <h2>${t('registerTitle')}</h2>
<<<<<<< HEAD
    <input id="rg-user" placeholder="${t('usernamePlaceholder')}">
    <div style="display: flex; gap: 5px; margin-bottom: 8px;">
      <input id="rg-pass" type="password" placeholder="${t('passwordPlaceholder')}" style="flex: 1;">
      <button
        id="rg-pass-toggle"
        type="button"
        style="font-size: 16px; padding: 4px 8px; border-radius: 8px; border: 1px solid rgba(148,163,184,0.6); background: transparent; cursor: pointer;"
      >
        ${iconSprite('eye')}
=======
    <div id="lamp-container" style="text-align: center; margin-bottom: 20px; cursor: pointer; user-select: none;">
      <div id="lamp-bulb" style="font-size: 60px; transition: text-shadow 0.3s ease;" data-on="false">💡</div>
      <p style="font-size: 12px; color: #666; margin: 8px 0 0 0;">${t('lampToggleHint')}</p>
    </div>
    <input id="rg-user" placeholder="${t('usernamePlaceholder')}">
    <div style="display: flex; gap: 5px; margin-bottom: 8px; align-items: center;">
      <input id="rg-pass" type="password" placeholder="${t('passwordPlaceholder')}" style="flex: 1;">
      <button
        id="rg-toggle"
        type="button"
        style="font-size: 14px; padding: 4px 8px;"
        title="${t('showPassword')}"
      >
        👁
>>>>>>> 43fc63577f740ec07265f99ac0d4769620c4ae8c
      </button>
      <button
        id="rg-generate"
        type="button"
        style="font-size: 11px; padding: 4px 8px; white-space: nowrap;"
      >
<<<<<<< HEAD
        🧊
      </button>
    </div>
    <div style="display: flex; gap: 5px; margin-bottom: 8px;">
      <input id="rg-pass2" type="password" placeholder="${t('confirmPasswordPlaceholder')}" style="flex: 1;">
      <button
        id="rg-pass2-toggle"
        type="button"
        style="font-size: 16px; padding: 4px 8px; border-radius: 8px; border: 1px solid rgba(148,163,184,0.6); background: transparent; cursor: pointer;"
      >
        ${iconSprite('eye')}
      </button>
    </div>
    <div class="password-hint">${t('passwordRequirements')}</div>
    <div class="auth-switch">
      <span class="auth-switch-text">${t('authSwitchToLoginText')}</span>
      <button id="rg-open-login" type="button" class="auth-switch-btn">${t('login')}</button>
    </div>
=======
        ${t('generatePassword')}
      </button>
    </div>
    <input id="rg-pass2" type="password" placeholder="${t('repeatPasswordPlaceholder')}" style="margin-bottom: 4px;">
    <div class="password-hint">${t('passwordRequirements')}</div>
>>>>>>> 43fc63577f740ec07265f99ac0d4769620c4ae8c
    <div class="actions">
      <button id="rg-cancel">${t('cancel')}</button>
      <button id="rg-submit">${t('create')}</button>
    </div>
  `);

  const passInput = document.getElementById('rg-pass');
<<<<<<< HEAD
  const pass2Input = document.getElementById('rg-pass2');
  const passToggle = document.getElementById('rg-pass-toggle');
  const pass2Toggle = document.getElementById('rg-pass2-toggle');

  if (passToggle && passInput) {
    passToggle.onclick = () => {
      const current = passInput.type === 'password' ? 'text' : 'password';
      passInput.type = current;
    };
  }
  if (pass2Toggle && pass2Input) {
    pass2Toggle.onclick = () => {
      const current = pass2Input.type === 'password' ? 'text' : 'password';
      pass2Input.type = current;
    };
  }

  document.getElementById('rg-generate').onclick = () => {
    const newPassword = generateStrongPassword(12);
    if (passInput) passInput.value = newPassword;
    if (pass2Input) pass2Input.value = newPassword;
  };

  document.getElementById('rg-open-login').onclick = () => {
    root.remove();
    showLogin();
  };
  document.getElementById('rg-cancel').onclick = () => root.remove();
  document.getElementById('rg-submit').onclick = async () => {
    const username = document.getElementById('rg-user').value.trim();
    const password = passInput ? passInput.value : '';
    const password2 = pass2Input ? pass2Input.value : '';
    if (!username) { showAlert(t('usernameRequired')); return; }
    if (password !== password2) {
      showAlert(t('passwordMismatch'));
      return;
    }
    const pwCheck = validatePassword(password);
    if (!pwCheck.ok) { showAlert(t(pwCheck.error)); return; }
    const res = await api.post('/register', { username, password });
    if (res.token) {
      setAuth(res.token, { username: res.username, id: res.id, avatar: res.avatar, bio: res.bio, background: res.background });
      root.remove();
      if (res.recoveryCode) {
        showRecoveryCodeModal(res.recoveryCode);
      }
=======
  const passRepeatInput = document.getElementById('rg-pass2');
  const toggleBtn = document.getElementById('rg-toggle');
  const generateBtn = document.getElementById('rg-generate');
  const lampBulb = document.getElementById('lamp-bulb');
  const lampContainer = document.getElementById('lamp-container');
  
  let lampIsOn = false;

  // Set up lamp toggle
  if (lampBulb && lampContainer) {
    lampContainer.onclick = () => {
      lampIsOn = !lampIsOn;
      lampBulb.setAttribute('data-on', lampIsOn ? 'true' : 'false');
      
      if (lampIsOn) {
        lampBulb.textContent = '💡';
        lampBulb.style.textShadow = '0 0 20px rgba(255, 200, 0, 0.8)';
        root.style.backgroundColor = '#1c1f24';
        gsap.to(root, { backgroundColor: '#1c1f24', duration: 0.6 });
      } else {
        lampBulb.textContent = '🌙';
        lampBulb.style.textShadow = 'none';
        root.style.backgroundColor = '#121417';
        gsap.to(root, { backgroundColor: '#121417', duration: 0.6 });
      }
    };
  }

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
      toggleBtn.title = isHidden ? t('hidePassword') : t('showPassword');
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
>>>>>>> 43fc63577f740ec07265f99ac0d4769620c4ae8c
    } else {
      showAlert(t(res.error) || res.error || t('regFailed'));
      root.remove();
    }
  };
}

<<<<<<< HEAD
function refreshCurrentFeed() {
  if (state.currentPage === 'subscriptions') loadSubscriptionsPosts();
  else if (state.currentPage === 'tree') loadTreePage();
=======
function showPasswordReset() {
  const { root } = makeModal(`
    <h2>${t('resetPassword')}</h2>
    <input id="rp-user" placeholder="${t('usernamePlaceholder')}">
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
>>>>>>> 43fc63577f740ec07265f99ac0d4769620c4ae8c
  else loadPosts();
}

const AUTO_REFRESH_INTERVAL_MS = 30000; // 30 seconds
<<<<<<< HEAD
const PRESENCE_HEARTBEAT_INTERVAL_MS = 5 * 60 * 1000;

function autoRefreshCurrentPage() {
  if (state.currentPage === 'feed') loadPosts();
  else if (state.currentPage === 'tree') loadTreePage();
  else if (state.currentPage === 'news') loadSiteNews();
  else if (state.currentPage === 'subscriptions') loadSubscriptionsPosts();
  else if (state.currentPage === 'notifications') loadNotificationsPage();

  // Периодически обновляем индикатор количества уведомлений
  refreshNotificationsIndicator();
=======

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
>>>>>>> 43fc63577f740ec07265f99ac0d4769620c4ae8c
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

<<<<<<< HEAD
async function sendPresenceHeartbeat() {
  if (!state.token || document.visibilityState === 'hidden') return;
  try {
    await api.post('/presence/heartbeat', {}, state.token);
  } catch (err) {
    console.error('Failed to update presence', err);
  }
}

function stopPresenceHeartbeat() {
  if (window._presenceHeartbeatTimer) {
    clearInterval(window._presenceHeartbeatTimer);
    window._presenceHeartbeatTimer = null;
  }
}

function startPresenceHeartbeat() {
  stopPresenceHeartbeat();
  if (!state.token) return;
  sendPresenceHeartbeat();
  window._presenceHeartbeatTimer = setInterval(() => {
    sendPresenceHeartbeat();
  }, PRESENCE_HEARTBEAT_INTERVAL_MS);
}

const VIEW_OBSERVER_DELAY_MS = 2500;
let postViewObserver = null;
const postViewTimers = new Map();
const countedPostViews = new Set();

function ensurePostViewObserver() {
  if (typeof window === 'undefined' || typeof IntersectionObserver === 'undefined') return null;
  if (postViewObserver) return postViewObserver;
  postViewObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      const card = entry.target;
      const postId = card && card.dataset ? card.dataset.postId : null;
      if (!postId) return;

      if (!entry.isIntersecting) {
        const timeoutId = postViewTimers.get(postId);
        if (timeoutId) {
          clearTimeout(timeoutId);
          postViewTimers.delete(postId);
        }
        return;
      }

      if (countedPostViews.has(postId) || postViewTimers.has(postId)) return;

      const timeoutId = setTimeout(() => {
        if (!countedPostViews.has(postId)) {
          countedPostViews.add(postId);
          registerPostView(postId, card);
        }
        postViewTimers.delete(postId);
      }, VIEW_OBSERVER_DELAY_MS);
      postViewTimers.set(postId, timeoutId);
    });
  }, { threshold: 0.6 });
  return postViewObserver;
}

async function registerPostView(postId, cardElement) {
  try {
    const res = await api.post(`/posts/${postId}/view`, {}, state.token);
    const views = typeof res.views === 'number' ? res.views : null;
    if (cardElement && views !== null) {
      const viewsEl = cardElement.querySelector('.post-views');
      if (viewsEl) {
        viewsEl.innerHTML = iconWithCount('views', views);
      }
    }
  } catch (err) {
    console.error('Failed to register post view', err);
  }
}

function renderPostsInto(posts, container_or_id) {
  const el = typeof container_or_id === 'string' ? document.getElementById(container_or_id) : container_or_id;
  console.log('renderPostsInto called:', container_or_id, 'posts:', posts ? posts.length : 'null', 'el:', el ? 'found' : 'NOT FOUND');
  if (!el) {
    console.log('Element not found, container_or_id:', container_or_id);
    if (typeof container_or_id === 'string') {
      const found = document.querySelector('#' + container_or_id);
      console.log('querySelector result:', found);
    }
    return;
  }
  const containerId = typeof container_or_id === 'string' ? container_or_id : (el?.id || 'unknown');
  el.classList.toggle('feed-post-grid', containerId === 'posts');
  el.innerHTML = '';
  if (!Array.isArray(posts) || !posts.length) {
    el.innerHTML = `<div class="card" style="padding:24px;text-align:center"><div class="empty-state-icon">${iconSprite('feed')}</div><div class="muted">${escapeHtml(state.lang === 'ru' ? 'Постов пока нет.' : 'No posts yet.')}</div></div>`;
    settlePageLoader(containerId);
    return;
  }
  settlePageLoader(containerId);
  console.log('Building post cards:', posts.length);
=======
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
>>>>>>> 43fc63577f740ec07265f99ac0d4769620c4ae8c

  for (const p of posts) {
    const card = document.createElement('div');
    card.className = 'card post';
    card.id = `post-${p.id}`;
<<<<<<< HEAD
    card.dataset.postId = String(p.id);

    const meta = document.createElement('div');
    meta.className = 'meta post-meta';

    const metaMain = document.createElement('div');
    metaMain.className = 'post-meta-main';

    const avatar = document.createElement('img');
    avatar.src = getAvatarUrl(p.avatar);
    avatar.className = 'avatar-small';
    avatar.style.cursor = 'pointer';
    avatar.onclick = (e) => {
      e.stopPropagation();
      showUserQuickMenu(e, p.user_id, p.username, p.avatar);
    };

    const authorBlock = document.createElement('div');
    authorBlock.className = 'post-author-block';

    const userLink = document.createElement('strong');
    userLink.className = 'post-author-name';
    userLink.textContent = formatUsername(p.username, p.badge);
    userLink.style.cursor = 'pointer';
    userLink.onclick = () => showProfile(p.user_id);

    // Subscribe "+" button for other users
    let subscribeBtn = null;
    if (state.user && state.user.id !== p.user_id) {
      subscribeBtn = document.createElement('button');
      subscribeBtn.type = 'button';
      subscribeBtn.className = 'post-subscribe-btn';
      subscribeBtn.textContent = '+';
      subscribeBtn.title = t('subscribe');
      subscribeBtn.onclick = async (e) => {
        e.stopPropagation();
        if (!state.token) { showAlert(t('loginToPost')); return; }
        try {
          const res = await submitSubscriptionRequest(p.user_id);
          if (res && res.subscribed) {
            subscribeBtn.textContent = '✓';
            subscribeBtn.disabled = true;
            subscribeBtn.title = t('unsubscribe');
          } else if (res && res.requested) {
            subscribeBtn.textContent = '…';
            subscribeBtn.disabled = true;
            subscribeBtn.title = t('subscribeRequestPending');
          }
        } catch (err) {
          // если уже подписан, просто считаем, что подписка есть
          subscribeBtn.textContent = '✓';
          subscribeBtn.disabled = true;
        }
      };
    }

    const metaSide = document.createElement('div');
    metaSide.className = 'post-meta-side';

    const time = document.createElement('div');
    time.className = 'post-time';
    time.textContent = new Date(p.created_at).toLocaleString();

    authorBlock.appendChild(userLink);
    metaMain.appendChild(avatar);
    metaMain.appendChild(authorBlock);
    meta.appendChild(metaMain);
    metaSide.appendChild(time);
    if (subscribeBtn) metaSide.appendChild(subscribeBtn);

    const content = document.createElement('div');
    content.className = 'content';
    const contentBody = document.createElement('div');
    contentBody.className = 'post-content-body';
    contentBody.textContent = p.content;
    content.appendChild(contentBody);
    if (!String(p.content || '').trim()) {
      content.classList.add('content-empty');
    }

    let editMenuContainer = null;
    if (state.user && state.user.id === p.user_id) {
      editMenuContainer = document.createElement('div');
      editMenuContainer.className = 'post-edit-container';
    }

    const repostBadge = p.repost_post_id ? document.createElement('div') : null;
    if (repostBadge) {
      repostBadge.className = 'post-repost-badge';
      repostBadge.style.cssText = 'display:inline-flex;align-items:center;gap:6px;padding:8px 14px;border-radius:30px;background:linear-gradient(135deg, rgba(34,197,94,0.12) 0%, rgba(59,130,246,0.06) 100%);border:1px solid rgba(34,197,94,0.25);';
      repostBadge.innerHTML = iconSprite('repost');
    }

    // Owner-only controls (edit/delete) under the content
    let ownerActions = null;
    if (state.user && state.user.id === p.user_id) {
      ownerActions = document.createElement('div');
      ownerActions.className = 'post-owner-actions';

      const editPostBtn = document.createElement('button');
      editPostBtn.type = 'button';
      editPostBtn.className = 'post-owner-btn';
      editPostBtn.innerHTML = iconSprite('edit');
      editPostBtn.title = t('editPost');
      editPostBtn.setAttribute('aria-haspopup', 'dialog');
      editPostBtn.setAttribute('aria-expanded', 'false');
      editPostBtn.onclick = (e) => {
        e.preventDefault();
        e.stopPropagation();
        const isSameMenuOpen = openPostEditMenu && openPostEditTrigger === editPostBtn;
        closePostEditMenu();
        if (isSameMenuOpen) return;

        const menu = document.createElement('div');
        menu.className = 'post-edit-menu';
        menu.innerHTML = `
          <div class="post-edit-menu-title">${escapeHtml(t('editPost'))}</div>
          <textarea class="post-edit-menu-textarea">${escapeHtml(p.content || '')}</textarea>
          <div class="post-edit-menu-actions">
            <button type="button" class="post-edit-menu-cancel">${escapeHtml(t('cancel'))}</button>
            <button type="button" class="post-edit-menu-save">${escapeHtml(t('save'))}</button>
          </div>
        `;
        menu.onclick = (event) => event.stopPropagation();
        editMenuContainer.appendChild(menu);
        openPostEditMenu = menu;
        openPostEditTrigger = editPostBtn;
        editPostBtn.setAttribute('aria-expanded', 'true');

        const textarea = menu.querySelector('.post-edit-menu-textarea');
        const cancelBtn = menu.querySelector('.post-edit-menu-cancel');
        const saveBtn = menu.querySelector('.post-edit-menu-save');
        if (textarea) {
          textarea.focus();
          textarea.setSelectionRange(textarea.value.length, textarea.value.length);
        }
        if (cancelBtn) {
          cancelBtn.onclick = () => closePostEditMenu();
        }
        if (saveBtn && textarea) {
          saveBtn.onclick = async () => {
            const trimmed = String(textarea.value || '').trim();
            if (!trimmed) {
              closePostEditMenu();
              return;
            }
            try {
              const updated = await api.put(`/posts/${p.id}`, { content: trimmed }, state.token);
              if (updated && updated.id) {
                p.content = updated.content;
                contentBody.textContent = updated.content;
                content.classList.toggle('content-empty', !String(updated.content || '').trim());
              }
              closePostEditMenu();
            } catch (err) {
              console.error('Failed to update post', err);
              closePostEditMenu();
              showAlert('Не удалось обновить пост: ' + err.message);
            }
          };
        }
      };

      const deletePostBtn = document.createElement('button');
      deletePostBtn.type = 'button';
      deletePostBtn.className = 'post-owner-btn post-owner-btn-danger';
      deletePostBtn.innerHTML = iconSprite('trash');
      deletePostBtn.title = t('DeletePost');
      deletePostBtn.onclick = () => {
        showConfirm(t('deleteConfirm'), async () => {
          try {
            await api.delete(`/posts/${p.id}`, state.token);
            document.getElementById(`post-${p.id}`)?.remove();
            refreshCurrentFeed();
          } catch (err) {
            showAlert(t('deleteError') + ': ' + err.message);
            console.error(err);
          }
        });
      };

      ownerActions.appendChild(editPostBtn);
      ownerActions.appendChild(deletePostBtn);
    }

    if (ownerActions) metaSide.appendChild(ownerActions);
    if (editMenuContainer) metaSide.appendChild(editMenuContainer);
    meta.appendChild(metaSide);

    card.appendChild(meta);
    if (repostBadge) card.appendChild(repostBadge);
    card.appendChild(content);
    const repostPreview = buildRepostPreview(p);
    if (repostPreview) card.appendChild(repostPreview);
    const imageDiv = document.createElement('div');
    imageDiv.className = 'post-media';
    appendPostMedia(imageDiv, p);
    card.appendChild(imageDiv);
    const actionsRow = document.createElement('div');
    actionsRow.className = 'post-actions';
    const commentsBtn = document.createElement('button');
    commentsBtn.innerHTML = iconWithCount('chat', p.comments || 0);
    commentsBtn.className = 'reaction-btn';
    commentsBtn.title = t('comments');
    commentsBtn.onclick = () => toggleComments(card, p.id);
    const totalReactions = ['like', 'love', 'funny', 'poop', 'clown'].reduce((sum, typeKey) => {
      const count = p.reactions && p.reactions[typeKey] ? p.reactions[typeKey] : 0;
      return sum + count;
    }, 0);
    const reactionsToggleBtn = document.createElement('button');
    reactionsToggleBtn.className = 'reaction-btn';
    reactionsToggleBtn.innerHTML = totalReactions > 0 ? iconWithCount('reactions', totalReactions) : iconSprite('reactions');
    reactionsToggleBtn.title = t('showReactions');
    const repostBtn = document.createElement('button');
    repostBtn.className = 'reaction-btn';
    repostBtn.innerHTML = iconSprite('repost');
    repostBtn.title = t('repost');
    repostBtn.onclick = async () => {
      if (!state.token) { showAlert(t('loginToRepost')); return; }
      try {
        await api.post(`/posts/${p.id}/repost`, {}, state.token);
        refreshCurrentFeed();
        showAlert(t('repostSuccess'));
      } catch (err) {
        const errorMessage = String(err && err.message || '');
        showAlert(errorMessage.includes('already_reposted') ? t('repostedAlready') : `${t('repostError')}: ${errorMessage}`);
      }
    };
    actionsRow.appendChild(commentsBtn);
    actionsRow.appendChild(repostBtn);
    actionsRow.appendChild(reactionsToggleBtn);
    const reactionsDiv = document.createElement('div');
    reactionsDiv.className = 'reactions hidden';
    const types = ['like', 'love', 'funny', 'poop', 'clown'];
    types.forEach(typeKey => {
      const btn = document.createElement('button');
      const emoji = reactions[typeKey].emoji;
      const count = p.reactions && p.reactions[typeKey] ? p.reactions[typeKey] : 0;
      btn.innerHTML = reactionWithCount(emoji, count);
      btn.title = reactions[typeKey].label[state.lang];
      btn.className = 'reaction-btn';
      if (p.userReactions && p.userReactions.includes(typeKey)) btn.classList.add('active');
      btn.onclick = async () => {
      if (!state.token) { showAlert(t('loginToReact')); return; }
        await api.post(`/posts/${p.id}/reaction`, { type: typeKey }, state.token);
        refreshCurrentFeed();
      };
      reactionsDiv.appendChild(btn);
    });
    reactionsToggleBtn.onclick = () => {
      reactionsDiv.classList.toggle('hidden');
    };
    card.appendChild(actionsRow);
    card.appendChild(reactionsDiv);
    const viewsDiv = document.createElement('div');
    viewsDiv.className = 'post-views';
    const viewsCount = typeof p.views === 'number' ? p.views : 0;
    viewsDiv.innerHTML = iconWithCount('views', viewsCount);
    card.appendChild(viewsDiv);
    el.appendChild(card);

    const observer = ensurePostViewObserver();
    if (observer) observer.observe(card);
  }
  settlePageLoader(containerId);
}

async function loadPosts() {
  showPageLoaderIfEmpty('posts', getLoaderMessage('feed'));
  const loaderTimeout = setTimeout(() => hidePageLoader(), 8000);
  try {
    const headers = state.token ? { Authorization: 'Bearer ' + state.token } : {};
    const posts = await fetch('/api/posts', { headers }).then(r => r.json());
    clearTimeout(loaderTimeout);
    renderPostsInto(posts, 'posts');
    await loadStories(); // Load stories after posts
  } catch (err) {
    clearTimeout(loaderTimeout);
    const el = document.getElementById('posts');
    if (el) {
      el.innerHTML = `<div class="card" style="padding:24px;text-align:center"><div class="muted">${escapeHtml(state.lang === 'ru' ? 'Не удалось загрузить ленту.' : 'Failed to load the feed.')}</div></div>`;
    }
    settlePageLoader('posts');
  }
}

async function loadStories() {
  try {
    const headers = state.token ? { Authorization: 'Bearer ' + state.token } : {};
    const stories = await fetch('/api/stories', { headers }).then(r => r.json());
    renderStoriesInto(stories, 'stories');
  } catch (err) {
    console.error('Failed to load stories:', err);
  }
}

function renderStoriesInto(stories, containerId) {
  const el = document.querySelector('#stories .stories-container');
  if (!el) return;
  el.innerHTML = '';

  // Add create story circle if user is logged in
  if (state.user) {
    const createCircle = document.createElement('div');
    createCircle.className = 'story-circle create';
    createCircle.onclick = () => document.getElementById('story-media').click();

    const img = document.createElement('img');
    img.src = getAvatarUrl(state.user.avatar);
    img.alt = 'Your avatar';

    const plus = document.createElement('div');
    plus.className = 'story-plus';
    plus.textContent = '+';

    createCircle.appendChild(img);
    createCircle.appendChild(plus);
    el.appendChild(createCircle);
  }

  if (!Array.isArray(stories) || !stories.length) {
    if (!state.user) {
      el.innerHTML = '<p class="muted" style="padding:10px;text-align:center">No stories available</p>';
    }
    return;
  }

  // Group stories by user
  const userStories = {};
  stories.forEach(story => {
    if (!userStories[story.user_id]) {
      userStories[story.user_id] = {
        user: story,
        stories: []
      };
    }
    userStories[story.user_id].stories.push(story);
  });

  Object.values(userStories).forEach(({ user, stories: userStoriesList }) => {
    const hasUnseen = userStoriesList.some(s => {
      const viewedKey = `story_viewed_${s.id}`;
      return !sessionStorage.getItem(viewedKey);
    });
    
    const storyCircle = document.createElement('div');
    storyCircle.className = 'story-circle' + (hasUnseen ? ' new' : '');
    
    // Show first story thumbnail
    const thumbContainer = document.createElement('div');
    thumbContainer.className = 'story-thumb';
    const img = document.createElement('img');
    img.src = userStoriesList[0].media_url;
    img.alt = user.username;
    thumbContainer.appendChild(img);
    storyCircle.appendChild(thumbContainer);
    
    storyCircle.onclick = () => {
      const allStories = [];
      Object.values(userStories).forEach(userData => {
        userData.stories.forEach(s => {
          allStories.push({ ...s, username: userData.user.username, avatar: userData.user.avatar });
        });
      });
      if (allStories.length > 0) {
        showStory(allStories, userStoriesList[0] ? 0 : 0);
        // Mark all as viewed
        userStoriesList.forEach(s => {
          sessionStorage.setItem(`story_viewed_${s.id}`, '1');
        });
        // Update UI
        storyCircle.classList.remove('new');
      }
    };
    
    const usernameLabel = document.createElement('div');
    usernameLabel.className = 'story-username';
    usernameLabel.textContent = user.username;
    usernameLabel.style.cssText = 'font-size:11px;font-weight:600;color:var(--text);text-align:center;margin-top:4px;max-width:80px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;';
    
    const wrapper = document.createElement('div');
    wrapper.style.cssText = 'display:flex;flex-direction:column;align-items:center;';
    wrapper.appendChild(storyCircle);
    wrapper.appendChild(usernameLabel);
    
    el.appendChild(wrapper);
  });
}

function showStory(stories, startIndex = 0) {
  let currentIndex = startIndex;
  let timer;
  let timelineInterval;

  function renderStory() {
    if (currentIndex >= stories.length) {
      document.body.removeChild(modal);
      return;
    }

    const story = stories[currentIndex];
    container.innerHTML = '';
    inputContainer.innerHTML = '';

    const media = document.createElement(story.media_type === 'video' ? 'video' : 'img');
    media.src = story.media_url;
    media.style.maxWidth = '90%';
    media.style.maxHeight = '90vh';
    media.style.border = '4px solid white';
    media.style.borderRadius = '12px';
    media.style.boxShadow = '0 4px 12px rgba(0,0,0,0.3)';
    media.style.background = '#111';
    if (story.media_type === 'video') {
      media.controls = false;
      media.autoplay = true;
      media.muted = true; // autoplay requires muted
    }

    // Timeline
    const timeline = document.createElement('div');
    timeline.style.position = 'absolute';
    timeline.style.top = '10px';
    timeline.style.left = '10px';
    timeline.style.right = '10px';
    timeline.style.height = '4px';
    timeline.style.background = 'rgba(255,255,255,0.3)';
    timeline.style.borderRadius = '2px';
    timeline.style.overflow = 'hidden';

    const progress = document.createElement('div');
    progress.style.height = '100%';
    progress.style.background = 'white';
    progress.style.width = '0%';
    progress.style.transition = 'none';
    timeline.appendChild(progress);

    // Close button
    const closeBtn = document.createElement('button');
    closeBtn.textContent = '✕';
    closeBtn.style.position = 'absolute';
    closeBtn.style.top = '20px';
    closeBtn.style.right = '20px';
    closeBtn.style.background = 'rgba(255,255,255,0.8)';
    closeBtn.style.border = 'none';
    closeBtn.style.borderRadius = '50%';
    closeBtn.style.width = '40px';
    closeBtn.style.height = '40px';
    closeBtn.style.fontSize = '20px';
    closeBtn.style.cursor = 'pointer';
    closeBtn.onclick = () => {
      clearInterval(timelineInterval);
      clearTimeout(timer);
      document.body.removeChild(modal);
    };

    // Story counter
    const counter = document.createElement('div');
    counter.textContent = `${currentIndex + 1}/${stories.length}`;
    counter.style.position = 'absolute';
    counter.style.top = '20px';
    counter.style.left = '50%';
    counter.style.transform = 'translateX(-50%)';
    counter.style.background = 'rgba(255,255,255,0.8)';
    counter.style.padding = '6px 12px';
    counter.style.borderRadius = '16px';
    counter.style.fontSize = '14px';
    counter.style.fontWeight = '600';
    counter.style.color = '#000';
    counter.style.zIndex = '10';

    // Username at top
    const usernameDiv = document.createElement('div');
    usernameDiv.style.position = 'absolute';
    usernameDiv.style.top = '20px';
    usernameDiv.style.left = '20px';
    usernameDiv.style.display = 'flex';
    usernameDiv.style.alignItems = 'center';
    usernameDiv.style.gap = '8px';
    usernameDiv.style.zIndex = '10';

    const username = document.createElement('span');
    username.textContent = story.username;
    username.style.background = 'rgba(255,255,255,0.8)';
    username.style.padding = '6px 12px';
    username.style.borderRadius = '16px';
    username.style.fontSize = '14px';
    username.style.fontWeight = '600';
    username.style.color = '#000';
    username.style.cursor = 'pointer';
    username.onclick = (e) => {
      e.stopPropagation();
      clearInterval(timelineInterval);
      clearTimeout(timer);
      document.body.removeChild(modal);
      showProfile(story.user_id);
    };
    usernameDiv.appendChild(username);

    // Timer
    const timerDiv = document.createElement('div');
    const remaining = Math.max(0, story.expires_at - Date.now());
    const hours = Math.floor(remaining / (1000 * 60 * 60));
    const mins = Math.floor((remaining % (1000 * 60 * 60)) / (1000 * 60));
    timerDiv.textContent = `${hours}h ${mins}m`;
    timerDiv.style.background = 'rgba(255,255,255,0.8)';
    timerDiv.style.padding = '6px 12px';
    timerDiv.style.borderRadius = '16px';
    timerDiv.style.fontSize = '14px';
    timerDiv.style.fontWeight = '600';
    timerDiv.style.color = '#000';
    usernameDiv.appendChild(timerDiv);

// Subscribe button
    if (state.user && state.user.id !== story.user_id) {
      const subBtn = document.createElement('button');
      subBtn.textContent = '+';
      subBtn.style.background = 'linear-gradient(135deg, rgba(34,197,94,0.9), rgba(59,130,246,0.8)';
      subBtn.style.border = 'none';
      subBtn.style.borderRadius = '50%';
      subBtn.style.width = '32px';
      subBtn.style.height = '32px';
      subBtn.style.fontSize = '18px';
      subBtn.style.fontWeight = 'bold';
      subBtn.style.color = '#fff';
      subBtn.style.cursor = 'pointer';
      subBtn.style.zIndex = '10';
      subBtn.onclick = async (e) => {
        e.stopPropagation();
        try {
          await api.post(`/users/${story.user_id}/subscribe`, {}, state.token);
          subBtn.textContent = '✓';
          subBtn.disabled = true;
        } catch (err) {
          console.error('Subscribe error:', err);
        }
      };
      usernameDiv.appendChild(subBtn);
    }

    // Like button
    const likeBtn = document.createElement('button');
    likeBtn.textContent = '❤️';
    likeBtn.style.position = 'absolute';
    likeBtn.style.bottom = '20px';
    likeBtn.style.right = '20px';
    likeBtn.style.background = 'rgba(255,255,255,0.8)';
    likeBtn.style.border = 'none';
    likeBtn.style.borderRadius = '50%';
    likeBtn.style.width = '50px';
    likeBtn.style.height = '50px';
    likeBtn.style.fontSize = '24px';
    likeBtn.style.cursor = 'pointer';
    likeBtn.onclick = async () => {
      try {
        await api.post(`/stories/${story.id}/like`, {}, state.token);
        likeBtn.textContent = likeBtn.textContent === '❤️' ? '💖' : '❤️';
      } catch (err) {
        console.error('Like error:', err);
      }
    };

    container.appendChild(timeline);
    container.appendChild(media);

    // Navigation arrows
    const prevBtn = document.createElement('button');
    prevBtn.innerHTML = '‹';
    prevBtn.style.cssText = 'position:absolute;left:10px;top:50%;transform:translateY(-50%);width:44px;height:44px;border-radius:50%;border:none;background:rgba(255,255,255,0.9);font-size:28px;font-weight:bold;cursor:pointer;box-shadow:0 4px 12px rgba(0,0,0,0.2);display:flex;align-items:center;justify-content:center;z-index:10;';
    prevBtn.onclick = (e) => {
      e.stopPropagation();
      if (currentIndex > 0) {
        currentIndex--;
        renderStory();
      }
    };
    prevBtn.style.opacity = currentIndex === 0 ? '0.3' : '1';
    prevBtn.style.pointerEvents = currentIndex === 0 ? 'none' : 'auto';

    const nextBtn = document.createElement('button');
    nextBtn.innerHTML = '›';
    nextBtn.style.cssText = 'position:absolute;right:10px;top:50%;transform:translateY(-50%);width:44px;height:44px;border-radius:50%;border:none;background:rgba(255,255,255,0.9);font-size:28px;font-weight:bold;cursor:pointer;box-shadow:0 4px 12px rgba(0,0,0,0.2);display:flex;align-items:center;justify-content:center;z-index:10;';
    nextBtn.onclick = (e) => {
      e.stopPropagation();
      if (currentIndex < stories.length - 1) {
        currentIndex++;
        renderStory();
      }
    };
    nextBtn.style.opacity = currentIndex >= stories.length - 1 ? '0.3' : '1';
    nextBtn.style.pointerEvents = currentIndex >= stories.length - 1 ? 'none' : 'auto';

    container.appendChild(prevBtn);
    container.appendChild(nextBtn);
    container.appendChild(closeBtn);
    container.appendChild(counter);
    container.appendChild(usernameDiv);
    container.appendChild(likeBtn);
    
// Comment input
    const commentInput = document.createElement('input');
    commentInput.type = 'text';
    commentInput.placeholder = 'Отправить сообщение...';
    commentInput.style.cssText = 'flex:1;padding:12px 16px;border-radius:24px;border:none;background:linear-gradient(135deg, rgba(34,197,94,0.1), rgba(59,130,246,0.05));font-size:14px;box-shadow:0 4px 12px rgba(34,197,94,0.15);color:var(--text);border:1px solid var(--green-500);';
    
    const sendBtn = document.createElement('button');
    sendBtn.innerHTML = '➤';
    sendBtn.style.cssText = 'width:44px;height:44px;border-radius:50%;border:none;background:linear-gradient(135deg, rgba(34,197,94,0.9), rgba(59,130,246,0.8));color:#fff;font-size:18px;font-weight:bold;cursor:pointer;box-shadow:0 4px 12px rgba(59,130,246,0.3);opacity:0;pointer-events:none;transition:all 0.2s ease;';
    sendBtn.onclick = async () => {
      if (commentInput.value.trim()) {
        try {
          await api.post(`/stories/${story.id}/comments`, { content: commentInput.value.trim() }, state.token);
          commentInput.value = '';
          showAlert('Комментарий отправлен!');
        } catch (err) {
          console.error('Comment error:', err);
        }
      }
};
    
    let isPaused = false;
    commentInput.onfocus = () => {
      isPaused = true;
      likeBtn.style.opacity = '0';
      likeBtn.style.pointerEvents = 'none';
      sendBtn.style.opacity = '1';
      sendBtn.style.pointerEvents = 'auto';
    };
    commentInput.onblur = () => {
      isPaused = false;
      likeBtn.style.opacity = '1';
      likeBtn.style.pointerEvents = 'auto';
      if (!commentInput.value.trim()) {
        sendBtn.style.opacity = '0';
        sendBtn.style.pointerEvents = 'none';
      }
    };
    
    inputContainer.appendChild(commentInput);
    inputContainer.appendChild(sendBtn);
    
    modal.appendChild(container);
    modal.appendChild(inputContainer);
    startTimeline(media, progress, story);
  }

  function startTimeline(media, progress, story) {
    clearInterval(timelineInterval);
    clearTimeout(timer);

    if (story.media_type === 'video') {
      media.onloadedmetadata = () => {
        const duration = media.duration * 1000;
        runTimeline(duration);
      };
      media.onended = () => {
        if (currentIndex < stories.length - 1) {
          currentIndex++;
          setTimeout(renderStory, 500);
        } else {
          document.body.removeChild(modal);
        }
      };
    } else {
      runTimeline(5000); // 5s for images
    }

    function runTimeline(duration) {
      let isPaused = false;
      let pauseTime = 0;
      let totalPaused = 0;
      
      const checkPause = () => {
        if (commentInput === document.activeElement) {
          isPaused = true;
          pauseTime = Date.now();
        } else if (isPaused && pauseTime > 0) {
          totalPaused += Date.now() - pauseTime;
          isPaused = false;
          pauseTime = 0;
        }
      };
      
      const startTime = Date.now();
      timelineInterval = setInterval(() => {
        checkPause();
        if (isPaused) return;
        
        const elapsed = Date.now() - startTime - totalPaused;
        const percent = Math.min((elapsed / duration) * 100, 100);
        progress.style.width = percent + '%';
        if (percent >= 100) {
          clearInterval(timelineInterval);
          if (currentIndex < stories.length - 1) {
            currentIndex++;
            setTimeout(renderStory, 500);
          } else {
            document.body.removeChild(modal);
          }
        }
      }, 50);
    }
  }

  // Modal setup
  const modal = document.createElement('div');
  modal.style.position = 'fixed';
  modal.style.top = '0';
  modal.style.left = '0';
  modal.style.width = '100%';
  modal.style.height = '100%';
  modal.style.background = 'rgba(0,0,0,0.9)';
  modal.style.zIndex = '5000';
  modal.style.display = 'flex';
  modal.style.flexDirection = 'column';
  modal.style.alignItems = 'center';
  modal.style.justifyContent = 'center';

  const container = document.createElement('div');
  container.style.position = 'relative';
  container.style.display = 'flex';
  container.style.alignItems = 'center';
  container.style.justifyContent = 'center';
  container.style.maxWidth = '90%';
  container.style.maxHeight = '85%';

  const inputContainer = document.createElement('div');
  inputContainer.style.position = 'fixed';
  inputContainer.style.bottom = '20px';
  inputContainer.style.left = '50%';
  inputContainer.style.transform = 'translateX(-50%)';
  inputContainer.style.width = '90%';
  inputContainer.style.maxWidth = '400px';
  inputContainer.style.display = 'flex';
  inputContainer.style.alignItems = 'center';
  inputContainer.style.gap = '10px';

  modal.onclick = (e) => {
    if (e.target === modal) {
      clearInterval(timelineInterval);
      clearTimeout(timer);
      document.body.removeChild(modal);
      return;
    }
    const rect = modal.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const width = rect.width;
    if (x < width * 0.3 && currentIndex > 0) {
      currentIndex--;
      renderStory();
    } else if (x > width * 0.7 && currentIndex < stories.length - 1) {
      currentIndex++;
      renderStory();
    }
  };

  modal.appendChild(container);
  document.body.appendChild(modal);

  renderStory();
}

function renderSiteNewsInto(items, containerId) {
  const el = document.getElementById(containerId);
  if (!el) return;
  el.innerHTML = '';

  if (!Array.isArray(items) || !items.length) {
    el.innerHTML = `<p class="muted" style="padding:24px;text-align:center">${escapeHtml(t('noSiteNews'))}</p>`;
    settlePageLoader(containerId);
    return;
  }

  for (const item of items) {
    const card = document.createElement('div');
    card.className = 'card post site-news-post';
    card.id = `site-news-${item.id}`;
=======
>>>>>>> 43fc63577f740ec07265f99ac0d4769620c4ae8c

    const meta = document.createElement('div');
    meta.className = 'meta';

    const avatar = document.createElement('img');
<<<<<<< HEAD
    avatar.src = getAvatarUrl(item.avatar);
    avatar.className = 'avatar-small';
    avatar.style.cursor = 'pointer';
    avatar.onclick = () => showProfile(item.user_id);

    const author = document.createElement('strong');
    author.textContent = formatUsername(item.username, item.badge);
    author.style.cursor = 'pointer';
    author.onclick = () => showProfile(item.user_id);

    const time = document.createElement('div');
    time.textContent = new Date(item.created_at).toLocaleString();

    meta.appendChild(avatar);
    meta.appendChild(author);
    meta.appendChild(time);

    const badge = document.createElement('div');
    badge.className = 'post-repost-badge';
    badge.innerHTML = `${iconSprite('inbox')}<span>${escapeHtml(t('siteNews'))}</span>`;

    const content = document.createElement('div');
    content.className = 'content';
    const body = document.createElement('div');
    body.className = 'post-content-body';
    body.textContent = item.content;
    content.appendChild(body);

    card.appendChild(meta);
    card.appendChild(badge);
    card.appendChild(content);
    el.appendChild(card);
  }
  settlePageLoader(containerId);
}

async function loadSiteNews() {
  const container = document.getElementById('site-news-feed');
  if (!container) return;
  showPageLoaderIfEmpty('site-news-feed', getLoaderMessage('news'));
  try {
    const headers = state.token ? { Authorization: 'Bearer ' + state.token } : {};
    const news = await fetch('/api/site-news', { headers }).then(r => r.json());
    renderSiteNewsInto(news, 'site-news-feed');
  } catch (err) {
    container.innerHTML = `<p class="muted" style="padding:24px;text-align:center">${escapeHtml(t('siteNewsLoadError'))}</p>`;
    settlePageLoader('site-news-feed');
  }
=======
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
      placeholder.textContent = t('noReactions');
        reactionSummary.appendChild(placeholder);
      }
    }
    buildReactionSummary();

    // Reaction dropdown wrapper
    const reactionWrapper = document.createElement('div');
    reactionWrapper.className = 'reaction-wrapper';

    const reactBtn = document.createElement('button');
    reactBtn.className = 'react-toggle-btn';
      reactBtn.textContent = '😊 ' + t('reactAction');

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
  titleEl.textContent = t('recommendedForYou');
  renderPostsInto(posts, 'recommended-posts');
}

async function loadPosts() {
  const headers = state.token ? { Authorization: 'Bearer ' + state.token } : {};
  const response = await fetch('/api/posts', { headers });
  
  if (response.status === 401) {
    // Not authenticated - show auth screen
    allFeedPosts = [];
    const postsContainer = document.getElementById('posts');
    if (postsContainer) {
      postsContainer.innerHTML = `
        <div style="text-align: center; padding: 60px 20px; color: #999; min-height: 70vh; display: flex; flex-direction: column; justify-content: center; align-items: center;">
          <h2 style="margin-bottom: 10px; font-size: 28px;">🔐 ${t('authWelcomeTitle')}</h2>
          <p style="margin-bottom: 30px; font-size: 16px; max-width: 500px;">${t('authWelcomeDesc')}</p>
        </div>
      `;
      // Ensure only informational text is shown for guests in center screen.
      postsContainer.querySelectorAll('button').forEach((btn) => btn.remove());
    }
    return;
  }
  
  const posts = await response.json();
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
  allBtn.textContent = t('allCategories');
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
    <h2 style="margin-bottom:4px">${t('chooseCategoryEmoji')}</h2>
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
>>>>>>> 43fc63577f740ec07265f99ac0d4769620c4ae8c
}

async function loadSubscriptionsPosts() {
  const container = document.getElementById('subscriptions-posts');
  if (!container) return;
<<<<<<< HEAD
  showPageLoaderIfEmpty('subscriptions-posts', getLoaderMessage('subscriptions'));
  if (!state.token) {
    container.innerHTML = '<p class="muted" style="padding:24px;text-align:center">' + escapeHtml(state.lang === 'ru' ? 'Войдите, чтобы смотреть посты подписок.' : 'Log in to see subscription posts.') + '</p>';
    settlePageLoader('subscriptions-posts');
=======
  if (!state.token) {
    container.innerHTML = '';
>>>>>>> 43fc63577f740ec07265f99ac0d4769620c4ae8c
    return;
  }
  try {
    const posts = await api.get('/posts/subscriptions', state.token);
    if (!Array.isArray(posts)) {
      container.innerHTML = '<p class="muted">' + (t('noPostsSubscriptions') || 'No posts from subscriptions yet') + '</p>';
<<<<<<< HEAD
      settlePageLoader('subscriptions-posts');
=======
>>>>>>> 43fc63577f740ec07265f99ac0d4769620c4ae8c
      return;
    }
    if (posts.length === 0) {
      container.innerHTML = '<p class="muted" style="padding:24px;text-align:center">' + (t('noPostsSubscriptions') || 'Subscribe to users to see their posts here') + '</p>';
<<<<<<< HEAD
      settlePageLoader('subscriptions-posts');
=======
>>>>>>> 43fc63577f740ec07265f99ac0d4769620c4ae8c
      return;
    }
    renderPostsInto(posts, 'subscriptions-posts');
  } catch (err) {
    container.innerHTML = '<p class="muted" style="padding:24px">' + (t('noPostsSubscriptions') || 'Could not load subscriptions feed') + '</p>';
<<<<<<< HEAD
    settlePageLoader('subscriptions-posts');
  }
}

async function toggleComments(card, postId){
  let list = card.querySelector('.comment-list');
  if (!list){
    list = document.createElement('div'); list.className='comment-list';
    const comments = await api.get(`/posts/${postId}/comments`, state.token);
    for (const c of comments){
      const div = document.createElement('div'); div.className='comment'; 
      const avatar = document.createElement('img'); avatar.src = getAvatarUrl(c.avatar); avatar.className='avatar-tiny'; avatar.style.cursor='pointer';
      avatar.onclick = () => showProfile(c.user_id);
      const nameLink = document.createElement('strong'); nameLink.textContent = formatUsername(c.username, c.badge); nameLink.style.cursor='pointer';
      nameLink.onclick = () => showProfile(c.user_id);
      const time = document.createElement('small'); time.textContent = new Date(c.created_at).toLocaleString();
      div.appendChild(avatar); div.appendChild(nameLink); div.appendChild(time); div.appendChild(document.createElement('div')).textContent = c.content;
      list.appendChild(div);
    }
    const add = document.createElement('div'); add.style.marginTop='8px';
    const textarea = document.createElement('input'); textarea.placeholder=t('writeComment'); textarea.style.width='70%';
    const btn = document.createElement('button'); btn.innerHTML = iconSprite('send'); btn.title=t('send'); btn.onclick = async () => {
      if (!state.token) { showAlert(t('loginToComment')); return; }
      const res = await api.post(`/posts/${postId}/comments`, { content: textarea.value }, state.token);
      if (res.id) { refreshCurrentFeed(); }
    };
    add.appendChild(textarea); add.appendChild(btn);
    list.appendChild(add);
    card.appendChild(list);
    state.nav.postId = String(postId);
    updateBreadcrumb();
  } else {
    list.remove();
    if (state.nav.postId === String(postId)) {
      state.nav.postId = null;
      updateBreadcrumb();
    }
  }
=======
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
  title.textContent = t('yourSubscriptions');
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
    empty.textContent = t('noCommentsYet');
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
>>>>>>> 43fc63577f740ec07265f99ac0d4769620c4ae8c
}

document.getElementById('btn-image').onclick = () => {
  document.getElementById('post-image').click();
};

<<<<<<< HEAD
document.getElementById('btn-story').onclick = () => {
  document.getElementById('story-media').click();
};

document.getElementById('story-media').onchange = async (e) => {
  const file = e.target.files[0];
  if (!file) return;
  
  const reader = new FileReader();
  reader.onload = function(event) {
    const base64 = event.target.result;
    showStoryEditor(base64, file);
  };
  reader.readAsDataURL(file);
};

async function showStoryEditor(previewUrl, file) {
  const previousEditor = document.querySelector('.story-editor');
  if (previousEditor) previousEditor.remove();
  
  const modal = document.createElement('div');
  modal.className = 'story-editor';
  modal.innerHTML = `
    <div class="story-editor-overlay"></div>
    <div class="story-editor-card">
      <div class="story-editor-header">
        <button type="button" class="story-editor-close">✕</button>
        <div class="story-editor-title">Редактор истории</div>
        <button type="button" class="story-editor-publish">Опубликовать</button>
      </div>
      <div class="story-editor-preview">
        <img src="${previewUrl}" alt="Preview" class="story-editor-image">
        <div class="story-editor-overlays"></div>
      </div>
      <div class="story-editor-tools">
        <div class="story-editor-tools-main">
          <button type="button" class="story-editor-tool-btn active" data-tab="filters">Фильтры</button>
          <button type="button" class="story-editor-tool-btn" data-tab="text">Текст</button>
          <button type="button" class="story-editor-tool-btn" data-tab="emoji">Стикеры</button>
        </div>
        <div class="story-editor-tool-content">
          <div class="story-editor-panel" data-panel="filters">
            <div class="story-editor-tool-group">
              <button type="button" class="story-editor-tool active" data-tool="none">Оригинал</button>
              <button type="button" class="story-editor-tool" data-tool="brightness">Яркость +</button>
              <button type="button" class="story-editor-tool" data-tool="contrast">Контраст +</button>
              <button type="button" class="story-editor-tool" data-tool="warm">Тёплый</button>
              <button type="button" class="story-editor-tool" data-tool="cool">Холодный</button>
              <button type="button" class="story-editor-tool" data-tool="grayscale">Ч/Б</button>
              <button type="button" class="story-editor-tool" data-tool="sepia">Сепия</button>
              <button type="button" class="story-editor-tool" data-tool="fade">Выгорел</button>
              <button type="button" class="story-editor-tool" data-tool="noir">Нуар</button>
              <button type="button" class="story-editor-tool" data-tool="invert">Инверсия</button>
            </div>
            <div class="story-editor-tool-group">
              <button type="button" class="story-editor-tool" data-rotate="-90">↺</button>
              <button type="button" class="story-editor-tool" data-rotate="90">↻</button>
            </div>
          </div>
          <div class="story-editor-panel hidden" data-panel="text">
            <input type="text" class="story-editor-text-input" placeholder="Введите текст...">
            <div class="story-editor-text-options">
              <select class="story-editor-font-select">
                <option value="Arial">Arial</option>
                <option value="Georgia">Georgia</option>
                <option value="Courier New">Courier</option>
                <option value="Impact">Impact</option>
              </select>
              <button type="button" class="story-editor-text-color">
                <input type="color" value="#ffffff">
              </button>
            </div>
            <div class="story-editor-tool-group">
              <button type="button" class="story-editor-tool story-editor-add-text">Добавить</button>
            </div>
          </div>
          <div class="story-editor-panel hidden" data-panel="emoji">
            <div class="story-editor-emojis">
              😀 😍 😂 🙄 🤔 💯 🔥 ❤️ 🦄 🌈 ⭐ 🌙 ☀️ 💡 🎉 💪 ✨ 🔮 🎀 🐱 🦊 🐼 🐸
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
  
  document.body.appendChild(modal);
  
  const imageEl = modal.querySelector('.story-editor-image');
  const overlaysEl = modal.querySelector('.story-editor-overlays');
  let currentRotate = 0;
  let currentFlipH = 1;
  let currentFlipV = 1;
  let currentFilter = 'none';
  
  const applyTransform = () => {
    imageEl.style.transform = `rotate(${currentRotate}deg) scaleX(${currentFlipH}) scaleY(${currentFlipV})`;
  };
  
  const applyFilter = (filter) => {
    currentFilter = filter;
    const filters = {
      none: 'none',
      brightness: 'brightness(1.4) contrast(1.1)',
      contrast: 'brightness(1.1) contrast(1.5)',
      warm: 'sepia(0.4) saturate(1.5) hue-rotate(-10deg)',
      cool: 'saturate(0.8) hue-rotate(20deg) brightness(1.05)',
      grayscale: 'brightness(1.1) contrast(1.1) grayscale(1)',
      sepia: 'sepia(0.6) saturate(1.3)',
      invert: 'invert(1) brightness(1.1)',
      fade: 'brightness(1.15) contrast(0.9) saturate(0.8)',
      noir: 'brightness(1.1) contrast(1.3) grayscale(1) sepia(0.2)'
    };
    imageEl.style.filter = filters[filter] || 'none';
    
    modal.querySelectorAll('.story-editor-panel[data-panel="filters"] .story-editor-tool').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.tool === filter);
    });
  };
  
  modal.querySelectorAll('.story-editor-tool[data-tool]').forEach(btn => {
    btn.onclick = () => {
      if (btn.dataset.tool) applyFilter(btn.dataset.tool);
    };
  });
  
  modal.querySelectorAll('.story-editor-tool[data-rotate]').forEach(btn => {
    btn.onclick = () => {
      currentRotate += parseInt(btn.dataset.rotate);
      applyTransform();
    };
  });
  
  modal.querySelectorAll('.story-editor-tool-btn').forEach(btn => {
    btn.onclick = () => {
      modal.querySelectorAll('.story-editor-tool-btn').forEach(b => b.classList.remove('active'));
      modal.querySelectorAll('.story-editor-panel').forEach(p => p.classList.add('hidden'));
      btn.classList.add('active');
      modal.querySelector(`.story-editor-panel[data-panel="${btn.dataset.tab}"]`).classList.remove('hidden');
    };
  });
  
  const addOverlayElement = (content, type = 'text') => {
    const el = document.createElement('div');
    el.className = 'story-editor-overlay-el';
    el.innerHTML = content;
    el.style.cssText = 'position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);color:#fff;font-size:32px;font-weight:bold;text-shadow:2px 2px 4px rgba(0,0,0,0.5);padding:8px 12px;border:2px dashed rgba(255,255,255,0.7);border-radius:8px;cursor:move;';
    el.contentEditable = type === 'text';
    overlaysEl.appendChild(el);
    
    const sizeHandle = document.createElement('div');
    sizeHandle.className = 'story-editor-resize-handle';
    sizeHandle.style.cssText = 'position:absolute;right:-8px;bottom:-8px;width:16px;height:16px;background:#fff;border-radius:50%;cursor:se-resize;box-shadow:0 2px 4px rgba(0,0,0,0.3);';
    el.appendChild(sizeHandle);
    
    let isDragging = false, isResizing = false, startX, startY, initialLeft, initialTop, initialFontSize;
    const currentFontSize = parseInt(el.querySelector('span')?.style.fontSize || 32);
    
    el.onmousedown = (e) => {
      if (e.target === sizeHandle) return;
      isDragging = true;
      startX = e.clientX;
      startY = e.clientY;
      initialLeft = el.offsetLeft;
      initialTop = el.offsetTop;
      e.stopPropagation();
    };
    
    sizeHandle.onmousedown = (e) => {
      isResizing = true;
      startX = e.clientX;
      startY = e.clientY;
      initialFontSize = parseInt(window.getComputedStyle(el.querySelector('span')).fontSize) || 32;
      e.stopPropagation();
    };
    
    document.onmousemove = (e) => {
      if (isDragging) {
        el.style.left = (initialLeft + e.clientX - startX) + 'px';
        el.style.top = (initialTop + e.clientY - startY) + 'px';
      }
      if (isResizing) {
        const newSize = initialFontSize + (e.clientY - startY);
        const span = el.querySelector('span');
        if (span) span.style.fontSize = Math.max(12, Math.min(72, newSize)) + 'px';
      }
    };
    
    document.onmouseup = () => {
      isDragging = false;
      isResizing = false;
    };
  };
  
  const addTextBtn = modal.querySelector('.story-editor-add-text');
  if (addTextBtn) {
    addTextBtn.onclick = () => {
      const text = modal.querySelector('.story-editor-text-input').value;
      const font = modal.querySelector('.story-editor-font-select').value;
      const color = modal.querySelector('.story-editor-text-color input').value;
      if (text) addOverlayElement(`<span style="font-family:${font};color:${color}">${text}</span>`);
      modal.querySelector('.story-editor-text-input').value = '';
    };
  }
  
  modal.querySelectorAll('.story-editor-emojis').forEach(container => {
    container.onclick = (e) => {
      if (e.target.tagName === 'SPAN') {
        addOverlayElement(e.target.textContent);
      }
    };
  });
  
  modal.querySelector('.story-editor-close').onclick = () => modal.remove();
  modal.querySelector('.story-editor-overlay').onclick = () => modal.remove();
  
  modal.querySelector('.story-editor-publish').onclick = async () => {
    const btn = modal.querySelector('.story-editor-publish');
    btn.disabled = true;
    btn.textContent = 'Загрузка...';
    
    try {
      const formData = new FormData();
      formData.append('media', file);
      formData.append('media_type', file.type.startsWith('video/') ? 'video' : 'image');
      
      const headers = state.token ? { Authorization: 'Bearer ' + state.token } : {};
      const response = await fetch('/api/stories', { method: 'POST', headers, body: formData });
      
      if (response.ok) {
        modal.remove();
        loadStories();
      } else {
        btn.disabled = false;
        btn.textContent = 'Опубликовать';
        alert('Не удалось создать историю');
      }
    } catch (err) {
      btn.disabled = false;
      btn.textContent = 'Опубликовать';
      alert('Ошибка: ' + err.message);
    }
  };
}

document.getElementById('post-image').onchange = (e) => {
  const files = e.target.files;
  let container = document.getElementById('image-previews');
  if (container) container.remove();
  if (files && files.length > 0) {
    container = document.createElement('div');
    container.id = 'image-previews';
    container.className = 'image-previews';
    const carousel = document.createElement('div');
    carousel.className = 'post-carousel post-carousel-preview';
    const inner = document.createElement('div');
    inner.className = 'post-carousel-inner';
    const pagination = document.createElement('div');
    pagination.className = 'post-carousel-pagination';
    const prevBtn = document.createElement('button');
    prevBtn.type = 'button';
    prevBtn.className = 'post-carousel-arrow post-carousel-prev';
    prevBtn.innerHTML = '‹';
    prevBtn.setAttribute('aria-label', 'Previous preview');
    const nextBtn = document.createElement('button');
    nextBtn.type = 'button';
    nextBtn.className = 'post-carousel-arrow post-carousel-next';
    nextBtn.innerHTML = '›';
    nextBtn.setAttribute('aria-label', 'Next preview');
    let currentIndex = 0;
    const dots = [];
    const updatePreviewCarousel = () => {
      inner.style.transform = 'translateX(-' + (currentIndex * 100) + '%)';
      const multi = files.length > 1;
      prevBtn.classList.toggle('hidden', !multi || currentIndex === 0);
      nextBtn.classList.toggle('hidden', !multi || currentIndex >= files.length - 1);
      pagination.classList.toggle('hidden', !multi);
      dots.forEach((dot, dotIndex) => {
        dot.classList.toggle('active', dotIndex === currentIndex);
      });
    };

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const item = document.createElement('div');
      item.className = 'post-carousel-item';
      const img = document.createElement('img');
      img.alt = file.name || '';
      item.appendChild(img);
      inner.appendChild(item);

      const dot = document.createElement('button');
      dot.type = 'button';
      dot.className = 'post-carousel-dot';
      dot.setAttribute('aria-label', `Go to preview ${i + 1}`);
      dot.onclick = () => {
        currentIndex = i;
        updatePreviewCarousel();
      };
      pagination.appendChild(dot);
      dots.push(dot);

      const reader = new FileReader();
      reader.onload = (event) => {
        img.src = event.target.result;
      };
      reader.readAsDataURL(file);
    }

    prevBtn.onclick = () => {
      if (currentIndex > 0) {
        currentIndex--;
        updatePreviewCarousel();
      }
    };
    nextBtn.onclick = () => {
      if (currentIndex < files.length - 1) {
        currentIndex++;
        updatePreviewCarousel();
      }
    };

    carousel.appendChild(inner);
    carousel.appendChild(pagination);
    carousel.appendChild(prevBtn);
    carousel.appendChild(nextBtn);
    container.appendChild(carousel);
    updatePreviewCarousel();
    document.getElementById('post-content').parentElement.insertBefore(container, document.getElementById('post-content').nextElementSibling);
  }
};

let recordedVoiceBlob = null;
let mediaRecorder = null;
let recordStream = null;

function updateVoiceHint() {
  const hint = document.getElementById('audio-file-hint');
  const statusEl = document.getElementById('voice-record-status');
  if (recordedVoiceBlob) {
    if (hint) hint.textContent = t('voiceRecorded');
    if (statusEl) { statusEl.textContent = ''; statusEl.classList.add('hidden'); statusEl.classList.remove('recording', 'recorded'); }
  } else {
    const audioInput = document.getElementById('post-audio');
    if (audioInput.files.length) {
      if (hint) hint.textContent = audioInput.files[0].name;
    } else {
      if (hint) hint.remove();
    }
    if (statusEl) statusEl.classList.add('hidden');
  }
}

async function resizeImageFile(file, maxWidth = 1200, maxHeight = 1200) {
  return new Promise((resolve) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      let { width, height } = img;
      let scale = 1;
      if (width > maxWidth || height > maxHeight) {
        scale = Math.min(maxWidth / width, maxHeight / height);
        width = Math.round(width * scale);
        height = Math.round(height * scale);
      }
      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0, width, height);
      canvas.toBlob((blob) => {
        URL.revokeObjectURL(url);
        if (!blob) {
          resolve(file);
          return;
        }
        const resized = new File([blob], file.name, { type: blob.type || file.type });
        resolve(resized);
      }, file.type || 'image/jpeg', 0.9);
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      resolve(file);
    };
    img.src = url;
  });
}

document.getElementById('btn-audio').onclick = () => document.getElementById('post-audio').click();
document.getElementById('post-audio').onchange = (e) => {
  const file = e.target.files[0];
  recordedVoiceBlob = null;
=======
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
>>>>>>> 43fc63577f740ec07265f99ac0d4769620c4ae8c
  let hint = document.getElementById('audio-file-hint');
  if (hint) hint.remove();
  if (file) {
    hint = document.createElement('div');
    hint.id = 'audio-file-hint';
    hint.style.fontSize = '12px';
    hint.style.color = 'var(--muted)';
    hint.style.marginTop = '4px';
<<<<<<< HEAD
    hint.textContent = file.name;
    document.getElementById('post-content').parentElement.insertBefore(hint, document.getElementById('post-content').nextElementSibling);
  }
  updateVoiceHint();
=======
    hint.textContent = '🎵 ' + file.name;
    const mediaToolbar = document.querySelector('.post-media-toolbar');
    if (mediaToolbar && mediaToolbar.parentElement) {
      mediaToolbar.parentElement.insertBefore(hint, mediaToolbar);
    }
  }
>>>>>>> 43fc63577f740ec07265f99ac0d4769620c4ae8c
};

document.getElementById('btn-video').onclick = () => document.getElementById('post-video').click();
document.getElementById('post-video').onchange = (e) => {
<<<<<<< HEAD
  const files = e.target.files;
  let hint = document.getElementById('video-file-hint');
  if (hint) hint.remove();
  if (files && files.length > 0) {
=======
  const file = e.target.files[0];
  let hint = document.getElementById('video-file-hint');
  if (hint) hint.remove();
  if (file) {
>>>>>>> 43fc63577f740ec07265f99ac0d4769620c4ae8c
    hint = document.createElement('div');
    hint.id = 'video-file-hint';
    hint.style.fontSize = '12px';
    hint.style.color = 'var(--muted)';
    hint.style.marginTop = '4px';
<<<<<<< HEAD
    hint.textContent = files.length === 1 ? files[0].name : files.length + ' видео';
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
        hint.textContent = t('voiceRecorded');
        document.getElementById('post-audio').value = '';
      }
      if (statusEl) { statusEl.classList.add('hidden'); statusEl.textContent = ''; statusEl.classList.remove('recording', 'recorded'); }
      btn.title = t('recordVoiceTitle');
      btn.innerHTML = iconSprite('mic');
    };
    mediaRecorder.start(200);
    btn.innerHTML = iconSprite('stop');
    btn.title = t('stopRecord');
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

let aiGenerateMenuOpen = false;

document.getElementById('btn-ai-generate').onclick = () => {
  const menu = document.getElementById('ai-generate-menu');
  aiGenerateMenuOpen = !aiGenerateMenuOpen;
  if (aiGenerateMenuOpen) {
    menu.classList.remove('hidden');
  } else {
    menu.classList.add('hidden');
  }
};

document.getElementById('ai-generate-close').onclick = () => {
  const menu = document.getElementById('ai-generate-menu');
  menu.classList.add('hidden');
  aiGenerateMenuOpen = false;
};

document.querySelectorAll('.ai-style-btn').forEach(btn => {
  btn.onclick = () => {
    document.querySelectorAll('.ai-style-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
  };
});

document.getElementById('ai-generate-btn').onclick = async () => {
  if (!state.token) { showAlert(t('loginToPost')); return; }
  const promptInput = document.getElementById('ai-prompt-input');
  const generateBtn = document.getElementById('ai-generate-btn');
  const prompt = promptInput.value.trim();
  if (!prompt) { showAlert('Введите текст для генерации'); return; }

  const activeStyle = document.querySelector('.ai-style-btn.active');
  const style = activeStyle ? activeStyle.dataset.style : 'unusual';

  generateBtn.disabled = true;
  generateBtn.textContent = 'Генерация...';

  try {
    const res = await api.post('/ai/generate', { prompt, style, lang: state.lang }, state.token);
    if (res.result) {
      const postContent = document.getElementById('post-content');
      postContent.value = res.result;
      promptInput.value = '';
      document.getElementById('ai-generate-menu').classList.add('hidden');
      aiGenerateMenuOpen = false;
      postContent.focus();
    } else {
      showAlert(res.error || 'Ошибка генерации');
    }
  } catch (err) {
    showAlert('Ошибка генерации: ' + (err.message || 'Неизвестная ошибка'));
  } finally {
    generateBtn.disabled = false;
    generateBtn.textContent = 'Сгенерировать ✨';
=======
    hint.textContent = '🎬 ' + file.name;
    const mediaToolbar = document.querySelector('.post-media-toolbar');
    if (mediaToolbar && mediaToolbar.parentElement) {
      mediaToolbar.parentElement.insertBefore(hint, mediaToolbar);
    }
>>>>>>> 43fc63577f740ec07265f99ac0d4769620c4ae8c
  }
};

document.getElementById('btn-post').onclick = async () => {
  if (!state.token) { showAlert(t('loginToPost')); return; }
<<<<<<< HEAD
  const content = document.getElementById('post-content').value;
=======
  const contentInput = document.getElementById('post-content');
  const content = contentInput ? contentInput.value.trim() : '';
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
  
>>>>>>> 43fc63577f740ec07265f99ac0d4769620c4ae8c
  const imageInput = document.getElementById('post-image');
  const audioInput = document.getElementById('post-audio');
  const videoInput = document.getElementById('post-video');
  const hasImage = imageInput.files.length > 0;
<<<<<<< HEAD
  const hasAudio = !!recordedVoiceBlob || audioInput.files.length > 0;
  const hasVideo = videoInput.files.length > 0;
  if (!content && !hasImage && !hasAudio && !hasVideo) { showAlert(t('writeOrAddMedia')); return; }
=======
  const hasAudio = audioInput.files.length > 0;
  const hasVideo = videoInput.files.length > 0;
  if (!content && !hasImage && !hasAudio && !hasVideo && !poll) { showAlert(t('createPostRequired')); return; }

  const postBtn = document.getElementById('btn-post');
  if (postBtn) postBtn.classList.add('btn-loading');
>>>>>>> 43fc63577f740ec07265f99ac0d4769620c4ae8c
  
  try {
    let res;
    if (hasImage || hasAudio || hasVideo) {
      const formData = new FormData();
      formData.append('content', content);
<<<<<<< HEAD
      const resizedImages = [];
      for (let i = 0; i < imageInput.files.length; i++) {
        resizedImages.push(resizeImageFile(imageInput.files[i]));
      }
      const readyImages = await Promise.all(resizedImages);
      for (const f of readyImages) {
        formData.append('image', f);
      }
      if (recordedVoiceBlob) {
        const ext = (recordedVoiceBlob.type || '').includes('ogg') ? 'ogg' : 'webm';
        formData.append('audio', recordedVoiceBlob, 'voice.' + ext);
      } else if (audioInput.files.length) formData.append('audio', audioInput.files[0]);
      for (let i = 0; i < videoInput.files.length; i++) {
        formData.append('video', videoInput.files[i]);
      }
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
      const previews = document.getElementById('image-previews');
      if (previews) previews.remove();
=======
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
      if (contentInput) contentInput.value = '';
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
>>>>>>> 43fc63577f740ec07265f99ac0d4769620c4ae8c
      const audioHint = document.getElementById('audio-file-hint');
      if (audioHint) audioHint.remove();
      const videoHint = document.getElementById('video-file-hint');
      if (videoHint) videoHint.remove();
<<<<<<< HEAD
      updateVoiceHint();
      closeCreatePostComposer();
      loadPosts();
      showAlert(t('postPublished'));
    } else {
      showAlert(res.error || t('publishingError'));
    }
  } catch (err) {
    console.error('Error:', err);
    showAlert(t('publishingError') + ': ' + err.message);
=======
      loadPosts();
    } else {
      showAlert(res.error || 'Error publishing post');
    }
  } catch (err) {
    console.error('Error:', err);
    showAlert('Error publishing post: ' + err.message);
  } finally {
    if (postBtn) postBtn.classList.remove('btn-loading');
>>>>>>> 43fc63577f740ec07265f99ac0d4769620c4ae8c
  }
};

async function showProfile(userId) {
  const res = await api.get(`/users/${userId}`, state.token);
  if (!res.id) { showAlert(t('userNotFound')); return; }
<<<<<<< HEAD
  const modal = document.createElement('div'); modal.className='modal-root profile-fullpage';
  const card = document.createElement('div'); card.className='modal-card profile-page';
  const isOwnProfile = !!(state.token && state.user && String(state.user.id) === String(userId));
  const isPrivateProfile = !!(res.isPrivate || res.is_private);
  const canViewContent = isOwnProfile || !!res.canViewContent;
  let profileSettingsMenu = null;

  const topBar = document.createElement('div');
  topBar.className = 'profile-topbar';

  const topBarRight = document.createElement('div');
  topBarRight.className = 'profile-topbar-right';

  const close = document.createElement('button');
  close.type = 'button';
  close.className = 'profile-topbar-btn profile-close-btn';
  close.textContent = '✕';
  close.onclick = () => {
    modal.remove();
    if (state.nav.profileUserId === String(userId)) {
      state.nav.profileUserId = null;
      state.nav.postId = null;
      persistNavigationState();
      updateBreadcrumb();
    }
  };

  topBarRight.appendChild(close);
  topBar.appendChild(topBarRight);

  const header = document.createElement('div');
  header.className = 'profile-header';
  if (res.background) {
    header.classList.add('has-bg');
    header.style.backgroundImage = `linear-gradient(135deg, rgba(15,23,42,0.40), rgba(16,185,129,0.18)), url("${res.background}")`;
  }
  const headerGlow = document.createElement('div');
  headerGlow.className = 'profile-header-glow';
  header.appendChild(headerGlow);

  const headerInner = document.createElement('div');
  headerInner.className = 'profile-header-inner';

  const avatar = document.createElement('img');
  avatar.src = getAvatarUrl(res.avatar);
  avatar.className = 'profile-header-card-avatar';
  avatar.style.cursor = isOwnProfile ? 'pointer' : 'default';
  if (isOwnProfile) avatar.onclick = showAvatarUpload;

  const avatarStatus = document.createElement('div');
  avatarStatus.className = `profile-header-card-status ${res.isOnline ? 'online' : ''}`;

  const avatarWrap = document.createElement('div');
  avatarWrap.className = 'profile-header-card-avatar-wrap';
  if (isOwnProfile) {
    avatarWrap.classList.add('profile-header-card-avatar-wrap-own');
  }
  avatarWrap.appendChild(avatar);
  avatarWrap.appendChild(avatarStatus);

  const closeProfileMenu = () => {
    if (profileSettingsMenu) {
      profileSettingsMenu.classList.remove('visible');
    }
    if (profileMenuOverlay) {
      profileMenuOverlay.classList.remove('visible');
    }
  };

  let profileMenuOverlay = null;

  const reopenProfile = () => {
    modal.remove();
    showProfile(userId);
  };

  const addProfileMenuItem = (label, iconName, onClick, options = {}) => {
    if (!profileSettingsMenu) return;
    const item = document.createElement('button');
    item.type = 'button';
    item.className = `profile-avatar-menu-item${options.danger ? ' profile-avatar-menu-item-danger' : ''}`;
    item.innerHTML = `
      <span class="profile-avatar-menu-item-main">${iconWithText(iconName, label)}</span>
      ${options.meta ? `<span class="profile-avatar-menu-item-meta">${escapeHtml(options.meta)}</span>` : ''}
    `;
    item.onclick = async (e) => {
      e.stopPropagation();
      closeProfileMenu();
      await onClick();
    };
    profileSettingsMenu.appendChild(item);
  };

  if (isOwnProfile) {
    profileSettingsMenu = document.createElement('div');
    profileSettingsMenu.className = 'profile-avatar-menu';

    const menuTitle = document.createElement('div');
    menuTitle.className = 'profile-avatar-menu-title';
    menuTitle.innerHTML = formatUsername(res.username, res.badge);
    profileSettingsMenu.appendChild(menuTitle);

    addProfileMenuItem(t('changeAvatar'), 'image', () => {
      showAvatarUpload();
    });
    addProfileMenuItem(t('editProfile'), 'edit', () => {
      showEditProfile(res);
    });
    addProfileMenuItem(
      res.bio ? t('editDescription') : t('addDescription'),
      'message-circle',
      () => {
        showEditBio(res, (nextBio) => {
          res.bio = nextBio;
          reopenProfile();
        });
      }
    );
    addProfileMenuItem(t('createNewPost'), 'plus', () => {
      modal.remove();
      state.nav.profileUserId = null;
      state.nav.postId = null;
      switchPage('feed');
    });
    addProfileMenuItem(
      t('privateProfile'),
      'lock',
      async () => {
        const nextPrivate = !isPrivateProfile;
        const update = await api.put('/users/profile', { is_private: nextPrivate }, state.token);
        if (update && update.id) {
          updateCurrentUser(update);
          showAlert(t(nextPrivate ? 'privateProfileOn' : 'privateProfileOff'));
          reopenProfile();
        }
      },
      {
        meta: isPrivateProfile ? t('privateProfileOn') : t('privateProfileOff')
      }
    );

    const privateHint = document.createElement('div');
    privateHint.className = 'profile-avatar-menu-hint';
    privateHint.textContent = t('privateProfileHint');
    profileSettingsMenu.appendChild(privateHint);

    profileMenuOverlay = document.createElement('div');
    profileMenuOverlay.className = 'profile-avatar-menu-overlay';
    profileMenuOverlay.onclick = closeProfileMenu;

    const showProfileMenu = () => {
      console.log('showProfileMenu called, menu:', profileSettingsMenu, 'overlay:', profileMenuOverlay);
      profileSettingsMenu.classList.add('visible');
      profileMenuOverlay.classList.add('visible');
    };

    avatar.onclick = (e) => {
      e.stopPropagation();
      showProfileMenu();
    };
    avatarWrap.style.position = 'relative';
    document.body.appendChild(profileSettingsMenu);
    document.body.appendChild(profileMenuOverlay);
    profileSettingsMenu.onclick = (e) => e.stopPropagation();
  }

  const nameEl = document.createElement('div');
  nameEl.className = 'profile-header-card-name';
  nameEl.innerHTML = formatUsername(res.username, res.badge);

  const metaEl = document.createElement('div');
  metaEl.className = 'profile-header-card-meta';
  const presenceText = res.isOnline ? t('online') : t('offline');
  metaEl.innerHTML = `
    <span class="profile-header-card-meta-item">
      <span class="profile-header-card-status ${res.isOnline ? 'online' : ''}" style="position:relative;width:8px;height:8px;border-radius:50%;border:none;display:inline-block;${res.isOnline ? 'background:#22c55e' : 'background:#94a3b8'}"></span>
      ${presenceText}
    </span>
  `;

  const statsEl = document.createElement('div');
  statsEl.className = 'profile-header-card-stats';
  const followingCount = Number(res.followingCount || 0);
  const subscribersCount = Number(res.subscribers || 0);
  statsEl.innerHTML = `
    <button type="button" class="profile-header-card-stat" onclick="showProfileSubscribers(${userId}, '${escapeHtml(res.username)}')">
      <span class="profile-header-card-stat-value">${subscribersCount}</span>
      <span class="profile-header-card-stat-label">${t('subscribers')}</span>
    </button>
    <button type="button" class="profile-header-card-stat" onclick="showProfileSubscriptions(${userId}, '${escapeHtml(res.username)}')">
      <span class="profile-header-card-stat-value">${followingCount}</span>
      <span class="profile-header-card-stat-label">${t('following')}</span>
    </button>
  `;

  const leftCol = document.createElement('div');
  leftCol.className = 'profile-header-card-left';
  leftCol.appendChild(nameEl);
  if (res.bio) {
    const bioEl = document.createElement('div');
    bioEl.className = 'profile-header-card-meta-item';
    bioEl.style.marginTop = '4px';
    bioEl.textContent = res.bio;
    leftCol.appendChild(bioEl);
  }
  leftCol.appendChild(metaEl);

  const profileCard = document.createElement('div');
  profileCard.className = 'profile-header-card';
  profileCard.appendChild(avatarWrap);
  profileCard.appendChild(leftCol);
  profileCard.appendChild(statsEl);

  header.appendChild(profileCard);

  const actions = document.createElement('div');
  actions.className = 'profile-actions-shell';

  const actionsInner = document.createElement('div');
  actionsInner.className = 'profile-actions';

  const actionList = document.createElement('div');
  actionList.className = 'profile-action-list';
  
  if (!isOwnProfile && state.user && state.user.id !== userId) {
    if (!canViewContent && isPrivateProfile) {
      const requestViewBtn = document.createElement('button');
      requestViewBtn.type = 'button';
      requestViewBtn.className = 'profile-chip profile-chip-primary';
      requestViewBtn.textContent = res.viewRequestStatus === 'pending' ? t('requestViewPending') : t('requestViewAccess');
      requestViewBtn.disabled = res.viewRequestStatus === 'pending';
      requestViewBtn.onclick = async () => {
        const result = await submitProfileViewRequest(userId);
        if (result && result.requestStatus === 'pending') {
          modal.remove();
          showProfile(userId);
        }
      };
      actionList.appendChild(requestViewBtn);
    }

    const subscribeBtn = document.createElement('button');
    subscribeBtn.type = 'button';
    if (res.isSubscribed) {
      subscribeBtn.textContent = t('unsubscribe');
      subscribeBtn.className = 'profile-chip profile-chip-outline';
    } else if (res.subscribeRequestStatus === 'pending') {
      subscribeBtn.textContent = t('subscribeRequestPending');
      subscribeBtn.className = 'profile-chip profile-chip-outline';
      subscribeBtn.disabled = true;
    } else {
      subscribeBtn.textContent = isPrivateProfile ? t('requestSubscription') : t('subscribe');
      subscribeBtn.className = 'profile-chip profile-chip-primary';
    }
    subscribeBtn.onclick = async () => {
      if (res.isSubscribed) {
        const result = await api.post(`/unsubscribe/${userId}`, {}, state.token);
        if (result.subscribed !== undefined) {
          res.isSubscribed = false;
          modal.remove();
          showProfile(userId);
        }
        return;
      }
      const result = await submitSubscriptionRequest(userId);
      if (result) {
        modal.remove();
        showProfile(userId);
      }
    };
    actionList.appendChild(subscribeBtn);
  }
  
  if (actionList.childElementCount > 0) {
    actionsInner.appendChild(actionList);
    actions.appendChild(actionsInner);
  }

  const content = document.createElement('div');
  content.className = 'profile-content';

  const postsSection = document.createElement('section');
  postsSection.className = 'profile-section';

  const postsTitle = document.createElement('div');
  postsTitle.className = 'profile-section-title';
  const postsHeading = document.createElement('div');
  postsHeading.className = 'profile-section-heading';
  postsHeading.textContent = t('publishedPosts');
  const totalPosts = Array.isArray(res.posts) ? res.posts.length : 0;
  const postsCount = document.createElement('div');
  postsCount.className = 'profile-section-count';
  postsCount.textContent = String(totalPosts);
  postsTitle.appendChild(postsHeading);
  postsTitle.appendChild(postsCount);

  const postsList = document.createElement('div');
  postsList.id = 'profile-posts-container';
  postsList.className = 'profile-posts';

  if (!canViewContent && isPrivateProfile) {
    postsList.innerHTML = `<div class="profile-empty-state profile-empty-state-locked"><div class="profile-empty-emoji">${iconSprite('lock')}</div><div class="profile-empty-title">${escapeHtml(t('profileContentLocked'))}</div><div class="profile-empty-text">${escapeHtml(t('profileContentLockedText'))}</div></div>`;
  } else if (!res.posts || !res.posts.length) {
    console.log('No posts - res.posts:', res.posts, 'canViewContent:', canViewContent, 'isPrivateProfile:', isPrivateProfile);
    postsList.innerHTML = `<div class="profile-empty-state"><div class="profile-empty-emoji">${iconSprite('leaf')}</div><div class="profile-empty-title">${escapeHtml(t('publishedPosts'))}</div><div class="profile-empty-text">${escapeHtml(state.lang === 'ru' ? 'Пока здесь тихо. Когда появятся публикации, они будут показаны здесь.' : 'It is quiet here for now. Published posts will appear here.')}</div></div>`;
  }

  postsSection.appendChild(postsTitle);
  postsSection.appendChild(postsList);
  content.appendChild(postsSection);

  if (res.posts && res.posts.length) {
    console.log('Rendering posts after DOM insert');
    renderPostsInto(res.posts, postsList);
  }

  card.appendChild(topBar);
  card.appendChild(header);
  if (actions.childElementCount > 0) {
    card.appendChild(actions);
  }
  card.appendChild(content);

  modal.appendChild(card);
  modal.addEventListener('click', (e)=>{
    closeProfileMenu();
    if (e.target === modal) modal.remove();
  });
  document.body.prepend(modal);
  state.nav.profileUserId = String(userId);
  state.nav.postId = null;
  persistNavigationState();
  updateBreadcrumb();
  updateGlobalHomeButton();
}

async function showProfileSubscriptions(userId, username) {
  const { root, card } = makeModal(`
    <div class="profile-subscriptions-modal">
      <div class="profile-subscriptions-head">
        <div>
          <h2>${escapeHtml(t('following'))}</h2>
          <p class="muted">${escapeHtml(formatUsername(username || ''))}</p>
        </div>
      </div>
      <div class="profile-subscriptions-list profile-subscriptions-loading">${escapeHtml(state.lang === 'ru' ? 'Загружаем список подписок...' : 'Loading subscriptions...')}</div>
      <div class="actions">
        <button id="profile-subscriptions-close">${escapeHtml(t('cancel'))}</button>
      </div>
    </div>
  `);
  card.classList.add('profile-subscriptions-card');
  const list = root.querySelector('.profile-subscriptions-list');
  const closeBtn = root.querySelector('#profile-subscriptions-close');
  if (closeBtn) closeBtn.onclick = () => root.remove();
  try {
    const subscriptions = await api.get(`/users/${userId}/subscriptions`, state.token);
    if (!Array.isArray(subscriptions) || subscriptions.length === 0) {
      list.classList.remove('profile-subscriptions-loading');
      list.innerHTML = `<div class="profile-subscriptions-empty">${escapeHtml(t('noProfileSubscriptions'))}</div>`;
      return;
    }
    list.classList.remove('profile-subscriptions-loading');
    list.innerHTML = '';
    for (const item of subscriptions) {
      const row = document.createElement('button');
      row.type = 'button';
      row.className = 'profile-subscription-user';
      row.onclick = () => {
        root.remove();
        closeProfileModalIfAny();
        showProfile(item.id);
      };

      const avatar = document.createElement('img');
      avatar.className = 'profile-subscription-avatar';
      avatar.src = getAvatarUrl(item.avatar);
      avatar.alt = formatUsername(item.username, item.badge);

      const meta = document.createElement('div');
      meta.className = 'profile-subscription-meta';
      const name = document.createElement('div');
      name.className = 'profile-subscription-name';
      name.textContent = formatUsername(item.username, item.badge);
      const bio = document.createElement('div');
      bio.className = 'profile-subscription-bio';
      bio.textContent = item.bio || (state.lang === 'ru' ? 'Без описания' : 'No bio yet');
      meta.appendChild(name);
      meta.appendChild(bio);

      row.appendChild(avatar);
      row.appendChild(meta);
      list.appendChild(row);
    }
  } catch (err) {
    console.error(err);
    list.classList.remove('profile-subscriptions-loading');
    list.innerHTML = `<div class="profile-subscriptions-empty">${escapeHtml(t('errorLoadingSubscriptions'))}</div>`;
  }
}

async function showProfileSubscribers(userId, username) {
  const { root, card } = makeModal(`
    <div class="profile-subscriptions-modal">
      <div class="profile-subscriptions-head">
        <div>
          <h2>${escapeHtml(t('subscribers'))}</h2>
          <p class="muted">${escapeHtml(formatUsername(username || ''))}</p>
        </div>
      </div>
      <div class="profile-subscriptions-list profile-subscriptions-loading">${escapeHtml(state.lang === 'ru' ? 'Загружаем список подписчиков...' : 'Loading subscribers...')}</div>
      <div class="actions">
        <button id="profile-subscriptions-close">${escapeHtml(t('cancel'))}</button>
      </div>
    </div>
  `);
  card.classList.add('profile-subscriptions-card');
  const list = root.querySelector('.profile-subscriptions-list');
  const closeBtn = root.querySelector('#profile-subscriptions-close');
  if (closeBtn) closeBtn.onclick = () => root.remove();
  try {
    const subscribers = await api.get(`/users/${userId}/subscribers`, state.token);
    if (!Array.isArray(subscribers) || subscribers.length === 0) {
      list.classList.remove('profile-subscriptions-loading');
      list.innerHTML = `<div class="profile-subscriptions-empty">${escapeHtml(t('noProfileSubscribers'))}</div>`;
      return;
    }
    list.classList.remove('profile-subscriptions-loading');
    list.innerHTML = '';
    for (const item of subscribers) {
      const row = document.createElement('button');
      row.type = 'button';
      row.className = 'profile-subscription-user';
      row.onclick = () => {
        root.remove();
        closeProfileModalIfAny();
        showProfile(item.id);
      };

      const avatar = document.createElement('img');
      avatar.className = 'profile-subscription-avatar';
      avatar.src = getAvatarUrl(item.avatar);
      avatar.alt = formatUsername(item.username, item.badge);

      const meta = document.createElement('div');
      meta.className = 'profile-subscription-meta';
      const name = document.createElement('div');
      name.className = 'profile-subscription-name';
      name.textContent = formatUsername(item.username, item.badge);
      const bio = document.createElement('div');
      bio.className = 'profile-subscription-bio';
      bio.textContent = item.bio || (state.lang === 'ru' ? 'Без описания' : 'No bio yet');
      meta.appendChild(name);
      meta.appendChild(bio);

      row.appendChild(avatar);
      row.appendChild(meta);
      list.appendChild(row);
    }
  } catch (err) {
    console.error(err);
    list.classList.remove('profile-subscriptions-loading');
    list.innerHTML = `<div class="profile-subscriptions-empty">${escapeHtml(t('errorLoadingSubscribers'))}</div>`;
  }
}

function showAvatarUpload() {
  const { root } = makeModal(`<h2>${t('changeAvatar')}</h2><input id="avatar-file" type="file" accept="image/*"><button id="avatar-submit">${t('upload')}</button><button id="avatar-cancel">${t('cancel')}</button>`);
  document.getElementById('avatar-cancel').onclick = () => root.remove();
  document.getElementById('avatar-submit').onclick = async () => {
    const fileInput = document.getElementById('avatar-file');
    if (!fileInput.files || fileInput.files.length === 0) { showAlert(t('selectFile')); return; }
=======

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
>>>>>>> 43fc63577f740ec07265f99ac0d4769620c4ae8c
    const formData = new FormData();
    formData.append('avatar', fileInput.files[0]);
    const res = await api.postFormData('/users/avatar', formData, state.token);
    if (res.id) {
<<<<<<< HEAD
      updateCurrentUser(res);
      root.remove();
      loadPosts();
      showAlert(t('avatarUpdated'));
    } else {
      showAlert(res.error || t('uploadAvatarFailed'));
=======
      state.user.avatar = res.avatar;
      localStorage.setItem('user', JSON.stringify(state.user));
      renderHeaderUserAvatar();
      root.remove();
      loadPosts();
      showAlert('Avatar updated');
    } else {
      showAlert(res.error || 'Failed to upload avatar');
>>>>>>> 43fc63577f740ec07265f99ac0d4769620c4ae8c
    }
  };
}

<<<<<<< HEAD
function showEditBio(profileRes, onSaved) {
  const currentBio = (profileRes && profileRes.bio) || (state.user && state.user.bio) || '';
  const { root, card } = makeModal(`
    <h2>${currentBio ? t('editDescription') : t('addDescription')}</h2>
    <div class="muted" style="margin:0 0 8px 0">${t('bio')}</div>
    <textarea id="bio-edit-input" placeholder="${t('bio')}" style="width:100%;height:140px">${currentBio || ''}</textarea>
    <div class="actions">
      <button id="bio-edit-cancel">${t('cancel')}</button>
      <button id="bio-edit-save">${t('save')}</button>
    </div>
  `);
  root.style.zIndex = '10000';
  card.style.width = '420px';

  document.getElementById('bio-edit-cancel').onclick = () => root.remove();
  document.getElementById('bio-edit-save').onclick = async () => {
    const bioInput = document.getElementById('bio-edit-input');
    const desiredBio = String((bioInput && bioInput.value) || '').trim();
    if (!desiredBio) { showAlert(t('bioRequired')); return; }
    try {
      const rBio = await api.put('/users/profile', { bio: desiredBio }, state.token);
      if (rBio && rBio.id) {
        updateCurrentUser(rBio);
        if (typeof onSaved === 'function') onSaved(rBio.bio);
        root.remove();
        loadPosts();
        showAlert(t('bioUpdated'));
      } else {
        showAlert((rBio && rBio.error) || 'Error');
      }
    } catch (e) {
      showAlert(e.message || 'Error');
    }
  };
}

function showEditProfile(profileRes) {
  const currentName = (profileRes && profileRes.username) || (state.user && state.user.username) || '';
  const currentBio = (profileRes && profileRes.bio) || (state.user && state.user.bio) || '';
  const { root, card } = makeModal(`
    <h2>${t('editProfile')}</h2>
    <div class="muted" style="margin-bottom:10px">${t('changeUsername')}</div>
    <input id="ep-username" placeholder="${t('usernamePlaceholder')}" value="${String(currentName).replace(/"/g,'&quot;')}">
    <div id="ep-username-status" class="muted" style="margin:-2px 0 10px 0;font-size:12px"></div>

    <div class="muted" style="margin:8px 0 8px 0">${t('changeAvatar')}</div>
    <input id="ep-avatar" type="file" accept="image/*">
    <button id="ep-avatar-upload" type="button" style="margin-bottom:8px">${t('upload')}</button>

    <div class="muted" style="margin:8px 0 4px 0">${t('changeBackground')}</div>
    <div class="muted" style="margin:0 0 4px 0;font-size:12px;color:var(--muted)">
      Рекомендуемый размер фона: ${PROFILE_BG_MIN_WIDTH}×${PROFILE_BG_MIN_HEIGHT}px
    </div>
    <input id="ep-bg" type="file" accept="image/*">
    <button id="ep-bg-upload" type="button" style="margin-bottom:8px">${t('upload')}</button>

    <div class="muted" style="margin:8px 0 8px 0">${t('bio')}</div>
    <textarea id="ep-bio" placeholder="${t('bio')}" style="width:100%;height:80px">${currentBio || ''}</textarea>
    <div class="actions">
      <button id="ep-cancel">${t('cancel')}</button>
      <button id="ep-save">${t('save')}</button>
    </div>
  `);
  // Делает модалку редактирования поверх модалки профиля
  root.style.zIndex = '10000';
  card.style.width = '420px';

  const usernameInput = document.getElementById('ep-username');
  const usernameStatus = document.getElementById('ep-username-status');
  let lastCheck = 0;
  let lastAvailable = null;

  async function checkUsernameAvailability(value) {
    const name = String(value || '').trim();
    if (!name) {
      usernameStatus.textContent = '';
      lastAvailable = null;
      return;
    }
    const myName = (state.user && state.user.username) || '';
    if (name.toLowerCase() === String(myName).toLowerCase()) {
      usernameStatus.textContent = '';
      lastAvailable = true;
      return;
    }
    const stamp = Date.now();
    lastCheck = stamp;
    try {
      const r = await api.get(`/users/check-username?username=${encodeURIComponent(name)}`, state.token);
      if (lastCheck !== stamp) return;
      lastAvailable = !!r.available;
      usernameStatus.textContent = lastAvailable ? t('usernameAvailable') : t('usernameTaken');
      usernameStatus.style.color = lastAvailable ? 'var(--green-700)' : '#ef4444';
    } catch (e) {
      if (lastCheck !== stamp) return;
      usernameStatus.textContent = '';
      lastAvailable = null;
    }
  }

  let debounceTimer = null;
  if (usernameInput) {
    usernameInput.addEventListener('input', () => {
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(() => checkUsernameAvailability(usernameInput.value), 350);
    });
    checkUsernameAvailability(usernameInput.value);
  }

  document.getElementById('ep-cancel').onclick = () => root.remove();

  document.getElementById('ep-avatar-upload').onclick = async () => {
    const fileInput = document.getElementById('ep-avatar');
    if (!fileInput.files || fileInput.files.length === 0) { showAlert(t('selectFile')); return; }
    const formData = new FormData();
    formData.append('avatar', fileInput.files[0]);
    const r = await api.postFormData('/users/avatar', formData, state.token);
    if (r && r.id) {
      updateCurrentUser(r);
      showAlert(t('avatarUpdated'));
      loadPosts();
    } else {
      showAlert((r && r.error) || t('uploadAvatarFailed'));
    }
  };

  document.getElementById('ep-bg-upload').onclick = async () => {
    const fileInput = document.getElementById('ep-bg');
    if (!fileInput.files || fileInput.files.length === 0) { showAlert(t('selectFile')); return; }
    const file = fileInput.files[0];
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = async () => {
      const w = img.naturalWidth;
      const h = img.naturalHeight;
      URL.revokeObjectURL(url);
      if (w < PROFILE_BG_MIN_WIDTH || h < PROFILE_BG_MIN_HEIGHT) {
        showAlert(`Минимальный размер фона: ${PROFILE_BG_MIN_WIDTH}×${PROFILE_BG_MIN_HEIGHT}px. Вы выбрали ${w}×${h}px.`);
        return;
      }
      const formData = new FormData();
      formData.append('background', file);
      const r = await api.postFormData('/users/background', formData, state.token);
      if (r && r.id) {
        updateCurrentUser(r);
        showAlert(t('backgroundUpdated'));
      } else {
        showAlert((r && r.error) || t('uploadBackgroundFailed'));
      }
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      showAlert('Не удалось прочитать изображение. Попробуйте другой файл.');
    };
    img.src = url;
  };

  document.getElementById('ep-save').onclick = async () => {
    const desiredUsername = (document.getElementById('ep-username').value || '').trim();
    const desiredBio = (document.getElementById('ep-bio').value || '').trim();
    if (!desiredBio) { showAlert(t('bioRequired')); return; }

    try {
      // Update bio first
      const rBio = await api.put('/users/profile', { bio: desiredBio }, state.token);
      if (rBio && rBio.id) {
        updateCurrentUser(rBio);
      }

      const current = (state.user && state.user.username) || '';
      if (desiredUsername && desiredUsername.toLowerCase() !== String(current).toLowerCase()) {
        if (lastAvailable === false) { showAlert(t('usernameTaken')); return; }
        const rName = await api.put('/users/username', { username: desiredUsername }, state.token);
        if (rName && rName.token) {
          setAuth(rName.token, { username: rName.username, id: rName.id, avatar: rName.avatar, bio: rName.bio, background: rName.background });
        } else if (rName && rName.error) {
          showAlert(t(rName.error) || rName.error);
          return;
        }
      }

      root.remove();
      showAlert(t('bioUpdated'));
    } catch (e) {
      showAlert(e.message || 'Error');
=======
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
>>>>>>> 43fc63577f740ec07265f99ac0d4769620c4ae8c
    }
  };
}

<<<<<<< HEAD
// (removed) create-new-profile flow replaced by "create new post" button in profile

function getNotificationMessage(notification) {
  if (!notification) return '';
  if (notification.type === 'subscribe') {
    return ` ${t('subscribedYou')}`;
  }
  if (notification.type === 'new_post') {
    let message = ` ${t('postedNew')}`;
    if (notification.post_content) {
      message += `: "${notification.post_content.substring(0, 60)}${notification.post_content.length > 60 ? '...' : ''}"`;
    }
    return message;
  }
  if (notification.type === 'content_request') {
    return ` ${t('requestedViewAccess')}`;
  }
  if (notification.type === 'subscribe_request') {
    return ` ${t('requestedSubscription')}`;
  }
  if (notification.type === 'comment_like') {
    return ` liked your comment`;
  }
  if (notification.type === 'story_like') {
    return ` liked your story`;
  }
  if (notification.type === 'story_comment') {
    return ` commented on your story`;
  }
  if (notification.type === 'comment_reply') {
    return ` replied to your comment`;
  }
  if (notification.type === 'request_approved') {
    return notification.request_type === 'subscribe'
      ? ` ${t('requestApprovedSubscribe')}`
      : ` ${t('requestApprovedView')}`;
  }
  if (notification.type === 'request_rejected') {
    return notification.request_type === 'subscribe'
      ? ` ${t('requestRejectedSubscribe')}`
      : ` ${t('requestRejectedView')}`;
  }
  return '';
}

function appendNotificationRequestActions(notification, target, onDone) {
  if (!notification || !target) return;
  const actionable = (notification.type === 'content_request' || notification.type === 'subscribe_request')
    && notification.request_id
    && notification.request_status === 'pending';
  if (!actionable) return;

  const actions = document.createElement('div');
  actions.className = 'notif-request-actions';

  const approveBtn = document.createElement('button');
  approveBtn.type = 'button';
  approveBtn.className = 'notif-request-btn accept';
  approveBtn.textContent = t('approve');
  approveBtn.onclick = async (e) => {
    e.stopPropagation();
    await respondToAccessRequest(notification.request_id, true);
    if (typeof onDone === 'function') onDone();
  };

  const rejectBtn = document.createElement('button');
  rejectBtn.type = 'button';
  rejectBtn.className = 'notif-request-btn decline';
  rejectBtn.textContent = t('reject');
  rejectBtn.onclick = async (e) => {
    e.stopPropagation();
    await respondToAccessRequest(notification.request_id, false);
    if (typeof onDone === 'function') onDone();
  };

  actions.appendChild(approveBtn);
  actions.appendChild(rejectBtn);
  target.appendChild(actions);
}

=======
>>>>>>> 43fc63577f740ec07265f99ac0d4769620c4ae8c
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
<<<<<<< HEAD
      avatar.src = getAvatarUrl(n.avatar);
=======
      avatar.src = n.avatar;
>>>>>>> 43fc63577f740ec07265f99ac0d4769620c4ae8c
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
      
<<<<<<< HEAD
      const msgSpan = document.createElement('span');
      msgSpan.textContent = getNotificationMessage(n);
=======
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
>>>>>>> 43fc63577f740ec07265f99ac0d4769620c4ae8c
      
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
<<<<<<< HEAD
      appendNotificationRequestActions(n, textDiv, () => {
        modal.remove();
        showNotifications();
      });
=======
>>>>>>> 43fc63577f740ec07265f99ac0d4769620c4ae8c
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
<<<<<<< HEAD
  document.body.prepend(modal);
=======
  document.body.appendChild(modal);
>>>>>>> 43fc63577f740ec07265f99ac0d4769620c4ae8c

  // Обновляем индикатор на вкладке уведомлений
  const unreadCount = notifications.filter(n => !n.is_read).length;
  updateNotificationsTab(unreadCount);
}

<<<<<<< HEAD
async function loadNotificationsPage() {
  const container = document.getElementById('notifications-container');
=======
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
  
>>>>>>> 43fc63577f740ec07265f99ac0d4769620c4ae8c
  if (!container) {
    console.error('notifications-container not found');
    return;
  }
<<<<<<< HEAD
  showPageLoaderIfEmpty('notifications-container', getLoaderMessage('notifications'));
  try {
    const response = await api.get('/notifications', state.token);
    const notifications = Array.isArray(response) ? response : [];
    syncNotificationsState(notifications, { allowToasts: false });
    container.innerHTML = '';

    const unreadCount = notifications.filter(n => !n.is_read).length;
    updateNotificationsTab(unreadCount);

    if (notifications.length === 0) {
      const emptyMsg = document.createElement('div');
      emptyMsg.style.textAlign = 'center';
      emptyMsg.style.padding = '40px 20px';
      emptyMsg.style.color = 'var(--muted)';
      emptyMsg.innerHTML = `<div class="empty-state-icon">${iconSprite('inbox')}</div><p>${t('noNotifications')}</p>`;
      container.appendChild(emptyMsg);
      settlePageLoader('notifications-container');
      return;
    }

    if (notifications.some(n => !n.is_read)) {
      const markAllBtn = document.createElement('button');
      markAllBtn.textContent = t('markAllAsRead');
      markAllBtn.className = 'btn-primary';
      markAllBtn.style.marginBottom = '20px';
      markAllBtn.style.alignSelf = 'flex-start';
      markAllBtn.style.marginLeft = '20px';
      markAllBtn.onclick = async () => {
        await api.post('/notifications/mark-all-read', {}, state.token);
        loadNotificationsPage();
      };
      container.appendChild(markAllBtn);
    }

    const timeline = document.createElement('div');
    timeline.className = 'notifications-timeline';
    container.appendChild(timeline);

    for (const n of notifications) {
      const notifDiv = document.createElement('div');
      notifDiv.className = 'notif-item' + (n.is_read ? '' : ' unread');

      const dot = document.createElement('div');
      dot.className = 'notif-dot' + (n.is_read ? '' : ' unread');
      notifDiv.appendChild(dot);

      const avatar = document.createElement('img');
      avatar.src = getAvatarUrl(n.avatar);
      avatar.className = 'notif-avatar';
      avatar.onclick = (e) => { e.stopPropagation(); showProfile(n.from_user_id); };

      const textDiv = document.createElement('div');
      textDiv.className = 'notif-content';

      const text = document.createElement('div');
      text.className = 'notif-text';

      const userName = document.createElement('strong');
      userName.textContent = formatUsername(n.username);
      userName.onclick = (e) => { e.stopPropagation(); showProfile(n.from_user_id); };

      const msgSpan = document.createElement('span');
      msgSpan.textContent = getNotificationMessage(n);
      if (n.type === 'new_post') {
        msgSpan.className = 'notif-post-link';
        msgSpan.title = t('viewInSubscriptions') || 'View in Subscriptions';
        msgSpan.onclick = (e) => { e.stopPropagation(); switchPage('notifications'); };
      }

      const time = document.createElement('small');
      time.className = 'notif-time';
      time.textContent = new Date(n.created_at).toLocaleString();

      text.appendChild(userName);
      text.appendChild(document.createTextNode(' '));
      text.appendChild(msgSpan);
      textDiv.appendChild(text);
      textDiv.appendChild(time);
      appendNotificationRequestActions(n, textDiv, () => loadNotificationsPage());

      if (!n.is_read) {
        const markBtn = document.createElement('button');
        markBtn.className = 'notif-mark-btn';
        markBtn.textContent = '✓';
        markBtn.onclick = async (e) => {
          e.stopPropagation();
          await api.post(`/notifications/${n.id}/read`, {}, state.token);
          loadNotificationsPage();
        };
        notifDiv.appendChild(markBtn);
      }

      notifDiv.appendChild(avatar);
      notifDiv.appendChild(textDiv);
      timeline.appendChild(notifDiv);
    }
    settlePageLoader('notifications-container');
  } catch (err) {
    container.innerHTML = `<div class="card" style="padding:24px;text-align:center"><div class="muted">${escapeHtml(state.lang === 'ru' ? 'Не удалось загрузить уведомления.' : 'Failed to load notifications.')}</div></div>`;
    settlePageLoader('notifications-container');
=======
  
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
      const text = `${t('messages')}: +${diff}`;
      showToast(text);
    }
    lastUnreadMessagesCount = count;
  } catch (e) {
    console.error('Failed to check messages for toasts', e);
>>>>>>> 43fc63577f740ec07265f99ac0d4769620c4ae8c
  }
}

function updateNotificationsTab(count) {
  const notificationsTab = document.getElementById('tab-notifications');
  if (!notificationsTab) return;
<<<<<<< HEAD
  setBottomNavIcon(notificationsTab, 'bell', { label: t('notifications'), showUnreadDot: !!(count && count > 0) });
  updateBottomNavLabels();
=======
  const label = t('notifications');
  if (count && count > 0) {
    notificationsTab.textContent = `🔔 ${label} (${count})`;
    notificationsTab.classList.add('has-unread');
  } else {
    notificationsTab.textContent = `🪧 ${label}`;
    notificationsTab.classList.remove('has-unread');
  }
>>>>>>> 43fc63577f740ec07265f99ac0d4769620c4ae8c
}

async function refreshNotificationsIndicator() {
  if (!state.token) {
<<<<<<< HEAD
    resetNotificationTracking();
=======
>>>>>>> 43fc63577f740ec07265f99ac0d4769620c4ae8c
    updateNotificationsTab(0);
    return;
  }
  try {
    const response = await api.get('/notifications', state.token);
    const notifications = Array.isArray(response) ? response : [];
<<<<<<< HEAD
    const { unreadCount, freshNotifications } = syncNotificationsState(notifications, {
      allowToasts: document.visibilityState === 'visible' && state.currentPage !== 'notifications'
    });
    updateNotificationsTab(unreadCount);
    if (freshNotifications.length) {
      showNotificationToasts(freshNotifications);
    }
    if (state.currentPage === 'notifications') {
      loadNotificationsPage();
    }
=======
    const unreadCount = notifications.filter(n => !n.is_read).length;
    updateNotificationsTab(unreadCount);
>>>>>>> 43fc63577f740ec07265f99ac0d4769620c4ae8c
  } catch (err) {
    console.error('Failed to refresh notifications indicator', err);
  }
}

<<<<<<< HEAD
function stopNotificationsPolling() {
  if (window._notificationsPollTimer) {
    clearInterval(window._notificationsPollTimer);
    window._notificationsPollTimer = null;
  }
}

function startNotificationsPolling() {
  stopNotificationsPolling();
  if (!state.token) return;

  window._notificationsPollTimer = setInterval(() => {
    if (document.visibilityState !== 'hidden') refreshNotificationsIndicator();
  }, NOTIFICATIONS_POLL_INTERVAL_MS);

  if (!window._notificationsVisibilityListenerAttached) {
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'visible') refreshNotificationsIndicator();
    });
    window._notificationsVisibilityListenerAttached = true;
=======
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
      empty.textContent = t('startChat');
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
>>>>>>> 43fc63577f740ec07265f99ac0d4769620c4ae8c
  }
}

// language and theme wiring
const langSelect = document.getElementById('lang-select');
if (langSelect) {
  langSelect.value = state.lang;
  langSelect.onchange = () => {
    state.lang = langSelect.value;
    localStorage.setItem('lang', state.lang);
<<<<<<< HEAD
    applyStaticI18n();
    renderAuth();
    if (state.currentPage === 'tree') loadTreePage();
    else loadPosts();
=======
    renderAuth();
    loadPosts();
    applyUiText();
    refreshNotificationsIndicator();
    refreshMessagesIndicator();
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
>>>>>>> 43fc63577f740ec07265f99ac0d4769620c4ae8c
  };
}

const themeBtn = document.getElementById('theme-toggle');
const savedTheme = localStorage.getItem('theme') || 'light';
applyTheme(savedTheme);
if (themeBtn) {
<<<<<<< HEAD
  themeBtn.innerHTML = iconSprite(savedTheme === 'dark' ? 'sun' : 'moon');
  themeBtn.onclick = () => {
    const next = (localStorage.getItem('theme') === 'dark') ? 'light' : 'dark';
    applyTheme(next);
    themeBtn.innerHTML = iconSprite(next === 'dark' ? 'sun' : 'moon');
  };
}

const e2eCopyBtn = document.getElementById('e2e-copy-key');
if (e2eCopyBtn) {
  e2eCopyBtn.onclick = async () => {
    try {
      const publicKeyJwk = await E2EEncryption.getPublicKeyJwk();
      const keyString = JSON.stringify(publicKeyJwk);
      await navigator.clipboard.writeText(keyString);
      showAlert(t('e2eKeyCopied'));
    } catch (e) {
      showAlert('Failed to copy key');
=======
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
>>>>>>> 43fc63577f740ec07265f99ac0d4769620c4ae8c
    }
  };
}

<<<<<<< HEAD
// settings popover (language + theme)
const settingsBtn = document.getElementById('settings-btn');
const settingsMenu = document.getElementById('settings-menu');
function setSettingsOpen(open) {
  if (!settingsBtn || !settingsMenu) return;
  if (open) {
    settingsMenu.classList.remove('hidden');
    settingsBtn.setAttribute('aria-expanded', 'true');
  } else {
    settingsMenu.classList.add('hidden');
    settingsBtn.setAttribute('aria-expanded', 'false');
  }
}
if (settingsBtn && settingsMenu) {
  settingsBtn.onclick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const isOpen = !settingsMenu.classList.contains('hidden');
    setSettingsOpen(!isOpen);
  };
  settingsMenu.onclick = (e) => {
    // keep menu open when interacting inside
    e.stopPropagation();
  };
  document.addEventListener('click', () => {
    setSettingsOpen(false);
    setAuthMenuOpen(false);
    setCreateMenuOpen(false);
    closePostEditMenu();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      setSettingsOpen(false);
      setAuthMenuOpen(false);
      setCreateMenuOpen(false);
      closePostEditMenu();
    }
=======
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
      input.placeholder = `${t('pollOptionPlaceholder')} ${inputs.length + 1}`;
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
    <h2>${t('storyTitle')}</h2>
    <p class="muted" style="font-size:13px;margin-top:4px">
      ${t('storySubtitle')}
    </p>
    <div style="display:flex;flex-direction:column;align-items:center;margin:12px 0;">
      <button id="story-record-btn" type="button" class="btn-primary" style="width:64px;height:64px;border-radius:999px;display:flex;align-items:center;justify-content:center;font-size:28px;padding:0">
        🎤
      </button>
      <span id="story-record-status" class="voice-status hidden" style="margin-top:8px"></span>
    </div>
    <textarea id="story-text" placeholder="${t('storyTextPlaceholder')}" style="min-height:60px"></textarea>
    <div class="actions">
      <button data-role="cancel">${t('cancel')}</button>
      <button data-role="create" class="btn-primary">${t('share')}</button>
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
        showAlert(t('recordVoiceFirst'));
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
        showAlert(e.message || t('storyCreateFailed'));
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
>>>>>>> 43fc63577f740ec07265f99ac0d4769620c4ae8c
  });
}

// Set up tab switching
const feedTab = document.getElementById('tab-feed');
if (feedTab) {
<<<<<<< HEAD
  setBottomNavIcon(feedTab, 'home', { label: t('home') });
  feedTab.onclick = () => switchPage('feed');
}

const treeTab = document.getElementById('tab-tree');
if (treeTab) {
  setBottomNavIcon(treeTab, 'tree', { label: t('tree') });
  treeTab.onclick = () => switchPage('tree');
}

const logoImg = document.querySelector('.site-brand-image');
if (logoImg) {
  logoImg.onclick = () => switchPage('feed');
}

const chatsTab = document.getElementById('tab-chats');
if (chatsTab) {
  setBottomNavIcon(chatsTab, 'chat', { label: t('messages') });
  chatsTab.onclick = () => switchPage('chats');
=======
  feedTab.textContent = `📰 ${t('feed')}`;
  feedTab.onclick = () => switchPage('feed');
}

const subscriptionsTab = document.getElementById('tab-subscriptions');
if (subscriptionsTab) {
  subscriptionsTab.textContent = `🧑‍🤝‍🧑 ${t('subscriptions')}`;
  subscriptionsTab.onclick = () => switchPage('subscriptions');
>>>>>>> 43fc63577f740ec07265f99ac0d4769620c4ae8c
}

const notificationsTab = document.getElementById('tab-notifications');
if (notificationsTab) {
<<<<<<< HEAD
  setBottomNavIcon(notificationsTab, 'bell', { label: t('notifications') });
  notificationsTab.onclick = () => switchPage('notifications');
}
const headerNewsBtn = document.getElementById('header-news-btn');
if (headerNewsBtn) {
  headerNewsBtn.onclick = () => switchPage('news');
}
updateBottomNavLabels();
=======
  notificationsTab.textContent = `🪧 ${t('notifications')}`;
  notificationsTab.onclick = () => switchPage('notifications');
}

const messagesTab = document.getElementById('tab-messages');
if (messagesTab) {
  messagesTab.textContent = `💬 ${t('messages')}`;
  messagesTab.onclick = () => switchPage('messages');
}
>>>>>>> 43fc63577f740ec07265f99ac0d4769620c4ae8c

const voiceRecordBtn = document.getElementById('btn-voice-record');
if (voiceRecordBtn) {
  voiceRecordBtn.title = t('recordVoiceTitle');
  if (typeof MediaRecorder === 'undefined') voiceRecordBtn.style.display = 'none';
}

<<<<<<< HEAD
const mediaToggleBtn = document.getElementById('btn-media-toggle');
const mediaTools = document.getElementById('post-media-tools');
if (mediaToggleBtn && mediaTools) {
  mediaToggleBtn.onclick = () => {
    mediaTools.classList.toggle('hidden');
  };
}

function applyStaticI18n() {
  const postContent = document.getElementById('post-content');
  if (postContent) postContent.placeholder = t('postPlaceholder');
  const newsContent = document.getElementById('news-content');
  if (newsContent) newsContent.placeholder = t('siteNewsPlaceholder');
  const siteNewsTitle = document.getElementById('site-news-title');
  if (siteNewsTitle) siteNewsTitle.textContent = t('siteNews');
  const siteNewsCaption = document.getElementById('site-news-caption');
  if (siteNewsCaption) siteNewsCaption.textContent = t('siteNewsCaption');
  const treePageTitle = document.getElementById('tree-page-title');
  if (treePageTitle) treePageTitle.textContent = t('treeTitle');
  const treePageCaption = document.getElementById('tree-page-caption');
  if (treePageCaption) treePageCaption.textContent = t('treeCaption');
  const treeAddCommunityBtn = document.getElementById('tree-add-community');
  if (treeAddCommunityBtn) treeAddCommunityBtn.title = t('treeAddCommunity');
  const treePostContent = document.getElementById('tree-post-content');
  if (treePostContent) treePostContent.placeholder = t('postPlaceholder');
  const treeSubmitPost = document.getElementById('tree-submit-post');
  if (treeSubmitPost) treeSubmitPost.innerHTML = iconSprite('send');
  renderCreateMenu();

  const siteSearchTitle = document.getElementById('site-search-title');
  if (siteSearchTitle) {
    siteSearchTitle.textContent = '';
    siteSearchTitle.style.display = 'none';
  }
  const siteSearchCaption = document.getElementById('site-search-caption');
  if (siteSearchCaption) {
    siteSearchCaption.textContent = '';
    siteSearchCaption.style.display = 'none';
  }
  const siteSearchInput = document.getElementById('site-search-input');
  if (siteSearchInput) siteSearchInput.placeholder = t('searchPlaceholder');
  const siteSearchSubmit = document.getElementById('site-search-submit');
  if (siteSearchSubmit) siteSearchSubmit.textContent = t('searchSubmit');
  const channelSearchTitle = document.getElementById('channel-search-title');
  if (channelSearchTitle) channelSearchTitle.textContent = t('channelSearchTitle');
  const channelSearchCaption = document.getElementById('channel-search-caption');
  if (channelSearchCaption) channelSearchCaption.textContent = t('channelSearchCaption');
  const channelSearchInput = document.getElementById('channel-search-input');
  if (channelSearchInput) channelSearchInput.placeholder = t('channelSearchPlaceholder');
  const channelSearchSubmit = document.getElementById('channel-search-submit');
  if (channelSearchSubmit) channelSearchSubmit.textContent = t('searchSubmit');

  const settingsBtn = document.getElementById('settings-btn');
  if (settingsBtn) settingsBtn.title = t('settings');
  const languageLabel = document.getElementById('settings-language-label');
  if (languageLabel) languageLabel.textContent = t('language');
  const themeLabel = document.getElementById('settings-theme-label');
  if (themeLabel) themeLabel.textContent = t('theme');

  const themeToggle = document.getElementById('theme-toggle');
  if (themeToggle) themeToggle.title = t('toggleTheme');

  const homeLink = document.getElementById('home-link');
  if (homeLink) homeLink.textContent = t('home');

  const footerCreated = document.getElementById('footer-created');
  if (footerCreated) {
    footerCreated.textContent = state.lang === 'ru'
      ? 'Создано blau3 и Komi'
      : 'created by blau3 and Komi';
  }
  const supportBtn = document.getElementById('support-btn');
  if (supportBtn) {
    supportBtn.textContent = t('support');
    supportBtn.onclick = showSupportModal;
  }

  const mediaToggle = document.getElementById('btn-media-toggle');
  if (mediaToggle) {
    mediaToggle.title = t('addMedia');
    mediaToggle.innerHTML = iconSprite('plus');
  }

  const btnImage = document.getElementById('btn-image');
  if (btnImage) {
    btnImage.title = t('addImage');
    btnImage.innerHTML = iconSprite('image');
  }
  const btnAudio = document.getElementById('btn-audio');
  if (btnAudio) {
    btnAudio.title = t('addAudio');
    btnAudio.innerHTML = iconSprite('audio');
  }
  const btnVideo = document.getElementById('btn-video');
  if (btnVideo) {
    btnVideo.title = t('addVideo');
    btnVideo.innerHTML = iconSprite('video');
  }
  const btnVoice = document.getElementById('btn-voice-record');
  if (btnVoice) {
    btnVoice.title = t('recordVoiceTitle');
    if (!btnVoice.dataset.recording) btnVoice.innerHTML = iconSprite('mic');
  }
  const btnPost = document.getElementById('btn-post');
  if (btnPost) btnPost.innerHTML = iconSprite('send');
  const btnNewsPost = document.getElementById('btn-news-post');
  if (btnNewsPost) {
    btnNewsPost.innerHTML = iconWithText('send', t('publishSiteNews'));
    btnNewsPost.classList.toggle('hidden', !(state.user && state.user.username === 'blau3'));
  }
  const settingsButton = document.getElementById('settings-btn');
  if (settingsButton) settingsButton.innerHTML = iconSprite('settings');
  const createNewsCard = document.getElementById('create-news');
  if (createNewsCard) createNewsCard.classList.toggle('hidden', !(state.user && state.user.username === 'blau3'));
  const newsButton = document.getElementById('header-news-btn');
  if (newsButton) newsButton.title = t('siteNews');

  const langSelectEl = document.getElementById('lang-select');
  if (langSelectEl) {
    const optRu = langSelectEl.querySelector('option[value="ru"]');
    const optEn = langSelectEl.querySelector('option[value="en"]');
    if (optRu) optRu.textContent = t('languageRussian');
    if (optEn) optEn.textContent = t('languageEnglish');
  }

  const feedTab = document.getElementById('tab-feed');
  if (feedTab) setBottomNavIcon(feedTab, 'home', { label: t('home') });
  const treeTab = document.getElementById('tab-tree');
  if (treeTab) setBottomNavIcon(treeTab, 'tree', { label: t('tree') });
  const chatsTab = document.getElementById('tab-chats');
  if (chatsTab) setBottomNavIcon(chatsTab, 'chat', { label: t('messages') });
  refreshNotificationsIndicator();
  updateBottomNavLabels();
  updateBreadcrumb();

  updateGlobalHomeButton();
  renderSiteSearchResults();
  renderChannelSearchResults();
}

const siteSearchForm = document.getElementById('site-search-form');
if (siteSearchForm) {
  siteSearchForm.addEventListener('submit', (event) => {
    event.preventDefault();
    submitSiteSearch();
  });
}

const siteSearchClearBtn = document.getElementById('site-search-clear');
if (siteSearchClearBtn) {
  siteSearchClearBtn.onclick = clearSiteSearch;
}

const channelSearchForm = document.getElementById('channel-search-form');
if (channelSearchForm) {
  channelSearchForm.addEventListener('submit', (event) => {
    event.preventDefault();
    submitChannelSearch();
  });
}

const channelSearchClearBtn = document.getElementById('channel-search-clear');
if (channelSearchClearBtn) {
  channelSearchClearBtn.onclick = clearChannelSearch;
}

const navCreateBtn = document.getElementById('nav-create');
if (navCreateBtn) {
  navCreateBtn.innerHTML = `<span class="bottom-nav-plus" aria-hidden="true">➕</span>`;
  navCreateBtn.onclick = (event) => {
    event.preventDefault();
    event.stopPropagation();
    closeProfileModalIfAny();
    if (state.currentPage === 'news' && state.user && state.user.username === 'blau3') {
      const newsBox = document.getElementById('news-content');
      if (newsBox) {
        switchPage('news');
        requestAnimationFrame(() => {
          newsBox.focus();
          newsBox.scrollIntoView({ behavior: 'smooth', block: 'center' });
        });
      }
      return;
    }
    renderCreateMenu();
    setCreateMenuOpen(!isCreateMenuOpen);
  };
}

const navCreateMenu = document.getElementById('nav-create-menu');
if (navCreateMenu) {
  navCreateMenu.onclick = (event) => event.stopPropagation();
}

const treeAddCommunityBtn = document.getElementById('tree-add-community');
if (treeAddCommunityBtn) {
  treeAddCommunityBtn.onclick = () => createTreeCommunity();
}

const treeSubmitPostBtn = document.getElementById('tree-submit-post');
if (treeSubmitPostBtn) {
  treeSubmitPostBtn.onclick = () => submitTreePost();
}

const btnNewsPost = document.getElementById('btn-news-post');
if (btnNewsPost) {
  btnNewsPost.onclick = async () => {
    if (!state.token || !state.user || state.user.username !== 'blau3') {
      showAlert('Only blau3 can publish site news');
      return;
    }
    const textarea = document.getElementById('news-content');
    const content = textarea ? String(textarea.value || '').trim() : '';
    if (!content) {
      showAlert(t('siteNewsPlaceholder'));
      return;
    }
    try {
      const result = await api.post('/site-news', { content }, state.token);
      if (result && result.id) {
        if (textarea) textarea.value = '';
        await loadSiteNews();
        showAlert(t('siteNewsPublished'));
      } else {
        showAlert((result && result.error) || t('publishingError'));
      }
    } catch (err) {
      showAlert(err.message || t('publishingError'));
    }
  };
}

function closeProfileModalIfAny() {
  const m = document.querySelector('.modal-root.profile-fullpage');
  if (m) m.remove();
  state.nav.profileUserId = null;
  state.nav.postId = null;
  persistNavigationState();
  updateGlobalHomeButton();
}

function setCreateMenuOpen(open) {
  const menu = document.getElementById('nav-create-menu');
  const btn = document.getElementById('nav-create');
  if (!menu || !btn) return;
  isCreateMenuOpen = !!open;
  menu.classList.toggle('hidden', !open);
  btn.setAttribute('aria-expanded', open ? 'true' : 'false');
}

function renderCreateMenu() {
  const menu = document.getElementById('nav-create-menu');
  if (!menu) return;
  const items = [
    { label: t('createPersonalPost'), action: () => openPersonalPostComposer() },
    { label: t('createChannelPost'), action: () => openChannelPostComposer() },
    { label: t('createChannel'), action: () => createTreeCommunity() }
  ];

  menu.innerHTML = items.map((item, index) => `
    <button class="nav-create-option" type="button" data-create-menu-index="${index}" role="menuitem">${escapeHtml(item.label)}</button>
  `).join('');

  menu.querySelectorAll('[data-create-menu-index]').forEach(button => {
    button.onclick = () => {
      const item = items[Number(button.dataset.createMenuIndex)];
      setCreateMenuOpen(false);
      if (item && item.action) item.action();
    };
  });
}

function setBreadcrumb(items) {
  const el = document.getElementById('breadcrumb');
  if (!el) return;
  el.innerHTML = '';
  items.forEach((item, idx) => {
    if (idx > 0) {
      const sep = document.createElement('span');
      sep.textContent = '>';
      el.appendChild(sep);
    }
    if (item.onClick) {
      const a = document.createElement('a');
      a.href = '#';
      a.textContent = item.label;
      a.onclick = (e) => {
        e.preventDefault();
        item.onClick();
      };
      el.appendChild(a);
    } else {
      const span = document.createElement('span');
      span.textContent = item.label;
      el.appendChild(span);
    }
  });
}

function updateBreadcrumb() {
  const items = [];
  items.push({
    label: t('home'),
    onClick: () => {
      closeProfileModalIfAny();
      switchPage('feed');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  });

  if (state.nav.profileUserId) {
    items.push({
      label: t('profile'),
      onClick: () => {
        closeProfileModalIfAny();
        showProfile(Number(state.nav.profileUserId));
      }
    });
  } else if (state.currentPage === 'subscriptions') {
    // legacy page (may exist in old UI)
    items.push({ label: t('subscriptions') });
  } else if (state.currentPage === 'tree') {
    items.push({ label: t('tree') });
  } else if (state.currentPage === 'chats') {
    items.push({ label: t('messages') });
  } else if (state.currentPage === 'notifications') {
    items.push({ label: t('notifications') });
  } else if (state.currentPage === 'news') {
    items.push({ label: t('siteNews') });
  }

  if (state.nav.postId) {
    items.push({
      label: t('post'),
      onClick: () => {
        closeProfileModalIfAny();
        switchPage('feed');
        const target = document.getElementById(`post-${state.nav.postId}`);
        if (target) {
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }
    });
  }

  setBreadcrumb(items);
}

function updateGlobalHomeButton() {
  return;
}

restoreNavigationState();
bindViewportMetrics();
switchPage(state.currentPage);
applyStaticI18n();
renderAuth();
updateViewportMetrics();

// Initialize the app with proper content loading
(async () => {
  try {
    await loadPosts();
  } catch (err) {
    console.error('Error loading posts:', err);
    const postsEl = document.getElementById('posts');
    if (postsEl) {
      postsEl.innerHTML = `<div class="card" style="padding:24px;text-align:center"><div class="muted">${escapeHtml(state.lang === 'ru' ? 'Не удалось загрузить ленту.' : 'Failed to load the feed.')}</div></div>`;
    }
  } finally {
    hidePageLoader();
  }
})();

startAutoRefresh();
startPresenceHeartbeat();
startNotificationsPolling();
refreshNotificationsIndicator();

if (state.nav.profileUserId) {
  showProfile(Number(state.nav.profileUserId));
}

document.addEventListener('visibilitychange', () => {
  if (document.visibilityState === 'visible') sendPresenceHeartbeat();
});

window.addEventListener('focus', () => {
  sendPresenceHeartbeat();
});

const homeLinkEl = document.getElementById('home-link');
if (homeLinkEl) {
  homeLinkEl.onclick = (e) => {
    e.preventDefault();
    closeProfileModalIfAny();
    switchPage('feed');
  };
}
=======
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
>>>>>>> 43fc63577f740ec07265f99ac0d4769620c4ae8c
