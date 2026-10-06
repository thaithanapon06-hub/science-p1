import * as L from './logic.js';
import { CONFIG } from './firebase-config.js';
const $ = document.getElementById('app');
const MOCK = CONFIG.apiKey.startsWith('YOUR_');
let store, user, chapters = [], prog = {}, cur = null, t0 = 0, videoDone = false;

// ---- คำถามอยู่ใน questions.json (placeholder) ตัวเลือก 3 ข้อ/โจทย์ ----
let BANK = {}, MOCK_CH = [];
const mkCh = n => ({ id: `ch${n}`, order: n, title: `บทที่ ${n} (ตัวอย่าง)`, videoUrl: 'https://www.youtube.com/watch?v=M7lc1UVf-VE', preTestH5pId: '', mediaH5pId: '', postTestH5pId: '', practiceQuestionIds: [], passThreshold: 60 });
const pids = c => (c.practiceQuestionIds && c.practiceQuestionIds.length) ? c.practiceQuestionIds : (BANK[c.id]?.practice || []).map(q => q.id);

// ---- Store: โหมดจำลอง (localStorage) หรือ Firebase จริง ----
async function makeStore() {
  if (MOCK) {
    const k = 'mockProg'; let p = JSON.parse(localStorage.getItem(k) || '{}');
    return { login: async () => ({ uid: 'mock', displayName: 'ผู้เรียนทดลอง' }), logout: async () => {}, restore: async () => null,
      chapters: async () => MOCK_CH, progress: async () => p,
      save: async (u, id, patch) => { p[id] = { ...(p[id] || {}), ...patch }; localStorage.setItem(k, JSON.stringify(p)); } };
  }
  const V = '10.12.2', B = `https://www.gstatic.com/firebasejs/${V}/`;
  const [{ initializeApp }, A, F] = await Promise.all([import(B + 'firebase-app.js'), import(B + 'firebase-auth.js'), import(B + 'firebase-firestore.js')]);
  const app = initializeApp(CONFIG), auth = A.getAuth(app), db = F.getFirestore(app);
  return {
    login: async () => { const r = await A.signInWithPopup(auth, new A.GoogleAuthProvider()); const u = r.user;
      await F.setDoc(F.doc(db, 'users', u.uid), { displayName: u.displayName, email: u.email, createdAt: F.serverTimestamp() }, { merge: true }); return u; },
    logout: () => A.signOut(auth),
    restore: () => new Promise(res => { const off = A.onAuthStateChanged(auth, u => { off(); res(u); }); }),
    chapters: async () => (await F.getDocs(F.query(F.collection(db, 'chapters'), F.orderBy('order')))).docs.map(d => ({ id: d.id, ...d.data() })),
    progress: async u => Object.fromEntries((await F.getDocs(F.collection(db, 'progress', u, 'chapters'))).docs.map(d => [d.id, d.data()])),
    save: (u, id, patch) => F.setDoc(F.doc(db, 'progress', u, 'chapters', id), { ...patch, lastAccessedAt: F.serverTimestamp() }, { merge: true }),
  };
}
const P = id => prog[id] || {};
async function save(id, patch) { prog[id] = { ...P(id), ...patch }; await store.save(user.uid, id, patch); }

// ---- เวลาเรียน ----
async function flushTime() {
  if (!cur || !t0) return; const s = Math.round((Date.now() - t0) / 1000); t0 = Date.now();
  if (s > 0) await save(cur.id, { totalTimeSpentSeconds: (P(cur.id).totalTimeSpentSeconds || 0) + s });
}
document.addEventListener('visibilitychange', () => { if (document.hidden) flushTime(); else if (cur) t0 = Date.now(); });

// ---- หน้าจอ ----
const h = (html) => { $.innerHTML = html; window.scrollTo(0, 0); };
const btn = (id, label, dis) => `<button class="btn" id="${id}" ${dis ? 'disabled' : ''}>${label}</button>`;
const on = (id, fn) => document.getElementById(id)?.addEventListener('click', fn);

function login() {
  h(`<section class="hero"><div class="sun" aria-hidden="true"></div><h1>วิทยาศาสตร์ ป.1</h1><p>เรียนสนุก ทีละบท</p>
  ${btn('go', 'เข้าสู่ระบบด้วย Google')}${MOCK ? '<p class="note">โหมดจำลอง: ยังไม่ได้ตั้งค่า Firebase</p>' : ''}</section>`);
  on('go', async () => { try { user = await store.login(); await list(true); } catch (e) { alert('เข้าสู่ระบบไม่สำเร็จ: ' + e.message); } });
}
async function list(reload) {
  await flushTime(); cur = null;
  if (reload) { chapters = await store.chapters(); prog = await store.progress(user.uid); }
  h(`<header><h2>บทเรียน</h2><span>${user.displayName || ''} <a href="#" id="out">ออก</a></span></header><ul class="chs">${chapters.map(c => {
    const ok = L.isUnlocked(c, prog); return `<li><button class="ch ${ok ? '' : 'lock'}" data-id="${c.id}" ${ok ? '' : 'disabled aria-label="ล็อกอยู่"'}>
    <b>${ok ? (P(c.id).completed ? '✔' : c.order) : '🔒'}</b><span>${c.title}</span></button></li>`; }).join('')}</ul>`);
  document.querySelectorAll('.ch:not(.lock)').forEach(b => b.onclick = () => open(chapters.find(c => c.id === b.dataset.id)));
  on('out', async e => { e.preventDefault(); await store.logout(); user = null; login(); });
}
function open(c) { cur = c; t0 = Date.now(); videoDone = false; P(c.id).preTestScore === undefined ? quiz(c, 'pre') : media(); }

