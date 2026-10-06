export const PASS = 60;
export const scoreOf = (ans, qs) => Math.round(100 * qs.filter(q => ans[q.id] === q.correct).length / qs.length);
export const remaining = (ids, status) => ids.filter(i => status[i] !== true);
export const practiceDone = (ids, status) => ids.length > 0 && ids.every(i => status[i] === true);
export function applyPost(p, s, th = PASS) {
  const passed = s >= th;
  return { passed, patch: { postTestLastScore: s, postTestBestScore: Math.max(p.postTestBestScore || 0, s),
    postTestAttempts: (p.postTestAttempts || 0) + 1, completed: !!p.completed || passed } };
}
export const isUnlocked = (ch, prog) => ch.order === 1 || !!(prog[ch.id] && prog[ch.id].unlocked);
export const nextChapter = (chs, ch) => chs.find(c => c.order === ch.order + 1);
