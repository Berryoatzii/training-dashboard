const readKey = 'oat-km-iris-read-v1';
function restore(key) {
  try { return localStorage.getItem(key); } catch { return null; }
}
function save(key, value) {
  try { localStorage.setItem(key, value); return true; } catch { return false; }
}
let finished;
try { finished = new Set(JSON.parse(restore(readKey) || '[]')); } catch { finished = new Set(); }
const chapterButtons = [...document.querySelectorAll('[data-read]')];
function updateProgress() {
  let count = 0;
  for (const button of chapterButtons) {
    const active = finished.has(button.dataset.read);
    button.setAttribute('aria-pressed', String(active));
    button.textContent = active ? 'ทบทวนแล้ว ✓' : 'ทำเครื่องหมายว่าทบทวนแล้ว';
    if (active) count++;
  }
  document.querySelector('#completed').value = count;
  document.querySelector('#read-count').textContent = count + ' จาก ' + chapterButtons.length + ' บท';
}
for (const button of chapterButtons) {
  button.hidden = false;
  button.addEventListener('click', () => {
    const key = button.dataset.read;
    if (finished.has(key)) finished.delete(key); else finished.add(key);
    updateProgress();
    if (!save(readKey, JSON.stringify([...finished]))) document.querySelector('#save-status').textContent = 'เบราว์เซอร์นี้เก็บความคืบหน้าข้ามการเปิดหน้าไม่ได้';
  });
}
updateProgress();
document.querySelector('#learning-progress').hidden = false;

const line = document.querySelector('.progressline i');
function scrollProgress() {
  const distance = document.documentElement.scrollHeight - window.innerHeight;
  const fraction = distance > 0 ? Math.min(1, window.scrollY / distance) : 0;
  line.style.transform = 'scaleX(' + fraction + ')';
}
window.addEventListener('scroll', scrollProgress, {passive:true});
window.addEventListener('resize', scrollProgress);
scrollProgress();

const share = document.querySelector('#copy-story');
share.hidden = false;
share.addEventListener('click', async () => {
  const status = document.querySelector('#share-status');
  try {
    await navigator.clipboard.writeText(location.href.split('#')[0]);
    status.textContent = 'คัดลอกลิงก์แล้ว';
  } catch {
    status.textContent = 'คัดลอก URL จากแถบที่อยู่เพื่อส่งต่อเรื่องนี้';
  }
});

const note = document.querySelector('#reflection');
note.value = restore('oat-km-iris-reflection-v1') || '';
document.querySelector('#note-area').hidden = false;
document.querySelector('#save-note').addEventListener('click', () => {
  document.querySelector('#note-status').textContent = save('oat-km-iris-reflection-v1', note.value)
    ? 'บันทึกในเบราว์เซอร์นี้แล้ว'
    : 'เบราว์เซอร์นี้บันทึกไม่ได้ คัดลอกข้อความเก็บไว้ได้';
});
