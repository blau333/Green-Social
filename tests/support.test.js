const fs = require('fs');
const path = require('path');

const appJsPath = path.join(__dirname, '..', 'public', 'app.js');
const appJs = fs.readFileSync(appJsPath, 'utf8');

const supportKeys = [
  'support',
  'supportTitle',
  'supportOption1',
  'supportOption2',
  'supportOption3',
  'supportOption4',
  'supportNotified',
  'supportScammerPlaceholder',
  'supportSubmit'
];

const enRuPairs = [
  ['Support', 'Поддержка'],
  ['What happened to you?', 'Что у вас случилось?'],
  ['My account was hacked', 'Мой аккаунт взломали'],
  ["I can't log into my account", 'Не могу войти в свой аккаунт'],
  ['Request verification', 'Запросить верификацию'],
  ['Scammer', 'Мошенник'],
  ['We have notified the site owner.', 'Мы сообщили владельцу сайта.'],
  ['Link to scammer profile', 'Ссылка на профиль мошенника'],
  ['Send report', 'Отправить жалобу']
];

function testI18nKeys() {
  let failed = 0;
  for (const key of supportKeys) {
    if (!appJs.includes("'" + key + "'") && !appJs.includes('"' + key + '"')) {
      console.error('Missing i18n key:', key);
      failed++;
    }
  }
  if (failed > 0) {
    throw new Error(`${failed} i18n key(s) missing`);
  }
  console.log('OK i18n: all support keys present');
}

function testEnRuTranslations() {
  let failed = 0;
  for (const [en, ru] of enRuPairs) {
    if (!appJs.includes(en) || !appJs.includes(ru)) {
      console.error('Missing translation pair:', en, '/', ru);
      failed++;
    }
  }
  if (failed > 0) {
    throw new Error(`${failed} translation(s) missing`);
  }
  console.log('OK i18n: English and Russian support strings present');
}

function testCreatedByTranslation() {
  if (!appJs.includes("createdBy") || !appJs.includes('Created by') || !appJs.includes('Создано')) {
    throw new Error('createdBy translation missing');
  }
  console.log('OK: createdBy (Created by / Создано) present');
}

async function testSupportApi() {
  const port = process.env.PORT || 3000;
  const base = `http://127.0.0.1:${port}`;
  try {
    const r = await fetch(`${base}/api/support`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type: 1 })
    });
    if (!r.ok) {
      throw new Error(`POST /api/support returned ${r.status}`);
    }
    const data = await r.json();
    if (!data.success) {
      throw new Error('Response missing success: true');
    }
    console.log('OK API: POST /api/support type=1 returns 200 and { success: true }');
  } catch (e) {
    if (e.cause && e.cause.code === 'ECONNREFUSED') {
      console.log('Skip API test: server not running on port', port);
      return;
    }
    throw e;
  }
}

async function testSupportApiType4() {
  const port = process.env.PORT || 3000;
  const base = `http://127.0.0.1:${port}`;
  try {
    const r = await fetch(`${base}/api/support`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type: 4, scammerLink: 'https://example.com/scammer' })
    });
    if (!r.ok) {
      throw new Error(`POST /api/support type=4 returned ${r.status}`);
    }
    const data = await r.json();
    if (!data.success) {
      throw new Error('Response missing success: true');
    }
    console.log('OK API: POST /api/support type=4 with scammerLink returns 200');
  } catch (e) {
    if (e.cause && e.cause.code === 'ECONNREFUSED') {
      console.log('Skip API test (type=4): server not running');
      return;
    }
    throw e;
  }
}

async function run() {
  testI18nKeys();
  testEnRuTranslations();
  testCreatedByTranslation();
  await testSupportApi();
  await testSupportApiType4();
  console.log('All support tests passed.');
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