function form(qs, label, onSubmit, extra = '') {
  h(`<header><h2>${label}</h2><a href="#" id="back">← บทเรียน</a></header>${extra}${qs.map((q, i) => `<fieldset><legend>${i + 1}. ${q.text}</legend>
  ${q.opts.map((o, j) => `<label class="opt"><input type="radio" name="${q.id}" value="${j}"> ${o}</label>`).join('')}</fieldset>`).join('')}${btn('sub', 'ส่งคำตอบ', true)}`);
  const sub = document.getElementById('sub');
  $.addEventListener('change', () => { sub.disabled = qs.some(q => !$.querySelector(`input[name="${q.id}"]:checked`)); });
  on('back', e => { e.preventDefault(); list(); });
  sub.onclick = () => onSubmit(Object.fromEntries(qs.map(q => [q.id, +$.querySelector(`input[name="${q.id}"]:checked`).value])));
}
const bank = () => BANK[cur.id] || { pre: [], practice: [], post: [] }; // TODO: ของจริงมาจาก H5P

async function quiz(c, kind) {
  const qs = bank()[kind];
  if (kind === 'pre') return form(qs, 'ก่อนเรียน', async a => { const s = L.scoreOf(a, qs); await save(c.id, { preTestScore: s }); media(); }, '<p class="note">ทำให้สนุก ไม่มีผ่านหรือไม่ผ่านนะ</p>');
  form(qs, 'หลังเรียน', async a => {
    const s = L.scoreOf(a, qs), r = L.applyPost(P(c.id), s, c.passThreshold ?? L.PASS); await save(c.id, r.patch);
    if (r.passed) { const n = L.nextChapter(chapters, c); if (n) await save(n.id, { unlocked: true }); }
    else await save(c.id, { practiceStatus: {}, practiceCompleted: false }); // ให้ทบทวนใหม่ตาม 3.4
    result(s, r.passed);
  });
}
function result(s, ok) {
  h(`<section class="hero"><h1>${s}%</h1><p>${ok ? 'ผ่านแล้ว! ปลดล็อกบทถัดไป' : 'ยังไม่ถึง 60% กลับไปเรียนอีกรอบนะ'}</p>${btn('nx', ok ? 'กลับหน้าบทเรียน' : 'กลับไปดูสื่อการสอน')}</section>`);
  on('nx', () => { if (ok) list(); else { videoDone = false; media(); } });
}
function ytId(u) { return (u.match(/(?:v=|youtu\.be\/|embed\/)([\w-]{11})/) || [])[1]; }
function media() {
  const c = cur, id = ytId(c.videoUrl || '');
  h(`<header><h2>${c.title}</h2><a href="#" id="back">← บทเรียน</a></header>
  <div class="vid">${id ? `<div id="yt"></div>` : '<p class="note">ยังไม่มีวิดีโอ</p>'}</div>
  <div class="h5p">[พื้นที่ฝังกิจกรรม H5P: ${c.mediaH5pId || 'ยังไม่ได้ฝัง'}]</div>
  ${btn('pr', 'ไปทำแบบฝึกหัด', true)}${MOCK ? '<p><a href="#" id="skip">(ทดสอบ) ข้ามการดูวิดีโอ</a></p>' : ''}`);
  const unlockBtn = () => { videoDone = true; document.getElementById('pr').disabled = false; };
  on('back', e => { e.preventDefault(); list(); }); on('pr', practice);
  on('skip', e => { e.preventDefault(); unlockBtn(); });
  if (videoDone) unlockBtn();
  if (id) { const mk = () => new YT.Player('yt', { videoId: id, width: '100%', events: { onStateChange: e => { if (e.data === 0) unlockBtn(); } } });
    if (window.YT?.Player) mk(); else { window.onYouTubeIframeAPIReady = mk; const s = document.createElement('script'); s.src = 'https://www.youtube.com/iframe_api'; document.head.append(s); } }
}
let queue = [];
function practice() {
  const c = cur, qs = bank().practice, status = { ...(P(c.id).practiceStatus || {}) };
  queue = L.remaining(pids(c), status);
  const step = async () => {
    if (!queue.length) { await save(c.id, { practiceCompleted: L.practiceDone(pids(c), P(c.id).practiceStatus || {}) }); return quiz(c, 'post'); }
    const q = qs.find(x => x.id === queue[0]);
    h(`<header><h2>ทบทวน</h2><span>เหลือ ${queue.length} ข้อ</span></header><fieldset><legend>${q.text}</legend>${q.opts.map((o, j) => `<button class="btn alt" data-j="${j}">${o}</button>`).join('')}</fieldset><p id="fb" role="status"></p>`);
    $.querySelectorAll('[data-j]').forEach(b => b.onclick = async () => {
      const ok = +b.dataset.j === q.correct; $.querySelectorAll('[data-j]').forEach(x => x.disabled = true);
      status[q.id] = ok; await save(c.id, { practiceStatus: { ...status } });
      queue.shift(); if (!ok) queue.push(q.id); // ข้อผิดวนกลับมาใหม่ ข้อถูกไม่แสดงซ้ำ
      document.getElementById('fb').innerHTML = `${ok ? '✔ ถูกต้อง' : '✘ ยังไม่ถูก เดี๋ยวมาลองใหม่'} ${btn('nq', 'ต่อไป')}`; on('nq', step);
    });
  }; step();
}

(async () => { BANK = await (await fetch('questions.json')).json(); MOCK_CH = Object.keys(BANK).map((_, i) => mkCh(i + 1)); store = await makeStore(); user = await store.restore(); if (user) await list(true); else login();
  if ('serviceWorker' in navigator) navigator.serviceWorker.register('sw.js'); })();
